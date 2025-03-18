import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Emo } from 'src/app/models/emo';
import { EmoService } from 'src/app/services/emo.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-emosemaforo',
  templateUrl: './emosemaforo.component.html',
  styleUrls: ['./emosemaforo.component.css']
})
export class EmosemaforoComponent implements OnInit {

  public emos: Emo[];
  public searhInputProgramacion : string;
  public selectedBusqueda: string = "caducada";

  emoCol: string[] = ['Empresa', 'Sede', 'Fecha', 'Documento', 'ApePat', 'ApeMat', 'Nombres', 'TipoEva', 'Proveedor'];
  emoData = new MatTableDataSource();

  @ViewChild('paginatorEmos', { static: true, read: MatPaginator }) paginatorEmos: MatPaginator;

  constructor(private emoService: EmoService,
    private usuarioService: UsuarioService,
    private changeDetectorRefs: ChangeDetectorRef) { }

  onListEmoVigenciaCaducada() {
    this.emoService.getAllEmoVigenciaCaducada(this.usuarioService.getUsuarioSession()).subscribe(
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

  onListEmoProgramacionVencida() {
    this.emoService.getAllEmoProgramacionVencida(this.usuarioService.getUsuarioSession()).subscribe(
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

  onResetList(){

  }


  onSearchFilter() {

    if (this.selectedBusqueda == "caducada") { 
      this.onListEmoVigenciaCaducada();
    }else{
      this.onListEmoProgramacionVencida();
    }

  }

  ngOnInit(): void {
  }

}
