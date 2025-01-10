export interface Wine {
    id?: number;
    millesime: number;
    cuvee: string;
    domaine: string;
    appellation: string;
    region: string;
    country: string;
    pricetobuy: number;
    pricetosell: number;
    cost: number;
    quantity: number;
    updated: Date;
    supplier: string;
}