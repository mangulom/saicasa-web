import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppComponent } from 'src/app/app.component';
import { Acceso } from 'src/app/models/acceso';
import { Costo } from 'src/app/models/costo';
import { Costousuario } from 'src/app/models/costousuario';
import { Empresa } from 'src/app/models/empresa';
import { Perfil } from 'src/app/models/perfil';
import { Submenu } from 'src/app/models/submenu';
import { Sucursal } from 'src/app/models/sucursal';
import { Sucursalusuario } from 'src/app/models/sucursalusuario';
import { Tipoplanilla } from 'src/app/models/tipoplanilla';
import { Tipoplanillausuario } from 'src/app/models/tipoplanillausuario';
import { Usuario } from 'src/app/models/usuario';
import { Usuarioemp } from 'src/app/models/usuarioemp';
import { AuthService } from 'src/app/services/auth.service';
import { CostoService } from 'src/app/services/costo.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { PerfilService } from 'src/app/services/perfil.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import { TipoplanillaService } from 'src/app/services/tipoplanilla.service';
import { AreaService } from 'src/app/services/area.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { Area } from 'src/app/models/area';
import { Areausuario } from 'src/app/models/Areausuario';
import { stringify } from '@angular/compiler/src/util';
import { PersonalService } from 'src/app/services/personal.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  public formUsuario: FormGroup;
  public formEmpresa: FormGroup;
  public formSucursal: FormGroup;
  public formCosto: FormGroup;
  public formPlanilla: FormGroup;
  public submitted = false;

  public checkCentroCostos = false;
  public checkTipoPlanilla = false;

  public usuario: Usuario = new Usuario();
  public submenu: Submenu = new Submenu();
  public submenures: Submenu = new Submenu();
  public empresa: Empresa = new Empresa();
  public usuarioemp: Usuarioemp = new Usuarioemp();
  public sucursalusuario: Sucursalusuario = new Sucursalusuario();
  public sucursal: Sucursal = new Sucursal();
  public costo: Costo = new Costo();
  public costousuario: Costousuario = new Costousuario();
  public tipoPlanilla: Tipoplanilla = new Tipoplanilla();
  public tipoPlanillaUsuario: Tipoplanillausuario = new Tipoplanillausuario();
  public area: Area = new Area();
  public areausuario: Areausuario = new Areausuario();
  //public acceso : Acceso =  new Acceso();

  public usuarioAcceso: string;
  public usuarioTemp: string;
  public empresaTemp: string;
  public empresaTempPlanilla: string;

  public usuarios: Usuario[];
  public perfiles: Perfil[];
  public areas: Area[];
  public areausuarios: Areausuario[] = [];
  public accesores: Acceso[];
  public submenus: Submenu[];
  public usempresas: Empresa[];
  public empresas: Empresa[];
  public usuarioempresa: Usuarioemp[];
  public sucursales: Sucursal[];
  public sucursalesusuario: Sucursalusuario[];
  public costos: Costo[];
  public costosusuario: Costousuario[];
  public tipoPlanillas: Tipoplanilla[];
  public tipoPlanillaUsuarios: Tipoplanillausuario[];
  public searchInput: string;

  public usuarioDisableInput: boolean = false;
  public selectedTabIndex: number = 0;

  usuarioCol: string[] = ['Opciones', 'Nombre', 'Usuario', 'Estado'];
  usuarioData = new MatTableDataSource();
  PermAccesoCol: string[] = ['Opciones', 'Nombre'];
  PermAccesoData = new MatTableDataSource();
  DenegAccesoCol: string[] = ['Opciones', 'Nombre'];
  DenegAccesoData = new MatTableDataSource();
  empresaCol: string[] = ['Opciones', 'Codigo', 'RazonSocial'];
  empresaData = new MatTableDataSource();
  sucursalCol: string[] = ['Opciones', 'Codigo', 'Empresa', 'Nombre'];
  sucursalData = new MatTableDataSource();
  costoCol: string[] = ['Opciones', 'CodCosto', 'Descripcion'];
  costoData = new MatTableDataSource();
  costoUsuarioCol: string[] = ['Opciones', 'CodCosto', 'Descripcion'];
  tipoPlanillaData = new MatTableDataSource();
  tipoPlanillaCol: string[] = ['Opciones', 'CodTipo', 'Descripcion'];
  tipoPlanillaUsuarioData = new MatTableDataSource();
  tipoPlanillaUsuarioCol: string[] = ['Opciones', 'CodTipo', 'Descripcion'];
  areasCol: string[] = ['Opciones', 'Codigo', 'Descripcion'];
  areasData = new MatTableDataSource();
  areasusuarioCol: string[] = ['Opciones', 'Codigo', 'Descripcion'];
  areasusuarioData = new MatTableDataSource();


  public tabGeneral: boolean;
  public tabEmpresa: boolean;
  public tabSucursal: boolean;
  public tabCostos: boolean;
  public tabPlanilla: boolean;


  costoUsuarioData = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('paginatorPermAcceso', { static: true, read: MatPaginator }) paginatorPermAcceso: MatPaginator;
  @ViewChild('paginatorDenegAcceso', { static: true, read: MatPaginator }) paginatorDenegAcceso: MatPaginator;
  @ViewChild('paginatorEmpresa', { static: true, read: MatPaginator }) paginatorEmpresa: MatPaginator;
  @ViewChild('paginatorSucursal', { static: true, read: MatPaginator }) paginatorSucursal: MatPaginator;
  @ViewChild('paginatorcosto', { static: true, read: MatPaginator }) paginatorcosto: MatPaginator;
  @ViewChild('paginatorcostousuario', { static: true, read: MatPaginator }) paginatorcostousuario: MatPaginator;
  @ViewChild('paginatortipoplanilla', { static: true, read: MatPaginator }) paginatortipoplanilla: MatPaginator;
  @ViewChild('paginatortipoplanillausuario', { static: true, read: MatPaginator }) paginatortipoplanillausuario: MatPaginator;
  @ViewChild('paginatorareas', { static: true, read: MatPaginator }) paginatorareas: MatPaginator;
  @ViewChild('paginatorareasusuario', { static: true, read: MatPaginator }) paginatorareasusuario: MatPaginator;
  @ViewChild('closebutton') modal: ElementRef;

  constructor(private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private perfilService: PerfilService,
    private authService: AuthService,
    private empresaService: EmpresaService,
    private sucursalService: SucursalService,
    private costoService: CostoService,
    private areaService: AreaService,
    private tipoPlanillaService: TipoplanillaService,
    private personalService: PersonalService,
    private appts: AppComponent,
    private changeDetectorRefs: ChangeDetectorRef) { }

  onUpdateUsuario(usuario: Usuario) {

    this.tabEmpresa = false;
    this.tabSucursal = false;
    this.tabCostos = false;
    this.tabPlanilla = false;

    this.checkCentroCostos = false;
    this.checkTipoPlanilla = false;

    this.selectedTabIndex = 0;
    this.usuarioTemp = null;
    this.empresaTemp = null;
    this.empresaTempPlanilla = null;
    this.sucursales = null;
    this.costos = null;
    this.onUpdateUsuarioValidators();
    this.submitted = false;
    this.usuarioDisableInput = true;
    this.usuarioService.getUsuarioByUsuario(usuario.usuario).subscribe(
      (result) => {
        this.usuario = result;

        if(result.syncccostos == true || result.syncccostos == "true"){
          this.checkCentroCostos = true;
          this.callProcedureSyncCostosXUsuario(result.usuario);
        }else{
          this.checkCentroCostos = false;
        }

        if (result.synctiplanilla == true || result.synctiplanilla == "true") {
          this.checkTipoPlanilla = true;
          this.callProcedureSyncTipoPlanillaXUsuario(result.usuario);
        } else {
          this.checkTipoPlanilla = false;
        }
        
        //this.checkTipoPlanilla = result.synctiplanilla;

        this.formUsuario.patchValue({
          usuario: this.usuario.usuario,
          nombre: this.usuario.nombre,
          password: this.usuario.password,
          perfil: this.usuario.perfil,
          syncccostos: this.usuario.syncccostos,
          synctiplanilla: this.usuario.synctiplanilla,
          syncareaas: this.usuario.syncareaas
        });
        this.formEmpresa.patchValue({
          codempresa: [''],
          codusuario: this.usuario.usuario
        });
        this.formSucursal.patchValue({
          codempresa: [''],
          codsucursal: [''],
          codusuario: this.usuario.usuario
        });

        this.formCosto.patchValue({
          codempresa: ['']
        });

        this.formPlanilla.patchValue({
          codempresa: ['']
        });

        this.usuarioTemp = result.usuario;
        this.onListEmpresaUsuarioEmp(usuario.usuario);
        this.onListEmpresaUsuario(usuario.usuario);
        this.onListSucursalUsuario(usuario.usuario);
        this.onListCostoByUsuario(null, null);
        this.onListCostoUsuarioByUsuario(null, null);
        this.onListPlanillaByUsuario(null, null);
        this.onListPlanillaUsuarioByUsuario(null, null);
        this.onListAreas(usuario.usuario);
        this.onListAreasByUsuario(usuario.usuario);
      }, error => {
        console.log(error);
      }
    );

  }

  onSaveUsuarioValidators() {
    this.formUsuario.controls["password"].setValidators([Validators.required]);
  }

  onUpdateUsuarioValidators() {
    this.formUsuario.controls["password"].clearValidators();
  }

  onResetFormUsuario() {
    this.selectedTabIndex = 0;
    this.submitted = false;
    this.usuarioDisableInput = false;
    this.onSaveUsuarioValidators();
    this.formUsuario.reset();
    this.formEmpresa.reset();
    this.formSucursal.reset();
    this.sucursales = null;
    this.usuarioTemp = null;
    this.empresaTemp = null;
    this.empresaTempPlanilla = null;

    this.tabEmpresa = true;
    this.tabSucursal = true;
    this.tabCostos = true;
    this.tabPlanilla = true;
  }

  private closeModal(): void {
    this.modal.nativeElement.click();
    this.selectedTabIndex = 0;
    this.usuarioTemp = null;
  }

  onBuildFormUsuario() {
    this.formUsuario = this.formBuilder.group({
      usuario: ['', Validators.required],
      nombre: ['', Validators.required],
      password: ['', Validators.required],
      perfil: ['', Validators.required],
      syncccostos: [''],
      synctiplanilla: [''],
      syncareaas: ['']

    });
  }

  onBuildFormEmpresa() {
    this.formEmpresa = this.formBuilder.group({
      codempresa: [''],
      codusuario: ['']
    });
  }

  onBuildFormSucursal() {
    this.formSucursal = this.formBuilder.group({
      codempresa: [''],
      codsucursal: [''],
      codusuario: ['']
    });
  }

  onBuilFormCosto() {
    this.formCosto = this.formBuilder.group({
      codempresa: ['']
    });
  }

  onBuildFormPlanilla() {
    this.formPlanilla = this.formBuilder.group({
      codempresa: ['']
    });
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.areasData.filter = filterValue.trim().toLowerCase();
  }

  filterAreaAsignada(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.areasusuarioData.filter = filterValue.trim().toLowerCase();
  }

  get f() {
    return this.formUsuario.controls;
  }

  onSaveUsuario() {
    this.submitted = true;
    if (this.formUsuario.invalid) {
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


        this.usuarioService.saveUsuario(this.formUsuario.value).subscribe(
          (result) => {
            if (result) {
              this.onResetFormUsuario();
              this.onListUsuario();
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

  onFindEmpresa(codempresa: string, codusuario: string) {
    console.log(codempresa, codusuario);
    this.empresaService.findUsuarioEmp(codempresa, codusuario).subscribe(
      (result) => {
        if (result) {
          //console.log(result);
          if (result != null) {
            Swal.fire('Alerta', 'Ya existe el registro', 'error');
          }
        }
      }, error => {
        console.log(error);
      }
    );
  }

  onSaveEmpresa() {

    /*if(this.formEmpresa.controls['codempresa'].value != null && 
       this.formEmpresa.controls['codusuario'].value != null){
         this.onFindEmpresa(this.formEmpresa.controls['codempresa'].value, 
         this.formEmpresa.controls['codusuario'].value)
       }*/

    this.empresaService.saveUsuarioEmp(this.formEmpresa.value).subscribe(
      (result) => {
        if (result) {
          //this.onResetFormUsuario();
          //console.log(result);
          this.onListEmpresaUsuarioEmp(result.codusuario);
          this.onListEmpresaUsuario(result.codusuario);
          this.onListSucursalUsuario(result.codusuario);
          this.changeDetectorRefs.detectChanges();
        }
      }, error => {
        console.log(error);
      }
    );
  }

  onSaveSucursal() {

    if (this.formSucursal.controls['codsucursal'].value != null && this.formSucursal.controls['codsucursal'].value != '' &&
      this.formSucursal.controls['codempresa'].value != null && this.formSucursal.controls['codempresa'].value != '' &&
      this.formSucursal.controls['codusuario'].value != null && this.formSucursal.controls['codusuario'].value != '') {
      //console.log(this.formSucursal.value);
      this.sucursalService.saveSucursal(this.formSucursal.value).subscribe(
        (result) => {
          if (result != null) {
            this.onListSucursalUsuario(result.codusuario);
            this.changeDetectorRefs.detectChanges();
          } else {
            return;
          }
        }, error => {
          console.log(error);
        }
      );
    } else {
      console.clear();
      return;
    }

  }

  onSaveCostosUsuario(costo: Costo) {
    let costoUsuario: Costousuario = new Costousuario();
    console.log(costo.codempresa);
    costoUsuario.codempresa = costo.codempresa;
    costoUsuario.numverccostos = costo.numverccostos;
    costoUsuario.codccostos = costo.codccostos;
    costoUsuario.codusuario = this.usuarioTemp;
    this.costoService.saveCosto(costoUsuario).subscribe(
      (result) => {
        console.log(result);
        this.onListCostoByUsuario(result.codusuario, result.codempresa);
        this.onListCostoUsuarioByUsuario(result.codusuario, result.codempresa);
        this.changeDetectorRefs.detectChanges();
      }, error => {
        console.log(error);
      }
    );
  }

  onSavePlanillaUsuario(tipoPlanilla: Tipoplanilla) {
    let tipoPlanillaUsuario: Tipoplanillausuario = new Tipoplanillausuario();
    tipoPlanillaUsuario.codempresa = tipoPlanilla.codempresa;
    tipoPlanillaUsuario.codtipo = tipoPlanilla.codtipo;
    tipoPlanillaUsuario.codusuario = this.usuarioTemp;

    console.log(tipoPlanillaUsuario);

    this.tipoPlanillaService.saveTipoPlanillaUsuario(tipoPlanillaUsuario).subscribe(
      (result) => {
        console.log(result);
        this.onListPlanillaByUsuario(result.codusuario, result.codempresa);
        this.onListPlanillaUsuarioByUsuario(result.codusuario, result.codempresa);
        this.changeDetectorRefs.detectChanges();
      }, error => {
        console.log(error);
      }
    );

  }

  deleteEmpresa(usuarioemp: Usuarioemp) {
    this.empresaService.deleteUsuarioEmp(usuarioemp.codempresa, usuarioemp.codusuario).subscribe(
      () => {
        this.onListEmpresaUsuarioEmp(usuarioemp.codusuario);
        this.onListEmpresaUsuario(usuarioemp.codusuario);
        this.onListSucursalUsuario(usuarioemp.codusuario);
        this.onListCostoByUsuario(null, null);
        this.onListCostoUsuarioByUsuario(null, null);
        this.onListPlanillaByUsuario(null, null);
        this.onListPlanillaUsuarioByUsuario(null, null);
        this.formSucursal.patchValue({
          codempresa: [''],
          codsucursal: [''],
          codusuario: this.usuario.usuario
        });
        this.changeDetectorRefs.detectChanges();
      }, error => {
        console.log(error);
      }
    );
  }

  deleteSucursal(sucursalUsuario: Sucursalusuario) {
    if (sucursalUsuario.codsucursal != null && sucursalUsuario.codsucursal != '' &&
      sucursalUsuario.codempresa != null && sucursalUsuario.codempresa != '' &&
      sucursalUsuario.codusuario != null && sucursalUsuario.codusuario) {
      this.sucursalService.deleteSucursalUsuario(sucursalUsuario.codempresa, sucursalUsuario.codsucursal, sucursalUsuario.codusuario).subscribe(
        () => {
          this.onListSucursalUsuario(sucursalUsuario.codusuario);
          this.changeDetectorRefs.detectChanges();
        }, error => {
          console.log(error);
        }
      );
    }
  }

  deleteAreasUsuario(areaUsuario: Areausuario) {
    if (areaUsuario.codareas != null && areaUsuario.codareas != '' &&
      areaUsuario.codempresa != null && areaUsuario.codempresa != '' &&
      areaUsuario.numverareas != null && areaUsuario.numverareas != '' &&
      areaUsuario.codusuario != null && areaUsuario.codusuario) {
      this.areaService.deleteAreasUsuario(areaUsuario.codempresa, areaUsuario.numverareas, areaUsuario.codareas, areaUsuario.codusuario).subscribe(
        () => {
          this.onListAccesoAreaUsuario(areaUsuario.codusuario);
          this.changeDetectorRefs.detectChanges();
        }, error => {
          console.log(error);
        }
      );
    }
  }

  CallProcedureSyncAllMasters() {
    console.log("todos antes");
    this.personalService.execProcSyncAllMasters().subscribe(
      (result) => {
        console.log("full");
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  callProcedureSyncEmpresas() {
    this.empresaService.execProcSyncEmpresa().subscribe(
      (result) => {
        this.onListEmpresa();
        console.log("empresa");
        console.log(result);
        this.changeDetectorRefs.detectChanges();
      }, error => {
        console.log(error);
      }
    );
  }

  callProcedureSyncSucursal() {
    this.sucursalService.execProcSyncSucursal().subscribe(
      (result) => {
        this.onListEmpresa();
        console.log("sucursal");
        console.log(result);
        this.changeDetectorRefs.detectChanges();
      }, error => {
        console.log(error);
      }
    );
  }

  callProcedureSyncCostos() {
    this.costoService.execProcSyncCostos().subscribe(
      (result) => {
        this.onListEmpresa();
        console.log("costos");
        console.log(result);
        this.changeDetectorRefs.detectChanges();
      }, error => {
        console.log(error);
      }
    );
  }

  callProcedureSyncTipoPlanilla() {
    this.tipoPlanillaService.execProcSyncTipoPlanilla().subscribe(
      (result) => {
        this.onListEmpresa();
        console.log("tipoplanilla");
        console.log(result);
        this.changeDetectorRefs.detectChanges();
      }, error => {
        console.log(error);
      }
    );
  }

  CallProcedureSyncArea(){
    this.areaService.execProcSyncArea().subscribe(
      (result) => {
        console.log("area");
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  CallProcedureSyncPersonal() {
    console.log("antes");
    this.personalService.execProcSyncPersonal().subscribe(
      (result) => {
        console.log("personal");
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  callProcedureSyncAreasUsuario() {
    if (this.usuarioTemp != null){
      this.areaService.execProcSyncAreaUsuario(this.usuarioTemp).subscribe(
        (result) => {
          this.onListAccesoAreaUsuario(this.usuarioTemp);
          console.log(result);
          this.changeDetectorRefs.detectChanges();
        }, error => {
          console.log(error);
        }
      );
    }
  }

  callProcedureSyncCentroCostosUsuarioParametros() {
    if (this.usuarioTemp != null) {
      this.costoService.execProcSyncCostosParametros(this.empresaTemp, this.usuarioTemp).subscribe(
        (result) => {
          this.onListCostoByUsuario(this.empresaTemp, this.usuarioTemp);
          this.onListCostoUsuarioByUsuario(this.usuarioTemp, this.empresaTemp);
          console.log(result);
          this.changeDetectorRefs.detectChanges();
        }, error => {
          console.log(error);
        }
      );
    }
  }

    callProcedureSyncTipoPlanillUsuariosParametros() {
    if (this.usuarioTemp != null) {
      this.tipoPlanillaService.execProcSyncTipoPlanillaParametros(this.empresaTempPlanilla, this.usuarioTemp).subscribe(
        (result) => {
          this.onListPlanillaByUsuario(this.empresaTempPlanilla, this.usuarioTemp);
          this.onListPlanillaUsuarioByUsuario(this.usuarioTemp, this.empresaTempPlanilla);
          console.log(result);
          this.changeDetectorRefs.detectChanges();
        }, error => {
          console.log(error);
        }
      );
    }
  }

  callProcedureSyncCostosXUsuario(codusuario: string) {

      this.costoService.execProcSyncCostosXUsuario(codusuario).subscribe(
        (result) => {

        }, error => {
          console.log(error);
        }
      );
    
  }


  callProcedureSyncTipoPlanillaXUsuario(codusuario: string) {

      this.tipoPlanillaService.execProcSyncTipoPlanillaXUsuario(codusuario).subscribe(
        (result) => {
          
        }, error => {
          console.log(error);
        }
      );
    
  }




  searchUsuario() {
    if (this.searchInput != null && this.searchInput != "") {
      this.onListUsuarioByNombre(this.searchInput);
    } else {
      this.onListUsuario();
    }
  }

  onListUsuarioByNombre(nombre: string) {
    this.usuarioService.getAllUsuarioByNombre(nombre).subscribe(
      (result) => {
        this.usuarios = result;
        this.usuarioData.data = result;
        this.usuarioData.paginator = this.paginator;
      }, error => {
        console.log(error);
      }
    );
  }

  onListEmpresa() {
    this.empresaService.getAllEmpresa().subscribe(
      (result) => {
        this.empresas = result;
        //this.empresaData.data =  result;
        //this.empresaData.paginator = this.paginatorEmpresa;
      }, error => {
        console.log(error);
      }
    );
  }

  onListEmpresaUsuarioEmp(usuario: string) {
    this.empresaService.getAllEmpresaByUsuarioEmp(usuario).subscribe(
      (result) => {
        this.usuarioempresa = result;
        this.empresaData.data = result;
        this.empresaData.paginator = this.paginatorEmpresa;
        //console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onListCostoByUsuario(usuario: string, codempresa: string) {
    if (usuario == null && codempresa == null) {
      this.costos = null;
      this.costoData.data = [];
      this.costoData.paginator = this.paginatorcosto;
      this.changeDetectorRefs.detectChanges();
    } else {
      this.costoService.getAllCostosByUsuario(usuario, codempresa).subscribe(
        (result) => {
          this.costos = result;
          this.costoData.data = result;
          this.costoData.paginator = this.paginatorcosto;
          this.changeDetectorRefs.detectChanges();
          console.log(result);
        }, error => {
          console.log(error);
        }
      );
    }

  }

  onListCostoUsuarioByUsuario(usuario: string, codempresa: string) {
    if (usuario == null && codempresa == null) {
      this.costosusuario = null;
      this.costoUsuarioData.data = [];
      this.costoUsuarioData.paginator = this.paginatorcostousuario;
      this.changeDetectorRefs.detectChanges();
    } else {
      this.costoService.getAllCostosUsByUsuarioAndEmpresa(usuario, codempresa).subscribe(
        (result) => {
          this.costosusuario = result;
          this.costoUsuarioData.data = result;
          this.costoUsuarioData.paginator = this.paginatorcostousuario;
          this.changeDetectorRefs.detectChanges();
          console.log(result);
        }, error => {
          console.log(error);
        }
      );
    }
  }

  onListPlanillaByUsuario(usuario: string, codempresa: string) {
    if (usuario == null && codempresa == null) {
      this.tipoPlanillas = null;
      this.tipoPlanillaData.data = [];
      this.tipoPlanillaData.paginator = this.paginatortipoplanilla;
      this.changeDetectorRefs.detectChanges();
    } else {
      this.tipoPlanillaService.getAllTipoPlanillaByUsuario(usuario, codempresa).subscribe(
        (result) => {
          this.tipoPlanillas = result;
          this.tipoPlanillaData.data = result;
          this.tipoPlanillaData.paginator = this.paginatortipoplanilla;
          this.changeDetectorRefs.detectChanges();
          console.log(result);
        }, error => {
          console.log(error);
        }
      );
    }
  }

  onListPlanillaUsuarioByUsuario(usuario: string, codempresa: string) {
    if (usuario == null && codempresa == null) {
      this.tipoPlanillaUsuarios = null;
      this.tipoPlanillaUsuarioData.data = [];
      this.tipoPlanillaUsuarioData.paginator = this.paginatortipoplanillausuario;
      this.changeDetectorRefs.detectChanges();
    } else {
      this.tipoPlanillaService.getAllTipoPlanillaUsByUsuarioAndEmpresa(usuario, codempresa).subscribe(
        (result) => {
          this.tipoPlanillaUsuarios = result;
          this.tipoPlanillaUsuarioData.data = result;
          this.tipoPlanillaUsuarioData.paginator = this.paginatortipoplanillausuario;
          this.changeDetectorRefs.detectChanges();
          console.log(result);
        }, error => {
          console.log(error);
        }
      );
    }
  }

  onListEmpresaUsuario(usuario: string) {
    this.empresaService.getAllEmpresaByUsuario(usuario).subscribe(
      (result) => {
        this.usempresas = result;
        //console.log(result);
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

  /*onListSucursalByUsuario(codusuario: string) {
    this.sucursalService.getAllSucursalByUsuario(codusuario).subscribe(
      (result) => {
        //console.log(result);
        //this.sucursalesusuario =  result;
        this.sucursalData.data = result;
        this.sucursalData.paginator = this.paginatorSucursal;
        //this.sucursalData.da
        console.log(result);

      }, error => {
        console.log(error);
      }
    );
  }*/

  onListSucursalUsuario(codusuario: string) {
    this.sucursalService.getAllSucursalUsuarioByUsuario(codusuario).subscribe(
      (result) => {
        //console.log(result);
        this.sucursalesusuario = result;
        this.sucursalData.data = result;
        this.sucursalData.paginator = this.paginatorSucursal;
        //this.sucursalData.da
        //console.log(result);

      }, error => {
        console.log(error);
      }
    );
  }

  onListUsuario() {
    this.usuarioService.getAllUsuario().subscribe(
      (result) => {
        this.usuarios = result;
        this.usuarioData.data = result;
        this.usuarioData.paginator = this.paginator;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onListPerfil() {
    this.perfilService.getAllPerfil().subscribe(
      (result) => {
        this.perfiles = result;
        //console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }


  onListAreas(usuario: string) {
    this.areaService.getAllCabAreasByUsaurio(usuario).subscribe(
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

  onListAreasByUsuario(usuario: string) {
    this.areaService.getAllAreaByUsuario(usuario).subscribe(
      (result) => {
        this.areausuarios = result;
        this.areasusuarioData.data = result;
        this.areasusuarioData.paginator = this.paginatorareasusuario;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }


  onListAccesoResByUsuario(usuario: string) {
    this.authService.accessRes(usuario).subscribe(
      (result) => {
        this.accesores = result;
        this.DenegAccesoData.data = result;
        this.DenegAccesoData.paginator = this.paginatorDenegAcceso;
        console.log(this.accesores);
      }, error => {
        console.log(error);
      }
    );
  }

  onListMenuByUsuario(usuario: string) {
    this.usuarioAcceso = null;
    this.authService.accessSubMenuByUsuario(usuario).subscribe(
      (result) => {
        this.usuarioAcceso = usuario;
        this.submenus = result;
        this.PermAccesoData.data = result;
        this.PermAccesoData.paginator = this.paginatorPermAcceso;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  editAccesoMenu(usuario: Usuario) {
    this.onListAccesoResByUsuario(usuario.usuario);
    this.onListMenuByUsuario(usuario.usuario);
  }

  onListAccesoMenu(usuario: string) {
    this.onListAccesoResByUsuario(usuario);
    this.onListMenuByUsuario(usuario);
  }

  onListAccesoAreaUsuario(usuario: string) {
    this.onListAreas(usuario);
    this.onListAreasByUsuario(usuario);
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

  /*onChangeEmpresaCosto(event: any){
    if (event != null && event != ''){
      this.onListCostoByUsuario(this.usuarioTemp, event);
    } 
    else{
      console.log("error de toma de dato");
    }
  }*/

  onUpdateEmpresaCosto() {
    if (this.formCosto.controls['codempresa'].value != null &&
      this.formCosto.controls['codempresa'].value != '') {
      this.empresaTemp = this.formCosto.controls['codempresa'].value;
      this.onListCostoByUsuario(this.usuarioTemp, this.formCosto.controls['codempresa'].value);
      this.onListCostoUsuarioByUsuario(this.usuarioTemp, this.formCosto.controls['codempresa'].value);
    }
  }

  onUpdateEmpresaPlanilla() {
    if (this.formPlanilla.controls['codempresa'].value != null &&
      this.formPlanilla.controls['codempresa'].value != '') {
      this.empresaTempPlanilla = this.formPlanilla.controls['codempresa'].value;
      this.onListPlanillaByUsuario(this.usuarioTemp, this.formPlanilla.controls['codempresa'].value);
      this.onListPlanillaUsuarioByUsuario(this.usuarioTemp, this.formPlanilla.controls['codempresa'].value);
    }
  }

  onActiveUsuario(usuario: Usuario) {
    Swal.fire({
      title: 'Advertencia',
      text: `¿Esta seguro que desea activar el Usuario?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#17a2b8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, activar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {

        this.usuarioService.enableUsuario(usuario).subscribe(
          (response) => {
            if (response > 0) {
              this.onListUsuario();
              this.changeDetectorRefs.markForCheck();
            } else {
              Swal.fire(
                'Error!',
                'No se realizo ningun cambio.',
                'error'
              )
            }
          }, error => {
            console.log(error);
          });
      }
    })
  }

  onDisableUsuario(usuario: Usuario) {
    Swal.fire({
      title: 'Advertencia',
      text: `¿Esta seguro que desea desactivar el usuario?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#17a2b8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, desactivar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {

        this.usuarioService.disableUsuario(usuario).subscribe(
          (response) => {
            if (response > 0) {
              this.onListUsuario();
              //console.log(response);
              this.changeDetectorRefs.markForCheck();
            } else {
              Swal.fire(
                'Error!',
                'No se realizo ningun cambio.',
                'error'
              )
            }
          }, error => {
            console.log(error);
          });

      }
    })
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

  onFindCountUsuario(usuario: Usuario) {
    this.usuarioService.findCountUsuario(usuario).subscribe(
      (result) => {

      }, error => {
        console.log(error);
      }
    );
  }

  deleteMenuRes(submenu: Submenu) {
    //console.log(submenu.id);
    this.authService.deleteMenuRes(submenu.id).subscribe(
      (result) => {
        this.onListAccesoMenu(this.usuarioAcceso);
        this.changeDetectorRefs.markForCheck();
      }, error => {
        console.log(error);
      }
    );
  }

  deleteCostoUsuario(costosUsuario: Costousuario) {
    //console.log(submenu.id);
    this.costoService.deleteSucursalUsuario(costosUsuario.codempresa, costosUsuario.codusuario,
      costosUsuario.codccostos, costosUsuario.numverccostos).subscribe(
        () => {
          this.onListCostoByUsuario(costosUsuario.codusuario, costosUsuario.codempresa);
          this.onListCostoUsuarioByUsuario(costosUsuario.codusuario, costosUsuario.codempresa);
          this.changeDetectorRefs.markForCheck();
        }, error => {
          console.log(error);
        }
      );
  }

  deleteCostoUsuarioParametros() {
    //console.log(submenu.id);
    this.costoService.deleteAllCostosUsuario(this.empresaTemp, this.usuarioTemp).subscribe(
        () => {
        this.onListCostoByUsuario(this.usuarioTemp, this.empresaTemp);
        this.onListCostoUsuarioByUsuario(this.usuarioTemp, this.empresaTemp);
          this.changeDetectorRefs.markForCheck();
        }, error => {
          console.log(error);
        }
      );
  }

  deleteTipoPlanillaUsuarioParametros() {
    //console.log(submenu.id);
    this.tipoPlanillaService.deleteAllTipoPlanillaUsuario(this.empresaTempPlanilla, this.usuarioTemp).subscribe(
        () => {
        this.onListPlanillaByUsuario(this.usuarioTemp, this.empresaTempPlanilla);
        this.onListPlanillaUsuarioByUsuario(this.usuarioTemp, this.empresaTempPlanilla);
          this.changeDetectorRefs.markForCheck();
        }, error => {
          console.log(error);
        }
      );
  }

  deletePlanillaUsuario(tipoplanillaUsuario: Tipoplanillausuario) {
    this.tipoPlanillaService.deleteTipoPlanillaUsuario(tipoplanillaUsuario.codempresa, tipoplanillaUsuario.codtipo,
      tipoplanillaUsuario.codusuario).subscribe(
        () => {
          this.onListPlanillaByUsuario(tipoplanillaUsuario.codusuario, tipoplanillaUsuario.codempresa);
          this.onListPlanillaUsuarioByUsuario(tipoplanillaUsuario.codusuario, tipoplanillaUsuario.codempresa);
          this.changeDetectorRefs.markForCheck();
        }, error => {
          console.log(error);
        }
      );
  }

  deleteAllAreasByUsuario() {
    this.areaService.deleteAllByUsuario(this.usuarioTemp).subscribe(
        () => {
        this.onListAccesoAreaUsuario(this.usuarioTemp);
          this.changeDetectorRefs.markForCheck();
        }, error => {
          console.log(error);
        }
      );
  }

  addAccesoRes(submenu: Submenu) {

    let acceso: Acceso = new Acceso();

    acceso.usuario = this.usuarioAcceso;
    acceso.codfuncion = submenu.id;

    this.authService.addAccesoRes(acceso).subscribe(
      (response) => {
        this.onListAccesoMenu(this.usuarioAcceso);
        this.changeDetectorRefs.markForCheck();
      }, error => {
        console.log(error);
      });
  }

  addAreaUsuario(area: Area) {

    let areaUsuariotmp: Areausuario = new Areausuario();

    areaUsuariotmp.codusuario = this.usuarioTemp;
    areaUsuariotmp.codempresa = area.codempresa;
    areaUsuariotmp.numverareas = area.numverareas;
    areaUsuariotmp.codareas = area.codareas;

    if(areaUsuariotmp.codusuario != null && areaUsuariotmp.codempresa != null && areaUsuariotmp.numverareas != null && areaUsuariotmp.codareas){

      this.areaService.saveAreaUsuario(areaUsuariotmp).subscribe(
        (response) => {
          this.onListAccesoAreaUsuario(this.usuarioTemp);
          this.changeDetectorRefs.markForCheck();
        }, error => {
          console.log(error);
        });
    }
  }

  checkCentroCostoUsuario() {
    this.usuario.syncccostos = this.checkCentroCostos;
    this.usuarioService.saveUsuario(this.usuario).subscribe(
        () => {
        }, error => {
          console.log(error);
        }
      );
  }

  checkTipoPlanillaUsuario() {
    this.usuario.synctiplanilla = this.checkTipoPlanilla;
    this.usuarioService.saveUsuario(this.usuario).subscribe(
      () => {
      }, error => {
        console.log(error);
      }
    );
  }

  ngOnInit(): void {

    this.areasusuarioData.filterPredicate = (data: Areausuario, filter: string) => {
      return data.area.desareas.toLocaleLowerCase().includes(filter);
    }

    //this.CallProcedureSyncPersonal();
    //this.callProcedureSyncEmpresas();
    //this.callProcedureSyncSucursal();
    //this.callProcedureSyncCostos();
    //this.callProcedureSyncTipoPlanilla();
    //this.CallProcedureSyncArea();
    //this.CallProcedureSyncAllMasters();

    //this.appts.isPermit('usuario');
    this.onListUsuario();
    this.onListPerfil();
    this.onListEmpresa();
    this.onBuildFormUsuario();
    this.onBuildFormEmpresa();
    this.onBuildFormSucursal();
    this.onBuilFormCosto();
    this.onBuildFormPlanilla();

    
  }



}
