import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Error } from '../models/error';
import { Parametro } from '../models/parametro';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/backerror";
  //private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  getAllBackError(codprogram: number): Observable<Error[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/personal/Programacion/${codprogram}`).pipe(
      map((response) => response as Error[])
    );
  }

  getAllBackErrorVacunacionPersonal(): Observable<Error[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/personal/vacunacion`).pipe(
      map((response) => response as Error[])
    );
  }

  getAllBackErrorProPersonal(): Observable<Error[]> {
    return this.http.get(`${this.URL_SISTEMA}/emo/list/program`).pipe(
      map((response) => response as Error[])
    );
  }

  getAllBackErrorEmo(): Observable<Error[]> {
    return this.http.get(`${this.URL_SISTEMA}/emo/list/emos`).pipe(
      map((response) => response as Error[])
    );
  }

  getAllBackErrorCapa(): Observable<Error[]> {
    return this.http.get(`${this.URL_SISTEMA}/capa/list/capas`).pipe(
      map((response) => response as Error[])
    );
  }

  getAllBackErrorProCapa(): Observable<Error[]> {
    return this.http.get(`${this.URL_SISTEMA}/procapa/list/procapas`).pipe(
      map((response) => response as Error[])
    );
  }

  getAllBackErrorCapaHist(): Observable<Error[]> {
    return this.http.get(`${this.URL_SISTEMA}/capa/list/capas/hist`).pipe(
      map((response) => response as Error[])
    );
  }


}
