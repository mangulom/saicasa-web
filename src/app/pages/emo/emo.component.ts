import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Dato } from 'src/app/models/dato';
import { Emo } from 'src/app/models/emo';
import { Empresa } from 'src/app/models/empresa';
import { Error } from 'src/app/models/error';
import { Proemo } from 'src/app/models/proemo';
import { Sucursal } from 'src/app/models/sucursal';
import { Tabladetalle } from 'src/app/models/tabladetalle';
import { DatoService } from 'src/app/services/dato.service';
import { EmoService } from 'src/app/services/emo.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ErrorService } from 'src/app/services/error.service';
import { PersonalService } from 'src/app/services/personal.service';
import { ProemoService } from 'src/app/services/proemo.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import { TablaService } from 'src/app/services/tabla.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-emo',
  templateUrl: './emo.component.html',
  styleUrls: ['./emo.component.css']
})
export class EmoComponent implements OnInit {

  public formEmo: FormGroup;
  public formCarga: FormGroup;

  public submittedEmo = false;
  public codigoProgram: number;

  public empresas: Empresa[];
  public sucursales: Sucursal[];
  public evaluaciones: Tabladetalle[];
  public proveedores: Tabladetalle[];

  public grupofactores: Tabladetalle[];
  public pressis: Tabladetalle[];
  public presdia: Tabladetalle[];
  public estnut: Tabladetalle[];
  public aptimed: Tabladetalle[];

  public dato: Dato = new Dato();

  public emoProPendientes: Emo[];
  public emoRealizados: Emo[];

  public selectedFile: File;
  @ViewChild('fileProducto') inputFile: ElementRef;

  public listErrores: Error[] = [];
  public validarCarga: boolean = false;

  public searhInputAsignar: string;
  public selectedBusquedaAsign: string = 'DNI';
  public searhInputProgramacion: string;
  public selectedBusquedaProgramacion: string = 'documento';

  proemoPenCol: string[] = ['Opciones', 'Empresa', 'Sede', 'Fecha', 'TipoEva', 'Proveedor'];
  proemoPenData = new MatTableDataSource();

  emoCol: string[] = ['Opciones', 'Empresa', 'Sede', 'Fecha', 'Documento', 'ApePat', 'ApeMat', 'Nombres', 'TipoEva', 'Proveedor'];
  emoData = new MatTableDataSource();

  erroresCol: string[] = ['Linea', 'Columna', 'Dato', 'Detalle'];
  erroresData = new MatTableDataSource();

  @ViewChild('paginatorEmoProPen', { static: true, read: MatPaginator }) paginatorEmoProPen: MatPaginator;
  @ViewChild('paginatorEmoRea', { static: true, read: MatPaginator }) paginatorEmoRea: MatPaginator;
  @ViewChild('paginatorErrores', { static: true, read: MatPaginator }) paginatorErrores: MatPaginator;

  @ViewChild('closeProgram') SubModalProgram: ElementRef;
  @ViewChild('closePrincipal') SubModalPrincipal: ElementRef;
  @ViewChild('closeCarga') SubmodalCarga: ElementRef;
  @ViewChild('closeErrores') SubmodalErrores: ElementRef;

  constructor(private empresaService: EmpresaService,
    private sucursalService: SucursalService,
    private usuarioService: UsuarioService,
    private proemoService: ProemoService,
    private emoService: EmoService,
    private errorService: ErrorService,
    private tablaService: TablaService,
    private personalService: PersonalService,
    private datoService: DatoService,
    private formBuilder: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef) { }

  private closeProgramSearch(): void {
    this.SubModalProgram.nativeElement.click();
  }

  private closePrincipal(): void {
    this.SubModalPrincipal.nativeElement.click();
  }

