import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Area } from 'src/app/models/area';
import { Tabladetalle } from 'src/app/models/tabladetalle';
import { AreaService } from 'src/app/services/area.service';
import { TablaService } from 'src/app/services/tabla.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grupoarea',
  templateUrl: './grupoarea.component.html',
  styleUrls: ['./grupoarea.component.css']
})
export class GrupoareaComponent implements OnInit {

  public formArea: FormGroup;
  public formAreaSearch: FormGroup;
  public submitted = false;

  public searchInput: string;
  public selectedBusqueda: string = 'Nombre';

  public area: Area = new Area();
  public areas: Area[];
  public nomarea: string;

  public  grupoareas: Tabladetalle[];

  areasCol: string[] = ['Opciones', 'Descripcion'];
  areasData = new MatTableDataSource();

  @ViewChild('paginatorareas', { static: true, read: MatPaginator }) paginatorareas: MatPaginator;
  @ViewChild('closeArea') modalArea: ElementRef;


  constructor(private areaService: AreaService,
    private tablaService: TablaService, 
    private formBuilder: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef) { }


  //Search grupo area
  onBuildSearchArea() {
    this.formAreaSearch = this.formBuilder.group({
      dato: ['']
    });
  }

  onSearchArea() {
    //this.formPersonal.reset();
    if (this.searchInput != null && this.searchInput != "") {
      
      //this.onFindPersonal(this.searchInput);
      this.onListAreasByNombre(this.searchInput);
    } else {
      //this.formPersonal.reset();
      this.onListAreas();
    }
  }

  private closeModalArea(): void {
    this.modalArea.nativeElement.click();
  }

  onBuildFormArea() {
    this.formArea = this.formBuilder.group({
      codempresa: [''],
      numverareas: [''],
      codareas: [''],
      codareassup: [''],
      desareas: [''],
      numnivel: [''],
      indbaja: [''],
      gpoareas: ['']
    });
  }

  get f() {
    return this.formArea.controls;
  }


  onResetFormArea() {
    this.submitted = false;
    this.formArea.reset();
  }

  onSubmit() {
    this.submitted = true;
    if (this.formArea.invalid) {
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


        this.areaService.saveArea(this.formArea.value).subscribe(
          (result) => {
            if (result) {
              this.onResetFormArea();
              this.onListAreas();
              this.changeDetectorRefs.detectChanges();
              this.toastAcceptedAlert("Se registro con exito");
              this.closeModalArea();
            } else {
              this.closeModalArea();
            }
          }, error => {
            console.log(error);
          }
        );

      }
    })
  }

  onUpdateArea(area: Area){

    this.areaService.getAreaById(area.codempresa, area.numverareas, area.codareas).subscribe(
      (result) => {
        this.formArea.patchValue({
          codempresa: result.codempresa,
          numverareas: result.numverareas,
          codareas: result.codareas,
          codareassup: result.codareassup,
          desareas: result.desareas,
          numnivel: result.numnivel,
          indbaja: result.indbaja,
          gpoareas: result.gpoareas

        });       
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

  onListAreasByNombre(nombre: string) {
    this.areaService.getAllCabAreasByNombre(nombre).subscribe(
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


  onListGrupoAreas() {
    this.tablaService.getAllGrupoArea().subscribe(
      (result) => {
        this.grupoareas = result;
        console.log(result);
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


  ngOnInit(): void {
    this.onBuildFormArea();
    this.onListAreas();
    this.onListGrupoAreas();
  }

}
