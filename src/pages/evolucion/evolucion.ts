import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ModalController, ViewController ,IonicPage, NavController, NavParams, AlertController  } from 'ionic-angular';

import { MiordenserviciosProvider } from '../../providers/miordenservicios/miordenservicios';
import { ProximavisitaProvider } from '../../providers/proximavisita/proximavisita';
import { VisitasProvider } from '../../providers/visitas/visitas';
import { PerfilesProvider } from '../../providers/perfiles/perfiles';
import { CalificacionesProvider } from '../../providers/calificaciones/calificaciones';
import { AppservicioProvider } from '../../providers/appservicio/appservicio';

import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-evolucion',
  templateUrl: 'evolucion.html',
})
export class EvolucionPage {

  public TAG:string = 'EvolucionPage';

  evolucion;
  public data:any;
  testCheckboxOpen: boolean;
  testCheckboxResult;

  public id_cliente:string = null;
  public perfiles: any[]=[];
  public visitas: any[]=[];
  public id_orden_servicio: string = null;
  public proximaVisita: any=null;
  public numeroVisita: number = 1;

  constructor(
    private storage: Storage,
    public navCtrl: NavController, 
    public viewCtrl: ViewController,
    public navParams: NavParams, 
    public modalCtrl: ModalController, 
    public alertCtrl: AlertController,
    public perfilesProv: PerfilesProvider,
    public calificacionesProv: CalificacionesProvider,
    public visitasProv: VisitasProvider,
    public proximaVisitaProv: ProximavisitaProvider,
    public ordenServiciosProv: MiordenserviciosProvider,
    public serviApp: AppservicioProvider ) { }

  ngOnInit(){
    this.evolucion = "perfil";
    this.getCliente();
  }
    
  showSegment(segment){
    if ( segment == 'perfil' && this.perfiles.length == 0 ) this.getCliente();
    if ( segment == 'visita' && this.id_cliente != null && this.visitas.length == 0 ) 
      this.getMiOrdenServicios();
  }

  async getCliente(){
    let metodo = ': metodo getCliente';
    this.serviApp.activarProgreso(true,this.TAG + metodo);
    await this.storage.ready().then(() => {
      this.storage
          .get('usuario')
          .then( (usuario) => {
            this.getPerfiles(usuario.data.cliente.id_cliente);
            this.id_cliente = usuario.data.cliente.id_cliente;
          })
          .catch((err) =>{
            this.serviApp.errorConeccion(err);
          });
    });
  }

  async getPerfiles(id): Promise<void> {
    let metodo =':metodo getPerfiles';
    await this.perfilesProv.get(id)
      .subscribe(
      (res)=>{
        this.perfiles = res['data'];
        if ( this.perfiles.length == 0 ) 
          this.serviApp.alecrtMsg('Acude a tu cita para que te asigne un perfil');
        this.serviApp.activarProgreso(false,this.TAG + metodo);
      },
      (error)=>{
        this.serviApp.errorConeccion(error);
      }
    );  
  }

  async getMiOrdenServicios(): Promise<void> {
    let metodo = ': metodo getMiOrdenServicios';
    if ( this.id_cliente != null ){
      this.serviApp.activarProgreso(true,this.TAG + metodo);
      await this.ordenServiciosProv.get(this.id_cliente)
      .subscribe(
        (res)=>{
          let orden_servicios = res['data'];
          if ( this.id_cliente || orden_servicios[0] )
            this.getVisitas(this.id_cliente,orden_servicios[0]);
            this.id_orden_servicio = orden_servicios[0];
        },
        (error)=>{
          this.serviApp.errorConeccion(error);
        }
      );    
    }
  }

  async getVisitas(id_cliente,id_orden_servicio): Promise<void> {
    this.serviApp.activarProgreso(true,'EvolucionPage: metodo getVisitas');
    let body = {
        "id_cliente": id_cliente,
        "id_orden_servicio": id_orden_servicio
      };
    console.log(JSON.stringify(body))
    await this.visitasProv.getBody(body)
      .subscribe(
      (res)=>{
        this.visitas = res['data'];
        for ( let i in this.visitas ){
          this.numeroVisita = this.numeroVisita + 1;
          this.visitas[i].fecha_atencion = moment(this.visitas[i].fecha_atencion).format("DD/MM/YYYY");
        }
        
        //this.visitas.splice(0, 1);
        this.getProximaVisita(this.id_cliente);
      },
      (error)=>{
        this.serviApp.errorConeccion(error);
      }
    );  
  }

  async getProximaVisita(id_cliente): Promise<void> {
    await this.proximaVisitaProv.get(id_cliente)
      .subscribe(
      (res)=>{
        this.proximaVisita = res['data'];
        this.proximaVisita.fecha=moment(this.proximaVisita.fecha).format("DD/MM/YYYY");
        //this.setDate(new Date(this.proximaVisita.fecha));
        this.serviApp.activarProgreso(false,'EvolucionPage: metodo getProximaVisita');
      },
      (error)=>{
        this.serviApp.errorConeccion(error);
      }
    );  
  }

 abrirValoracion(visita){
  let metodo =':metodo abrirValoracion';
  console.log(JSON.stringify(visita))
    if (visita.calificada){
      this.navCtrl.push('DetalleEvolucionPage',{
        "visita": visita,
        "id_orden_servicio": this.id_orden_servicio
      });
    } else {
      let modal = this.modalCtrl.create('ValoracionPage');
      modal.onDidDismiss(data => {
        if( '['+JSON.stringify(data)+']' != '[undefined]' ){
          if( data.length != 0 ){
            this.serviApp.activarProgreso(true,this.TAG + metodo);
            this.calificacionesProv.createId(data,visita.id_visita)
            .subscribe(
            (res)=>{
              this.serviApp.alecrtMsg('Tu valoracion es muy importante gracias por tu ayuda');
              window.location.reload();
            },
            (error)=>{
              this.serviApp.errorConeccion(error);
            });  
          }
        }
      });
      modal.present();
      //this.navCtrl.push('ValoracionPage');
    }
  }

  verNotificaciones(){
     this.navCtrl.push('NotificacionesPage');
  }

  verMeta(){
     this.navCtrl.push('MetaPage',this.visitas[0].metas);
  }

  irReprogramar(visita){
    this.navCtrl.push('DetallereprogramacionPage',{
      "visita": visita,
      "numeroVisita": this.numeroVisita,
      "id_cliente": this.id_cliente
    });
  }

  async peticionCalificacion(body,id): Promise<any> {
    this.serviApp.activarProgreso(true,'solicitud: metodo peticionSolicitud');
    this.calificacionesProv.createId(body,id)
      .subscribe(
        (res)=>{
          this.serviApp.alecrtMsg(res['data'].mensaje);
          this.dismiss();
        },
        (error)=>{
          this.serviApp.errorConeccion(error);
        }
      );
  }

  dismiss() {
   this.viewCtrl.dismiss();
  }
}
