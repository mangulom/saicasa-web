import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Procapacitacion } from 'src/app/models/procapacitacion';
import { Capacitacion } from 'src/app/models/capacitacion';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EmpresaService } from 'src/app/services/empresa.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import { ErrorService } from 'src/app/services/error.service';
import { TablaService } from 'src/app/services/tabla.service';
import { AreaService } from 'src/app/services/area.service';
import { ProcapacitacionService } from 'src/app/services/procapacitacion.service';
import { CapacitacionService } from 'src/app/services/capacitacion.service';
import { PersonalService } from 'src/app/services/personal.service';
import { MaearchivoService } from 'src/app/services/maearchivo.service';
import Swal from 'sweetalert2';
import { Empresa } from 'src/app/models/empresa';
import { Sucursal } from 'src/app/models/sucursal';
import { Tabladetalle } from 'src/app/models/tabladetalle';
import { Personal } from 'src/app/models/personal';
import { SelectionModel } from '@angular/cdk/collections';
import { Procapaarchivo } from 'src/app/models/procapaarchivo';
import { Error } from 'src/app/models/error';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-procapacitacion',
  templateUrl: './procapacitacion.component.html',
  styleUrls: ['./procapacitacion.component.css']
})
export class ProcapacitacionComponent implements OnInit {

  public formBusquedad: FormGroup;
  public searchFormPersonal: FormGroup;
  public formProCapacitacion: FormGroup;
  public formCapacitacion: FormGroup;
  public formCarga: FormGroup;
  public formFileCarga: FormGroup;
  public submitted = false;
  public submittedCapacitacion = false;
  public codigoProgram: number;
  public tempProcapa: number;

  private _usuario: Usuario;

  public searhInputAsignarRes: string;
  public selectedBusquedaAsignRes: string = 'Documento';

  public selectedFile: File;
  @ViewChild('fileProducto') inputFile: ElementRef;

  public selectedFileProcapa: File;
  @ViewChild('fileProcapa') inputFileProcapa: ElementRef;

  public listErrores: Error[] = [];
  public validarCarga: boolean = false;

  public procapacitacion: Procapacitacion = new Procapacitacion();
  public procapacitaciones: Procapacitacion[];

  public capacitacion: Capacitacion = new Capacitacion();
  public capacitaciones: Capacitacion[];

  public procapaArchivo: Procapaarchivo = new Procapaarchivo();
  public procapaArchivos: Procapaarchivo[];

  public empresas: Empresa[];
  public sucursales: Sucursal[];

  public tipocaps: Tabladetalle[];
  public motivocaps: Tabladetalle[];
  public temacaps: Tabladetalle[];

  public nomarea: string;
  public searhInputAsignar: string;
  public selectedBusquedaAsign: string = 'Documento';
  public personalAsignados: Personal[] = [];

  procapaArchivoCol: string[] = ['Opciones', 'Nombre'];
  procapaArchivoData = new MatTableDataSource();

  responsableCol: string[] = ['Opciones', 'Nombre', 'DNI', 'Cargo'];
  responsableData = new MatTableDataSource();

  procapacitacionCol: string[] = ['Opciones', 'Empresa','Sede', 'Tema', 'Tipo', 'Programados', 'Asist', 'Noasis', 'Fecha', 'Estado'];
  procapacitacionData = new MatTableDataSource();

  capacitacionCol: string[] = ['Opciones', 'DNI', 'ApePaterno', 'ApeMaterno', 'Nombres', 'Estado'];
  capacitacionData = new MatTableDataSource();

  personalAsignarCol: string[] = ['select', 'Nombre', 'DNI', 'Cargo'];
  personalAsignarData = new MatTableDataSource<Personal>();
  selection = new SelectionModel<Personal>(true, []);

  erroresCol: string[] = ['Linea', 'Columna', 'Dato', 'Detalle'];
  erroresData = new MatTableDataSource();

