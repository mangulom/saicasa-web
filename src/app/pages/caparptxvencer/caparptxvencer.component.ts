import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Capacitacion } from 'src/app/models/capacitacion';
import { CapacitacionService } from 'src/app/services/capacitacion.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-caparptxvencer',
  templateUrl: './caparptxvencer.component.html',
  styleUrls: ['./caparptxvencer.component.css']
})
export class CaparptxvencerComponent implements OnInit {

  public formBusquedad: FormGroup;
  public capaHistoriales: Capacitacion[];

  public exportXVencerCapaTodos: boolean = false;
  public exportXVencerCapaSinVencido : boolean = false;
  public exportXVencerSoloVencido: boolean = false;

  capaHistCol: string[] = ['Sede', 'ApePat', 'ApeMat', 'Nombre', 'DNI', 'Tema', 'Tipo', 'Motivo', 'FPro'];
  capaHistData = new MatTableDataSource();

  @ViewChild('paginatorHistoriales', { static: true, read: MatPaginator }) paginatorHistoriales: MatPaginator;

  constructor(private capacitacionService: CapacitacionService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder) { }

  onBuildFormBusqueda() {
    this.formBusquedad = this.formBuilder.group({
      busqueda: ['todos', Validators.required]
    });
  }


  onListCapacitacionAntesVencer() {
    //TODOS
    this.capacitacionService.getAllCapacitacionAntesVencer(this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.capaHistoriales = result;
        this.capaHistData.data = result;
        this.capaHistData.paginator = this.paginatorHistoriales;

        if(result){
          this.exportXVencerCapaTodos = true;
          this.exportXVencerCapaSinVencido  = false;
          this.exportXVencerSoloVencido = false;
        }else{
          this.exportXVencerCapaTodos = false;
          this.exportXVencerCapaSinVencido  = false;
          this.exportXVencerSoloVencido = false;
        }

        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onListCapacitacionAntesVencerSinVencido() {
    this.capacitacionService.getAllCapacitacionAntesVencerSinVencido(this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.capaHistoriales = result;
        this.capaHistData.data = result;
        this.capaHistData.paginator = this.paginatorHistoriales;

        if(result){
          this.exportXVencerCapaTodos = false;
          this.exportXVencerCapaSinVencido  = true;
          this.exportXVencerSoloVencido = false;
        }else{
          this.exportXVencerCapaTodos = false;
          this.exportXVencerCapaSinVencido  = false;
          this.exportXVencerSoloVencido = false;
        }

        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }


  onListCapacitacionAntesVencerVencido() {
    this.capacitacionService.getAllCapacitacionAntesVencerVencido(this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.capaHistoriales = result;
        this.capaHistData.data = result;
        this.capaHistData.paginator = this.paginatorHistoriales;

        if(result){
          this.exportXVencerCapaTodos = false;
          this.exportXVencerCapaSinVencido  = false;
          this.exportXVencerSoloVencido = true;
        }else{
          this.exportXVencerCapaTodos = false;
          this.exportXVencerCapaSinVencido  = false;
          this.exportXVencerSoloVencido = false;
        }

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

    if (this.formBusquedad.get('busqueda').value == "todos") {
      this.onListCapacitacionAntesVencer();
    }
    if (this.formBusquedad.get('busqueda').value == "porven") {
      this.onListCapacitacionAntesVencerSinVencido();
    }
    if (this.formBusquedad.get('busqueda').value == "vencidos") {
      this.onListCapacitacionAntesVencerVencido();
    }

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

  onExportExcelCapaByPorVencerTodos(){
   
    this.capacitacionService.getExceCapaByPorVencerTodos(this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        const url = window.URL.createObjectURL(result);
        window.open(url);
      }, error => {
        console.log(error);
      }
    );
  }

  onExportExcelCapaByPorVencerSinVencido(){
   
    this.capacitacionService.getExceCapaByPorVencerSinVencido(this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        const url = window.URL.createObjectURL(result);
        window.open(url);
      }, error => {
        console.log(error);
      }
    );
  }

  
  onExportExcelCapaByVencidoSoloVencido(){

    this.capacitacionService.getExceCapaByVencidoSoloVencido(this.usuarioService.getUsuarioSession()).subscribe(
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
  }

}
