import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Wine } from '../../models/wine';
import { WineService } from '../../services/wine.service';

@Component({
  selector: 'app-add-wine',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <h2>Add New Wine</h2>
      <form (ngSubmit)="onSubmit()">
        <div>
          <label>Name:</label>
          <input type="text" [(ngModel)]="wine.name" name="name" required>
        </div>
        <div>
          <label>Quantity:</label>
          <input type="number" [(ngModel)]="wine.quantity" name="quantity" required>
        </div>
        <div>
          <label>Price:</label>
          <input type="number" [(ngModel)]="wine.price" name="price" required>
        </div>
        <button type="submit">Add Wine</button>
      </form>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    form div { margin-bottom: 10px; }
    label { display: inline-block; width: 70px; }
  `]
})
export class AddWineComponent {
  wine: Wine = {
    name: '',
    quantity: 0,
    price: 0
  };

  constructor(
    private wineService: WineService,
    private router: Router
  ) { }

  onSubmit() {
    this.wineService.addWine(this.wine).subscribe({
      next: () => this.router.navigate(['/wines']),
      error: (error) => console.error('Error adding wine:', error)
    });
  }
}