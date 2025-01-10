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

  private addWine(wine: Wine): Observable<Wine> {
    return this.http.post<Wine>(this.apiUrl, wine);
  }

  private updateExcel(wine: Wine): Observable<any> {
    return this.http.post(`${this.excelUrl}/export`, wine);
  }

  addWineAndUpdateExcel(wine: Wine): Observable<Wine> {
    return this.addWine(wine).pipe(
      switchMap((savedWine: Wine) => this.updateExcel(savedWine)),
      map(() => wine),
      catchError((error: any) => {
        console.error('Error:', error);
        throw error;
      })
    );
  }

  importExcelData(): Observable<any> {
    return this.http.get(`${this.excelUrl}/import`);
  }
}