import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Emo } from '../models/emo';
import { Error } from '../models/error';
import { Parametro } from '../models/parametro';

@Injectable({
  providedIn: 'root'
})
export class EmoService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/emo";
  //private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

 /* getAllEmo(): Observable<Emo[]> {
    return this.http.get(this.URL_SISTEMA + '/list').pipe(
      map((response) => response as Emo[])
    );
  }*/

  getAllEmoRealizados(usuario: string): Observable<Emo[]> {
    return this.http.get(this.URL_SISTEMA + `/list/realizados/${usuario}`).pipe(
      map((response) => response as Emo[])
    );
  }

  getAllEmoVigenciaCaducada(usuario: string): Observable<Emo[]> {
    return this.http.get(this.URL_SISTEMA + `/list/vigencia/caducada/${usuario}`).pipe(
      map((response) => response as Emo[])
    );
  }

  getAllEmoProgramacionVencida(usuario: string): Observable<Emo[]> {
    return this.http.get(this.URL_SISTEMA + `/list/programacion/vencida/${usuario}`).pipe(
      map((response) => response as Emo[])
    );
  }

  getAllEmoByProgram(codprogram: number): Observable<Emo[]> {
    return this.http.get(`${this.URL_SISTEMA}/find/program/${codprogram}`).pipe(
      map((response) => response as Emo[])
    );
  }

  getEmoById(id: number): Observable<Emo> {
    return this.http.get<Emo>(`${this.URL_SISTEMA}/find/id/${id}`)
  }

  getAllEmoByPersonalDoc(documento: string, usuario: string): Observable<Emo[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/personal/doc/${documento}/${usuario}`).pipe(
      map((response) => response as Emo[])
    );
  }

  getAllVacunacionByPersonalDocAndEstado(documento: string, id: number, usuario: string): Observable<Emo[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/personal/doc/estado/${documento}/${id}/${usuario}`).pipe(
      map((response) => response as Emo[])
    );
  }

  getAllVacunacionByProveedorAndEstado(nombre: string, id: number, usuario: string): Observable<Emo[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/proveedor/nombre/${nombre}/${id}/${usuario}`).pipe(
      map((response) => response as Emo[])
    );
  }

  getAllEmoByCodTipoAndFechas(codtipo: number, fechaini: string, fechafin: string, usuario: string): Observable<Emo[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/parametros/${codtipo}/${fechaini}/${fechafin}/${usuario}`).pipe(
      map((response) => response as Emo[])
    );
  }

  save(emo: Emo): Observable<Emo> {
    return this.http.post<Emo>(`${this.URL_SISTEMA}/save`, emo);
  }

  
  saveOne(emo: Emo): Observable<Emo> {
    return this.http.post<Emo>(`${this.URL_SISTEMA}/grabar/one`, emo);
  }

  deleteEmoById(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/delete/id/${id}`)
  }

  CargarExcelEmoProPersonal(form: FormData): Observable<Error[]> {
    return this.http.post<Error[]>(`${this.URL_SISTEMA}/upload/programacion/personal`, form)
  }

  getExcelPlantillaEmo() {
    return this.http.get(`${this.URL_SISTEMA}/download/plantilla`, { responseType: 'blob' });
  }

  CargarExcelEmoPersonal(form: FormData): Observable<Error[]> {
    return this.http.post<Error[]>(`${this.URL_SISTEMA}/upload/emo/personal`, form)
  }

  getPdf(id: number) {
    return this.http.get(`${this.URL_SISTEMA}/export/pdf/cert/aptitud/${id}`, { responseType: 'blob' });
  }

  getPdfExamenMedico(id: number) {
    return this.http.get(`${this.URL_SISTEMA}/export/pdf/exam/medico/${id}`, { responseType: 'blob' });
  }

  getExcelEmoByPersonalDocAndEstado(documento: string, id: number, usuario: string) {
    return this.http.get(`${this.URL_SISTEMA}/excel/list/personal/doc/estado/${documento}/${id}/${usuario}`, { responseType: 'blob' });
  }

  getExcelEmoByProveedorAndEstado(nombre: string, id: number, usuario: string) {
    return this.http.get(`${this.URL_SISTEMA}/excel/list/proveedor/nombre/${nombre}/${id}/${usuario}`, { responseType: 'blob' });
  }

}
