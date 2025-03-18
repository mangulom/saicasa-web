import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Area } from 'src/app/models/area';
import { Tabladetalle } from 'src/app/models/tabladetalle';
import { Vacuxarea } from 'src/app/models/vacuxarea';
import { AreaService } from 'src/app/services/area.service';
import { TablaService } from 'src/app/services/tabla.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VacunacionService } from 'src/app/services/vacunacion.service';

@Component({
  selector: 'app-rptvaxarea',
  templateUrl: './rptvaxarea.component.html',
  styleUrls: ['./rptvaxarea.component.css']
})
export class RptvaxareaComponent implements OnInit {

  public vacunas: Vacuxarea[];

  public areas: Area[];
  public nomarea: string;
  public total: number;
  public tmpCodGrupo: number;

  public grupoareas: Tabladetalle[];

  public statusExport: boolean = false;

  public searhInputAsignar: string;

  grupoCol: string[] = ['Opciones', 'Descripcion'];
  grupoData = new MatTableDataSource();

  @ViewChild('paginatorgrupo', { static: true, read: MatPaginator }) paginatorgrupo: MatPaginator;

  @ViewChild('closeArea') modalArea: ElementRef;

  constructor(private vacunacionService: VacunacionService,
    private tablaService: TablaService,
    private usuarioService: UsuarioService,
    private areaService: AreaService) { }

  private closeModalArea(): void {
    this.modalArea.nativeElement.click();
  }

  onSelectGrupo(grupo: Tabladetalle) {
    
    this.vacunacionService.getReportxArea(grupo.id, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.vacunas = result;
        this.tmpCodGrupo = grupo.id;
        this.total = this.vacunas[0].total;
        this.nomarea = this.vacunas[0].grupo;
        this.statusExport = true;
        this.closeModalArea();
        console.log(result);
      }, error => {
        console.log(error);
      }
    );

   
  }

  onExportExcel() {
    this.vacunacionService.getFileExportArea(this.tmpCodGrupo, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        const url = window.URL.createObjectURL(result);
        window.open(url);
      }, error => {
        console.log(error);
      }
    );
  }

  onListGrupoAreas() {
    this.tablaService.getAllGrupoArea().subscribe(
      (result) => {
        this.grupoareas = result;
        this.grupoData.data = result;
        this.grupoData.paginator = this.paginatorgrupo;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
    this.onListGrupoAreas();
  }

}
