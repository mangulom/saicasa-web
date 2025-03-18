import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cargo } from '../models/cargo';
import { Parametro } from '../models/parametro';

@Injectable({
  providedIn: 'root'
})
export class CargoService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/cargo";
  //private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  getAllCargo(): Observable<Cargo[]> {
    return this.http.get(this.URL_SISTEMA + '/list').pipe(
      map((response) => response as Cargo[])
    );
  }

  getAllCargoByEmpresa(codempresa: string): Observable<Cargo[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/codempresa/${codempresa}`).pipe(
      map((response) => response as Cargo[])
    );
  }


}
