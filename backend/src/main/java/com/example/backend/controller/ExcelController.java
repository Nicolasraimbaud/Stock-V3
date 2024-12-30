package com.example.backend.controller;

import com.example.backend.model.Wine;
import com.example.backend.service.ExcelService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/excel")
@CrossOrigin(origins = "http://localhost:4200")
public class ExcelController {

    @Autowired
    private ExcelService excelService;

    public ExcelController() {
        System.out.println("ExcelController chargé !");
    }

    @GetMapping("/read")
    public List<Map<String, String>> getExcelData() {
        System.out.println("Endpoint /api/excel/data appelé");
        return excelService.readExcelFile();
    }

    @GetMapping("/import")
    public List<Wine> importExcelData() {
        System.out.println("Importing Excel data to database");
        return excelService.processExcelAndSaveToDb();
    }

    /*We export the data from add component to the excel file */
    @PostMapping("/export")
    public ResponseEntity<String> exportToExcel(@RequestBody Wine newWine) {
        try {
            excelService.updateExcelFile(newWine);
            return ResponseEntity.ok("Excel file updated successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Failed to update Excel: " + e.getMessage());
        }
    }
}
