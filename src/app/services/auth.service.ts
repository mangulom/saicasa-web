import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Acceso } from '../models/acceso';
import { Menu } from '../models/menu';
import { Parametro } from '../models/parametro';
import { Submenu } from '../models/submenu';
import { Usuario } from '../models/usuario';
import { Funcion } from '../models/funcion';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL_SISTEMA_PERFIL: string = Parametro.SISTEMA_URL + "sistema/perfil";
  private URL_SISTEMA_MENU: string = Parametro.SISTEMA_URL + "sistema/fgrupo";
  private URL_SISTEMA_SUBMENU: string = Parametro.SISTEMA_URL + "sistema/funcion";
  private URL_SISTEMA_ACCESO_RES: string = Parametro.SISTEMA_URL + "sistema/acceso";
  private URL_SISTEMA_AUTH: string = Parametro.SISTEMA_URL + "security/oauth/token";
  private _usuario: Usuario;
  private _token: string;

  //private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }


  public get usuario(): Usuario {
    if (this._usuario != null) {
      return this._usuario;
    } else if (this._usuario == null && sessionStorage.getItem('usuario') != null) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  login(usuario: Usuario): Observable<any> {
    const credenciales = btoa('angular-app' + ':' + '1323');
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + credenciales
    });

    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.usuario);
    params.set('password', usuario.password);
    //console.log(params.toString());
    return this.http.post<any>(this.URL_SISTEMA_AUTH, params.toString(), { headers: httpHeaders });
  }

  guardarUsuario(accessToken: string): void {
    let payload = this.getValuesToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.nombre = payload.nombre;
    this._usuario.usuario = payload.user_name;
    this._usuario.roles = payload.authorities;
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  guardarToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
  }

  getValuesToken(accessToken: string): any {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }

  isAuthenticated(): boolean {
    let payload = this.getValuesToken(this.token);
    if (payload != null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }
    return false;
  }

  isPermit(tusuario: string, url: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.URL_SISTEMA_SUBMENU}/list/funcion/${tusuario}/${url}`)
  }

  hasRole(role: string): boolean {
    if (this.usuario.roles.includes(role)) {
      return true;
    }
    return false;
  }

  getAllMenu(): Observable<Menu[]> {
    return this.http.get(this.URL_SISTEMA_MENU + '/list').pipe(
      map((response) => response as Menu[])
    );
  }

  findMenuById(id: number): Observable<Menu> {
    return this.http.get<Menu>(`${this.URL_SISTEMA_MENU}/find/id/${id}`)
  }

  saveMenu(menu: Menu): Observable<Menu> {
    return this.http.post<Menu>(`${this.URL_SISTEMA_MENU}/save`, menu);
  }

  accessMenu(usuario: String): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${this.URL_SISTEMA_MENU}/list/${usuario}`)
  }

  findById(id: number): Observable<Submenu> {
    return this.http.get<Submenu>(`${this.URL_SISTEMA_SUBMENU}/find/${id}`)
  }

  saveSubMenu(submenu: Funcion): Observable<Funcion> {
    return this.http.post<Funcion>(`${this.URL_SISTEMA_SUBMENU}/save`, submenu);
  }

  deleteSubMenu(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA_SUBMENU}/delete/grupo/id/${id}`)
  }


  enableSubmenu(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA_SUBMENU}/enable/id/${id}`)
  }

  disableSubmenu(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA_SUBMENU}/disable/id/${id}`)
  }

  getAllDispSubMenuByCodGrupo(id: number): Observable<Submenu[]> {
    return this.http.get<Submenu[]>(`${this.URL_SISTEMA_SUBMENU}/list/disp/codgrupo/${id}`)
  }

  getAllAsigSubMenuByCodGrupo(id: number): Observable<Submenu[]> {
    return this.http.get<Submenu[]>(`${this.URL_SISTEMA_SUBMENU}/list/asig/codgrupo/${id}`)
  }

  accessSubMenuByUserAndGrupo(usuario: string, codfunsup: number): Observable<Submenu[]> {
    return this.http.get<Submenu[]>(`${this.URL_SISTEMA_SUBMENU}/list/codgrupo/${usuario}/${codfunsup}`)
  }

  accessSubMenu(usuario: string, codfunsup: number): Observable<Submenu[]> {
    return this.http.get<Submenu[]>(`${this.URL_SISTEMA_SUBMENU}/list/codfunsup/${usuario}/${codfunsup}`)
  }

  accessSubMenuByUsuario(usuario: string): Observable<Submenu[]> {
    return this.http.get<Submenu[]>(`${this.URL_SISTEMA_SUBMENU}/list/${usuario}`)
  }

  accessRes(usuario: String): Observable<Acceso[]> {
    return this.http.get<Acceso[]>(`${this.URL_SISTEMA_ACCESO_RES}/list/usuario/${usuario}`)
  }

  addAccesoRes(acceso: Acceso): Observable<Acceso> {
    return this.http.post<Acceso>(`${this.URL_SISTEMA_ACCESO_RES}/save`, acceso);
  }

  deleteMenuRes(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA_ACCESO_RES}/delete/id/${id}`)
  }

  logout(): void {
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
  }
  
}
