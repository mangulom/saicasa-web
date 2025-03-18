import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Error } from '../models/error';
import { Parametro } from '../models/parametro';
import { Personal } from '../models/personal';
import { Vacunacion } from '../models/vacunacion';
import { Vacuxarea } from '../models/vacuxarea';

@Injectable({
  providedIn: 'root'
})
export class VacunacionService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/vacunacion";

  constructor(private http: HttpClient) { }

 /* getAllVacunacion(): Observable<Vacunacion[]> {
    return this.http.get(this.URL_SISTEMA + '/list').pipe(
      map((response) => response as Vacunacion[])
    );
  }*/

  getAllPersonalVacunados(usuario: string): Observable<Vacunacion[]> {
    return this.http.get(this.URL_SISTEMA + `/list/vacunados/${usuario}`).pipe(
      map((response) => response as Vacunacion[])
    );
  }

  getAllVacunacionByPersonalDoc(documento: string, usuario: string): Observable<Vacunacion[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/personal/doc/${documento}/${usuario}`).pipe(
      map((response) => response as Vacunacion[])
    );
  }

  getAllPersonalVacunadosNoProgramados(usuario: string): Observable<Vacunacion[]> {
    return this.http.get(this.URL_SISTEMA + `/list/vacunados/nopro/${usuario}`).pipe(
      map((response) => response as Vacunacion[])
    );
  }

  getAllVacunacionByPersona(codempresa: string,codpersonal: string): Observable<Vacunacion[][]> {
    return this.http.get(`${this.URL_SISTEMA}/list/persandcodvacu/${codempresa}/${codpersonal}`).pipe(
      map((response) => response as Vacunacion[][])
    );
  }

  getAllVacunacionByCodProgramacion(codprogram: number): Observable<Vacunacion[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/codprogram/${codprogram}`).pipe(
      map((response) => response as Vacunacion[])
    );
  }

  getVacunacionById(id: number): Observable<Vacunacion> {
    return this.http.get<Vacunacion>(`${this.URL_SISTEMA}/find/id/${id}`)
  }

  getPersonalAndProgram(codempresa: string, codpersonal: string, codprogram: number): Observable<Vacunacion> {
    return this.http.get<Vacunacion>(`${this.URL_SISTEMA}/find/persandprogram/${codempresa}/${codpersonal}/${codprogram}`)
  }

  saveOne(vacunacion: Vacunacion): Observable<Vacunacion> {
    return this.http.post<Vacunacion>(`${this.URL_SISTEMA}/save/one`, vacunacion);
  }

  save(vacunacion: Vacunacion): Observable<Vacunacion> {
    return this.http.post<Vacunacion>(`${this.URL_SISTEMA}/save`, vacunacion);
  }

  saveVacunados(vacunacion: Vacunacion): Observable<Vacunacion> {
    return this.http.post<Vacunacion>(`${this.URL_SISTEMA}/save/vacunados`, vacunacion);
  }

  saveNoProgramados(vacunacion: Vacunacion): Observable<Vacunacion> {
    return this.http.post<Vacunacion>(`${this.URL_SISTEMA}/save/nprogram`, vacunacion);
  }

  getAllPersonalDispVacunacionByCodProgram(codprogram: number): Observable<Vacunacion[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/disp/vacu/codprogram/${codprogram}`).pipe(
      map((response) => response as Vacunacion[])
    );
  }

  getReportxArea(id: number, usuario: string): Observable<Vacuxarea[]> {
    return this.http.get(`${this.URL_SISTEMA}/rpt/area/${id}/${usuario}`).pipe(
      map((response) => response as Vacuxarea[])
    );
  }

  deleteVacunacion(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/delete/id/${id}`)
  }

  RegresoEstadoVacunacion(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/vacu/regreso/id/${id}`)
  }

  getFile() {
    return this.http.get(`${this.URL_SISTEMA}/download/plantilla`, { responseType: 'blob' });
  }

  CargarExcelRegVacunaciones(form: FormData): Observable<Error[]> {
    return this.http.post<Error[]>(`${this.URL_SISTEMA}/upload/vacunacion/doc`, form)
  }

  getFileExportVacunados(usuario: string) {
    return this.http.get(`${this.URL_SISTEMA}/download/vacunados/${usuario}`, { responseType: 'blob' });
  }

  getFileExportArea(id: number, usuario: string) {
    return this.http.get(`${this.URL_SISTEMA}/download/reportxarea/${id}/${usuario}`, { responseType: 'blob' });
  }

  getFileExportCamp(fechaini: string, fechafin: string, usuario: string) {
    return this.http.get(`${this.URL_SISTEMA}/download/reportxcampana/${fechaini}/${fechafin}/${usuario}`, { responseType: 'blob' });
  }

  getPdf(documento: string, usuario: string) {
    return this.http.get(`${this.URL_SISTEMA}/export/pdf/personal/${documento}/${usuario}`, { responseType: 'blob' });
  }

}

