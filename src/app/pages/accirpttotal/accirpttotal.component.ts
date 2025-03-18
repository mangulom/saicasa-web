import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { SucursalService } from 'src/app/services/sucursal.service';
import { TablaService } from 'src/app/services/tabla.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-accirpttotal',
  templateUrl: './accirpttotal.component.html',
  styleUrls: ['./accirpttotal.component.css']
})
export class AccirpttotalComponent implements OnInit {

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
  public accidente: Accidente  = new Accidente();
  public accidentes: Accidente[];


  public tiposAccidentes: Tabladetalle[];
  public gravedadAccidentes: Tabladetalle[];
  public parteAfectadas: Tabladetalle[];
  public meses: Tabladetalle[];

  accidenteCol: string[] = ['Codigo', 'DNI', 'Nombre', 'Gravedad', 'TipoAcc', 'Estado'];
  accidenteData = new MatTableDataSource();

  @ViewChild('paginatorAccidentes', { static: true, read: MatPaginator }) paginatorAccidentes: MatPaginator;

  @ViewChild('closebutton') modal: ElementRef;
  @ViewChild('closebuttonMedida') modalMedida: ElementRef;
  @ViewChild('closeSubbutton') Submodal: ElementRef;
  @ViewChild('closeCarga') SubmodalCarga: ElementRef;

  constructor(private accidenteService: AccidenteService,
    private usuarioService: UsuarioService,
    private empresaService: EmpresaService,
    private tablaService: TablaService,
    private sucursalService: SucursalService,
    private formBuilder: FormBuilder) { }

  get f() {
    return this.formAccidente.controls;
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


  //DESCARGA PDF 
  descargarExcel() {

    if (this.formBusquedad.invalid) {
      this.toastRejectAlert("Complete los parametros de Busqueda");
      return;
    }

    this.accidenteService.getExcelAccientesByFecha(this.formBusquedad.get('fechaini').value,
      this.formBusquedad.get('fechafin').value, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        const url = window.URL.createObjectURL(result);
        window.open(url);
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
  descargarPdf(accidente: Accidente) {
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
    this.onListEmpresa();
    this.onListAccidente();
    this.onListTipoAccidente();
    this.onListParteAfectada();
    this.onListMes();
    this.onListGravedadAccidente();
  }

}
