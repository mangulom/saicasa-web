import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Parametro } from '../models/parametro';
import { Respacci } from '../models/respacci';

@Injectable({
  providedIn: 'root'
})
export class RespacciService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/respacci";

  constructor(private http: HttpClient) { }

  saveRespAcci(respacci: Respacci): Observable<Respacci> {
    return this.http.post<Respacci>(`${this.URL_SISTEMA}/save`, respacci);
  }

  deleteRespAcciById(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/delete/id/${id}`)
  }

  getAllRespAcciByAcci(codacci: number): Observable<Respacci[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/codacci/${codacci}`).pipe(
      map((response) => response as Respacci[])
    );
  }


}
