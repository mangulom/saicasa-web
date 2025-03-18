import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Procapacitacion } from 'src/app/models/procapacitacion';
import { Tabladetalle } from 'src/app/models/tabladetalle';
import { CapacitacionService } from 'src/app/services/capacitacion.service';
import { ProcapacitacionService } from 'src/app/services/procapacitacion.service';
import { TablaService } from 'src/app/services/tabla.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-caparptprogramasis',
  templateUrl: './caparptprogramasis.component.html',
  styleUrls: ['./caparptprogramasis.component.css']
})
export class CaparptprogramasisComponent implements OnInit {

  public formBusquedad: FormGroup;
  public capaHistoriales: Procapacitacion[];
  public tipocaps: Tabladetalle[];
  public submitted = false;

  capaHistCol: string[] = ['Opciones','Empresa', 'Sede', 'Tema', 'Tipo', 'Motivo', 'FPro', 'FLimi', 'Estado'];
  capaHistData = new MatTableDataSource();

  @ViewChild('paginatorHistoriales', { static: true, read: MatPaginator }) paginatorHistoriales: MatPaginator;

  constructor(private procapacitacionService: ProcapacitacionService,
    private capacitacionService: CapacitacionService,
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

  onListProCapaByTipoAndFechas(codtipo: number, fechaini: string, fechafin: string){
    this.procapacitacionService.getAllProCapaByTipoAndFechas(codtipo, fechaini, fechafin, this.usuarioService.getUsuarioSession()).subscribe(
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

  onSearchFilter() {
    if (this.formBusquedad.invalid) {
      this.toastRejectAlert("Complete los parametros de Busqueda");
      return;
    }
    this.onListProCapaByTipoAndFechas(this.formBusquedad.get('codtipo').value,
      this.formBusquedad.get('fechaini').value,
      this.formBusquedad.get('fechafin').value)
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

  descargarPdf(programacion: Procapacitacion) {

    this.procapacitacionService.getPdfCapacitacionesByPrograma(programacion.id).subscribe(
      (result) => {
        const url = window.URL.createObjectURL(result);
        window.open(url);
      }, error => {
        console.log(error);
      }
    );
  }

  exportExcel(programacion: Procapacitacion) {

    this.procapacitacionService.getExcelPersCapaProgramada(programacion.id).subscribe(
      (result) => {
        const url = window.URL.createObjectURL(result);
        window.open(url);
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
  }

}
