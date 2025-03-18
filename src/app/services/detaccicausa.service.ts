import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Detaccicausa } from '../models/detaccicausa';
import { Parametro } from '../models/parametro';
import { Tabladetalle } from '../models/tabladetalle';

@Injectable({
  providedIn: 'root'
})
export class DetaccicausaService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/detaccicausa";

  constructor(private http: HttpClient) { }

  getAllActoInsegByAcci(codacci: number): Observable<Tabladetalle[]> {
    return this.http.get<Tabladetalle[]>(`${this.URL_SISTEMA}/list/acci/acto/${codacci}`)
  }

  getAllCondInsegByAcci(codacci: number): Observable<Tabladetalle[]> {
    return this.http.get<Tabladetalle[]>(`${this.URL_SISTEMA}/list/acci/cond/${codacci}`)
  }

  getAllFactorPersonalByAcci(codacci: number): Observable<Tabladetalle[]> {
    return this.http.get<Tabladetalle[]>(`${this.URL_SISTEMA}/list/acci/facper/${codacci}`)
  }

  getAllFactorLaboralByAcci(codacci: number): Observable<Tabladetalle[]> {
    return this.http.get<Tabladetalle[]>(`${this.URL_SISTEMA}/list/acci/faclab/${codacci}`)
  }

  save(causa: Detaccicausa): Observable<Detaccicausa> {
    return this.http.post<Detaccicausa>(`${this.URL_SISTEMA}/save`, causa);
  }

}
