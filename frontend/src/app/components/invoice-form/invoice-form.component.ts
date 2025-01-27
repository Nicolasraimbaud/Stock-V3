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
