import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { WineService } from '../../services/wine.service';

@Component({
  selector: 'app-invoice-preview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-preview.component.html',
  styleUrls: ['./invoice-preview.component.css']
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