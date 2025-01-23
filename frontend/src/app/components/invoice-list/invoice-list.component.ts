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
              <td>{{invoice.status}}</td>
              <td>
                <a [href]="'/invoices/' + invoice.pdfFileName" target="_blank">Voir PDF</a>
              </td>
            </tr>
          </tbody>
        </table>      
  `,
  styles: [`

    /* Table */
    .invoice-table {
      width: 100%;
      border-collapse: collapse;
      background-color: #fff;
      border-radius: 8px;
      overflow: hidden;
      user-select: none;
    }

    /* Table Headers */
    .invoice-table th {
      background-color: #8b0000; /* Bordeaux */
      color: white;
      text-align: left;
      padding: 12px;
      user-select: none;
    }

    /* Table Rows */
    .invoice-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
      user-select: none;
    }

    /* Alternating Row Colors */
    .invoice-table tr:nth-child(even) {
      background-color: #f2f2f2;
    }

    .invoice-table tr:hover {
      background-color: #fdecea; /* Light Bordeaux Tint */
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