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

    @GetMapping("/read-file")
    public ResponseEntity<?> readFile(@RequestParam String filePath) {
        try {
            var result = lectureOcrService.processFile(filePath);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Erreur : " + e.getMessage());
        }
    }
}

