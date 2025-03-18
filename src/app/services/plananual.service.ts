import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Parametro } from '../models/parametro';
import { Plananual } from '../models/plananual';

@Injectable({
  providedIn: 'root'
})
export class PlananualService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/plananual";

  constructor(private http: HttpClient) { }

  getAllPlanAnual(usuario: string): Observable<Plananual[]> {
    return this.http.get(this.URL_SISTEMA + `/list/usuario/${usuario}`).pipe(
      map((response) => response as Plananual[])
    );
  }

  savePlananual(plananual: Plananual): Observable<Plananual> {
    return this.http.post<Plananual>(`${this.URL_SISTEMA}/save`, plananual);
  }

  getPlananualById(id: number): Observable<Plananual> {
    return this.http.get<Plananual>(`${this.URL_SISTEMA}/find/id/${id}`)
  }

  disabledPlanAnual(id: number, usuario: string): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/desactivar/id/${id}/usuario/${usuario}`)
  }

  enabledPlanAnual(id: number, usuario: string): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/activar/id/${id}/usuario/${usuario}`)
  }

  deletePlanAnualById(id: number, usuario: string): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/delete/id/${id}/usuario/${usuario}`)
  }

  CargarFilePlananual(form: FormData): Observable<number> {
    return this.http.post<number>(`${this.URL_SISTEMA}/upload/file/plananual`, form)
  }

  getPlananualOneArchivo(filename: string) {
    return this.http.get(`${this.URL_SISTEMA}/get/plananual/${filename}`, { responseType: 'blob' });
  }

}
