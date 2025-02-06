package com.example.backend.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.*;

@Entity
@Table(name = "commandes")
public class Commande {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String numeroCommande;

    @Column(nullable = false)
    private String client;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCommande = LocalDateTime.now();

    @Column(nullable = false)
    private String statut = "En cours";

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<CommandeArticle> articles = new ArrayList<>();

    // ✅ Constructeurs
    public Commande() {}

    public Commande(String numeroCommande, String client, String statut) {
        this.numeroCommande = numeroCommande;
        this.client = client;
        this.statut = statut;
    }

    // ✅ Getters et Setters
    public Long getId() {
        return id;
    }

    public String getNumeroCommande() {
        return numeroCommande;
    }

    public void setNumeroCommande(String numeroCommande) {
        this.numeroCommande = numeroCommande;
    }

    public String getClient() {
        return client;
    }

    public void setClient(String client) {
        this.client = client;
    }

    public LocalDateTime getDateCommande() {
        return dateCommande;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public List<CommandeArticle> getArticles() {
        return articles;
    }

    public void setArticles(List<CommandeArticle> articles) {
        this.articles = articles;
    }

    // ✅ Ajouter un article à la commande
    public void addArticle(CommandeArticle article) {
        articles.add(article);
        article.setCommande(this);
    }

    // ✅ Supprimer un article de la commande
    public void removeArticle(CommandeArticle article) {
        articles.remove(article);
        article.setCommande(null);
    }

    @Override
    public String toString() {
        return "Commande{id=" + id + ", numeroCommande='" + numeroCommande + "', client='" + client + 
               "', dateCommande=" + dateCommande + ", statut='" + statut + "', articles=" + articles.size() + "}";
    }
}
