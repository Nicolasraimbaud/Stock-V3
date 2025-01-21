package com.example.backend.service;

import com.example.backend.model.Dictionary;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.IOException;
import java.util.Objects;

public class DictionaryService {

    public Dictionary loadDictionary() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        // Charger le fichier JSON depuis le classpath
        File file = new File(Objects.requireNonNull(getClass().getClassLoader()
                .getResource("dictionaries/wine-dictionary.json")).getFile());
        return objectMapper.readValue(file, Dictionary.class); // Use Dictionary instead of DictionaryController
    }
}

