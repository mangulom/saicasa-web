import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Parametro } from '../models/parametro';
import { Personal } from '../models/personal';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/personal";
  //private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }


  getAllPersonal(): Observable<Personal[]> {
    return this.http.get(this.URL_SISTEMA + '/list').pipe(
      map((response) => response as Personal[])
    );
  }

  getAllPersonalTop(): Observable<Personal[]> {
    return this.http.get(this.URL_SISTEMA + '/list/top').pipe(
      map((response) => response as Personal[])
    );
  }

  getAllPersonalExterno(): Observable<Personal[]> {
    return this.http.get(this.URL_SISTEMA + '/list/externo').pipe(
      map((response) => response as Personal[])
    );
  }

  savePersonal(personal: Personal): Observable<Personal> {
    return this.http.post<Personal>(`${this.URL_SISTEMA}/save`, personal);
  }

  savePersonalExterno(personal: Personal): Observable<Personal> {
    return this.http.post<Personal>(`${this.URL_SISTEMA}/save/externo`, personal);
  }


  getAllPersonaByCodProgram(codprogram: number): Observable<Personal[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/codprogram/${codprogram}`).pipe(
      map((response) => response as Personal[])
    );
  }

  getAllPersonalDispVacunacionByCodProgram(codprogram: number): Observable<Personal[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/disp/vacu/codprogram/${codprogram}`).pipe(
      map((response) => response as Personal[])
    );
  }
  
  getAllPersonalfindAllDispVacuFiltroDni(filtro: string, codprogram: number): Observable<Personal[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/vacu/dni/filtro/${filtro}/codpro/${codprogram}`).pipe(
      map((response) => response as Personal[])
    );
  }

  getAllPersonalfindAllDispVacuFiltroArea(filtro: string, codprogram: number): Observable<Personal[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/vacu/area/filtro/${filtro}/codpro/${codprogram}`).pipe(
      map((response) => response as Personal[])
    );
  }

  getAllPersonalByNombre(nombre: string, codprogram: number): Observable<Personal[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/nombre/${nombre}/codpro/${codprogram}`).pipe(
      map((response) => response as Personal[])
    );
  }

  getAllPersonalByDocNoExistPro(documento: string, codprogram: number): Observable<Personal[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/documento/${documento}/codpro/${codprogram}`).pipe(
      map((response) => response as Personal[])
    );
  }

  //VACUNACION

  getAllPersonalByDocNoExistProAndUsuario(documento: string, codprogram: number, codusuario: string): Observable<Personal[]> {
    return this.http.get(`${this.URL_SISTEMA}/vacu/list/documento/${documento}/codpro/${codprogram}/codusuario/${codusuario}`).pipe(
      map((response) => response as Personal[])
    );
  }

  getAllPersonalByAreaNoExistProAndUsuario(area: string, codprogram: number, codusuario: string): Observable<Personal[]> {
    return this.http.get(`${this.URL_SISTEMA}/vacu/list/area/${area}/codpro/${codprogram}/codusuario/${codusuario}`).pipe(
      map((response) => response as Personal[])
    );
  }

  getAllPersonalByArea(area: string, codprogram: number): Observable<Personal[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/area/${area}/codpro/${codprogram}`).pipe(
      map((response) => response as Personal[])
    );
  }

  getPersonalByDoc(documento: string, usuario: string): Observable<Personal> {
    return this.http.get<Personal>(`${this.URL_SISTEMA}/list/doc/${documento}/${usuario}`)
  }

  getAllPersonalByDoc(documento: string, usuario: string): Observable<Personal[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/all/doc/${documento}/${usuario}`).pipe(
      map((response) => response as Personal[])
    );
  }

  getPersonalById(codempresa: string, codpersonal: string): Observable<Personal> {
    return this.http.get<Personal>(`${this.URL_SISTEMA}/find/compose/${codempresa}/${codpersonal}`)
  }

  getPersonalByEmpresaAndPersonal(codempresa: string, codpersonal: string): Observable<Personal> {
    return this.http.get<Personal>(`${this.URL_SISTEMA}/list/empresa/${codempresa}/personal/${codpersonal}`)
  }

  CargarListPersonal(form: FormData): Observable<Personal[]> {
    return this.http.post<Personal[]>(`${this.URL_SISTEMA}/upload/personal/doc`, form)
  }

  deletePersonal(codempresa: string, codpersonal: string): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/delete/id/${codempresa}/${codpersonal}`)
  }

  desactivarPersonal(codempresa: string, codpersonal: string): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/desactivar/id/${codempresa}/${codpersonal}`)
  }

  activarPersonal(codempresa: string, codpersonal: string): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/activar/id/${codempresa}/${codpersonal}`)
  }

  execProcSyncPersonal(): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/sync/personal`)
  }
  execProcSyncAllMasters(): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/sync/all/master`)
  }

  getAllPersonalByNombreLike(search: string, usuario: string): Observable<Personal[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/filtro/nombre/${search}/${usuario}`).pipe(
      map((response) => response as Personal[])
    );
  }

  //EXTERNO
  getAllPersonalExternoByNombreLike(search: string): Observable<Personal[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/externo/filtro/nombre/${search}`).pipe(
      map((response) => response as Personal[])
    );
  }

  getAllPersonalExternaByDoc(documento: string): Observable<Personal[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/externo/doc/${documento}`).pipe(
      map((response) => response as Personal[])
    );
  }

  //ACCIDENTE

  getAllResponsableByAccidente(codacci: number): Observable<Personal[]> {
    return this.http.get(`${this.URL_SISTEMA}/accidente/list/codacci/${codacci}`).pipe(
      map((response) => response as Personal[])
    );
  }


  //EMO
  
  getAllPersonalDispByProEmo(codprogram: number): Observable<Personal[]> {
    return this.http.get(`${this.URL_SISTEMA}/emo/list/cod/${codprogram}`).pipe(
      map((response) => response as Personal[])
    );
  }

  getAllPersonalByDocNoExistProEmo(documento: string, codprogram: number): Observable<Personal[]> {
    return this.http.get(`${this.URL_SISTEMA}/emo/list/documento/${documento}/codpro/${codprogram}`).pipe(
      map((response) => response as Personal[])
    );
  }

  getAllPersonalByDocNoExistProEmoAndUsuario(documento: string, codprogram: number, codusuario: string): Observable<Personal[]> {
    return this.http.get(`${this.URL_SISTEMA}/emo/list/documento/${documento}/codpro/${codprogram}/codusuario/${codusuario}`).pipe(
      map((response) => response as Personal[])
    );
  }

  getAllPersonalByAreaNoExistProEmoAndUsuario(area: string, codprogram: number, codusuario: string): Observable<Personal[]> {
    return this.http.get(`${this.URL_SISTEMA}/emo/list/area/${area}/codpro/${codprogram}/codusuario/${codusuario}`).pipe(
      map((response) => response as Personal[])
    );
  }

  //CAPACITACION


  getAllPersonalDispByProCapa(codprogram: number): Observable<Personal[]> {
    return this.http.get(`${this.URL_SISTEMA}/capa/list/cod/${codprogram}`).pipe(
      map((response) => response as Personal[])
    );
  }

  getAllPersonalByDocNoExistProCapa(documento: string, codprogram: number): Observable<Personal[]> {
    return this.http.get(`${this.URL_SISTEMA}/capa/list/documento/${documento}/codpro/${codprogram}`).pipe(
      map((response) => response as Personal[])
    );
  }

  getAllPersonalByDocNoExistProCapaAndUsuario(documento: string, codprogram: number, codusuario: string): Observable<Personal[]> {
    return this.http.get(`${this.URL_SISTEMA}/capa/list/documento/${documento}/codpro/${codprogram}/codusuario/${codusuario}`).pipe(
      map((response) => response as Personal[])
    );
  }

  getAllPersonalByAreaNoExistProCapaAndUsuario(area: string, codprogram: number, codusuario: string): Observable<Personal[]> {
    return this.http.get(`${this.URL_SISTEMA}/capa/list/area/${area}/codpro/${codprogram}/codusuario/${codusuario}`).pipe(
      map((response) => response as Personal[])
    );
  }

  //GESTION - COMITE

  getAllComitePersonalDispByNombreAndUsuario(search: string, codprogram: number, codusuario: string): Observable<Personal[]> {
    return this.http.get(`${this.URL_SISTEMA}/comite/list/personaldisp/nombre/${search}/${codprogram}/${codusuario}`).pipe(
      map((response) => response as Personal[])
    );
  }

  getAllComitePersonalDispByDocumentoAndUsuario(search: string, codprogram: number, codusuario: string): Observable<Personal[]> {
    return this.http.get(`${this.URL_SISTEMA}/comite/list/personaldisp/documento/${search}/${codprogram}/${codusuario}`).pipe(
      map((response) => response as Personal[])
    );
  }


}
