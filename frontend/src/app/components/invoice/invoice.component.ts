import { Component } from '@angular/core';
import { InvoiceListComponent } from "../invoice-list/invoice-list.component";
import { InvoiceFormComponent } from "../invoice-form/invoice-form.component";
import { InvoicePreviewComponent } from "../invoice-preview/invoice-preview.component";

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [InvoiceListComponent, InvoiceFormComponent, InvoicePreviewComponent],
  template: `
    <div class="container">
        <app-invoice-list class="component"></app-invoice-list>
        <app-invoice-form class="component" (ocrResults)="handleOcrResults($event)"></app-invoice-form>
        <app-invoice-preview class="component" [ocrResults]="ocrData"></app-invoice-preview>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      gap: 20px;
    }

    .component {
      flex: 1;
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class InvoiceComponent {
  ocrData = { rows: [] };

  handleOcrResults(results: any): void {
    this.ocrData = results; // Mise à jour des résultats OCR dans le composant preview
  }
}
