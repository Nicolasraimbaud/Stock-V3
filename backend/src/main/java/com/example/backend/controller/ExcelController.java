package com.example.backend.controller;

import com.example.backend.model.Wine;
import com.example.backend.service.ExcelService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/excel")
@CrossOrigin(origins = "http://localhost:4200", methods = {RequestMethod.GET, RequestMethod.POST})
public class ExcelController {

    @Autowired
    private ExcelService excelService;

    public ExcelController() {
        System.out.println("ExcelController chargé !");
    }

    @GetMapping("/read")
    public ResponseEntity<List<Map<String, String>>> getExcelData() {
        try {
            System.out.println("GET /api/excel/read called");
            List<Map<String, String>> data = excelService.readExcelFile();
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            System.err.println("Error reading excel file: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/import")
    public ResponseEntity<List<Wine>> importExcelData() {
        try {
            System.out.println("GET /api/excel/import called");
            List<Map<String, String>> excelData = excelService.readExcelFile();
            System.out.println("Excel data read: " + excelData);
            List<Wine> wines = excelService.processExcelAndSaveToDb();
            System.out.println("Imported wines: " + wines);
            return ResponseEntity.ok(wines);
        } catch (Exception e) {
            System.err.println("Error importing excel data: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /*We export the data from add component to the excel file */
    @PostMapping("/export")
    public ResponseEntity<String> exportToExcel(@RequestBody Wine newWine) {
        try {
            System.out.println("POST /api/excel/export called");
            excelService.updateExcelFile(newWine);
            return ResponseEntity.ok("Wine exported successfully");
        } catch (Exception e) {
            System.err.println("Error exporting wine: " + e.getMessage());
            return ResponseEntity.internalServerError()
                    .body("Failed to export wine: " + e.getMessage());
        }
    }
}