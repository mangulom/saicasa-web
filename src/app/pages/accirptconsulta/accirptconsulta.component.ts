import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Accidente } from 'src/app/models/accidente';
import { Empresa } from 'src/app/models/empresa';
import { Personal } from 'src/app/models/personal';
import { Sucursal } from 'src/app/models/sucursal';
import { Tabladetalle } from 'src/app/models/tabladetalle';
import { AccidenteService } from 'src/app/services/accidente.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { MaearchivoService } from 'src/app/services/maearchivo.service';
import { MedidacorrectivaService } from 'src/app/services/medidacorrectiva.service';
import { PersonalService } from 'src/app/services/personal.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import { TablaService } from 'src/app/services/tabla.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-accirptconsulta',
  templateUrl: './accirptconsulta.component.html',
  styleUrls: ['./accirptconsulta.component.css']
})
export class AccirptconsultaComponent implements OnInit {

  public formBusquedad: FormGroup;
  public formAccidente: FormGroup;
  public formMedidaCorrectiva: FormGroup;
  public searchFormPersonal: FormGroup;
  public formPersonal: FormGroup;
  public formFileCarga: FormGroup;

  public tempCodAcci: number;
  public temCodMed: number;
  public submitted = false;

  public searchInput: string;
  public searhInputAsignar: string;
  public selectedBusquedaAsign: string = "Documento";

  public empresas: Empresa[];
  public sucursales: Sucursal[];
  public personales: Personal[] = [];
  public accidente: Accidente = new Accidente();
  public accidentes: Accidente[];
  

  public tiposAccidentes: Tabladetalle[];
  public gravedadAccidentes: Tabladetalle[];
  public parteAfectadas: Tabladetalle[];
  public meses: Tabladetalle[];

  accidenteCol: string[] = ['Opciones', 'Codigo', 'DNI', 'Nombre', 'Gravedad', 'TipoAcc', 'Estado'];
  accidenteData = new MatTableDataSource();

  @ViewChild('paginatorAccidentes', { static: true, read: MatPaginator }) paginatorAccidentes: MatPaginator;

  @ViewChild('closebutton') modal: ElementRef;
  @ViewChild('closebuttonMedida') modalMedida: ElementRef;
  @ViewChild('closeSubbutton') Submodal: ElementRef;
  @ViewChild('closeCarga') SubmodalCarga: ElementRef;

  constructor(private accidenteService: AccidenteService,
    private empresaService: EmpresaService,
    private usuarioService: UsuarioService,
    private tablaService: TablaService,
    private sucursalService: SucursalService,
    private formBuilder: FormBuilder) { }

  private closeModal(): void {
    this.modal.nativeElement.click();
  }

  get f() {
    return this.formAccidente.controls;
  }

  //ACCIDENTE

  onBuildFormAccidente() {

    this.formAccidente = this.formBuilder.group({

      id: [''],
      codigo: [''],
      codempresa: [{ value: '', disabled: true }],
      sede: [{ value: '', disabled: true }],
      codempresapers: [{ value: '', disabled: true }],
      codpersonal: [{ value: '', disabled: true }],
      mes: [{ value: '', disabled: true }],
      fechaacci: [{ value: '', disabled: true }],
      horaacci: [{ value: '', disabled: true }],
      fechareg: [{ value: '', disabled: true }],
      horareg: [{ value: '', disabled: true }],
      fechainiturn: [{ value: '', disabled: true }],
      horainiturn: [{ value: '', disabled: true }],
      lugaracci: [{ value: '', disabled: true }],
      nrohrstrab: [{ value: '', disabled: true }],
      actividadacci: [{ value: '', disabled: true }],
      graveacc: [{ value: '', disabled: true }],
      tipoacci: [{ value: '', disabled: true }],
      nrotrabafec: [{ value: '', disabled: true }],
      fechainidm: [''],
      fechafindm: [''],
      diasdm: [''],
      diagnacci: [{ value: '', disabled: true }],
      descacci: [{ value: '', disabled: true }],
      partcuerples: [{ value: '', disabled: true }],
      tipoless: [{ value: '', disabled: true }],
      agentecaus: [{ value: '', disabled: true }],
      cie: [{ value: '', disabled: true }],
      hc: [{ value: '', disabled: true }],
      estado: [{ value: '', disabled: true }],

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
      perempresa: [{ value: '', disabled: true }]

    });
  }

  onChargeAccidente(accidente: Accidente) {

    this.accidenteService.getAccidenteById(accidente.id).subscribe(
      (result) => {
        this.accidente = result;
        this.tempCodAcci = result.id;

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
          perempresa: this.accidente.personal.empresa,
          persede: this.accidente.personal.nomsucursal,
          personales: null
        });

      }, error => {
        console.log(error);
      }
    );
  }


  onListAccidente() {
    this.accidenteService.getAllAccidente(this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.accidentes = result;
        this.accidenteData.data = result;
        this.accidenteData.paginator = this.paginatorAccidentes;
        console.log(this.accidentes);
      }, error => {
        console.log(error);
      }
    );
  }

  onListAccidenteByCodigo(codigo: string) {
    this.accidenteService.getAllAccidentesByCodigo(codigo, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.accidenteData.data = result;
        this.accidenteData.paginator = this.paginatorAccidentes;
        console.log(this.accidentes);
      }, error => {
        console.log(error);
      }
    );
  }


  //FILTRO

  get g() {
    return this.formBusquedad.controls;
  }

  onBuildFormBusqueda() {
    this.formBusquedad = this.formBuilder.group({
      fechaini: ['', Validators.required],
      fechafin: ['', Validators.required]
    });
  }

  onListAcciByFechas(fechaini: string, fechafin: string) {
    this.accidenteService.getAllAcciFechaIniAndFechaFin(fechaini, fechafin, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.accidenteData.data = result;
        this.accidenteData.paginator = this.paginatorAccidentes;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onSearchFilter() {
    if (this.formBusquedad.invalid) {
      this.toastRejectAlert("Complete los parametros de Busqueda");
      return;
    }
    this.onListAcciByFechas(this.formBusquedad.get('fechaini').value,
      this.formBusquedad.get('fechafin').value)
  }

  //DESCARGA PDF 
  descargarPdf(accidente: Accidente){
    this.accidenteService.getPdf(accidente.id).subscribe(
      (result) => {
        const url = window.URL.createObjectURL(result);
        window.open(url);
      }, error => {
        console.log(error);
      }
    );
  }

  //VARIABLES

  onListTipoAccidente() {
    this.tablaService.getAllTipoAccidente().subscribe(
      (result) => {
        this.tiposAccidentes = result;
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

  onListMes() {
    this.tablaService.getAllMes().subscribe(
      (result) => {
        this.meses = result;
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
    this.onBuildFormBusqueda();
    this.onBuildFormAccidente();
    this.onListEmpresa();
    this.onListAccidente();
    this.onListTipoAccidente();
    this.onListParteAfectada();
    this.onListMes();
    this.onListGravedadAccidente();
  }

}
