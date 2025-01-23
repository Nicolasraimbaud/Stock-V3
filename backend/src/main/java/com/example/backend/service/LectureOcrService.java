package com.example.backend.service;

import com.example.backend.model.Dictionary;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LectureOcrService {
    private final Dictionary dictionary;

    // Constructor: Load the dictionary on service initialization
    public LectureOcrService() throws IOException {
        DictionaryService dictionaryService = new DictionaryService();
        this.dictionary = dictionaryService.loadDictionary();
    }

    public Map<String, Object> processFile(MultipartFile file) throws TesseractException {
        try {
            // Sauvegarder temporairement le fichier reçu pour OCR
            File tempFile = File.createTempFile("ocr_", "_" + file.getOriginalFilename());
            file.transferTo(tempFile);

            // Initialisation de Tesseract
            Tesseract tesseract = new Tesseract();
            tesseract.setDatapath("src/main/resources/tessdata");
            tesseract.setLanguage("fra");
            tesseract.setVariable("preserve_interword_spaces", "1");

            Map<String, Object> fileResult = new HashMap<>();
            try {
                String text = tesseract.doOCR(tempFile);

                // Séparation des lignes
                String[] lines = text.split("\n");
                List<Map<String, String>> rows = extractColumns(lines);

                // Filtrer les lignes valides
                List<Map<String, String>> validRows = filterValidRows(rows);

                fileResult.put("filename", file.getOriginalFilename());
                fileResult.put("rows", validRows); // Ajouter uniquement les lignes valides
            } catch (Exception e) {
                fileResult.put("filename", file.getOriginalFilename());
                fileResult.put("error", "Erreur lors du traitement : " + e.getMessage());
            }

            // Supprimer le fichier temporaire après traitement
            tempFile.delete();

            return fileResult;
        } catch (IOException e) {
            throw new RuntimeException("Erreur de traitement du fichier : " + e.getMessage());
        }
    }

    private List<Map<String, String>> extractColumns(String[] lines) {
        List<Map<String, String>> extractedData = new ArrayList<>();
        Map<String, String> previousRow = null;

        for (String line : lines) {
            if (line.trim().isEmpty()) continue; // Ignorer les lignes vides

            // Diviser la ligne en colonnes par espaces multiples
            String[] columns = line.split("\\s{2,}");

            if (columns.length >= 5) {
                Map<String, String> currentRow = new HashMap<>();
                currentRow.put("Description", columns[0].trim());
                currentRow.put("Unite", columns[1].trim());
                currentRow.put("Quantite", columns[2].trim());
                currentRow.put("PrixUnitaire", columns[3].trim());
                currentRow.put("PrixTotal", columns[4].trim());

                currentRow.putAll(parseDescription(columns[0].trim()));

                extractedData.add(currentRow);
                previousRow = currentRow;
            } else if (columns.length == 1 && previousRow != null) {
                String missingDescription = columns[0].trim();
                String previousDescription = previousRow.get("Description");

                if (missingDescription.length() < previousDescription.length() * 0.5) {
                    String updatedDescription = previousDescription + " " + missingDescription;
                    previousRow.put("Description", updatedDescription);
                    previousRow.putAll(parseDescription(updatedDescription));
                    extractedData.set(extractedData.size() - 1, previousRow);
                } else {
                    Map<String, String> standaloneRow = new HashMap<>();
                    standaloneRow.put("Description", missingDescription);
                    standaloneRow.putAll(parseDescription(missingDescription));
                    standaloneRow.put("Unité", "");
                    standaloneRow.put("Quantite", "");
                    standaloneRow.put("PrixUnitaire", "");
                    standaloneRow.put("PrixTotal", "");

                    extractedData.add(standaloneRow);
                }
            }
        }

        return extractedData.stream()
                .map(this::reorderColumns)
                .collect(Collectors.toList());
    }

    private Map<String, String> parseDescription(String description) {
        Map<String, String> result = new HashMap<>();
        String cleanedDescription = description.replaceAll("[^a-zA-ZÀ-ÿ0-9\\s\\-]", "").trim();
    
        // Étape 1 : Identifier et retirer le domaine
        for (Map.Entry<String, List<String>> entry : dictionary.getDomaines().entrySet()) {
            String standardDomaine = entry.getKey(); // Nom standardisé, ex: "Domaine Joseph Colin"
            List<String> variantes = entry.getValue();

            for (String variante : variantes) {
                if (cleanedDescription.toLowerCase().contains(variante.toLowerCase())) {
                    result.put("Domaine", standardDomaine); // Utiliser le nom standardisé
                    // Supprimer la variante ET le mot "Domaine" associé
                    cleanedDescription = cleanedDescription.replaceAll("(?i)" + variante, "").trim();
                    cleanedDescription = cleanedDescription.replaceAll("(?i)domaine", "").trim();
                    break;
                }
            }
            if (result.containsKey("Domaine")) break;
        }
    
        // Étape 2 : Identifier et retirer l'appellation
        for (Map.Entry<String, List<String>> entry : dictionary.getAppellations().entrySet()) {
            String standardAppellation = entry.getKey();
            List<String> variantes = entry.getValue();
    
            for (String variante : variantes) {
                if (cleanedDescription.toLowerCase().contains(variante.toLowerCase())) {
                    result.put("Appellation", standardAppellation);
                    cleanedDescription = cleanedDescription.replaceAll("(?i)" + variante, "").trim();
                    break;
                }
            }
            if (result.containsKey("Appellation")) break;
        }

        // Étape 3 : Identifier et retirer la qualité
        for (Map.Entry<String, List<String>> entry : dictionary.getQualites().entrySet()) {
            String standardQualite = entry.getKey();
            List<String> variantes = entry.getValue();

            for (String variante : variantes) {
                if (cleanedDescription.toLowerCase().contains(variante.toLowerCase())) {
                    result.put("Qualite", standardQualite);
                    cleanedDescription = cleanedDescription.replaceAll("(?i)" + variante, "").trim();
                    break;
                }
            }
            if (result.containsKey("Qualite")) break;
        }
    
        // Étape 4 : Identifier et retirer le millésime ou indiquer "NM"
        boolean millesimeTrouve = false;
        for (String millesime : dictionary.getMillesimes()) {
            if (cleanedDescription.contains(millesime)) {
                result.put("Millesime", millesime);
                cleanedDescription = cleanedDescription.replaceAll("\\b" + millesime + "\\b", "").trim();
                millesimeTrouve = true;
                break;
            }
        }
        if (!millesimeTrouve) {
            result.put("Millesime", "NM"); // Insérer "NM" si aucun millésime n'est trouvé
        }
        
        System.out.println("Description après retrait du millésime : " + cleanedDescription);
        // Étape 5 : Nettoyer les espaces multiples
        cleanedDescription = cleanedDescription.replaceAll("\\s{2,}", " ");
    
        // Étape 6 : Extraire la cuvée
        if (!cleanedDescription.isEmpty()) {
            result.put("Cuvee", cleanedDescription);
        } else {
            result.put("Cuvee", ""); // Mettre une chaîne vide si rien ne reste
        }
    
        return result;
    }
    
    
    public List<Map<String, String>> filterBlocks(List<Map<String, Object>> ocrResults) {
        List<Map<String, String>> filteredResults = new ArrayList<>();

        for (Map<String, Object> file : ocrResults) {
            String filename = (String) file.get("filename");
            Object blocksObj = file.get("rows");

            // Vérifier que blocksObj est une liste
            if (!(blocksObj instanceof List<?>)) {
                continue; // Ignorer si ce n'est pas une liste
            }

            @SuppressWarnings("unchecked")
            List<Map<String, String>> blocks = ((List<?>) blocksObj).stream()
                .filter(item -> item instanceof Map<?, ?>)
                .map(item -> (Map<String, String>) item)
                .collect(Collectors.toList());

            // Add filename to each block
            for (Map<String, String> block : blocks) {
                block.put("filename", filename); // Associate each block with its file
                filteredResults.add(block);
            }
        }

        return filteredResults;
    }

    private Map<String, String> reorderColumns(Map<String, String> row) {
        Map<String, String> reordered = new LinkedHashMap<>();
        reordered.put("Description", row.getOrDefault("Description", ""));
        reordered.put("Domaine", row.getOrDefault("Domaine", ""));
        reordered.put("Appellation", row.getOrDefault("Appellation", ""));
        reordered.put("Qualite", row.getOrDefault("Qualite", ""));
        reordered.put("Cuvee", row.getOrDefault("Cuvee", ""));
        reordered.put("Millesime", row.getOrDefault("Millesime", ""));
        reordered.put("Unite", row.getOrDefault("Unite", ""));
        reordered.put("Quantite", row.getOrDefault("Quantite", ""));
        reordered.put("PrixUnitaire", row.getOrDefault("PrixUnitaire", ""));
        reordered.put("PrixTotal", row.getOrDefault("PrixTotal", ""));
        return reordered;
    }    

    private List<Map<String, String>> filterValidRows(List<Map<String, String>> rows) {
        return rows.stream()
            .filter(row -> hasMinimumValidFields(row))
            .collect(Collectors.toList());
    }

    private boolean hasMinimumValidFields(Map<String, String> row) {
        int count = 0;
        if (!row.getOrDefault("Domaine", "").isEmpty()) count++;
        if (!row.getOrDefault("Appellation", "").isEmpty()) count++;
        if (!row.getOrDefault("Millesime", "").isEmpty()) count++;

        return count >= 2;
    }
}




