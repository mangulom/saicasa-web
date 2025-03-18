import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Personal } from 'src/app/models/personal';
import { Medidacorrectiva } from 'src/app/models/medidacorrectiva';
import { Tabladetalle } from 'src/app/models/tabladetalle';
import { AccidenteService } from 'src/app/services/accidente.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { MaearchivoService } from 'src/app/services/maearchivo.service';
import { PersonalService } from 'src/app/services/personal.service';
import { SucursalService } from 'src/app/services/sucursal.service';
import { TablaService } from 'src/app/services/tabla.service';
import { MedidacorrectivaService } from 'src/app/services/medidacorrectiva.service';
import Swal from 'sweetalert2';
import { Empresa } from 'src/app/models/empresa';
import { Sucursal } from 'src/app/models/sucursal';
import { Accidente } from 'src/app/models/accidente';
import { Medarchivo } from 'src/app/models/medarchivo';
import { DatoService } from 'src/app/services/dato.service';
import { Dato } from 'src/app/models/dato';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-medidacorrectiva',
  templateUrl: './medidacorrectiva.component.html',
  styleUrls: ['./medidacorrectiva.component.css']
})
export class MedidacorrectivaComponent implements OnInit {

  public formAccidente: FormGroup;
  public formMedidaCorrectiva: FormGroup;
  public searchFormPersonal: FormGroup;
  public formPersonal: FormGroup;
  public formFileCarga: FormGroup;

  public tempCodAcci: number;
  public temCodMed: number;
  public submitted = false;
  public searchInput: string;

  public searhInputAsignar: string;
  public selectedBusquedaAsign: string = "Documento";

  public empresas: Empresa[];
  public accidente: Accidente = new Accidente();
  public accidentes: Accidente[];
  public sucursales: Sucursal[];
  public personales: Personal[] = [];
  public dato: Dato = new Dato();

  public tiposAccidentes: Tabladetalle[];
  public gravedadAccidentes: Tabladetalle[];

  public selectedFileMedida: File;
  @ViewChild('fileMedida') inputFileMedida: ElementRef;

  accidenteCol: string[] = ['Opciones', 'Codigo', 'DNI', 'Nombre', 'Gravedad', 'TipoAcc', 'Estado'];
  accidenteData = new MatTableDataSource();

  medidaCorrectivaCol: string[] = ['Opciones', 'Descripcion', 'Responsable', 'FechaReg', 'FechaLimi'];
  medidaCorrectivaData = new MatTableDataSource();

  MedidaArchivoCol: string[] = ['Opciones', 'Nombre'];
  MedidaArchivoData = new MatTableDataSource();

  personalAsignarCol: string[] = ['Opciones', 'Nombre', 'DNI', 'Cargo'];
  personalAsignarData = new MatTableDataSource<Personal>();

  @ViewChild('paginatorPersonal', { static: true, read: MatPaginator }) paginatorPersonal: MatPaginator;
  @ViewChild('paginatorArchivos', { static: true, read: MatPaginator }) paginatorArchivos: MatPaginator;
  @ViewChild('paginatorMedida', { static: true, read: MatPaginator }) paginatorMedida: MatPaginator;
  @ViewChild('paginatorAccidentes', { static: true, read: MatPaginator }) paginatorAccidentes: MatPaginator;

  @ViewChild('closebutton') modal: ElementRef;
  @ViewChild('closebuttonMedida') modalMedida: ElementRef;
  @ViewChild('closeSubbutton') Submodal: ElementRef;
  @ViewChild('closeCarga') SubmodalCarga: ElementRef;

  constructor(private empresaService: EmpresaService,
    private maeArchivoService: MaearchivoService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private tablaService: TablaService,
    private datoService: DatoService,
    private sucursalService: SucursalService,
    private personalService: PersonalService,
    private accidenteService: AccidenteService,
    private medidaCorrectivaService: MedidacorrectivaService,
    private changeDetectorRefs: ChangeDetectorRef) { }


