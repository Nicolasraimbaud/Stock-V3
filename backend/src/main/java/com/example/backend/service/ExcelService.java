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

        List<Wine> existingWines = wineRepository.findAll();
        Set<Wine> winesToKeep = new HashSet<>();
    
        for (Map<String, String> row : excelData) {
            try {
                String appellation = row.get("Appellation");
                String domaine = row.get("Domaine");
                String cuvee = row.get("Cuvée");
                Integer millesime = Integer.parseInt(row.get("Millésime").split(",")[0]);
    
                Wine wine = wineRepository
                    .findByAppellationAndDomaineAndCuveeAndMillesime(
                        appellation, domaine, cuvee, millesime
                    )
                    .orElse(new Wine());
    
                wine.setAppellation(appellation);
                wine.setDomaine(domaine);
                wine.setCuvee(cuvee);
                wine.setMillesime(millesime);
                wine.setPrice(Double.parseDouble(row.get("Prix").replace(",", ".")));
                wine.setQuantity(Integer.parseInt(row.get("Quantité").split(",")[0]));
    
                Wine savedWine = wineRepository.save(wine);
                savedWines.add(savedWine);
                winesToKeep.add(savedWine);
                logger.info("Saved/Updated wine: {} - {} - {} ({})", 
                    wine.getAppellation(), 
                    wine.getDomaine(), 
                    wine.getCuvee(), 
                    wine.getMillesime());
            } catch (Exception e) {
                logger.error("Error processing wine from row: {}", row, e);
            }
        }
        
        // Delete wines not in Excel
        existingWines.stream()
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
            row.createCell(4).setCellValue(newWine.getPrice());
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
}