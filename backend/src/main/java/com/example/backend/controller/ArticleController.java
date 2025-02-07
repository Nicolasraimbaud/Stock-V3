package com.example.backend.controller;

import com.example.backend.model.Article;
import com.example.backend.service.ArticleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/articles")
@CrossOrigin(origins = "http://localhost:4200")
public class ArticleController {

    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    // ✅ Récupérer tous les articles
    @GetMapping
    public List<Article> getAllArticles() {
        return articleService.getAllArticles();
    }

    // ✅ Rechercher un article par son nom exact
    @GetMapping("/{nom}")
    public Optional<Article> getArticleByNom(@PathVariable String nom) {
        return articleService.getArticleByNom(nom);
    }

    // ✅ Rechercher des articles contenant un mot-clé
    @GetMapping("/search")
    public List<Article> searchArticles(@RequestParam String query) {
        return articleService.searchArticles(query);
    }
}