  private closeSubMedida(): void {
    this.modalMedida.nativeElement.click();
  }

  private closeSubModal(): void {
    this.Submodal.nativeElement.click();
  }

  get f() {
    return this.formAccidente.controls;
  }

  get g() {
    return this.formMedidaCorrectiva.controls;
  }

  onSearchPersonal() {
  
    if (this.searhInputAsignar != null && this.searhInputAsignar != "") {
      if (this.selectedBusquedaAsign == "Documento") {
        this.onListPersonalByDoc(this.searhInputAsignar);
      }
      if (this.selectedBusquedaAsign == "Nombres") {
        this.onListPersonalByNombreLike(this.searhInputAsignar);
      }      
    } else {
  
    }
  }

  selectPersonal(personal: Personal) {
    if (personal.numdocidentidad != null && personal.numdocidentidad != "") {
      this.onFindPersonal(personal.numdocidentidad);
    } else {
      alert("Error en el proceso de seleccion de Personal"); 
    }
  }

  onFindPersonal(documento: string) {
    this.personalService.getPersonalByDoc(documento, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {

        this.formMedidaCorrectiva.get('codempresapers').setValue(result.codempresa);
        this.formMedidaCorrectiva.get('codpersonal').setValue(result.codpersonal);

        this.formMedidaCorrectiva.get('apepaterno').setValue(result.apepaterno);
        this.formMedidaCorrectiva.get('apematerno').setValue(result.apematerno);
        this.formMedidaCorrectiva.get('nomtrabajador').setValue(result.nomtrabajador);
        this.formMedidaCorrectiva.get('numdocidentidad').setValue(result.numdocidentidad);
        this.formMedidaCorrectiva.get('nomarea').setValue(result.desareas);

        this.closeSubModal();
        console.log(result);

      }, error => {
        console.log(error);
      }
    );
  }

