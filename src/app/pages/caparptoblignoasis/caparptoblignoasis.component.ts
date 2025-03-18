import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Capacitacion } from 'src/app/models/capacitacion';
import { Tabladetalle } from 'src/app/models/tabladetalle';
import { CapacitacionService } from 'src/app/services/capacitacion.service';
import { TablaService } from 'src/app/services/tabla.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-caparptoblignoasis',
  templateUrl: './caparptoblignoasis.component.html',
  styleUrls: ['./caparptoblignoasis.component.css']
})
export class CaparptoblignoasisComponent implements OnInit {

  public formBusquedad: FormGroup;
  public formPersonal: FormGroup;

  public capaHistoriales: Capacitacion[];
  public tipocaps: Tabladetalle[];

  public submitted = false;

  capaHistCol: string[] = ['Sede', 'ApePat', 'ApeMat', 'Nombre', 'DNI','Tema', 'Tipo', 'Motivo', 'FPro','EstadoCapa' ,'Estado'];
  capaHistData = new MatTableDataSource();

  @ViewChild('paginatorHistoriales', { static: true, read: MatPaginator }) paginatorHistoriales: MatPaginator;

  constructor(private capacitacionService: CapacitacionService,
    private usuarioService: UsuarioService,
    private tablaService: TablaService,
    private formBuilder: FormBuilder) { }


  get f() {
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
    this.getAllCapacitacionTipObligNoAsist(this.formBusquedad.get('codtipo').value,
      this.formBusquedad.get('fechaini').value,
      this.formBusquedad.get('fechafin').value)
  }

  getAllCapacitacionTipObligNoAsist(codtipo: number, fechaini: string, fechafin: string) {
    this.capacitacionService.getAllCapacitacionTipObligNoAsist(codtipo, fechaini, fechafin, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.capaHistoriales = result;
        this.capaHistData.data = result;
        this.capaHistData.paginator = this.paginatorHistoriales;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  //EXPORT EXCEL

  descargarRptCapaHist() {

    if (this.formBusquedad.invalid) {
      this.toastRejectAlert("Complete los parametros de Busqueda");
      return;
    }

    this.capacitacionService.getExcelPersInaCapaObligatorias(this.formBusquedad.get('codtipo').value,
      this.formBusquedad.get('fechaini').value,
      this.formBusquedad.get('fechafin').value, this.usuarioService.getUsuarioSession()).subscribe(
        (result) => {
          const url = window.URL.createObjectURL(result);
          window.open(url);
        }, error => {
          console.log(error);
        }
      );


  }
  

  //VARIABLES 

  onListTipoCapacitaciones() {
    this.tablaService.getAllTipoCapacitacion().subscribe(
      (result) => {
        this.tipocaps = result;
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
    this.onListTipoCapacitaciones();
    //this.getAllCapaHistoryByPersonalDoc();
  }

}
