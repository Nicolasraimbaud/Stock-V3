import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-invoice-preview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Prévisualisation des Factures</h2>
    <table class="result-table">
      <thead>
        <tr>
          <th>Domaine</th>
          <th>Appellation</th>
          <th>Qualité</th>
          <th>Cuvée</th>
          <th class="auto-resize-millesime">Millésime</th>
          <th class="auto-resize-unite">Unité</th>
          <th class="auto-resize-quantite">Quantité</th>
          <th class="auto-resize-prix-unitaire">PrixUnitaire</th>
          <th class="auto-resize-prix-total">PrixTotal</th>
        </tr>
      </thead>
      <tbody *ngIf="ocrResults && ocrResults.rows">
        <tr *ngFor="let row of ocrResults.rows; let i = index">
          <td><input [(ngModel)]="row.Domaine" class="auto-resize" /></td>
          <td><input [(ngModel)]="row.Appellation" class="auto-resize" /></td>
          <td><input [(ngModel)]="row.Qualite" class="auto-resize" /></td>
          <td><input [(ngModel)]="row.Cuvee" class="auto-resize" /></td>
          <td><input [(ngModel)]="row.Millesime" class="auto-resize-millesime" /></td>
          <td><input [(ngModel)]="row.Unite" class="auto-resize-unite" /></td>
          <td><input [(ngModel)]="row.Quantite" class="auto-resize-quantite" /></td>
          <td><input [(ngModel)]="row.PrixUnitaire" class="auto-resize-prix-unitaire" /></td>
          <td><input [(ngModel)]="row.PrixTotal" class="auto-resize-prix-total" /></td>
        </tr>
      </tbody>
    </table>
    <button (click)="validateChanges()">Valider</button>
  `,
  styles: [`
    .result-table { 
      width: 100%; 
      border-collapse: collapse; 
      text-align: left;
    }
    th, td {
      padding: 10px;
      border: 1px solid #ddd;
      text-align: center;
      white-space: nowrap;  /* Empêche le retour à la ligne dans les cellules */
    }
    th {
      background-color: #8b0000;
      color: white;
    }

    .auto-resize {
      width: 98%;  /* Ajuste la largeur en fonction du contenu */
    }

    /* Définition des largeurs basées sur le nombre de caractères */
    .auto-resize-millesime {
      width: 10ch;  /* Par exemple, pour afficher 6 caractères */
    }

    .auto-resize-unite {
      width: 5ch;  /* Ajuster en fonction du contenu */
    }

    .auto-resize-quantite {
      width: 8ch;
    }

    .auto-resize-prix-unitaire {
      width: 12ch;
    }

    .auto-resize-prix-total {
      width: 12ch;
    }

    button {
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #8b0000;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    button:hover {
      background-color: #7a001f;
    }
  `]
})
export class InvoicePreviewComponent {
  @Input() ocrResults: { 
    rows: { 
      Domaine: string, Appellation: string, Qualite: string, 
      Cuvee: string, Millesime: string, Unite: string, 
      Quantite: number, PrixUnitaire: number, PrixTotal: number 
    }[] } = { rows: [] };

    constructor(private http: HttpClient) {}

    validateChanges(): void {
      this.http.post('http://localhost:8080/api/excel/export', this.ocrResults)
      .subscribe({
        next: (response) => {
          console.log('Données envoyées avec succès', response);
        },
        error: (error) => {
          console.error('Erreur lors de l\'envoi des données', error);
        },
        complete: () => {
          console.log('Requête terminée.');
        }
      });
    }
}
