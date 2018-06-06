import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ModalController, NavController, AlertController } from 'ionic-angular';

import { AppservicioProvider } from '../../providers/appservicio/appservicio';
import { FiltrablesProvider } from '../../providers/filtrables/filtrables';
import { ServiciosProvider } from '../../providers/servicios/servicios';
import { MiserviciosProvider } from '../../providers/miservicios/miservicios';
import { PromocionesProvider } from '../../providers/promociones/promociones';
import { ReclamosProvider } from '../../providers/reclamos/reclamos';
import { TiporeclamosProvider } from '../../providers/tiporeclamos/tiporeclamos';
import { MiordenserviciosProvider } from '../../providers/miordenservicios/miordenservicios';

import * as moment from 'moment';

@Component({
  selector: 'page-servicio',
  templateUrl: 'servicio.html'
})
export class ServicioPage {

  public TAG: string = 'ServicioPage ';
  seg_servicio;
  ico='arrow-dropup';
  myInput='';

  public services: any[]=[];
  public aux_services: any[]=[];
  public promos: any[]=[];
  public numeroPromo: number = 1;

  private esMiServicio: boolean = false;
  public titulo_servicio: any = 'Servicios';
  
  public valoracion: any = [{
    "id":"1",
    "criterio":"malo"
    },{
    "id":"2",
    "criterio":"regular"
  }];

  errorMessage: string;

  public tipo_servicio: any=null;

  public id_cliente: string=null;
  public id_orden_servicio: string=null;

  constructor(
    private storage: Storage,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public modalCtrl: ModalController, 
    public serviApp: AppservicioProvider,
    public filtrablesProv: FiltrablesProvider,
    public serviciosProv: ServiciosProvider,
    public miserviciosProv: MiserviciosProvider,
    public promocionesProv: PromocionesProvider,
    public tiporeclamosProv: TiporeclamosProvider,
    public reclamosProv: ReclamosProvider,
    public ordenServiciosProv: MiordenserviciosProvider) { }

  ngOnInit(){
    this.seg_servicio = "servi";
    this.getServicios();
    this.promos=[];
  }

  async getServicios(): Promise<void> {
    let metodo = ': metodo getServicios';
    this.serviApp.activarProgreso(true,this.TAG + metodo);
    await this.serviciosProv.getAll()
      .subscribe(
      (res)=>{
        this.serviApp.activarProgreso(false,this.TAG + metodo);
        this.titulo_servicio = "Servicios";
        this.ico = 'arrow-dropup';
        this.cargarServicios(res['data'],this.titulo_servicio);
        this.esMiServicio = false;
      },
      (error)=>{
        this.serviApp.errorConeccion(error);
      }
    );  
  }

  cargarServicios(servicios,tipo){
    let array:any[] = servicios;
   // console.log(this.TAG+'metodo: cargarServicios: '+ JSON.stringify(array));
    this.services = [];
    for (var i = array.length - 1; i >= 0; i--) {
      if (tipo == 'Servicios')
        this.services.push({
          "servicio": array[i],
          "estado_orden_servicio": 0
        });
      if (tipo == 'Mis Servicios' || tipo == 'Mi Servicio')
        this.services.push({
          "servicio": array[i].servicio,
          "estado_orden_servicio": array[i].estado_orden_servicio
        });
    }
    this.aux_services = this.services;
  }

  async getCliente(){
    let metodo = ': metodo getCliente';
    this.serviApp.activarProgreso(true,this.TAG + metodo);
    await this.storage.ready().then(() => {
    this.storage
      .get('usuario')
      .then( (usuario) => {
        this.serviApp.activarProgreso(false,this.TAG + metodo);
        this.getMiServicios(usuario.data.cliente.id_cliente)
      })
      .catch((err) =>{
        this.serviApp.errorConeccion(err);
      });
    });
  }

