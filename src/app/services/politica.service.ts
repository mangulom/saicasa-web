import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Parametro } from '../models/parametro';
import { Politica } from '../models/politica';

@Injectable({
  providedIn: 'root'
})
export class PoliticaService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/politica";

  constructor(private http: HttpClient) { }

  getAllPolitica(usuario: string): Observable<Politica[]> {
    return this.http.get(this.URL_SISTEMA + `/list/usuario/${usuario}`).pipe(
      map((response) => response as Politica[])
    );
  }

  savePolitica(politica: Politica): Observable<Politica> {
    return this.http.post<Politica>(`${this.URL_SISTEMA}/save`, politica);
  }

  getPolitcaById(id: number): Observable<Politica> {
    return this.http.get<Politica>(`${this.URL_SISTEMA}/find/id/${id}`)
  }

  deletePolitica(id: number, usuario: string): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/delete/id/${id}/usuario/${usuario}`)
  }

  CargarFilePolitica(form: FormData): Observable<number> {
    return this.http.post<number>(`${this.URL_SISTEMA}/upload/file/politica`, form)
  }

  getPoliticaOneArchivo(filename: string) {
    return this.http.get(`${this.URL_SISTEMA}/get/politica/${filename}`, { responseType: 'blob' });
  }


}
