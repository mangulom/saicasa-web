import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Matriz } from '../models/matriz';
import { Parametro } from '../models/parametro';

@Injectable({
  providedIn: 'root'
})
export class MatrizService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/matriz";

  constructor(private http: HttpClient) { }

  getAllMatriz(usuario: string): Observable<Matriz[]> {
    return this.http.get(this.URL_SISTEMA + `/list/usuario/${usuario}`).pipe(
      map((response) => response as Matriz[])
    );
  }

  saveMatriz(matriz: Matriz): Observable<Matriz> {
    return this.http.post<Matriz>(`${this.URL_SISTEMA}/save`, matriz);
  }

  getMatrizById(id: number): Observable<Matriz> {
    return this.http.get<Matriz>(`${this.URL_SISTEMA}/find/id/${id}`)
  }

  disabledMatriz(id: number, usuario: string): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/desactivar/id/${id}/usuario/${usuario}`)
  }

  enabledMatriz(id: number, usuario: string): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/activar/id/${id}/usuario/${usuario}`)
  }

  deleteMatrizById(id: number, usuario: string): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/delete/id/${id}/usuario/${usuario}`)
  }

  CargarFileMatriz(form: FormData): Observable<number> {
    return this.http.post<number>(`${this.URL_SISTEMA}/upload/file/matriz`, form)
  }

  getMatrizOneArchivo(filename: string) {
    return this.http.get(`${this.URL_SISTEMA}/get/matriz/${filename}`, { responseType: 'blob' });
  }

}