  async getMiServicios(id): Promise<void> {
    let metodo = ': metodo getMiServicios';
    this.serviApp.activarProgreso(true,this.TAG + metodo);
    this.id_cliente = id;
    await this.miserviciosProv.get(id)
      .subscribe(
      (res)=>{
        if ( res['data'].length == 1 ) this.titulo_servicio = "Mi Servicio"
        else this.titulo_servicio = "Mis Servicios";
        this.ico = 'arrow-dropdown';
        this.cargarServicios(res['data'],this.titulo_servicio);
        this.esMiServicio = true;
        this.serviApp.activarProgreso(false,this.TAG + metodo);
      },
      (error)=>{
        this.serviApp.errorConeccion(error);
      }
    );  
  }

  async getPromociones():Promise<void>{
    let metodo = ': metodo getPromociones';
    this.serviApp.activarProgreso(true,this.TAG + metodo);
    await this.promocionesProv.getAll()
    .subscribe(
      (res)=>{
        this.promos = res['data'];
        this.serviApp.activarProgreso(false,this.TAG + metodo);
        for ( let i in this.promos ){
          this.numeroPromo = this.numeroPromo + 1;
          this.promos[i].valido_hasta = moment(this.promos[i].valido_hasta).format("DD/MM/YYYY");
          this.promos[i].valido_desde = moment(this.promos[i].valido_desde).format("DD/MM/YYYY");
        }
      },
      (error)=>{
        this.serviApp.errorConeccion(error);
      }
    ); 
  }

  showSegment(segment){
    if ( segment == 'servi' && this.services.length == 0 ) this.getServicios();
    if ( segment == 'promocion' && this.promos.length == 0 ) this.getPromociones();
  }

  showFilter() {

    if(this.services.length == 0){
      this.getServicios();
    } 
    if( this.services.length != 0 ){

      var precios: number[]=[];
      var duraciones: number[]=[];
      for ( let i in this.services ) {
        precios.push( this.services[i].servicio.precio );
        duraciones.push( this.services[i].servicio.numero_visitas );
      } 
      let rangoPrecio: any = {
        max: Math.max.apply(null, precios),
        min: Math.min.apply(null, precios)
      }
      let body: any = {
        rangoPrecio: rangoPrecio,
        max_duracion: Math.max.apply(null, duraciones)
      }
      let modal = this.modalCtrl.create('FiltroPage',body);
      modal.onDidDismiss(data => {
        if( '['+JSON.stringify(data)+']' != "[undefined]" ){
          if ( data.length != 0 ) this.getServiciosFiltrados(data);  
        }
      });
      modal.present();
    }
  }

  isParametro(parametros,id_parametro): boolean{
    for ( let i in parametros )
      if ( parametros[i].id_parametro == id_parametro ) return true;
    return false;
  }

  isService(services,id_servicio): boolean{
    for ( let i in services )
      if ( services[i].servicio.id_servicio == id_servicio ) return true;
    return false;
  }

  async getServiciosFiltrados(body):Promise<void>{
    console.log(JSON.stringify(body));
    let metodo = ': metodo getServiciosFiltrados';
    this.serviApp.activarProgreso(true,this.TAG + metodo);
    await this.filtrablesProv.getBody(body)
      .subscribe(
      (res)=>{
        this.serviApp.activarProgreso(false,this.TAG + metodo);
        this.titulo_servicio = "Servicios";
        this.ico = 'arrow-dropup';
        this.cargarServicios(res['data'],this.titulo_servicio);
        this.esMiServicio = false;
      },
      (error)=>{
        this.serviApp.errorConeccion(error);
      }
    );
  }

  showServicio() {
    if(this.esMiServicio) this.getServicios();  
    else this.getCliente();
  }

  showDetail(params){
    this.navCtrl.push('ServicioDetallePage', {
      "tipo_notificacion": null,
      "promocion": null,
      "garantia": null,
      "titulo_servicio": this.titulo_servicio,
      "servicio": params
    });
  }

  verNotificaciones(){
     this.navCtrl.push('NotificacionesPage');
  }

