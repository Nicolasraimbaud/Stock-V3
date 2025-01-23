package com.example.backend.controller;

import com.example.backend.model.Wine;
import com.example.backend.repository.WineRepository;
import com.example.backend.service.WineService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wines")
@CrossOrigin(origins = "http://localhost:4200")
public class WineController {

    private WineRepository wineRepository;
    private WineService wineService;

    public WineController(WineService wineService, WineRepository wineRepository) {
        this.wineService = wineService;
        this.wineRepository = wineRepository;
    }

    @GetMapping
    public List<Wine> getAllWines() {
        return wineService.getAllWinesSorted();
    }

    @PostMapping
    public Wine addWine(@RequestBody Wine wine) {
        return wineService.saveWine(wine);
    }

    @PostMapping("/add-ocr")
    public List<Wine> addMultipleWinesFromOcr(@RequestBody List<Wine> wines) {
        return wineService.saveAllWines(wines);
    }

    @GetMapping("/{id}")
    public Wine getWineById(@PathVariable Long id) {
        return wineRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Wine not found"));
    }

    @DeleteMapping("/{id}")
    public void deleteWine(@PathVariable Long id) {
        wineRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public Wine updateWine(@PathVariable Long id, @RequestBody Wine wine) {
        wine.setId(id);
        return wineRepository.save(wine);
    }
}