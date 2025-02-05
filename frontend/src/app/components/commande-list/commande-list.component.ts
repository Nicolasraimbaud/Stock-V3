import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandeService } from '../../services/commande.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-commande-list',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './commande-list.component.html',
  styleUrls: ['./commande-list.component.css']
})

export class CommandeListComponent {
  commandeService = inject(CommandeService);
  router = inject(Router);
  tickets = this.commandeService.getTickets();

  createTicket() {
    const newTicketId = this.commandeService.createTicket();
    this.router.navigate(['/commande', newTicketId]);
  }

  openTicket(ticketId: number) {
    this.router.navigate(['/commande', ticketId]);
  }
}
