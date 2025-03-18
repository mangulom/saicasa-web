import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Empresa } from 'src/app/models/empresa';
import { Personal } from 'src/app/models/personal';
import { Sucursal } from 'src/app/models/sucursal';
import { Tabladetalle } from 'src/app/models/tabladetalle';
import { Vacunacion } from 'src/app/models/vacunacion';
import { EmpresaService } from 'src/app/services/empresa.service';
import { PersonalService } from 'src/app/services/personal.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import { TablaService } from 'src/app/services/tabla.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VacunacionService } from 'src/app/services/vacunacion.service';

@Component({
  selector: 'app-rptvaxper',
  templateUrl: './rptvaxper.component.html',
  styleUrls: ['./rptvaxper.component.css']
})
export class RptvaxperComponent implements OnInit {

  public formPersonal: FormGroup;

  public personal: Personal = new Personal();
  public personales: Personal[];
  public personalAsignados: Personal[] = [];

  public listadoVacunas : Vacunacion[][] = new Array<Vacunacion[]>();

  public desPdf : boolean = false;
  public documentotmp: string;

  //BUSCAR PERSONAL
  public searhInputAsignar: string;
  public selectedBusquedaAsign: string = 'DNI';

  personalAsignarCol: string[] = ['Nombre', 'DNI', 'Cargo'];
  personalAsignarData = new MatTableDataSource<Personal>();
  selection = new SelectionModel<Personal>(true, []);

  vacunasCol: string[] = ['Dosis', 'Fecha', 'Lote', 'Vacunador'];
  vacunasData = new MatTableDataSource<Vacunacion[]>();

  @ViewChild('paginatorpersonalAsignar', { static: true, read: MatPaginator }) paginatorpersonalAsignar: MatPaginator;
  @ViewChild('closePersonal') modalPersonal: ElementRef;


  constructor(private vacunacionService: VacunacionService,
    private empresaService: EmpresaService,
    private sucursalService: SucursalService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private tablaService: TablaService,
    private personalService: PersonalService,
    private changeDetectorRefs: ChangeDetectorRef) { }


  onBuildFormPersonal() {
    this.formPersonal = this.formBuilder.group({
      codempresa: [''],
      codpersonal: null, 
      codsucursal: [''],
      numverareas: [''],
      codareas: [''],
      desareas: [''],
      nomarea: [''],
      nomtrabajador: [''],
      apepaterno: [''],
      apematerno: [''],
      tipdocidentidad: [''],
      numdocidentidad: [''],
      numemail: [''],
      numtelefono: [''],
      codcategoria: [''],
      codcargo: [''],
      descargo: [''],
      nomcargo: [''],
      fecnacimiento: [''],
      tipsexo: [''],
      codtipoplanilla: ['']
    });
  }

  onListTipoVacuna(personal: Personal) {
    
    this.vacunacionService.getAllVacunacionByPersona(personal.codempresa, personal.codpersonal).subscribe(
      (result) => {
        if (result.length>0){
          this.listadoVacunas = result;
          this.desPdf = true;
        }

      }, error => {
        console.log(error);
      }
    );

  }

  descargarPdf() {
    
    this.vacunacionService.getPdf(this.documentotmp, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        const url = window.URL.createObjectURL(result);
        window.open(url);
      }, error => {
        console.log(error);
      }
    );
  }

  onListPersonalTop() {
    this.personalService.getAllPersonalTop().subscribe(
      (result) => {
        this.personales = result;
        this.personalAsignarData.data = result;
        this.personalAsignarData.paginator = this.paginatorpersonalAsignar;
      }, error => {
        console.log(error);
      }
    );
  }

  onFindPersonalByDoc(documento: string) {
    this.personalService.getPersonalByDoc(documento, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.personal = result;
        if(this.personal != null){
          this.documentotmp = result.numdocidentidad;
          this.onListTipoVacuna(result);
        }else{
          this.desPdf = false;
          this.listadoVacunas = [];
        }
        
      }, error => {
        this.desPdf = false;
        console.log(error);
      }
    );
  }

  onSearchPersonalAsignar() {
    this.selection.clear();
    console.log(this.searhInputAsignar);
    if (this.searhInputAsignar != null) {

      if (this.searhInputAsignar.trim() != '') {
        if (this.selectedBusquedaAsign == "DNI") {         
          this.onFindPersonalByDoc(this.searhInputAsignar);
          //this.onListPersonalDispVacuFiltroDni(this.searhInputAsignar, this.codigoProgram);
        } else {
          
          //this.onListPersonalDispVacuFiltroArea(this.searhInputAsignar, this.codigoProgram);
        }
      } else {
        //this.onListPersonalAsignar(this.codigoProgram);
      }
    } else {
      //this.onListPersonalAsignar(this.codigoProgram);
      
    }
  }

  

  ngOnInit(): void {
    
   
  }

}
