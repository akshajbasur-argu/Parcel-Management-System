package com.example.Parcel.Management.System.imageProcessing.dto;

import com.example.Parcel.Management.System.imageProcessing.service.NameMatcherService;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ExtractedNamesResponseDto {
    private List<NameMatcherService.MatchResult> names;
    private String barcodeString;

}
