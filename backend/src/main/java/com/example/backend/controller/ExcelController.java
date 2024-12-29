package com.example.backend.controller;

import com.example.backend.service.ExcelService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/excel")
public class ExcelController {

    @Autowired
    private ExcelService excelService;

    public ExcelController() {
        System.out.println("ExcelController chargé !");
    }

    @GetMapping("/data")
    public List<Map<String, String>> getExcelData() {
        System.out.println("Endpoint /api/excel/data appelé");
        return excelService.readExcelFile();
    }
}
