import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Empresa } from 'src/app/models/empresa';
import { Epps } from 'src/app/models/epps';
import { Sucursal } from 'src/app/models/sucursal';
import { Tabladetalle } from 'src/app/models/tabladetalle';
import { EmpresaService } from 'src/app/services/empresa.service';
import { EppsService } from 'src/app/services/epps.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import { TablaService } from 'src/app/services/tabla.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-epps',
  templateUrl: './epps.component.html',
  styleUrls: ['./epps.component.css']
})
export class EppsComponent implements OnInit {
  
  public formEpps: FormGroup;
  public submitted = false;

  public epps: Epps = new Epps();
  public listEpps: Epps[];

  public empresas: Empresa[];
  public sucursales: Sucursal[];
  public tiposEpps: Tabladetalle[];

  eppsCol: string[] = ['Opciones', 'Empresa', 'Sede', 'Tipo', 'Nombre', 'Estado'];
  eppsData = new MatTableDataSource();

  @ViewChild('paginatorEpps', { static: true, read: MatPaginator }) paginatorEpps: MatPaginator;
  
  @ViewChild('closebutton') modal: ElementRef;

  constructor(private empresaService: EmpresaService,
    private sucursalService: SucursalService,
    private formBuilder: FormBuilder,
    private eppsService: EppsService,
    private tablaService: TablaService,
    private usuarioService: UsuarioService,
    private changeDetectorRefs: ChangeDetectorRef) { }

  private closeModal(): void {
    this.modal.nativeElement.click();
  }

  //FORMLARIO
  onBuildFormEpps() {
    this.formEpps = this.formBuilder.group({
      id: [''],
      codempresa: [''],
      sede: [''],
      codtipo: [''],
      nombre: [''],
      usuarioreg: [''],
      fechareg: [''],
      estado: [null]
    });
  }

  get f() {
    return this.formEpps.controls;
  }

  onResetFormEpps() {
    this.submitted = false;
    this.formEpps.reset();
  }

  onSubmit() {
    this.submitted = true;
    if (this.formEpps.invalid) {
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
        this.eppsService.saveEpps(this.formEpps.getRawValue()).subscribe(
          (result) => {
            if (result) {
              this.onListEpps();
              this.changeDetectorRefs.detectChanges();
              this.toastAcceptedAlert("Se registro con exito");
              this.onResetFormEpps();
              this.closeModal();
            }
          }, error => {
            console.log(error);
          }
        );
      }
    })
  }

  onUpdateEpps(epps: Epps) {
    this.eppsService.getEppsById(epps.id).subscribe(
      (result) => {
        console.log(result);
        this.formEpps.patchValue({
          id: result.id,
          codempresa: result.codempresa,
          sede: result.sede,
          codtipo: result.codtipo,
          nombre: result.nombre,
          usuarioreg: result.usuarioreg,
          fechareg: result.fechareg,
          estado: result.estado
        });
      }, error => {
        console.log(error);
      }
    );
  }

  onDisableEpps(epps: Epps) {
    Swal.fire({
      title: 'Advertencia',
      text: `¿Esta seguro que desea desactivar el registro?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#17a2b8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Desactivar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {
        this.eppsService.disableById(epps.id).subscribe(
          (result) => {
            this.onListEpps();
            this.changeDetectorRefs.markForCheck();
          }, error => {
            console.log(error);
          }
        );
      }
    })
  }

  onActiveEpps(epps: Epps) {
    Swal.fire({
      title: 'Advertencia',
      text: `¿Esta seguro que desea activar el Registro?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#17a2b8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, activar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {
        this.eppsService.enableById(epps.id).subscribe(
          (response) => {
            if (response > 0) {
              this.onListEpps();
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

  //GENERALES
  onListEpps() {
    this.eppsService.getAllEpps().subscribe(
      (result) => {
        this.listEpps = result;
        this.eppsData.data = result;
        this.eppsData.paginator = this.paginatorEpps;
      }, error => {
        console.log(error);
      }
    );
  }

  onListTipoEpps() {
    this.tablaService.getAllTiposEpps().subscribe(
      (result) => {
        this.tiposEpps = result;
      }, error => {
        console.log(error);
      }
    );
  }

  onListEmpresa() {
    this.empresaService.getAllEmpresa().subscribe(
      (result) => {
        this.empresas = result;
        this.onListSucursalEmpresa(result[0].codempresa);
      }, error => {
        console.log(error);
      }
    );
  }

  onListSucursalEmpresa(codempresa: string) {
    this.sucursalService.getAllSucursalByEmpresa(codempresa).subscribe(
      (result) => {
        this.sucursales = result;
      }, error => {
        console.log(error);
      }
    );
  }

  onChangeEmpresaSucursal(event: any) {
    this.sucursales = null;
    if (event != null && event != '') {
      this.onListSucursalEmpresa(event);
    }
    else {
      console.log("error de toma de dato");
    }
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
    this.onBuildFormEpps();
    this.onListTipoEpps();
    this.onListEpps();
    this.onListEmpresa();
  }

}
