import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Menu } from './models/menu';
import { Submenu } from './models/submenu';
import { Usuario } from './models/usuario';
import { AuthService } from './services/auth.service';
import { UsuarioService } from './services/usuario.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'frontend-angloamericana';

  public menus: Menu[];
  public submenus: Submenu[];
  public subsubmenu: Submenu[];
  private _usuario: Usuario;
  public usuarioPanel: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private usuarioService: UsuarioService,
    private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadAccessMenu();
    this.setUsuario();
  }

  loadUsuario(){
    if (JSON.parse(sessionStorage.getItem('usuario'))) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
    }
  }

  loadAccessMenu() {
    if (JSON.parse(sessionStorage.getItem('usuario'))) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      if (this._usuario.usuario != null) {
        this.accessMenu(this._usuario);
      }
    }
  }

  getUsuario(usuario: Usuario) {
    this.usuarioPanel = null;
    if (usuario) {
      this.usuarioService.getUsuarioByUsuario(usuario.usuario).subscribe(
        (result) => {
          sessionStorage.setItem('nombre_usuario', JSON.stringify(result.nombre));
          this.usuarioPanel = result.nombre;
          window.location.reload();
        }, error => {
          console.log(error);
        }
      );
    }
  }

  setUsuario() {
    if (sessionStorage.getItem('nombre_usuario') != null) {
      this.usuarioPanel = JSON.parse(sessionStorage.getItem('nombre_usuario'));
      console.log(this.usuarioPanel);
    }
  }

  isPermit(url: string){
      this.loadUsuario();
      this.authService.isPermit(this._usuario.usuario, url).subscribe(
        (result) => {
          console.log(this._usuario.usuario);
          if (!result) {
            Swal.fire('Aviso', 'No cuentas con acceso');
            this.router.navigate(['/principal']);
            return;
          }
          console.log(result);
        }, error => {
          console.log(error);
        }
      );
  }

  public auth: boolean = this.authService.isAuthenticated();

  login() {
    this.auth = this.authService.isAuthenticated();
    this.changeDetectorRefs.detectChanges();
  }

  logout(): void {
    let username = this.authService.usuario.usuario;
    this.authService.logout();
    this.auth = this.authService.isAuthenticated();
    this.changeDetectorRefs.detectChanges();
    Swal.fire('Logout', `Hola ${username}, has cerrado sesión con éxito!`, 'success');
    this.router.navigate(['/login']);
  }

  accessMenu(usuario: Usuario) {
    this.authService.accessMenu(usuario.usuario).subscribe(
      (result) => {
        this.menus = result;
        //console.log(result);
        this.menus.forEach(menu => {
          this.authService.accessSubMenuByUserAndGrupo(usuario.usuario, menu.id).subscribe(
            (result) => {
              //console.log(result);
              menu.maefuncion = result;
              result.forEach(sub => {
                if (sub.desurl == null && sub.codfuncionsup == null) {
                  this.authService.accessSubMenu(usuario.usuario, sub.id).subscribe(
                    (result) => {
                      //console.log(result);
                      sub.submenu = result;
                      sub.submenu.forEach(subsub => {
                        if (subsub.desurl == null && subsub.codfuncionsup != null) {
                          this.authService.accessSubMenu(usuario.usuario, subsub.id).subscribe(
                            (result) => {
                              subsub.submenu = result;
                              //console.log(subsub.submenu);
                            }, error => {
                              console.log(error);
                            }
                          );
                        }
                      });
                    }, error => {
                      console.log(error);
                    }
                  );
                }
              });



            }, error => {
              console.log(error);
            }
          );



        });

      }, error => {
        console.log(error);
      }
    );
  }
  


}
