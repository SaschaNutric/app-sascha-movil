import { Component } from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Rx';

import { ServicioPage } from '../servicio/servicio';

import { AppservicioProvider } from '../../providers/appservicio/appservicio';
import { PromocionesProvider } from '../../providers/promociones/promociones';
import { NotificacionesProvider } from '../../providers/notificaciones/notificaciones';
import { NotifiProvider } from '../../providers/notifi/notifi';
import { ServiciosProvider } from '../../providers/servicios/servicios';

@IonicPage()
@Component({
  selector: 'page-notificaciones',
  templateUrl: 'notificaciones.html',
})
export class NotificacionesPage {
  public TAG: string = 'NotificacionesPage';
  
  public notificaciones: any[] = [];
  public tipo_notificacion: any = null;
  public promocion: any=null;
  public garantia: any=null;
  public titulo_servicio: string='Servicio';
  public subscription;

  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    public promocionesProv: PromocionesProvider,
    public notificacionesProv: NotificacionesProvider,
    public notifiProv: NotifiProvider,
    public serviciosProv: ServiciosProvider,
    public serviApp: AppservicioProvider) { }

  stopTheIterations () {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.subscription = Observable.interval(2000).subscribe(x => {
      this.getNotificaciones();
    });
  }

  getNotificaciones(){
    this.storage.ready().then(() => {
      this.storage.get('notificaciones').then( (data) => {
        //console.log(this.TAG,JSON.stringify(data)+'notificaciones');
        this.notificaciones = data;
      }).catch((err) =>{
        console.log(err);
      });
    });
  }
  
  async getPromocion(id):Promise<void>{
    let metodo = ': metodo getPromocion';
    this.serviApp.activarProgreso(true,this.TAG + metodo);
    await this.promocionesProv.get(id)
    .subscribe(
      (res)=>{
        this.promocion = res['data'];
        this.titulo_servicio = "Servicio por Promocion";
        this.getServicio(res['data'].id_servicio);
      },
      (error)=>{
        this.serviApp.errorConeccion(error);
      }
    ); 
  }

  async getServicio(id): Promise<void> {
    let metodo = ': metodo getServicios';
    await this.serviciosProv.get(id)
      .subscribe(
      (res)=>{
        this.serviApp.activarProgreso(false,this.TAG + metodo);
        this.navCtrl.push('ServicioDetallePage', {
          "tipo_notificacion": this.tipo_notificacion || null,
          "promocion": this.promocion || null,
          "garantia": this.garantia || null,
          "titulo_servicio": this.titulo_servicio,
          "servicio": {
            "servicio": res['data'],
            "estado_orden_servicio": 0
          }
        });   
      },
      (error)=>{
        this.serviApp.errorConeccion(error);
      }
    );  
  }

  solicitar(notificacion){
    console.log(JSON.stringify(notificacion))
    this.tipo_notificacion = notificacion.tipo_notificacion;
    if ( notificacion.tipo_notificacion == 2 ) this.getPromocion(notificacion.id_promocion);
    if ( notificacion.tipo_notificacion == 7 ){
       this.titulo_servicio = "Servicio por Garantia";  
       this.getServicio(notificacion.id_servicio);
    } 
  }

  async limpiar(id_notificacion){
    let metodo = ': metodo limpiar';
    this.serviApp.activarProgreso(true,this.TAG + metodo);
    await this.notifiProv.delete(id_notificacion)
      .subscribe(
      (res)=>{
        this.serviApp.activarProgreso(false,this.TAG + metodo);
        this.storage.remove('notificaciones');
        this.navCtrl.push(ServicioPage);
      },
      (error)=>{
        this.serviApp.activarProgreso(false,this.TAG + metodo);
        console.log(error);
      }
    );   
  }
}
