import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../models/invoice';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {
  @ViewChild('addInvoiceModal') addInvoiceModal!: TemplateRef<Invoice>;
  @ViewChild('ocrResultsModal') ocrResultsModal!: TemplateRef<Invoice>;
  invoices: Invoice[] = [];
  invoiceForm: FormGroup;
  selectedFile: File | null = null;
  results: Invoice[] = [];
  searchTerm = '';
  statusOptions = [
    { value: 'en_cours', label: 'En Cours' },
    { value: 'a_regler', label: 'À Régler' },
    { value: 'termine', label: 'Terminé' }
  ];

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
      status: ['en_cours'],
    });
  }

  ngOnInit(): void {
    this.route.url.subscribe(() => {
      this.loadInvoices();
    });
  }

  loadInvoices(): void {
    console.log('Début du chargement des factures...');
    this.invoiceService.getInvoices().subscribe({
      next: (data) => {
        console.log('Factures reçues :', data);
        this.invoices = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des factures :', error);
      },
      complete: () => {
        console.log('Chargement des factures terminé');
      },
    });
  }

  openAddInvoiceModal(): void {
    this.dialog.open(this.addInvoiceModal);
  }

  openOcrResultsModal(): void {
    this.dialog.open(this.ocrResultsModal, {
      width: '80%',
      data: { results: this.results },
    });
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectedFile = target.files?.[0] || null;
  }

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
      (response: Invoice[]) => {
        console.log('Résultats OCR obtenus avec succès', response);
        this.results = response;
        this.dialog.closeAll();
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
        this.results = [];
        this.loadInvoices();
      },
      error: (error) => {
        console.error('Erreur lors de l\'enregistrement des données :', error);
      },
    });
  }

  updateInvoiceStatus(invoice: Invoice, newStatus: string): void {
    if (invoice.id === undefined) {
      console.error('Cannot update status: Invoice ID is undefined');
      return;
    }

    const oldStatus = invoice.status;
    invoice.status = newStatus;
    invoice.saving = true;

    this.invoiceService.updateInvoiceStatus(invoice.id, newStatus).subscribe({
      next: () => {
        console.log('Statut mis à jour avec succès');
        invoice.saving = false;
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du statut:', error);
        invoice.status = oldStatus;
        invoice.saving = false;
      }
    });
  }

  deleteInvoice(invoiceId: number): void {
    this.invoiceService.deleteInvoice(invoiceId).subscribe({
      next: () => {
        console.log('Facture supprimée avec succès');
        this.loadInvoices();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression de la facture:', error);
      }
    });
  }
}
