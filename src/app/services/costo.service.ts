import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Costo } from '../models/costo';
import { Costousuario } from '../models/costousuario';
import { Parametro } from '../models/parametro';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CostoService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/costos";
  private URL_COSTO_USUARIO: string = Parametro.SISTEMA_URL + "sistema/costosusuario";
  private URL_COSTO_FILTRO: string = Parametro.SISTEMA_URL + "sistema/filtrocostos";

  //private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  getAllCostosByUsuario(usuario: string, codempresa: string): Observable<Costo[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/usuario/${usuario}/${codempresa}`).pipe(
      map((response) => response as Costo[])
    );
  }

  getAllCostosUsByUsuarioAndEmpresa(usuario: string, codempresa: string): Observable<Costousuario[]> {
    //EDIT USUARIO
    return this.http.get(`${this.URL_COSTO_USUARIO}/list/usuario/${usuario}/${codempresa}`).pipe(
      map((response) => response as Costousuario[])
    );
  }

  getAllCostosUsuarioByUsuarioAndEmpresa(usuario: string, codempresa: string): Observable<Costousuario[]> {
    //LIST GRAFICO FILTRO
    return this.http.get(`${this.URL_COSTO_USUARIO}/list/usuario/${usuario}/${codempresa}`).pipe(
      map((response) => response as Costousuario[])
    );
  }

  saveCosto(costoUsuario: Costousuario): Observable<Costousuario> {
    return this.http.post<Costousuario>(`${this.URL_COSTO_USUARIO}/save`, costoUsuario);
  }

  saveCostoList(costoUsuario: Costousuario[]): Observable<number> {
    return this.http.post<number>(`${this.URL_COSTO_FILTRO}/save`, JSON.stringify(costoUsuario));
  }

  deleteSucursalUsuario(codempresa: string, codusuario: string, codccostos: string, numverccostos: string): Observable<number> {
    return this.http.get<number>(`${this.URL_COSTO_USUARIO}/delete/id/${codempresa}/${codusuario}/${codccostos}/${numverccostos}`)
  }

  execProcSyncCostosParametros(codempresa: string, codusuario: string): Observable<number> {
    return this.http.get<number>(`${this.URL_COSTO_USUARIO}/sync/costos/all/${codempresa}/${codusuario}`)
  }

  execProcSyncCostosXUsuario(codusuario: string): Observable<number> {
    return this.http.get<number>(`${this.URL_COSTO_USUARIO}/sync/costos/usuario/${codusuario}`)
  }

  execProcSyncCostos(): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/sync/costos`)
  }

  deleteAllCostosUsuario(codempresa: string , codusuario: string): Observable<number> {
    return this.http.get<number>(`${this.URL_COSTO_USUARIO}/delete/all/${codempresa}/${codusuario}`)
  }

  deleteDataFiltroCosto(token: string): Observable<number> {
    return this.http.get<number>(`${this.URL_COSTO_FILTRO}/delete/${token}`)
  }
}
