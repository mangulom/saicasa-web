import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Capacitacion } from 'src/app/models/capacitacion';
import { Dato } from 'src/app/models/dato';
import { Empresa } from 'src/app/models/empresa';
import { Error } from 'src/app/models/error';
import { Procapacitacion } from 'src/app/models/procapacitacion';
import { Sucursal } from 'src/app/models/sucursal';
import { Tabladetalle } from 'src/app/models/tabladetalle';
import { CapacitacionService } from 'src/app/services/capacitacion.service';
import { DatoService } from 'src/app/services/dato.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ErrorService } from 'src/app/services/error.service';
import { ProcapacitacionService } from 'src/app/services/procapacitacion.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import { TablaService } from 'src/app/services/tabla.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-capacitacion',
  templateUrl: './capacitacion.component.html',
  styleUrls: ['./capacitacion.component.css']
})
export class CapacitacionComponent implements OnInit {

  public formCapacitacion: FormGroup;
  public formCarga: FormGroup;
  public formCargaHist: FormGroup;

  public submittedCapa = false;
  public codigoProgram: number;

  public empresas: Empresa[];
  public sucursales: Sucursal[];
  public evaluaciones: Tabladetalle[];
  public proveedores: Tabladetalle[];
  public estados: Tabladetalle[];
  public tipocaps: Tabladetalle[];
  public motivocaps: Tabladetalle[];
  public notas: Tabladetalle[];
  public temacaps: Tabladetalle[];

  public dato: Dato = new Dato();

  public capaProPendientes: Capacitacion[];
  public capaRealizados: Capacitacion[];
  public capaProPrograms: Procapacitacion[];

  public selectedFile: File;
  @ViewChild('fileProducto') inputFile: ElementRef;

  public selectedFileCargaHist: File;
  @ViewChild('fileCargaCapaHist') inputFileCargaHist: ElementRef;

  public listErrores: Error[] = [];
  public validarCarga: boolean = false;

  public listErroresHist: Error[] = [];
  public validarCargaHist: boolean = false;

  public searhInputAsignar: string;
  public selectedBusquedaAsign: string = 'DNI';
  public searhInputProgramacion: string;
  public selectedBusquedaProgramacion: string = 'documento';

  capaproPenCol: string[] = ['Opciones', 'Empresa', 'Sede', 'Fecha', 'Tema','Tipo'];
  capaproPenData = new MatTableDataSource();

  capaProProgramsCol: string[] = ['Opciones', 'Empresa', 'Sede', 'Fecha', 'Tema', 'Tipo'];
  capaProProgramsData = new MatTableDataSource();

  capaCol: string[] = ['Empresa', 'Sede', 'Fecha', 'Documento', 'ApePat', 'ApeMat', 'Nombres', 'Tema', 'Tipo'];
  capaData = new MatTableDataSource();

  erroresCol: string[] = ['Linea', 'Columna', 'Dato', 'Detalle'];
  erroresData = new MatTableDataSource();

  erroresCargaHistCol: string[] = ['Linea', 'Columna', 'Dato', 'Detalle'];
  erroresCargaHistData = new MatTableDataSource();

  @ViewChild('paginatorCapaProPen', { static: true, read: MatPaginator }) paginatorCapaProPen: MatPaginator;
  @ViewChild('paginatorCapaRead', { static: true, read: MatPaginator }) paginatorCapaRead: MatPaginator;
  @ViewChild('paginatorErrores', { static: true, read: MatPaginator }) paginatorErrores: MatPaginator;
  @ViewChild('paginatorErroresCargaHist', { static: true, read: MatPaginator }) paginatorErroresCargaHist: MatPaginator;

  //carga
  @ViewChild('paginatorcapaProPrograms', { static: true, read: MatPaginator }) paginatorcapaProPrograms: MatPaginator;

  @ViewChild('closeProgram') SubModalProgram: ElementRef;
  @ViewChild('closePrincipal') SubModalPrincipal: ElementRef;
  @ViewChild('closeCarga') SubmodalCarga: ElementRef;
  @ViewChild('closeErrores') SubmodalErrores: ElementRef;
  //Carga
  @ViewChild('CloseProCapaCarga') SubmodalCargaProCapa: ElementRef;
  @ViewChild('CloseProCapaHist') SubmodalCargaCapaHist: ElementRef;

  constructor(private empresaService: EmpresaService,
    private sucursalService: SucursalService,
    private capacitacionService: CapacitacionService,
    private procapacitacionService: ProcapacitacionService,
    private usuarioService: UsuarioService,
    private errorService: ErrorService,
    private tablaService: TablaService,
    private datoService: DatoService,
    private formBuilder: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef) { }


  private closeProgramSearch(): void {
    this.SubModalProgram.nativeElement.click();
  }

  private closePrincipal(): void {
    this.SubModalPrincipal.nativeElement.click();
  }

  private closeProCapaCarga(): void {
    this.SubmodalCargaProCapa.nativeElement.click();
  }

  private closeCargaB(): void {
    this.SubmodalCarga.nativeElement.click();
  }

  private closeCargaCapaHist(): void {
    this.SubmodalCargaCapaHist.nativeElement.click();
  }


