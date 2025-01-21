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

@Service
public class InvoiceService {
    private final InvoiceRepository invoiceRepository;

    public InvoiceService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    public void saveInvoice(String supplier, String email, LocalDate date, double total, String status, MultipartFile file) throws IOException {
        // Sauvegarde du fichier PDF
        String uploadDir = "src/main/resources/uploads/";
        Path uploadPath = Paths.get(uploadDir);
    
        // Crée le dossier 'uploads' s'il n'existe pas
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
    
        // Génère un nom de fichier unique pour éviter les conflits
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
    
        // Copie le fichier dans le répertoire 'uploads'
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
    
        // Sauvegarde de l'objet Invoice dans la base de données
        Invoice invoice = new Invoice();
        invoice.setSupplier(supplier);
        invoice.setEmail(email);
        invoice.setDate(date);
        invoice.setTotal(total);
        invoice.setStatus(status);
        invoice.setPdfFileName(fileName); // Enregistre le nom du fichier
    
        invoiceRepository.save(invoice);
    }
    

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }
}
