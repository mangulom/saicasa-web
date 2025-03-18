import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppComponent } from 'src/app/app.component';
import { Funcion } from 'src/app/models/funcion';
import { Menu } from 'src/app/models/menu';
import { Submenu } from 'src/app/models/submenu';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  public formMenu : FormGroup;
  public formSubmenu: FormGroup;

  public submitted = false;
  public submittedSubmenu = false;

  public menu : Menu = new Menu();
  public menus : Menu[] =[];

  public submenu:  Submenu =  new Submenu();

  public menuDes: Submenu = new Submenu();
  menusDes: Submenu[] = [];
  public menuAsig: Submenu = new Submenu();
  menusAsig: Submenu[] = [];

  public codgrupoTmp : number;

  menuCol: string[] = ['Opciones', 'Nombre', 'Descripcion'];
  menuData =  new MatTableDataSource();

  menuDesCol: string[] = ['Opciones', 'Nombre'];
  menuDesData = new MatTableDataSource();
  menuAsigCol: string[] = ['Opciones', 'Codigo', 'Grupo', 'Nombre', 'Sup', 'Url', 'Estado'];
  menuAsigData = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('paginatorMenuDes', { static: true, read: MatPaginator }) paginatorMenuDes: MatPaginator;
  @ViewChild('paginatorMenuAsig', { static: true, read: MatPaginator }) paginatorMenuAsig: MatPaginator;
  @ViewChild('closebutton') modal: ElementRef;

  constructor(private formBuilder: FormBuilder,
    private appts: AppComponent,
    private authService: AuthService,
    private changeDetectorRefs: ChangeDetectorRef) { }

  onBuildFormMenu() {
    this.formMenu = this.formBuilder.group({
      id: [''],
      desgrupomenu: ['', Validators.required],
      desgrupo: ['', Validators.required],
      desicono: ['', Validators.required]
    });
  }

  onBuildFormSubMenu() {
    this.formSubmenu = this.formBuilder.group({
      id:[],
      codgrupo: [''],
      codfuncionsup: [],
      desfuncion: ['', Validators.required],
      desurl: ['']
    });
  }

  onUpdateMenu(menu: Menu) {
    this.authService.findMenuById(menu.id).subscribe(
      (result) => {
        this.menu = result;
        this.formMenu.patchValue({
          id: this.menu.id,
          desgrupomenu: this.menu.desgrupomenu,
          desgrupo: this.menu.desgrupo,
          desicono: this.menu.desicono
        });
      }, error => {
        console.log(error);
      }
    );
  }

  onUpdateSubMenu(submenu: Submenu) {
    this.authService.findById(submenu.id).subscribe(
      (result) => {
        this.submenu = result;
        this.formSubmenu.patchValue({
          id: this.submenu.id,
          codgrupo: this.submenu.codgrupo,
          codfuncionsup: this.submenu.codfuncionsup,
          desfuncion: this.submenu.desfuncion,
          desurl: this.submenu.desurl
        });
      }, error => {
        console.log(error);
      }
    );
  }

  editAccesoMenu(menu: Menu){
    this.codgrupoTmp = null;
    this.codgrupoTmp = menu.id;
    //this.onListMenuDisp(menu.id);
    this.formSubmenu.patchValue({
      codgrupo: this.codgrupoTmp,
      codfuncionsup: null,
      desfuncion: null,
      desurl: ['']
    });

    this.onListMenuAsig(menu.id);
  }

  private closeModal(): void {
    this.codgrupoTmp = null;
    this.modal.nativeElement.click();
  }

  deleteSubMenu(menu: Menu) {

    Swal.fire({
      title: 'Advertencia',
      text: `¿Desea Eliminar el Menu?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#17a2b8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, desactivar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {


    this.authService.deleteSubMenu(menu.id).subscribe(
        () => {
          this.onListMenu();
          this.changeDetectorRefs.detectChanges();
        }, error => {
          console.log(error);
          console.clear();
        }
    );

      }
  })

  }

  get f() {
    return this.formMenu.controls;
  }

  get g() {
    return this.formSubmenu.controls;
  }

  onResetFormMenu() {
    this.submitted = false;
    this.formMenu.reset();
  }

  onResetFormSubmenu(){
    this.submittedSubmenu = false;
    this.formSubmenu.reset();

    this.formSubmenu.patchValue({
      codgrupo: this.codgrupoTmp,
      codfuncionsup: null,
      desfuncion: null,
      desurl: null
    });
  }

  onSubmitSubmenu() {

    this.submittedSubmenu = true;
    if (this.formSubmenu.invalid) {
      return;
    }
    Swal.fire({
      title: 'Advertencia',
      text: `¿Esta seguro que desea guardar?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#17a2b8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Guardar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {
       
        this.authService.saveSubMenu(this.formSubmenu.value).subscribe(
          (result) => {
            if (result) {
              this.codgrupoTmp = result.codgrupo;
              this.onResetFormSubmenu();
              this.onListMenuAsig(result.codgrupo);
              this.changeDetectorRefs.detectChanges();
              this.toastAcceptedAlert("Se registro con exito");
              
            } 
          }, error => {
            console.log(error);
          }
        );


      }
    })


  }

  onSubmit() {
    this.submitted = true;
    if (this.formMenu.invalid) {
      return;
    }
    Swal.fire({
      title: 'Advertencia',
      text: `¿Esta seguro que desea guardar?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#17a2b8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Guardar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {

        this.authService.saveMenu(this.formMenu.value).subscribe(
          (result) => {
            if (result) {
              this.onResetFormMenu();
              this.onListMenu();
              this.changeDetectorRefs.detectChanges();
              this.toastAcceptedAlert("Se registro con exito");
              this.closeModal();
            } else {
              this.closeModal();
            }
          }, error => {
            console.log(error);
          }
        );
      }
    })
  }

  onListMenu() {
    this.authService.getAllMenu().subscribe(
      (result) => {
        this.menus = result;
        this.menuData.data = result;
        this.menuData.paginator = this.paginator;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onListMenuDisp(id: number) {
    this.authService.getAllDispSubMenuByCodGrupo(id).subscribe(
      (result) => {
        this.menusDes = result;
        this.menuDesData.data = result;
        this.menuDesData.paginator = this.paginatorMenuDes;
        //console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onListMenuAsig(id: number) {
    this.authService.getAllAsigSubMenuByCodGrupo(id).subscribe(
      (result) => {
        this.menusAsig = result;
        this.menuAsigData.data = result;
        this.menuAsigData.paginator = this.paginatorMenuAsig;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  toastAcceptedAlert(mensaje: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    Toast.fire({
      icon: 'success',
      title: mensaje
    })
  }

  onDisableSubmenu(submenu: Submenu) {
    Swal.fire({
      title: 'Advertencia',
      text: `¿Esta seguro que desea Eliminar el Menu?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#17a2b8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, desactivar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {

        this.authService.disableSubmenu(submenu.id).subscribe(
          (response) => {
            if (response > 0) {
              this.onListMenuAsig(submenu.codgrupo);
              this.changeDetectorRefs.markForCheck();
            } else {
              Swal.fire(
                'Error!',
                'No se realizo ningun cambio.',
                'error'
              )
            }
          }, error => {
            console.log(error);
          });

      }
    })
  }

  onActiveSubmenu(submenu: Submenu) {
    Swal.fire({
      title: 'Advertencia',
      text: `¿Esta seguro que desea activar el Menu?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#17a2b8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, activar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {

        this.authService.enableSubmenu(submenu.id).subscribe(
          (response) => {
            if (response > 0) {
              this.onListMenuAsig(submenu.codgrupo);
              this.changeDetectorRefs.markForCheck();
            } else {
              Swal.fire(
                'Error!',
                'No se realizo ningun cambio.',
                'error'
              )
            }
          }, error => {
            console.log(error);
          });
      }
    })
  }

  ngOnInit(): void {
    //this.appts.isPermit("menu");
    this.onListMenu();
    this.onBuildFormMenu();
    this.onBuildFormSubMenu();
  }

}
