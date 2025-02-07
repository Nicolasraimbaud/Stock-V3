import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Article {
  id: number;
  nom: string;  // ✅ Assure-toi que le backend utilise "nom"
  prix: number; // ✅ Assure-toi que le backend utilise "prix"
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = 'http://localhost:8080/api/articles'; // 🔥 Mets l'URL de ton backend Spring Boot

  constructor(private http: HttpClient) {}

  // ✅ Récupérer tous les articles
  getAllArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl);
  }

  // ✅ Rechercher un article par son nom exact
  getArticleByNom(nom: string): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${nom}`);
  }

  // ✅ Rechercher des articles contenant un mot-clé (insensible à la casse)
  searchArticles(query: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/search?query=${query}`);
  }
}
