import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Area } from 'src/app/models/area';
import { Dato } from 'src/app/models/dato';
import { Empresa } from 'src/app/models/empresa';
import { Personal } from 'src/app/models/personal';
import { Sucursal } from 'src/app/models/sucursal';
import { Tabladetalle } from 'src/app/models/tabladetalle';
import { Vacunacion } from 'src/app/models/vacunacion';
import { AreaService } from 'src/app/services/area.service';
import { DatoService } from 'src/app/services/dato.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { PersonalService } from 'src/app/services/personal.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import { TablaService } from 'src/app/services/tabla.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VacunacionService } from 'src/app/services/vacunacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vacunopro',
  templateUrl: './vacunopro.component.html',
  styleUrls: ['./vacunopro.component.css']
})
export class VacunoproComponent implements OnInit {

  public formVacunacion: FormGroup;
  public submittedVacunacion = false;
  public isUpdate = false;

  public vacunacion: Vacunacion = new Vacunacion();
  public vacunaciones: Vacunacion[];

  public personal: Personal = new Personal();
  public personales: Personal[];

  public empresas: Empresa[];
  public sucursales: Sucursal[];
  public tipoVacunas: Tabladetalle[];
  public vacunadores: Tabladetalle[];
  public zonas: Tabladetalle[];

  public personalAsignados: Personal[] = [];

  public areas: Area[];
  public nomarea: string;

  public dato: Dato = new Dato();

  //BUSCAR PERSONAL
  public searhInputAsignar: string;
  public selectedBusquedaAsign: string = 'DNI';

  personalAsignarCol: string[] = ['select', 'Nombre', 'DNI', 'Cargo'];
  personalAsignarData = new MatTableDataSource<Personal>();
  selection = new SelectionModel<Personal>(true, []);

  vacunacionCol: string[] = ['Opciones','DNI', 'ApePaterno', 'ApeMaterno', 'Nombres', 'TipVacu', 'Fecha', 'Lote', 'Vacunador'];
  vacunacionData = new MatTableDataSource();

  areasCol: string[] = ['Opciones', 'Descripcion'];
  areasData = new MatTableDataSource();

  @ViewChild('paginatorVacunacion', { static: true, read: MatPaginator }) paginatorVacunacion: MatPaginator;
  @ViewChild('paginatorpersonalAsignar', { static: true, read: MatPaginator }) paginatorpersonalAsignar: MatPaginator;
  @ViewChild('paginatorareas', { static: true, read: MatPaginator }) paginatorareas: MatPaginator;

  @ViewChild('closePersonal') modalPersonal: ElementRef;
  @ViewChild('closePrincipal') SubModalPrincipal: ElementRef;
  @ViewChild('closeArea') modalArea: ElementRef;

  constructor(private vacunacionService: VacunacionService,
    private personalService: PersonalService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private datoService: DatoService,
    private empresaService: EmpresaService,
    private sucursalService: SucursalService,
    private tablaService: TablaService,
    private areaService: AreaService,
    private changeDetectorRefs: ChangeDetectorRef) { }

  private closePrincipal(): void {
    this.SubModalPrincipal.nativeElement.click();
  }

  private closeModalPersonal(): void {
    this.modalPersonal.nativeElement.click();
  }

  private closeModalArea(): void {
    this.modalArea.nativeElement.click();
  }

  get g() {
    return this.formVacunacion.controls;
  }

  onBuildFormVacunacion() {
    this.formVacunacion = this.formBuilder.group({
      id: [''],
      codigo: [''],
      codempresa: [''],
      sede: [''],
      codprogram: [''],
      codempresapers: [''],
      codpersonal: [''],
      codtipovacuna: ['', Validators.required],
      fechavacuna: ['', Validators.required],
      lotevacuna: ['', Validators.required],
      codvacunador: ['', Validators.required],
      codestado: [''],
      flatcartilla: [''],
      observacion: [''],
      nombrepersonal: [''],
      personales: [''],
      codempresaarea: [''],
      numverareas: [''],
      codareas: [''],
      nomarea: [''],
      codzona: ['', Validators.required],
      horario: ['', Validators.required],
      numdocidentidad: [''],
      apepaterno: [''],
      apematerno: [''],
      nomtrabajador: [''],
      isupdate: [false]
    });
  }

