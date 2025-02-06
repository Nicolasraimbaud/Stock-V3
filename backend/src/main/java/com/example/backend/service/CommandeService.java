package com.example.backend.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.model.Commande;
import com.example.backend.model.CommandeArticle;

import com.example.backend.repository.CommandeRepository;

@Service
public class CommandeService {
    @Autowired
    private CommandeRepository commandeRepository;

    public Commande creerCommande(String client, List<CommandeArticle> articles) {
        Commande commande = new Commande();
        commande.setNumeroCommande("CMD-" + UUID.randomUUID().toString().substring(0, 8));
        commande.setClient(client);
        commande.setArticles(articles);
        return commandeRepository.save(commande);
    }

    public List<Commande> getAllCommandes() {
        return commandeRepository.findAll();
    }
}