  private closeCargaB(): void {
    this.SubmodalCarga.nativeElement.click();
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

      codtipoeva: [''],
      codproveedor: [''],
      codempresacarg: [''],
      codcategoria: [''],
      codcargo: [''],
      fecha: [''],
      fechaprogram: [''],
      fechavencimiento: [''],
      fechavigencia: ['', Validators.required],
      codestado: [''],

      antpersonales: ['', Validators.required],
      antfamiliares: ['', Validators.required],
      alergiasram: ['', Validators.required],
      codgrpfact: ['', Validators.required],
      codpressis: ['', Validators.required],
      codpresdia: ['', Validators.required],
      peso: ['', Validators.required],
      talla: ['', Validators.required],
      imc: ['', Validators.required],
      codestnutri: ['', Validators.required],
      dxmuscesq: ['', Validators.required],
      dxraditor: ['', Validators.required],
      indineum: ['', Validators.required],
      audioider: ['', Validators.required],
      audioiizq: ['', Validators.required],
      dxexpiro: ['', Validators.required],
      hemoglo: ['', Validators.required],
      hemogra: ['', Validators.required],
      glucosa: ['', Validators.required],
      tgo: ['', Validators.required],
      tgp: ['', Validators.required],
      colesterol: ['', Validators.required],
      hdl: ['', Validators.required],
      ldl: ['', Validators.required],
      vldl: ['', Validators.required],
      triglice: ['', Validators.required],
      riescoron: ['', Validators.required],
      examcomorina: ['', Validators.required],
      dxoftalgene: ['', Validators.required],
      agudviscerca: ['', Validators.required],
      agudvislejos: ['', Validators.required],
      refraccion: ['', Validators.required],
      estereop: ['', Validators.required],
      testish: ['', Validators.required],
      dxelectrocar: ['', Validators.required],
      dxpsicologia: ['', Validators.required],
      dxexammedgen: ['', Validators.required],
      resummed: ['', Validators.required],
      resummedclinica: ['', Validators.required],
      recomend: ['', Validators.required],
      recomendclinica: ['', Validators.required],
      codaptitud: ['', Validators.required],
      restricciones: ['', Validators.required],

      nomarea: [''],
      numdocidentidad: ['', Validators.required],
      apepaterno: [''],
      apematerno: [''],
      nomtrabajador: [''],
      personales: ['']
    });
  }

  get g() {
    return this.formEmo.controls;
  }

  onSubmit() {
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

        console.log(this.formEmo.value);

        this.emoService.saveOne(this.formEmo.value).subscribe(
          (result) => {
            if (result) {
             
              //this.onListPersonalVacunado();
              this.getAllEmoRealizados();
              this.changeDetectorRefs.detectChanges();
              this.toastAcceptedAlert("Se registro con exito");
              this.onResetFormEmo();
              
              this.closePrincipal();
            } else {
              //this.closePrincipal();
            }
          }, error => {
            console.log(error);
          }
        );



      }
    })
  }


  onResetFormEmo() {
    this.submittedEmo = false;
    this.searhInputProgramacion = null;
    this.onResetListPrograma();
    this.formEmo.reset();
  }

  getAllEmoByPersonalDoc(filtro: string) {
    this.emoService.getAllEmoByPersonalDoc(filtro, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.emoProPendientes = result;
        this.proemoPenData.data = result;
        this.proemoPenData.paginator = this.paginatorEmoProPen;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  getAllEmoRealizados() {
    this.emoService.getAllEmoRealizados(this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.emoRealizados = result;
        this.emoData.data = result;
        this.emoData.paginator = this.paginatorEmoRea;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onResetListPrograma() {

    this.emoProPendientes = [];
    this.proemoPenData.data = [];
    this.proemoPenData.paginator = null;
  }

  onSearchProgramacionFilter(){

    if (this.searhInputProgramacion != null) {

      if (this.searhInputProgramacion.trim() != '') {
        if (this.selectedBusquedaProgramacion == "documento") {
          this.getAllEmoByPersonalDoc(this.searhInputProgramacion);
        } 
      } else {
        this.onResetListPrograma();
      }
    } else {
      this.onResetListPrograma();
    }

  }

  onUpdateEmo(emo: Emo){
    this.codigoProgram = null;

    this.emoService.getEmoById(emo.id).subscribe(
      (result) => {
        console.log(result);
        this.codigoProgram = result.codprogram;
        let nombrearea;
        if (result.personal != null) {
          nombrearea = result.personal.desareas;
        } else {
          nombrearea = "";
        }

        this.formEmo.patchValue({
          id: result.id,
          codigo: null,
          codempresa: result.codempresa,
          sede: result.sede,
          codprogram: result.codprogram,
          codempresapers: result.codempresapers,
          codpersonal: result.codpersonal,

          codtipoeva: result.programa.codeva,
          codproveedor: result.programa.codproveedor,
          codempresacarg: result.codempresacarg,
          codcategoria: result.codcategoria,
          codcargo: result.codcargo,
          fecha: result.fecha,
          fechaprogram: result.programa.fechaprogram,
          fechavencimiento: result.programa.fechavencimiento,
          fechavigencia: result.fechavigencia,
          codestado: result.codestado,

          antpersonales: result.antpersonales,
          antfamiliares: result.antpersonales,
          alergiasram: result.alergiasram,
          codgrpfact: result.codgrpfact,
          codpressis: result.codpressis,
          codpresdia: result.codpresdia,
          peso: result.peso,
          talla: result.talla,
          imc: result.imc,
          codestnutri: result.codestnutri,
          dxmuscesq: result.dxmuscesq,
          dxraditor: result.dxraditor,
          indineum: result.indineum,
          audioider: result.audioider,
          audioiizq: result.audioiizq,
          dxexpiro: result.dxexpiro,
          hemoglo: result.hemoglo,
          hemogra: result.hemogra,
          glucosa: result.glucosa,
          tgo: result.tgo,
          tgp: result.tgp,
          colesterol: result.colesterol,
          hdl: result.hdl,
          ldl: result.ldl,
          vldl: result.vldl,
          triglice: result.triglice,
          riescoron: result.riescoron,
          examcomorina: result.examcomorina,
          dxoftalgene: result.dxoftalgene,
          agudviscerca: result.agudviscerca,
          agudvislejos: result.agudvislejos,
          refraccion: result.refraccion,
          estereop: result.estereop,
          testish: result.testish,
          dxelectrocar: result.dxelectrocar,
          dxpsicologia: result.dxpsicologia,
          dxexammedgen: result.dxexammedgen,
          resummed: result.resummed,
          resummedclinica: result.resummedclinica,
          recomend: result.recomend,
          recomendclinica: result.recomendclinica,
          codaptitud: result.codaptitud,
          restricciones: result.restricciones,

          nomarea: nombrearea,
          numdocidentidad: result.personal.numdocidentidad,
          apepaterno: result.personal.apepaterno,
          apematerno: result.personal.apematerno,
          nomtrabajador: result.personal.nomtrabajador,

          personales: null

        });

      }, error => {
        console.log(error);
      }
    );

  }

  onSelectProgramacion(emo: Emo){
    this.codigoProgram = null;
    this.emoService.getEmoById(emo.id).subscribe(
      (result) => {
        console.log(result);
        this.codigoProgram = result.codprogram;
        let nombrearea;
        if (result.personal != null) {
          nombrearea = result.personal.desareas;
        } else {
          nombrearea = "";
        }

        this.formEmo.patchValue({
          id: result.id,
          codigo:null,
          codempresa: result.codempresa,
          sede: result.sede,
          codprogram: result.codprogram,
          codempresapers: result.codempresapers,
          codpersonal: result.codpersonal,

          codtipoeva: result.programa.codeva,
          codproveedor: result.programa.codproveedor,
          codempresacarg: result.codempresacarg,
          codcategoria: result.codcategoria,
          codcargo: result.codcargo,
          fecha: this.dato.fecha,
          fechaprogram: result.programa.fechaprogram,
          fechavencimiento: result.programa.fechavencimiento,
          codestado: result.codestado,

          antpersonales: result.antpersonales,
          antfamiliares: result.antpersonales,
          alergiasram: result.alergiasram,
          codgrpfact: result.codgrpfact,
          codpressis: result.codpressis,
          codpresdia: result.codpresdia,
          peso: result.peso,
          talla: result.talla,
          imc: result.imc,
          codestnutri: result.codestnutri,
          dxmuscesq: result.dxmuscesq,
          dxraditor: result.dxraditor,
          indineum: result.indineum,
          audioider: result.audioider,
          audioiizq: result.audioiizq,
          dxexpiro: result.dxexpiro,
          hemoglo: result.hemoglo,
          hemogra: result.hemogra,
          glucosa: result.glucosa,
          tgo: result.tgo,
          tgp: result.tgp,
          colesterol: result.colesterol,
          hdl: result.hdl,
          ldl: result.ldl,
          vldl: result.vldl,
          triglice: result.triglice,
          riescoron: result.riescoron,
          examcomorina: result.examcomorina,
          dxoftalgene: result.dxoftalgene,
          agudviscerca: result.agudviscerca,
          agudvislejos: result.agudvislejos,
          refraccion: result.refraccion,
          estereop: result.estereop,
          testish: result.testish,
          dxelectrocar: result.dxelectrocar,
          dxpsicologia: result.dxpsicologia,
          dxexammedgen: result.dxexammedgen,
          resummed: result.resummed,
          resummedclinica: result.resummedclinica,
          recomend: result.recomend,
          recomendclinica: result.recomendclinica,
          codaptitud: result.codaptitud,
          restricciones: result.restricciones,

          nomarea: nombrearea,
          numdocidentidad: result.personal.numdocidentidad,
          apepaterno: result.personal.apepaterno,
          apematerno: result.personal.apematerno,
          nomtrabajador: result.personal.nomtrabajador,

          personales: null

        });

        this.closeProgramSearch();

      }, error => {
        console.log(error);
      }
    );
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

  onShowDatos() {
    this.datoService.getDatos().subscribe(
      (result) => {
        this.dato = result;
      }, error => {
        console.log(error);
      }

    );
  }

  //Formulas
  onChangeFormularIMC(){
    if (this.formEmo.get('peso').value != null && this.formEmo.get('talla').value != null){
      let peso: number;
      let talla: number;
      let imc: number;
      peso = this.formEmo.get('peso').value;
      talla = this.formEmo.get('talla').value;
      imc = (peso / (Math.pow(talla, 2)));
      if (imc != null){
        this.formEmo.get('imc').setValue(imc.toFixed(2));
      }
      
    }
  }

  //Listas Combo box

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

  onListGrupFact() {
    this.tablaService.getAllGrupofact().subscribe(
      (result) => {
        this.grupofactores = result;
      }, error => {
        console.log(error);
      }
    );
  }

  onListPresis() {
    this.tablaService.getAllPresis().subscribe(
      (result) => {
        this.pressis = result;
      }, error => {
        console.log(error);
      }
    );
  }

  onListPredia() {
    this.tablaService.getAllPresdia().subscribe(
      (result) => {
        this.presdia = result;
      }, error => {
        console.log(error);
      }
    );
  }
  
  onListEstNut() {
    this.tablaService.getAllEstNu().subscribe(
      (result) => {
        this.estnut = result;
      }, error => {
        console.log(error);
      }
    );
  }

  onListAptiMed() {
    this.tablaService.getAllAptitudMed().subscribe(
      (result) => {
        this.aptimed = result;
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
    this.emoService.getExcelPlantillaEmo().subscribe(
      (result) => {
        const url = window.URL.createObjectURL(result);
        window.open(url);
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

  onProcesarData(){

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

      this.emoService.CargarExcelEmoPersonal(formData).subscribe(
        (result) => {

          this.listErrores = result;

          if (this.listErrores.length > 0) {
            this.toastRejectAlert("Error en la Carga de datos :  Verificar Informe");
          } else {
            this.validarCarga = true;
            this.toastAcceptedAlert("Se Cargo la data con exito!");
            this.getAllEmoRealizados();
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

  onInformeData() {

    this.errorService.getAllBackErrorEmo().subscribe(
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
    this.onBuildFormEmo();
    this.onBuildFormCarga();
    this.onShowDatos();
    this.getAllEmoRealizados();
    this.onListEmpresa();
    this.onListEvaluaciones();
    this.onListProveedor();
    this.onListGrupFact();
    this.onListPresis();
    this.onListPredia();
    this.onListEstNut();
    this.onListAptiMed();
  }

}
