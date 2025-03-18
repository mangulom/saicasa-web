import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Empresa } from 'src/app/models/empresa';
import { Politica } from 'src/app/models/politica';
import { Sucursal } from 'src/app/models/sucursal';
import { EmpresaService } from 'src/app/services/empresa.service';
import { PoliticaService } from 'src/app/services/politica.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-politica',
  templateUrl: './politica.component.html',
  styleUrls: ['./politica.component.css']
})
export class PoliticaComponent implements OnInit {

  //FORMULARIO
  public formPolitica: FormGroup;
  public submitted = false;
  public tmpUpdate = false;

  //FILE ARCHIVO
  public selectedFilePolitica: File;
  @ViewChild('filePolitica') inputFilePolitica: ElementRef;

  //DATOS GENERALES
  
  public politica: Politica = new Politica();
  public politicas: Politica[];

  public empresas: Empresa[];
  public sucursales: Sucursal[];

  politicaCol: string[] = ['Opciones', 'Empresa', 'Fechaini', 'Fechafin', 'Estado'];
  politicaData = new MatTableDataSource();

  @ViewChild('paginatorPolitica', { static: true, read: MatPaginator }) paginatorPolitica: MatPaginator;
  @ViewChild('closebutton') modal: ElementRef;

  constructor(private empresaService: EmpresaService,
    private sucursalService: SucursalService,
    private politicaService: PoliticaService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef) { }

  private closeModalPolitica(): void {
    this.modal.nativeElement.click();
  }

  //FORMLARIO

  onBuildFormPolitica() {
    this.onClearData();
    this.formPolitica = this.formBuilder.group({
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
    return this.formPolitica.controls;
  }

  onSubmit(){
    this.submitted = true;
    if (this.formPolitica.invalid) {
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

        if(this.usuarioService.getUsuarioSession()){

          this.formPolitica.get('usuarioreg').setValue(this.usuarioService.getUsuarioSession())

          this.politicaService.savePolitica(this.formPolitica.value).subscribe(
            (result) => {
              if (result) {

                if (this.selectedFilePolitica != null ){
                  this.onFileCharger(result.id);
                }
                this.onListPolitica();
                this.changeDetectorRefs.detectChanges();
                this.toastAcceptedAlert("Se registro con exito");
                this.closeModalPolitica();
              } else {
                this.closeModalPolitica();
              }
            }, error => {
              console.log(error);
            }
          );
        }

      }
    })
  }

  onClearData(){

  }

  onResetFormPolitica(){
    this.submitted = false;
    this.formPolitica.reset();
    this.selectedFilePolitica = null;
    this.onClearData();
  }

  onUpdatePolitica(politica: Politica) {
    this.onResetFormPolitica();

    this.politicaService.getPolitcaById(politica.id).subscribe(
      (result) => {
        this.politica = result;

        this.formPolitica.patchValue({
          id: this.politica.id,
          codempresa: this.politica.codempresa,
          fechaini: this.politica.fechaini,
          fechafin: this.politica.fechafin,
          usuarioreg: this.politica.usuarioreg,
          fechareg: this.politica.fechareg,
          estado: this.politica.estado,
          fechabaja: this.politica.fechabaja,
          usuariobaja: this.politica.usuariobaja,
          codarchivo: this.politica.codarchivo,
          isupdate: this.politica.isupdate
        });
        
      }, error => {
        console.log(error);
      }
    );
  }

  deleteById(politica: Politica) {
    Swal.fire({
      title: 'Advertencia',
      text: `¿Esta seguro que desea Eliminar el Registro?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#17a2b8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {
        this.politicaService.deletePolitica(politica.id, this.usuarioService.getUsuarioSession()).subscribe(
          (result) => {
            this.onListPolitica();
            this.changeDetectorRefs.markForCheck();
          }, error => {
            console.log(error);
          }
        );
      }
    })
  }

  //INICIAR COMPONENTE  

  onListPolitica() {   

    if (this.usuarioService.getUsuarioSession()) {

      this.politicaService.getAllPolitica(this.usuarioService.getUsuarioSession()).subscribe(
        (result) => {
          console.log(result);
          this.politicas = result;
          this.politicaData.data = result;
          this.politicaData.paginator = this.paginatorPolitica;
        }, error => {
          console.log(error);
        }
      );

    }

  }

  //Listas Combo box

  onListEmpresa() {
    if (this.usuarioService.getUsuarioSession()){
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

  onFileSelectedPolitica(event: { target: { files: File[]; }; }) {
    if (<File>event.target.files[0] != null) {
      this.selectedFilePolitica = <File>event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFilePolitica);
    }
  }

  onFileCharger(id: number) {

    const Files = this.inputFilePolitica.nativeElement;
    this.selectedFilePolitica = Files.files[0];
    const ExcelFile: File = this.selectedFilePolitica;

    if (ExcelFile != null) {
      const formData: FormData = new FormData();
      formData.append('file', ExcelFile, ExcelFile.name);
      formData.append('id', id.toString());

      this.politicaService.CargarFilePolitica(formData).subscribe(
        (result) => {
          //console.log(result);
          this.onListPolitica();
        }, error => {
          console.log(error);
        }
      );
    
    }
  }


  descargarFile(politica: Politica) {
    console.log(politica.archivo);
    this.politicaService.getPoliticaOneArchivo(politica.archivo.nombre).subscribe(
      (result) => {

        const a = document.createElement('a');
        document.body.appendChild(a);
        //const blob: any = new Blob([result], { type: 'octet/stream' });
        const url = window.URL.createObjectURL(result);
        a.href = url;
        a.download = politica.archivo.nombre;
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
    this.onBuildFormPolitica();
    this.onListEmpresa();
    this.onListPolitica();
  }

}
