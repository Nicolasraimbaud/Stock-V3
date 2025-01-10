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
      <a class="add-link" (click)="importExcelData()" class="add-link">Import Excel Data</a>
      <table class="wine-table">
        <thead>
          <tr>
            <th>Millésime</th>
            <th>Cuvée</th>
            <th>Domaine</th>
            <th>Appellation</th>
            <th>Région</th>
            <th>Pays</th>
            <th>Prix d'Achat</th>
            <th>Prix de Vente</th>
            <th>Cost</th>
            <th>Quantité</th>
            <th>Mise à Jour</th>
            <th>ID</th>
            <th>Fournisseur</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let wine of wines">
            <td>{{wine.millesime}}</td>
            <td>{{wine.cuvee}}</td>
            <td>{{wine.domaine}}</td>
            <td>{{wine.appellation}}</td>
            <td>{{wine.region}}</td>
            <td>{{wine.country}}</td>
            <td>{{wine.pricetobuy | currency}}</td>
            <td>{{wine.pricetosell | currency}}</td>
            <td>{{wine.cost}}</td>
            <td>{{wine.quantity}}</td>
            <td>{{wine.updated}}</td>
            <td>{{wine.id}}</td>
            <td>{{wine.supplier}}</td>
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
      width: 95%;
      margin: 20px auto;
      user-select: none;
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
      background-color: #8b0000; /* Bordeaux */
      text-decoration: none;
      padding: 10px 15px;
      border-radius: 5px;
      transition: background-color 0.3s ease;
      cursor: pointer;
      margin-right: 10px;
    }
    .add-link:hover {
      background-color: #7a001f; /* Darker Bordeaux */
    }

    /* Table */
    .wine-table {
      width: 100%;
      border-collapse: collapse;
      background-color: #fff;
      border-radius: 8px;
      overflow: hidden;
      user-select: none;
    }

    /* Table Headers */
    .wine-table th {
      background-color: #8b0000; /* Bordeaux */
      color: white;
      text-align: left;
      padding: 12px;
      user-select: none;
    }

    /* Table Rows */
    .wine-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
      user-select: none;
    }

    /* Alternating Row Colors */
    .wine-table tr:nth-child(even) {
      background-color: #f2f2f2;
    }

    .wine-table tr:hover {
      background-color: #fdecea; /* Light Bordeaux Tint */
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

  importExcelData(): void {
    this.wineService.importExcelData().subscribe({
      next: (response) => {
        console.log('Excel data imported successfully:', response);
        this.getWines(); // Reload wines after import
      },
      error: (error) => {
        console.error('Error importing Excel data:', error);
      }
    });
  }
}