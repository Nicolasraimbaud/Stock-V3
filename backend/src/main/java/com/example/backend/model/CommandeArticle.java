package com.example.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "commandes_articles")
public class CommandeArticle {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "commande_id", nullable = false)
    private Commande commande;

    @ManyToOne
    @JoinColumn(name = "article_id", nullable = false)
    private Article article;

    @Column(nullable = false)
    private int quantite;

    @Column(nullable = false)
    private BigDecimal prixUnitaire;

    // ✅ Constructeurs
    public CommandeArticle() {}

    public CommandeArticle(Commande commande, Article article, int quantite, BigDecimal prixUnitaire) {
        this.commande = commande;
        this.article = article;
        this.quantite = quantite;
        this.prixUnitaire = prixUnitaire;
    }

    // ✅ Getters et Setters
    public Long getId() {
        return id;
    }

    public Commande getCommande() {
        return commande;
    }

    public void setCommande(Commande commande) {
        this.commande = commande;
    }

    public Article getArticle() {
        return article;
    }

    public void setArticle(Article article) {
        this.article = article;
    }

    public int getQuantite() {
        return quantite;
    }

    public void setQuantite(int quantite) {
        this.quantite = quantite;
    }

    public BigDecimal getPrixUnitaire() {
        return prixUnitaire;
    }

    public void setPrixUnitaire(BigDecimal prixUnitaire) {
        this.prixUnitaire = prixUnitaire;
    }

    @Override
    public String toString() {
        return "CommandeArticle{id=" + id + ", commande=" + (commande != null ? commande.getNumeroCommande() : "null") +
               ", article=" + (article != null ? article.getNom() : "null") +
               ", quantite=" + quantite + ", prixUnitaire=" + prixUnitaire + "}";
    }
}
