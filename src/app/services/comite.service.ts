import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Comite } from '../models/comite';
import { Parametro } from '../models/parametro';

@Injectable({
  providedIn: 'root'
})
export class ComiteService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/comite";

  constructor(private http: HttpClient) { }

  saveComite(comite: Comite): Observable<Comite> {
    return this.http.post<Comite>(`${this.URL_SISTEMA}/save`, comite);
  }

  getAllComiteByProgram(codprogram: number): Observable<Comite[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/codprogram/${codprogram}`).pipe(
      map((response) => response as Comite[])
    );
  }

  deleteComiteById(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/delete/id/${id}`)
  }

}
