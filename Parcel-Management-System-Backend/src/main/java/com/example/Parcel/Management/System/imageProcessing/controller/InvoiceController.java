package com.example.Parcel.Management.System.imageProcessing.controller;

import com.example.Parcel.Management.System.imageProcessing.service.FetchNameFromDBService;
import com.example.Parcel.Management.System.imageProcessing.service.InvoiceOcrService;
import com.example.Parcel.Management.System.imageProcessing.service.NameMatcherService;
import com.example.Parcel.Management.System.service.impl.ReceptionistServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;

@CrossOrigin(origins = {"http://localhost:4200","https://sjkqbbn5-4200.inc1.devtunnels.ms"})
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/invoice")
public class InvoiceController {

    private final InvoiceOcrService invoiceOcrService;
    private final FetchNameFromDBService dbService;
    private final NameMatcherService nameMatcherService;
    private final ReceptionistServiceImpl receptionistService;

    @PostMapping(value = "/extract", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<NameMatcherService.MatchResult>> extractName(@RequestParam("file") MultipartFile file) throws Exception {


        File temp = File.createTempFile("invoice", ".png");
        file.transferTo(temp);

        System.out.println("inside controller");
        String text = invoiceOcrService.extractText(temp);
        System.out.println(nameMatcherService.buildCandidatesFromOcr(text));
        List<NameMatcherService.MatchResult> names= nameMatcherService
                .findTopMatches(text,dbService.dbNames(),5,0.75);
        System.out.println(names);
        if(names.size()==1)
            sendEmail(names.stream().map(name -> name.name).toList());
        return new ResponseEntity<>(names, HttpStatus.OK);
    }

    @PostMapping("sendMail")
    public ResponseEntity<String> sendEmail(@RequestBody List<String> selectedNames){
        System.out.println("inside send parcel");
        selectedNames.forEach(name-> receptionistService.createParcel(receptionistService.createRequestParcelDto(name))) ;
        return new ResponseEntity<>("Success",HttpStatus.OK);
    }
}