  @ViewChild('paginatorresponsable', { static: true, read: MatPaginator }) paginatorresponsable: MatPaginator;
  @ViewChild('paginatorProCapacitaciones', { static: true, read: MatPaginator }) paginatorProCapacitaciones: MatPaginator;
  @ViewChild('paginatorCapacitaciones', { static: true, read: MatPaginator }) paginatorCapacitaciones: MatPaginator;
  @ViewChild('paginatorpersonalAsignar', { static: true, read: MatPaginator }) paginatorpersonalAsignar: MatPaginator;
  @ViewChild('paginatorarchivos', { static: true, read: MatPaginator }) paginatorarchivos: MatPaginator;
  @ViewChild('paginatorErrores', { static: true, read: MatPaginator }) paginatorErrores: MatPaginator;
  

  @ViewChild('closeErrores') SubmodalErrores: ElementRef;
  @ViewChild('closeCarga') SubmodalCarga: ElementRef;
  @ViewChild('closebutton') modal: ElementRef;
  @ViewChild('closebuttonRes') modalRes: ElementRef;
  

  constructor(private procapacitacionService: ProcapacitacionService,
    private capacitacionService: CapacitacionService,
    private empresaService: EmpresaService,
    private sucursalService: SucursalService,
    private usuarioService: UsuarioService,
    private errorService: ErrorService,
    private tablaService: TablaService,
    private maeArchivoService: MaearchivoService,
    private personalService: PersonalService,
    private formBuilder: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef) { }

  //OBTENER USUARIO

