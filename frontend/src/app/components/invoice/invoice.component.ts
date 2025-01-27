import { Component } from '@angular/core';
import { InvoiceListComponent } from '../invoice-list/invoice-list.component';
import { InvoiceFormComponent } from '../invoice-form/invoice-form.component';
import { InvoicePreviewComponent } from '../invoice-preview/invoice-preview.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [InvoiceListComponent, InvoiceFormComponent, InvoicePreviewComponent, RouterModule],
  template: `
    <div class="page-container">
      <header class="page-header">
        <h1>Gestion des Factures</h1>
        <div class="header-actions">
          <a class="action-button" [routerLink]="['/wines']">
            <i class="fas fa-wine-bottle"></i>
            Liste des Vins
          </a>
        </div>
      </header>

      <div class="main-content">
        <div class="content-grid">
          <div class="section-card list-section">
            <div class="section-header">
              <h2>Liste des Factures</h2>
              <div class="section-actions">
                <button class="section-button">
                  <i class="fas fa-filter"></i>
                  Filtrer
                </button>
                <button class="section-button">
                  <i class="fas fa-sort"></i>
                  Trier
                </button>
              </div>
            </div>
            <app-invoice-list></app-invoice-list>
          </div>

          <div class="section-card form-section">
            <div class="section-header">
              <h2>Nouvelle Facture</h2>
            </div>
            <app-invoice-form (ocrResults)="handleOcrResults($event)"></app-invoice-form>
          </div>

          <div class="section-card preview-section">
            <div class="section-header">
              <h2>Prévisualisation</h2>
            </div>
            <app-invoice-preview [ocrResults]="ocrData"></app-invoice-preview>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      min-height: 100vh;
      padding: 1.5rem;
      background-color: #f8fafc;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    }

    h1 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 0.75rem;
    }

    .action-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: #8b0000;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-button:hover {
      background: #7a001f;
      transform: translateY(-1px);
    }

    .action-button:active {
      transform: translateY(0);
    }

    .action-button i {
      font-size: 1rem;
    }

    .main-content {
      display: grid;
      gap: 1.5rem;
    }

    .content-grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 1.5rem;
    }

    .section-card {
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .section-header h2 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .section-actions {
      display: flex;
      gap: 0.5rem;
    }

    .section-button {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.5rem 0.75rem;
      background: #f8fafc;
      color: #475569;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .section-button:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
      color: #1e293b;
    }

    .list-section {
      grid-column: span 6;
    }

    .form-section {
      grid-column: span 6;
    }

    .preview-section {
      grid-column: span 12;
    }

    @media (max-width: 1280px) {
      .list-section,
      .form-section,
      .preview-section {
        grid-column: span 12;
      }
    }

    @media (max-width: 768px) {
      .page-container {
        padding: 1rem;
      }

      .page-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
        padding: 1rem;
      }

      .header-actions {
        flex-direction: column;
      }

      .action-button {
        width: 100%;
        justify-content: center;
      }

      .content-grid {
        gap: 1rem;
      }

      .section-header {
        padding: 1rem;
      }

      .section-actions {
        display: none;
      }
    }
  `]
})
export class InvoiceComponent {
  ocrData = { rows: [] };

  handleOcrResults(results: any): void {
    this.ocrData = results;
  }
}
