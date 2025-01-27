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

    .content-grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 2rem;
    }

    .section-card {
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      backdrop-filter: blur(8px);
    }

    .section-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 2rem;
      border-bottom: 1px solid #e5e7eb;
      background: rgba(255, 255, 255, 0.9);
    }

    .section-header h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .section-actions {
      display: flex;
      gap: 0.75rem;
    }

    .section-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1rem;
      background: #f8fafc;
      color: #475569;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .section-button:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
      color: #1e293b;
      transform: translateY(-1px);
    }

    .section-button:active {
      transform: translateY(0);
    }

    .section-button i {
      font-size: 0.875rem;
    }

    .list-section {
      grid-column: span 4;
    }

    .form-section {
      grid-column: span 4;
    }

    .preview-section {
      grid-column: span 4;
    }

    @media (max-width: 1536px) {
      .list-section {
        grid-column: span 6;
      }
      .form-section {
        grid-column: span 6;
      }
      .preview-section {
        grid-column: span 12;
      }
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
        padding: 1.25rem;
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
        padding: 1.25rem;
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
