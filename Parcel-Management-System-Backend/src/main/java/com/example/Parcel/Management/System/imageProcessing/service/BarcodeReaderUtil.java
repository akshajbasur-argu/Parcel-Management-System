package com.example.Parcel.Management.System.imageProcessing.service;

import com.google.zxing.*;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.common.HybridBinarizer;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.HashMap;
import java.util.Map;

@Service
public class BarcodeReaderUtil {

    public String readBarcode(File file) {
        try {
            BufferedImage image = ImageIO.read(file);

            if (image == null) {
                return "Invalid image";
            }

            // ✅ Step 1: Convert Image to ZXing format
            LuminanceSource source = new BufferedImageLuminanceSource(image);
            BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));

            // ✅ Step 2: ADD HINTS HERE
            Map<DecodeHintType, Object> hints = new HashMap<>();
            hints.put(DecodeHintType.TRY_HARDER, true);

            // ✅ Step 3: Decode using hints
            Result result = new MultiFormatReader().decode(bitmap, hints);

            return result.getText(); // ✅ Final barcode value

        } catch (NotFoundException e) {
            return "No barcode found in image";
        } catch (Exception e) {
            return "Error reading barcode: " + e.getMessage();
        }
    }
}
