package com.example.backend.model;

import java.util.List;
import java.util.Map;

public class Dictionary {
    private Map<String, List<String>> domaines;
    private Map<String, List<String>> appellations;
    private Map<String, List<String>> qualites;
    private List<String> cuvees;
    private List<String> millesimes;

    // Getters and Setters
    public Map<String, List<String>> getDomaines() {
        return domaines;
    }

    public void setDomaines(Map<String, List<String>> domaines) {
        this.domaines = domaines;
    }

    public Map<String, List<String>> getAppellations() {
        return appellations;
    }

    public void setAppellations(Map<String, List<String>> appellations) {
        this.appellations = appellations;
    }

    public Map<String, List<String>> getQualites() {
        return qualites;
    }

    public void setQualites(Map<String, List<String>> qualites) {
        this.qualites = qualites;
    }

    public List<String> getCuvees() {
        return cuvees;
    }

    public void setCuvees(List<String> cuvees) {
        this.cuvees = cuvees;
    }

    public List<String> getMillesimes() {
        return millesimes;
    }

    public void setMillesimes(List<String> millesimes) {
        this.millesimes = millesimes;
    }
}

