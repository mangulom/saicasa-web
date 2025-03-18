import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Empresa } from 'src/app/models/empresa';
import { Procomite } from 'src/app/models/procomite';
import { Comite } from 'src/app/models/comite';
import { Sucursal } from 'src/app/models/sucursal';
import { EmpresaService } from 'src/app/services/empresa.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ProcomiteService } from 'src/app/services/procomite.service';
import { ComiteService } from 'src/app/services/comite.service';
import Swal from 'sweetalert2';
import { Personal } from 'src/app/models/personal';
import { SelectionModel } from '@angular/cdk/collections';
import { PersonalService } from 'src/app/services/personal.service';
import { TablaService } from 'src/app/services/tabla.service';
import { Tabladetalle } from 'src/app/models/tabladetalle';
import { Procomiteactaarchivo } from 'src/app/models/procomiteactaarchivo';
import { MaearchivoService } from 'src/app/services/maearchivo.service';

@Component({
  selector: 'app-procomite',
  templateUrl: './procomite.component.html',
  styleUrls: ['./procomite.component.css']
})
export class ProcomiteComponent implements OnInit {

  //FORMULARIO - PRO COMITE
  public formProComite: FormGroup;
  public submitted = false;
  public tmpUpdate = false;

  //FORMULARIO - DETALLE COMITE
  public formComite: FormGroup;
  public searchFormPersonal: FormGroup;
  public submittedComite = false;
  public codigoProgram: number;

  //BUSCAR PERSONAL - DETALLE COMITE
  public searhInputAsignar: string;
  public selectedBusquedaAsign: string = 'Documento';
  public personalAsignados: Personal[] = [];

  //FILE ARCHIVO - PRO COMITE
  public selectedFileProComite: File;
  @ViewChild('fileProComite') inputFileProComite: ElementRef;

  //FILE ARCHIVO - PRO COMITE - ACTAS
  public formFileCarga: FormGroup;
  public selectedFileProComiteActa: File;
  @ViewChild('fileProComiteActa') inputFileProComiteActa: ElementRef;
  public proComiteActaArchivo: Procomiteactaarchivo = new Procomiteactaarchivo();
  public proComiteActaArchivos: Procomiteactaarchivo[];

  //DATOS GENERALES - PRO COMITE
  public proComite: Procomite = new Procomite();
  public proComites: Procomite[];
  public empresas: Empresa[];
  public sucursales: Sucursal[];

  //DATOS GENERALES - DETALLE COMITE
  public comite: Comite = new Comite();
  public comites: Comite[];
  public comiCargos: Tabladetalle[];

  //TABLA - PRO COMITE
  proComiteCol: string[] = ['Opciones', 'Empresa', 'Fechaini', 'Fechafin', 'Estado'];
  proComiteData = new MatTableDataSource();

  //TABLA - PRO COMITE ACTAS
  proComiteArchivoActaCol: string[] = ['Opciones', 'Nombre', 'Fecha'];
  proComiteArchivoActaData = new MatTableDataSource();

  //TABLA PERSONAL ASIGNAR  - DETALLE COMITE
  personalDisponibleCol: string[] = ['select', 'Nombre', 'DNI', 'Sede','Area'];
  personalDisponibleData = new MatTableDataSource<Personal>();
  selection = new SelectionModel<Personal>(true, []);

  //TABLA PERSONAL PROGRAMADO - DETALLE COMITE
  PersonalProgramadoCol: string[] = ['Opciones', 'DNI', 'ApePaterno', 'ApeMaterno', 'Nombres', 'Cargo', 'NroVotos'];
  PersonalProgramadoData = new MatTableDataSource();

  //EXTERNO - PRO COMITE
  @ViewChild('paginatorproComite', { static: true, read: MatPaginator }) paginatorproComite: MatPaginator;
  @ViewChild('paginatorProComiteActa', { static: true, read: MatPaginator }) paginatorProComiteActa: MatPaginator;
  @ViewChild('closebutton') modal: ElementRef;


  //EXTERNO - DETALLE COMITE
  @ViewChild('paginatorPersonalDisponible', { static: true, read: MatPaginator }) paginatorPersonalDisponible: MatPaginator;
  @ViewChild('paginatorPersonalProgramado', { static: true, read: MatPaginator }) paginatorPersonalProgramado: MatPaginator;
  @ViewChild('closebuttonRes') modalRes: ElementRef;

  constructor(private empresaService: EmpresaService,
    private sucursalService: SucursalService,
    private proComiteService: ProcomiteService,
    private comiteService: ComiteService,
    private personalService: PersonalService,
    private maeArchivoService: MaearchivoService,
    private tablaService: TablaService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef) { }

