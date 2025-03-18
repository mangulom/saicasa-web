import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Menu } from '../models/menu';
import { Parametro } from '../models/parametro';
import { Perfil } from '../models/perfil';
import { Perfilgrupofuncion } from '../models/Perfilgrupofuncion';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/perfil";
  private URL_SISTEMA_PERFIL_GRUPO_FUNCION: string = Parametro.SISTEMA_URL + "sistema/perfilgrupofuncion";
  private URL_SISTEMA_FUNCION_GRUPO: string = Parametro.SISTEMA_URL + "sistema/fgrupo";

  //private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }


  savePerfil(perfil: Perfil): Observable<Perfil> {
    return this.http.post<Perfil>(`${this.URL_SISTEMA}/save`, perfil);
  }

  getAllPerfil(): Observable<Perfil[]> {
    return this.http.get(this.URL_SISTEMA + '/list').pipe(
      map((response) => response as Perfil[])
    );
  }

  getPerfilById(id: number): Observable<Perfil> {
    return this.http.get<Perfil>(`${this.URL_SISTEMA}/find/id/${id}`)
  }

  getAllPerGrupFunByPerfil(id: number): Observable<Perfilgrupofuncion[]> {
    return this.http.get(`${this.URL_SISTEMA_PERFIL_GRUPO_FUNCION}/find/perfil/${id}`).pipe(
      map((response) => response as Perfilgrupofuncion[])
    );
  }

 getAllMenuByPerfil(id: number): Observable<Menu[]> {
   return this.http.get(`${this.URL_SISTEMA_FUNCION_GRUPO}/list/perfil/${id}`).pipe(
     map((response) => response as Menu[])
    );
  }

  savePerGrupFun(perfilgrupofuncion: Perfilgrupofuncion): Observable<Perfilgrupofuncion> {
    return this.http.post<Perfilgrupofuncion>(`${this.URL_SISTEMA_PERFIL_GRUPO_FUNCION}/save`, perfilgrupofuncion);
  }

  deletePerGrupFunById(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA_PERFIL_GRUPO_FUNCION}/delete/id/${id}`)
  }

  deletePerfilById(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/delete/id/${id}`)
  }

}