  loadUsuario() {
    if (JSON.parse(sessionStorage.getItem('usuario'))) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
    }
  }


  //FILTRAR PERSONAL
  onBuildSearchPersonal() {
    this.searchFormPersonal = this.formBuilder.group({
      dato: ['']
    });
  }

  onSearchPersonalResponsable() {
    if (this.searhInputAsignarRes != null) {
      if (this.searhInputAsignarRes.trim() != '') {
        if (this.selectedBusquedaAsignRes == "Documento") {
          this.onListPersonalByDoc(this.searhInputAsignarRes);
        }
        if (this.selectedBusquedaAsignRes == "Nombres") {
          this.onListPersonalByNombreLike(this.searhInputAsignarRes);
        }
      } else {
        this.onListResponsablePersonal();
      }
    } else {
      this.onListResponsablePersonal();
    }
  }

  onListPersonalByDoc(documento: string) {
    this.personalService.getAllPersonalByDoc(documento, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.responsableData.data = result;
        this.responsableData.paginator = this.paginatorresponsable;
      }, error => {
        console.log(error);
      }
    );
  }

  onListPersonalByNombreLike(search: string) {
    this.personalService.getAllPersonalByNombreLike(search, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.responsableData.data = result;
        this.responsableData.paginator = this.paginatorresponsable;
      }, error => {
        console.log(error);
      }
    );
  }

  onListResponsablePersonal() {
    this.personalService.getAllPersonalTop().subscribe(
      (result) => {

        this.responsableData.data = result;
        this.responsableData.paginator = this.paginatorresponsable;
        //console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  selectResponsable(personal: Personal) {

    this.personalService.getPersonalByEmpresaAndPersonal(personal.codempresa, personal.codpersonal).subscribe(
      (result) => {
  
        this.formProCapacitacion.get('nombreresp').setValue(result.apepaterno + " " + result.apematerno + " " + result.nomtrabajador );
        this.formProCapacitacion.get('codempresares').setValue(result.codempresa);
        this.formProCapacitacion.get('codpersonalres').setValue(result.codpersonal);

        console.log(result);
        this.changeDetectorRefs.markForCheck();
      }, error => {
        console.log(error);
      }
    );

    this.closeModalResponsable();
  }

  private closeModalResponsable(): void {
    this.modalRes.nativeElement.click();
  }


  //FILTRAR
  get e() {
    return this.formBusquedad.controls;
  }

  onBuildFormBusqueda() {
    this.formBusquedad = this.formBuilder.group({
      codtipo: ['', Validators.required],
      fechaini: ['', Validators.required],
      fechafin: ['', Validators.required]
    });
  }

  onSearchFilter() {
    if (this.formBusquedad.invalid) {
      this.toastRejectAlert("Complete los parametros de Busqueda");
      return;
    }
    this.getAllProcapacitacionXParametros(this.formBusquedad.get('codtipo').value,
      this.formBusquedad.get('fechaini').value,
      this.formBusquedad.get('fechafin').value)
  }

  getAllProcapacitacionXParametros(codtipo: number, fechaini: string, fechafin: string) {
    this.procapacitacionService.getAllProCapaByTipoAndFechas(codtipo, fechaini, fechafin, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.procapacitacionData.data = result;
        this.procapacitacionData.paginator = this.paginatorProCapacitaciones;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  ///CAPACITACION


  get g() {
    return this.formCapacitacion.controls;
  }

  onBuildFormCapacitacion() {
    this.formCapacitacion = this.formBuilder.group({
      id: [''],
      codigo: [''],
      codempresa: [{ value: '', disabled: true }],
      sede: [{ value: '', disabled: true }],
      codprogram: [''],
      codempresapers: [''],
      codpersonal: [''],
      fechacapacitacion: [''],
      codtema: [{ value: '', disabled: true }],
      codtipocap: [{ value: '', disabled: true }],
      codmtvcap: [{ value: '', disabled: true }],
      codestado: [''],
      nomarea: [''],
      personales: [''],
      numdocidentidad: [''],
      apepaterno: [''],
      apematerno: [''],
      nomtrabajador: ['']
    });
  }

  onSubmitCapacitacion() {
    this.submittedCapacitacion = true;
    if (this.formCapacitacion.invalid) {
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

          this.capacitacionService.save(this.formCapacitacion.getRawValue()).subscribe(
            (result) => {
              if (result) {
                this.selection.clear();
                this.onListCapacitacionByIdProgram(result.codprogram);
                //this.onListPersonalAsignar(result.codprogram);
                this.onClearSelectAsign();
                this.onListProCapacitaciones();
                this.changeDetectorRefs.detectChanges();
                this.toastAcceptedAlert("Se registro con exito");
                this.submittedCapacitacion = false;
                this.onClearDataPersonal();
              } else {
                this.closeModal();
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

  onListProCapacitacionByProgramacion(procapacitacion: Procapacitacion) {
    this.capacitacionService.getAllCapacitacionesByProgram(procapacitacion.id).subscribe(
      (result) => {
        this.capacitaciones = result;
        this.capacitacionData.data = result;
        this.capacitacionData.paginator = this.paginatorCapacitaciones;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onListCapacitacionByIdProgram(codprogram: number) {
    this.capacitacionService.getAllCapacitacionesByProgram(codprogram).subscribe(
      (result) => {
        this.capacitaciones = result;
        this.capacitacionData.data = result;
        this.capacitacionData.paginator = this.paginatorCapacitaciones;
      }, error => {
        console.log(error);
      }
    );
  }

  onListProCapacitaciones() {
    this.procapacitacionService.getAllProCapacitaciones(this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.procapacitaciones = result;
        this.procapacitacionData.data = result;
        this.procapacitacionData.paginator = this.paginatorProCapacitaciones;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onListProcapaArchivosById(id: number) {
    this.maeArchivoService.getAllArchivosByProgram(id).subscribe(
      (result) => {
        this.procapaArchivos = result;
        this.procapaArchivoData.data = result;
        this.procapaArchivoData.paginator = this.paginatorarchivos;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }


  private closeModal(): void {
    this.modal.nativeElement.click();
  }

  get f() {
    return this.formProCapacitacion.controls;
  }

  onBuildFormProCapacitacion() {
    this.formProCapacitacion = this.formBuilder.group({
      id: [''],
      codempresa: ['', Validators.required],
      sede: ['', Validators.required],
      codtema: ['', Validators.required],
      codtipocap: ['', Validators.required],
      codmtvcap: ['', Validators.required],
      fechaprogram: ['', Validators.required],
      fechavigencia: ['', Validators.required],
      fechalimite: ['', Validators.required],
      codestado: [''],
      nrohoras: ['', Validators.required],
      codempresares: [''],
      codpersonalres: [''],
      nombreresp: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.formProCapacitacion.invalid) {
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

        this.procapacitacionService.savePro(this.formProCapacitacion.value).subscribe(
          (result) => {
            if (result) {
              this.onResetFormProcapacitacion();
              this.onListProCapacitaciones();
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

  onResetFormProcapacitacion() {
    this.submitted = false;
    this.formProCapacitacion.reset();
  }

  onUpdateProCapacitacion(procapacitacion: Procapacitacion) {

    this.procapacitacionService.getProCapacitacionById(procapacitacion.id).subscribe(
      (result) => {
        this.procapacitacion = result;


        this.formProCapacitacion.patchValue({
          id: result.id,
          codempresa: result.codempresa,
          sede: result.sede,
          codtema: result.codtema,
          codtipocap: result.codtipocap,
          codmtvcap: result.codmtvcap,
          fechaprogram: result.fechaprogram,
          fechavigencia: result.fechavigencia,
          fechalimite: result.fechalimite,
          codestado: result.codestado,
          nrohoras: result.nrohoras,
          codempresares: result.codempresares,
          codpersonalres: result.codpersonalres,
          nombreresp: result.nombreresp
        });

      }, error => {
        console.log(error);
      }
    );
  }

  onAsignarProgramacion(procapacitacion: Procapacitacion) {
    this.loadUsuario();
    this.procapacitacionService.getProCapacitacionById(procapacitacion.id).subscribe(
      (result) => {
        this.procapacitacion = result;

        //Listar Vacunaciones Programadas
        this.onListProCapacitacionByProgramacion(result);
        //Listar Personal Disponible Filtrado Por Programacion 
        //this.onListPersonalAsignar(result.id);
        this.codigoProgram = result.id;


        this.formCapacitacion.patchValue({
          id: null,
          codigo: null,
          codempresa: result.codempresa,
          sede: result.sede,
          codprogram: result.id,
          codempresapers: null,
          codpersonal: null,
          fechacapacitacion: result.fechaprogram,
          codtema: result.codtema,
          codtipocap: result.codtipocap,
          codmtvcap: result.codmtvcap,
          codestado: null,
          nomarea: [''],
          personales: [''],
          numdocidentidad: [''],
          apepaterno: [''],
          apematerno: [''],
          nomtrabajador: ['']
        });

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

  deleteById(procapacitacion: Procapacitacion) {
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

        this.procapacitacionService.deleteProCapacitacionById(procapacitacion.id).subscribe(
          (result) => {
            this.onListProCapacitaciones();
            this.changeDetectorRefs.markForCheck();
          }, error => {
            this.toastRejectAlert("Existe Personal Asignado");
            console.log(error);
          }
        );
      }
    })
  }

  deleteByIdCapacitacion(capacitacion: Capacitacion) {

    this.capacitacionService.deleteCapacitacionById(capacitacion.id).subscribe(
      (result) => {
        //this.onListPersonalAsignar(capacitacion.codprogram);
        this.onListCapacitacionByIdProgram(capacitacion.codprogram);
        this.onListProCapacitaciones();
        this.changeDetectorRefs.markForCheck();
      }, error => {
        console.log(error);
      }
    );

  }

  onListPersonalByDocNoExistProCapa(dato: string, codprogram: number) {
    this.personalService.getAllPersonalByDocNoExistProCapa(dato, codprogram).subscribe(
      (result) => {
        this.personalAsignarData.data = result;
        this.personalAsignarData.paginator = this.paginatorpersonalAsignar;
      }, error => {
        console.log(error);
      }
    );
  }

  onListPersonalByDocNoExistProCapaAndUsuario(dato: string, codprogram: number) {
    this.personalService.getAllPersonalByDocNoExistProCapaAndUsuario(dato, codprogram, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.personalAsignarData.data = result;
        this.personalAsignarData.paginator = this.paginatorpersonalAsignar;
      }, error => {
        console.log(error);
      }
    );
  }

  onClearSelectAsign(){
    this.personalAsignarData.data = [];
    this.personalAsignarData.paginator = this.paginatorpersonalAsignar;;
  }

  onListPersonalByAreaNoExistProCapaAndUsuario(dato: string, codprogram: number) {
    this.personalService.getAllPersonalByAreaNoExistProCapaAndUsuario(dato, codprogram, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        console.log(result);
        this.personalAsignarData.data = result;
        this.personalAsignarData.paginator = this.paginatorpersonalAsignar;
      }, error => {
        console.log(error);
      }
    );
  }

  onListPersonalAsignar(codprogram: number) {
    this.personalService.getAllPersonalDispByProCapa(codprogram).subscribe(
      (result) => {

        this.personalAsignarData.data = result;
        this.personalAsignarData.paginator = this.paginatorpersonalAsignar;
        //console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  //selecter 


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.personalAsignarData.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.personalAsignarData.data.forEach(row => this.selection.select(row));
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
    this.formCapacitacion.get('personales').setValue(this.personalAsignados);

    if (this.personalAsignados.length == 1) {
      this.formCapacitacion.get('numdocidentidad').setValue(this.personalAsignados[0].numdocidentidad);
      this.formCapacitacion.get('apepaterno').setValue(this.personalAsignados[0].apepaterno);
      this.formCapacitacion.get('apematerno').setValue(this.personalAsignados[0].apematerno);
      this.formCapacitacion.get('nomtrabajador').setValue(this.personalAsignados[0].nomtrabajador);
      this.formCapacitacion.get('nomarea').setValue(this.personalAsignados[0].desareas);
    } else {

      this.onClearDataPersonal();
      //this.formPersonal.reset();
    }

    console.log(this.personalAsignados)
  }

  onClearDataPersonal() {
    this.formCapacitacion.get('numdocidentidad').setValue("");
    this.formCapacitacion.get('apepaterno').setValue("");
    this.formCapacitacion.get('apematerno').setValue("");
    this.formCapacitacion.get('nomtrabajador').setValue("");
    this.formCapacitacion.get('nomarea').setValue("");
  }

  onSearchPersonalAsignar() {
    this.selection.clear();
    console.log(this.searhInputAsignar);
    if (this.searhInputAsignar != null) {

      if (this.searhInputAsignar.trim() != '') {
        if (this.selectedBusquedaAsign == "Documento") {
          this.onListPersonalByDocNoExistProCapaAndUsuario(this.searhInputAsignar, this.codigoProgram);
          //this.getAllClientesByNombre(this.searhInputAsignar);
        }
        if (this.selectedBusquedaAsign == "Area") {
          this.onListPersonalByAreaNoExistProCapaAndUsuario(this.searhInputAsignar, this.codigoProgram);
          //this.getAllClientesByNombre(this.searhInputAsignar);
        }
      } else {
        //this.onListPersonalAsignar(this.codigoProgram);
      }

    } else {
      //this.getAllClientes();
      //this.onListPersonalAsignar(this.codigoProgram);
    }
  }


  onListEmpresa() {
    this.empresaService.getAllEmpresaByUsuario(this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.empresas = result;
        console.log(result);
        //this.empresaData.data =  result;
        //this.empresaData.paginator = this.paginatorEmpresa;
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
        //console.log(result);
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

  onListTemaCapacitacion() {
    this.tablaService.getAllTemaCapacitacion().subscribe(
      (result) => {
        this.temacaps = result;
      }, error => {
        console.log(error);
      }
    );
  }


  onListTipoCapacitaciones() {
    this.tablaService.getAllTipoCapacitacion().subscribe(
      (result) => {
        this.tipocaps = result;
      }, error => {
        console.log(error);
      }
    );
  }

  onListMotivoCapacitaciones() {
    this.tablaService.getAllMotivoCapacitacion().subscribe(
      (result) => {
        this.motivocaps = result;
      }, error => {
        console.log(error);
      }
    );
  }


//CARGA DE DATOS

  private closeCargaB(): void {
    this.SubmodalCarga.nativeElement.click();
  }

  
onBuildFormCarga() {
  this.formCarga = this.formBuilder.group({
    codempresa: [''],
    codsucursal: ['']
  });
}

descargarPlanilla() {
  this.procapacitacionService.getExcelPlantillaProCapa().subscribe(
    (result) => {
      const url = window.URL.createObjectURL(result);
      window.open(url);
    }, error => {
      console.log(error);
    }
  );
}

onFileSelected(event: { target: { files: File[]; }; }) {
  if (<File>event.target.files[0] != null) {
    this.selectedFile = <File>event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
  }
}

onProcesarData(){

  const Files = this.inputFile.nativeElement;
  this.selectedFile = Files.files[0];
  const ExcelFile: File = this.selectedFile;

  let codempresa = this.formCarga.get('codempresa').value;
  let codsucursal = this.formCarga.get('codsucursal').value;

  if (ExcelFile != null) {
    const formData: FormData = new FormData();
    formData.append('file', ExcelFile, ExcelFile.name);
    formData.append('codempresa', codempresa);
    formData.append('codsucursal', codsucursal);
    formData.append('usuario', this.usuarioService.getUsuarioSession());

    this.capacitacionService.CargarExcelProcapaPersonal(formData).subscribe(
      (result) => {

        this.listErrores = result;

        if (this.listErrores.length > 0) {
          this.toastRejectAlert("Error en la Carga de datos :  Verificar Informe");
        } else {
          this.validarCarga = true;
          this.toastAcceptedAlert("Se Cargo la data con exito!");
          this.onListProCapacitaciones();
          this.closeCargaB();
        }
        //this.closeCargaB();
      }, error => {
        this.toastRejectAlert("Error en la Carga de datos :  Favor de Validar");
        this.validarCarga = false;
        console.log(error);
      }

    );    
  }


}

onInformeData() {

  this.errorService.getAllBackErrorProCapa().subscribe(
    (result) => {
      this.listErrores = result;
      this.erroresData.data = result;
      this.erroresData.paginator = this.paginatorErrores;
      console.log(result);
      //this.closeCargaB();
    }, error => {
      console.log(error);
    }

  );
}

//upload file --terminar de completar el formulario de carga y cargar 

  onListProcapaArchivos(procapacitacion: Procapacitacion) {
    this.maeArchivoService.getAllArchivosByProgram(procapacitacion.id).subscribe(
      (result) => {
        this.procapaArchivos = result;
        this.procapaArchivoData.data = result;
        this.procapaArchivoData.paginator = this.paginatorarchivos;
        this.tempProcapa = procapacitacion.id;

        /*if (result.length>0){
          //this.formFileCarga.get('codprocapa').setValue(procapacitacion.id);
        }*/

        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  descargarFile(archi: Procapaarchivo) {
    console.log(archi.archivo);
    this.maeArchivoService.getOneArchivo(archi.archivo.nombre).subscribe(
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

  onFileSelectedProcapa(event: { target: { files: File[]; }; }) {
    if (<File>event.target.files[0] != null) {
      this.selectedFileProcapa = <File>event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFileProcapa);
    }
  }

  onFileCharger() {

    const Files = this.inputFileProcapa.nativeElement;
    this.selectedFileProcapa = Files.files[0];
    const ExcelFile: File = this.selectedFileProcapa;

    //let codprocapa = this.formFileCarga.get('codprocapa').value;

    if (ExcelFile != null) {
      const formData: FormData = new FormData();
      formData.append('file', ExcelFile, ExcelFile.name);
      formData.append('codprocapa', this.tempProcapa.toString());

      this.capacitacionService.CargarFileProcoa(formData).subscribe(
        (result) => {
          this.onListProcapaArchivosById(this.tempProcapa);
          console.log(result);
        }, error => {
          console.log(error);
        }
      );
    }

  }

  onBuildFormFileCarga() {
    this.formFileCarga = this.formBuilder.group({
      codprocapa: [''],
      file: ['']
    });
  }

  deleteByIdProcapaArchivo(procapaArc: Procapaarchivo) {
    this.maeArchivoService.deleteProcapaArchivoById(procapaArc.id).subscribe(
      (result) => {
        this.onListProcapaArchivosById(procapaArc.codprocapa);
        this.changeDetectorRefs.markForCheck();
      }, error => {
        console.log(error);
      }
    );
  }



  ngOnInit(): void {
    this.onBuildFormBusqueda();
    this.onBuildFormProCapacitacion();
    this.onBuildFormCapacitacion();
    this.onBuildFormCarga();
    this.onBuildFormFileCarga();
    this.onListProCapacitaciones();
    this.onListEmpresa();
    this.onListTipoCapacitaciones();
    this.onListTemaCapacitacion();
    this.onListMotivoCapacitaciones();
    //this.onListResponsablePersonal();
  }

}
