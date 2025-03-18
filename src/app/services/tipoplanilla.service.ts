import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Parametro } from '../models/parametro';
import { Tipoplanilla } from '../models/tipoplanilla';
import { Tipoplanillausuario } from '../models/tipoplanillausuario';

@Injectable({
  providedIn: 'root'
})
export class TipoplanillaService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/tipoplanilla";
  private URL_SISTEMA_USUARIO: string = Parametro.SISTEMA_URL + "sistema/tipoplanillausuario";
  //private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  getAllTipoPlanillaByUsuario(usuario: string, codempresa: string): Observable<Tipoplanilla[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/usuario/${usuario}/${codempresa}`).pipe(
      map((response) => response as Tipoplanilla[])
    );
  }

  getAllTipoPlanillaByEmpresa(codempresa: string): Observable<Tipoplanilla[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/empresa/${codempresa}`).pipe(
      map((response) => response as Tipoplanilla[])
    );
  }

  getAllTipoPlanillaUsByUsuarioAndEmpresa(usuario: string, codempresa: string): Observable<Tipoplanillausuario[]> {
    return this.http.get(`${this.URL_SISTEMA_USUARIO}/list/usuario/${usuario}/${codempresa}`).pipe(
      map((response) => response as Tipoplanillausuario[])
    );
  }

  saveTipoPlanillaUsuario(tipoPlanillaUsuario: Tipoplanillausuario): Observable<Tipoplanillausuario> {
    return this.http.post<Tipoplanillausuario>(`${this.URL_SISTEMA_USUARIO}/save`, tipoPlanillaUsuario);
  }

  deleteTipoPlanillaUsuario(codempresa: string, codtipo: string, codusuario: string): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA_USUARIO}/delete/id/${codempresa}/${codtipo}/${codusuario}`)
  }

  execProcSyncTipoPlanilla(): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/sync/tipoplanilla`)
  }

  execProcSyncTipoPlanillaParametros(codempresa: string, codusuario: string): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA_USUARIO}/sync/tipoplanilla/all/${codempresa}/${codusuario}`)
  }

  execProcSyncTipoPlanillaXUsuario(codusuario: string): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA_USUARIO}/sync/tipoplanilla/usuario/${codusuario}`)
  }

  deleteAllTipoPlanillaUsuario(codempresa: string, codusuario: string): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA_USUARIO}/delete/all/${codempresa}/${codusuario}`)
  }

}
