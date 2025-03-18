import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Detallecontrol } from 'src/app/models/detallecontrol';
import { Emo } from 'src/app/models/emo';
import { Tipocontrol } from 'src/app/models/tipocontrol';
import { EmoService } from 'src/app/services/emo.service';
import { TipocontrolService } from 'src/app/services/tipocontrol.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-emorptparanorma',
  templateUrl: './emorptparanorma.component.html',
  styleUrls: ['./emorptparanorma.component.css']
})
export class EmorptparanormaComponent implements OnInit {

  public formdetalle: FormGroup;

  public emos: Emo[];
  public searhInputProgramacion: string;
  public selectedBusqueda: string = "caducada";

  public showExportExcel: boolean  = false;

  public tipocontroles: Tipocontrol[];
  public detalleControles: Detallecontrol[];

  emoCol: string[] = ['Empresa', 'Sede', 'Fecha', 'Documento', 'ApePat', 'ApeMat', 'Nombres', 'TipoEva', 'Proveedor'];
  emoData = new MatTableDataSource();

  @ViewChild('paginatorEmos', { static: true, read: MatPaginator }) paginatorEmos: MatPaginator;

  constructor(private emoService: EmoService,
    private tipoControlService: TipocontrolService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef) { }

  onBuildSearchDetalle() {
    this.formdetalle = this.formBuilder.group({
      id: ['', Validators.required],
      codtipo: ['', Validators.required],
      fechaini: ['', Validators.required],
      fechafin: ['', Validators.required],
      usuario: ['']
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

  getAllTipoControles() {
    this.tipoControlService.getAllTipoControl().subscribe(
      (result) => {
        this.tipocontroles = result;
      }, error => {
        console.log(error);
      }
    );
  }

  getAllDetalleByTipo(id: number) {
    this.tipoControlService.getAllDetalleByTipo(id).subscribe(
      (result) => {
        this.detalleControles = result;
      }, error => {
        console.log(error);
      }
    );
  }

  onChangeTipoDetalle(event: any) {
    this.detalleControles = null;
    if (event != null && event != '') {
      this.getAllDetalleByTipo(event);
    }
    else {
      console.log("error de toma de dato");
    }
  }

  onSearchFilter() { 
      this.showExportExcel = false;
    if (this.formdetalle.invalid) {
      this.toastRejectAlert("Complete los parametros de Busqueda");
      this.showExportExcel = false;
      return;
    }

    if(this.usuarioService.getUsuarioSession()){

      this.formdetalle.get('usuario').setValue(this.usuarioService.getUsuarioSession());

      this.tipoControlService.ProcesoData(this.formdetalle.value).subscribe(
        (result) => {
          this.emos = result;

          if (result.length > 0) {
            this.emoData.data = result;
            this.emoData.paginator = this.paginatorEmos;
            this.showExportExcel = true;
          } else {
            this.emoData.data = result;
            this.emoData.paginator = this.paginatorEmos;
            this.showExportExcel = false;
          }

        }, error => {
          console.log(error);
        }
      );

    }

   
    
  }


  onExportDataExcel(){

    this.tipoControlService.getExcelParaemtrosNormalidad(
      this.formdetalle.get('id').value,
      this.formdetalle.get('codtipo').value,
      this.formdetalle.get('fechaini').value,
      this.formdetalle.get('fechafin').value, this.usuarioService.getUsuarioSession()).subscribe(
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
    this.onBuildSearchDetalle();
    //this.getAllEmoRealizados();
    this.getAllTipoControles();
  }

}
