package com.example.backend.service;

import com.example.backend.model.Invoice;
import com.example.backend.repository.InvoiceRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class InvoiceService {
    private final InvoiceRepository invoiceRepository;

    public InvoiceService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    public void saveInvoice(String supplier, String email, LocalDate date, double total, String status, MultipartFile file) throws IOException {
        String uploadDir = "src/main/resources/uploads/";
        Path uploadPath = Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        Invoice invoice = new Invoice();
        invoice.setSupplier(supplier);
        invoice.setEmail(email);
        invoice.setDate(date);
        invoice.setTotal(total);
        invoice.setStatus(status);
        invoice.setPdfFileName(fileName);

        invoiceRepository.save(invoice);
    }

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public void saveRows(List<Map<String, Object>> rows) {
        // Implémentation de la sauvegarde des données mises à jour
        for (Map<String, Object> row : rows) {
            Invoice invoice = invoiceRepository.findById(Long.parseLong(row.get("id").toString())).orElseThrow();
            invoice.setStatus(row.get("status").toString());
            invoiceRepository.save(invoice);
        }
    }

    public void updateInvoiceStatus(Long id, String status) {
        Invoice invoice = invoiceRepository.findById(id).orElseThrow();
        invoice.setStatus(status);
        invoiceRepository.save(invoice);
    }

    public void deleteInvoice(Long id) {
        invoiceRepository.deleteById(id);
    }
}
