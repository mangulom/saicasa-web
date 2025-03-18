import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppComponent } from 'src/app/app.component';
import { Accidente } from 'src/app/models/accidente';
import { Empresa } from 'src/app/models/empresa';
import { Personal } from 'src/app/models/personal';
import { Sucursal } from 'src/app/models/sucursal';
import { Respacci } from 'src/app/models/respacci';
import { Tabladetalle } from 'src/app/models/tabladetalle';
import { AccidenteService } from 'src/app/services/accidente.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { PersonalService } from 'src/app/services/personal.service';
import { RespacciService } from 'src/app/services/respacci.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import { TablaService } from 'src/app/services/tabla.service';
import { MaearchivoService } from 'src/app/services/maearchivo.service';
import { DetaccicausaService } from 'src/app/services/detaccicausa.service';
import Swal from 'sweetalert2';
import { Acciarchivo } from 'src/app/models/acciarchivo';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-accidente',
  templateUrl: './accidente.component.html',
  styleUrls: ['./accidente.component.css']
})
export class AccidenteComponent implements OnInit {

  public formAccidente: FormGroup;
  public searchFormPersonal: FormGroup;
  public formPersonal: FormGroup;
  public formRespAcci: FormGroup;
  public formFileCarga: FormGroup;

  public formSelecActoInseguro: FormGroup;
  public formSelecCondInsegura: FormGroup;
  public formSelecFactPersonal: FormGroup;
  public formSelecFactLaboral: FormGroup;

  public searhInputAsignar: string;
  public selectedBusquedaAsign: string = 'Documento';

  public selectedFileAccidentes: File;
  @ViewChild('fileAccidentes') inputFileAccidentes: ElementRef;

  AccidentesArchivoCol: string[] = ['Opciones', 'Nombre'];
  AccidentesArchivoData = new MatTableDataSource();

  public tempCodAcci: number;
  public submitted = false;
  public searchInputAccidente: string;

  public searchInput: string;
  public nombrePersonal: string;
  public personalAccidente: Personal = new Personal();
  public codjefe: string;

  public accidente: Accidente = new Accidente();
  public accidentes: Accidente[];
  public responsable: Respacci =  new Respacci();

  public empresas: Empresa[];
  public sucursales:  Sucursal[];
  public personales: Personal[] = [];
  public responsables: Personal[];

  public asigResponsables: Personal[] = [];
  public asigActoInseguros: Tabladetalle[] = [];
  public asigCondInseguras: Tabladetalle[] = [];
  public asigFactPersonales: Tabladetalle[] = [];
  public asigFactLaborale: Tabladetalle[] = [];

  public agentesCausantes: Tabladetalle[];
  public tiposAccidentes: Tabladetalle[];
  public cies: Tabladetalle[];
  public parteAfectadas: Tabladetalle[];
  public tipoLesiones: Tabladetalle[];
  public gravedadAccidentes: Tabladetalle[];
  public estadosInves: Tabladetalle[];
  public meses: Tabladetalle[];

  public actoInseguros: Tabladetalle[];
  public condInseguros: Tabladetalle[];
  public factPersonales: Tabladetalle[];
  public factLaborales: Tabladetalle[];

  accidenteCol: string[] = ['Opciones', 'Codigo', 'DNI', 'Nombre', 'Gravedad', 'TipoAcc', 'Estado'];
  accidenteData = new MatTableDataSource();

  personalCol: string[] = ['Opciones', 'Nombre' , 'Area', 'Cargo'];
  personalData = new MatTableDataSource();

  responsableCol: string[] = ['Opciones', 'Nombre', 'DNI', 'Cargo'];
  responsableData = new MatTableDataSource();

  AsignResponsableCol: string[] = ['Opciones', 'Nombre', 'Cargo'];
  AsignResponsableData = new MatTableDataSource();

  asignActosInseguroCol: string[] = ['Opciones', 'Nombre'];
  asignActosInseguroData = new MatTableDataSource();

  asignCondInseguraCol: string[] = ['Opciones', 'Nombre'];
  asignCondInseguraData = new MatTableDataSource();

  asignFacPersonalCol: string[] = ['Opciones', 'Nombre'];
  asignFacPersonalData = new MatTableDataSource();

