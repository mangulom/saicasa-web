import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Dato } from '../models/dato';
import { Parametro } from '../models/parametro';

@Injectable({
  providedIn: 'root'
})
export class DatoService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/parametros";
  //private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  getDatos(): Observable<Dato> {
    return this.http.get<Dato>(`${this.URL_SISTEMA}/show`)
  }

}
