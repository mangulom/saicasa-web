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
  selector: 'app-emorptinformed',
  templateUrl: './emorptinformed.component.html',
  styleUrls: ['./emorptinformed.component.css']
})
export class EmorptinformedComponent implements OnInit {

  public emos: Emo[];
  public searhInputProgramacion: string;
  public selectedBusqueda: string = "caducada";

  public formBusqueda: FormGroup;

  public evaluaciones: Tabladetalle[];

  emoCol: string[] = ['Opciones', 'Empresa', 'Sede', 'Fecha', 'Documento', 'ApePat', 'ApeMat', 'Nombres', 'TipoEva', 'Proveedor'];
  emoData = new MatTableDataSource();

  @ViewChild('paginatorEmos', { static: true, read: MatPaginator }) paginatorEmos: MatPaginator;

  constructor(private emoService: EmoService,
    private usuarioService: UsuarioService,
    private tablaService: TablaService,
    private formBuilder: FormBuilder) { }

  onBuildSearch() {
    this.formBusqueda = this.formBuilder.group({
      codtipo: ['', Validators.required],
      fechaini: ['', Validators.required],
      fechafin: ['', Validators.required]
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

  onListEvaluaciones() {
    this.tablaService.getAllTipEva().subscribe(
      (result) => {
        this.evaluaciones = result;
      }, error => {
        console.log(error);
      }
    );
  }

  onSearchFilter() {

    if (this.formBusqueda.invalid) {
      this.toastRejectAlert("Complete los parametros de Busqueda");
      return;
    }

    this.emoService.getAllEmoByCodTipoAndFechas(this.formBusqueda.get('codtipo').value,
      this.formBusqueda.get('fechaini').value,
      this.formBusqueda.get('fechafin').value, this.usuarioService.getUsuarioSession()).subscribe(
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

  descargarPdf(emo: Emo) {

    this.emoService.getPdfExamenMedico(emo.id).subscribe(
      (result) => {
        const url = window.URL.createObjectURL(result);
        window.open(url);
      }, error => {
        console.log(error);
      }
    );
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
    this.onBuildSearch();
    this.onListEvaluaciones();
    this.getAllEmoRealizados();
  }

}
