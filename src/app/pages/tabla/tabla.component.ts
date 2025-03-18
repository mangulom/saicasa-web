import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppComponent } from 'src/app/app.component';
import { Tabla } from 'src/app/models/tabla';
import { Tabladetalle } from 'src/app/models/tabladetalle';
import { AuthService } from 'src/app/services/auth.service';
import { TablaService } from 'src/app/services/tabla.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit {

  public formTabla: FormGroup;
  public formTablaDetalle: FormGroup;

  public isupdate: boolean = false;

  public codigoTablaTmp : string;
  public readOnlyDetalle = false;
  public readOnlyTabla = false;
  
  public submitted = false;
  public submittedDetalle = false;

  public tabla: Tabla = new Tabla();
  public tablas: Tabla[] = [];

  public tablaDetalle:  Tabladetalle = new Tabladetalle();
  public tablaDetalles: Tabladetalle[] = [];

  tablaCol: string[] = ['Opciones', 'Codigo', 'Descripcion'];
  tablaData = new MatTableDataSource();

  tablaDetalleCol: string[] = ['Opciones', 'Codigo', 'Descorta', 'Deslarga'];
  tablaDetalleData = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('paginatorTablaDetalle', { static: true, read: MatPaginator }) paginatorTablaDetalle: MatPaginator;
  @ViewChild('closebutton') modal: ElementRef;

  constructor(private formBuilder: FormBuilder,
    private formBuilder2: FormBuilder,
    private authService: AuthService,
    private appts: AppComponent,
    private tablaService: TablaService,
    private changeDetectorRefs: ChangeDetectorRef) { }

  onBuildFormTabla() {
    this.formTabla = this.formBuilder.group({
      tiptabla: ['', Validators.required],
      destabla: ['', Validators.required],
      desobservacion: [''],
      indtabladetsistema: [''],
      isupdate: ['']
    });
  }

  onBuildFormTablaDetalle() {
    this.formTablaDetalle = this.formBuilder2.group({
      id: [],
      tiptabla: [''],
      descorta: ['', Validators.required],
      deslarga: ['', Validators.required],
      codvar: ['']
    });
  }


  private closeModal(): void {
    this.modal.nativeElement.click();
  }


  editTablaDetalle(tabla: Tabla){
    this.codigoTablaTmp = null;
    this.codigoTablaTmp = tabla.tiptabla;
    //this.onListMenuDisp(menu.id);
    //this.formUsuario.controls["password"].setValidators([Validators.required]);
   
    this.formTablaDetalle.patchValue({
      id: null,
      tiptabla: this.codigoTablaTmp,
      descorta: null,
      deslarga: null
    });

    this.onListTablaDetalle(tabla.tiptabla);
  }

  deleteTabla(tabla: Tabla){

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

        this.tablaService.deleteTablaById(tabla.tiptabla).subscribe(
          (response) => {
            if (response > 0) {
              this.onListTabla();
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

  onDeleteTablaDetalle(tablaDetalle: Tabladetalle){
    Swal.fire({
      title: 'Advertencia',
      text: `¿Desea Eliminar el Registro?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#17a2b8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, desactivar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {


        this.tablaService.deleteTablaDetalleById(tablaDetalle.id).subscribe(
          (response) => {
            if (response > 0) {
              this.onListTablaDetalle(tablaDetalle.tiptabla);
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

  onSunmitTablaDetalle(){

    this.submittedDetalle = true;
    if (this.formTablaDetalle.invalid) {
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

        this.tablaService.saveTablaDetalle(this.formTablaDetalle.value).subscribe(
          (result) => {
            if (result) {
              this.codigoTablaTmp = result.tiptabla;
              this.onResetFormTablaDetalle();
              this.onListTablaDetalle(result.tiptabla);
              this.changeDetectorRefs.detectChanges();
              this.toastAcceptedAlert("Se registro con exito");

            }else{
              this.toastRejectAlert("Validar Codigo");
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
    if (this.formTabla.invalid) {
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

        this.tablaService.saveTabla(this.formTabla.value).subscribe(
          (result) => {
            if (result != null) {
              this.onResetFormTabla();
              this.onListTabla();
              this.changeDetectorRefs.detectChanges();
              this.toastAcceptedAlert("Se registro con exito");
              this.closeModal();
            } else {
              this.toastRejectAlert("Ya Existe el Codigo");
              this.closeModal();
            }
          }, error => {
            console.log(error);
          }
        );
      }
    })
  }

  get f() {
    return this.formTabla.controls;
  }

  get g() {
    return this.formTablaDetalle.controls;
  }

  onUpdateTabla(tabla: Tabla) {
    this.readOnlyTabla = true;
    this.isupdate = true;
    this.tablaService.getTablaById(tabla.tiptabla).subscribe(
      (result) => {
        this.tabla = result;
        this.formTabla.patchValue({
          tiptabla: this.tabla.tiptabla,
          destabla: this.tabla.destabla,
          desobservacion: this.tabla.desobservacion,
          indtabladetsistema: this.tabla.indtabladetsistema,
          isupdate: this.isupdate
        });
      }, error => {
        console.log(error);
      }
    );
  }

  onUpdateTablaDetalle(tablaDet: Tabladetalle){
    this.tablaService.getTablaDetalleById(tablaDet.id).subscribe(
      (result) => {
        this.tablaDetalle = result;
        this.formTablaDetalle.patchValue({
          id: result.id,
          tiptabla: this.tablaDetalle.tiptabla,
          descorta: this.tablaDetalle.descorta,
          deslarga: this.tablaDetalle.deslarga,
          codvar: this.tablaDetalle.codvar
        });
      }, error => {
        console.log(error);
      }
    );

  }

  onListTabla() {
    this.tablaService.getAllTabla().subscribe(
      (result) => {
        this.tablas = result;
        this.tablaData.data = result;
        this.tablaData.paginator = this.paginator;
        //console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onListTablaDetalle(tiptabla: string) {
    this.tablaService.getAllTablaDetalle(tiptabla).subscribe(
      (result) => {
        this.tablaDetalles = result;
        this.tablaDetalleData.data = result;
        this.tablaDetalleData.paginator = this.paginatorTablaDetalle;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onResetFormTabla(){
    this.readOnlyTabla = false;
    this.isupdate = false;
    this.submitted = false;
    this.formTabla.reset();
    this.formTabla.get('isupdate').setValue(this.isupdate);
  }

  onResetFormTablaDetalle() {
    this.submittedDetalle = false;
    this.formTablaDetalle.reset();
    this.formTablaDetalle.patchValue({
      id: null,
      tiptabla: this.codigoTablaTmp,
      descorta: null,
      deslarga: null
    });
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

  toastRejectAlert(mensaje: string) {
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
      icon: 'warning',
      title: mensaje
    })
  }

  ngOnInit(): void {
    //this.appts.isPermit("tabla");
    this.onListTabla();
    this.onBuildFormTabla();
    this.onBuildFormTablaDetalle();
  }

}
