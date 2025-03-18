import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Empresa } from 'src/app/models/empresa';
import { Sucursal } from 'src/app/models/sucursal';
import { Tabladetalle } from 'src/app/models/tabladetalle';
import { AreaService } from 'src/app/services/area.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ErrorService } from 'src/app/services/error.service';
import { PersonalService } from 'src/app/services/personal.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import { TablaService } from 'src/app/services/tabla.service';
import { ProemoService } from 'src/app/services/proemo.service';
import { EmoService } from 'src/app/services/emo.service';
import { Proemo } from 'src/app/models/proemo';
import { Emo } from 'src/app/models/emo';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { Personal } from 'src/app/models/personal';
import { SelectionModel } from '@angular/cdk/collections';
import { Error } from 'src/app/models/error';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-proemo',
  templateUrl: './proemo.component.html',
  styleUrls: ['./proemo.component.css']
})
export class ProemoComponent implements OnInit {

  public proemos : Proemo[];
  public proemo: Proemo =  new Proemo();

  public formBusquedad: FormGroup;

  public emos: Emo[];
  public emo: Emo = new Emo();

  private _usuario: Usuario;

  public submittedSearch = false;
  public submittedEmo = false;
  public submittedPersonal = false;

  public empresas: Empresa[];
  public sucursales: Sucursal[];
  public evaluaciones: Tabladetalle[];
  public proveedores: Tabladetalle[];
  public estados: Tabladetalle[];
  public submitted = false;

  public formProEmo: FormGroup;
  public formEmo: FormGroup;
  public formPersonal:  FormGroup;
  public formCarga: FormGroup;

  public codigoProgram: number;
  public nomarea: string;
  public searhInputAsignar: string;
  public selectedBusquedaAsign: string = 'Documento';

  public personalAsignados: Personal[] = [];

  public selectedFile: File;
  @ViewChild('fileProducto') inputFile: ElementRef;

  public listErrores: Error[] = [];
  public validarCarga: boolean = false;


  proemoCol: string[] = ['Opciones', 'Empresa', 'Sede', 'Fecha' ,'Evaluacion', 'Proveedor'];
  proemoData = new MatTableDataSource();

  emoCol: string[] = ['Opciones', 'DNI', 'ApePaterno', 'ApeMaterno', 'Nombres', 'Estado'];
  emoData = new MatTableDataSource();

  erroresCol: string[] = ['Linea', 'Columna', 'Dato', 'Detalle'];
  erroresData = new MatTableDataSource();

  personalAsignarCol: string[] = ['select', 'Nombre', 'DNI','Cargo'];
  personalAsignarData = new MatTableDataSource<Personal>();
  selection = new SelectionModel<Personal>(true, []);


  @ViewChild('paginatorEmos', { static: true, read: MatPaginator }) paginatorEmos: MatPaginator;
  @ViewChild('paginatorEmosReg', { static: true, read: MatPaginator }) paginatorEmosReg: MatPaginator;
  @ViewChild('paginatorpersonalAsignar', { static: true, read: MatPaginator }) paginatorpersonalAsignar: MatPaginator;
  @ViewChild('paginatorErrores', { static: true, read: MatPaginator }) paginatorErrores: MatPaginator;

  @ViewChild('closebutton') modal: ElementRef;
  @ViewChild('closeCarga') SubmodalCarga: ElementRef;
  @ViewChild('closeErrores') SubmodalErrores: ElementRef;

  private closeModal(): void {
    this.modal.nativeElement.click();
  }

  private closeCargaB(): void {
    this.SubmodalCarga.nativeElement.click();
  }
  
  constructor(private empresaService: EmpresaService,
    private sucursalService: SucursalService,
    private usuarioService: UsuarioService,
    private proemoService: ProemoService,
    private emoService: EmoService,
    private errorService: ErrorService,
    private tablaService: TablaService,
    private areaService: AreaService,
    private personalService: PersonalService,
    private formBuilder: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef) { }

  //OBTENER USUARIO

