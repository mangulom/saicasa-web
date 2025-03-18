import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Detallecontrol } from '../models/detallecontrol';
import { Emo } from '../models/emo';
import { Parametro } from '../models/parametro';
import { Tipocontrol } from '../models/tipocontrol';

@Injectable({
  providedIn: 'root'
})
export class TipocontrolService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/tipcontrol";
  private URL_SISTEMA_DETALLE: string = Parametro.SISTEMA_URL + "sistema/detcontrol";

  //private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }


  getAllTipoControl(): Observable<Tipocontrol[]> {
    return this.http.get(this.URL_SISTEMA + '/list').pipe(
      map((response) => response as Tipocontrol[])
    );
  }

  getTipoControlById(id: number): Observable<Tipocontrol> {
    return this.http.get<Tipocontrol>(`${this.URL_SISTEMA}/find/id/${id}`)
  }

  getAllDetalleByTipo(id: number): Observable<Detallecontrol[]> {
    return this.http.get(`${this.URL_SISTEMA_DETALLE}/list/tipo/${id}`).pipe(
      map((response) => response as Detallecontrol[])
    );
  }

  getAllDetalleControl(): Observable<Detallecontrol[]> {
    return this.http.get(this.URL_SISTEMA_DETALLE + '/list').pipe(
      map((response) => response as Detallecontrol[])
    );
  }

  getDetalleControlById(id: number): Observable<Detallecontrol> {
    return this.http.get<Detallecontrol>(`${this.URL_SISTEMA_DETALLE}/find/id/${id}`)
  }

  ProcesoData(detalle: Detallecontrol): Observable<Emo[]> {
    return this.http.post<Emo[]>(`${this.URL_SISTEMA_DETALLE}/proceso`, detalle);
  }

  getExcelParaemtrosNormalidad(id: number, codtipo: number, fechaini: string, fechafin: string, usuario: string) {
    return this.http.get(`${this.URL_SISTEMA_DETALLE}/excel/export/normalidad/parametros/${id}/${codtipo}/${fechaini}/${fechafin}/${usuario}`, { responseType: 'blob' });
  }

}
