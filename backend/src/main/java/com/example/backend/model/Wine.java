package com.example.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDate;

@Entity
public class Wine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer millesime;
    private String cuvee;
    private String domaine;
    private String appellation;
    private String region;
    private String country;
    private double pricetobuy;
    private double pricetosell;
    private double cost;
    private int quantity;
    private LocalDate updated;
    private String supplier;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getMillesime() {
        return millesime;
    }

    public void setMillesime(Integer millesime) {
        this.millesime = millesime;
    }

    public String getCuvee() {
        return cuvee;
    }

    public void setCuvee(String cuvee) {
        this.cuvee = cuvee;
    }

    public String getDomaine() {
        return domaine;
    }

    public void setDomaine(String domaine) {
        this.domaine = domaine;
    }

    public String getAppellation() {
        return appellation;
    }

    public void setAppellation(String appellation) {
        this.appellation = appellation;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public double getPricetobuy() {
        return pricetobuy;
    }

    public void setPricetobuy(double pricetobuy) {
        this.pricetobuy = pricetobuy;
    }

    public double getPricetosell() {
        return pricetosell;
    }

    public void setPricetosell(double pricetosell) {
        this.pricetosell = pricetosell;
    }

    public double getCost() {
        return cost;
    }

    public void setCost(double cost) {
        this.cost = cost;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public LocalDate getUpdated() {
        return updated;
    }

    public void setUpdated(LocalDate updated) {
        this.updated = updated;
    }

    public String getSupplier() {
        return supplier;
    }

    public void setSupplier(String supplier) {
        this.supplier = supplier;
    }

}