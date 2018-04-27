import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Loading, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { PerfilPage } from '../pages/perfil/perfil';
import { ServicioPage } from '../pages/servicio/servicio';
import { PlanPage as ModalPlanPage } from '../pages/plan/plan';
import { EvolucionPage } from '../pages/evolucion/evolucion';
import { ComunicacionPage } from '../pages/comunicacion/comunicacion';
import { AyudaPage } from '../pages/ayuda/ayuda';
import { AuthProvider } from '../providers/auth/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  public TAG: string = 'MyApp';
  public loading: Loading;
  rootPage: any = null;
  showMenu: any = 0;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform, 
    public loadingCtrl: LoadingController,
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public auth: AuthProvider,
    private storage: Storage) {
     this.platform.ready().then(() => {
        this.isAuth();    
      });
  }

  async isAuth(){
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    await this.storage.ready().then(() => {
      this.storage
          .get('usuario')
          .then( (usuario) => {
              console.log(this.TAG,' isAuth ' + JSON.stringify(usuario.error));
              var error: boolean = usuario.error;
              if ( error ) {
                this.showMenu = 0;
                this.rootPage = 'LoginPage';
              }
              else {
                this.showMenu = 1;
                this.statusBar.styleDefault();
                this.splashScreen.hide();
                this.pages = [
                  { title:  usuario.data.cliente.nombres , component: PerfilPage },
                  { title: 'Servicio', component: ServicioPage },
                  { title: 'Mi Plan', component: ModalPlanPage },
                  { title: 'Mi Evolucion', component: EvolucionPage },
                  { title: 'Contacto', component: ComunicacionPage },
                  { title: 'Ayuda', component: AyudaPage }          
                ];
                this.rootPage = ServicioPage;
              }
              this.loading.dismiss();
          })
          .catch((err) =>{
            console.log(err);
            this.rootPage = 'LoginPage';
            this.loading.dismiss();
          });
    });

  }

  async logoutUser() { 
    console.log(this.TAG,' logoutUser ' + 'se ha removido el token');
    await this.storage.remove('usuario');
    await this.storage.clear();
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  logout() {
    this.loading.present();
    this.logoutUser();
    this.showMenu = 0;
    this.loading.dismiss();
    window.location.reload();
  }

}
