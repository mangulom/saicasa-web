import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Parametro } from '../models/parametro';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/usuario";
  //private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  private _usuario: Usuario;
  
  constructor(private http: HttpClient) { }

  getUsuarioSession(): string {
    if (JSON.parse(sessionStorage.getItem('usuario'))) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      if (this._usuario.usuario != null) {
        return this._usuario.usuario;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  getAllUsuario(): Observable<Usuario[]> {
    return this.http.get(this.URL_SISTEMA + '/list').pipe(
      map((response) => response as Usuario[])
    );
  }

  getAllUsuarioByNombre(search: string): Observable<Usuario[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/nombre/${search}`).pipe(
      map((response) => response as Usuario[])
    );
  }

  getUsuarioByUsuario(usuario: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.URL_SISTEMA}/find/usuario/${usuario}`)
  }

  saveUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.URL_SISTEMA}/save`, usuario);
  }

  enableUsuario(usuario: Usuario): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/enable/id/${usuario.usuario}`)
  }

  disableUsuario(usuario: Usuario): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/disable/id/${usuario.usuario}`)
  }

  findCountUsuario(usuario: Usuario): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/findcount/usuario/${usuario.usuario}`)
  }
}