  private closeModalPolitica(): void {
    this.modal.nativeElement.click();
  }

  private closeModalResponsable(): void {
    this.modalRes.nativeElement.click();
  }

  //FORMLARIOS

  onBuildFormProComite() {
    //this.onClearData();
    this.formProComite = this.formBuilder.group({
      id: [''],
      codempresa: [''],
      fechaini: [''],
      fechafin: [''],
      estado: [null],
      usuarioreg: [''],
      fechareg: [''],
      codarchivo: ['']
    });
  }

  get f() {
    return this.formProComite.controls;
  }

  onBuildFormComite(){
    this.formComite = this.formBuilder.group({
      id: [''],
      codempresa: [''],
      codprogram: [''],
      fechaini: [''],
      fechafin: [''],
      codcargo: [''],
      nrovotos: [''],
      numdocidentidad: [''],
      apepaterno: [''],
      apematerno: [''],
      nomtrabajador: [''],
      nomarea: [''],
      personales: [''],
    });
  }

  //FILTRAR PERSONAL
  onBuildSearchPersonal() {
    this.searchFormPersonal = this.formBuilder.group({
      dato: ['']
    });
  }

  //LISTADO DE PERSONA X DOCUMENTO
  onGetPersonalDispByDocumentoAndUsuario(documento: string, codigo: number) {
    if (this.usuarioService.getUsuarioSession()){
      if (this.codigoProgram){
        this.personalService.getAllComitePersonalDispByDocumentoAndUsuario(documento, codigo, this.usuarioService.getUsuarioSession()).subscribe(
          (result) => {
            this.personalDisponibleData.data = result;
            this.personalDisponibleData.paginator = this.paginatorPersonalDisponible;
          }, error => {
            console.log(error);
          }
        );
      }else{
        alert("No se encontro codigo")
      }
    }else{
      this.toastRejectAlert("Sesion de Usuario - Caducado");
    }
  }

  //LISTADO DE PERSONA X NOMBRE
  onGetPersonalDispByNombreAndUsuario(documento: string, codigo: number) {
    if (this.usuarioService.getUsuarioSession()) {
      if (this.codigoProgram) {
        this.personalService.getAllComitePersonalDispByNombreAndUsuario(documento, codigo, this.usuarioService.getUsuarioSession()).subscribe(
          (result) => {
            this.personalDisponibleData.data = result;
            this.personalDisponibleData.paginator = this.paginatorPersonalDisponible;
          }, error => {
            console.log(error);
          }
        );
      } else {
        alert("No se encontro codigo")
      }
    } else {
      this.toastRejectAlert("Sesion de Usuario - Caducado");
    }
  }

  //PROCESOS
  onSubmit() {
    this.submitted = true;
    if (this.formProComite.invalid) {
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

          this.formProComite.get('usuarioreg').setValue(this.usuarioService.getUsuarioSession())

          this.proComiteService.saveProComite(this.formProComite.value).subscribe(
            (result) => {
              if (result) {

                if (this.selectedFileProComite != null) {
                  this.onFileCharger(result.id);
                }
                this.onListProComite();
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

  onClearData() {

  }

  onResetFormProComite() {
    this.submitted = false;
    this.formProComite.reset();
    this.selectedFileProComite = null;
    this.inputFileProComite.nativeElement.value = "";
    this.onClearData();
  }


  onUpdateProComite(procomite: Procomite) {
    //this.onResetFormProComite();
    console.log("el id es  " + procomite.id);
    this.proComiteService.getProComiteById(procomite.id).subscribe(
      (result) => {
        this.proComite = result;

        this.formProComite.patchValue({
          id: this.proComite.id,
          codempresa: this.proComite.codempresa,
          fechaini: this.proComite.fechaini,
          fechafin: this.proComite.fechafin,
          estado: this.proComite.estado,
          usuarioreg: this.proComite.usuarioreg,
          fechareg: this.proComite.fechareg,
          codarchivo: this.proComite.codarchivo
        });

      }, error => {
        console.log(error);
      }
    );
  }

  deleteById(procomite: Procomite) {
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
        this.proComiteService.deleteProComiteById(procomite.id).subscribe(
          (result) => {
            this.onListProComite();
            this.changeDetectorRefs.markForCheck();
          }, error => {
            console.log(error);
          }
        );
      }
    })
  }

  //COMITE DETALLE

  onAsignarProgramacion(procomite: Procomite){
    this.proComiteService.getProComiteById(procomite.id).subscribe(
      (result) => {
        
        this.proComite = result;
        this.codigoProgram = result.id;
        this.getAllComiteByProgram(result.id);
        this.onListProComiteActaArchivosById(result.id);

        this.formComite.patchValue({
          id: null,
          codempresa: result.codempresa,
          codprogram: result.id,
          fechaini: result.fechaini,
          fechafin: result.fechafin,
          codcargo: null,
          nrovotos: null,
          numdocidentidad: [''],
          apepaterno: [''],
          apematerno: [''],
          nomtrabajador: [''],
          nomarea: [''],
          personales: ['']
        });
        
      }, error => {
        console.log(error);
      }
    );
  }
  
  onSubmitComite(){

    this.submittedComite = true;
    if (this.formComite.invalid) {
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

        if (this.personalAsignados.length > 0) {

          this.comiteService.saveComite(this.formComite.getRawValue()).subscribe(
            (result) => {
              if (result) {
                this.selection.clear();
                this.getAllComiteByProgram(result.codprogram);
                //this.onListPersonalAsignar(result.codprogram);
                this.onClearSelectAsign();
                this.onListProComite();
                this.changeDetectorRefs.detectChanges();
                this.toastAcceptedAlert("Se registro con exito");
                this.submittedComite = false;
                this.onClearDataPersonal();
              } else {
                this.closeModalResponsable();
              }
            }, error => {
              console.log(error);
            }
          );

        } else {
          this.toastRejectAlert("No hay Personal seleccionados");
        }


      }
    })

  }

