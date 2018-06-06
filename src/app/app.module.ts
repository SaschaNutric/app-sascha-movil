import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DatePickerModule } from 'ionic3-datepicker';
import { MyApp } from './app.component';

import { ServicioPage } from '../pages/servicio/servicio';

import { RemoteProvider } from '../providers/remote/remote';
import { AuthProvider } from '../providers/auth/auth';
import { ConfigService } from '../providers/config-service/config-service';
import { NotificacionesProvider } from '../providers/notificaciones/notificaciones';
import { ServiciosProvider } from '../providers/servicios/servicios';
import { PromocionesProvider } from '../providers/promociones/promociones';
import { EstadocivilesProvider } from '../providers/estadociviles/estadociviles';
import { GenerosProvider } from '../providers/generos/generos';
import { PerfilProvider } from '../providers/perfil/perfil';
import { MotivosProvider } from '../providers/motivos/motivos';
import { BloquehorariosProvider } from '../providers/bloquehorarios/bloquehorarios';
import { AppservicioProvider } from '../providers/appservicio/appservicio';
import { EspecialidadesProvider } from '../providers/especialidades/especialidades';
import { EmpleadosProvider } from '../providers/empleados/empleados';
import { MotivosSolicitudProvider } from '../providers/motivos-solicitud/motivos-solicitud';
import { SolicitudesProvider } from '../providers/solicitudes/solicitudes';
//import { AndroidPermissions } from '@ionic-native/android-permissions';
import { CanalescuchaProvider } from '../providers/canalescucha/canalescucha';
import { AyudasProvider } from '../providers/ayudas/ayudas';
import { PerfilesProvider } from '../providers/perfiles/perfiles';
import { EvolucionesProvider } from '../providers/evoluciones/evoluciones';
import { MiserviciosProvider } from '../providers/miservicios/miservicios';
import { TiporeclamosProvider } from '../providers/tiporeclamos/tiporeclamos';
import { MiordenserviciosProvider } from '../providers/miordenservicios/miordenservicios';
import { ReclamosProvider } from '../providers/reclamos/reclamos';
import { OrdenProvider } from '../providers/orden/orden';
import { ValoracionesProvider } from '../providers/valoraciones/valoraciones';
import { VisitasProvider } from '../providers/visitas/visitas';
import { TipoparametrosProvider } from '../providers/tipoparametros/tipoparametros';
import { VisitadetallesProvider } from '../providers/visitadetalles/visitadetalles';
import { FiltrablesProvider } from '../providers/filtrables/filtrables';
import { TipoincideciasProvider } from '../providers/tipoincidecias/tipoincidecias';
import { ProximavisitaProvider } from '../providers/proximavisita/proximavisita';
import { ProximacitaProvider } from '../providers/proximacita/proximacita';
import { AgendareproProvider } from '../providers/agendarepro/agendarepro';
import { NotifiProvider } from '../providers/notifi/notifi';
import { CalificacionesProvider } from '../providers/calificaciones/calificaciones';
import { CalificacionesServProvider } from '../providers/calificaciones-serv/calificaciones-serv';
import { ValoracionesServProvider } from '../providers/valoraciones-serv/valoraciones-serv';

@NgModule({
  declarations: [
    MyApp,
    ServicioPage
  ],
  imports: [
    DatePickerModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ServicioPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RemoteProvider,
    AuthProvider,
    ConfigService,
    NotificacionesProvider,
    ServiciosProvider,
    PromocionesProvider,
    EstadocivilesProvider,
    GenerosProvider,
    PerfilProvider,
    MotivosProvider,
    BloquehorariosProvider,
    AppservicioProvider,
    EspecialidadesProvider,
    EmpleadosProvider,
    MotivosSolicitudProvider,
    SolicitudesProvider,
    CanalescuchaProvider,
    AyudasProvider,
    PerfilesProvider,
    EvolucionesProvider,
    MiserviciosProvider,
    TiporeclamosProvider,
    MiordenserviciosProvider,
    ReclamosProvider,
    OrdenProvider,
    ValoracionesProvider,
    VisitasProvider,
    TipoparametrosProvider,
    VisitadetallesProvider,
    FiltrablesProvider,
    EspecialidadesProvider,
    TipoincideciasProvider,
    ProximavisitaProvider,
    ProximacitaProvider,
    NotificacionesProvider,
    AgendareproProvider,
    NotifiProvider,
    CalificacionesProvider,
    CalificacionesServProvider,
    ValoracionesServProvider
  ]
})
export class AppModule {}
