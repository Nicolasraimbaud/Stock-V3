/* Synchroniser la table articles avec wine automatiquement lorsque des vins sont ajoutés ou mis à jour */

package com.example.backend.listener;

import com.example.backend.model.Wine;
import com.example.backend.model.Article;
import com.example.backend.repository.ArticleRepository;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PostUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
public class WineListener {

    private static ArticleRepository articleRepository;

    @Autowired
    public void setArticleRepository(ArticleRepository repository) {
        articleRepository = repository;
    }

    // 🔥 Exécuté après un ajout ou une mise à jour dans la table wine
    @PostPersist
    @PostUpdate
    public void syncWithArticles(Wine wine) {
        // Vérifie si l'article existe déjà
        Optional<Article> existingArticle = articleRepository.findById(wine.getId());

        if (existingArticle.isPresent()) {
            // Mise à jour de l'article existant
            Article article = existingArticle.get();
            article.setPrix(wine.getPricetosell());
            articleRepository.save(article);
        } else {
            // Création d'un nouvel article
            Article newArticle = new Article();
            newArticle.setNom(wine.getFullname());
            newArticle.setPrix(wine.getPricetosell());
            articleRepository.save(newArticle);
        }
    }
}
