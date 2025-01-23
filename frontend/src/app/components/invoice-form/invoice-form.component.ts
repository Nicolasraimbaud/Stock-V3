import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  template: `
    <h2>Ajouter une Facture</h2>
    <form [formGroup]="invoiceForm" (ngSubmit)="onSubmit()">
      <input type="text" formControlName="supplier" placeholder="Fournisseur" required />
      <input type="email" formControlName="email" placeholder="Email" required />
      <input type="date" formControlName="date" required />
      <input type="number" formControlName="total" placeholder="Prix Total" required />
      <input type="text" formControlName="status" placeholder="Statut" />
      <input type="file" (change)="onFileSelected($event)" required />
      <button type="submit">Enregistrer</button>
    </form>
  `,
  styles: [`
    .form-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    form {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      width: 100%;
      max-width: 1200px;
      align-items: center;
    }

    input, button {
      flex: 1 1 calc(16% - 15px);
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 16px;
    }

    input[type="file"] {
      flex: 2 1 calc(32% - 15px);
    }

    button {
      flex: 1 1 calc(10% - 15px);
      background-color: #8b0000;
      color: white;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    button:hover {
      background-color: #7a001f;
    }

    h2 {
      font-size: 24px;
      color: #3e3e3e;
      font-weight: bold;
      text-align: center;
      margin-bottom: 20px;
    }
  `]
})
export class InvoiceFormComponent {
  invoiceForm: FormGroup;
  selectedFile: File | null = null;

  @Output() ocrResults = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.invoiceForm = this.fb.group({
      supplier: [''],
      email: [''],
      date: [''],
      total: [''],
      status: ['']
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (!this.selectedFile) {
      console.error('Aucun fichier sélectionné');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    // Appel direct à l'API OCR
    this.http.post('http://localhost:8080/api/ocr/read-file', formData).subscribe(
      (response) => {
        console.log('Résultats OCR obtenus :', response);
        this.ocrResults.emit(response);  // Envoyer les résultats au parent pour affichage
      },
      (error) => {
        console.error('Erreur lors du traitement OCR', error);
      }
    );
  }
}
