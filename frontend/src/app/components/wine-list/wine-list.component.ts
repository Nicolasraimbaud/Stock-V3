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
    <div class="page-container">
      <header class="page-header">
        <h1>Gestion des Vins</h1>
        <div class="header-actions">
          <a class="action-button" [routerLink]="['/invoice']">
            <i class="fas fa-file-invoice"></i>
            Factures
          </a>
          <button class="action-button" (click)="importExcelData()">
            <i class="fas fa-file-excel"></i>
            Import Excel
          </button>
          <button class="action-button" (click)="printWineList()">
            <i class="fas fa-print"></i>
            Imprimer
          </button>
        </div>
      </header>

      <div class="main-content">
        <div class="section-card">
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
    </div>
  `,
  styles: [`
    .page-container {
      min-height: 100vh;
      padding: 2rem;
      background: linear-gradient(to bottom right, #f8fafc, #f1f5f9);
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding: 1.5rem 2rem;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      backdrop-filter: blur(8px);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .page-header:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    }

    h1 {
      font-size: 1.875rem;
      font-weight: 700;
      background: linear-gradient(45deg, #8b0000, #b91c1c);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.025em;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .action-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: #8b0000;
      color: white;
      border: none;
      border-radius: 0.75rem;
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgb(139 0 0 / 0.2);
    }

    .action-button:hover {
      background: #7a001f;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgb(139 0 0 / 0.3);
    }

    .action-button:active {
      transform: translateY(0);
    }

    .action-button i {
      font-size: 1rem;
    }

    .main-content {
      margin: 0 auto;
      max-width: 1800px;
    }

    .section-card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      backdrop-filter: blur(8px);
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
      .page-container {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
        padding: 1rem;
      }

      .header-actions {
        flex-direction: column;
        width: 100%;
      }

      .action-button {
        width: 100%;
        justify-content: center;
      }

      .section-card {
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

  printWineList(): void {
    // TO DO: implement print functionality
  }
}