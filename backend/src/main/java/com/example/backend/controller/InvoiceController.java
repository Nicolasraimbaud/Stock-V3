package com.example.backend.controller;

import com.example.backend.model.Invoice;
import com.example.backend.service.InvoiceService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

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
            invoiceService.saveInvoice(supplier, email, date, total, status, file);
            return ResponseEntity.ok("{ \"message\": \"Invoice ajoutée avec succès\" }");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{ \"error\": \"" + e.getMessage() + "\" }");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{ \"error\": \"Erreur inattendue : " + e.getMessage() + "\" }");
        }
    }

    @GetMapping
    public List<Invoice> getInvoices() {
        return invoiceService.getAllInvoices();
    }

    @PostMapping("/save")
    public ResponseEntity<String> saveUpdatedRows(@RequestBody List<Map<String, Object>> rows) {
        System.out.println("Données reçues : " + rows);
        invoiceService.saveRows(rows);
        return ResponseEntity.ok("{ \"message\": \"Données enregistrées avec succès\" }");
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<String> updateInvoiceStatus(
        @PathVariable Long id,
        @RequestBody String status
    ) {
        invoiceService.updateInvoiceStatus(id, status);
        return ResponseEntity.ok("{ \"message\": \"Statut mis à jour avec succès\" }");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteInvoice(@PathVariable Long id) {
        invoiceService.deleteInvoice(id);
        return ResponseEntity.ok("{ \"message\": \"Facture supprimée avec succès\" }");
    }
}
