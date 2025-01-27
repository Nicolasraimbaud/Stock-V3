import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { WineService } from '../../services/wine.service';

@Component({
  selector: 'app-invoice-preview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="preview-container">
      <div class="table-container">
        <table class="result-table">
          <thead>
            <tr>
              <th>Domaine</th>
              <th>Appellation</th>
              <th>Qualité</th>
              <th>Cuvée</th>
              <th>Millésime</th>
              <th>Unité</th>
              <th>Quantité</th>
              <th>Prix Unitaire</th>
              <th>Prix Total</th>
            </tr>
          </thead>
          <tbody *ngIf="ocrResults && ocrResults.rows">
            <tr *ngFor="let row of ocrResults.rows; let i = index">
              <td><input [(ngModel)]="row.Domaine" class="editable-field" /></td>
              <td><input [(ngModel)]="row.Appellation" class="editable-field" /></td>
              <td><input [(ngModel)]="row.Qualite" class="editable-field" /></td>
              <td><input [(ngModel)]="row.Cuvee" class="editable-field" /></td>
              <td><input [(ngModel)]="row.Millesime" class="editable-field numeric-field" /></td>
              <td><input [(ngModel)]="row.Unite" class="editable-field numeric-field" /></td>
              <td><input [(ngModel)]="row.Quantite" class="editable-field numeric-field" /></td>
              <td><input [(ngModel)]="row.PrixUnitaire" class="editable-field numeric-field" /></td>
              <td><input [(ngModel)]="row.PrixTotal" class="editable-field numeric-field" /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="actions">
        <button class="validate-button" (click)="validateChanges()">
          <i class="fas fa-check"></i>
          Valider
        </button>
      </div>
    </div>
  `,
  styles: [`
    .preview-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      height: 100%;
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
      overflow: hidden;
    }

    .table-container {
      flex: 1;
      overflow: auto;
      padding: 1rem;
    }

    .result-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      font-size: 0.875rem;
    }

    .result-table th {
      position: sticky;
      top: 0;
      background: #8b0000;
      color: white;
      font-weight: 600;
      text-align: left;
      padding: 0.75rem;
      border-bottom: 2px solid #7a001f;
      white-space: nowrap;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
    }

    .result-table td {
      padding: 0.5rem;
      border-bottom: 1px solid #e5e7eb;
      background: white;
      transition: background-color 0.2s;
    }

    .result-table tr:hover td {
      background: #f8fafc;
    }

    .editable-field {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid transparent;
      border-radius: 0.375rem;
      background: transparent;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .editable-field:hover {
      border-color: #e5e7eb;
      background: white;
    }

    .editable-field:focus {
      outline: none;
      border-color: #8b0000;
      background: white;
      box-shadow: 0 0 0 2px rgba(139, 0, 0, 0.1);
    }

    .numeric-field {
      text-align: right;
      font-variant-numeric: tabular-nums;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      padding: 1rem;
      background: #f8fafc;
      border-top: 1px solid #e5e7eb;
    }

    .validate-button {
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

    .validate-button:hover {
      background: #7a001f;
      transform: translateY(-1px);
    }

    .validate-button:active {
      transform: translateY(0);
    }

    .validate-button i {
      font-size: 0.875rem;
    }
  `]
})
export class InvoicePreviewComponent {
  @Input() ocrResults: { 
    rows: { 
      Domaine: string, Appellation: string, Qualite: string, 
      Cuvee: string, Millesime: string, Unite: string, 
      Quantite: number, PrixUnitaire: string, PrixTotal: string 
    }[] 
  } = { rows: [] };

  constructor(private http: HttpClient, private wineService: WineService) {}

  validateChanges(): void {
    const winesToSave = this.ocrResults.rows.map(row => ({
      domaine: row.Domaine || '',
      appellation: row.Appellation || '',
      qualite: row.Qualite || '',
      cuvee: row.Cuvee || '',
      millesime: row.Millesime === 'NM' ? 0 : (Number(row.Millesime) || 0),
      unite: row.Unite || '',
      quantity: Number(row.Quantite) || 0,
      pricetobuy: this.convertToNumber(row.PrixUnitaire),
      pricetosell: 0,
      updated: new Date(),
      supplier: '',
      country: '',
      region: '',
      cost: 0
    }));

    // Vérification des valeurs avant envoi
    console.log('Vérification avant envoi :');
    winesToSave.forEach((wine, index) => {
      console.log(`Vin ${index + 1}:`, {
        Domaine: wine.domaine,
        Appellation: wine.appellation,
        Cuvee: wine.cuvee,
        Millesime: wine.millesime,
        PrixUnitaire: wine.pricetobuy,
        Quantité: wine.quantity
      });
    });

    console.log('Données filtrées valides à envoyer:', JSON.stringify(winesToSave, null, 2));

    this.wineService.updateExcelList(winesToSave)
      .subscribe({
        next: () => {
          console.log('Liste de vins ajoutée et fichier Excel mis à jour.');
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout des vins ou mise à jour du fichier Excel', error);
          alert('Erreur lors de l\'envoi des données. Consultez la console pour plus d\'informations.');
        }
      });
  }

  convertToNumber = (value: string): number => {
    const cleanedValue = value.replace(',', '.'); // Remplacer la virgule par un point
    const numberValue = Number(cleanedValue);
    return isNaN(numberValue) ? 0.0 : numberValue; // Si c'est NaN, retourne 0.0
  };
}