package com.example.backend.service;

import com.example.backend.model.Article;
import com.example.backend.repository.ArticleRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.List;

@Service
public class ArticleService {
    
    private final ArticleRepository articleRepository;

    public ArticleService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    // ✅ Récupérer tous les articles
    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    // ✅ Recherche un article par son nom
    public Optional<Article> getArticleByNom(String nom) {
        return articleRepository.findByNom(nom);
    }

    // ✅ Recherche des articles contenant un mot-clé
    public List<Article> searchArticles(String query) {
        return articleRepository.findByNomContainingIgnoreCase(query);
    }
}
