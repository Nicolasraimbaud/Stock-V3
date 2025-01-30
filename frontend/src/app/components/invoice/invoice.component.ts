import { Component } from '@angular/core';
import { InvoiceListComponent } from '../invoice-list/invoice-list.component';
import { InvoiceFormComponent } from '../invoice-form/invoice-form.component';
import { InvoicePreviewComponent } from '../invoice-preview/invoice-preview.component';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [InvoiceListComponent, InvoiceFormComponent, InvoicePreviewComponent, RouterModule],
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent {
  ocrData = { rows: [] };

  constructor(private router: Router) {}

  handleOcrResults(results: any): void {
    this.ocrData = results;
  }

  validateChanges(): void {
    this.router.navigate(['/', 'invoices']);
  }
}
