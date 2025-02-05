import { Injectable } from '@angular/core';

export interface Ticket {
  id: number;
  table: number;
  status: string;
  items: any[];
}

@Injectable({ providedIn: 'root' })
export class CommandeService {
  private tickets: Ticket[] = [
    { id: 1, table: 1, status: 'En cours', items: [] }
  ];
  private nextId = 2;

  getTickets() {
    return this.tickets;
  }

  createTicket() {
    const newTicket = { id: this.nextId++, table: this.tickets.length + 1, status: 'En cours', items: [] };
    this.tickets.push(newTicket);
    return newTicket.id;
  }

  getTicketById(id: number) {
    return this.tickets.find(ticket => ticket.id === id);
  }

  addItemToTicket(ticketId: number, product: any) {
    const ticket = this.getTicketById(ticketId);
    if (ticket) {
      ticket.items.push(product);
    }
  }
}
