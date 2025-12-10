package com.example.Parcel.Management.System.imageProcessing.controller;

import com.example.Parcel.Management.System.imageProcessing.dto.ExtractedNamesResponseDto;
import com.example.Parcel.Management.System.imageProcessing.service.BarcodeReaderUtil;
import com.example.Parcel.Management.System.imageProcessing.service.FetchNameFromDBService;
import com.example.Parcel.Management.System.imageProcessing.service.InvoiceOcrService;
import com.example.Parcel.Management.System.imageProcessing.service.NameMatcherService;
import com.example.Parcel.Management.System.service.impl.ReceptionistServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;

@CrossOrigin(origins = {"http://localhost:4200/","https://sjkqbbn5-4200.inc1.devtunnels.ms/"})
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/invoice")
public class InvoiceController {

    private final InvoiceOcrService invoiceOcrService;
    private final FetchNameFromDBService dbService;
    private final NameMatcherService nameMatcherService;
    private final ReceptionistServiceImpl receptionistService;
    private final BarcodeReaderUtil barcodeReaderUtil;


    @GetMapping("")
    public ResponseEntity<String> testing(){
        return new ResponseEntity<>("Its working", HttpStatus.OK);
    }


    @PostMapping(value = "/extract", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ExtractedNamesResponseDto> extractName(@RequestParam("file") MultipartFile file) throws Exception {


        File temp = File.createTempFile("invoice", ".png");
        file.transferTo(temp);

        String barcodeString =barcodeReaderUtil.readBarcode(temp);
        String text = invoiceOcrService.extractText(temp);
        List<NameMatcherService.MatchResult> names= nameMatcherService
                .findTopMatches(text,dbService.dbNames(),5,0.75);
        if(names.size()==1)
            sendEmail(names.stream().map(name -> name.name).toList(),barcodeString);

        ExtractedNamesResponseDto namesResponseDto= new ExtractedNamesResponseDto(names,barcodeString);
        return new ResponseEntity<>(namesResponseDto, HttpStatus.OK);
    }

    @PostMapping("sendMail")
    public ResponseEntity<String> sendEmail(@RequestBody List<String> selectedNames,
                                            @RequestParam String barcodeString){
        selectedNames.forEach(name-> receptionistService.createParcel(receptionistService.createRequestParcelDto(name,barcodeString))) ;
        return ResponseEntity.ok("Success");
    }

    @PostMapping(value = "/extract/employee", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Boolean> parcelStatusChangeRequest(@RequestParam("file") MultipartFile file)throws Exception {

        File temp = File.createTempFile("invoice_from_employee", ".png");
        file.transferTo(temp);
        String barcodeString =barcodeReaderUtil.readBarcode(temp);
//        String text = invoiceOcrService.extractText(temp);
        /// this will not be used, i will get user details from auth Util
///       List<NameMatcherService.MatchResult> names= nameMatcherService
///               .findTopMatches(text,dbService.dbNames(),5,0.75);


        return new ResponseEntity<>(receptionistService.findByMailAndShortCode(barcodeString)
                ,HttpStatus.OK);

    }
}
