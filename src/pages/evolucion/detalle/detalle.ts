import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';

import { VisitadetallesProvider } from '../../../providers/visitadetalles/visitadetalles';
import { AppservicioProvider } from '../../../providers/appservicio/appservicio';

@IonicPage()
@Component({
  selector: 'page-detaevo',
  templateUrl: 'detalle.html',
})
export class DetalleEvolucionPage {

  public TAG:string = 'DetalleEvolucionPage';
  public detalles: any[]=[];
  public id_visita:string = null;
  
  constructor(
    public navParams: NavParams,
    public navCtrl: NavController,
    public detalleProv: VisitadetallesProvider,
    public serviApp: AppservicioProvider
    ) {
    this.getDetalle(
      navParams.data.visita.id_visita, navParams.data.id_orden_servicio);
  }

  async getDetalle(id_visita,id_orden_servicio): Promise<void> {
    let metodo = ': metodo getDetalle';
    if ( id_visita != '[object Object]' ){
      this.serviApp.activarProgreso(true,this.TAG + metodo);
      await this.detalleProv.getBodyId(id_visita,{
        "id_orden_servicio": id_orden_servicio
      })
        .subscribe(
        (res)=>{
          this.detalles = res['data'].detalles || [];
          this.serviApp.activarProgreso(false,this.TAG + metodo);
        },
        (error)=>{
          this.serviApp.errorConeccion(error);
        }
      );  
    }
  }

  verNotificaciones(){
     this.navCtrl.push('NotificacionesPage');
  }


}
