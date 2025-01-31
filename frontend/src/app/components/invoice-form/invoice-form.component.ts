import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.css']
})
export class InvoiceFormComponent {
  @Output() ocrResults = new EventEmitter<{ rows: { Domaine: string, Appellation: string, Qualite: string, Cuvee: string, Millesime: string, Unite: string, Quantite: number, PrixUnitaire: string, PrixTotal: string }[] }>();
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

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      this.selectedFile = target.files[0];
    }
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

    this.http.post('http://localhost:8080/api/ocr/read-file', formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * event.loaded / (event.total ?? 1));
        }
        if (event.type === HttpEventType.Response) {
          this.currentStep = 2;
          setTimeout(() => {
            this.currentStep = 3;
            setTimeout(() => {
              this.isProcessing = false;
              this.currentStep = 0;
              if (event.body) {
                this.ocrResults.emit(event.body as { rows: { Domaine: string, Appellation: string, Qualite: string, Cuvee: string, Millesime: string, Unite: string, Quantite: number, PrixUnitaire: string, PrixTotal: string }[] });
              }
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
