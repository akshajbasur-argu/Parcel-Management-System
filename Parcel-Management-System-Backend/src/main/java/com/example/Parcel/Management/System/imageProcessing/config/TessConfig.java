package com.example.Parcel.Management.System.imageProcessing.config;

import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import org.springframework.context.annotation.Bean;

public class TessConfig {
    @Bean
    public ITesseract tesseract() {
        Tesseract t = new Tesseract();


        // Path to tessdata directory containing eng.traineddata
        t.setDatapath("/home/akshajb@id.argusoft.com/miniconda3/share/tessdata");

        t.setLanguage("eng");

        return t;
    }

}
