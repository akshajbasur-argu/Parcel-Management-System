package com.example.Parcel.Management.System.imageProcessing.config;

import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;

public class TesseractLoader {

    private static String extractedTesseractPath;

    public static String loadTesseract() throws Exception {
        if (extractedTesseractPath != null) return extractedTesseractPath;

        InputStream in = TesseractLoader.class.getResourceAsStream("/tesseract/bin/tesseract");
        File tempBinary = File.createTempFile("tess", null);
        Files.copy(in, tempBinary.toPath(), StandardCopyOption.REPLACE_EXISTING);
        tempBinary.setExecutable(true);

        extractedTesseractPath = tempBinary.getAbsolutePath();
        return extractedTesseractPath;
    }
}
