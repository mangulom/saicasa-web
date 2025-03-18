import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Vacunacion } from 'src/app/models/vacunacion';
import { VacunacionService } from 'src/app/services/vacunacion.service';
import { ProvacunacionService } from 'src/app/services/provacunacion.service';
import { PersonalService } from 'src/app/services/personal.service';
import Swal from 'sweetalert2';
import { Provacunacion } from 'src/app/models/provacunacion';
import { Personal } from 'src/app/models/personal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { EmpresaService } from 'src/app/services/empresa.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import { TablaService } from 'src/app/services/tabla.service';
import { ErrorService } from 'src/app/services/error.service';
import { Empresa } from 'src/app/models/empresa';
import { Sucursal } from 'src/app/models/sucursal';
import { Tabladetalle } from 'src/app/models/tabladetalle';
import { Error } from 'src/app/models/error';
import { Area } from 'src/app/models/area';
import { AreaService } from 'src/app/services/area.service';
import { DatoService } from 'src/app/services/dato.service';
import { Dato } from 'src/app/models/dato';
import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-vacunacion',
  templateUrl: './vacunacion.component.html',
  styleUrls: ['./vacunacion.component.css']
})
export class VacunacionComponent implements OnInit {

  public formVacunacion: FormGroup;
  public formPersonal: FormGroup;
  public formCarga: FormGroup;

  public submittedVacunacion = false;
  public codigoProgram : number;

  public tempCodProgram: number;

  public areas: Area[];
  public nomarea: string;

  public dato: Dato = new Dato();

  public programacionVacunas: Vacunacion[];

  public selectedFile: File;
  @ViewChild('fileProducto') inputFile: ElementRef;
  public listErrores: Error[] = [];
  public validarCarga: boolean = false;

  public personalDisponible: Personal = new Personal();
  public personalesDisponibles: Personal[];

  public personalvacunado: Vacunacion = new Vacunacion();
  public personalvacunados: Vacunacion[];

  public provacunacionPen : Provacunacion = new Provacunacion();
  public provacunacionesPen: Provacunacion[]; 

  public empresas: Empresa[];
  public sucursales: Sucursal[];
  public tipoVacunas: Tabladetalle[];
  public vacunadores: Tabladetalle[];
  public zonas: Tabladetalle[];

  public personalAsignados: Personal[] = [];

  public searhInputAsignar: string;
  public selectedBusquedaAsign: string = 'DNI';
  public searhInputProgramacion: string;
  public selectedBusquedaProgramacion: string = 'documento';

  personalvacunadoCol: string[] = ['DNI', 'ApePaterno', 'ApeMaterno', 'Nombres', 'TipVacu', 'Fecha', 'Lote', 'Vacunador'];
  personalvacunadoData = new MatTableDataSource();

  personalDisponibleCol: string[] = ['Opciones', 'DNI', 'ApePaterno', 'ApeMaterno', 'Nombres'];
  personalDisponibleData = new MatTableDataSource();
  provacunacionPenCol: string[] = ['Opciones', 'Empresa', 'Sede', 'Fecha', 'TipoVacu'];
  provacunacionPenData = new MatTableDataSource();

  personalAsignarCol: string[] = ['select', 'Nombre', 'DNI','Cargo'];
  personalAsignarData = new MatTableDataSource<Personal>();
  selection = new SelectionModel<Personal>(true, []);

  erroresCol: string[] = ['Linea', 'Columna', 'Dato', 'Detalle'];
  erroresData = new MatTableDataSource();

  areasCol: string[] = ['Opciones', 'Descripcion'];
  areasData = new MatTableDataSource();

  @ViewChild('paginatorpersonalDisponible', { static: true, read: MatPaginator }) paginatorpersonalDisponible: MatPaginator;
  @ViewChild('paginatorpersonalvacunado', { static: true, read: MatPaginator }) paginatorpersonalvacunado: MatPaginator;
  @ViewChild('paginatorprovacunacionpen', { static: true, read: MatPaginator }) paginatorprovacunacionpen: MatPaginator;

  @ViewChild('paginatorpersonalAsignar', { static: true, read: MatPaginator }) paginatorpersonalAsignar: MatPaginator;

