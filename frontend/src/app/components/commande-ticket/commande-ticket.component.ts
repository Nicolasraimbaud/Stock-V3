import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CommandeService, Ticket } from '../../services/commande.service';

@Component({
  selector: 'app-commande-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './commande-ticket.component.html',
  styleUrls: ['./commande-ticket.component.css']
})
export class CommandeDetailComponent {
  route = inject(ActivatedRoute);
  commandeService = inject(CommandeService);
  ticket: Ticket | undefined = this.commandeService.getTicketById(+this.route.snapshot.params['id']);

  addProduct() {
    const produit = { name: 'Vin rouge', price: 25, quantity: 1 };
    if (this.ticket) {
      this.commandeService.addItemToTicket(this.ticket.id, produit);
    }
  }

  payTicket() {
    if (this.ticket) {
      this.commandeService.closeTicket(this.ticket.id);
      alert('Ticket payé !');
    }
  }
}
