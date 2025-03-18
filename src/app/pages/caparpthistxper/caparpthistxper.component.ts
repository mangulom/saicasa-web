import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Capacitacion } from 'src/app/models/capacitacion';
import { CapacitacionService } from 'src/app/services/capacitacion.service';
import { PersonalService } from 'src/app/services/personal.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-caparpthistxper',
  templateUrl: './caparpthistxper.component.html',
  styleUrls: ['./caparpthistxper.component.css']
})
export class CaparpthistxperComponent implements OnInit {

  public formBusquedad: FormGroup;
  public formPersonal: FormGroup;

  public capaHistoriales: Capacitacion[];

  //BUSCAR PERSONAL
  public searhInputAsignar: string;
  public selectedBusquedaAsign: string = 'DNI';

  capaHistCol: string[] = ['Sede', 'Tema', 'Tipo', 'Motivo', 'FPro', 'FVig', 'Estado', 'Nota'];
  capaHistData = new MatTableDataSource();

  @ViewChild('paginatorHistoriales', { static: true, read: MatPaginator }) paginatorHistoriales: MatPaginator;

  constructor(private capacitacionService: CapacitacionService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder) { }


  onBuildFormBusqueda() {
    this.formBusquedad = this.formBuilder.group({
      dato: ['', Validators.required],
      busqueda: ['documento', Validators.required]
    });
  }

  onBuildFormPersonal() {
    this.formPersonal = this.formBuilder.group({
      nomarea: [''],
      numdocidentidad: [''],
      apepaterno: [''],
      apematerno: [''],
      nomtrabajador: ['']
    });
  }

  getAllCapaHistoryByPersonalDoc(filtro: string) {
    this.capacitacionService.getAllCapacitacionHistorialByPersonalDoc(filtro, this.usuarioService.getUsuarioSession()).subscribe(
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
    if (this.formBusquedad.get('busqueda').value == "documento") {
      this.getAllCapaHistoryByPersonalDoc(this.formBusquedad.get('dato').value)

    } else {
      this.onResetList();
    }
  }

  onResetList(){
    this.capaHistoriales = [];
    this.capaHistData.data = [];
    this.capaHistData.paginator = this.paginatorHistoriales;
  }

 // REPORTE

  descargarRptCapaHist() {

    if (this.formBusquedad.invalid) {
      this.toastRejectAlert("Complete los parametros de Busqueda");
      return;
    }

    if (this.formBusquedad.get('busqueda').value == "documento") {

      this.capacitacionService.getExcelCapaHistxPersona(this.formBusquedad.get('dato').value, this.usuarioService.getUsuarioSession()).subscribe(
        (result) => {
          const url = window.URL.createObjectURL(result);
          window.open(url);
        }, error => {
          console.log(error);
        }
      );
    }
    
  }

  //VARIABLES

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
    this.onBuildFormPersonal();
  }

}
