import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Personal } from 'src/app/models/personal';
import { PersonalService } from 'src/app/services/personal.service';
import { CargoService } from 'src/app/services/cargo.service';
import { Cargo } from 'src/app/models/cargo';
import { Area } from 'src/app/models/area';
import { AreaService } from 'src/app/services/area.service';
import { Empresa } from 'src/app/models/empresa';
import { Sucursal } from 'src/app/models/sucursal';
import { EmpresaService } from 'src/app/services/empresa.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import { Tabladetalle } from 'src/app/models/tabladetalle';
import { TablaService } from 'src/app/services/tabla.service';
import Swal from 'sweetalert2';
import { Tipoplanilla } from 'src/app/models/tipoplanilla';
import { TipoplanillaService } from 'src/app/services/tipoplanilla.service';
import { formatDate } from '@angular/common';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-externo',
  templateUrl: './externo.component.html',
  styleUrls: ['./externo.component.css']
})
export class ExternoComponent implements OnInit {

  public formPersonal: FormGroup;
  public submittedPersonal = false;

  public searhInputAsignar: string;
  public selectedBusquedaAsign: string = 'Documento';

  public personal: Personal = new Personal();
  public personales: Personal[];

  public cargo: Cargo = new Cargo();
  public cargos: Cargo[];

  public area: Area = new Area();
  public areas: Area[];
  public nomarea: string;

  public planillas: Tipoplanilla[];

  public tbltipodocs: Tabladetalle[];
  public tbltiposexs: Tabladetalle[];

  personalCol: string[] = ['Opciones', 'DNI', 'ApePaterno', 'ApeMaterno', 'Nombres', 'Estado'];
  personalData = new MatTableDataSource();

  cargoCol: string[] = ['Opciones', 'Categoria', 'Descripcion'];
  cargoData = new MatTableDataSource();

  areaCol: string[] = ['Opciones', 'Descripcion'];
  areaData = new MatTableDataSource();

  public empresas: Empresa[];
  public sucursales: Sucursal[];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  
  @ViewChild('paginatorCargo', { static: true, read: MatPaginator }) paginatorCargo: MatPaginator;

  @ViewChild('paginatorArea', { static: true, read: MatPaginator }) paginatorArea: MatPaginator;

  constructor(private personalService: PersonalService,
    private cargoService: CargoService,
    private areaService: AreaService,
    private usuarioService: UsuarioService,
    private empresaService: EmpresaService,
    private sucursalService: SucursalService,
    private tablaService: TablaService,
    private planillaService: TipoplanillaService,
    private formBuilder: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef) { }

  @ViewChild('closebutton') modal: ElementRef;
  @ViewChild('closeArea') modalArea: ElementRef;
  @ViewChild('closeCargo') modalCargo: ElementRef;

  private closeModal(): void {
    this.modal.nativeElement.click();
  }

  private closeModalArea(): void {
    this.modalArea.nativeElement.click();
  }

  private closeModalCargo(): void {
    this.modalCargo.nativeElement.click();
  }

