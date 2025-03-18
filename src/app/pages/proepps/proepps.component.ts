import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Empresa } from 'src/app/models/empresa';
import { Epps } from 'src/app/models/epps';
import { Personal } from 'src/app/models/personal';
import { Proepps } from 'src/app/models/proepps';
import { Sucursal } from 'src/app/models/sucursal';
import { Programdetepps } from 'src/app/models/programdetepps';
import { Tabladetalle } from 'src/app/models/tabladetalle';
import { EmpresaService } from 'src/app/services/empresa.service';
import { EppsService } from 'src/app/services/epps.service';
import { PersonalService } from 'src/app/services/personal.service';
import { ProeppsService } from 'src/app/services/proepps.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import { TablaService } from 'src/app/services/tabla.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ProgramdeteppsService } from 'src/app/services/programdetepps.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proepps',
  templateUrl: './proepps.component.html',
  styleUrls: ['./proepps.component.css']
})
export class ProeppsComponent implements OnInit {

  public formBusquedad: FormGroup;
  public formProEpps: FormGroup;
  public formProEppsObjeto: FormGroup;
  public submittedProEpps = false;
  public submittedAsignarEpp = false;
  public codigoProgram: number;
  public codigoProgramDetEpps: number;

  public proEpps: Proepps = new Proepps();
  public proDetEpps: Programdetepps = new Programdetepps();
  public listProgramDetEpps: Programdetepps[];
  public listProEpps: Proepps[];
  public listEpps : Epps[];
  public empresas: Empresa[];
  public sucursales: Sucursal[];
  public tiposEpps: Tabladetalle[];

  public searhInputAsignarRes: string;
  public selectedBusquedaAsignRes: string = 'Documento';

  proEppsCol: string[] = ['Opciones', 'Empresa', 'Sede', 'FechaPro', 'Estado'];
  proEppsData = new MatTableDataSource();
  responsableCol: string[] = ['Opciones', 'Nombre', 'DNI', 'Cargo'];
  responsableData = new MatTableDataSource();
  proDetEppsCol: string[] = ['Opciones', 'Tipo', 'Nombre'];
  proDetEppsData = new MatTableDataSource();

  @ViewChild('paginatorresponsable', { static: true, read: MatPaginator }) paginatorresponsable: MatPaginator;
  @ViewChild('paginatorProEpps', { static: true, read: MatPaginator }) paginatorProEpps: MatPaginator;
  @ViewChild('paginatorProDetEpps', { static: true, read: MatPaginator }) paginatorProDetEpps: MatPaginator;

  @ViewChild('closebutton') modalProEpps: ElementRef;
  @ViewChild('closebuttonRes') modalRes: ElementRef;

  constructor(private proEppsService: ProeppsService,
    private eppsService: EppsService,
    private programDetEppsService: ProgramdeteppsService,
    private empresaService: EmpresaService,
    private sucursalService: SucursalService,
    private usuarioService: UsuarioService,
    private tablaService: TablaService,
    private personalService: PersonalService,
    private formBuilder: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef) { }

  private closeModal(): void {
    this.modalProEpps.nativeElement.click();
  }

  get f() {
    return this.formProEpps.controls;
  }

  onResetFormProEpps() {
    this.submittedProEpps = false;
    this.formProEpps.reset();
  }

  onBuildFormProEpps() {
    this.formProEpps = this.formBuilder.group({
      id: [''],
      codigo: [''],
      codempresa: ['', Validators.required],
      sede: ['', Validators.required],
      fechaprogram: ['', Validators.required],
      fechavigencia: ['', Validators.required],
      codestado: [''],
      codempresares: [''],
      codpersonalres: [''],
      nombreresp: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submittedProEpps = true;
    if (this.formProEpps.invalid) {
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

        this.proEppsService.saveProEpps(this.formProEpps.value).subscribe(
          (result) => {
            if (result) {
              this.onResetFormProEpps();
              this.onListProEpps();
              this.changeDetectorRefs.detectChanges();
              this.toastAcceptedAlert("Se registro con exito");
              this.closeModal();
            } else {
              this.closeModal();
            }
          }, error => {
            console.log(error);
          }
        );

      }
    })
  }

  onUpdateProEpps(proEpps: Proepps) {
    this.proEppsService.getProEppsById(proEpps.id).subscribe(
      (result) => {
        console.log(result);
        this.proEpps = result;        
        this.formProEpps.patchValue({
          id: result.id,
          codigo: result.codigo,
          codempresa: result.codempresa,
          sede: result.sede,
          fechaprogram: result.fechaprogram,
          fechavigencia: result.fechavigencia,
          codestado: result.codestado,
          codempresares: result.codempresares,
          codpersonalres: result.codpersonalres,
          nombreresp: result.nombreresp
        });

      }, error => {
        console.log(error);
      }
    );
  }

