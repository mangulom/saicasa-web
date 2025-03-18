import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Epps } from '../models/epps';
import { Parametro } from '../models/parametro';

@Injectable({
  providedIn: 'root'
})
export class EppsService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/epps";

  constructor(private http: HttpClient) { }

  getAllEpps(): Observable<Epps[]> {
    return this.http.get(this.URL_SISTEMA + '/list').pipe(
      map((response) => response as Epps[])
    );
  }

  getAllEppsByIdTipo(id: number): Observable<Epps[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/idtipo/${id}`).pipe(
      map((response) => response as Epps[])
    );
  }

  getEppsById(id: number): Observable<Epps> {
    return this.http.get<Epps>(`${this.URL_SISTEMA}/findBy/id/${id}`)
  }

  saveEpps(epps: Epps): Observable<Epps> {
    return this.http.post<Epps>(`${this.URL_SISTEMA}/save`, epps);
  }

  disableById(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/disableBy/id/${id}`)
  }

  enableById(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/enableBy/id/${id}`)
  }


}
