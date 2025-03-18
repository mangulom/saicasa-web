import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Empresa } from 'src/app/models/empresa';
import { Provacunacion } from 'src/app/models/provacunacion';
import { Sucursal } from 'src/app/models/sucursal';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ProvacunacionService } from 'src/app/services/provacunacion.service';
import { TablaService } from 'src/app/services/tabla.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import Swal from 'sweetalert2';
import { Tabladetalle } from 'src/app/models/tabladetalle';
import { PersonalService } from 'src/app/services/personal.service';
import { Personal } from 'src/app/models/personal';
import { Vacunacion } from 'src/app/models/vacunacion';
import { VacunacionService } from 'src/app/services/vacunacion.service';
import { ErrorService } from 'src/app/services/error.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Error } from 'src/app/models/error';
import { AreaService } from 'src/app/services/area.service';
import { Area } from 'src/app/models/area';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-provacunacion',
  templateUrl: './provacunacion.component.html',
  styleUrls: ['./provacunacion.component.css']
})
export class ProvacunacionComponent implements OnInit {

  public formBusquedad: FormGroup;
  public formProvacunacion: FormGroup;
  public formVacunacion: FormGroup;
  public formPersonal: FormGroup;
  public submitted = false;
  public submittedVacunacion = false;
  public submittedPersonal = false;
  public submittedBusqueda = false;
  public codigoProgram: number;

  private _usuario: Usuario;

  public selectedFile: File;
  @ViewChild('fileProducto') inputFile: ElementRef;

  public selectedTabIndex: number = 0;
  public searhInputAsignar: string;
  public selectedBusquedaAsign: string = 'Documento';

  public provacunacion: Provacunacion = new Provacunacion();
  public provacunaciones: Provacunacion[];

  public vacunacion:  Vacunacion = new Vacunacion();
  public vacunaciones:  Vacunacion[];

  public empresas: Empresa[];
  public sucursales: Sucursal[];
  public tipoVacunas: Tabladetalle[];
  public vacunadores: Tabladetalle[];
  public zonas: Tabladetalle[];

  public areas: Area[];
  public nomarea: string;

  public personalAsignados: Personal[] = [];

  public listErrores : Error[] = [];

  public validarCarga: boolean = false;


  provacunacionCol: string[] = ['Opciones', 'Sede', 'Fecha' ,'TipoVacuna', 'Programados', 'Vacunado', 'Pendiente'];
  provacunacionData = new MatTableDataSource();

  vacunacionesCol: string[] = ['Opciones', 'DNI', 'ApePaterno', 'ApeMaterno', 'Nombres', 'Estado'];
  vacunacionesData = new MatTableDataSource();

  areasCol: string[] = ['Opciones', 'Codigo', 'Descripcion'];
  areasData = new MatTableDataSource();


  personalAsignarCol: string[] = ['select', 'Nombre', 'DNI','Cargo'];
  personalAsignarData = new MatTableDataSource<Personal>();
  selection = new SelectionModel<Personal>(true, []);


  erroresCol: string[] = ['Linea', 'Columna', 'Dato', 'Detalle'];
  erroresData = new MatTableDataSource();


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('paginatorvacunaciones', { static: true, read: MatPaginator }) paginatorvacunaciones: MatPaginator;
  @ViewChild('paginatorpersonalAsignar', { static: true, read: MatPaginator }) paginatorpersonalAsignar: MatPaginator;

  @ViewChild('paginatorareas', { static: true, read: MatPaginator }) paginatorareas: MatPaginator;

  @ViewChild('paginatorErrores', { static: true, read: MatPaginator }) paginatorErrores: MatPaginator;

  @ViewChild('closebutton') modal: ElementRef;
  @ViewChild('closeArea') modalArea: ElementRef;
  @ViewChild('closeCarga') SubmodalCarga: ElementRef;
  @ViewChild('closeErrores') SubmodalErrores: ElementRef;