  onClearSelectAsign() {
    this.personalDisponibleData.data = [];
    this.personalDisponibleData.paginator = this.paginatorPersonalDisponible;
  }

  getAllComiteByProgram(codprogram: number){
    this.comiteService.getAllComiteByProgram(codprogram).subscribe(
      (result) => {
        console.log(result);
        this.comites = result;
        this.PersonalProgramadoData.data = result;
        this.PersonalProgramadoData.paginator = this.paginatorPersonalProgramado;
      }, error => {
        console.log(error);
      }
    );
  }

  deleteByIdComite(comite: Comite) {

    this.comiteService.deleteComiteById(comite.id).subscribe(
      (result) => {
        //this.onListPersonalAsignar(capacitacion.codprogram);
        this.getAllComiteByProgram(comite.codprogram);
        this.onListProComite();
        this.changeDetectorRefs.markForCheck();
      }, error => {
        console.log(error);
      }
    );

  }


  //SELECIONAR PERSONAL
  
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.personalDisponibleData.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.personalDisponibleData.data.forEach(row => this.selection.select(row));
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(personal?: Personal): string {
    if (!personal) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(personal) ? 'deselect' : 'select'} row ${personal.codpersonal + 1}`;
  }

  isSelected() {
    this.personalAsignados = [];
    this.selection.selected.forEach(
      x => this.personalAsignados.push(x)
    )
    this.formComite.get('personales').setValue(this.personalAsignados);

    if (this.personalAsignados.length == 1) {
      this.formComite.get('numdocidentidad').setValue(this.personalAsignados[0].numdocidentidad);
      this.formComite.get('apepaterno').setValue(this.personalAsignados[0].apepaterno);
      this.formComite.get('apematerno').setValue(this.personalAsignados[0].apematerno);
      this.formComite.get('nomtrabajador').setValue(this.personalAsignados[0].nomtrabajador);
      this.formComite.get('nomarea').setValue(this.personalAsignados[0].desareas);
    } else {

      this.onClearDataPersonal();
      //this.formPersonal.reset();
    }

    console.log(this.personalAsignados)
  }


  onClearDataPersonal() {
    this.formComite.get('numdocidentidad').setValue("");
    this.formComite.get('apepaterno').setValue("");
    this.formComite.get('apematerno').setValue("");
    this.formComite.get('nomtrabajador').setValue("");
    this.formComite.get('nomarea').setValue("");
  }

  onSearchPersonalAsignar() {
    this.selection.clear();
    console.log(this.searhInputAsignar);
    if (this.searhInputAsignar != null) {
      if (this.searhInputAsignar.trim() != '') {
        if (this.selectedBusquedaAsign == "Documento") {
          this.onGetPersonalDispByDocumentoAndUsuario(this.searhInputAsignar, this.codigoProgram, );
        }
        if (this.selectedBusquedaAsign == "Nombre") {
          this.onGetPersonalDispByNombreAndUsuario(this.searhInputAsignar, this.codigoProgram);
        }
      }
    }
  }

  //INICIAR COMPONENTE  

  onListProComite() {

    if (this.usuarioService.getUsuarioSession()) {
      this.proComiteService.getAllProComite(this.usuarioService.getUsuarioSession()).subscribe(
        (result) => {
          console.log(result);
          this.proComites = result;
          this.proComiteData.data = result;
          this.proComiteData.paginator = this.paginatorproComite;
        }, error => {
          console.log(error);
        }
      );
    }
  }


  //CARGA ARCHIVO - PRO COMITE 

  onFileSelectedProComite(event: { target: { files: File[]; }; }) {
    if (<File>event.target.files[0] != null) {
      this.selectedFileProComite = <File>event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFileProComite);
    }
  }

  onFileCharger(id: number) {

    const Files = this.inputFileProComite.nativeElement;
    this.selectedFileProComite = Files.files[0];
    const ExcelFile: File = this.selectedFileProComite;

    if (ExcelFile != null) {
      const formData: FormData = new FormData();
      formData.append('file', ExcelFile, ExcelFile.name);
      formData.append('id', id.toString());

      this.proComiteService.CargarFileProComite(formData).subscribe(
        (result) => {
          //console.log(result);
          this.onListProComite();
        }, error => {
          console.log(error);
        }
      );

    }
  }


  //CARGA ARCHIVO - PRO COMITE ACTAS

  onBuildFormFileCarga() {
    this.formFileCarga = this.formBuilder.group({
      codprogram: [''],
      fechareunion: [''],
      file: ['']
    });
  }

  onFileSelectedProComiteActas(event: { target: { files: File[]; }; }) {
    if (<File>event.target.files[0] != null) {
      this.selectedFileProComiteActa = <File>event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFileProComiteActa);
    }
  }

  onFileChargerActas() {

    const Files = this.inputFileProComiteActa.nativeElement;
    this.selectedFileProComiteActa = Files.files[0];
    const ExcelFile: File = this.selectedFileProComiteActa;

    if (ExcelFile != null) {
      const formData: FormData = new FormData();
      formData.append('file', ExcelFile, ExcelFile.name);
      formData.append('id', this.codigoProgram.toString());
      formData.append('fechareunion', this.formFileCarga.get('fechareunion').value);

      this.proComiteService.CargarFileProComiteActa(formData).subscribe(
        (result) => {
          //console.log(result);
          this.onListProComiteActaArchivosById(this.codigoProgram);
        }, error => {
          console.log(error);
        }
      );

    }
  }

  //ACTAS

  onListProComiteActaArchivosById(id: number) {
    this.maeArchivoService.getAllArchivosByProComiteActa(id).subscribe(
      (result) => {
        this.proComiteActaArchivos = result;
        this.proComiteArchivoActaData.data = result;
        this.proComiteArchivoActaData.paginator = this.paginatorProComiteActa;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  //COMITE ACTAS 

  descargarFileActas(archi: Procomiteactaarchivo) {
    console.log(archi.archivo);
    this.maeArchivoService.getProComiteActaOneArchivo(archi.archivo.nombre).subscribe(
      (result) => {

        const a = document.createElement('a');
        document.body.appendChild(a);
        //const blob: any = new Blob([result], { type: 'octet/stream' });
        const url = window.URL.createObjectURL(result);
        a.href = url;
        a.download = archi.archivo.nombre;
        a.click();
        window.URL.revokeObjectURL(url);
      }, error => {
        console.log(error);
      }
    );
  }

  deleteByIdProComiteActaArchivo(procapaArc: Procomiteactaarchivo) {
    this.maeArchivoService.deleteProComiteActaArchivoById(procapaArc.id).subscribe(
      (result) => {
        this.onListProComiteActaArchivosById(procapaArc.codprogram);
        this.changeDetectorRefs.markForCheck();
      }, error => {
        console.log(error);
      }
    );
  }


  //COMITE

  descargarFile(procomite: Procomite) {
    this.proComiteService.getPoliticaOneArchivo(procomite.archivo.nombre).subscribe(
      (result) => {
        const a = document.createElement('a');
        document.body.appendChild(a);
        //const blob: any = new Blob([result], { type: 'octet/stream' });
        const url = window.URL.createObjectURL(result);
        a.href = url;
        a.download = procomite.archivo.nombre;
        a.click();
        window.URL.revokeObjectURL(url);
      }, error => {
        console.log(error);
      }
    );
  }

  //Listas Combo box
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


  onListComiteCargos() {
    this.tablaService.getAllComiteCargos().subscribe(
      (result) => {
        this.comiCargos = result;
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
    this.onBuildFormProComite();
    this.onBuildFormComite();
    this.onBuildFormFileCarga();
    this.onListEmpresa();
    this.onListComiteCargos();
    this.onListProComite();
  }

}