  onSearchPersonalResponsable() {
    if (this.searhInputAsignarRes != null) {
      if (this.searhInputAsignarRes.trim() != '') {
        if (this.selectedBusquedaAsignRes == "Documento") {
          this.onListPersonalByDoc(this.searhInputAsignarRes);
        }
        if (this.selectedBusquedaAsignRes == "Nombres") {
          this.onListPersonalByNombreLike(this.searhInputAsignarRes);
        }
      } else {
        this.onListResponsablePersonal();
      }
    } else {
      this.onListResponsablePersonal();
    }
  }

  selectResponsable(personal: Personal) {

    this.personalService.getPersonalByEmpresaAndPersonal(personal.codempresa, personal.codpersonal).subscribe(
      (result) => {
        this.formProEpps.get('nombreresp').setValue(result.apepaterno + " " + result.apematerno + " " + result.nomtrabajador);
        this.formProEpps.get('codempresares').setValue(result.codempresa);
        this.formProEpps.get('codpersonalres').setValue(result.codpersonal);
        console.log(result);
        this.changeDetectorRefs.markForCheck();
      }, error => {
        console.log(error);
      }
    );

    this.closeModalResponsable();
  }

  private closeModalResponsable(): void {
    this.modalRes.nativeElement.click();
  }

  onListPersonalByDoc(documento: string) {
    this.personalService.getAllPersonalByDoc(documento, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.responsableData.data = result;
        this.responsableData.paginator = this.paginatorresponsable;
      }, error => {
        console.log(error);
      }
    );
  }

  onListPersonalByNombreLike(search: string) {
    this.personalService.getAllPersonalByNombreLike(search, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.responsableData.data = result;
        this.responsableData.paginator = this.paginatorresponsable;
      }, error => {
        console.log(error);
      }
    );
  }

  onListResponsablePersonal() {
    this.personalService.getAllPersonalTop().subscribe(
      (result) => {

        this.responsableData.data = result;
        this.responsableData.paginator = this.paginatorresponsable;
        //console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onResetFormProEppsObjeto() {
    this.formProEppsObjeto.reset();
  }

  onBuildFormProEppsObjeto() {
    this.formProEppsObjeto = this.formBuilder.group({
      id: [''],
      codprogram: [''],
      idtipo: [''],
      codepps: ['']
    });
  }

  onSubmitAsignarEpp() {
    this.formProEppsObjeto.get('codprogram').setValue(this.codigoProgramDetEpps);
    this.programDetEppsService.saveProEpps(this.formProEppsObjeto.value).subscribe(
      (result) => {
        if (result) {
            this.onResetFormProEppsObjeto();
            this.onAsignarEppsList(result.codprogram);
            this.changeDetectorRefs.detectChanges();
            this.toastAcceptedAlert("Se registro con exito");
        }
      }, error => {
        console.log(error);
      }
    );

  }

  deleteProgramDetEpps(programDetEpps: Programdetepps){
    this.programDetEppsService.deleteProEppsById(programDetEpps.id).subscribe(
      (result) => {
        this.onAsignarEppsList(programDetEpps.codprogram);
        this.changeDetectorRefs.markForCheck();
      }, error => {
        console.log(error);
        console.clear();
      }
    );
  }

  //EPPS
  onAsignarEpps(proEpps: Proepps) {
    this.codigoProgramDetEpps = proEpps.id;
    this.programDetEppsService.getAllprogramDetEppsByCodProgram(proEpps.id).subscribe(
      (result) => {
        console.log(result);
        this.listProgramDetEpps = result;
        this.proDetEppsData.data = result;
        this.proDetEppsData.paginator = this.paginatorProDetEpps;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onAsignarEppsList(codprogram: number) {
    this.codigoProgramDetEpps = codprogram;
    this.programDetEppsService.getAllprogramDetEppsByCodProgram(codprogram).subscribe(
      (result) => {
        console.log(result);
        this.listProgramDetEpps = result;
        this.proDetEppsData.data = result;
        this.proDetEppsData.paginator = this.paginatorProDetEpps;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  //LISTADOS
  onListProEpps() {
    this.proEppsService.getAllProEpps(this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        console.log(result);
        this.listProEpps = result;
        this.proEppsData.data = result;
        this.proEppsData.paginator = this.paginatorProEpps;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onListTipoEpps() {
    this.tablaService.getAllTiposEpps().subscribe(
      (result) => {
        this.tiposEpps = result;
      }, error => {
        console.log(error);
      }
    );
  }

  onListEmpresa() {
    this.empresaService.getAllEmpresaByUsuario(this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.empresas = result;
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

  onListEppsByIdTipo(id: number) {
    this.eppsService.getAllEppsByIdTipo(id).subscribe(
      (result) => {
        this.listEpps = result;
      }, error => {
        console.log(error);
      }
    );
  }

  onChangeTipoEpp(event: any) {
    this.listEpps = null;
    if (event != null && event != '') {
      this.onListEppsByIdTipo(event);
    }
    else {
      console.log("error de toma de dato");
    }
  }

  //GENERAL
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

  ngOnInit(): void {
    this.onBuildFormProEpps();
    this.onBuildFormProEppsObjeto();
    this.onListProEpps();
    this.onListEmpresa();
    this.onListTipoEpps();
  }

}