  constructor(private provacunacionService: ProvacunacionService,
    private vacunacionService: VacunacionService,
    private empresaService: EmpresaService,
    private usuarioService: UsuarioService,
    private sucursalService: SucursalService,
    private errorService: ErrorService,
    private tablaService: TablaService,
    private areaService: AreaService,
    private personalService: PersonalService,
    private formBuilder: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef) { }

  private closeModal(): void {
    this.modal.nativeElement.click();
  }

  private closeModalArea(): void {
    this.modalArea.nativeElement.click();
  }

  private closeCargaB(): void {
    this.SubmodalCarga.nativeElement.click();
  }


  //OBTENER USUARIO

  loadUsuario() {
    if (JSON.parse(sessionStorage.getItem('usuario'))) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
    }
  }

  //FILTRO VACUNA

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
    this.submittedBusqueda = true;
    this.provacunacionService.getAllVacunaCapaByTipoAndFechas(codtipo, fechaini, fechafin, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.provacunacionData.data = result;
        this.provacunacionData.paginator = this.paginator;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }


  //OTROS

  onBuildFormPersonal() {
    this.formPersonal = this.formBuilder.group({
      codempresa: [''],
      codsucursal: [''],
      nomtrabajador: [{ value: '', disabled: true }],
      apepaterno: [{ value: '', disabled: true }],
      apematerno: [{ value: '', disabled: true }],
      numdocidentidad: [{ value: '', disabled: true }],
      numemail: [''],
      numtelefono: ['']
    });
  }


  onSubmitPersonal() {

  }

  onBuildFormVacunacion(){
    this.formVacunacion = this.formBuilder.group({
      id: [''],
      codigo: [''],
      codempresa: [''],
      sede: [''],
      codprogram: [''],
      codempresapers: [''],
      codpersonal: [''],
      codtipovacuna: [''],
      fechavacuna: ['', Validators.required],
      lotevacuna: [''],
      codvacunador: [''],
      codestado: [''],
      flatcartilla: [''],
      observacion: [''],
      nombrepersonal: [''],
      personales: [''],
      codempresaarea: [''],
      numverareas: [''],
      codareas: [''],
      nomarea: [''],
      codzona: ['', Validators.required],
      horario: ['', Validators.required]
    });
  }

  onSubmitVacunacion() {
    this.submittedVacunacion = true;
    if (this.formVacunacion.invalid) {
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

          this.vacunacionService.save(this.formVacunacion.value).subscribe(
            (result) => {
              if (result) {
                this.selection.clear();
                this.onListVacunacionByIdProgram(result.codprogram);
                //this.onListPersonalAsignar(result.codprogram);
                this.onListProVacunacion();
                this.changeDetectorRefs.detectChanges();
                this.toastAcceptedAlert("Se registro con exito");
                this.formPersonal.reset();
                this.submittedVacunacion = false;

              } else {
                this.closeModal();
              }
            }, error => {
              console.log(error);
            }
          );

        }else{
          this.toastRejectAlert("No hay Personal seleccionados");
        }


      }
    })


  }

  get f() {
    return this.formProvacunacion.controls;
  }

  get g() {
    return this.formVacunacion.controls;
  }

  get k() {
    return this.formPersonal.controls;
  }

  onBuildFormProVacunacion() {
    this.formProvacunacion = this.formBuilder.group({
      id: [''],
      codempresa: ['', Validators.required],
      sede: ['', Validators.required],
      fechaprogram: ['', Validators.required],
      codtipovacuna: ['', Validators.required],
      codestado: [''],
      codsucursal: [''],
      lote: ['']
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.formProvacunacion.invalid) {
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

        this.provacunacionService.saveProvacunacion(this.formProvacunacion.value).subscribe(
          (result) => {
            if (result) {
              this.onResetFormProvacunacion();
              this.onListProVacunacion();
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

  onAsignarProgramacion(provacunacion: Provacunacion){

    this.loadUsuario();
    this.provacunacionService.getProvacunacionById(provacunacion.id).subscribe(
      (result) => {
        this.provacunacion = result;
        this.validarCarga = false;
        //Listar Vacunaciones Programadas
        this.onListVacunacionByProgramacion(result);
        //Listar Personal Disponible Filtrado Por Programacion 
        //this.onListPersonalAsignar(result.id);
        this.codigoProgram = result.id;


        this.formVacunacion.patchValue({
          id: null,
          codigo: null,
          codempresa: result.codempresa,
          sede: result.sede,
          codprogram: result.id,
          codempresapers: null,
          codpersonal: null,
          codtipovacuna: result.codtipovacuna,
          fechavacuna: result.fechaprogram,
          lotevacuna: result.lote,
          codvacunador: null,
          codestado: null,
          flatcartilla: null,
          observacion: null,
          nombrepersonal: [''],
          personales: [''],
          codempresaarea: null,
          numverareas: null,
          codareas: null,
          nomarea: null,
          codzona: null,
          horario: null
        });

      }, error => {
        console.log(error);
      }
    );
  }

  onUpdateProvacunacion(provacunacion: Provacunacion) {

    this.provacunacionService.getProvacunacionById(provacunacion.id).subscribe(
      (result) => {
        this.provacunacion = result;

       
        this.formProvacunacion.patchValue({
          id: result.id,
          codempresa: result.codempresa,
          sede: result.sede,
          fechaprogram: result.fechaprogram,
          codtipovacuna: result.codtipovacuna,
          codestado: result.codestado,
          codsucursal: result.sede,
          lote: result.lote
        });
        
      }, error => {
        console.log(error);
      }
    );
  }


  onResetFormProvacunacion() {
    this.selectedTabIndex = 0;
    this.submitted = false;
    this.formProvacunacion.reset();
  }

  onListAreas() {
    this.areaService.getAllAreas().subscribe(
      (result) => {
        this.areas = result;
        this.areasData.data = result;
        this.areasData.paginator = this.paginatorareas;
        //console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onListProVacunacion() {
    this.provacunacionService.getAllProvacunacion(this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.provacunaciones = result;
        this.provacunacionData.data = result;
        this.provacunacionData.paginator = this.paginator;
        console.log(this.provacunaciones);
      }, error => {
        console.log(error);
      }
    );
  }


  onListVacunacionByIdProgram(codprogram: number) {
    this.vacunacionService.getAllVacunacionByCodProgramacion(codprogram).subscribe(
      (result) => {
        this.vacunaciones = result;
        this.vacunacionesData.data = result;
        this.vacunacionesData.paginator = this.paginatorvacunaciones;
        console.log(this.vacunaciones);
      }, error => {
        console.log(error);
      }
    );
  }

  onListVacunacionByProgramacion(provacunacion: Provacunacion) {
    this.vacunacionService.getAllVacunacionByCodProgramacion(provacunacion.id).subscribe(
      (result) => {
        this.vacunaciones = result;
        this.vacunacionesData.data = result;
        this.vacunacionesData.paginator = this.paginatorvacunaciones;
        console.log(this.vacunaciones);
      }, error => {
        console.log(error);
      }
    );
  }

  deleteById(provacunacion: Provacunacion) {
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

        this.provacunacionService.deleteProvacunacionById(provacunacion.id).subscribe(
          (result) => {
            this.onListProVacunacion();
            this.changeDetectorRefs.markForCheck();
          }, error => {
            this.toastRejectAlert("Existe Personal Asignado");
            console.log(error);
          }
        );
      }
    })
  }

  deleteByIdProgramacion(vacunacion: Vacunacion){

    this.vacunacionService.deleteVacunacion(vacunacion.id).subscribe(
      (result) => {
        //this.onListPersonalAsignar(vacunacion.codprogram);
        this.onListVacunacionByIdProgram(vacunacion.codprogram);
        this.onListProVacunacion();
        this.changeDetectorRefs.markForCheck();
      }, error => {
        console.log(error);
      }
    );

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


  onListPersonalAsignar(codprogram: number) {
    this.personalService.getAllPersonaByCodProgram(codprogram).subscribe(
      (result) => {
        
        this.personalAsignarData.data = result;
        this.personalAsignarData.paginator = this.paginatorpersonalAsignar;

        console.log(result);
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

  onListTipoVacuna() {
    this.tablaService.getAllTipoVacuna().subscribe(
      (result) => {
        this.tipoVacunas = result;
      }, error => {
        console.log(error);
      }
    );
  }

  applyFilterAsignacionPersonal(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.personalAsignarData.filter = filterValue.trim().toLowerCase();
  }

  onListVacunador() {
    this.tablaService.getAllVacunador().subscribe(
      (result) => {
        this.vacunadores = result;
      }, error => {
        console.log(error);
      }
    );
  }

  onListZona() {
    this.tablaService.getAllZonaVacu().subscribe(
      (result) => {
        this.zonas = result;
      }, error => {
        console.log(error);
      }
    );
  }

  onListPersonalByNombre(dato: string, codprogram: number) {
    this.personalService.getAllPersonalByNombre(dato, codprogram).subscribe(
      (result) => {
        //this.vacunadores = result;
        this.personalAsignarData.data = result;
        this.personalAsignarData.paginator = this.paginatorpersonalAsignar;
      }, error => {
        console.log(error);
      }
    );
  }

  onListPersonalByNombreNoExistProgram(dato: string, codprogram: number) {
    this.personalService.getAllPersonalByDocNoExistPro(dato, codprogram).subscribe(
      (result) => {
        //this.vacunadores = result;
        this.personalAsignarData.data = result;
        this.personalAsignarData.paginator = this.paginatorpersonalAsignar;
      }, error => {
        console.log(error);
      }
    );
  }

  onListPersonalByNombreNoExistProgramAndUsuario(dato: string, codprogram: number) {

    this.personalService.getAllPersonalByDocNoExistProAndUsuario(dato, codprogram, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        //this.vacunadores = result;
        this.personalAsignarData.data = result;
        this.personalAsignarData.paginator = this.paginatorpersonalAsignar;
      }, error => {
        console.log(error);
      }
    );
  }

  onListPersonalByAreaNoExistProgramAndUsuario(dato: string, codprogram: number) {

    this.personalService.getAllPersonalByAreaNoExistProAndUsuario(dato, codprogram, this._usuario.usuario).subscribe(
      (result) => {
        //this.vacunadores = result;
        this.personalAsignarData.data = result;
        this.personalAsignarData.paginator = this.paginatorpersonalAsignar;
      }, error => {
        console.log(error);
      }
    );
  }

  onListPersonalByArea(dato: string, codprogram: number) {
    this.personalService.getAllPersonalByArea(dato, codprogram).subscribe(
      (result) => {
        //this.vacunadores = result;
        this.personalAsignarData.data = result;
        this.personalAsignarData.paginator = this.paginatorpersonalAsignar;
      }, error => {
        console.log(error);
      }
    );
  }

  selectAreaVacuancion(area: Area) {
    this.formVacunacion.get('nomarea').setValue(area.desareas);
    this.formVacunacion.get('codempresaarea').setValue(area.codempresa);
    this.formVacunacion.get('numverareas').setValue(area.numverareas);
    this.formVacunacion.get('codareas').setValue(area.codareas);
    this.closeModalArea();
    
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
    return `${this.selection.isSelected(personal) ? 'deselect' : 'select'} row ${ personal.codpersonal + 1}`;
  }

  isSelected() {
    this.personalAsignados = [];
    this.selection.selected.forEach(
      x => this.personalAsignados.push(x)
    )
    this.formVacunacion.get('personales').setValue(this.personalAsignados);

    if (this.personalAsignados.length == 1){
      this.formPersonal.get('numdocidentidad').setValue(this.personalAsignados[0].numdocidentidad);
      this.formPersonal.get('apepaterno').setValue(this.personalAsignados[0].apepaterno);
      this.formPersonal.get('apematerno').setValue(this.personalAsignados[0].apematerno);
      this.formPersonal.get('nomtrabajador').setValue(this.personalAsignados[0].nomtrabajador);
      this.formVacunacion.get('codempresaarea').setValue(this.personalAsignados[0].codempresa);
      this.formVacunacion.get('numverareas').setValue(this.personalAsignados[0].numverareas);
      this.formVacunacion.get('codareas').setValue(this.personalAsignados[0].codareas);
      this.formVacunacion.get('nomarea').setValue(this.personalAsignados[0].desareas);
    }else{
      this.formVacunacion.get('codempresaarea').setValue("");
      this.formVacunacion.get('numverareas').setValue("");
      this.formVacunacion.get('codareas').setValue("");
      this.formVacunacion.get('nomarea').setValue("");
      this.formPersonal.reset();
    }

    console.log(this.personalAsignados)
  }


  onSearchPersonalAsignar(){
    this.selection.clear();
    console.log(this.searhInputAsignar);
    if (this.searhInputAsignar != null) {

      if (this.searhInputAsignar.trim() != ''){
        if (this.selectedBusquedaAsign == "Documento") {
          this.onListPersonalByNombreNoExistProgramAndUsuario(this.searhInputAsignar, this.codigoProgram);
          //this.getAllClientesByNombre(this.searhInputAsignar);
        }
        if (this.selectedBusquedaAsign == "Area") {
          this.onListPersonalByAreaNoExistProgramAndUsuario(this.searhInputAsignar, this.codigoProgram);
          //this.getAllClientesByNombre(this.searhInputAsignar);
        }
      }else{
        //this.onListPersonalAsignar(this.codigoProgram);
      }

    } else {
      //this.getAllClientes();
      //this.onListPersonalAsignar(this.codigoProgram);
    }
  }

  ClearSelectectFile(){
    
  }

  onFileSelected(event: { target: { files: File[]; }; }) {
    if (<File>event.target.files[0] != null){
      this.selectedFile = <File>event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onProcesarData() {
   
    const Files = this.inputFile.nativeElement;
    this.selectedFile = Files.files[0];
    const ExcelFile: File = this.selectedFile;

    if (ExcelFile != null){
      const formData: FormData = new FormData();
      formData.append('file', ExcelFile, ExcelFile.name);
      formData.append('codigo', this.codigoProgram.toString());
      formData.append('usuario', this.usuarioService.getUsuarioSession());

      this.personalService.CargarListPersonal(formData).subscribe(
        (result) => {
          this.personalAsignados = result;
          this.formVacunacion.get('personales').setValue(this.personalAsignados);
          this.toastAcceptedAlert("Se Cargo la data con exito!");
          this.validarCarga = true;
          console.log(this.personalAsignados);
          //this.closeCargaB();
        }, error => {
          this.toastRejectAlert("Erro en la Carga de datos :  Favor de Validar");
          this.validarCarga = false;
          console.log(error);
        }

      );
    }
  }


  onValidateData(){

    if (this.validarCarga){

      this.errorService.getAllBackError(this.codigoProgram).subscribe(
        (result) => {
          this.listErrores = result;
          //console.log(result);
          if (this.listErrores.length <= 0) {
            this.toastAcceptedAlert("Datos validados Con exito!");
            this.closeCargaB();
          } else {
            this.toastRejectAlert("Revisar Informe de Errores");
          }

          //this.closeCargaB();
        }, error => {

          console.log(error);
        }
      );

    }
    
  }

  onInformeData(){
    this.errorService.getAllBackError(this.codigoProgram).subscribe(
      (result) => {
        this.listErrores = result;
        console.log(result);
        this.erroresData.data = result;
        this.erroresData.paginator = this.paginatorErrores;
        //this.closeCargaB();
      }, error => {
        console.log(error);
      }

    );
  }


  descargarPlanilla(){
    this.provacunacionService.getFile().subscribe(
      (result) => {
        const url = window.URL.createObjectURL(result);
        window.open(url);
      }, error => {
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
    this.onBuildFormBusqueda();
    this.onBuildFormProVacunacion();
    this.onBuildFormVacunacion();
    this.onBuildFormPersonal();
    this.onListProVacunacion();
    this.onListEmpresa();
    this.onListAreas();
    this.onListTipoVacuna();
    this.onListVacunador();
    this.onListZona();
  }

}
