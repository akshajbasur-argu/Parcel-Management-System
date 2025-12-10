package com.example.Parcel.Management.System.imageProcessing.service;

import jakarta.annotation.PostConstruct;
import net.coobird.thumbnailator.Thumbnails;
import org.apache.commons.imaging.Imaging;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.*;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
public class InvoiceOcrService {

    private Path baseDir;
    private Path tesseractExecutable;
    private Path tessdataDir;
    private Path libDir;

    @Autowired
    private InvoiceNameExtractor invoiceNameExtractor;

    // ---------------------------------------------------------------------
    // Init: extract binary, libs, tessdata from JAR to user home
    // ---------------------------------------------------------------------
    @PostConstruct
    public void init() throws IOException {
        String userHome = System.getProperty("user.home");
        this.baseDir = Paths.get(userHome, ".embedded-tesseract");
        Files.createDirectories(baseDir);

        this.tesseractExecutable = extractTesseractBinary("/tesseract/bin/tesseract");
        this.libDir = extractLibs("/tesseract/lib");
        this.tessdataDir = extractTessdata("/tesseract/tessdata");

    }

    private Path extractTesseractBinary(String resourcePath) throws IOException {
        Path dest = baseDir.resolve("tesseract");

        try (InputStream in = getClass().getResourceAsStream(resourcePath)) {
            if (in == null) {
                throw new FileNotFoundException("Tesseract binary resource not found: " + resourcePath);
            }
            Files.copy(in, dest, StandardCopyOption.REPLACE_EXISTING);
        }

        dest.toFile().setExecutable(true, true);
        try {
            Set<PosixFilePermission> perms = PosixFilePermissions.fromString("rwxr-xr-x");
            Files.setPosixFilePermissions(dest, perms);
        } catch (UnsupportedOperationException ignore) {
            // Non-POSIX (e.g. Windows) – ignore
        }
        return dest;
    }

    /**
     * Extract all needed .so files from /tesseract/lib in resources.
     * For simplicity we list them manually in a map.
     */
    private Path extractLibs(String resourceBasePath) throws IOException {
        Path libDir = baseDir.resolve("lib");
        Files.createDirectories(libDir);

        Map<String, String> libs = new HashMap<>();
        libs.put(resourceBasePath + "/libtesseract.so.5", "libtesseract.so.5");
        libs.put(resourceBasePath + "/liblept.so.5", "liblept.so.5");
        libs.put(resourceBasePath + "/libjpeg.so.9", "libjpeg.so.9");
        libs.put(resourceBasePath + "/libtiff.so.5", "libtiff.so.5");

        // add more if needed later

        for (Map.Entry<String, String> entry : libs.entrySet()) {
            String resPath = entry.getKey();
            Path target = libDir.resolve(entry.getValue());
            try (InputStream in = getClass().getResourceAsStream(resPath)) {
                if (in == null) {
                    throw new FileNotFoundException("Library resource not found: " + resPath);
                }
                Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
            }
        }

        return libDir;
    }

    private Path extractTessdata(String resourceBasePath) throws IOException {
        Path tessDir = baseDir.resolve("tessdata");
        Files.createDirectories(tessDir);

        // At minimum, ENG:
        copyResource(resourceBasePath + "/eng.traineddata",
                tessDir.resolve("eng.traineddata"));

        // If you have more languages, add here:
        // copyResource(resourceBasePath + "/hin.traineddata",
        //              tessDir.resolve("hin.traineddata"));

        return tessDir;
    }

    private void copyResource(String resourcePath, Path target) throws IOException {
        try (InputStream in = getClass().getResourceAsStream(resourcePath)) {
            if (in == null) {
                throw new FileNotFoundException("Resource not found: " + resourcePath);
            }
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        }
    }

    // ---------------------------------------------------------------------
    // Image preprocessing
    // ---------------------------------------------------------------------
    private File preprocessImage(File inputImage) throws Exception {
        BufferedImage original = Imaging.getBufferedImage(inputImage);

        // 1. Grayscale
        BufferedImage gray = new BufferedImage(
                original.getWidth(),
                original.getHeight(),
                BufferedImage.TYPE_BYTE_GRAY
        );
        Graphics g = gray.getGraphics();
        g.drawImage(original, 0, 0, null);
        g.dispose();

        // 2. Resize
        BufferedImage resized = Thumbnails.of(gray)
                .scale(2.0)   // x2 for clarity
                .asBufferedImage();

        // 3. Threshold
        BufferedImage threshold = new BufferedImage(
                resized.getWidth(),
                resized.getHeight(),
                BufferedImage.TYPE_BYTE_GRAY
        );

        for (int y = 0; y < resized.getHeight(); y++) {
            for (int x = 0; x < resized.getWidth(); x++) {
                int rgb = resized.getRGB(x, y);
                int r = rgb & 0xFF;
                int value = (r < 140) ? 0 : 255;
                int newRgb = (value << 16) | (value << 8) | value;
                threshold.setRGB(x, y, newRgb);
            }
        }

        File cleaned = File.createTempFile("cleaned_ocr", ".png");
        ImageIO.write(threshold, "png", cleaned);
        cleaned.deleteOnExit();
        return cleaned;
    }

    // ---------------------------------------------------------------------
    // OCR using embedded Tesseract + libs
    // ---------------------------------------------------------------------
    public String extractText(File image) throws Exception {
        // 1. Preprocess
        File cleanedImage = image;

        // 2. Temp output base (Tesseract appends .txt)
        File tempOutput = File.createTempFile("ocr_output", ".txt");
        tempOutput.deleteOnExit();
        String outputBase = tempOutput.getAbsolutePath().replace(".txt", "");

        // 3. Build command
        ProcessBuilder pb = new ProcessBuilder(
                tesseractExecutable.toString(),
                cleanedImage.getAbsolutePath(),
                outputBase,
                "--tessdata-dir", tessdataDir.toString(),
                "-l", "eng"
        );

        // Environment
        Map<String, String> env = pb.environment();
        env.put("TESSDATA_PREFIX", baseDir.toString());

        // Critical: make loader see our embedded libs
        String existingLd = env.getOrDefault("LD_LIBRARY_PATH", "");
        String newLd = libDir.toString() +
                (existingLd.isEmpty() ? "" : File.pathSeparator + existingLd);
        env.put("LD_LIBRARY_PATH", newLd);

        pb.redirectErrorStream(true);
        Process process = pb.start();

        String terminalOutput;
        try (InputStream is = process.getInputStream()) {
            terminalOutput = new String(is.readAllBytes());
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new RuntimeException(
                    "Tesseract error (exit code " + exitCode + "): " + terminalOutput
            );
        }

        String ocrText = Files.readString(tempOutput.toPath());
        return invoiceNameExtractor.extractCustomerName(ocrText);
    }
}