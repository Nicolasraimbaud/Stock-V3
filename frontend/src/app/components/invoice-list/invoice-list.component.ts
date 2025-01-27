import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

import { CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

import { InvoiceService } from '../../services/invoice.service'; // Service pour gérer les factures
import { Invoice } from '../../models/invoice'; // Modèle d'une facture

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, FormsModule],
  template: `
        <div class="list-container">
          <div class="search-bar">
            <i class="fas fa-search search-icon"></i>
            <input 
              class="search-input" 
              type="text" 
              [(ngModel)]="searchTerm"
              placeholder="Rechercher une facture...">
          </div>
          <div class="table-container">
            <table class="invoice-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fournisseur</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Prix Total</th>
                  <th>Statut</th>
                  <th>PDF</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let invoice of invoices">
                  <td>{{invoice.id}}</td>
                  <td>{{invoice.supplier}}</td>
                  <td>{{invoice.email}}</td>
                  <td>{{invoice.date}}</td>
                  <td>{{invoice.total}}</td>
                  <td>
                    <span class="status-badge {{invoice.status}}">{{invoice.status}}</span>
                  </td>
                  <td>
                    <a [href]="'/invoices/' + invoice.pdfFileName" target="_blank">Voir PDF</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>      
  `,
  styles: [`
    .list-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      height: 100%;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
      overflow: hidden;
      padding: 1.5rem;
    }

    .search-bar {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: #f8fafc;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      transition: all 0.2s ease;
    }

    .search-bar:focus-within {
      border-color: #8b0000;
      box-shadow: 0 0 0 3px rgba(139, 0, 0, 0.1);
    }

    .search-icon {
      color: #64748b;
      font-size: 0.875rem;
    }

    .search-input {
      flex: 1;
      border: none;
      background: transparent;
      font-size: 0.875rem;
      color: #1e293b;
      padding: 0.25rem;
    }

    .search-input:focus {
      outline: none;
    }

    .search-input::placeholder {
      color: #94a3b8;
    }

    .table-container {
      flex: 1;
      overflow: auto;
      border-radius: 0.75rem;
      border: 1px solid #e5e7eb;
    }

    .invoice-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      font-size: 0.875rem;
    }

    .invoice-table th {
      position: sticky;
      top: 0;
      padding: 1rem;
      background: #8b0000;
      color: white;
      font-weight: 500;
      text-align: left;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
      border-bottom: 2px solid #7a001f;
    }

    .invoice-table td {
      padding: 1rem;
      border-bottom: 1px solid #f1f5f9;
      color: #1e293b;
      transition: all 0.2s ease;
    }

    .invoice-table tr {
      background: white;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .invoice-table tr:hover td {
      background: #f8fafc;
    }

    .invoice-table tr.selected td {
      background: #fff1f1;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.375rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: capitalize;
    }

    .status-badge.en_cours {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge.a_regler {
      background: #fee2e2;
      color: #991b1b;
    }

    .status-badge.termine {
      background: #dcfce7;
      color: #166534;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }

    .action-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border: none;
      border-radius: 0.5rem;
      background: transparent;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .action-button:hover {
      background: #f1f5f9;
      color: #1e293b;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1rem;
      color: #94a3b8;
      text-align: center;
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-state p {
      font-size: 0.875rem;
      margin: 0;
    }

    @media (max-width: 768px) {
      .list-container {
        padding: 1rem;
      }

      .search-bar {
        padding: 0.5rem;
      }

      .invoice-table th,
      .invoice-table td {
        padding: 0.75rem 0.5rem;
      }

      .status-badge {
        padding: 0.25rem 0.5rem;
      }

      .action-button {
        width: 1.75rem;
        height: 1.75rem;
      }
    }
  `],
  providers: [CurrencyPipe],
})

export class InvoiceListComponent implements OnInit {
  @ViewChild('addInvoiceModal') addInvoiceModal: any;
  @ViewChild('ocrResultsModal') ocrResultsModal: any; // Nouveau modal pour afficher les résultats OCR

  invoices: Invoice[] = [];
  invoiceForm: FormGroup;
  selectedFile: File | null = null;
  results: any[] = []; // Stocke les résultats OCR
  searchTerm: string = ''; // Nouveau champ pour stocker la valeur de recherche

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private invoiceService: InvoiceService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    this.invoiceForm = this.fb.group({
      supplier: [''],
      email: [''],
      date: [''],
      total: [''],
      status: [''],
    });
  }

  ngOnInit(): void {
    // Recharge les données chaque fois que vous naviguez sur la page
    this.route.url.subscribe(() => {
      this.loadInvoices(); // Recharger les factures
    });
  }

  // Charger la liste des factures
  loadInvoices(): void {
    console.log('Début du chargement des factures...');
    this.invoiceService.getInvoices().subscribe({
      next: (data) => {
        console.log('Factures reçues :', data); // Vérifiez les données reçues
        this.invoices = data; // Charge les factures dans la liste
      },
      error: (error) => {
        console.error('Erreur lors du chargement des factures :', error); // Vérifiez les erreurs
      },
      complete: () => {
        console.log('Chargement des factures terminé');
      },
    });
  }

  // Ouvrir la modale
  openAddInvoiceModal(): void {
    this.dialog.open(this.addInvoiceModal);
  }

  openOcrResultsModal(): void {
    this.dialog.open(this.ocrResultsModal, {
      width: '80%', // Ajustez la taille si nécessaire
      data: { results: this.results }, // Passez les données au modal
    });
  }

  // Sélectionner un fichier PDF
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  // Soumettre le formulaire
  onSubmit(): void {
    if (!this.selectedFile) {
      console.error('Aucun fichier sélectionné');
      return;
    }

    const formData = new FormData();
    formData.append('supplier', this.invoiceForm.value.supplier);
    formData.append('email', this.invoiceForm.value.email);
    formData.append('date', this.invoiceForm.value.date);
    formData.append('total', this.invoiceForm.value.total);
    formData.append('status', this.invoiceForm.value.status);
    formData.append('file', this.selectedFile);

    this.invoiceService.processOcrFile(formData).subscribe(
      (response) => {
        console.log('Résultats OCR obtenus avec succès', response);
        this.results = response.rows; // Stocke les lignes OCR extraites

        // Fermer le premier modal
        this.dialog.closeAll();

        // Ouvrir le second modal avec les résultats OCR
        this.openOcrResultsModal();
      },
      (error) => {
        console.error('Erreur lors du traitement du fichier', error);
      }
    );
  }

  saveResults(): void {
    this.invoiceService.saveUpdatedRows(this.results).subscribe({
      next: () => {
        console.log('Données enregistrées avec succès');
        this.results = []; // Réinitialiser les résultats
        this.loadInvoices(); // Recharger la liste des factures
      },
      error: (error) => {
        console.error('Erreur lors de l\'enregistrement des données :', error);
      },
    });
  }
}