  onSubmit() {
    this.submittedVacunacion = true;
    if (this.formVacunacion.invalid) {
      return;
    }
    Swal.fire({
      title: 'Advertencia',
      text: `¿Esta seguro que desea guardar?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#17a2b8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Guardar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {

        console.log(this.formVacunacion.value);
        console.log(this.selection.selected);

        if (this.personalAsignados.length < 1 && this.formVacunacion.get("isupdate").value == false) {
          this.toastRejectAlert("No hay personal seleccionao");
        }else{
          this.vacunacionService.saveNoProgramados(this.formVacunacion.value).subscribe(
            (result) => {
              if (result) {
                this.selection.clear();
                this.onListPersonalVacunadoNoProgramado();
                //this.onListPersonalTop();
                this.changeDetectorRefs.detectChanges();
                this.toastAcceptedAlert("Se registro con exito");
                this.onResetFormVacunacion();
                this.closePrincipal();
              } else {
                this.closePrincipal();
              }
            }, error => {
              console.log(error);
            }
          );

        }
      }
    })
  }

  onUpdate(vacuna: Vacunacion){
    this.isUpdate = true;

    this.vacunacionService.getVacunacionById(vacuna.id).subscribe(
      (result) => {

        this.vacunacion = result;
        console.log(this.vacunacion);

        this.formVacunacion.patchValue({
          id: this.vacunacion.id,
          codigo: this.vacunacion.codigo,
          codempresa: this.vacunacion.codempresa,
          sede: this.vacunacion.sede,
          codprogram: this.vacunacion.codprogram,
          codempresapers: this.vacunacion.codempresapers,
          codpersonal: this.vacunacion.codpersonal,
          codtipovacuna: this.vacunacion.codtipovacuna,
          fechavacuna: this.vacunacion.fechavacuna,
          lotevacuna: this.vacunacion.lotevacuna,
          codvacunador: this.vacunacion.codvacunador,
          codestado: this.vacunacion.codestado,
          flatcartilla: this.vacunacion.flatcartilla,
          observacion: this.vacunacion.observacion,
          nombrepersonal: this.vacunacion.personal.nomtrabajador,
          personales: null,
          codempresaarea: this.vacunacion.codempresaarea,
          numverareas: this.vacunacion.numverareas,
          codareas: this.vacunacion.personal.codareas,
          nomarea: this.vacunacion.personal.desareas,
          codzona: this.vacunacion.codzona,
          horario: this.vacunacion.horario,
          numdocidentidad: this.vacunacion.personal.numdocidentidad,
          apepaterno: this.vacunacion.personal.apepaterno,
          apematerno: this.vacunacion.personal.apematerno,
          nomtrabajador: this.vacunacion.personal.nomtrabajador,
          isupdate: true
        });
        
      }, error => {
        console.log(error);
      }
    );

  }

  deleteById(vacunacion: Vacunacion){
    Swal.fire({
      title: 'Advertencia',
      text: `¿Esta seguro que desea Eliminar el Registro?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#17a2b8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {
        this.vacunacionService.deleteVacunacion(vacunacion.id).subscribe(
          (result) => {
            this.onListPersonalVacunadoNoProgramado();
            this.changeDetectorRefs.markForCheck();
          }, error => {
            console.log(error);
          }
        );
      }
    })
    
  }

  onResetFormVacunacion() {
    this.isUpdate = false;
    this.submittedVacunacion = false;
    this.formVacunacion.reset();
    this.selection.clear();
    this.formVacunacion.get('fechavacuna').setValue(this.dato.fecha);
    this.personalAsignados = [];
    this.formVacunacion.get('isupdate').setValue(false);
    this.searhInputAsignar = "";
    this.personalAsignarData.data = [];
  }

  toastAcceptedAlert(mensaje: string) {
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
      icon: 'success',
      title: mensaje
    })
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

  onListPersonalVacunadoNoProgramado() {
    this.vacunacionService.getAllPersonalVacunadosNoProgramados(this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.vacunaciones = result;
        this.vacunacionData.data = result;
        this.vacunacionData.paginator = this.paginatorVacunacion;
        console.log(this.vacunaciones);
      }, error => {
        console.log(error);
      }
    );
  }

  onListPersonalByDoc(documento: string) {
    this.personalService.getAllPersonalByDoc(documento, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.personales = result;
        this.personalAsignarData.data = result;
        this.personalAsignarData.paginator = this.paginatorpersonalAsignar;
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

  onSearchPersonalAsignar() {
    this.selection.clear();
    console.log(this.searhInputAsignar);
    if (this.searhInputAsignar != null) {

      if (this.searhInputAsignar.trim() != '') {
        if (this.selectedBusquedaAsign == "DNI") {         
          this.onListPersonalByDoc(this.searhInputAsignar);
          //this.onListPersonalDispVacuFiltroDni(this.searhInputAsignar, this.codigoProgram);
        } else {
          
          //this.onListPersonalDispVacuFiltroArea(this.searhInputAsignar, this.codigoProgram);
        }
      } else {
        //this.onListPersonalAsignar(this.codigoProgram);
        //this.onListPersonalTop();
      }
    } else {
      //this.onListPersonalAsignar(this.codigoProgram);
      //this.onListPersonalTop();
    }
  }

  onListEmpresa() {
    this.empresaService.getAllEmpresa().subscribe(
      (result) => {
        this.empresas = result;
        console.log(result);
        //this.empresaData.data =  result;
        //this.empresaData.paginator = this.paginatorEmpresa;
        this.onListSucursalEmpresa(result[0].codempresa);
      }, error => {
        console.log(error);
      }
    );
  }

  onListSucursalEmpresa(codempresa: string) {
    this.sucursalService.getAllSucursalByEmpresa(codempresa).subscribe(
      (result) => {
        this.sucursales = result;
        //console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }


  onChangeEmpresaSucursal(event: any) {
    this.sucursales = null;
    if (event != null && event != '') {
      this.onListSucursalEmpresa(event);
    }
    else {
      console.log("error de toma de dato");
    }
  }

  onListTipoVacuna() {
    this.tablaService.getAllTipoVacuna().subscribe(
      (result) => {
        this.tipoVacunas = result;
      }, error => {
        console.log(error);
      }
    );
  }


  onListVacunador() {
    this.tablaService.getAllVacunador().subscribe(
      (result) => {
        this.vacunadores = result;
      }, error => {
        console.log(error);
      }
    );
  }

  onListZona() {
    this.tablaService.getAllZonaVacu().subscribe(
      (result) => {
        this.zonas = result;
      }, error => {
        console.log(error);
      }
    );
  }

  onListAreas() {
    this.areaService.getAllAreas().subscribe(
      (result) => {
        this.areas = result;
        this.areasData.data = result;
        this.areasData.paginator = this.paginatorareas;
        //console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.personalAsignarData.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.personalAsignarData.data.forEach(row => this.selection.select(row));
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(personal?: Personal): string {
    if (!personal) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(personal) ? 'deselect' : 'select'} row ${personal.codpersonal + 1}`;
  }

  selectAreaVacuancion(area: Area) {
    this.formVacunacion.get('nomarea').setValue(area.desareas);
    this.formVacunacion.get('codempresaarea').setValue(area.codempresa);
    this.formVacunacion.get('numverareas').setValue(area.numverareas);
    this.formVacunacion.get('codareas').setValue(area.codareas);
    this.closeModalArea();

  }

  isSelected() {
    this.personalAsignados = [];
    this.selection.selected.forEach(
      x => this.personalAsignados.push(x)
    )
    this.formVacunacion.get('personales').setValue(this.personalAsignados);
    if (this.personalAsignados.length == 1) {

      this.formVacunacion.get('codempresa').setValue(this.personalAsignados[0].codempresa);
      this.formVacunacion.get('sede').setValue(this.personalAsignados[0].codsucursal);
      this.formVacunacion.get('numdocidentidad').setValue(this.personalAsignados[0].numdocidentidad);
      this.formVacunacion.get('apepaterno').setValue(this.personalAsignados[0].apepaterno);
      this.formVacunacion.get('apematerno').setValue(this.personalAsignados[0].apematerno);
      this.formVacunacion.get('nomtrabajador').setValue(this.personalAsignados[0].nomtrabajador);

      this.formVacunacion.get('codempresaarea').setValue(this.personalAsignados[0].codempresa);
      this.formVacunacion.get('numverareas').setValue(this.personalAsignados[0].numverareas);
      this.formVacunacion.get('codareas').setValue(this.personalAsignados[0].codareas);
      this.formVacunacion.get('nomarea').setValue(this.personalAsignados[0].desareas);
   
    }
  }

  onShowDatos() {
    this.datoService.getDatos().subscribe(
      (result) => {
        this.dato = result;
      }, error => {
        console.log(error);
      }

    );
  }


  ngOnInit(): void { 
    this.onBuildFormVacunacion();
    this.onListPersonalVacunadoNoProgramado();
    //this.onListPersonalTop();
    this.onListEmpresa();
    this.onListAreas();
    this.onListTipoVacuna();
    this.onListVacunador();
    this.onListZona();
    this.onShowDatos();
  }

}