  asignFacLaboralCol: string[] = ['Opciones', 'Nombre'];
  asignFacLaboralData = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('paginatorpersonal', { static: true, read: MatPaginator }) paginatorpersonal: MatPaginator;
  @ViewChild('paginatorresponsable', { static: true, read: MatPaginator }) paginatorresponsable: MatPaginator;
  @ViewChild('paginatorAsignResponsable', { static: true, read: MatPaginator }) paginatorAsignResponsable: MatPaginator;

  @ViewChild('paginatorActoInseg', { static: true, read: MatPaginator }) paginatorActoInseg: MatPaginator;
  @ViewChild('paginatorCondInseg', { static: true, read: MatPaginator }) paginatorCondInseg: MatPaginator;
  @ViewChild('paginatorFactPersonal', { static: true, read: MatPaginator }) paginatorFactPersonal: MatPaginator;
  @ViewChild('paginatorFactLaboral', { static: true, read: MatPaginator }) paginatorFactLaboral: MatPaginator;
  @ViewChild('paginatorarchivos', { static: true, read: MatPaginator }) paginatorarchivos: MatPaginator;

  @ViewChild('closebutton') modal: ElementRef;
  @ViewChild('closeSubbutton') Submodal: ElementRef;

  constructor(private empresaService: EmpresaService,
    private maeArchivoService: MaearchivoService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private tablaService:  TablaService,
    private detaccicausaService: DetaccicausaService,
    private sucursalService: SucursalService,
    private personalService: PersonalService,
    private accidenteService: AccidenteService,
    private changeDetectorRefs: ChangeDetectorRef) { }

  private closeModal(): void {
    this.modal.nativeElement.click();
  }

  private closeSubModal(): void {
    this.Submodal.nativeElement.click();
  }

  get f() {
    return this.formAccidente.controls;
  }

  //RESPONSABLE ACCIDENTE

  onBuildRespAcci() {
    this.formRespAcci = this.formBuilder.group({
      codempresa: [''],
      codpersonal: [''],
      codacci: ['']
    });
  }

  onBuildSearchPersonal() {
    this.searchFormPersonal = this.formBuilder.group({
      dato: ['']
    });
  }

