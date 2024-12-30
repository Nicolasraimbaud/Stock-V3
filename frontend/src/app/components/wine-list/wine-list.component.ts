import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Wine } from '../../models/wine';
import { WineService } from '../../services/wine.service';


@Component({
  selector: 'app-wine-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <h2 class="title">🍷 Wine List</h2>
      <a class="add-link" [routerLink]="['/add-wine']">+ Add New Wine</a>
      <table class="wine-table">
        <thead>
          <tr>
            <th>Millésime</th>
            <th>Cuvée</th>
            <th>Appellation</th>
            <th>Domaine</th>
            <th>Prix</th>
            <th>Quantité</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let wine of wines">
            <td>{{wine.millesime}}</td>
            <td>{{wine.cuvee}}</td>
            <td>{{wine.appellation}}</td>
            <td>{{wine.domaine}}</td>
            <td>{{wine.price | currency}}</td>
            <td>{{wine.quantity}}</td>
          </tr>
        </tbody>
      </table>
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
      max-width: 800px;
      margin: 20px auto;
    }

    /* Title */
    .title {
      font-size: 24px;
      font-weight: bold;
      color: #3e3e3e;
      margin-bottom: 15px;
      text-align: center;
    }

    /* Add Link */
    .add-link {
      display: inline-block;
      margin-bottom: 20px;
      font-size: 16px;
      color: #fff;
      background-color: #4caf50;
      text-decoration: none;
      padding: 10px 15px;
      border-radius: 5px;
      transition: background-color 0.3s ease;
    }
    .add-link:hover {
      background-color: #45a049;
    }

    /* Table */
    .wine-table {
      width: 100%;
      border-collapse: collapse;
      background-color: #fff;
      border-radius: 8px;
      overflow: hidden;
    }

    /* Table Headers */
    .wine-table th {
      background-color: #4caf50;
      color: white;
      text-align: left;
      padding: 12px;
    }

    /* Table Rows */
    .wine-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    /* Alternating Row Colors */
    .wine-table tr:nth-child(even) {
      background-color: #f2f2f2;
    }

    .wine-table tr:hover {
      background-color: #e8f5e9;
    }
  `]
})

export class WineListComponent implements OnInit {
  wines: Wine[] = [];

  constructor(private wineService: WineService) { }

  ngOnInit(): void {
    this.getWines();
  }

  getWines(): void {
    this.wineService.getWines().subscribe(
      data => this.wines = data
    );
  }
}