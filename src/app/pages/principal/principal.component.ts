import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  constructor(private usuarioService: UsuarioService,
    private router: Router) { }

  ngOnInit(): void {
    if(!this.usuarioService.getUsuarioSession()){
      this.router.navigate(['/login']);
    }
  }

}
