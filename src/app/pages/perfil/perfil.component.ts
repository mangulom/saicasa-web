import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppComponent } from 'src/app/app.component';
import { Menu } from 'src/app/models/menu';
import { Perfil } from 'src/app/models/perfil';
import { Perfilgrupofuncion } from 'src/app/models/Perfilgrupofuncion';
import { PerfilService } from 'src/app/services/perfil.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public formPerfil: FormGroup;
  public submitted = false;

  public tmpPerfil: number;
  public tmpPerfilMenu : Perfilgrupofuncion = new Perfilgrupofuncion();
  
  public selectedTabIndex: number = 0;

  public perfil: Perfil =  new Perfil();
  public perfiles: Perfil[];

  public menu: Menu = new Menu();
  public menus: Menu[] = [];

  public perfilmenu:  Perfilgrupofuncion =  new Perfilgrupofuncion();
  public perfilmenus: Perfilgrupofuncion[];
  
  perfilCol: string[] = ['Opciones', 'Descripcion'];
  perfilData = new MatTableDataSource();

  menuCol: string[] = ['Opciones', 'Nombre'];
  menuData = new MatTableDataSource();
  perfilmenuCol: string[] = ['Opciones', 'Nombre'];
  perfilmenuData = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('closebutton') modal: ElementRef;

  @ViewChild('paginatorMenu', { static: true, read: MatPaginator }) paginatorMenu: MatPaginator;
  @ViewChild('paginatorPerfilMenu', { static: true, read: MatPaginator }) paginatorPerfilMenu: MatPaginator;

  constructor(private formBuilder: FormBuilder,
    private perfilService: PerfilService,
    private appts: AppComponent,
    private changeDetectorRefs: ChangeDetectorRef) { }


  private closeModal(): void {
    this.modal.nativeElement.click();
    this.selectedTabIndex = 0;
  }

  editAccesoMenu(id: number){
    this.tmpPerfil = null;
    this.tmpPerfil = id;
    this.onFindMenuByPerfil(id);
    this.onFindPerGrupFuncByPerfil(id);
  }

  onUpdatePerfil(perfil: Perfil){
    this.perfilService.getPerfilById(perfil.id).subscribe(
      (result) => {
        this.perfil = result;
        this.formPerfil.patchValue({
          id: this.perfil.id,
          desperfil: this.perfil.desperfil
        });
      }, error => {
        console.log(error);
      }
    );
  }

  get f() {
    return this.formPerfil.controls;
  }

  onBuildFormPerfil(){
    this.formPerfil = this.formBuilder.group({
      id: [''],
      desperfil: ['', Validators.required]
    });
  }

  onResetFormPerfil() {
    this.selectedTabIndex = 0;
    this.submitted = false;
    this.formPerfil.reset();
    this.tmpPerfil = null;
  }

  onSubmit(){
    this.submitted = true;
    if (this.formPerfil.invalid) {
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


        this.perfilService.savePerfil(this.formPerfil.value).subscribe(
          (result) => {
            if (result) {
              this.onResetFormPerfil();
              this.onListPerfil();
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

  onListPerfil() {
    this.perfilService.getAllPerfil().subscribe(
      (result) => {
        this.perfiles = result;
        this.perfilData.data = result;
        this.perfilData.paginator = this.paginator;
      }, error => {
        console.log(error);
      }
    );
  }


  onFindMenuByPerfil(id: number) {
    this.perfilService.getAllMenuByPerfil(id).subscribe(
      (result) => {
        this.menus = result;
        this.menuData.data = result;
        this.menuData.paginator = this.paginatorMenu;
      }, error => {
        console.log(error);
      }
    );
  }

  onFindPerGrupFuncByPerfil(id: number) {
    this.perfilService.getAllPerGrupFunByPerfil(id).subscribe(
      (result) => {
        this.perfilmenus = result;
        this.perfilmenuData.data = result;
        this.perfilmenuData.paginator = this.paginatorPerfilMenu;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }


  addMenu(menu: Menu){

    this.tmpPerfilMenu.codperfil = this.tmpPerfil;
    this.tmpPerfilMenu.codgrupo = menu.id;

    this.perfilService.savePerGrupFun(this.tmpPerfilMenu).subscribe(
      (result) => {

        this.editAccesoMenu(result.codperfil);
        this.changeDetectorRefs.markForCheck();
      }, error => {
        console.log(error);
      }
    );
  }

  delete(perfilmenu: Perfilgrupofuncion){
    this.perfilService.deletePerGrupFunById(perfilmenu.id).subscribe(
      (result) => {
        this.editAccesoMenu(this.tmpPerfil);
        this.changeDetectorRefs.markForCheck();
      }, error => {
        console.log(error);
      }
    );
  }

  deletePerfil(perfil: Perfil) {

    Swal.fire({
      title: 'Advertencia',
      text: `¿Esta seguro que desea Eliminar el Registro?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#17a2b8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, desactivar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {

        this.perfilService.deletePerfilById(perfil.id).subscribe(
          (result) => {
            this.onListPerfil();
            this.changeDetectorRefs.markForCheck();
          }, error => {
            console.log(error);
            console.clear();
          }
        );

      }
    })
  }


  ngOnInit(): void {
    //this.appts.isPermit("perfil");
    this.onListPerfil();
    this.onBuildFormPerfil();
  }

}
