package com.example.backend.controller;

import com.example.backend.model.Invoice;
import com.example.backend.service.InvoiceService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @PostMapping
    public ResponseEntity<?> addInvoice(
        @RequestParam("supplier") String supplier,
        @RequestParam("email") String email,
        @RequestParam("date") LocalDate date,
        @RequestParam("total") double total,
        @RequestParam("status") String status,
        @RequestParam("file") MultipartFile file
    ) {
        try {
            // Appeler le service pour gérer le fichier et enregistrer les données
            invoiceService.saveInvoice(supplier, email, date, total, status, file);

            return ResponseEntity.ok("Invoice ajoutée avec succès");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de la gestion du fichier");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur inattendue : " + e.getMessage());
        }
    }

    @GetMapping
    public List<Invoice> getInvoices() {
        return invoiceService.getAllInvoices();
    }

    @PostMapping("/save")
    public ResponseEntity<String> saveUpdatedRows(@RequestBody List<Map<String, Object>> rows) {
        // Logique pour sauvegarder les données mises à jour dans la base de données
        System.out.println("Données reçues : " + rows);

        // Sauvegarde dans la base de données (à implémenter)
        // Exemple : invoiceService.saveRows(rows);

        return ResponseEntity.ok("Données enregistrées avec succès");
    }
    
}
