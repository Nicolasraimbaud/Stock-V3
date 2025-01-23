package com.example.backend.service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.backend.model.Wine;
import com.example.backend.repository.WineRepository;

@Service
public class WineService {

    private final WineRepository wineRepository;

    public WineService(WineRepository wineRepository) {
        this.wineRepository = wineRepository;
    }

    /*  Méthode pour trier la liste de vin */
    public List<Wine> getAllWinesSorted() {
        // Récupérer tous les vins
        List<Wine> wines = wineRepository.findAll();

        // Tri personnalisé
        List<Wine> sortedWines = wines.stream()
            .sorted(Comparator.comparing(Wine::getRegion)
                    .thenComparing(Wine::getAppellation)
                    .thenComparing(Wine::getDomaine)
                    .thenComparing(Wine::getMillesime, Comparator.reverseOrder())
                    .thenComparing(Wine::getCuvee, Comparator.nullsLast(String::compareTo)))
            .collect(Collectors.toList());

        return sortedWines;
    }

    /* Sauvegarder un seul vin */
    public Wine saveWine(Wine wine) {
        return wineRepository.save(wine);
    }

    /* Sauvegarder plusieurs vins à la fois */
    public List<Wine> saveAllWines(List<Wine> wines) {
        return wineRepository.saveAll(wines);
    }
    
    /* Supprimer un vin */
    public void deleteWine(Wine wine) {
        wineRepository.delete(wine);
    }
}