  @ViewChild('paginatorErrores', { static: true, read: MatPaginator }) paginatorErrores: MatPaginator;
  @ViewChild('paginatorareas', { static: true, read: MatPaginator }) paginatorareas: MatPaginator;


  @ViewChild('closeRespAsigUno') SubmodalRespUno: ElementRef;
  @ViewChild('closeRespAsigDos') SubmodalRespDos: ElementRef;

  @ViewChild('closeProgram') SubModalProgram: ElementRef;

  @ViewChild('closebutton') modal: ElementRef;

  @ViewChild('closePrincipal') SubModalPrincipal: ElementRef;
  @ViewChild('closeCarga') SubmodalCarga: ElementRef;
  @ViewChild('closeErrores') SubmodalErrores: ElementRef;
  @ViewChild('closeArea') modalArea: ElementRef;

  constructor(private vacunacionService: VacunacionService,
    private personalService: PersonalService,
    private provacunacionService: ProvacunacionService,
    private usuarioService: UsuarioService,
    private empresaService: EmpresaService,
    private sucursalService: SucursalService,
    private errorService: ErrorService,
    private tablaService: TablaService,
    private areaService: AreaService,
    private datoService: DatoService,
    private formBuilder: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef) { }


  private closeProgramF(): void {
    this.SubModalProgram.nativeElement.click();
  }

  private closePrincipal(): void {
    this.SubModalPrincipal.nativeElement.click();
  }

  private closeCargaB(): void {
    this.SubmodalCarga.nativeElement.click();
  }

  private closeModalArea(): void {
    this.modalArea.nativeElement.click();
  }

  onBuildFormCarga(){
    this.formCarga = this.formBuilder.group({
      codempresa: [''],
      codsucursal: ['']
    });
  }

  onBuildFormPersonal() {
    this.formPersonal = this.formBuilder.group({
      codempresa: [''],
      codsucursal: [''],
      nomtrabajador: [''],
      apepaterno: [''],
      apematerno: [''],
      numdocidentidad: [''],
      numemail: [''],
      numtelefono: ['']
    });
  }

