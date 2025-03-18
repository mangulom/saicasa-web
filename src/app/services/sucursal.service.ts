import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Parametro } from '../models/parametro';
import { Sucursal } from '../models/sucursal';
import { Sucursalusuario } from '../models/sucursalusuario';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/sucursalusuario";
  private URL_SISTEMA_SUCURSAL: string = Parametro.SISTEMA_URL + "sistema/sucursal";
  //private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  saveSucursal(sucursalusuario: Sucursalusuario): Observable<Sucursalusuario> {
    return this.http.post<Sucursalusuario>(`${this.URL_SISTEMA}/save`, sucursalusuario);
  }

  getAllSucursalByEmpresa(codempresa: string): Observable<Sucursal[]> {
    return this.http.get(`${this.URL_SISTEMA_SUCURSAL}/list/codempresa/${codempresa}`).pipe(
      map((response) => response as Sucursal[])
    );
  }

  getAllSucursalByUsuario(codusuario: string): Observable<Sucursal[]> {
    return this.http.get(`${this.URL_SISTEMA_SUCURSAL}/list/codusuario/${codusuario}`).pipe(
      map((response) => response as Sucursal[])
    );
  }

  getAllSucursalUsuarioByUsuario(codusuario: string): Observable<Sucursalusuario[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/codusuario/${codusuario}`).pipe(
      map((response) => response as Sucursalusuario[])
    );
  }

  getAllSucursalUsuarioByUsuarioAndEmpresa(codempresa: string, usuario: string): Observable<Sucursalusuario[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/codempresa/usuario/${codempresa}/${usuario}`).pipe(
      map((response) => response as Sucursalusuario[])
    );
  }

  deleteSucursalUsuario(codempresa: string, codsucursal: string, codusuario: string): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/delete/id/${codempresa}/${codsucursal}/${codusuario}`)
  }

  execProcSyncSucursal(): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA_SUCURSAL}/sync/sucursal`)
  }
}
