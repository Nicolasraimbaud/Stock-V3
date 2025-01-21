package com.example.backend.service;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.example.backend.model.Wine;
import com.example.backend.repository.WineRepository;

import org.slf4j.Logger;

import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class ExcelService {

    private final WineRepository wineRepository;
    private final WineService wineService;

    private static final Logger logger = LoggerFactory.getLogger(ExcelService.class);

    @Autowired
    public ExcelService(WineRepository wineRepository, WineService wineService) {
        this.wineRepository = wineRepository;
        this.wineService = wineService;
    }

    public List<Wine> processExcelAndSaveToDb() {
        List<Wine> savedWines = new ArrayList<>();
        List<Map<String, String>> excelData = readExcelFile();
        Set<Wine> winesToKeep = new HashSet<>();
    
        for (Map<String, String> row : excelData) {
            try {
                // Récupération et validation des données
                String appellation = row.get("Appellation");
                String domaine = row.get("Domaine");
                String cuvee = row.get("Cuvee");
                String millesimeStr = row.get("Millesime");

                if (appellation == null || domaine == null || cuvee == null || millesimeStr == null) {
                    logger.error("Missing required fields in row: {}", row);
                    continue;
                }

                // Recherche ou création d'un vin
                Integer millesime = Integer.parseInt(millesimeStr.trim());
                Wine wine = wineService
                    .getAllWinesSorted()
                    .stream()
                    .filter(w -> w.getAppellation().equals(appellation) &&
                                 w.getDomaine().equals(domaine) &&
                                 w.getCuvee().equals(cuvee) &&
                                 w.getMillesime().equals(millesime))
                    .findFirst()
                    .orElse(new Wine());

                // Mise à jour des champs et sauvegarde
                wine.setAppellation(appellation);
                wine.setDomaine(domaine);
                wine.setCuvee(cuvee);
                wine.setMillesime(millesime);
                savedWines.add(wineService.saveWine(wine));
                winesToKeep.add(wine);
            } catch (Exception e) {
                logger.error("Error processing wine from row: {}", row, e);
            }
        }
    
        // Suppression des vins non présents dans Excel
        wineService.getAllWinesSorted()
            .stream()
            .filter(wine -> !winesToKeep.contains(wine))
            .forEach(wine -> {
                wineService.deleteWine(wine);
                logger.info("Deleted wine: {} - {} - {} ({})",
                            wine.getAppellation(), wine.getDomaine(),
                            wine.getCuvee(), wine.getMillesime());
            });
    
        return savedWines;
    }

    public List<Map<String, String>> readExcelFile() {
        List<Map<String, String>> data = new ArrayList<>();

        try (InputStream inputStream = new ClassPathResource("data.xlsx").getInputStream();
             Workbook workbook = new XSSFWorkbook(inputStream)) {

            Sheet sheet = workbook.getSheetAt(0);

            // Read headers
            Row headerRow = sheet.getRow(0);
            List<String> headers = new ArrayList<>();
            for (Cell cell : headerRow) {
                headers.add(getCellValueAsString(cell));
            }

            // Read data rows
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row != null) {
                    Map<String, String> rowData = new HashMap<>();
                    for (int j = 0; j < headers.size(); j++) {
                        Cell cell = row.getCell(j);
                        rowData.put(headers.get(j), getCellValueAsString(cell));
                    }
                    data.add(rowData);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return data;
    }

    private String getCellValueAsString(Cell cell) {
        try {
            if (cell == null) {
                return "";
            }
            switch (cell.getCellType()) {
                case STRING:
                    return cell.getStringCellValue();
                case NUMERIC:
                    if (DateUtil.isCellDateFormatted(cell)) {
                        return cell.getLocalDateTimeCellValue().toString();
                    }
                    // Format numeric value to avoid scientific notation
                    return String.format("%.2f", cell.getNumericCellValue());
                case BOOLEAN:
                    return Boolean.toString(cell.getBooleanCellValue());
                case FORMULA:
                    try {
                        return String.valueOf(cell.getNumericCellValue());
                    } catch (Exception e) {
                        return cell.getStringCellValue();
                    }
                case BLANK:
                    return "";
                default:
                    return "";
            }
        } catch (Exception e) {
            logger.error("Error reading cell value", e);
            return "";
        }
    }

    public void updateExcelFile(Wine newWine) {
        try (InputStream inputStream = new ClassPathResource("data.xlsx").getInputStream();
            Workbook workbook = new XSSFWorkbook(inputStream)) {
            
            Sheet sheet = workbook.getSheetAt(0);
            int lastRowNum = sheet.getLastRowNum();
                        
            // Add new row after existing data
            Row row = sheet.createRow(lastRowNum + 1);
            row.createCell(0).setCellValue(newWine.getMillesime());
            row.createCell(1).setCellValue(newWine.getCuvee());
            row.createCell(2).setCellValue(newWine.getDomaine());
            row.createCell(3).setCellValue(newWine.getAppellation());
            row.createCell(4).setCellValue(newWine.getPricetosell());
            row.createCell(5).setCellValue(newWine.getQuantity());
            
            // Write to existing Excel file
            try (FileOutputStream fileOut = new FileOutputStream("src/main/resources/data.xlsx")) {
                workbook.write(fileOut);
                logger.info("Excel file updated with new wine: {} - {}", newWine.getDomaine(), newWine.getCuvee());
            }
        } catch (Exception e) {
            logger.error("Failed to update Excel file", e);
            throw new RuntimeException("Error updating Excel file", e);
        }
    }

    public void saveWine(Wine wine) {
        wineRepository.save(wine);
    }
}