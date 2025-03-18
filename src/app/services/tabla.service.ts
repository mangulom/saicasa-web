import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Parametro } from '../models/parametro';
import { Tabla } from '../models/tabla';
import { Tabladetalle } from '../models/tabladetalle';

@Injectable({
  providedIn: 'root'
})
export class TablaService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/tabla";
  private URL_SISTEMA_TABLA_DETALLE: string = Parametro.SISTEMA_URL + "sistema/tabladet";

  //private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  getAllTabla(): Observable<Tabla[]> {
    return this.http.get(this.URL_SISTEMA + '/list').pipe(
      map((response) => response as Tabla[])
    );
  }

  saveTabla(tabla: Tabla): Observable<Tabla> {
    return this.http.post<Tabla>(`${this.URL_SISTEMA}/save`, tabla);
  }

  getTablaById(id: string): Observable<Tabla> {
    return this.http.get<Tabla>(`${this.URL_SISTEMA}/find/id/${id}`)
  }

  deleteTablaById(id: string): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/delete/id/${id}`)
  }

  getAllAgenteCausante(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/agentcausante').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllCIE(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/cie').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllGreavedaAccidente(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/gravacci').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllParteAfectada(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/partafect').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllTipoAccidente(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/tipacci').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllTipoLesion(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/tipless').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllEstadoInv(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/estadoacc').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllMes(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/mes').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllTipoVacuna(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/tipovacuna').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllZonaVacu(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/zonavacu').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllVacunador(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/vacunador').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllTipDocumento(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/tipdoc').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllTipSexo(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/tipsexo').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllGrupoArea(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/grupoareas').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllActoInseguro(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/actoin').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllActoInseguroParametros(codacci: number): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + `/list/actoin/acci/${codacci}`).pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllCondicionInsegura(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/condin').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllCondicionInseguraParametros(condin: number): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + `/list/condin/acci/${condin}`).pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllFactorLaboral(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/fala').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllComiteCargos(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/comi/cargos').pipe(
      map((response) => response as Tabladetalle[])
    );
  }


  getAllFactorLaboralParametros(codfala: number): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + `/list/fala/acci/${codfala}`).pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllFactorPersonal(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/fape').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllFactorPersonalParametros(codfape: number): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + `/list/fala/acci/${codfape}`).pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  //MEDIDAS CORRECTIVAS
  getAllEstadosMedidaCorrectiva(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/medida/estado').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllEstadosLevantamiento(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/leva/estado').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllCapacitacionNotas(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/capa/notas').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getTablaDetalleById(id: number): Observable<Tabladetalle> {
    return this.http.get<Tabladetalle>(`${this.URL_SISTEMA_TABLA_DETALLE}/find/id/${id}`)
  }

  saveTablaDetalle(tabladet: Tabladetalle): Observable<Tabladetalle> {
    return this.http.post<Tabladetalle>(`${this.URL_SISTEMA_TABLA_DETALLE}/save`, tabladet);
  }

  deleteTablaDetalleById(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA_TABLA_DETALLE}/delete/id/${id}`)
  }

  getAllTablaDetalle(codigo: string): Observable<Tabladetalle[]> {
    return this.http.get(`${this.URL_SISTEMA_TABLA_DETALLE}/list/tabcod/${codigo}`).pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  //EMO - TABLE DETALLE 

  getAllProveedor(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/proveedor').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllEstadoProgramEmo(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/estdproemo').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllTipEva(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/tpevaluacion').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllGrupofact(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/grupofact').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllPresis(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/psis').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllPresdia(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/psdi').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllEstNu(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/enut').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllAptitudMed(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/apti').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  //CAPACITACION

  getAllMotivoCapacitacion(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/moti').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllTipoCapacitacion(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/tcap').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  getAllTemaCapacitacion(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/tema').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

  //GESTION

  getAllTiposEpps(): Observable<Tabladetalle[]> {
    return this.http.get(this.URL_SISTEMA_TABLA_DETALLE + '/list/epps/tipos').pipe(
      map((response) => response as Tabladetalle[])
    );
  }

}
