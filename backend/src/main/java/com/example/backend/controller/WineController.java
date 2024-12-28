package com.example.backend.controller;

import com.example.backend.model.Wine;
import com.example.backend.repository.WineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wines")
@CrossOrigin(origins = "http://localhost:4200")
public class WineController {

    @Autowired
    private WineRepository wineRepository;

    @GetMapping
    public List<Wine> getAllWines() {
        return wineRepository.findAll();
    }

    @PostMapping
    public Wine addWine(@RequestBody Wine wine) {
        return wineRepository.save(wine);
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