  verPromocion(promo){
    this.navCtrl.push('PromocionesPage',promo)
  }

  getItems(ev: any) {
    let val = ev.target.value;
    this.services = this.aux_services;
    if (val && val.trim() != '') {  
      this.services = this.services.filter((item) => {
        return (item.servicio.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } 
  }

  onCancel(ev: any){
    this.myInput = '';
    this.services = this.aux_services;
  }

  async getTipoReclamos(): Promise<void> {
    let metodo = ': metodo getTipoReclamos';
    this.serviApp.activarProgreso(true,this.TAG + metodo);
    await this.tiporeclamosProv.getAll()
      .subscribe(
      (res)=>{
        let objetos: any[] = res['data'].motivos || [];
        if (objetos.length != 0){
          let myImputs:any =[];
          for ( let i in objetos ){
            let data:any = { 
              type: 'radio',
              label: objetos[i].descripcion,
              value: objetos[i]
            };
            myImputs.push(data);
          }
          this.alertSelection(myImputs);
        }
      this.serviApp.activarProgreso(false,this.TAG + metodo);
      },
      (error)=>{
        this.serviApp.errorConeccion(error);
      }
    );  
  }

  alertSelection(myImputs){
   let editar = this.alertCtrl.create({
      title: 'Por que deseas reclamar el servicio?',
      inputs: myImputs,
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancelar clicked' + JSON.stringify(data) );
          }
        },
        {
          text: 'Ok',
          handler: data => {
            console.log(data)
            if( '['+JSON.stringify(data)+']' != '[undefined]') this.Reclamar(data);
            else this.serviApp.alecrtMsg('Seleccione un motivo');
          }
        }
      ]
    });
    editar.present();
  }

  async Reclamar(data){
    if(this.id_cliente != null){
      await this.getMiOrdenServicios(this.id_cliente,data.id_motivo);
    } else {
      await this.getCliente();
      this.serviApp.alecrtMsg('Tu reclamo no se envio intente de nuevo')
    }
  }

  async getMiOrdenServicios(id_cliente, id_motivo): Promise<void> {
    let metodo = ': metodo getMiOrdenServicios';
    this.serviApp.activarProgreso(true,this.TAG + metodo);
    await this.ordenServiciosProv.get(id_cliente)
      .subscribe(
      (res)=>{
        console.log(JSON.stringify(res))
        let orden_servicios = res['data'];
        this.id_orden_servicio = orden_servicios[0];
        if ( this.id_cliente != null && this.id_orden_servicio != null ){
          this.reclamar({
            "id_motivo": id_motivo,
            "id_orden_servicio": this.id_orden_servicio
          });
        }
        this.serviApp.activarProgreso(false,this.TAG + metodo);
      },
      (error)=>{
        this.serviApp.errorConeccion(error);
      }
    );  
  }

  reclamar(body){
    let metodo = ': metodo reclamar';
    console.log(JSON.stringify(body))
    var msg = 'Despues de esta accion su reclamo cancelara el servicio si desea continuar seleccione SI, Puesdes tambien dejar una queja en el menu de comunicacion si no deseas cancelar el servicio';
    let alert = this.alertCtrl.create({
      title:    'Mensaje',
      subTitle: msg ,
      buttons:  [{
        text: "SI",
        handler: data => {    
          this.serviApp.activarProgreso(true,this.TAG + metodo);
          this.reclamosProv.create(body).subscribe(
            (res)=>{
              this.serviApp.activarProgreso(false,this.TAG + metodo);
              this.serviApp.alecrtMsg('Su reclamo ya fue enviado');
              this.navCtrl.setRoot(ServicioPage);
            },
            (error)=>{
              this.serviApp.errorConeccion(error);
            }
          );
        } 
      } , {
        text: "NO",
        handler: data => {
          this.navCtrl.setRoot(ServicioPage);
        } 
      }]
    });
    alert.present();
  }

}