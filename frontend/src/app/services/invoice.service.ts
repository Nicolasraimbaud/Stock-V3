import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../models/invoice';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private baseUrl = 'http://localhost:8080/api/invoices';

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer les factures
  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.baseUrl);
  }

  // Méthode pour ajouter une facture
  addInvoice(formData: FormData): Observable<Invoice> {
    return this.http.post<Invoice>(this.baseUrl, formData);
  }

  processInvoice(formData: FormData): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/process`, formData);
  }

  saveUpdatedRows(rows: Invoice[]): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/save`, { rows });
  }

  processOcrFile(formData: FormData): Observable<Invoice[]> {
    return this.http.post<Invoice[]>(`${this.baseUrl}/process-ocr`, formData);
  }

  updateInvoiceStatus(invoiceId: number, status: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${invoiceId}/status`, { status });
  }

  deleteInvoice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}