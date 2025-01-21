package com.example.backend.controller;

import com.example.backend.service.LectureOcrService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ocr")
public class LectureOcrController {

    private final LectureOcrService lectureOcrService;

    public LectureOcrController(LectureOcrService lectureOcrService) {
        this.lectureOcrService = lectureOcrService;
    }

    @GetMapping("/read-all")
    public ResponseEntity<?> readAllFiles() {
        try {
            // Appeler le service pour traiter tous les fichiers du dossier
            var results = lectureOcrService.processAllFiles();
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur : " + e.getMessage());
        }
    }
}