  get f() {
    return this.formPersonal.controls;
  }

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
      codtipoplanilla: [''],
      condicion: [''],
      tipestado: [''],
      contratofecini: [''],
      isupdate: [''],
      usuario: ['']
    }); 
  }

  onSubmit() {
    this.submittedPersonal = true;
    if (this.formPersonal.invalid) {
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

        if(this.usuarioService.getUsuarioSession()){

          this.formPersonal.get('usuario').setValue(this.usuarioService.getUsuarioSession());

          this.personalService.savePersonalExterno(this.formPersonal.value).subscribe(
            (result) => {
              if (result) {
                if (result.respuesta.codigo == 0) {

                  this.onResertFormPersonal();
                  this.onListPersonalExterno();
                  this.changeDetectorRefs.detectChanges();
                  this.toastAcceptedAlert("Se registro con exito");
                  this.closeModal();

                }
                else {
                  this.toastRejectAlert(result.respuesta.descripcion);
                  this.closeModal();
                }

              } else {
                this.closeModal();
              }
            }, error => {
              console.log(error);
            }
          );           
        }

      }
    })
  }

  onUpdatePersonal(personal: Personal){

    this.personalService.getPersonalById(personal.codempresa, personal.codpersonal).subscribe(
      (result) => {
        this.personal = result;

        console.log(result);

        this.onListAreasByEmpresa(result.codempresa);
        this.onListTipoPlanillaByEmpresa(result.codempresa);
        this.onListCargo(result.codempresa);

        this.formPersonal.patchValue({
          codempresa: result.codempresa,
          codpersonal: result.codpersonal,
          codsucursal: result.codsucursal,
          numverareas: result.numverareas,
          codareas: result.codareas,
          desareas: result.desareas,
          nomarea: result.desareas,
          nomtrabajador: result.nomtrabajador,
          apepaterno: result.apepaterno,
          apematerno: result.apematerno,
          tipdocidentidad: result.tipdocidentidad,
          numdocidentidad: result.numdocidentidad,
          numemail: result.numemail,
          numtelefono: result.numtelefono,
          codcategoria: result.codcategoria,
          codcargo: result.codcargo,
          descargo: result.descargo,
          nomcargo: result.descargo,
          fecnacimiento: formatDate(result.fecnacimiento, 'yyyy-MM-dd', 'en'),
          tipsexo: result.tipsexo,
          codtipoplanilla: result.codtipoplanilla,
          condicion: result.condicion,
          contratofecini: result.contratofecini,
          tipestado: result.tipestado,
          isupdate: true,
          usuario: this.usuarioService.getUsuarioSession()
        });

      }, error => {
        console.log(error);
      }
    );

  }


  deleteById(personal: Personal) {
    Swal.fire({
      title: 'Advertencia',
      text: `¿Esta seguro que desea Desactivar el Personal?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#17a2b8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Desactivar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {

        this.personalService.desactivarPersonal(personal.codempresa, personal.codpersonal).subscribe(
          (result) => {
            this.onListPersonalExterno();
            this.changeDetectorRefs.markForCheck();
          }, error => {
            this.toastRejectAlert("Existe Personal Asignado");
            console.log(error);
          }
        );
      }
    })
  }

  activeById(personal: Personal) {
    Swal.fire({
      title: 'Advertencia',
      text: `¿Esta seguro que desea Activar Personal?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#17a2b8',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Activar!',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {

        this.personalService.activarPersonal(personal.codempresa, personal.codpersonal).subscribe(
          (result) => {
            this.onListPersonalExterno();
            this.changeDetectorRefs.markForCheck();
          }, error => {
            this.toastRejectAlert("Existe Personal Asignado");
            console.log(error);
          }
        );
      }
    })
  }

  onResertFormPersonal(){
    this.submittedPersonal = false;
    this.formPersonal.reset();
    this.formPersonal.get('isupdate').setValue(false);
  }

  onListEmpresa() {
    this.empresaService.getAllEmpresa().subscribe(
      (result) => {
        this.empresas = result;
        //console.log(result);
        //this.empresaData.data =  result;
        //this.empresaData.paginator = this.paginatorEmpresa;
        this.onListSucursalEmpresa(result[0].codempresa);
        this.onListCargo(result[0].codempresa);
        this.onListTipoPlanillaByEmpresa(result[0].codempresa);
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
    this.planillas = null;
    this.cargos = null;
    if (event != null && event != '') {
      this.onListSucursalEmpresa(event);
      this.onListTipoPlanillaByEmpresa(event);
      this.onListCargo(event);
      this.onListAreasByEmpresa(event);
      this.formPersonal.get('numverareas').setValue(null);
      this.formPersonal.get('codareas').setValue(null);
      this.formPersonal.get('desareas').setValue(null);
      this.formPersonal.get('codcargo').setValue(null);
      this.formPersonal.get('descargo').setValue(null);
    }
    else {
      console.log("error de toma de dato");
    }
  }


  onListPersonalExterno() {
    this.personalService.getAllPersonalExterno().subscribe(
      (result) => {
        console.log(result);
        this.personales = result;
        this.personalData.data = result;
        this.personalData.paginator = this.paginator;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  //FILTRO PERSONAL 

  onSearchPersonalResponsable() {
    if (this.searhInputAsignar != null) {
      if (this.searhInputAsignar.trim() != '') {
        if (this.selectedBusquedaAsign == "Documento") {
          this.onListPersonalExternoByDoc(this.searhInputAsignar);
        }
        if (this.selectedBusquedaAsign == "Nombres") {
          this.onListPersonalByNombreLike(this.searhInputAsignar);
        }
      } else {
        this.onListPersonalExterno();
      }
    } else {
      this.onListPersonalExterno();
    }
  }

  onListPersonalExternoByDoc(documento: string) {
    this.personalService.getAllPersonalExternaByDoc(documento).subscribe(
      (result) => {
        this.personalData.data = result;
        this.personalData.paginator = this.paginator;
      }, error => {
        console.log(error);
      }
    );
  }

  onListPersonalByNombreLike(search: string) {
    this.personalService.getAllPersonalExternoByNombreLike(search).subscribe(
      (result) => {
        this.personalData.data = result;
        this.personalData.paginator = this.paginator;
      }, error => {
        console.log(error);
      }
    );
  }

  onListAreas() {
    this.areaService.getAllAreas().subscribe(
      (result) => {
        this.areas = result;
        this.areaData.data = result;
        this.areaData.paginator = this.paginatorArea;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onListAreasByEmpresa(codempresa: string) {
    this.areaService.getAllAreasByEmpresa(codempresa).subscribe(
      (result) => {
        this.areas = result;
        this.areaData.data = result;
        this.areaData.paginator = this.paginatorArea;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onListCargo(codempresa: string) {
    this.cargoService.getAllCargoByEmpresa(codempresa).subscribe(
      (result) => {
        this.cargos = result;
        this.cargoData.data = result;
        this.cargoData.paginator = this.paginatorCargo;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onListTipoDocumento() {
    this.tablaService.getAllTipDocumento().subscribe(
      (result) => {
        this.tbltipodocs = result;
      }, error => {
        console.log(error);
      }
    );
  }

  onListTipoSexo() {
    this.tablaService.getAllTipSexo().subscribe(
      (result) => {
        this.tbltiposexs = result;
      }, error => {
        console.log(error);
      }
    );
  }

  onListTipoPlanillaByEmpresa(codempresa: string) {
    this.planillaService.getAllTipoPlanillaByEmpresa(codempresa).subscribe(
      (result) => {
        this.planillas = result;
      }, error => {
        console.log(error);
      }
    );
  }

  selectCargo(cargo: Cargo) {
    this.formPersonal.get('descargo').setValue(cargo.descargo);
    this.formPersonal.get('codcategoria').setValue(cargo.codcategoria);
    this.formPersonal.get('codcargo').setValue(cargo.codcargo);
    this.closeModalCargo();
  }

  selectArea(area: Area){
    this.formPersonal.get('desareas').setValue(area.desareas);
    this.formPersonal.get('numverareas').setValue(area.numverareas);
    this.formPersonal.get('codareas').setValue(area.codareas);
    this.closeModalArea();
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
      timer: 1500,
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
    this.onBuildFormPersonal();
    this.onListEmpresa();
    this.onListTipoDocumento();
    this.onListTipoSexo();
    this.onListPersonalExterno();
    //this.onListAreas();
  }

}
