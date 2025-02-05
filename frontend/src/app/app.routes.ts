import { Routes } from '@angular/router';
import { WineListComponent } from './components/wine-list/wine-list.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { CommandeListComponent } from './components/commande-list/commande-list.component';
import { CommandeDetailComponent } from './components/commande-ticket/commande-ticket.component';

export const routes: Routes = [
  { path: '', redirectTo: '/wines', pathMatch: 'full' },
  { path: 'wines', component: WineListComponent },
  { path: 'invoice', component: InvoiceComponent },
  { path: 'commande', component: CommandeListComponent },
  { path: 'commande/:id', component: CommandeDetailComponent }
];