  onBuildFormVacunacion() {
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
      lotevacuna: ['', Validators.required],
      codvacunador: ['', Validators.required],
      codestado: [''],
      flatcartilla: [''],
      observacion: [''],
      nombrepersonal: [''],
      personales: [''],
      codempresaarea: [''],
      numverareas: [''],
      codareas: [''],
      nomarea: [''],
      codzona: [''],
      horario: [''],
      numdocidentidad: [''],
      apepaterno: [''],
      apematerno: [''],
      nomtrabajador: ['']
    });
  }

  get g() {
    return this.formVacunacion.controls;
  }

  onSubmit() {
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

        console.log(this.formVacunacion.value);
        console.log(this.selection.selected);

        this.vacunacionService.saveOne(this.formVacunacion.value).subscribe(
          (result) => {
            if (result) {
              this.selection.clear();
              this.onListPersonalVacunado();
              //this.onListProVacuancionPendientes();
              this.changeDetectorRefs.detectChanges();
              this.toastAcceptedAlert("Se registro con exito");
              this.onResetFormVacunacion();
              this.closePrincipal();
            } else {
              this.closePrincipal();
            }
          }, error => {
            console.log(error);
          }
        );

        

      }
    })
  }

  getAllVacunacionByPersonalDoc(filtro: string) {
    this.vacunacionService.getAllVacunacionByPersonalDoc(filtro, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.programacionVacunas = result;
        this.provacunacionPenData.data = result;
        this.provacunacionPenData.paginator = this.paginatorprovacunacionpen;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  /*onListProvacunacionFiltroTipVacuna(filtro: string) {
    this.provacunacionService.getAllProvacunacionFiltroTipVacuna(filtro).subscribe(
      (result) => {
        this.provacunacionesPen = result;
        this.provacunacionPenData.data = result;
        this.provacunacionPenData.paginator = this.paginatorprovacunacionpen;
        console.log(this.personalesDisponibles);
      }, error => {
        console.log(error);
      }
    );
  }*/

  /*onListProvacunacionFiltroFecha(filtro: string) {
    this.provacunacionService.getAllProvacunacionFiltroFecha(filtro).subscribe(
      (result) => {
        this.provacunacionesPen = result;
        this.provacunacionPenData.data = result;
        this.provacunacionPenData.paginator = this.paginatorprovacunacionpen;
        console.log(this.personalesDisponibles);
      }, error => {
        console.log(error);
      }
    );
  }*/

  onListPersonalDisVacunacion(codprogram: number) {
    this.personalService.getAllPersonalDispVacunacionByCodProgram(codprogram).subscribe(
      (result) => {
        this.personalesDisponibles = result;
        this.personalDisponibleData.data = result;
        this.personalDisponibleData.paginator = this.paginatorpersonalDisponible;
        console.log(this.personalesDisponibles);
      }, error => {
        console.log(error);
      }
    );
  }

  onListPersonalDispVacuFiltroDni(filtro:string,  codprogram: number) {
    this.personalService.getAllPersonalfindAllDispVacuFiltroDni(filtro, codprogram).subscribe(
      (result) => {
        this.personalesDisponibles = result;
        this.personalAsignarData.data = result;
        this.personalAsignarData.paginator = this.paginatorpersonalAsignar;
      }, error => {
        console.log(error);
      }
    );
  }

  onListPersonalDispVacuFiltroArea(filtro:string, codprogram: number) {
    this.personalService.getAllPersonalfindAllDispVacuFiltroArea(filtro, codprogram).subscribe(
      (result) => {
        this.personalesDisponibles = result;
        this.personalAsignarData.data = result;
        this.personalAsignarData.paginator = this.paginatorpersonalAsignar;
      }, error => {
        console.log(error);
      }
    );
  }

  onListPersonalVacunado() {
    this.vacunacionService.getAllPersonalVacunados(this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.personalvacunados = result;
        this.personalvacunadoData.data = result;
        this.personalvacunadoData.paginator = this.paginatorpersonalvacunado;
        console.log(this.personalvacunados);
      }, error => {
        console.log(error);
      }
    );
  }

  onListProVacuancionPendientes() {
    this.provacunacionService.getAllProvacunacionPendientes().subscribe(
      (result) => {
        this.provacunacionesPen = result;
        this.provacunacionPenData.data = result;
        this.provacunacionPenData.paginator = this.paginatorprovacunacionpen;
        
      }, error => {
        console.log(error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.provacunacionPenData.filter = filterValue.trim().toLowerCase();
  }

  onListEmpresa() {
    this.empresaService.getAllEmpresa().subscribe(
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

  onListTipoVacuna() {
    this.tablaService.getAllTipoVacuna().subscribe(
      (result) => {
        this.tipoVacunas = result;
      }, error => {
        console.log(error);
      }
    );
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


  onSelectProgramacion(programacion: Vacunacion){
    this.codigoProgram = null;
    console.log(programacion);
    this.vacunacionService.getVacunacionById(programacion.id).subscribe(
      (result) => {
        console.log(result);
        //this.provacunacion = result;
        //Listar Personal Disponible Filtrado Por Programacion 
        this.codigoProgram = result.codprogram;
        let nombrearea ;
        if (result.personal != null){
          nombrearea = result.personal.desareas;
        }else{
          nombrearea = "";
        }

        this.formVacunacion.patchValue({
          id: result.id,
          codigo: null,
          codempresa: result.codempresa,
          sede: result.sede,
          codprogram: result.codprogram,
          codempresapers: result.codempresapers,
          codpersonal: result.codpersonal,
          
          codtipovacuna: result.codtipovacuna,
          fechavacuna: this.dato.fecha,
          lotevacuna: result.programa.lote,
          codvacunador: result.codvacunador,
          codestado: null,
          flatcartilla: null,
          observacion: null,
          nombrepersonal: [''],
          personales: null,
          codempresaarea: result.personal.codempresa,
          numverareas: result.personal.numverareas,
          codareas: result.personal.codareas,
          nomarea: nombrearea,
          codzona: result.codzona,
          horario: result.horario,
          numdocidentidad: result.personal.numdocidentidad,
          apepaterno: result.personal.apepaterno,
          apematerno: result.personal.apematerno,
          nomtrabajador: result.personal.nomtrabajador
        });

        this.closeProgramF();
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


  onListZona() {
    this.tablaService.getAllZonaVacu().subscribe(
      (result) => {
        this.zonas = result;
      }, error => {
        console.log(error);
      }
    );
  }

  onResetListPrograma(){
  
    this.programacionVacunas = [];
    this.provacunacionPenData.data = [];
    this.provacunacionPenData.paginator = null;
  }

  onSearchProgramacionFilter() {
   
   
    if (this.searhInputProgramacion != null) {

      if (this.searhInputProgramacion.trim() != '') {
        if (this.selectedBusquedaProgramacion == "documento") {
          this.getAllVacunacionByPersonalDoc(this.searhInputProgramacion);
          //this.onListPersonalByNombre(this.searhInputAsignar, this.codigoProgram);
          //this.onListProvacunacionFiltroTipVacuna(this.searhInputProgramacion);
        } else {
          //this.onListPersonalByArea(this.searhInputAsignar, this.codigoProgram);
          //this.onListProvacunacionFiltroFecha(this.searhInputProgramacion);
        }
      } else {
        //this.onListProVacuancionPendientes();
        //this.onListPersonalAsignar(this.codigoProgram);
        this.onResetListPrograma();
      }

    } else {
      //this.onListProVacuancionPendientes();
      //this.onListPersonalAsignar(this.codigoProgram);
      this.onResetListPrograma();
    }
  }

  onReturnVacunacion(vacunacion: Vacunacion) {
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

        this.vacunacionService.RegresoEstadoVacunacion(vacunacion.id).subscribe(
          (response) => {
            if (response > 0) {
              this.onListPersonalVacunado();
              //console.log(response);
              //this.onListProVacuancionPendientes();
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


  onResetFormVacunacion() {
    this.submittedVacunacion = false;
    this.formVacunacion.reset();
    this.personalAsignados = [];
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

  ClearSelectectFile() {

  }

  onFileSelected(event: { target: { files: File[]; }; }) {
    if (<File>event.target.files[0] != null) {
      this.selectedFile = <File>event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onProcesarData() {

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

      this.vacunacionService.CargarExcelRegVacunaciones(formData).subscribe(
        (result) => {
          this.listErrores = result;
         
          if (this.listErrores.length > 0){
            this.toastRejectAlert("Error en la Carga de datos :  Verificar Informe");
          }else{
            this.validarCarga = true;
            this.toastAcceptedAlert("Se Cargo la data con exito!");
            this.onListPersonalVacunado();
            this.closeCargaB();
            this.closePrincipal();
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
    this.errorService.getAllBackErrorVacunacionPersonal().subscribe(
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

  descargarPlanilla() {
    this.vacunacionService.getFile().subscribe(
      (result) => {
        const url = window.URL.createObjectURL(result);
        window.open(url);
      }, error => {
        console.log(error);
      }
    );
  }

  onExportExcel() {
    this.vacunacionService.getFileExportVacunados(this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        const url = window.URL.createObjectURL(result);
        window.open(url);
      }, error => {
        console.log(error);
      }
    );
  }

  onShowDatos() {
    this.datoService.getDatos().subscribe(
      (result) => {
        this.dato = result;
      }, error => {
        console.log(error);
      }

    );
  }

  /*descargarPdf(vacunacion: Vacunacion) {
    this.vacunacionService.getPdf(vacunacion.id).subscribe(
      (result) => {
        const url = window.URL.createObjectURL(result);
        window.open(url);
      }, error => {
        console.log(error);
      }
    );
  }*/


  ngOnInit(): void {
    this.onBuildFormVacunacion();
    this.onBuildFormPersonal();
    this.onBuildFormCarga();
    this.onListPersonalVacunado();
    //this.onListProVacuancionPendientes();
    this.onShowDatos();
    this.onListEmpresa();
    this.onListTipoVacuna();
    this.onListVacunador();
    this.onListZona();
  }

}
