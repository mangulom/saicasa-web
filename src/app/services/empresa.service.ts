import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Empresa } from '../models/empresa';
import { Parametro } from '../models/parametro';
import { Usuarioemp } from '../models/usuarioemp';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private URL_SISTEMA: string = Parametro.SISTEMA_URL + "sistema/empresa";
  private URL_USUARIO_EMP: string = Parametro.SISTEMA_URL + "sistema/usuarioemp";
  //private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  getAllEmpresa(): Observable<Empresa[]> {
    return this.http.get(this.URL_SISTEMA + '/list').pipe(
      map((response) => response as Empresa[])
    );
  }

  getAllEmpresaByUsuario(usuario: string): Observable<Empresa[]> {
    return this.http.get(`${this.URL_SISTEMA}/list/usuario/${usuario}`).pipe(
      map((response) => response as Empresa[])
    );
  }

  getAllEmpresaByUsuarioEmp(usuario: string): Observable<Usuarioemp[]> {
    return this.http.get(`${this.URL_USUARIO_EMP}/list/${usuario}`).pipe(
      map((response) => response as Usuarioemp[])
    );
  }

  saveUsuarioEmp(maeUsuarioEmp: Usuarioemp): Observable<Usuarioemp> {
    return this.http.post<Usuarioemp>(`${this.URL_USUARIO_EMP}/save`, maeUsuarioEmp);
  }

  deleteUsuarioEmp(codempresa: string, codusuario: string): Observable<number> {
    return this.http.get<number>(`${this.URL_USUARIO_EMP}/delete/id/${codempresa}/${codusuario}`)
  }

  findUsuarioEmp(codempresa: string, codusuario: string): Observable<Usuarioemp> {
    return this.http.get<Usuarioemp>(`${this.URL_USUARIO_EMP}/find/${codempresa}/${codusuario}`)
  }

  execProcSyncEmpresa(): Observable<number> {
    return this.http.get<number>(`${this.URL_SISTEMA}/sync/empresa`)
  }

}
