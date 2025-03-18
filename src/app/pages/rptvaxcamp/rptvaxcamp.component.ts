import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VacunacionService } from 'src/app/services/vacunacion.service';

@Component({
  selector: 'app-rptvaxcamp',
  templateUrl: './rptvaxcamp.component.html',
  styleUrls: ['./rptvaxcamp.component.css']
})
export class RptvaxcampComponent implements OnInit {

  public fechaini: string;
  public fechafin: string;

  constructor(private vacunacionService: VacunacionService,
    private usuarioService: UsuarioService) { }

  ngOnInit(): void {
  }


  onSearchFiltro() {
    
    console.log(this.fechaini);
    console.log(this.fechafin);
    if (this.fechaini != null || this.fechafin!= null) {

      this.onSearch(this.fechaini, this.fechafin);
    }

  }

  onSearch(fechaini: string , fechafin: string){
 
    this.vacunacionService.getFileExportCamp(fechaini, fechafin, this.usuarioService.getUsuarioSession()).subscribe(
        (result) => {
          const url = window.URL.createObjectURL(result);
          window.open(url);
        }, error => {
          console.log(error);
        }
      );
    }

}
