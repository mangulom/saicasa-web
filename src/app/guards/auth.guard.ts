import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Usuario } from '../models/usuario';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private _usuario: Usuario;

  constructor(private authService: AuthService,
    private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuthenticated()) {

      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;

      let _url: string = "";
      state.url.split("/").forEach(element => {
        if (_url === "")
          if (element !== "")
            _url = element;
      });

      
      return this.authService.isPermit(this._usuario.usuario, _url);


    }
    Swal.fire('Mensaje', `No tienes acceso`, 'error');
    this.router.navigate(['/login']);
    return false;
  }
  
}
