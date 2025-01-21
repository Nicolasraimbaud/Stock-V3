import { Routes } from '@angular/router';
import { WineListComponent } from './components/wine-list/wine-list.component';
import { AddWineComponent } from './components/add-wine/add-wine.component';
import { InvoiceComponent } from './components/invoice/invoice.component';

export const routes: Routes = [
  { path: '', redirectTo: '/wines', pathMatch: 'full' },
  { path: 'wines', component: WineListComponent },
  { path: 'add-wine', component: AddWineComponent },
  { path: 'invoice', component: InvoiceComponent },
];