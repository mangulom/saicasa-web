import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Empresa } from 'src/app/models/empresa';
import { Plananual } from 'src/app/models/plananual';
import { Sucursal } from 'src/app/models/sucursal';
import { EmpresaService } from 'src/app/services/empresa.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { PlananualService } from 'src/app/services/plananual.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-plananual',
  templateUrl: './plananual.component.html',
  styleUrls: ['./plananual.component.css']
})
export class PlananualComponent implements OnInit {

  //FORMULARIO
  public formPlanAnual: FormGroup;
  public submitted = false;
  public tmpUpdate = false;

  //FILE ARCHIVO
  public selectedFilePlanAnual: File;
  @ViewChild('filePlanAnual') inputFilePlanAnual: ElementRef;

  //DATOS GENERALES
  public planAnual: Plananual = new Plananual();
  public planAnuales: Plananual[];
  public empresas: Empresa[];
  public sucursales: Sucursal[];

  planAnualCol: string[] = ['Opciones', 'Empresa', 'Fechaini', 'Fechafin', 'Estado'];
  planAnualData = new MatTableDataSource();

  @ViewChild('paginatorPlanAnual', { static: true, read: MatPaginator }) paginatorPlanAnual: MatPaginator;
  @ViewChild('closebutton') modal: ElementRef;

  constructor(private empresaService: EmpresaService,
    private sucursalService: SucursalService,
    private planAnualService: PlananualService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef) { }

  private closeModalPlanAnual(): void {
    this.modal.nativeElement.click();
  }

  //FORMLARIO
  onBuildFormPlanAnual() {
    this.formPlanAnual = this.formBuilder.group({
      id: [''],
      codempresa: [''],
      fechaini: [''],
      fechafin: [''],
      usuarioreg: [''],
      fechareg: [''],
      estado: [null],
      fechabaja: [null],
      usuariobaja: [null],
      codarchivo: [null],
      isupdate: ['']
    });
  }

  get f() {
    return this.formPlanAnual.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.formPlanAnual.invalid) {
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

        if (this.usuarioService.getUsuarioSession()) {

          this.formPlanAnual.get('usuarioreg').setValue(this.usuarioService.getUsuarioSession())

          this.planAnualService.savePlananual(this.formPlanAnual.value).subscribe(
            (result) => {
              if (result) {

                if (this.selectedFilePlanAnual != null) {
                  this.onFileCharger(result.id);
                }
                this.onListPlanAnual();
                this.changeDetectorRefs.detectChanges();
                this.toastAcceptedAlert("Se registro con exito");
                this.closeModalPlanAnual();
              } else {
                this.closeModalPlanAnual();
              }
            }, error => {
              console.log(error);
            }
          );
        }

      }
    })
  }

  onClearData() {
  }

  onResetFormPlanAnual() {
    this.submitted = false;
    this.formPlanAnual.reset();
    this.selectedFilePlanAnual = null;
    this.onClearData();
  }

  onUpdatePlanAnual(planAnual: Plananual) {
    this.onResetFormPlanAnual();
    this.planAnualService.getPlananualById(planAnual.id).subscribe(
      (result) => {
        this.planAnual = result;
        this.formPlanAnual.patchValue({
          id: this.planAnual.id,
          codempresa: this.planAnual.codempresa,
          fechaini: this.planAnual.fechaini,
          fechafin: this.planAnual.fechafin,
          usuarioreg: this.planAnual.usuarioreg,
          fechareg: this.planAnual.fechareg,
          estado: this.planAnual.estado,
          fechabaja: this.planAnual.fechabaja,
          usuariobaja: this.planAnual.usuariobaja,
          codarchivo: this.planAnual.codarchivo,
          isupdate: this.planAnual.isupdate
        });
      }, error => {
        console.log(error);
      }
    );
  }

  onDisablePlanAnual(planAnual: Plananual) {
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
        this.planAnualService.disabledPlanAnual(planAnual.id, this.usuarioService.getUsuarioSession()).subscribe(
          (result) => {
            this.onListPlanAnual();
            this.changeDetectorRefs.markForCheck();
          }, error => {
            console.log(error);
          }
        );
      }
    })
  }

  onActivePlanAnual(planAnual: Plananual) {
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

        this.planAnualService.enabledPlanAnual(planAnual.id, this.usuarioService.getUsuarioSession()).subscribe(
          (response) => {
            if (response > 0) {
              this.onListPlanAnual();
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

  deleteById(planAnual: Plananual) {
    Swal.fire({
      title: 'Advertencia',
      text: `¿Esta seguro que desea eliminar el registro?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#17a2b8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {

        this.planAnualService.deletePlanAnualById(planAnual.id, this.usuarioService.getUsuarioSession()).subscribe(
          (result) => {
            this.onListPlanAnual();
            this.changeDetectorRefs.markForCheck();
          }, error => {
            this.toastRejectAlert("Existe Personal Asignado");
            console.log(error);
          }
        );
      }
    })
  }

  
  //INICIAR COMPONENTE  
  onListPlanAnual() {
    if (this.usuarioService.getUsuarioSession()) {
      this.planAnualService.getAllPlanAnual(this.usuarioService.getUsuarioSession()).subscribe(
        (result) => {
          console.log(result);
          this.planAnuales = result;
          this.planAnualData.data = result;
          this.planAnualData.paginator = this.paginatorPlanAnual;
        }, error => {
          console.log(error);
        }
      );
    }
  }

  onListEmpresa() {
    if (this.usuarioService.getUsuarioSession()) {
      this.empresaService.getAllEmpresaByUsuario(this.usuarioService.getUsuarioSession()).subscribe(
        (result) => {
          this.empresas = result;
        }, error => {
          console.log(error);
        }
      );
    }
  }


  //CARGA ARCHIVO
  onFileSelectedPlanAnual(event: { target: { files: File[]; }; }) {
    if (<File>event.target.files[0] != null) {
      this.selectedFilePlanAnual = <File>event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFilePlanAnual);
    }
  }

  onFileCharger(id: number) {
    const Files = this.inputFilePlanAnual.nativeElement;
    this.selectedFilePlanAnual = Files.files[0];
    const ExcelFile: File = this.selectedFilePlanAnual;
    if (ExcelFile != null) {
      const formData: FormData = new FormData();
      formData.append('file', ExcelFile, ExcelFile.name);
      formData.append('id', id.toString());

      this.planAnualService.CargarFilePlananual(formData).subscribe(
        (result) => {
          this.onListPlanAnual();
        }, error => {
          console.log(error);
        }
      );
    }
  }

  descargarFile(planAnual: Plananual) {
    console.log(planAnual.archivo);
    this.planAnualService.getPlananualOneArchivo(planAnual.archivo.nombre).subscribe(
      (result) => {
        const a = document.createElement('a');
        document.body.appendChild(a);
        const url = window.URL.createObjectURL(result);
        a.href = url;
        a.download = planAnual.archivo.nombre;
        a.click();
        window.URL.revokeObjectURL(url);
      }, error => {
        console.log(error);
      }
    );
  }

  //GENERALES
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
    this.onBuildFormPlanAnual();
    this.onListEmpresa();
    this.onListPlanAnual();
  }

}
