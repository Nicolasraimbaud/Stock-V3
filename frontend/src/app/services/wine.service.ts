import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map, catchError} from 'rxjs';
import { Wine } from '../models/wine';

@Injectable({
  providedIn: 'root'
})
export class WineService {
  private apiUrl = 'http://localhost:8080/api/wines';
  private excelUrl = 'http://localhost:8080/api/excel';

  constructor(private http: HttpClient) { }

  getWines(): Observable<Wine[]> {
    return this.http.get<Wine[]>(this.apiUrl);
  }

  /* Import all excel data to the database */
  importExcelData(): Observable<any> {
    return this.http.get(`${this.excelUrl}/import`);
  }

  /* Mise à jour du fichier Excel avec plusieurs vins */
  updateExcelList(wines: Wine[]): Observable<any> {
    return this.http.post(`${this.excelUrl}/export-batch`, wines).pipe(
    map(() => wines),
    catchError((error: any) => {
        console.error('Error updating Excel:', error);
        throw error;
    })
    );
  }
}