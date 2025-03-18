import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Parametro } from '../models/parametro';
import { Procapacitacion } from '../models/procapacitacion';

@Injectable({
  providedIn: 'root'
})
export class ProcapacitacionService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/procap";
  private URL_SISTEMA_DETALLE: string = Parametro.SISTEMA_URL + "sistema/capa";
  //private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  getAllProCapacitaciones(usuario: string): Observable<Procapacitacion[]> {
    return this.http.get(this.URL_SISTEMA + `/list/usuario/${usuario}`).pipe(
      map((response) => response as Procapacitacion[])
    );
  }

  /*getAllProCapacitacionesProgramadosd(): Observable<Procapacitacion[]> {
    return this.http.get(this.URL_SISTEMA + '/list/programados').pipe(
      map((response) => response as Procapacitacion[])
    );
  }*/

  getAllProCapaByTipoAndFechas(codtipo: number, fechaini: string, fechafin: string, usuario: string): Observable<Procapacitacion[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/pro/tip/fec/${codtipo}/${fechaini}/${fechafin}/${usuario}`).pipe(
      map((response) => response as Procapacitacion[])
    );
  }

  savePro(procapa: Procapacitacion): Observable<Procapacitacion> {
    return this.http.post<Procapacitacion>(`${this.URL_SISTEMA}/save`, procapa);
  }

  getProCapacitacionById(id: number): Observable<Procapacitacion> {
    return this.http.get<Procapacitacion>(`${this.URL_SISTEMA}/find/id/${id}`)
  }

  deleteProCapacitacionById(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/delete/id/${id}`)
  }

  getPdfCapacitacionesByPrograma(id: number) {
    return this.http.get(`${this.URL_SISTEMA}/export/pdf/regasis/${id}`, { responseType: 'blob' });
  }

  getExcelPlantillaProCapa() {
    return this.http.get(`${this.URL_SISTEMA}/download/plantilla`, { responseType: 'blob' });
  }

  getExcelPersCapaProgramada(codpro: number) {
    return this.http.get(`${this.URL_SISTEMA_DETALLE}/download/histxperscapa/programacion/${codpro}`, { responseType: 'blob' });
  }

}