  onBuildFormEmo() {
    this.formCapacitacion = this.formBuilder.group({
      id: [''],
      codigo: [''],
      codempresa: [{ value: '', disabled: true }],
      sede: [{ value: '', disabled: true }],
      codprogram: [''],
      codempresapers: [''],
      codpersonal: [''],
      fechacapacitacion: [''],
      nroord: [''],
      codnota: [''],
      observacion: [''],

      codtema: [{ value: '', disabled: true }],
      codtipocap: [{ value: '', disabled: true }],
      codmtvcap: [{ value: '', disabled: true }],
      fechaprogram: [''],
      fechavigencia: [''],
      fechalimite: [''],

      nomarea: [''],
      numdocidentidad: ['', Validators.required],
      apepaterno: [''],
      apematerno: [''],
      nomtrabajador: [''],
      personales: ['']

    });
  }

  get g() {
    return this.formCapacitacion.controls;
  }

  onSubmit() {
    this.submittedCapa = true;
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


        this.capacitacionService.saveOne(this.formCapacitacion.getRawValue()).subscribe(
          (result) => {
            if (result) {

              this.getAllCapaRealizados();
              this.changeDetectorRefs.detectChanges();
              this.toastAcceptedAlert("Se registro con exito");
              this.onResetFormCapacitacion();

              this.closePrincipal();
            } else {
              //this.closePrincipal();
            }
          }, error => {
            console.log(error);
          }
        );



      }
    })
  }

  onUpdateCapacitacion(capacitacion: Capacitacion) {
    this.codigoProgram = null;

    this.capacitacionService.getCapacitacionById(capacitacion.id).subscribe(
      (result) => {
        console.log(result);
        this.codigoProgram = result.codprogram;
        let nombrearea;
        if (result.personal != null) {
          nombrearea = result.personal.desareas;
        } else {
          nombrearea = "";
        }

        this.formCapacitacion.patchValue({
          id: result.id,
          codigo: null,
          codempresa: result.codempresa,
          sede: result.sede,
          codprogram: result.codprogram,
          codempresapers: result.codempresapers,
          codpersonal: result.codpersonal,
          fechacapacitacion: result.fechacapacitacion,
          nroord: result.nroord,
          codnota: result.codnota,
          observacion: result.observacion,

          nomarea: nombrearea,
          numdocidentidad: result.personal.numdocidentidad,
          apepaterno: result.personal.apepaterno,
          apematerno: result.personal.apematerno,
          nomtrabajador: result.personal.nomtrabajador,

          personales: null

        });

      }, error => {
        console.log(error);
      }
    );

  }

  onResetFormCapacitacion() {
    this.submittedCapa = false;
    this.searhInputProgramacion = null;
    this.onResetListPrograma();
    this.formCapacitacion.reset();
  }


  onSelectProgramacion(capacitacion: Capacitacion) {
    this.codigoProgram = null;
    this.capacitacionService.getCapacitacionById(capacitacion.id).subscribe(
      (result) => {
        console.log(result);
        this.codigoProgram = result.codprogram;
        let nombrearea;
        if (result.personal != null) {
          nombrearea = result.personal.desareas;
        } else {
          nombrearea = "";
        }

        this.formCapacitacion.patchValue({
          id: result.id,
          codigo: null,
          codempresa: result.codempresa,
          sede: result.sede,
          codprogram: result.codprogram,
          codempresapers: result.codempresapers,
          codpersonal: result.codpersonal,
          fechacapacitacion: this.dato.fecha,
          nroord: result.nroord,
          codnota: result.codnota,
          observacion: result.observacion,

          codtema: result.programa.codtema,
          codtipocap: result.programa.codtipocap,
          codmtvcap: result.programa.codmtvcap,
          fechaprogram: result.programa.fechaprogram,
          fechavigencia: result.programa.fechavigencia,
          fechalimite: result.programa.fechalimite,

          nomarea: nombrearea,
          numdocidentidad: result.personal.numdocidentidad,
          apepaterno: result.personal.apepaterno,
          apematerno: result.personal.apematerno,
          nomtrabajador: result.personal.nomtrabajador,

          personales: null

        });

        this.closeProgramSearch();

      }, error => {
        console.log(error);
      }
    );
  }

  getAllCapaByPersonalDoc(filtro: string) {
    this.capacitacionService.getAllCapacitacionByPersonalDoc(filtro, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.capaProPendientes = result;
        this.capaproPenData.data = result;
        this.capaproPenData.paginator = this.paginatorCapaProPen;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  getAllCapaRealizados() {
    this.capacitacionService.getAllCapacitacionRealizados(this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.capaRealizados = result;
        this.capaData.data = result;
        this.capaData.paginator = this.paginatorCapaRead;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onResetListPrograma() {

    this.capaProPendientes = [];
    this.capaproPenData.data = [];
    this.capaproPenData.paginator = null;
  }

  onSearchProgramacionFilter() {
    if (this.searhInputProgramacion != null) {
      if (this.searhInputProgramacion.trim() != '') {
        if (this.selectedBusquedaProgramacion == "documento") {
          this.getAllCapaByPersonalDoc(this.searhInputProgramacion);
        }
      } else {
        this.onResetListPrograma();
      }
    } else {
      this.onResetListPrograma();
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

  //Listas Combo box

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

  onChangeEmpresaSucursal(event: any) {
    this.sucursales = null;
    if (event != null && event != '') {
      this.onListSucursalEmpresa(event);
    }
    else {
      console.log("error de toma de dato");
    }
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

  onListProcapacitacionesProgramados() {
    this.procapacitacionService.getAllProCapacitaciones(this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.capaProPrograms = result;
        this.capaProProgramsData.data = result;
        this.capaProProgramsData.paginator = this.paginatorcapaProPrograms;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onListCapaNotas() {
    this.tablaService.getAllCapacitacionNotas().subscribe(
      (result) => {
        this.notas = result;
      }, error => {
        console.log(error);
      }
    );
  }

  //ARCHIVOS00

  onBuildFormCarga() {
    this.onListProcapacitacionesProgramados();
    this.formCarga = this.formBuilder.group({
      codprogram: [''],
      codempresa: [{ value: '', disabled: true }],
      codsucursal: [{ value: '', disabled: true }],
      codtema: [{ value: '', disabled: true }],
      fechaprogram: [''],
      fechalimite: ['']
    });
  }

  onSelectProgramacionCapaProg(procapacitacion: Procapacitacion) {

    this.procapacitacionService.getProCapacitacionById(procapacitacion.id).subscribe(
      (result) => {
        console.log(result);
        this.formCarga.patchValue({
          codprogram: result.id,
          codempresa: result.codempresa,
          codsucursal: result.sede,
          codtema: result.codtema,
          fechaprogram: result.fechaprogram,
          fechalimite: result.fechalimite
        });

        this.closeProCapaCarga();

      }, error => {
        console.log(error);
      }
    );
  }

  descargarPlanillaProg() {
    this.capacitacionService.getExcelPlantillaCapaProg().subscribe(
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
    let codprogram = this.formCarga.get('codprogram').value;

    if (ExcelFile != null) {
      const formData: FormData = new FormData();
      formData.append('file', ExcelFile, ExcelFile.name);
      formData.append('codempresa', codempresa);
      formData.append('codsucursal', codsucursal);
      formData.append('codprogram', codprogram);


      this.capacitacionService.CargarExcelCapaPersonal(formData).subscribe(
        (result) => {

          this.listErrores = result;

          if (this.listErrores.length > 0) {
            this.toastRejectAlert("Error en la Carga de datos :  Verificar Informe");
          } else {
            this.validarCarga = true;
            this.toastAcceptedAlert("Se Cargo la data con exito!");
            this.getAllCapaRealizados();
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

    this.errorService.getAllBackErrorCapa().subscribe(
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

  //Carga Capacitacion Historica 

  onBuildFormCargaHist() {
    this.onListProcapacitacionesProgramados();
    this.formCargaHist = this.formBuilder.group({
      codempresa: [''],
      codsucursal: ['']
    });
  }

  onResetFormCargaHist(){
    this.formCargaHist.reset();
  }

  descargarPlanillaCapaHist() {
    this.capacitacionService.getExcelPlantillaCapaHist().subscribe(
      (result) => {
        const url = window.URL.createObjectURL(result);
        window.open(url);

      }, error => {
        console.log(error);
      }
    );
  }

  onFileSelectedCargaHist(event: { target: { files: File[]; }; }) {
    if (<File>event.target.files[0] != null) {
      this.selectedFileCargaHist = <File>event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFileCargaHist);
    }
  }

  onProcesarDataCargaHist(){
    const Files = this.inputFileCargaHist.nativeElement;
    this.selectedFileCargaHist = Files.files[0];
    const ExcelFile: File = this.selectedFileCargaHist;

    let codempresa = this.formCargaHist.get('codempresa').value;
    let codsucursal = this.formCargaHist.get('codsucursal').value;

    if (ExcelFile != null) {
      const formData: FormData = new FormData();
      formData.append('file', ExcelFile, ExcelFile.name);
      formData.append('codempresa', codempresa);
      formData.append('codsucursal', codsucursal);

      this.capacitacionService.CargarExcelCapaHist(formData).subscribe(
        (result) => {

          this.listErrores = result;

          if (this.listErrores.length > 0) {
            this.toastRejectAlert("Error en la Carga de datos :  Verificar Informe");
          } else {
            this.validarCarga = true;
            this.toastAcceptedAlert("Se Cargo la data con exito!");
            this.getAllCapaRealizados();
            this.closeCargaCapaHist();

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

  onInformeDataCargaHist(){
    this.errorService.getAllBackErrorCapaHist().subscribe(
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



  ngOnInit(): void {
    this.onBuildFormEmo();
    this.onBuildFormCarga();
    this.onBuildFormCargaHist();
    this.onShowDatos();
    this.getAllCapaRealizados();
    this.onListEmpresa();
    this.onListTipoCapacitaciones();
    this.onListTemaCapacitacion();
    this.onListMotivoCapacitaciones();
    this.onListCapaNotas();
  }

}
