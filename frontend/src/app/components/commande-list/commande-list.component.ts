import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommandeService, Ticket } from '../../services/commande.service';
import { ArticleService, Article } from '../../services/article.service';

@Component({
  selector: 'app-commande-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './commande-list.component.html',
  styleUrls: ['./commande-list.component.css']
})
export class CommandeListComponent {
  commandeService = inject(CommandeService);
  articleService = inject(ArticleService);
  tickets = this.commandeService.getTickets();
  selectedTicket: Ticket | null = null;
  searchQuery = '';
  searchResults: Article[] = [];

  createTicket() {
    this.commandeService.createTicket();
    this.tickets = this.commandeService.getTickets();
  }

  selectTicket(ticket: Ticket) {
    this.selectedTicket = ticket;
  }

  searchArticles() {
    if (this.searchQuery.length > 1) {
      this.articleService.searchArticles(this.searchQuery).subscribe(results => {
        this.searchResults = results;
      });
    } else {
      this.searchResults = [];
    }
  }

  addItemToTicket(article: Article) {
    if (this.selectedTicket) {
      this.commandeService.addItemToTicket(this.selectedTicket.id, { ...article, quantity: 1 });
    }
  }

  getTotalPrice(items: { nom: string; prix: number; quantity: number }[]): number {
    return items.reduce((acc, item) => acc + (item.prix * item.quantity), 0);
  }
  
}
