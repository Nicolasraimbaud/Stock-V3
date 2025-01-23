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
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class ExcelService {

    private WineRepository wineRepository;
    private static final Logger logger = LoggerFactory.getLogger(ExcelService.class);

    @Autowired
    public ExcelService(WineRepository wineRepository) {
        this.wineRepository = wineRepository;
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

    public List<Wine> processExcelAndSaveToDb() {
        List<Wine> savedWines = new ArrayList<>();
        List<Map<String, String>> excelData = readExcelFile();
        Set<Wine> winesToKeep = new HashSet<>();
    
        for (Map<String, String> row : excelData) {
            try {
                // Vérification des champs obligatoires
                String appellation = row.get("Appellation");
                String domaine = row.get("Domaine");
                String cuvee = row.get("Cuvee");
                String region = row.get("Region");
                String country = row.get("Country");
                String supplier = row.get("Supplier");
                String millesimeStr = row.get("Millesime");
                String updatedStr = row.get("Updated");
                LocalDate updatedDate = null;

                if (updatedStr != null && !updatedStr.isEmpty()) {
                    try {
                        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME; // Adapter le format si nécessaire
                        updatedDate = LocalDate.parse(updatedStr, formatter);
                    } catch (DateTimeParseException e) {
                        logger.error("Invalid date format for 'Updated': {}", updatedStr, e);
                    }
                }
    
                if (appellation == null || domaine == null || cuvee == null || millesimeStr == null) {
                    logger.error("Missing required fields in row: {}", row);
                    continue;
                }
    
                // Conversion des valeurs numériques
                Double priceToBuy = parseDouble(row.get("Pricetobuy"));
                Double priceToSell = parseDouble(row.get("Pricetosell"));
                Double cost = parseDouble(row.get("Cost"));
                Integer quantity;
                Integer millesime;
    
                try {
                    quantity = Integer.parseInt(row.get("Quantity").split(",")[0].trim());
                } catch (NumberFormatException e) {
                    logger.error("Invalid 'Quantity' value for row: {}", row);
                    continue;
                }
    
                try {
                    millesime = Integer.parseInt(millesimeStr.split(",")[0].trim());
                } catch (NumberFormatException e) {
                    logger.error("Invalid 'Millésime' value for row: {}", row);
                    continue;
                }
    
                if (priceToBuy == null || priceToSell == null || cost == null) {
                    logger.error("Invalid numeric fields in row: {}", row);
                    continue;
                }
    
                // Recherche ou création d'un vin
                Wine wine = wineRepository
                    .findByAppellationAndDomaineAndCuveeAndMillesime(appellation, domaine, cuvee, millesime)
                    .orElse(new Wine());
    
                // Mise à jour des champs
                wine.setAppellation(appellation);
                wine.setDomaine(domaine);
                wine.setCuvee(cuvee);
                wine.setMillesime(millesime);
                wine.setRegion(region);
                wine.setCountry(country);
                wine.setSupplier(supplier);
                wine.setPricetobuy(priceToBuy);
                wine.setPricetosell(priceToSell);
                wine.setCost(cost);
                wine.setQuantity(quantity);
                wine.setUpdated(updatedDate);
    
                // Enregistrement dans la base de données
                savedWines.add(wineRepository.save(wine));
                winesToKeep.add(wine);
                logger.info("Saved/Updated wine: {}", wine);
    
            } catch (Exception e) {
                logger.error("Error processing wine from row: {}", row, e);
            }
        }
    
        // Suppression des vins non présents dans Excel
        wineRepository.findAll()
            .stream()
            .filter(wine -> !winesToKeep.contains(wine))
            .forEach(wine -> {
                wineRepository.delete(wine);
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

    private Double parseDouble(String value) {
        if (value == null || value.isEmpty()) {
            return null; // Retourne null si la valeur est vide ou absente
        }
        try {
            // Remplacer les virgules par des points
            return Double.parseDouble(value.replace(",", ".").trim());
        } catch (NumberFormatException e) {
            logger.error("Invalid number format: {}", value, e);
            return null; // Retourne null si la conversion échoue
        }
    }
}