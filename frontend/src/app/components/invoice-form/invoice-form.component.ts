import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  template: `
    <div class="form-container">
      <form [formGroup]="invoiceForm" (ngSubmit)="onSubmit()">
        <div class="form-grid">
          <div class="form-group">
            <label for="supplier">Fournisseur</label>
            <input id="supplier" type="text" formControlName="supplier" class="form-control" placeholder="Nom du fournisseur" />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" type="email" formControlName="email" class="form-control" placeholder="email@example.com" />
          </div>

          <div class="form-group">
            <label for="date">Date</label>
            <input id="date" type="date" formControlName="date" class="form-control" />
          </div>

          <div class="form-group">
            <label for="total">Prix Total</label>
            <input id="total" type="number" formControlName="total" class="form-control" placeholder="0.00" />
          </div>

          <div class="form-group">
            <label for="status">Statut</label>
            <input id="status" type="text" formControlName="status" class="form-control" placeholder="En attente" />
          </div>

          <div class="form-group file-upload">
            <label for="file">
              <i class="fas fa-file-pdf"></i>
              Fichier PDF
            </label>
            <input id="file" type="file" (change)="onFileSelected($event)" class="form-control" accept=".pdf" />
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-button">
            <i class="fas fa-save"></i>
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
      padding: 1.5rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .file-upload {
      grid-column: 1 / -1;
    }

    label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    label i {
      color: #8b0000;
    }

    .form-control {
      padding: 0.625rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .form-control:hover {
      border-color: #9ca3af;
    }

    .form-control:focus {
      outline: none;
      border-color: #8b0000;
      box-shadow: 0 0 0 2px rgba(139, 0, 0, 0.1);
    }

    input[type="file"] {
      padding: 0.375rem;
      cursor: pointer;
    }

    input[type="file"]::-webkit-file-upload-button {
      padding: 0.5rem 1rem;
      background: #8b0000;
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
      margin-right: 1rem;
    }

    input[type="file"]::-webkit-file-upload-button:hover {
      background: #7a001f;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .submit-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: #8b0000;
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .submit-button:hover {
      background: #7a001f;
      transform: translateY(-1px);
    }

    .submit-button:active {
      transform: translateY(0);
    }

    .submit-button i {
      font-size: 0.875rem;
    }

    @media (max-width: 640px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class InvoiceFormComponent {
  @Output() ocrResults = new EventEmitter<any>();
  invoiceForm: FormGroup;
  selectedFile: File | null = null;

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
