import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Parametro } from '../models/parametro';
import { Procomite } from '../models/procomite';

@Injectable({
  providedIn: 'root'
})
export class ProcomiteService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/procomite";

  constructor(private http: HttpClient) { }

  getAllProComite(usuario: string): Observable<Procomite[]> {
    return this.http.get(this.URL_SISTEMA + `/list/usuario/${usuario}`).pipe(
      map((response) => response as Procomite[])
    );
  }

  getProComiteById(id: number): Observable<Procomite> {
    return this.http.get<Procomite>(`${this.URL_SISTEMA}/find/id/${id}`)
  }

  deleteProComiteById(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/delete/id/${id}`)
  }

  saveProComite(procomite: Procomite): Observable<Procomite> {
    return this.http.post<Procomite>(`${this.URL_SISTEMA}/save`, procomite);
  }

  CargarFileProComite(form: FormData): Observable<number> {
    return this.http.post<number>(`${this.URL_SISTEMA}/upload/file/procomite`, form)
  }

  getPoliticaOneArchivo(filename: string) {
    return this.http.get(`${this.URL_SISTEMA}/get/procomite/${filename}`, { responseType: 'blob' });
  }

  CargarFileProComiteActa(form: FormData): Observable<number> {
    return this.http.post<number>(`${this.URL_SISTEMA}/upload/file/procomiteacta`, form)
  }

}
