import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Empresa } from 'src/app/models/empresa';
import { Matriz } from 'src/app/models/matriz';
import { Sucursal } from 'src/app/models/sucursal';
import { EmpresaService } from 'src/app/services/empresa.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import { MatrizService } from 'src/app/services/matriz.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-matriz',
  templateUrl: './matriz.component.html',
  styleUrls: ['./matriz.component.css']
})
export class MatrizComponent implements OnInit {

  //FORMULARIO
  public formMatriz: FormGroup;
  public submitted = false;
  public tmpUpdate = false;

  //FILE ARCHIVO
  public selectedFileMatriz: File;
  @ViewChild('fileMatriz') inputFileMatriz: ElementRef;

  //DATOS GENERALES
  public matriz: Matriz = new Matriz();
  public matrices: Matriz[];
  public empresas: Empresa[];
  public sucursales: Sucursal[];

  matrizCol: string[] = ['Opciones', 'Empresa', 'Fechaini', 'Fechafin', 'Estado'];
  matrizData = new MatTableDataSource();

  @ViewChild('paginatorMatriz', { static: true, read: MatPaginator }) paginatorMatriz: MatPaginator;
  @ViewChild('closebutton') modal: ElementRef;

  constructor(private empresaService: EmpresaService,
    private sucursalService: SucursalService,
    private matrizService: MatrizService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef) { }

  private closeModalMatriz(): void {
    this.modal.nativeElement.click();
  }

  //FORMLARIO
  onBuildFormMatriz() {
    this.formMatriz = this.formBuilder.group({
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
    return this.formMatriz.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.formMatriz.invalid) {
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

          this.formMatriz.get('usuarioreg').setValue(this.usuarioService.getUsuarioSession())

          this.matrizService.saveMatriz(this.formMatriz.value).subscribe(
            (result) => {
              if (result) {

                if (this.selectedFileMatriz != null) {
                  this.onFileCharger(result.id);
                }
                this.onListMatriz();
                this.changeDetectorRefs.detectChanges();
                this.toastAcceptedAlert("Se registro con exito");
                this.closeModalMatriz();
              } else {
                this.closeModalMatriz();
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

  onResetFormMatriz() {
    this.submitted = false;
    this.formMatriz.reset();
    this.selectedFileMatriz = null;
    this.onClearData();
  }

  onUpdateMatriz(matriz: Matriz) {
    this.onResetFormMatriz();

    this.matrizService.getMatrizById(matriz.id).subscribe(
      (result) => {
        this.matriz = result;

        this.formMatriz.patchValue({
          id: this.matriz.id,
          codempresa: this.matriz.codempresa,
          fechaini: this.matriz.fechaini,
          fechafin: this.matriz.fechafin,
          usuarioreg: this.matriz.usuarioreg,
          fechareg: this.matriz.fechareg,
          estado: this.matriz.estado,
          fechabaja: this.matriz.fechabaja,
          usuariobaja: this.matriz.usuariobaja,
          codarchivo: this.matriz.codarchivo,
          isupdate: this.matriz.isupdate
        });

      }, error => {
        console.log(error);
      }
    );
  }

  onDisableMatriz(matriz: Matriz) {
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
        this.matrizService.disabledMatriz(matriz.id, this.usuarioService.getUsuarioSession()).subscribe(
          (result) => {
            this.onListMatriz();
            this.changeDetectorRefs.markForCheck();
          }, error => {
            console.log(error);
          }
        );
      }
    })
  }

  onActiveMatriz(matriz: Matriz) {
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

        this.matrizService.enabledMatriz(matriz.id, this.usuarioService.getUsuarioSession()).subscribe(
          (response) => {
            if (response > 0) {
              this.onListMatriz();
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

  deleteById(matriz: Matriz) {
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

        this.matrizService.deleteMatrizById(matriz.id, this.usuarioService.getUsuarioSession()).subscribe(
          (result) => {
            this.onListMatriz();
            this.changeDetectorRefs.markForCheck();
          }, error => {
            this.toastRejectAlert("Existe Personal Asignado");
            console.log(error);
          }
        );
      }
    })
  }

  //LISTA COMBO BOX
  onListMatriz() {
    if (this.usuarioService.getUsuarioSession()) {
      this.matrizService.getAllMatriz(this.usuarioService.getUsuarioSession()).subscribe(
        (result) => {
          console.log(result);
          this.matrices = result;
          this.matrizData.data = result;
          this.matrizData.paginator = this.paginatorMatriz;
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
  onFileSelectedMatriz(event: { target: { files: File[]; }; }) {
    if (<File>event.target.files[0] != null) {
      this.selectedFileMatriz = <File>event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFileMatriz);
    }
  }

  onFileCharger(id: number) {
    const Files = this.inputFileMatriz.nativeElement;
    this.selectedFileMatriz = Files.files[0];
    const ExcelFile: File = this.selectedFileMatriz;
    if (ExcelFile != null) {
      const formData: FormData = new FormData();
      formData.append('file', ExcelFile, ExcelFile.name);
      formData.append('id', id.toString());
      this.matrizService.CargarFileMatriz(formData).subscribe(
        (result) => {
          this.onListMatriz();
        }, error => {
          console.log(error);
        }
      );

    }
  }

  descargarFile(matriz: Matriz) {
    this.matrizService.getMatrizOneArchivo(matriz.archivo.nombre).subscribe(
      (result) => {
        const a = document.createElement('a');
        document.body.appendChild(a);
        const url = window.URL.createObjectURL(result);
        a.href = url;
        a.download = matriz.archivo.nombre;
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
    this.onBuildFormMatriz();
    this.onListEmpresa();
    this.onListMatriz();
  }

}
