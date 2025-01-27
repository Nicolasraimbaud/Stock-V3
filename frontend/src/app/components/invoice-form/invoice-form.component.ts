import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
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

          <div class="form-group file-upload">
            <label for="file">
              <i class="fas fa-file-pdf"></i>
              Fichier PDF
            </label>
            <input id="file" type="file" (change)="onFileSelected($event)" class="form-control" accept=".pdf" />
            <div *ngIf="selectedFile" class="file-name">{{ selectedFile.name }}</div>
          </div>

          <div *ngIf="isProcessing" class="progress-section">
            <div class="steps">
              <div class="step" [class.active]="currentStep >= 1" [class.completed]="currentStep > 1">
                <div class="step-icon">
                  <i class="fas fa-sm" [class.fa-spinner]="currentStep === 1" [class.fa-spin]="currentStep === 1" 
                     [class.fa-check]="currentStep > 1"></i>
                </div>
                <div class="step-content">
                  <div class="step-label">Chargement</div>
                  <div *ngIf="currentStep === 1" class="progress-bar">
                    <div class="progress-fill" [style.width.%]="uploadProgress"></div>
                  </div>
                </div>
              </div>

              <div class="step-connector" [class.active]="currentStep >= 2"></div>

              <div class="step" [class.active]="currentStep >= 2" [class.completed]="currentStep > 2">
                <div class="step-icon">
                  <i class="fas fa-sm" [class.fa-spinner]="currentStep === 2" [class.fa-spin]="currentStep === 2"
                     [class.fa-check]="currentStep > 2"></i>
                </div>
                <div class="step-content">
                  <div class="step-label">OCR</div>
                </div>
              </div>

              <div class="step-connector" [class.active]="currentStep >= 3"></div>

              <div class="step" [class.active]="currentStep >= 3" [class.completed]="currentStep > 3">
                <div class="step-icon">
                  <i class="fas fa-sm" [class.fa-spinner]="currentStep === 3" [class.fa-spin]="currentStep === 3"
                     [class.fa-check]="currentStep > 3"></i>
                </div>
                <div class="step-content">
                  <div class="step-label">Extraction</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-button" [disabled]="!selectedFile || isProcessing">
            <i class="fas" [class.fa-upload]="!isProcessing" [class.fa-spinner]="isProcessing" [class.fa-spin]="isProcessing"></i>
            {{ isProcessing ? 'Traitement en cours...' : 'Analyser' }}
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

    .file-name {
      font-size: 0.875rem;
      color: #6b7280;
      margin-top: 0.5rem;
    }

    .progress-section {
      grid-column: 1 / -1;
      padding: 0.75rem;
      background: #f8fafc;
      border-radius: 0.375rem;
      margin-top: 0.75rem;
    }

    .steps {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .step {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      color: #9ca3af;
      font-size: 0.75rem;
      transition: all 0.3s ease;
    }

    .step.active {
      color: #8b0000;
    }

    .step.completed {
      color: #059669;
    }

    .step-icon {
      width: 1.25rem;
      height: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: currentColor;
      color: white;
      font-size: 0.625rem;
    }

    .step-content {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .step-label {
      font-weight: 500;
      white-space: nowrap;
    }

    .step-connector {
      flex: 1;
      height: 1px;
      background: #e5e7eb;
      transition: all 0.3s ease;
    }

    .step-connector.active {
      background: #8b0000;
    }

    .progress-bar {
      width: 3rem;
      height: 0.125rem;
      background: #e5e7eb;
      border-radius: 9999px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: currentColor;
      transition: width 0.3s ease;
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

    .submit-button:disabled {
      background: #d1d5db;
      cursor: not-allowed;
    }

    .submit-button:not(:disabled):hover {
      background: #7a001f;
    }
  `]
})
export class InvoiceFormComponent {
  @Output() ocrResults = new EventEmitter<any>();
  invoiceForm: FormGroup;
  selectedFile: File | null = null;
  isProcessing = false;
  currentStep = 0;
  uploadProgress = 0;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.invoiceForm = this.fb.group({
      supplier: [''],
      email: ['']
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

    this.isProcessing = true;
    this.currentStep = 1;
    this.uploadProgress = 0;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('supplier', this.invoiceForm.get('supplier')?.value || '');
    formData.append('email', this.invoiceForm.get('email')?.value || '');

    // Appel à l'API OCR avec gestion de la progression
    this.http.post('http://localhost:8080/api/ocr/read-file', formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
        }
        if (event.type === HttpEventType.Response) {
          // Simulation des étapes OCR
          this.currentStep = 2;
          setTimeout(() => {
            this.currentStep = 3;
            setTimeout(() => {
              this.isProcessing = false;
              this.currentStep = 0;
              this.ocrResults.emit(event.body);
            }, 1000);
          }, 1000);
        }
      },
      error: (error) => {
        console.error('Erreur lors du traitement OCR', error);
        this.isProcessing = false;
        this.currentStep = 0;
      }
    });
  }
}
