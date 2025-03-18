import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Capacitacion } from '../models/capacitacion';
import { Error } from '../models/error';
import { Parametro } from '../models/parametro';

@Injectable({
  providedIn: 'root'
})
export class CapacitacionService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/capa";
  //private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getAllCapacitacionesByProgram(codprogram: number): Observable<Capacitacion[]> {
    return this.http.get(`${this.URL_SISTEMA}/find/program/${codprogram}`).pipe(
      map((response) => response as Capacitacion[])
    );
  }

  getCapacitacionById(id: number): Observable<Capacitacion> {
    return this.http.get<Capacitacion>(`${this.URL_SISTEMA}/find/id/${id}`)
  }

  deleteCapacitacionById(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/delete/id/${id}`)
  }

  save(capacitacion: Capacitacion): Observable<Capacitacion> {
    return this.http.post<Capacitacion>(`${this.URL_SISTEMA}/save`, capacitacion);
  }

  saveOne(capacitacion: Capacitacion): Observable<Capacitacion> {
    return this.http.post<Capacitacion>(`${this.URL_SISTEMA}/grabar/one`, capacitacion);
  }

  getAllCapacitacionByPersonalDoc(documento: string, usuario: string): Observable<Capacitacion[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/personal/doc/${documento}/${usuario}`).pipe(
      map((response) => response as Capacitacion[])
    );
  }

  getAllCapacitacionHistorialByPersonalDoc(documento: string, usuario: string): Observable<Capacitacion[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/history/personal/doc/${documento}/${usuario}`).pipe(
      map((response) => response as Capacitacion[])
    );
  }

  getAllCapacitacionTipObligNoAsist(codtipo: number, fechaini: string, fechafin: string, usuario: string): Observable<Capacitacion[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/tipobli/noasis/parametros/${codtipo}/${fechaini}/${fechafin}/${usuario}`).pipe(
      map((response) => response as Capacitacion[])
    );
  }

  getAllCapacitacionAntesVencer(usuario: string): Observable<Capacitacion[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/antesvencer/${usuario}`).pipe(
      map((response) => response as Capacitacion[])
    );
  }

  getAllCapacitacionAntesVencerSinVencido(usuario: string): Observable<Capacitacion[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/antesvencer/sinvencido/${usuario}`).pipe(
      map((response) => response as Capacitacion[])
    );
  }

  getAllCapacitacionAntesVencerVencido(usuario: string): Observable<Capacitacion[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/antesvencer/solovencido/${usuario}`).pipe(
      map((response) => response as Capacitacion[])
    );
  }

  getAllCapacitacionRealizados(usuario: string): Observable<Capacitacion[]> {
    return this.http.get(this.URL_SISTEMA + `/list/realizados/${usuario}`).pipe(
      map((response) => response as Capacitacion[])
    );
  }

  getExcelPlantillaCapaProg() {
    return this.http.get(`${this.URL_SISTEMA}/download/plantilla`, { responseType: 'blob' });
  }

  getExcelPlantillaCapaHist() {
    return this.http.get(`${this.URL_SISTEMA}/download/plantilla/hist`, { responseType: 'blob' });
  }

  CargarExcelCapaPersonal(form: FormData): Observable<Error[]> {
    return this.http.post<Error[]>(`${this.URL_SISTEMA}/upload/capacitacion/personal`, form)
  }

  CargarExcelProcapaPersonal(form: FormData): Observable<Error[]> {
    return this.http.post<Error[]>(`${this.URL_SISTEMA}/upload/procacapa/personal`, form)
  }

  getExceCapaByPorVencerTodos(usuario: string) {
    return this.http.get(`${this.URL_SISTEMA}/download/capaxvencer/todos/${usuario}`, { responseType: 'blob' });
  }

  getExceCapaByPorVencerSinVencido(usuario: string) {
    return this.http.get(`${this.URL_SISTEMA}/download/capaxvencer/xvencer/${usuario}`, { responseType: 'blob' });
  }

  getExceCapaByVencidoSoloVencido(usuario: string) {
    return this.http.get(`${this.URL_SISTEMA}/download/capaxvencer/vencido/${usuario}`, { responseType: 'blob' });
  }

  getAllProPendCapaByTipoAndFechas(codtipo: number, fechaini: string, fechafin: string, usuario: string): Observable<Capacitacion[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/propend/tip/fec/${codtipo}/${fechaini}/${fechafin}/${usuario}`).pipe(
      map((response) => response as Capacitacion[])
    );
  }

  CargarFileProcoa(form: FormData): Observable<number> {
    return this.http.post<number>(`${this.URL_SISTEMA}/upload/file/procapa`, form)
  }


  CargarExcelCapaHist(form: FormData): Observable<Error[]> {
    return this.http.post<Error[]>(`${this.URL_SISTEMA}/upload/capa/hist`, form)
  }

  getExcelCapaHistxPersona(documento: string, usuario: string) {
    return this.http.get(`${this.URL_SISTEMA}/download/histxpersona/documento/${documento}/${usuario}`, { responseType: 'blob' });
  }

  getExcelPersCapaVig(codtipo: number, fechaini: string, fechafin: string, usuario: string) {
    return this.http.get(`${this.URL_SISTEMA}/download/histxperscapavig/parametros/${codtipo}/${fechaini}/${fechafin}/${usuario}`, { responseType: 'blob' });
  }

  getExcelPersInaCapaObligatorias(codtipo: number, fechaini: string, fechafin: string, usuario: string) {
    return this.http.get(`${this.URL_SISTEMA}/download/histxperinacapa/parametros/${codtipo}/${fechaini}/${fechafin}/${usuario}`, { responseType: 'blob' });
  }


}