  loadUsuario() {
    if (JSON.parse(sessionStorage.getItem('usuario'))) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
    }
  }

    onListProgramacion() {
      this.proemoService.getAllEmo(this.usuarioService.getUsuarioSession()).subscribe(
        (result) => {
          this.proemos = result;
          this.proemoData.data = result;
          this.proemoData.paginator = this.paginatorEmos;
        }, error => {
          console.log(error);
        }
      );
    }


    get f() {
      return this.formProEmo.controls;
    }

    onBuildFormProEmo() {
      this.formProEmo = this.formBuilder.group({
        id: [''],
        codempresa: ['', Validators.required],
        sede: ['', Validators.required],
        fechaprogram: ['', Validators.required],
        fechavencimiento: ['', Validators.required],
        codeva: ['', Validators.required],
        codproveedor: ['', Validators.required],
        codestado: [''],
      });
    }

    onSubmit(){
      this.submitted = true;
    if (this.formProEmo.invalid) {
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

        this.proemoService.saveProEmo(this.formProEmo.value).subscribe(
          (result) => {
            if (result) {
              this.onResetFormProgramacion();
              this.onListProgramacion();
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

    onResetFormProgramacion(){
      this.submitted = false;
      this.formProEmo.reset();
    }

    onUpdateProemo(proemo: Proemo) {

      console.log(proemo);
      this.proemoService.getProEmoById(proemo.id).subscribe(
        (result) => {
          this.proemo = result;
          this.formProEmo.patchValue({
            id: result.id,
            codempresa: result.codempresa,
            sede: result.sede,
            fechaprogram: result.fechaprogram,
            fechavencimiento: result.fechavencimiento,
            codeva: result.codeva,
            codproveedor: result.codproveedor,
            codestado: result.codestado
          });
          
        }, error => {
          console.log(error);
        }
      );
    }


    onAsignarProgramacion(proemo: Proemo){
      this.loadUsuario();
      this.proemoService.getProEmoById(proemo.id).subscribe(
        (result) => {
          this.proemo = result;
         
          //Listar Vacunaciones Programadas
          this.onListEmosByProgramacion(result);
          //Listar Personal Disponible Filtrado Por Programacion 
          //this.onListPersonalAsignar(result.id);
          this.codigoProgram = result.id;

          //console.log(result.fechaprogram);
          //console.log(result.fechavencimiento);

          this.formEmo.patchValue({
            id: null,
            codigo: null,
            codempresa: result.codempresa,
            sede: result.sede,
            codprogram: result.id,
            codempresapers: null,
            codpersonal: null,
            fecha: result.fechaprogram,
            fechaprogram: result.fechaprogram,
            fechavencimiento: result.fechavencimiento,
            codtipoeva: result.codeva,
            codproveedor: result.codproveedor,
            codestado: null,
            nomarea: [''],
            personales: [''],
            numdocidentidad: [''],
            apepaterno: [''],
            apematerno: [''],
            nomtrabajador: ['']
          });

        }, error => {
          console.log(error);
        }
      );
    }


    deleteById(proemo: Proemo) {
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
  
          this.proemoService.deleteProEmoById(proemo.id).subscribe(
            (result) => {
              this.onListProgramacion();
              this.changeDetectorRefs.markForCheck();
            }, error => {
              this.toastRejectAlert("Existe Personal Asignado");
              console.log(error);
            }
          );
        }
      })
    }

  //FILTRO PROEMO

  get e() {
    return this.formBusquedad.controls;
  }

  onBuildFormBusqueda() {
    this.formBusquedad = this.formBuilder.group({
      codtipo: ['', Validators.required],
      fechaini: ['', Validators.required],
      fechafin: ['', Validators.required]
    });
  }

  onSearchFilter() {
    this.submittedSearch = true;
    if (this.formBusquedad.invalid) {
      this.toastRejectAlert("Complete los parametros de Busqueda");
      return;
    }
    this.getAllProEmocitacionXParametros(this.formBusquedad.get('codtipo').value,
      this.formBusquedad.get('fechaini').value,
      this.formBusquedad.get('fechafin').value)
  }

  getAllProEmocitacionXParametros(codtipo: number, fechaini: string, fechafin: string) {
    this.proemoService.getAllProEmoByTipoAndFechas(codtipo, fechaini, fechafin, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.proemoData.data = result;
        this.proemoData.paginator = this.paginatorEmos;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }


    onListEmpresa() {
      this.empresaService.getAllEmpresaByUsuario(this.usuarioService.getUsuarioSession()).subscribe(
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


    onListProveedor() {
      this.tablaService.getAllProveedor().subscribe(
        (result) => {
          this.proveedores = result;
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

  get g() {
    return this.formEmo.controls;
  }
  
  onBuildFormEmo() {
    this.formEmo = this.formBuilder.group({
      id: [''],
      codigo: [''],
      codempresa: [''],
      sede: [''],
      codprogram: [''],
      codempresapers: [''],
      codpersonal: [''],
      fecha: [''],
      fechaprogram: [''],
      fechavencimiento: [''],
      codtipoeva: [''],
      codproveedor: [''],
      codestado: [''], 
      nomarea: [''],
      personales: [''],
      numdocidentidad: [''],
      apepaterno: [''],
      apematerno: [''],
      nomtrabajador: ['']
    });
  }

  onSubmitEmo() {
    this.submittedEmo = true;
    if (this.formEmo.invalid) {
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

        if (this.personalAsignados.length > 0) {

          this.emoService.save(this.formEmo.value).subscribe(
            (result) => {
              if (result) {
                this.selection.clear();
                this.onClearSelectAsign();
                this.onListEmoByIdProgram(result.codprogram);
                //this.onListPersonalAsignar(result.codprogram);
                this.onListProgramacion();
                this.changeDetectorRefs.detectChanges();
                this.toastAcceptedAlert("Se registro con exito");
                this.submittedEmo = false;
                this.onClearDataPersonal();
              } else {
                this.closeModal();
              }
            }, error => {
              console.log(error);
            }
          );

        } else {
          this.toastRejectAlert("No hay Personal seleccionados");
        }


      }
    })
  }

  onClearSelectAsign() {
    this.personalAsignarData.data = [];
    this.personalAsignarData.paginator = this.paginatorpersonalAsignar;;
  }


  onListEmoByIdProgram(codprogram: number) {
    this.emoService.getAllEmoByProgram(codprogram).subscribe(
      (result) => {
        this.emos = result;
        this.emoData.data = result;
        this.emoData.paginator = this.paginatorEmosReg;
        
      }, error => {
        console.log(error);
      }
    );
  }


  deleteByIdEmo(emo: Emo){

    this.emoService.deleteEmoById(emo.id).subscribe(
      (result) => {
        //this.onListPersonalAsignar(emo.codprogram);
        this.onListEmoByIdProgram(emo.codprogram);
        this.onListProgramacion();
        this.changeDetectorRefs.markForCheck();
      }, error => {
        console.log(error);
      }
    );
    
  }


  //selecter 


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

  isSelected() {
    this.personalAsignados = [];
    this.selection.selected.forEach(
      x => this.personalAsignados.push(x)
    )
    this.formEmo.get('personales').setValue(this.personalAsignados);

    if (this.personalAsignados.length == 1) {
      this.formEmo.get('numdocidentidad').setValue(this.personalAsignados[0].numdocidentidad);
      this.formEmo.get('apepaterno').setValue(this.personalAsignados[0].apepaterno);
      this.formEmo.get('apematerno').setValue(this.personalAsignados[0].apematerno);
      this.formEmo.get('nomtrabajador').setValue(this.personalAsignados[0].nomtrabajador);
      this.formEmo.get('nomarea').setValue(this.personalAsignados[0].desareas);
    } else {
     
      this.onClearDataPersonal();
      //this.formPersonal.reset();
    }

    console.log(this.personalAsignados)
  }

  onClearDataPersonal(){
    this.formEmo.get('numdocidentidad').setValue("");
    this.formEmo.get('apepaterno').setValue("");
    this.formEmo.get('apematerno').setValue("");
    this.formEmo.get('nomtrabajador').setValue("");
    this.formEmo.get('nomarea').setValue("");
  }

  onSearchPersonalAsignar() {
    this.selection.clear();
    console.log(this.searhInputAsignar);
    if (this.searhInputAsignar != null) {

      if (this.searhInputAsignar.trim() != '') {
        if (this.selectedBusquedaAsign == "Documento") {
          this.onListPersonalByDocNoExistProEmoAndUsuario(this.searhInputAsignar, this.codigoProgram);
          //this.getAllClientesByNombre(this.searhInputAsignar);
        }
        if (this.selectedBusquedaAsign == "Area") {
          this.onListPersonalByAreaNoExistProEmoAndUsuario(this.searhInputAsignar, this.codigoProgram);
          //this.getAllClientesByNombre(this.searhInputAsignar);
        }
      } else {
        //this.onListPersonalAsignar(this.codigoProgram);
      }

    } else {
      //this.getAllClientes();
      //this.onListPersonalAsignar(this.codigoProgram);
    }
  }


  onListPersonalByDocNoExistProEmo(dato: string, codprogram: number) {
    this.personalService.getAllPersonalByDocNoExistProEmo(dato, codprogram).subscribe(
      (result) => {

        this.personalAsignarData.data = result;
        this.personalAsignarData.paginator = this.paginatorpersonalAsignar;
        //console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onListPersonalByDocNoExistProEmoAndUsuario(dato: string, codprogram: number) {
    this.personalService.getAllPersonalByDocNoExistProEmoAndUsuario(dato, codprogram, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {

        this.personalAsignarData.data = result;
        this.personalAsignarData.paginator = this.paginatorpersonalAsignar;
        //console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onListPersonalByAreaNoExistProEmoAndUsuario(dato: string, codprogram: number) {
    this.personalService.getAllPersonalByAreaNoExistProEmoAndUsuario(dato, codprogram, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {

        this.personalAsignarData.data = result;
        this.personalAsignarData.paginator = this.paginatorpersonalAsignar;
        //console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onListPersonalAsignar(codprogram: number) {
    this.personalService.getAllPersonalDispByProEmo(codprogram).subscribe(
      (result) => {

        this.personalAsignarData.data = result;
        this.personalAsignarData.paginator = this.paginatorpersonalAsignar;
        //console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onListEmosByProgramacion(proemo: Proemo) {
    this.emoService.getAllEmoByProgram(proemo.id).subscribe(
      (result) => {
        this.emos = result;
        this.emoData.data = result;
        this.emoData.paginator = this.paginatorEmosReg;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }


  //CARGA DE DATOS

  onBuildFormCarga() {
    this.formCarga = this.formBuilder.group({
      codempresa: [''],
      codsucursal: ['']
    });
  }


  descargarPlanilla() {
    this.proemoService.getExcelPlantillaProEmo().subscribe(
      (result) => {
        const url = window.URL.createObjectURL(result);
        window.open(url);
      }, error => {
        console.log(error);
      }
    );
  }


  onInformeData() {

    this.errorService.getAllBackErrorProPersonal().subscribe(
      (result) => {
        this.listErrores = result;
        this.erroresData.data = result;
        this.erroresData.paginator = this.paginatorErrores;
        //this.closeCargaB();
      }, error => {
        console.log(error);
      }

    );

  }

  onFileSelected(event: { target: { files: File[]; }; }) {
    if (<File>event.target.files[0] != null) {
      this.selectedFile = <File>event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onProcesarData() {

    const Files = this.inputFile.nativeElement;
    this.selectedFile = Files.files[0];
    const ExcelFile: File = this.selectedFile;

    let codempresa = this.formCarga.get('codempresa').value;
    let codsucursal = this.formCarga.get('codsucursal').value;

    if (ExcelFile != null) {
      const formData: FormData = new FormData();
      formData.append('file', ExcelFile, ExcelFile.name);
      formData.append('codempresa', codempresa);
      formData.append('codsucursal', codsucursal);
      formData.append('usuario', this.usuarioService.getUsuarioSession());

      this.emoService.CargarExcelEmoProPersonal(formData).subscribe(
        (result) => {

          this.listErrores = result;

          if (this.listErrores.length > 0) {
            this.toastRejectAlert("Error en la Carga de datos :  Verificar Informe");
          } else {
            this.validarCarga = true;
            this.toastAcceptedAlert("Se Cargo la data con exito!");
            this.onListProgramacion();
            this.closeCargaB();
            
          }

          //this.closeCargaB();
        }, error => {
          this.toastRejectAlert("Error en la Carga de datos :  Favor de Validar");
          this.validarCarga = false;
          console.log(error);
        }

      );
    }

  }
  

  ngOnInit(): void {
    this.onBuildFormBusqueda();
    this.onBuildFormProEmo();
    this.onBuildFormEmo();
    this.onBuildFormCarga();
    this.onListEmpresa();
    this.onListProveedor();
    this.onListEvaluaciones();
    this.onListProgramacion();
  }
}
