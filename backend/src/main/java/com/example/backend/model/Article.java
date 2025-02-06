package com.example.backend.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "articles")
public class Article {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private Double prix;

    @OneToMany(mappedBy = "article", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<CommandeArticle> commandesArticles = new ArrayList<>();

    // ✅ Constructeurs
    public Article() {}

    public Article(String nom, Double prix) {
        this.nom = nom;
        this.prix = prix;
    }

    // ✅ Getters et Setters
    public Long getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Double getPrix() {
        return prix;
    }

    public void setPrix(Double prix) {
        this.prix = prix;
    }

    public List<CommandeArticle> getCommandesArticles() {
        return commandesArticles;
    }

    public void setCommandesArticles(List<CommandeArticle> commandesArticles) {
        this.commandesArticles = commandesArticles;
    }

    // ✅ Ajouter une relation avec une commande
    public void addCommandeArticle(CommandeArticle commandeArticle) {
        commandesArticles.add(commandeArticle);
        commandeArticle.setArticle(this);
    }

    // ✅ Supprimer une relation avec une commande
    public void removeCommandeArticle(CommandeArticle commandeArticle) {
        commandesArticles.remove(commandeArticle);
        commandeArticle.setArticle(null);
    }

    @Override
    public String toString() {
        return "Article{id=" + id + ", nom='" + nom + "', prix=" + prix + ", commandes=" + commandesArticles.size() + "}";
    }
}
