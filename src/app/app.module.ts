import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './pages/login/login.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { PrincipalComponent } from './pages/principal/principal.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { MenuComponent } from './pages/menu/menu.component';
import { TablaComponent } from './pages/tabla/tabla.component';
import { AccidenteComponent } from './pages/accidente/accidente.component';
import { VacunacionComponent } from './pages/vacunacion/vacunacion.component';
import { ProvacunacionComponent } from './pages/provacunacion/provacunacion.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
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
import { TokenInterceptor } from './interceptors/token.interceptor';
import { MedidacorrectivaComponent } from './pages/medidacorrectiva/medidacorrectiva.component';
import { LevantamientoComponent } from './pages/levantamiento/levantamiento.component';
import { DiasdmComponent } from './pages/diasdm/diasdm.component';
import { AccirptconsultaComponent } from './pages/accirptconsulta/accirptconsulta.component';
import { AccirpttotalComponent } from './pages/accirpttotal/accirpttotal.component';
import { PoliticaComponent } from './pages/politica/politica.component';
import { ProcomiteComponent } from './pages/procomite/procomite.component';
import { MatrizComponent } from './pages/matriz/matriz.component';
import { PlananualComponent } from './pages/plananual/plananual.component';
import { ProeppsComponent } from './pages/proepps/proepps.component';
import { EppsComponent } from './pages/epps/epps.component'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsuarioComponent,
    PrincipalComponent,
    PerfilComponent,
    MenuComponent,
    TablaComponent,
    AccidenteComponent,
    VacunacionComponent,
    ProvacunacionComponent,
    ExternoComponent,
    VacunoproComponent,
    RptvaxperComponent,
    RptvaxareaComponent,
    GrupoareaComponent,
    RptvaxcampComponent,
    ProemoComponent,
    EmoComponent,
    EmosemaforoComponent,
    EmorptaptimedComponent,
    EmorptinformedComponent,
    EmorptconsultaComponent,
    EmorptparanormaComponent,
    ProcapacitacionComponent,
    CapacitacionComponent,
    CaparpthistxperComponent,
    CaparptoblignoasisComponent,
    CaparptxvencerComponent,
    CaparptprogramasisComponent,
    CaparptprogrampendComponent,
    MedidacorrectivaComponent,
    LevantamientoComponent,
    DiasdmComponent,
    AccirptconsultaComponent,
    AccirpttotalComponent,
    PoliticaComponent,
    ProcomiteComponent,
    MatrizComponent,
    PlananualComponent,
    ProeppsComponent,
    EppsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatTabsModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
