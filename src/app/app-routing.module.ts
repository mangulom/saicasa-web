import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { AuthGuard } from './guards/auth.guard';
import { PrincipalComponent } from './pages/principal/principal.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { MenuComponent } from './pages/menu/menu.component';
import { TablaComponent } from './pages/tabla/tabla.component';
import { AccidenteComponent } from './pages/accidente/accidente.component';
import { VacunacionComponent } from './pages/vacunacion/vacunacion.component';
import { ProvacunacionComponent } from './pages/provacunacion/provacunacion.component';
import { ExternoComponent } from './pages/externo/externo.component';
import { VacunoproComponent } from './pages/vacunopro/vacunopro.component';
import { RptvaxperComponent } from './pages/rptvaxper/rptvaxper.component';
import { RptvaxareaComponent } from './pages/rptvaxarea/rptvaxarea.component';
import { GrupoareaComponent } from './pages/grupoarea/grupoarea.component';
import { RptvaxcampComponent } from './pages/rptvaxcamp/rptvaxcamp.component';
import { ProemoComponent } from './pages/proemo/proemo.component';
import { EmoComponent } from './pages/emo/emo.component';
import { EmosemaforoComponent } from './pages/emosemaforo/emosemaforo.component';
import { EmorptaptimedComponent } from './pages/emorptaptimed/emorptaptimed.component';
import { EmorptinformedComponent } from './pages/emorptinformed/emorptinformed.component';
import { EmorptconsultaComponent } from './pages/emorptconsulta/emorptconsulta.component';
import { EmorptparanormaComponent } from './pages/emorptparanorma/emorptparanorma.component';
import { ProcapacitacionComponent } from './pages/procapacitacion/procapacitacion.component';
import { CapacitacionComponent } from './pages/capacitacion/capacitacion.component';
import { CaparpthistxperComponent } from './pages/caparpthistxper/caparpthistxper.component';
import { CaparptoblignoasisComponent } from './pages/caparptoblignoasis/caparptoblignoasis.component';
import { CaparptxvencerComponent } from './pages/caparptxvencer/caparptxvencer.component';
import { CaparptprogramasisComponent } from './pages/caparptprogramasis/caparptprogramasis.component';
import { CaparptprogrampendComponent } from './pages/caparptprogrampend/caparptprogrampend.component';
import { MedidacorrectivaComponent } from './pages/medidacorrectiva/medidacorrectiva.component';
import { LevantamientoComponent } from './pages/levantamiento/levantamiento.component';
import { DiasdmComponent } from './pages/diasdm/diasdm.component';
import { AccirptconsultaComponent } from './pages/accirptconsulta/accirptconsulta.component';
import { AccirpttotalComponent } from './pages/accirpttotal/accirpttotal.component';
import { Politica } from './models/politica';
import { Menu } from './models/menu';
import { PoliticaComponent } from './pages/politica/politica.component';
import { ProcomiteComponent } from './pages/procomite/procomite.component';
import { MatrizComponent } from './pages/matriz/matriz.component';
import { Plananual } from './models/plananual';
import { PlananualComponent } from './pages/plananual/plananual.component';
import { ProeppsComponent } from './pages/proepps/proepps.component';
import { EppsComponent } from './pages/epps/epps.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'usuario',
    component: UsuarioComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'perfil',
    component: PerfilComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'accidente',
    component: AccidenteComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'provacunacion',
    component: ProvacunacionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'vacunacion',
    component: VacunacionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'vacunopro',
    component: VacunoproComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'rptvaxper',
    component: RptvaxperComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'rptvaxarea',
    component: RptvaxareaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'menu',
    component: MenuComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tabla',
    component: TablaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'externo',
    component: ExternoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'grupoarea',
    component: GrupoareaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'rptvacucamp',
    component: RptvaxcampComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'proemo',
    component: ProemoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'emo',
    component: EmoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'emosemaforo',
    component: EmosemaforoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'emorptaptimed',
    component: EmorptaptimedComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'emorptinformed',
    component: EmorptinformedComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'emorptconsulta',
    component: EmorptconsultaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'emorptparanorma',
    component: EmorptparanormaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'procapacitacion',
    component: ProcapacitacionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'capacitacion',
    component: CapacitacionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'caparpthistxper',
    component: CaparpthistxperComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'caparptoblinoasis',
    component: CaparptoblignoasisComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'caparptxvencer',
    component: CaparptxvencerComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'caparptprogramasis',
    component: CaparptprogramasisComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'caparptprogrampend',
    component: CaparptprogrampendComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'medidacorrectiva',
    component: MedidacorrectivaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'levantamiento',
    component: LevantamientoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'diasdm',
    component: DiasdmComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'accirptconsulta',
    component: AccirptconsultaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'accirpttotal',
    component: AccirpttotalComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'politica',
    component: PoliticaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'matriz',
    component: MatrizComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'plananual',
    component: PlananualComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'proepps',
    component: ProeppsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'epps',
    component: EppsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'procomite',
    component: ProcomiteComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'menu',
    component: MenuComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'principal',
    component: PrincipalComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
