package com.example.Parcel.Management.System.imageProcessing.service;

import net.coobird.thumbnailator.Thumbnails;
import org.apache.commons.imaging.Imaging;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;

@Service
public class InvoiceOcrService {

//    private final Tesseract tesseract;
//
//    public InvoiceOcrService() {
//        tesseract = new Tesseract();
//        tesseract.setDatapath("src/main/resources/tessdata");
//        tesseract.setLanguage("eng");
//    }
//
//    public String extractText(File file) {
//        System.out.println("inside s1");
//        try {
//            System.out.println("inside s2");
//            return tesseract.doOCR(file);
//        } catch (TesseractException e) {
//            throw new RuntimeException("OCR failed: " + e.getMessage(), e);
//        }
//    }
private static final String TESSERACT_PATH = "/home/akshajb@id.argusoft.com/miniconda3/bin/tesseract";

@Autowired
private  InvoiceNameExtractor invoiceNameExtractor;
    private File preprocessImage(File inputImage) throws Exception {

        BufferedImage original = Imaging.getBufferedImage(inputImage);

        // 1. Convert to grayscale
        BufferedImage gray = new BufferedImage(
                original.getWidth(),
                original.getHeight(),
                BufferedImage.TYPE_BYTE_GRAY
        );
        Graphics g = gray.getGraphics();
        g.drawImage(original, 0, 0, null);
        g.dispose();

        // 2. Resize (Tesseract works best around 300 DPI)
        BufferedImage resized = Thumbnails.of(gray)
                .scale(2.0)           // upscale ×2 for clarity
                .asBufferedImage();

        // 3. Apply binary threshold (simple but effective)
        BufferedImage threshold = new BufferedImage(
                resized.getWidth(),
                resized.getHeight(),
                BufferedImage.TYPE_BYTE_GRAY
        );

        for (int y = 0; y < resized.getHeight(); y++) {
            for (int x = 0; x < resized.getWidth(); x++) {
                int rgb = resized.getRGB(x, y);
                int r = rgb & 0xFF;
                int value = (r < 140) ? 0 : 255; // strong contrast threshold
                int newRgb = (value << 16) | (value << 8) | value;
                threshold.setRGB(x, y, newRgb);
            }
        }

        // 4. Save preprocessed file
        File cleaned = File.createTempFile("cleaned_ocr", ".png");
        ImageIO.write(threshold, "png", cleaned);

        return cleaned;
    }


    public String extractText(File image) throws Exception {

        // 1. Preprocess Image

        File cleanedImage = image;
        File debugFile = new File("/tmp/cleaned_debug.jpg");
        Files.copy(cleanedImage.toPath(), debugFile.toPath(), StandardCopyOption.REPLACE_EXISTING);

        System.out.println("DEBUG CLEANED IMAGE SAVED AT: " + debugFile.getAbsolutePath());

        // 2. Prepare output file
        File tempOutput = File.createTempFile("ocr_output", ".txt");

        // 3. Run Tesseract CLI
        ProcessBuilder pb = new ProcessBuilder(
                TESSERACT_PATH,
                cleanedImage.getAbsolutePath(),
                tempOutput.getAbsolutePath().replace(".txt", "")
        );

        pb.redirectErrorStream(true);
        Process process = pb.start();

        String terminalOutput = new String(process.getInputStream().readAllBytes());
        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new RuntimeException("Tesseract error: " + terminalOutput);
        }


        String ocrText = Files.readString(tempOutput.toPath());
        System.out.println(ocrText+"TEXT");
        // 4. Extract the customer name using your fuzzy logic
        return invoiceNameExtractor.extractCustomerName(ocrText);
    }

}

