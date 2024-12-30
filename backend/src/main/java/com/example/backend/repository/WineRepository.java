package com.example.backend.repository;

import com.example.backend.model.Wine;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WineRepository extends JpaRepository<Wine, Long> {
    Optional<Wine> findByAppellationAndDomaineAndCuveeAndMillesime(
        String appellation, 
        String domaine, 
        String cuvee, 
        Integer millesime
    );
}