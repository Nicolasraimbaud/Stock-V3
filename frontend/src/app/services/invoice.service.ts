import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map, catchError} from 'rxjs';
import { Wine } from '../models/wine';
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

  processInvoice(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/process`, formData);
  }

  saveUpdatedRows(rows: any[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/save`, { rows });
  }

  processOcrFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/process-ocr`, formData);
  }

  updateInvoiceStatus(invoiceId: number, status: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${invoiceId}/status`, { status });
  }
}