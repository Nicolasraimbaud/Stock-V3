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
      <h2 class="title">🍷 Add New Wine</h2>
      <form (ngSubmit)="onSubmit()" class="wine-form">
        <div class="form-group">
          <label for="millesime">Millésime:</label>
          <input id="millesime" type="number" [(ngModel)]="wine.millesime" name="millesime" required>
        </div>
        <div class="form-group">
          <label for="cuvee">Cuvée:</label>
          <input id="cuvee" type="text" [(ngModel)]="wine.cuvee" name="cuvee" required>
        </div>
        <div class="form-group">
          <label for="domaine">Domaine:</label>
          <input id="domaine" type="text" [(ngModel)]="wine.domaine" name="domaine" required>
        </div>
        <div class="form-group">
          <label for="appellation">Appellation:</label>
          <input id="appellation" type="text" [(ngModel)]="wine.appellation" name="appellation" required>
        </div>
        <div class="form-group">
          <label for="price">Prix:</label>
          <input id="price" type="number" [(ngModel)]="wine.pricetosell" name="price" required>
        </div>
        <div class="form-group">
          <label for="quantity">Quantité:</label>
          <input id="quantity" type="number" [(ngModel)]="wine.quantity" name="quantity" required>
        </div>
        <button type="submit" class="submit-button">Add Wine</button>
      </form>
    </div>
  `,
  styles: [`
    /* Container */
    .container {
      padding: 20px;
      font-family: 'Arial', sans-serif;
      background-color: #f9f9f9;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      max-width: 500px;
      margin: 20px auto;
    }

    /* Title */
    .title {
      font-size: 24px;
      font-weight: bold;
      color: #3e3e3e;
      text-align: center;
      margin-bottom: 20px;
    }

    /* Form */
    .wine-form {
      display: flex;
      flex-direction: column;
    }

    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      font-weight: bold;
      margin-bottom: 5px;
      color: #4caf50;
    }

    input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
      box-sizing: border-box;
    }

    input:focus {
      border-color: #4caf50;
      outline: none;
      box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
    }

    /* Submit Button */
    .submit-button {
      padding: 10px 15px;
      font-size: 16px;
      font-weight: bold;
      color: white;
      background-color: #4caf50;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .submit-button:hover {
      background-color: #45a049;
    }
  `]
})
export class AddWineComponent {
  wine: Wine = {
    millesime: 0,
    cuvee: '',
    domaine: '',
    appellation: '',
    pricetosell: 0,
    quantity: 0,
    region: '',
    country: '',
    pricetobuy: 0,
    cost: 0,
    updated: new Date('2025-01-01'),
    supplier: ''
  };

  constructor(
    private wineService: WineService,
    private router: Router
  ) { }

  /*onSubmit() {
    this.wineService.addWine(this.wine).subscribe({
      next: () => this.router.navigate(['/wines']),
      error: (error) => console.error('Error adding wine:', error)
    });
  }*/

  onSubmit() {
  this.wineService.addWineAndUpdateExcel(this.wine).subscribe({
    next: () => {
      console.log('Wine added and Excel updated');
      this.router.navigate(['/wines']);
    },
    error: (error) => console.error('Error adding wine or updating Excel:', error)
  });
}
}
