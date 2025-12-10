package com.example.Parcel.Management.System.imageProcessing.service;


import org.springframework.stereotype.Component;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class InvoiceNameExtractor {

    private static final Pattern TRIGGER_PATTERN = Pattern.compile(
            "(?i)(ship\\s*t[o]?|ship\\s*to|deliver\\s*to|customer\\s*name|name|billing\\s*address)[:\\s]*"
    );

    private static final Pattern STOP_PATTERN = Pattern.compile("(?i)(A-?66|Argusoft|Gandhinagar)");

    public String extractCustomerName(String text) {

        Matcher trigger = TRIGGER_PATTERN.matcher(text);

        if (trigger.find()) {

            int startIdx = trigger.end();
            int endIdx = Math.min(startIdx + 30, text.length());

            String slice = text.substring(startIdx, endIdx);

            // Stop early on keywords
            Matcher stop = STOP_PATTERN.matcher(slice);
            if (stop.find()) {
                slice = slice.substring(0, stop.start());
            }

            return clean(slice);
        }

        // ------------------------------------------------------
        // CASE 2 — No trigger → extract 20 chars BEFORE stop keyword
        // ------------------------------------------------------
        Matcher stop = STOP_PATTERN.matcher(text);

        if (stop.find()) {
            int stopIndex = stop.start();
            int startIdx = Math.max(0, stopIndex - 40);  // 20 chars before keyword

            String slice = text.substring(startIdx, stopIndex);

            return clean(slice);
        }

        return null; // nothing usable found
    }

    private String clean(String s) {
        s = s.replaceAll("[^A-Za-z ]", " "); // cleanup
        s = s.replaceAll("\\s+", " ");       // normalize spaces
        return s.trim().isEmpty() ? null : s.trim();
    }

}
