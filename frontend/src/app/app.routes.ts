import { Routes } from '@angular/router';
import { WineListComponent } from './components/wine-list/wine-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/wines', pathMatch: 'full' },
  { path: 'wines', component: WineListComponent }
];