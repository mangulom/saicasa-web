import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Accidente } from '../models/accidente';
import { Parametro } from '../models/parametro';

@Injectable({
  providedIn: 'root'
})
export class AccidenteService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/accidente";
  //private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  getAllAccidente(usuario: string): Observable<Accidente[]> {
    return this.http.get(this.URL_SISTEMA + `/list/${usuario}`).pipe(
      map((response) => response as Accidente[])
    );
  }

  getAccidenteById(id: number): Observable<Accidente> {
    return this.http.get<Accidente>(`${this.URL_SISTEMA}/find/id/${id}`)
  }

  save(accidente: Accidente): Observable<Accidente> {
    return this.http.post<Accidente>(`${this.URL_SISTEMA}/save`, accidente);
  }

  saveDescanso(accidente: Accidente): Observable<Accidente> {
    return this.http.post<Accidente>(`${this.URL_SISTEMA}/save/descanso`, accidente);
  }

  deleteAccidente(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/delete/id/${id}`)
  }

  getFile() {
    return this.http.get(`${this.URL_SISTEMA}/download`, { responseType: 'blob' });
  }

  CargarFileAccidente(form: FormData): Observable<number> {
    return this.http.post<number>(`${this.URL_SISTEMA}/upload/file/accidentes`, form)
  }

  getAllAccidentesByCodigo(codigo: string, usuario: string): Observable<Accidente[]> {
    return this.http.get<Accidente[]>(`${this.URL_SISTEMA}/list/like/codigo/${codigo}/${usuario}`)
  }

  getAllAcciFechaIniAndFechaFin(fechaini: string, fechafin: string, usuario: string): Observable<Accidente[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/rango/${fechaini}/${fechafin}/${usuario}`).pipe(
      map((response) => response as Accidente[])
    );
  }

  getPdf(id: number) {
    return this.http.get(`${this.URL_SISTEMA}/pdf/export/accidente/${id}`, { responseType: 'blob' });
  }

  getExcelAccientesByFecha(fechaini: string, fechafin: string, usuario: string) {
    return this.http.get(`${this.URL_SISTEMA}/excel/export/rptaccidente/fecha/${fechaini}/${fechafin}/${usuario}`, { responseType: 'blob' });
  }


}
