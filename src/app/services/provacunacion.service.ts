import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Parametro } from '../models/parametro';
import { Personal } from '../models/personal';
import { Provacunacion } from '../models/provacunacion';

@Injectable({
  providedIn: 'root'
})
export class ProvacunacionService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/provacunacion";

  //private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  saveProvacunacion(provacunacion: Provacunacion): Observable<Provacunacion> {
    return this.http.post<Provacunacion>(`${this.URL_SISTEMA}/save`, provacunacion);
  }

  getAllProvacunacion(usuario: string): Observable<Provacunacion[]> {
    return this.http.get(this.URL_SISTEMA + `/list/${usuario}`).pipe(
      map((response) => response as Provacunacion[])
    );
  }

  /*getAllProvacunacionFiltroTipVacuna(filtro: string): Observable<Provacunacion[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/pendientes/filtro/vacuna/${filtro}`).pipe(
      map((response) => response as Provacunacion[])
    );
  }*/

  /*getAllProvacunacionFiltroFecha(filtro: string, usuario: string): Observable<Provacunacion[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/pendientes/filtro/fecha/${filtro}`).pipe(
      map((response) => response as Provacunacion[])
    );
  }*/

  getAllProvacunacionPendientes(): Observable<Provacunacion[]> {
    return this.http.get(this.URL_SISTEMA + '/list/pendientes').pipe(
      map((response) => response as Provacunacion[])
    );
  }

  getProvacunacionById(id: number): Observable<Provacunacion> {
    return this.http.get<Provacunacion>(`${this.URL_SISTEMA}/find/id/${id}`)
  }

  deleteProvacunacionById(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/delete/id/${id}`)
  }

  getFile() {
    return this.http.get(`${this.URL_SISTEMA}/download/plantilla`, { responseType: 'blob' });
  }

  getAllVacunaCapaByTipoAndFechas(codtipo: number, fechaini: string, fechafin: string, usuario: string): Observable<Provacunacion[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/pro/tip/fec/${codtipo}/${fechaini}/${fechafin}/${usuario}`).pipe(
      map((response) => response as Provacunacion[])
    );
  }

}
