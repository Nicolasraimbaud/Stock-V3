export interface Invoice {
    id?: number;               // ID de la facture (optionnel)
    date: string;                // Date de la facture
    supplier: string;          // Fournisseur
    email: string;             // Email du fournisseur
    total: number;             // Prix total
    status: string;            // Statut de la facture
    pdfFileName: string;       // Nom du fichier PDF lié
    rows: OcrRow[];            // Lignes OCR extraites
    saving?: boolean;          // Indicateur de sauvegarde en cours
}

// Modèle pour une ligne OCR
export interface OcrRow {
    description: string;       // Description du vin ou produit
    domaine: string;           // Domaine du vin
    appellation: string;       // Appellation
    cuvee: string;             // Cuvée
    millesime: string;         // Millésime
    qualite: string;           // Qualité (Grand Cru, Premier Cru, etc.)
    unite: string;             // Unité (ex : 75 cl)
    quantite: number;          // Quantité
    prixUnitaire: number;      // Prix unitaire
    prixTotal: number;         // Prix total
}
