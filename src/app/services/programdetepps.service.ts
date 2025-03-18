import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Parametro } from '../models/parametro';
import { Programdetepps } from '../models/programdetepps';

@Injectable({
  providedIn: 'root'
})
export class ProgramdeteppsService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/programdetepps";

  constructor(private http: HttpClient) { }

  getAllprogramDetEppsByCodProgram(id: number): Observable<Programdetepps[]> {
    return this.http.get(this.URL_SISTEMA + `/findAll/codprogram/${id}`).pipe(
      map((response) => response as Programdetepps[])
    );
  }

  saveProEpps(entity: Programdetepps): Observable<Programdetepps> {
    return this.http.post<Programdetepps>(`${this.URL_SISTEMA}/save`, entity);
  }

  deleteProEppsById(id: number): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/delete/id/${id}`)
  }

}
