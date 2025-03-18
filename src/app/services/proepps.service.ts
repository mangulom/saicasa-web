import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Parametro } from '../models/parametro';
import { Proepps } from '../models/proepps';

@Injectable({
  providedIn: 'root'
})
export class ProeppsService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/proepps";

  constructor(private http: HttpClient) { }

  getAllProEpps(usuario: string): Observable<Proepps[]> {
    return this.http.get(this.URL_SISTEMA + `/listBy/usuario/${usuario}`).pipe(
      map((response) => response as Proepps[])
    );
  }

  getProEppsById(id: number): Observable<Proepps> {
    return this.http.get<Proepps>(`${this.URL_SISTEMA}/findBy/id/${id}`)
  }

  saveProEpps(proepps: Proepps): Observable<Proepps> {
    return this.http.post<Proepps>(`${this.URL_SISTEMA}/save`, proepps);
  }

  deleteProEppsById(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/delete/id/${id}`)
  }

}