  onListPersonal() {
      this.personalService.getAllPersonalTop().subscribe(
      (result) => {

        this.personalAsignarData.data = result;
        this.personalAsignarData.paginator = this.paginatorPersonal;
        //console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onListPersonalByDoc(documento: string) {
    this.personalService.getAllPersonalByDoc(documento, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {

        if(result.length <= 0){
          this.toastRejectAlert("No se encontro Personal");
        }

        this.personalAsignarData.data = result;
        this.personalAsignarData.paginator = this.paginatorPersonal;
        //console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onListPersonalByNombreLike(search: string) {
    this.personalService.getAllPersonalByNombreLike(search, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.personalAsignarData.data = result;
        this.personalAsignarData.paginator = this.paginatorPersonal;
      }, error => {
        console.log(error);
      }
    );
  }


  onResetFormAll() {
    this.submitted = false;
    this.searchInput = null;
    this.formAccidente.reset();
    this.formMedidaCorrectiva.reset();
  }


  //ACCIDENTES

  onBuildFormAccidente() {

    this.formAccidente = this.formBuilder.group({

      id: [''],
      codigo: [''],
      codempresa: [{ value: '', disabled: true }],
      sede: [{ value: '', disabled: true }],
      codempresapers: [{ value: '', disabled: true }],
      codpersonal: [{ value: '', disabled: true }],
      mes: [{ value: '', disabled: true }],
      fechaacci: [{ value: '', disabled: true }],
      horaacci: [{ value: '', disabled: true }],
      fechareg: [{ value: '', disabled: true }],
      horareg: [{ value: '', disabled: true }],
      fechainiturn: [{ value: '', disabled: true }],
      horainiturn: [{ value: '', disabled: true }],
      lugaracci: [{ value: '', disabled: true }],
      nrohrstrab: [{ value: '', disabled: true }],
      actividadacci: [{ value: '', disabled: true }],
      graveacc: [{ value: '', disabled: true }],
      tipoacci: [{ value: '', disabled: true }],
      nrotrabafec: [{ value: '', disabled: true }],
      fechainidm: [{ value: '', disabled: true }],
      fechafindm: [{ value: '', disabled: true }],
      diasdm: [{ value: '', disabled: true }],
      diagnacci: [{ value: '', disabled: true }],
      descacci: [{ value: '', disabled: true }],
      partcuerples: [{ value: '', disabled: true }],
      tipoless: [{ value: '', disabled: true }],
      agentecaus: [{ value: '', disabled: true }],
      cie: [{ value: '', disabled: true }],
      hc: [{ value: '', disabled: true }],
      estado: [{ value: '', disabled: true }],

      apepaterno: [{ value: '', disabled: true }],
      apematerno: [{ value: '', disabled: true }],
      nomtrabajador: [{ value: '', disabled: true }],
      numdocidentidad: [{ value: '', disabled: true }],
      telefono: [{ value: '', disabled: true }],
      fechanac: [{ value: '', disabled: true }],
      edad: [{ value: '', disabled: true }],
      sexo: [{ value: '', disabled: true }],
      direccion: [{ value: '', disabled: true }],
      distrito: [{ value: '', disabled: true }],
      puesto: [{ value: '', disabled: true }],
      nomarea: [{ value: '', disabled: true }],
      fechaingreso: [{ value: '', disabled: true }],
      antiguedad: [{ value: '', disabled: true }],
      tipoplanilla: [{ value: '', disabled: true }],
      tiempoexper: [{ value: '', disabled: true }],
      condicion: [{ value: '', disabled: true }],
      persede: [{ value: '', disabled: true }],
      perempresa: [{ value: '', disabled: true }]

    });
  }

  onChargeAccidente(accidente: Accidente) {

    this.accidenteService.getAccidenteById(accidente.id).subscribe(
      (result) => {
        this.accidente = result;
        this.tempCodAcci = result.id;

        this.onListMedidaCorrectiva(this.accidente);

        this.formAccidente.patchValue({
          id: this.accidente.id,
          codigo: this.accidente.codigo,
          codempresa: this.accidente.codempresa,
          sede: this.accidente.sede,
          codempresapers: this.accidente.codempresapers,
          codpersonal: this.accidente.codpersonal,
          mes: this.accidente.mes,
          fechaacci: this.accidente.fechaacci,
          horaacci: this.accidente.horaacci,
          fechareg: this.accidente.fechareg,
          horareg: this.accidente.horareg,
          fechainiturn: this.accidente.fechainiturn,
          horainiturn: this.accidente.horainiturn,
          lugaracci: this.accidente.lugaracci,
          nrohrstrab: this.accidente.nrohrstrab,
          actividadacci: this.accidente.actividadacci,
          graveacc: this.accidente.graveacc,
          tipoacci: this.accidente.tipoacci,
          nrotrabafec: this.accidente.nrotrabafec,
          fechainidm: this.accidente.fechainidm,
          fechafindm: this.accidente.fechafindm,
          diasdm: this.accidente.diasdm,
          diagnacci: this.accidente.diagnacci,
          descacci: this.accidente.descacci,
          partcuerples: this.accidente.partcuerples,
          tipoless: this.accidente.tipoless,
          agentecaus: this.accidente.agentecaus,
          cie: this.accidente.cie,
          hc: this.accidente.hc,
          estado: this.accidente.estado,

          apepaterno: this.accidente.personal.apepaterno,
          apematerno: this.accidente.personal.apematerno,
          nomtrabajador: this.accidente.personal.nomtrabajador,
          numdocidentidad: this.accidente.personal.numdocidentidad,
          telefono: this.accidente.personal.numtelefono,
          fechanac: this.accidente.personal.fecnacimiento,
          edad: this.accidente.personal.edad,
          sexo: this.accidente.personal.sexo,
          direccion: this.accidente.personal.desdireccion,
          distrito: this.accidente.personal.desdistrito,
          puesto: this.accidente.personal.descargo,
          nomarea: this.accidente.personal.desareas,
          fechaingreso: this.accidente.personal.fecingreso,
          antiguedad: null,
          tipoplanilla: this.accidente.personal.destipoplanilla,
          tiempoexper: "",
          condicion: "",
          empresa: this.accidente.personal.empresa,
          perempresa: this.accidente.personal.empresa,
          persede: this.accidente.personal.nomsucursal,
          personales: null
        });

      }, error => {
        console.log(error);
      }
    );
  }


  onListAccidente() {
    this.accidenteService.getAllAccidente(this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.accidentes = result;
        this.accidenteData.data = result;
        this.accidenteData.paginator = this.paginatorAccidentes;
        console.log(this.accidentes);
      }, error => {
        console.log(error);
      }
    );
  }

  onListAccidenteByCodigo(codigo: string) {
    this.accidenteService.getAllAccidentesByCodigo(codigo, this.usuarioService.getUsuarioSession()).subscribe(
      (result) => {
        this.accidenteData.data = result;
        this.accidenteData.paginator = this.paginatorAccidentes;
        console.log(this.accidentes);
      }, error => {
        console.log(error);
      }
    );
  }

  onSearchAccidente() {
    //this.formPersonal.reset();
    if (this.searchInput != null && this.searchInput != "") {
      this.onListAccidenteByCodigo(this.searchInput);
    } else {
      //this.formPersonal.reset();
    }
  }

  //MEDIDA

  onBuildFormMedidaCorrectiva() {
    this.formMedidaCorrectiva = this.formBuilder.group({
      id: [''],
      codigo: [''],
      codacci: [''],
      codempresapers: [''],
      codpersonal: [''],
      descmedida: ['', Validators.required],
      fechareg: ['', Validators.required],
      fechalim: ['', Validators.required],

      nomarea: [''],
      numdocidentidad: [''],
      apepaterno: [''],
      apematerno: [''],
      nomtrabajador: ['']
    });
  }

  onSubmit() {

    this.submitted = true;

    if (this.formMedidaCorrectiva.get("numdocidentidad").value == null || this.formMedidaCorrectiva.get("numdocidentidad").value == ""){
      this.toastRejectAlert("Seleccione Personal");
      return;
    }

    if (this.formMedidaCorrectiva.invalid) {
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

        this.formMedidaCorrectiva.get("codacci").setValue(this.tempCodAcci);

        this.medidaCorrectivaService.saveMedidaCorrectiva(this.formMedidaCorrectiva.value).subscribe(
          (result) => {
            if (result) {
              this.onResetFormMedida();
              this.onListMedidaCorrectivaByCodAcci(result.codacci);
              this.changeDetectorRefs.detectChanges();
              this.toastAcceptedAlert("Se registro con exito");
              this.closeSubMedida();
            } else {
              this.closeSubMedida();
            }
          }, error => {
            console.log(error);
          }
        );


      }
    })

  }

