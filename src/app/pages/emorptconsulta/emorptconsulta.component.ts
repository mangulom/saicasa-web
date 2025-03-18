import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Emo } from 'src/app/models/emo';
import { Tabladetalle } from 'src/app/models/tabladetalle';
import { EmoService } from 'src/app/services/emo.service';
import { TablaService } from 'src/app/services/tabla.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-emorptconsulta',
  templateUrl: './emorptconsulta.component.html',
  styleUrls: ['./emorptconsulta.component.css']
})
export class EmorptconsultaComponent implements OnInit {

  public formBusquedad: FormGroup;

  public emos: Emo[];
  public estados: Tabladetalle[];
  public searhInputProgramacion: string;
  public selectedBusqueda: string = "documento";

  public exporDataPers: boolean = false;
  public exporDataProvee: boolean = false;

  emoCol: string[] = ['Empresa', 'Sede', 'Fecha', 'Documento', 'ApePat', 'ApeMat', 'Nombres', 'TipoEva', 'Proveedor', 'Aptitud'];
  emoData = new MatTableDataSource();

  @ViewChild('paginatorEmos', { static: true, read: MatPaginator }) paginatorEmos: MatPaginator;

  constructor(private emoService: EmoService,
    private usuarioService: UsuarioService,
    private tablaService: TablaService,
    private formBuilder: FormBuilder) { }
    

    onBuildFormBusqueda() {
      this.formBusquedad = this.formBuilder.group({
        dato: ['', Validators.required],
        codigo: ['',  Validators.required],
        busqueda: ['documento',  Validators.required]
      });
    }

  getAllEmoRealizados() {
    this.emoService.getAllEmoRealizados(this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.emos = result;
        this.emoData.data = result;
        this.emoData.paginator = this.paginatorEmos;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  getAllEmoByPersonalDocAndEstado(documento: string, estado: number) {
    this.emoService.getAllVacunacionByPersonalDocAndEstado(documento, estado, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.emos = result;
        this.emoData.data = result;
        this.emoData.paginator = this.paginatorEmos;
        if (result.length > 0 ){
          this.exporDataPers = true;
          this.exporDataProvee = false;
        }else{
          this.exporDataPers = false;
          this.exporDataProvee = false;
        }
        
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  getAllEmoByProveedorAndEstado(nombre: string, estado: number) {
    this.emoService.getAllVacunacionByProveedorAndEstado(nombre, estado, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.emos = result;
        this.emoData.data = result;
        this.emoData.paginator = this.paginatorEmos;

        if (result.length > 0) {
          this.exporDataPers = false;
          this.exporDataProvee = true;
        }else{
          this.exporDataPers = false;
          this.exporDataProvee = false;
        }

        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  getAllEstadoEmo() {
    this.tablaService.getAllEstadoProgramEmo().subscribe(
      (result) => {
        this.estados = result;
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
      //this.onListEmoVigenciaCaducada();
      this.getAllEmoByPersonalDocAndEstado(this.formBusquedad.get('dato').value,
      this.formBusquedad.get('codigo').value)
       
    } else {
      this.getAllEmoByProveedorAndEstado(this.formBusquedad.get('dato').value,
      this.formBusquedad.get('codigo').value)
     
    }

  }

  onExportExcelPersonal(){
    if (this.formBusquedad.invalid) {
      this.toastRejectAlert("Complete los parametros de Busqueda");
      return;
    }
    this.emoService.getExcelEmoByPersonalDocAndEstado(this.formBusquedad.get('dato').value,
    this.formBusquedad.get('codigo').value, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        const url = window.URL.createObjectURL(result);
        window.open(url);
      }, error => {
        console.log(error);
      }
    );
  }

  onExportExcelProveedor(){
    if (this.formBusquedad.invalid) {
      this.toastRejectAlert("Complete los parametros de Busqueda");
      return;
    }
    this.emoService.getExcelEmoByProveedorAndEstado(this.formBusquedad.get('dato').value,
    this.formBusquedad.get('codigo').value, this.usuarioService.getUsuarioSession()).subscribe(
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
    this.getAllEstadoEmo();

    //this.getAllEmoRealizados();
  }

}
