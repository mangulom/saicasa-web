import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Area } from '../models/area';
import { Areausuario } from '../models/Areausuario';
import { Parametro } from '../models/parametro';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/areas";
  private URL_SISTEMA_AREA_USUARIO: string = Parametro.SISTEMA_URL + "sistema/areausuario";

  //private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }


  getAllAreas(): Observable<Area[]> {
    return this.http.get(this.URL_SISTEMA + '/list').pipe(
      map((response) => response as Area[])
    );
  }

  getAllCabAreasByUsaurio(usuario: string): Observable<Area[]> {
      return this.http.get(`${this.URL_SISTEMA}/list/usuario/${usuario}`).pipe(
        map((response) => response as Area[])
    );
  }

  getAllCabAreasByNombre(nombre: string): Observable<Area[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/nombre/${nombre}`).pipe(
      map((response) => response as Area[])
    );
  }

  getAllAreasByEmpresa(codempresa: string): Observable<Area[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/empresa/${codempresa}`).pipe(
      map((response) => response as Area[])
    );
  }

  getAllAreaByUsuario(usuario: string): Observable<Areausuario[]> {
    return this.http.get(`${this.URL_SISTEMA_AREA_USUARIO}/list/usuario/${usuario}`).pipe(
      map((response) => response as Areausuario[])
    );
  }

  saveArea(area: Area): Observable<Area> {
    return this.http.post<Area>(`${this.URL_SISTEMA}/save`, area);
  }

  getAreaById(codempresa: string, numverareas: string, codareas: string): Observable<Area> {
    return this.http.get<Area>(`${this.URL_SISTEMA}/find/${codempresa}/${numverareas}/${codareas}`)
  }

  saveAreaUsuario(areaUsuario: Areausuario): Observable<Areausuario> {
    return this.http.post<Areausuario>(`${this.URL_SISTEMA_AREA_USUARIO}/save`, areaUsuario);
  }

  deleteAreasUsuario(codempresa: string, numverareas: string, codareas: string, codusuario: string): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA_AREA_USUARIO}/delete/id/${codempresa}/${numverareas}/${codareas}/${codusuario}`)
  }

  deleteAllByUsuario(codusuario: string): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA_AREA_USUARIO}/delete/usuario/${codusuario}`)
  }


  execProcSyncArea(): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/sync/areas`)
  }

  execProcSyncAreaUsuario(usuario:string): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA_AREA_USUARIO}/sync/usuario/${usuario}`)
  }
  
}
