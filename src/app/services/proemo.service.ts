import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Parametro } from '../models/parametro';
import { Proemo } from '../models/proemo';

@Injectable({
  providedIn: 'root'
})
export class ProemoService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/progemo";

  //private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }
  
  getAllEmo(usuario: string): Observable<Proemo[]> {
    return this.http.get(this.URL_SISTEMA + `/list/${usuario}`).pipe(
      map((response) => response as Proemo[])
    );
  }

  saveProEmo(proemo: Proemo): Observable<Proemo> {
    return this.http.post<Proemo>(`${this.URL_SISTEMA}/save`, proemo);
  }

  getProEmoById(id: number): Observable<Proemo> {
    return this.http.get<Proemo>(`${this.URL_SISTEMA}/find/id/${id}`)
  }

  deleteProEmoById(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/delete/id/${id}`)
  }

  getExcelPlantillaProEmo() {
    return this.http.get(`${this.URL_SISTEMA}/download/plantilla`, { responseType: 'blob' });
  }

  getAllProEmoByTipoAndFechas(codtipo: number, fechaini: string, fechafin: string, usuario: string): Observable<Proemo[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/pro/tip/fec/${codtipo}/${fechaini}/${fechafin}/${usuario}`).pipe(
      map((response) => response as Proemo[])
    );
  }

}
