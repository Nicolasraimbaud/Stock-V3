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
  selector: 'app-invoice',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container">
      <a class="add-link" [routerLink]="['/wines']">Wine List</a>
      <a class="add-link" [routerLink]="['/invoice']">Invoices</a>
      <div class="sub-container">
        <a class="add-sub-link" (click)="openAddInvoiceModal()">Import Invoice</a>
      </div>
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
              <a [href]="'/uploads/' + invoice.pdfFileName" target="_blank">Voir PDF</a>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Modale pour ajouter une facture -->
      <ng-template #addInvoiceModal>
        <div class="modal-container">
          <h2>Ajouter une Facture</h2>
          <form [formGroup]="invoiceForm" (ngSubmit)="onSubmit()">
            <input type="text" formControlName="supplier" placeholder="Fournisseur" required />
            <input type="email" formControlName="email" placeholder="Email" required />
            <input type="date" formControlName="date" required />
            <input type="number" formControlName="total" placeholder="Prix Total" required />
            <input type="text" formControlName="status" placeholder="Statut" />
            <input type="file" (change)="onFileSelected($event)" required />
            <button type="submit" (click)="openOcrResultsModal()">Enregistrer</button>
          </form>
        </div>
      </ng-template>

      <!-- Nouveau Modal pour afficher les résultats OCR -->
      <ng-template #ocrResultsModal>
        <div class="modal-container">
          <h2>Résultats OCR</h2>
          <table class="result-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Domaine</th>
                <th>Appellation</th>
                <th>Cuvee</th>
                <th>Millésime</th>
                <th>Qualité</th>
                <th>Unité</th>
                <th>Quantité</th>
                <th>PU</th>
                <th>Prix Total</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of results; let i = index">
                <td><input [(ngModel)]="results[i].Description" /></td>
                <td><input [(ngModel)]="results[i].Domaine" /></td>
                <td><input [(ngModel)]="results[i].Appellation" /></td>
                <td><input [(ngModel)]="results[i].Cuvee" /></td>
                <td><input [(ngModel)]="results[i].Millesime" /></td>
                <td><input [(ngModel)]="results[i].Qualite" /></td>
                <td><input [(ngModel)]="results[i].Unite" /></td>
                <td><input [(ngModel)]="results[i].Qte" /></td>
                <td><input [(ngModel)]="results[i].PrixUnitaire" /></td>
                <td><input [(ngModel)]="results[i].PrixTotal" /></td>
              </tr>
            </tbody>
          </table>
          <button (click)="saveResults()">Importer les données</button>
        </div>
      </ng-template>
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
    .add-link , .add-sub-link {
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
    .add-link:hover , .add-sub-link:hover {
      background-color: #7a001f; /* Darker Bordeaux */
    }

    .add-sub-link {
      display: inline-block;
      margin-bottom: 20px;
      font-size: 12px;
      color: #fff;
      background-color:rgb(204, 0, 0); /* Bordeaux */
      text-decoration: none;
      padding: 5px 10px;
      border-radius: 5px;
      transition: background-color 0.3s ease;
      cursor: pointer;
      margin-right: 10px;
    }
    .add-sub-link:hover {
      background-color:rgb(226, 0, 57); /* Darker Bordeaux */
    }

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

    /* Modale */
    .modal-container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      width: 500px;
      margin: auto;
      font-family: 'Arial', sans-serif;
      position: relative;
    }

    /* Titre */
    .modal-container h2 {
      font-size: 24px;
      font-weight: bold;
      color: #3e3e3e;
      text-align: center;
      margin-bottom: 20px;
    }

    /* Formulaire */
    .modal-container form {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
    }

    /* Champs de formulaire */
    .modal-container input[type="text"],
    .modal-container input[type="email"],
    .modal-container input[type="date"],
    .modal-container input[type="number"],
    .modal-container input[type="file"] {
      flex: 1 1 calc(50% - 10px);
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
      box-sizing: border-box;
    }

    /* Champs pleine largeur */
    .modal-container input[type="file"] {
      flex: 1 1 100%;
    }

    /* Bouton */
    .modal-container button {
      padding: 10px 15px;
      background-color: #8b0000; /* Bordeaux */
      color: white;
      font-size: 16px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      flex: 1 1 100%; /* Bouton pleine largeur */
    }

    .modal-container button:hover {
      background-color: #7a001f; /* Darker Bordeaux */
    }

  `],
  providers: [CurrencyPipe],
})

export class InvoiceComponent implements OnInit {
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
    private route : ActivatedRoute
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