  onResetFormMedida(){
    this.formMedidaCorrectiva.reset();
    this.submitted = false;
    this.searhInputAsignar = null;
    this.personalAsignarData.data = [];
    this.formMedidaCorrectiva.get('fechareg').setValue(this.dato.fecha);
  }

  deleteById(medidacorrectiva: Medidacorrectiva) {
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

        this.medidaCorrectivaService.deleteMedidacorrectivaById(medidacorrectiva.id).subscribe(
          (result) => {
            this.onListMedidaCorrectivaByCodAcci(medidacorrectiva.codacci)
            console.log(result);
          }, error => {
            console.log(error);
          }
        );


      }
    })
  }

  onListMedidaCorrectiva(accidente: Accidente) {
    this.medidaCorrectivaService.getAllMedidasByAccidente(accidente.id).subscribe(
      (result) => {
        this.medidaCorrectivaData.data = result;
        this.medidaCorrectivaData.paginator = this.paginatorMedida;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onListMedidaCorrectivaByCodAcci(codacci: number) {
    this.medidaCorrectivaService.getAllMedidasByAccidente(codacci).subscribe(
      (result) => {
        this.medidaCorrectivaData.data = result;
        this.medidaCorrectivaData.paginator = this.paginatorMedida;
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  //ARCHIVOS

  onBuildFormFileCarga() {
    this.formFileCarga = this.formBuilder.group({
      codmedida: [''],
      file: ['']
    });
  }

  onListMedidaArchivos(medida: Medidacorrectiva){
    console.log(medida);
    this.maeArchivoService.getAllArchivosByMed(medida.id).subscribe(
      (result) => {
        this.MedidaArchivoData.data = result;
        this.MedidaArchivoData.paginator = this.paginatorArchivos;
        this.temCodMed = medida.id;
        //this.formFileCarga.get('codacci').setValue(accidente.id);
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }

  onListMedidaArchivosByid(id: number) {
    this.maeArchivoService.getAllArchivosByMed(id).subscribe(
      (result) => {

        this.MedidaArchivoData.data = result;
        this.MedidaArchivoData.paginator = this.paginatorArchivos;
        this.changeDetectorRefs.markForCheck();
        console.log(result);
      }, error => {
        console.log(error);
      }
    );
  }


  onFileCharger() {

    const Files = this.inputFileMedida.nativeElement;
    this.selectedFileMedida = Files.files[0];
    const ExcelFile: File = this.selectedFileMedida;

    //let codprocapa = this.formFileCarga.get('codprocapa').value;

    if (ExcelFile != null) {
      const formData: FormData = new FormData();
      formData.append('file', ExcelFile, ExcelFile.name);
      formData.append('codmed', this.temCodMed.toString());

      this.medidaCorrectivaService.CargarFileMedida(formData).subscribe(
        (result) => {
          this.onListMedidaArchivosByid(this.temCodMed);
          console.log(result);
        }, error => {
          console.log(error);
        }
      );
    }

  }

  onFileSelectedMedida(event: { target: { files: File[]; }; }) {
    if (<File>event.target.files[0] != null) {
      this.selectedFileMedida = <File>event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFileMedida);
    }
  }

  descargarFile(archi: Medarchivo) {
    console.log(archi.archivo);
    this.maeArchivoService.getMedidaOneArchivo(archi.archivo.nombre).subscribe(
      (result) => {

        const a = document.createElement('a');
        document.body.appendChild(a);
        //const blob: any = new Blob([result], { type: 'octet/stream' });
        const url = window.URL.createObjectURL(result);
        a.href = url;
        a.download = archi.archivo.nombre;
        a.click();
        window.URL.revokeObjectURL(url);
      }, error => {
        console.log(error);
      }
    );
  }

  deleteByIdMedidaArchivo(archi: Medarchivo) {
    this.maeArchivoService.deleteMedidaArchivoById(archi.id).subscribe(
      (result) => {
        this.onListMedidaArchivosByid(archi.codmed);
        this.changeDetectorRefs.markForCheck();
      }, error => {
        console.log(error);
      }
    );
  }

  //VARIABLES

  onShowDatos() {
    this.datoService.getDatos().subscribe(
      (result) => {
        this.dato = result;
      }, error => {
        console.log(error);
      }

    );
  }

  onListTipoAccidente() {
    this.tablaService.getAllTipoAccidente().subscribe(
      (result) => {
        this.tiposAccidentes = result;
      }, error => {
        console.log(error);
      }
    );
  }

  onListGravedadAccidente() {
    this.tablaService.getAllGreavedaAccidente().subscribe(
      (result) => {
        this.gravedadAccidentes = result;
      }, error => {
        console.log(error);
      }
    );
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



  ngOnInit(): void {
    this.onBuildFormAccidente();
    this.onBuildFormMedidaCorrectiva();
    this.onBuildFormFileCarga();
    this.onShowDatos();
    //this.onListPersonal();
    this.onListEmpresa();
    this.onListAccidente();
    this.onListTipoAccidente();
    this.onListGravedadAccidente();
  }

}