  onSearchPersonalResponsable() {
    if (this.searhInputAsignar != null) {
      if (this.searhInputAsignar.trim() != '') {
        if (this.selectedBusquedaAsign == "Documento") {
          this.onListPersonalByDoc(this.searhInputAsignar);
        }
        if (this.selectedBusquedaAsign == "Nombres") {
          this.onListPersonalByNombreLike(this.searhInputAsignar);
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

  onListRespAcci(accidente: Accidente) {
    this.personalService.getAllResponsableByAccidente(accidente.id).subscribe(
      (result) => {

        for (let index = 0; index < result.length; index++) {
          this.asigResponsables.push(result[index]);
        }

        console.log(result);

        this.AsignResponsableData.data = result;
        this.AsignResponsableData.paginator = this.paginatorAsignResponsable;
        this.formAccidente.get('responsables').setValue(this.asigResponsables);
        this.changeDetectorRefs.markForCheck();

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

    if (this.findAsignResponsable(personal.codpersonal)) {
      Swal.fire({
        icon: 'error',
        title: 'Error...',
        text: 'Este Elemento ya se encuentra Seleccionado!'
      })
      return;
    }
    this.personalService.getPersonalByEmpresaAndPersonal(personal.codempresa, personal.codpersonal).subscribe(
      (result) => {
       
        this.asigResponsables.push(result);
        this.AsignResponsableData.data = this.asigResponsables;
        this.AsignResponsableData.paginator = this.paginatorAsignResponsable;

        this.formAccidente.get('responsables').setValue(this.asigResponsables);

        this.searhInputAsignar = "";
        this.responsableData.data = [];

        console.log(result);
        this.changeDetectorRefs.markForCheck();
      }, error => {
        console.log(error);
      }
    );

    this.closeSubModal();
  }

  deleteAsigPersonal(index: number) {
    this.asigResponsables.splice(index, 1);
    this.AsignResponsableData.data = this.asigResponsables;
  }

  findAsignResponsable(codpersonal: string): boolean {
    for (var i = 0; i < this.asigResponsables.length; i++) {
      if (this.asigResponsables[i].codpersonal == codpersonal) {
        return true;
      }
    }
    return false;
  }

  //OTROS

  onBuildSeleActoInseg() {
    this.formSelecActoInseguro = this.formBuilder.group({
      codigo: ['', Validators.required]
    });
  }

  onBuildSeleConInseg() {
    this.formSelecCondInsegura = this.formBuilder.group({
      codigo: ['', Validators.required]
    });
  }

  onBuildSeleFactPersonal() {
    this.formSelecFactPersonal = this.formBuilder.group({
      codigo: ['', Validators.required]
    });
  }

  onBuildSeleFactLaboral() {
    this.formSelecFactLaboral = this.formBuilder.group({
      codigo: ['', Validators.required]
    });
  }

  onClearData(){
    this.asigActoInseguros = [];
    this.asigCondInseguras = [];
    this.asigFactPersonales = [];
    this.asigFactLaborale = []
    this.asigResponsables = [];
    this.asignActosInseguroData.data = [];
    this.asignCondInseguraData.data = [];
    this.asignFacPersonalData.data = [];
    this.asignFacLaboralData.data= [];
    this.AsignResponsableData.data = [];
  }

  onBuildFormAccidente() {
    this.onClearData();
    this.formAccidente = this.formBuilder.group({
     
      id: [''],
      codigo: [''],
      codempresa: ['', Validators.required],
      sede: ['', Validators.required],
      codempresapers: [''],
      codpersonal: [''],
      mes: ['', Validators.required],
      fechaacci: ['', Validators.required],
      horaacci: ['', Validators.required],
      fechareg: [''],
      horareg: [''],
      fechainiturn: ['', Validators.required],
      horainiturn: ['', Validators.required],
      lugaracci: ['', Validators.required],
      nrohrstrab: ['', Validators.required],
      actividadacci: ['', Validators.required],
      graveacc: ['', Validators.required],
      tipoacci: ['', Validators.required],
      nrotrabafec: ['', Validators.required],
      fechainidm: [''],
      fechafindm: [''],
      diasdm: ['', Validators.required],
      diagnacci: ['', Validators.required],
      descacci: ['', Validators.required],
      partcuerples: ['', Validators.required],
      tipoless: ['', Validators.required],
      agentecaus: ['', Validators.required],
      cie: ['', Validators.required],
      hc: [''],
      estado: [''],

      apepaterno: [{ value: '', disabled: true }],
      apematerno: [{ value: '', disabled: true }],
      nomtrabajador: [{ value: '', disabled: true }],
      numdocidentidad: [{ value: '', disabled: true }],
      telefono: [{ value: '', disabled: true }],
      fechanac: [{ value: '', disabled: true }],
      edad: [{ value: '', disabled: true }],
      sexo: [{ value: '', disabled: true }],
      direccion: [{ value: '', disabled: true }],
      distrito: [{ value: '', disabled: true }],
      puesto: [{ value: '', disabled: true }],
      nomarea: [{ value: '', disabled: true }],
      fechaingreso: [{ value: '', disabled: true }],
      antiguedad: [{ value: '', disabled: true }],
      tipoplanilla: [{ value: '', disabled: true }],
      tiempoexper: [{ value: '', disabled: true }],
      condicion: [{ value: '', disabled: true }],
      persede: [{ value: '', disabled: true }],
      perempresa: [{ value: '', disabled: true }],

      personales: null,

      responsables: null,
      actoInseguros: null,
      condInseguras: null,
      factPersonales: null,
      factLaborales: null


    });
  }

  onSearchPersonal(){
    //this.formPersonal.reset();
    if (this.searchInput != null && this.searchInput != "") {
      this.onFindPersonal(this.searchInput);  
    } else {
      //this.formPersonal.reset();
    }
  }

  onSearchPersonalData(personal: Personal) {
    if (personal.numdocidentidad != null && personal.numdocidentidad != "") {
      this.onFindPersonal(personal.numdocidentidad);
    } else {
      alert("Ingrese de nuevo");
      //this.formPersonal.reset();
    }
  }

  onFindPersonal(documento: string) {
    this.personalService.getPersonalByDoc(documento, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {

        if (result == null){
          this.toastRejectAlert("Personal no encontrado");
        }else{
          this.personalAccidente = result;
        }
       
        this.formAccidente.get('codempresapers').setValue(result.codempresa);
        this.formAccidente.get('codpersonal').setValue(result.codpersonal);
 
        this.formAccidente.get('apepaterno').setValue(result.apepaterno);
        this.formAccidente.get('apematerno').setValue(result.apematerno);
        this.formAccidente.get('nomtrabajador').setValue(result.nomtrabajador);
        this.formAccidente.get('numdocidentidad').setValue(result.numdocidentidad);
        this.formAccidente.get('telefono').setValue(result.numtelefono);
        this.formAccidente.get('fechanac').setValue(result.fecnacimiento);
        this.formAccidente.get('edad').setValue(result.edad);//aqui
        this.formAccidente.get('sexo').setValue(result.sexo);//aqui
        this.formAccidente.get('direccion').setValue(result.desdireccion);
        this.formAccidente.get('distrito').setValue(result.desdistrito);
        this.formAccidente.get('puesto').setValue(result.descargo);
        this.formAccidente.get('nomarea').setValue(result.desareas);
        this.formAccidente.get('fechaingreso').setValue(result.fecingreso);
        this.formAccidente.get('antiguedad').setValue(result.antiguedad);//aqui
        this.formAccidente.get('tipoplanilla').setValue(result.destipoplanilla);
        this.formAccidente.get('tiempoexper').setValue(result.experiencia);
        this.formAccidente.get('condicion').setValue(result.condicion);
        this.formAccidente.get('perempresa').setValue(result.empresa);
        this.formAccidente.get('persede').setValue(result.nomsucursal);

        console.log(result);

      }, error => {
        console.log(error);
      }
    );
  }

  onSubmit(){
    this.submitted = true;
    if (this.personalAccidente.numdocidentidad == null) {
      this.toastRejectAlert("Realice la busqueda del Personal Accidentado");
      return;
    }
    if (this.formAccidente.invalid) {
      return;
    }
    if (this.asigResponsables.length <= 0 ){
      this.toastRejectAlert("Seleccionar al menos 1 Responsable");
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


        this.accidenteService.save(this.formAccidente.value).subscribe(
          (result) => {
            if (result) {
              this.onResetFormAccidente();
              this.onListAccidente();
              this.changeDetectorRefs.detectChanges();
              this.toastAcceptedAlert("Se registro con exito");
              this.onClearData();
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

  onResetFormAccidente(){
    this.submitted = false;
    this.searchInput = null;
    this.formAccidente.reset();
    this.onClearData();
    //this.formPersonal.reset();
  }


  deleteById(accidente: Accidente) {


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
    
        this.accidenteService.deleteAccidente(accidente.id).subscribe(
          (result) => {
            this.onListAccidente();
            this.changeDetectorRefs.markForCheck();
          }, error => {
            console.log(error);
          }
        );
      }
    })

  }

  onListAccidente() {
    this.accidenteService.getAllAccidente(this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.accidentes = result;
        this.accidenteData.data = result;
        this.accidenteData.paginator = this.paginator;
        console.log(this.accidentes);
      }, error => {
        console.log(error);
      }
    );
  }

  onUpdateAccidente(accidente: Accidente){
    this.onResetFormAccidente();
    this.searchInput = null;

    this.accidenteService.getAccidenteById(accidente.id).subscribe(
      (result) => {
        this.accidente = result;
        this.tempCodAcci = result.id;
        this.personalService.getPersonalByEmpresaAndPersonal(accidente.codempresapers, accidente.codpersonal).subscribe(
          (dato) => {

            this.onSearchPersonalData(dato);

            this.formAccidente.patchValue({
              id: this.accidente.id,
              codigo: this.accidente.codigo,
              codempresa: this.accidente.codempresa,
              sede: this.accidente.sede,
              codempresapers: this.accidente.codempresapers,
              codpersonal: this.accidente.codpersonal,
              mes: this.accidente.mes,
              fechaacci: this.accidente.fechaacci,
              horaacci: this.accidente.horaacci,
              fechareg: this.accidente.fechareg,
              horareg: this.accidente.horareg,
              fechainiturn: this.accidente.fechainiturn,
              horainiturn: this.accidente.horainiturn,
              lugaracci: this.accidente.lugaracci,
              nrohrstrab: this.accidente.nrohrstrab,
              actividadacci: this.accidente.actividadacci,
              graveacc: this.accidente.graveacc,
              tipoacci: this.accidente.tipoacci,
              nrotrabafec: this.accidente.nrotrabafec,
              fechainidm: this.accidente.fechainidm,
              fechafindm: this.accidente.fechafindm,
              diasdm: this.accidente.diasdm,
              diagnacci: this.accidente.diagnacci,
              descacci: this.accidente.descacci,
              partcuerples: this.accidente.partcuerples,
              tipoless: this.accidente.tipoless,
              agentecaus: this.accidente.agentecaus,
              cie: this.accidente.cie,
              hc: this.accidente.hc,
              estado: this.accidente.estado,

              apepaterno: this.accidente.personal.apepaterno,
              apematerno: this.accidente.personal.apematerno,
              nomtrabajador: this.accidente.personal.nomtrabajador,
              numdocidentidad: this.accidente.personal.numdocidentidad,
              telefono: this.accidente.personal.numtelefono,
              fechanac: this.accidente.personal.fecnacimiento,
              edad: this.accidente.personal.edad,
              sexo: this.accidente.personal.sexo,
              direccion: this.accidente.personal.desdireccion,
              distrito: this.accidente.personal.desdistrito,
              puesto: this.accidente.personal.descargo,
              nomarea: this.accidente.personal.desareas,
              fechaingreso: this.accidente.personal.fecingreso,
              antiguedad: null,
              tipoplanilla: this.accidente.personal.destipoplanilla,
              tiempoexper: "",
              condicion: "",
              empresa: this.accidente.personal.empresa,
              personales: null
            });

          }, error => {
            console.log(error);
          }
      );

        this.onListAcciActoInseguros(result);
        this.onListAcciCondInseguros(result);
        this.onListAcciFactorLaboral(result);
        this.onListAcciFactorPersonal(result);

        this.onListRespAcci(result);

        
      }, error => {
        console.log(error);
      }
    );



  }

  //BUSCAR ACCIDENTE 

  onSearchAccidente() {
    //this.formPersonal.reset();
    if (this.searchInputAccidente != null && this.searchInputAccidente != "") {
      this.onListAccidenteByCodigo(this.searchInputAccidente);
    } else {
      this.onListAccidente();
    }
  }

  onListAccidenteByCodigo(codigo: string) {
    this.accidenteService.getAllAccidentesByCodigo(codigo, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.accidenteData.data = result;
        this.accidenteData.paginator = this.paginator;
        console.log(this.accidentes);
      }, error => {
        console.log(error);
      }
    );
  }


  //LISTADO DE COMBOS
  
  onListAgenteCausantes() {
    this.tablaService.getAllAgenteCausante().subscribe(
      (result) => {
        this.agentesCausantes = result;
        console.log(this.accidentes);
      }, error => {
        console.log(error);
      }
    );
  }

  onListTipoAccidente() {
    this.tablaService.getAllTipoAccidente().subscribe(
      (result) => {
        this.tiposAccidentes = result;
      }, error => {
        console.log(error);
      }
    );
  }

  onListCIE() {
    this.tablaService.getAllCIE().subscribe(
      (result) => {
        this.cies = result;
      }, error => {
        console.log(error);
      }
    );
  }

  onListParteAfectada() {
    this.tablaService.getAllParteAfectada().subscribe(
      (result) => {
        this.parteAfectadas = result;
      }, error => {
        console.log(error);
      }
    );
  }

  onListTipoLesion() {
    this.tablaService.getAllTipoLesion().subscribe(
      (result) => {
        this.tipoLesiones = result;
      }, error => {
        console.log(error);
      }
    );
  }

  onListGravedadAccidente() {
    this.tablaService.getAllGreavedaAccidente().subscribe(
      (result) => {
        this.gravedadAccidentes = result;
      }, error => {
        console.log(error);
      }
    );
  }

  onListEstadoInv() {
    this.tablaService.getAllEstadoInv().subscribe(
      (result) => {
        this.estadosInves = result;
      }, error => {
        console.log(error);
      }
    );
  }

  onListMes() {
    this.tablaService.getAllMes().subscribe(
      (result) => {
        this.meses = result;
      }, error => {
        console.log(error);
      }
    );
  }

  onListSucursal(codempresa:  string) {
    this.sucursalService.getAllSucursalByEmpresa(codempresa).subscribe(
      (result) => {
        this.sucursales = result;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onListPersonal() {
    this.personalService.getAllPersonal().subscribe(
      (result) => {
        this.personales = result;
        this.personalData.data = result;
        this.personalData.paginator = this.paginatorpersonal;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  selectPersonal(personal: Personal){

    this.nombrePersonal = personal.apepaterno + ' ' + personal.apematerno + ' ' + personal.nomtrabajador;
    this.codjefe = personal.codpersonal;
    console.log(personal);
    this.formAccidente.get('codjefe').setValue(this.codjefe);
    this.formAccidente.get('nombrejefe').setValue(this.nombrePersonal);
    this.closeSubModal();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.personalData.filter = filterValue.trim().toLowerCase();
  }

  onExportExcel(){
    this.accidenteService.getFile().subscribe(
      (result) => {
        const url = window.URL.createObjectURL(result);
        window.open(url);
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

  //AGREGAR ACTO INSEGURIDAD
  onSaveActoInseg() {

    if (this.findActoInsegArray(this.formSelecActoInseguro.get('codigo').value)) {
      Swal.fire({
        icon: 'error',
        title: 'Error...',
        text: 'Este Elemento ya se encuentra Seleccionado!'
      })
      return;
    }

    this.tablaService.getTablaDetalleById(this.formSelecActoInseguro.get('codigo').value).subscribe(
      (result) => {        
        this.asigActoInseguros.push(result);
        this.asignActosInseguroData.data = this.asigActoInseguros;
        this.asignActosInseguroData.paginator = this.paginatorActoInseg;
        this.formAccidente.get('actoInseguros').setValue(this.asigActoInseguros);
        console.log(this.asigActoInseguros);
        this.changeDetectorRefs.markForCheck();
      }, error => {
        console.log(error);
      }
    );
  }

  deleteActoInseg(index: number) {
    //console.log(index);
    this.asigActoInseguros.splice(index, 1);
    this.asignActosInseguroData.data = this.asigActoInseguros;
  }

  findActoInsegArray(id: number): boolean {
    for (var i = 0; i < this.asigActoInseguros.length; i++) {
      if (this.asigActoInseguros[i].id == id) {
        return true;
      }
    }
    return false;    
  }


  //CONDICION INSEGURA

  onSaveCondInseg() {

    if (this.findCondInsegArray(this.formSelecCondInsegura.get('codigo').value)) {
      Swal.fire({
        icon: 'error',
        title: 'Error...',
        text: 'Este Elemento ya se encuentra Seleccionado!'
      })
      return;
    }

    this.tablaService.getTablaDetalleById(this.formSelecCondInsegura.get('codigo').value).subscribe(
      (result) => {
        this.asigCondInseguras.push(result);
        this.asignCondInseguraData.data = this.asigCondInseguras;
        this.asignCondInseguraData.paginator = this.paginatorCondInseg;
        this.formAccidente.get('condInseguras').setValue(this.asigCondInseguras);
        this.changeDetectorRefs.markForCheck();
      }, error => {
        console.log(error);
      }
    );
  }

  deleteCondInseg(index: number) {
    //console.log(index);
    this.asigCondInseguras.splice(index, 1);
    this.asignCondInseguraData.data = this.asigCondInseguras;
  }

  findCondInsegArray(id: number): boolean {
    for (var i = 0; i < this.asigCondInseguras.length; i++) {
      if (this.asigCondInseguras[i].id == id) {
        return true;
      }
    }
    return false;
  }

  //FACTORES PERSONALES

  onSaveFactoresPersonales() {

    if (this.findFactorPersonalArray(this.formSelecFactPersonal.get('codigo').value)) {
      Swal.fire({
        icon: 'error',
        title: 'Error...',
        text: 'Este Elemento ya se encuentra Seleccionado!'
      })
      return;
    }

    this.tablaService.getTablaDetalleById(this.formSelecFactPersonal.get('codigo').value).subscribe(
      (result) => {
        this.asigFactPersonales.push(result);
        this.asignFacPersonalData.data = this.asigFactPersonales;
        this.asignFacPersonalData.paginator = this.paginatorFactPersonal;
        this.formAccidente.get('factPersonales').setValue(this.asigFactPersonales);
        
        this.changeDetectorRefs.markForCheck();
      }, error => {
        console.log(error);
      }
    );
  }

  deleteFactoresPersonales(index: number) {
    //console.log(index);
    this.asigFactPersonales.splice(index, 1);
    this.asignFacPersonalData.data = this.asigFactPersonales;
  }

  findFactorPersonalArray(id: number): boolean {
    for (var i = 0; i < this.asigFactPersonales.length; i++) {
      if (this.asigFactPersonales[i].id == id) {
        return true;
      }
    }
    return false;
  }

  //FACTORES LABORALES

  onSaveFactoresLaborales() {

    if (this.findFactorLaboralesArray(this.formSelecFactLaboral.get('codigo').value)) {
      Swal.fire({
        icon: 'error',
        title: 'Error...',
        text: 'Este Elemento ya se encuentra Seleccionado!'
      })
      return;
    }

    this.tablaService.getTablaDetalleById(this.formSelecFactLaboral.get('codigo').value).subscribe(
      (result) => {
        this.asigFactLaborale.push(result);
        this.asignFacLaboralData.data = this.asigFactLaborale;
        this.asignFacLaboralData.paginator = this.paginatorFactLaboral;
        this.formAccidente.get('factLaborales').setValue(this.asigFactLaborale);

        this.changeDetectorRefs.markForCheck();
      }, error => {
        console.log(error);
      }
    );
  }

  deleteFactoresLaborales(index: number) {
    //console.log(index);
    this.asigFactLaborale.splice(index, 1);
    this.asignFacLaboralData.data = this.asigFactLaborale;
    this.changeDetectorRefs.markForCheck();
  }

  findFactorLaboralesArray(id: number): boolean {
    for (var i = 0; i < this.asigFactLaborale.length; i++) {
      if (this.asigFactLaborale[i].id == id) {
        return true;
      }
    }
    return false;
  }



  //VARIABLES 

  onListCondInsegura() {
    this.tablaService.getAllCondicionInsegura().subscribe(
      (result) => {
        this.condInseguros = result;
      }, error => {
        console.log(error);
      }
    );
  }

  onListActoInseguro() {
    this.tablaService.getAllActoInseguro().subscribe(
      (result) => {
        this.actoInseguros = result;
      }, error => {
        console.log(error);
      }
    );
  }

  onListFactorLaborales() {
    this.tablaService.getAllFactorLaboral().subscribe(
      (result) => {
        this.factLaborales = result;
      }, error => {
        console.log(error);
      }
    );
  }

  onListFactorPersonales() {
    this.tablaService.getAllFactorPersonal().subscribe(
      (result) => {
        this.factPersonales = result;
      }, error => {
        console.log(error);
      }
    );
  }

  //CARGA DE ARCHIVOS 

  onBuildFormFileCarga() {
    this.formFileCarga = this.formBuilder.group({
      codacci: [''],
      file: ['']
    });
  }

  onFileSelectedAccidente(event: { target: { files: File[]; }; }) {
    if (<File>event.target.files[0] != null) {
      this.selectedFileAccidentes = <File>event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFileAccidentes);
    }
  }

  onFileCharger() {

    const Files = this.inputFileAccidentes.nativeElement;
    this.selectedFileAccidentes = Files.files[0];
    const ExcelFile: File = this.selectedFileAccidentes;

    //let codprocapa = this.formFileCarga.get('codprocapa').value;

    if (ExcelFile != null) {
      const formData: FormData = new FormData();
      formData.append('file', ExcelFile, ExcelFile.name);
      formData.append('codacci', this.tempCodAcci.toString());

      this.accidenteService.CargarFileAccidente(formData).subscribe(
        (result) => {
          this.onListAcciArchivosByid(this.tempCodAcci);
          console.log(result);
        }, error => {
          console.log(error);
        }
      );
    }

  }

  onListAccidenteArchivos(accidente: Accidente) {
    this.maeArchivoService.getAllArchivosByAcci(accidente.id).subscribe(
      (result) => {
        this.AccidentesArchivoData.data = result;
        this.AccidentesArchivoData.paginator = this.paginatorarchivos;
        this.tempCodAcci = accidente.id;
        //this.formFileCarga.get('codacci').setValue(accidente.id);
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onListAcciArchivosByid(id: number){

    this.maeArchivoService.getAllArchivosByAcci(id).subscribe(
      (result) => {
        
        this.AccidentesArchivoData.data = result;
        this.AccidentesArchivoData.paginator = this.paginatorarchivos;
        this.changeDetectorRefs.markForCheck();
        console.log(result);
      }, error => {
        console.log(error);
      }
    );

  }

  deleteByIdAccidenteArchivo(archi: Acciarchivo) {
    this.maeArchivoService.deleteAccidenteArchivoById(archi.id).subscribe(
      (result) => {
        this.onListAcciArchivosByid(archi.codacci);
        this.changeDetectorRefs.markForCheck();
      }, error => {
        console.log(error);
      }
    );
  }

  descargarFile(archi: Acciarchivo) {
    console.log(archi.archivo);
    this.maeArchivoService.getAccidenteOneArchivo(archi.archivo.nombre).subscribe(
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

  //LISTAS DE CAUSAS BASICAS - INMEDIATAS

  onListAcciActoInseguros(accidente: Accidente) {
    this.detaccicausaService.getAllActoInsegByAcci(accidente.id).subscribe(
      (result) => {
        
        for (let index = 0; index < result.length; index++) {
          this.asigActoInseguros.push(result[index]);
        }

        this.asignActosInseguroData.data = result;
        this.asignActosInseguroData.paginator = this.paginatorActoInseg;
        this.formAccidente.get('actoInseguros').setValue(this.asigActoInseguros);
        this.changeDetectorRefs.markForCheck();
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onListAcciCondInseguros(accidente: Accidente) {
    
    this.detaccicausaService.getAllCondInsegByAcci(accidente.id).subscribe(
      (result) => {

        for (let index = 0; index < result.length; index++) {
          this.asigCondInseguras.push(result[index]);
        }

        this.asignCondInseguraData.data = result;
        this.asignCondInseguraData.paginator = this.paginatorCondInseg;
        this.formAccidente.get('condInseguras').setValue(this.asigCondInseguras);
        this.changeDetectorRefs.markForCheck();
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }


  onListAcciFactorPersonal(accidente: Accidente) {
    this.detaccicausaService.getAllFactorPersonalByAcci(accidente.id).subscribe(
      (result) => {

        for (let index = 0; index < result.length; index++) {
          this.asigFactPersonales.push(result[index]);
        }

        this.asignFacPersonalData.data = result;
        this.asignFacPersonalData.paginator = this.paginatorFactPersonal;
        this.formAccidente.get('factPersonales').setValue(this.asigFactPersonales);
        this.changeDetectorRefs.markForCheck();
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onListAcciFactorLaboral(accidente: Accidente) {
    this.detaccicausaService.getAllFactorLaboralByAcci(accidente.id).subscribe(
      (result) => {

        for (let index = 0; index < result.length; index++) {
          this.asigFactLaborale.push(result[index]);
        }

        this.asignFacLaboralData.data = result;
        this.asignFacLaboralData.paginator = this.paginatorFactLaboral;
        this.formAccidente.get('factLaborales').setValue(this.asigFactLaborale);
        this.changeDetectorRefs.markForCheck();
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }
 


  ngOnInit(): void {

    this.onBuildFormAccidente();
    this.onBuildRespAcci();
    this.onBuildFormFileCarga();

    this.onBuildSeleActoInseg();
    this.onBuildSeleConInseg();
    this.onBuildSeleFactPersonal();
    this.onBuildSeleFactLaboral();

    this.onBuildSearchPersonal();

    this.onListEmpresa();
    this.onListAccidente();
    this.onListAgenteCausantes();
    this.onListTipoAccidente();
    this.onListCIE();
    this.onListParteAfectada();
    this.onListTipoLesion();
    this.onListGravedadAccidente();
    //this.onListPersonal();
    //this.onListResponsablePersonal();
    this.onListEstadoInv();
    this.onListMes();      
    
    this.onListActoInseguro();
    this.onListCondInsegura();
    this.onListFactorLaborales();
    this.onListFactorPersonales();

    
  }

}
