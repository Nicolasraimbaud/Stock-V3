package com.example.backend.repository;

import com.example.backend.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    
    // 🔍 Recherche d'articles contenant un certain texte (insensible à la casse)
    Optional<Article> findByNom(String nom);

    // ✅ Recherche les articles contenant un mot-clé (insensible à la casse)
    List<Article> findByNomContainingIgnoreCase(String query);
}
