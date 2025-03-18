import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Medidacorrectiva } from '../models/medidacorrectiva';
import { Parametro } from '../models/parametro';

@Injectable({
  providedIn: 'root'
})
export class MedidacorrectivaService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/medida";

  constructor(private http: HttpClient) { }

  saveMedidaCorrectiva(medidacorrectiva: Medidacorrectiva): Observable<Medidacorrectiva> {
    return this.http.post<Medidacorrectiva>(`${this.URL_SISTEMA}/save`, medidacorrectiva);
  }

  getAllMedidaCorrectiva(): Observable<Medidacorrectiva[]> {
    return this.http.get(this.URL_SISTEMA + '/list').pipe(
      map((response) => response as Medidacorrectiva[])
    );
  }

  getMedidaCorrectivaById(id: number): Observable<Medidacorrectiva> {
    return this.http.get<Medidacorrectiva>(`${this.URL_SISTEMA}/find/id/${id}`)
  }

  deleteMedidacorrectivaById(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/delete/id/${id}`)
  }

  getAllMedidasByAccidente(codacci: number): Observable<Medidacorrectiva[]> {
    return this.http.get<Medidacorrectiva[]>(`${this.URL_SISTEMA}/list/codacci/${codacci}`)
  }

  CargarFileMedida(form: FormData): Observable<number> {
    return this.http.post<number>(`${this.URL_SISTEMA}/upload/file/medida`, form)
  }

  CargarFileLev(form: FormData): Observable<number> {
    return this.http.post<number>(`${this.URL_SISTEMA}/upload/file/leva`, form)
  }

}
