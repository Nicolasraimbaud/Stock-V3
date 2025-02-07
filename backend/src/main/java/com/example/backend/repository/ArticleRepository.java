package com.example.backend.repository;

import com.example.backend.model.Article;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    Optional<Article> findByNom(String nom); // 🔍 Recherche un article par son nom
}



