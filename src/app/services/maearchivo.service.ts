import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Parametro } from '../models/parametro';
import { Procapaarchivo } from '../models/procapaarchivo';
import { Acciarchivo } from '../models/acciarchivo';
import { Medarchivo } from '../models/medarchivo';
import { Procomiteactaarchivo } from '../models/procomiteactaarchivo';

@Injectable({
  providedIn: 'root'
})
export class MaearchivoService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/arch";

  constructor(private http: HttpClient) { }

  getAllArchivosByProgram(codprogram: number): Observable<Procapaarchivo[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/procapa/${codprogram}`).pipe(
      map((response) => response as Procapaarchivo[])
    );
  }

  getAllArchivosByAcci(codacci: number): Observable<Acciarchivo[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/accidente/${codacci}`).pipe(
      map((response) => response as Acciarchivo[])
    );
  }

  getAllArchivosByMed(codmed: number): Observable<Medarchivo[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/medida/${codmed}`).pipe(
      map((response) => response as Medarchivo[])
    );
  }

  getAllArchivosByLeva(codmed: number): Observable<Medarchivo[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/leva/${codmed}`).pipe(
      map((response) => response as Medarchivo[])
    );
  }

  getAllArchivosByProComiteActa(codprogram: number): Observable<Procomiteactaarchivo[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/procomiteacta/${codprogram}`).pipe(
      map((response) => response as Procomiteactaarchivo[])
    );
  }


  deleteProcapaArchivoById(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/delete/procapa/id/${id}`)
  }

  deleteAccidenteArchivoById(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/delete/accidente/id/${id}`)
  }

  deleteMedidaArchivoById(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/delete/medida/id/${id}`)
  }

  deleteLevantamientoArchivoById(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/delete/leva/id/${id}`)
  }

  deleteProComiteActaArchivoById(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/delete/procomiteacta/id/${id}`)
  }


  getOneArchivo(filename: string) {
    return this.http.get(`${this.URL_SISTEMA}/get/${filename}`, { responseType: 'blob' });
  }

  getAccidenteOneArchivo(filename: string) {
    return this.http.get(`${this.URL_SISTEMA}/get/acci/${filename}`, { responseType: 'blob' });
  }

  getMedidaOneArchivo(filename: string) {
    return this.http.get(`${this.URL_SISTEMA}/get/medida/${filename}`, { responseType: 'blob' });
  }

  getLevantamientoOneArchivo(filename: string) {
    return this.http.get(`${this.URL_SISTEMA}/get/leva/${filename}`, { responseType: 'blob' });
  }

  getProComiteActaOneArchivo(filename: string) {
    return this.http.get(`${this.URL_SISTEMA}/get/procomiteacta/${filename}`, { responseType: 'blob' });
  }

}
