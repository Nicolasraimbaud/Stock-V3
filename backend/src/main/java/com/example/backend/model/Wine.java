package com.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "wine")
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
    private Double pricetobuy;
    private Double pricetosell;
    private Double cost;
    private Integer quantity;
    private String updated;
    private String supplier;

    @Column(nullable = false, updatable = true)  // ✅ Vérifier que la colonne est bien mise à jour
    private String fullname;

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

    public Double getPricetobuy() {
        return pricetobuy;
    }

    public void setPricetobuy(Double pricetobuy) {
        this.pricetobuy = pricetobuy;
    }

    public Double getPricetosell() {
        return pricetosell;
    }

    public void setPricetosell(Double pricetosell) {
        this.pricetosell = pricetosell;
    }

    public double getCost() {
        return cost;
    }

    public void setCost(double cost) {
        this.cost = cost;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getUpdated() {
        return updated;
    }

    public void setUpdated(String updated) {
        this.updated = updated;
    }

    public String getSupplier() {
        return supplier;
    }

    public void setSupplier(String supplier) {
        this.supplier = supplier;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

}