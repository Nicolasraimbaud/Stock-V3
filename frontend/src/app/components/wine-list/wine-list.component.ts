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
      <div class="actions-bar">
        <div class="nav-buttons">
          <a class="nav-button" [routerLink]="['/wines']">
            <i class="fas fa-wine-bottle"></i>
            Liste des Vins
          </a>
          <a class="nav-button" [routerLink]="['/invoice']">
            <i class="fas fa-file-invoice"></i>
            Factures
          </a>
        </div>
        <div class="action-buttons">
          <button class="action-button" (click)="importExcelData()">
            <i class="fas fa-file-excel"></i>
            Import Excel
          </button>
          <button class="action-button" (click)="importExcelData()">
            <i class="fas fa-print"></i>
            Imprimer
          </button>
        </div>
      </div>

      <div class="table-container">
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
              <td class="price">{{wine.pricetobuy | currency:'EUR':'symbol':'1.2-2'}}</td>
              <td class="price">{{wine.pricetosell | currency:'EUR':'symbol':'1.2-2'}}</td>
              <td class="price">{{wine.cost}}</td>
              <td class="quantity">{{wine.quantity}}</td>
              <td>{{wine.updated | date:'dd/MM/yyyy'}}</td>
              <td>{{wine.id}}</td>
              <td>{{wine.supplier}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 1.5rem;
      background-color: #f8fafc;
      min-height: 100vh;
    }

    .actions-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      gap: 1rem;
    }

    .nav-buttons, .action-buttons {
      display: flex;
      gap: 0.75rem;
    }

    .nav-button, .action-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      border: none;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: white;
      background: #8b0000;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
    }

    .nav-button:hover, .action-button:hover {
      background: #7a001f;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(139, 0, 0, 0.1), 0 2px 4px -1px rgba(139, 0, 0, 0.06);
    }

    .nav-button:active, .action-button:active {
      transform: translateY(0);
    }

    .nav-button i, .action-button i {
      font-size: 1rem;
    }

    .table-container {
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
      overflow: auto;
    }

    .wine-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      font-size: 0.875rem;
    }

    .wine-table th {
      position: sticky;
      top: 0;
      padding: 1rem;
      background: #8b0000;
      color: white;
      font-weight: 600;
      text-align: center;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
      border-bottom: 2px solid #7a001f;
      white-space: nowrap;
    }

    .wine-table td {
      padding: 1rem;
      border-bottom: 1px solid #f1f5f9;
      color: #1e293b;
      text-align: center;
      transition: background-color 0.2s;
    }

    .wine-table tr {
      transition: all 0.2s ease;
    }

    .wine-table tr:hover td {
      background: #f8fafc;
    }

    .price {
      font-variant-numeric: tabular-nums;
      font-family: 'Roboto Mono', monospace;
    }

    .quantity {
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }

      .actions-bar {
        flex-direction: column;
        align-items: stretch;
      }

      .nav-buttons, .action-buttons {
        flex-direction: column;
      }

      .nav-button, .action-button {
        width: 100%;
        justify-content: center;
      }

      .table-container {
        margin: 0 -1rem;
        border-radius: 0;
      }

      .wine-table th,
      .wine-table td {
        padding: 0.75rem 0.5rem;
      }
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