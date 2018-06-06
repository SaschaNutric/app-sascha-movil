import { Component } from '@angular/core';
import { IonicPage, AlertController, ModalController, NavController, ViewController, NavParams } from 'ionic-angular';

import { ServicioPage } from '../../../pages/servicio/servicio';

import { AppservicioProvider }      from '../../../providers/appservicio/appservicio';
import { BloquehorariosProvider }   from '../../../providers/bloquehorarios/bloquehorarios';
import { EmpleadosProvider }        from '../../../providers/empleados/empleados';
import { MotivosSolicitudProvider } from '../../../providers/motivos-solicitud/motivos-solicitud';
import { SolicitudesProvider }      from '../../../providers/solicitudes/solicitudes';
import { NotifiProvider }           from '../../../providers/notifi/notifi';
import { Storage }                  from '@ionic/storage';

@IonicPage()
@Component({
	selector: 'page-solocitud',
	templateUrl: 'solicitud.html',
})
export class SolicitudPage {
	public TAG: string = 'SolicitudPage ';

	public fecha: Date = new Date();
	public min: Date = new Date()
	public maxDate: Date = new Date(new Date().setDate(new Date().getDate() + 256));
	public disabledDates: Date[] = [new Date(2018, 3, 1), new Date(2018, 3, 3), new Date(2018, 3, 5)];
	public markDates: Date[] = [];

	public solicitudes: any = [{
		"cliente":{},
		"servicio":{},
		"bloque_horario": {},
		"empleado":{},
		"motivo":{},
		"fecha": this.fecha,
    "acepto_precio":"no"
	}]

  private diaSemana = this.fecha.getUTCDay();
  private dia_laborables: any[] = []; 

  public tipo_notificacion: any = null;

	constructor(
    private storage: Storage,
		public alertCtrl: AlertController,
		public navCtrl: NavController,
		public modalCtrl: ModalController, 
		public navParams: NavParams,
		public viewCtrl: ViewController,
    public notifiProv: NotifiProvider,
		public serviApp: AppservicioProvider,
		public horariosProv: BloquehorariosProvider,
		public empleadosProv: EmpleadosProvider,
		public motivosSolicitudProv: MotivosSolicitudProvider,
    public solicitudesProv: SolicitudesProvider) {
    this.tipo_notificacion = null;
		this.solicitudes[0].servicio = navParams.data.servicio;
    this.tipo_notificacion = navParams.data.tipo_notificacion;
	}

  ionViewDidLoad(): void {
     this.getCliente();
  }

	seleccion(entidad,title) {
  	if ( entidad == 'bloque_horario' )
    	this.getBloqueHoras(entidad,title);
    else if ( entidad == 'empleado' &&  JSON.stringify(this.solicitudes[0].empleado) == '{}' )
    	this.getEmpleados(entidad,title);
    else if ( entidad == 'motivos-solicitud' &&  JSON.stringify(this.solicitudes[0].motivo) == '{}' )
    	this.getMotivoSolicitud(entidad,title);
	}

	async getBloqueHoras(entidad,title): Promise<void> {
    if ( JSON.stringify(this.solicitudes[0].empleado)!='{}' ) {
      this.serviApp.activarProgreso(true,'solicitud: metodo getBloqueHoras');

      let body: any = {
          "id_empleado": this.solicitudes[0].empleado.id_empleado,
          "id_dia_laborable": this.diaSemana
        };
      console.log(body);
      await this.horariosProv.getBody(body)
        .subscribe(
        (res)=>{    
          this.serviApp.activarProgreso(false,'solicitud: metodo getBloqueHoras');
          let objetos: any[] = res['data'].bloques_horarios || [];
          if (objetos.length != 0){
            let myImputs:any =[];
            for ( let i in objetos ){
              let checkeded: boolean = false;
              let valor = objetos[i].hora_inicio + ' - ' + objetos[i].hora_fin;
					    let valor2 = this.solicitudes[0].bloque_horario.hora_inicio + ' - ' + this.solicitudes[0].bloque_horario.hora_fin;
              if ( valor == valor2 ) 
          	     checkeded = true;
              let data:any = { 
                type: 'radio',
                label: valor,
                value: objetos[i],
                checked: checkeded 
              };
              myImputs.push(data);
            }
            this.alertSelection(entidad,title,myImputs);
          }
        },
        (error)=>{
           this.serviApp.alecrtMsg('El nutricionisa labora solo los dias '+JSON.stringify(this.dia_laborables)+' intenta seleccionar unos de estos dias');
        }
      );  
    } else {
      this.serviApp.alecrtMsg('Seleccione un Nutricionista');
    }
  }

	async getEmpleados(entidad,title): Promise<void> {
    this.serviApp.activarProgreso(true,'solicitud: metodo getEmpleados');
    await this.empleadosProv.getAll()
      .subscribe(
      (res)=>{
        let objetos: any[] = res['data'];
        let myImputs:any =[];
        for ( let i in objetos ){
          let checkeded: boolean = false;
          let valor = objetos[i].nombres;
					let valor2 = this.solicitudes[0].empleado.nombres;
          if ( valor == valor2 ) 
          	checkeded = true;
          let data:any = { 
            type: 'radio',
            label: valor,
            value: objetos[i],
            checked: checkeded 
          };
          myImputs.push(data);
        }
        this.alertSelection(entidad,title,myImputs);
        this.serviApp.activarProgreso(false,'solicitud: metodo getEmpleados');
      },
      (error)=>{
        this.serviApp.errorConeccion(error);
      }
    );  
  }

  async getMotivoSolicitud(entidad,title): Promise<void> {
    this.serviApp.activarProgreso(true,'solicitud: metodo getMotivoSolicitud');
    await this.motivosSolicitudProv.getAll()
      .subscribe(
      (res)=>{
        let objetos: any[] = res['data'];
        let myImputs:any =[];
        for ( let i in objetos ){
          let checkeded: boolean = false;
          let valor = objetos[i].descripcion;
					let valor2 = this.solicitudes[0].motivo.descripcion;
          if ( valor == valor2 ) 
          	checkeded = true;
          let data:any = { 
            type: 'radio',
            label: valor,
            value: objetos[i],
            checked: checkeded 
          };
          myImputs.push(data);
        }
        this.alertSelection(entidad,title,myImputs);
        this.serviApp.activarProgreso(false,'solicitud: metodo getMotivoSolicitud');
      },
      (error)=>{
        this.serviApp.errorConeccion(error);
      }
    );  
  }

  async getCliente(){
    this.serviApp.activarProgreso(true,'solicitud: metodo getCliente');
    await this.storage.ready().then(() => {
      this.storage.get('usuario').then( (usuario) => {
      this.serviApp.activarProgreso(false,'solicitud: metodo getCliente');
      console.log(this.TAG,JSON.stringify(usuario.data.cliente));
        this.solicitudes[0].cliente = usuario.data.cliente;
      }).catch((err) =>{
        this.serviApp.errorConeccion(err);
      });
    });
  }

  alertSelection(entidad,title,myImputs){
   let editar = this.alertCtrl.create({
      title: title,
      inputs: myImputs,
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log(entidad+ 'Cancelar clicked' + JSON.stringify(data) );
          }
        },
        {
          text: 'Ok',
          handler: data => {
            if( '[' + JSON.stringify(data) + ']' != '[undefined]')
            {
              if ( entidad == 'bloque_horario' )
                this.solicitudes[0].bloque_horario = data || {};
              else if ( entidad == 'empleado' ){
                this.solicitudes[0].empleado = data;
                let horarios: any[] = data.horario;
                for ( let i in horarios ){
                  let enc: boolean = true;
                  for ( let j in this.dia_laborables ){
                    if ( this.dia_laborables[j] == horarios[i].dia_laborable.dia )
                      enc = false
                  }
                  if (enc) this.dia_laborables.push(horarios[i].dia_laborable.dia);
                }
                this.solicitudes[0].bloque_horario = {};
              }
              else if ( entidad == 'motivos-solicitud' )
                this.solicitudes[0].motivo = data;
              else console.log('entidad no exite');
            }
          }
        }
      ]
    });
    editar.present();
	}

  solicitar() {   
    if(this.esValido(this.solicitudes[0]) == true){
    var msg = 'El servicio tiene un costo por ' + this.solicitudes[0].servicio.precio + ' BsS'  + ' Desea solicitarlo?';
    let alert = this.alertCtrl.create({
      title:    'Mensaje',
      subTitle: msg ,
      buttons:  [{
        text: "SI",
        handler: data => {
          this.solicitudes[0].acepto_precio = 'si';
          this.peticionSolicitud();
        } 
      } , {
        text: "NO",
        handler: data => {
          this.solicitudes[0].acepto_precio = 'no';
          this.peticionSolicitud();
        } 
      }]
    });
    alert.present();
    } else console.log(this.TAG,JSON.stringify(this.solicitudes[0]));
  }

  async peticionSolicitud(): Promise<any> {
    this.serviApp.activarProgreso(true,'solicitud: metodo peticionSolicitud');
    let data: any = this.solicitudes[0];
    let body: any = null;
    if ( this.tipo_notificacion != null ){
      body = {
        "id_empleado": data.empleado.id_empleado,
        "id_cliente": data.cliente.id_cliente,
        "id_servicio": data.servicio.id_servicio,
        "id_motivo": data.motivo.id_motivo,
        "id_bloque_horario": data.bloque_horario.id_bloque_horario,
        "fecha": data.fecha,
        "acepto_precio": data.acepto_precio,
        "tipo_notificacion": this.tipo_notificacion
      };
    } else {
      body = {
        "id_empleado": data.empleado.id_empleado,
        "id_cliente": data.cliente.id_cliente,
        "id_servicio": data.servicio.id_servicio,
        "id_motivo": data.motivo.id_motivo,
        "id_bloque_horario": data.bloque_horario.id_bloque_horario,
        "fecha": data.fecha,
        "acepto_precio": data.acepto_precio
    };
  }
    
    this.solicitudesProv.create(body)
      .subscribe(
        (res)=>{
          this.serviApp.alecrtMsg(res['data'].mensaje);

          if(this.tipo_notificacion != null){
            if(this.tipo_notificacion == 7){
              this.storage.ready().then(() => {
                this.storage.get('notificaciones').then( (notificaciones) => {
                  for( let i in notificaciones ){
                    if( notificaciones[i].tipo_notificacion == 7 ){
                      this.limpiar(notificaciones[i].id_notificacion);
                    }
                  }
                }).catch((err) =>{
                  console.log(err);
                });
              });
            }
          }

          this.navCtrl.setRoot(ServicioPage);
        },
        (error)=>{
          this.serviApp.errorConeccion(error);
        }
      ); 
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

  esValido(data): boolean{
    if ( JSON.stringify(this.solicitudes[0])=='{}' ) {
      this.serviApp.alecrtMsg('Seleccione todo los campos');
      return false;
    }
    if ( JSON.stringify(this.solicitudes[0].cliente)=='{}' ) {
      this.serviApp.alecrtMsg('El cliente es necesario');
      return false;
    }
    if ( JSON.stringify(this.solicitudes[0].empleado)=='{}' ) {
      this.serviApp.alecrtMsg('Seleccione el Nutricionista');
      return  false;
     } 
    if ( JSON.stringify(this.solicitudes[0].servicio)=='{}' ) {
      this.serviApp.alecrtMsg('Seleccione el servicio');
      return  false;
    }
    if ( JSON.stringify(this.solicitudes[0].bloque_horario)=='{}' ) {
      this.serviApp.alecrtMsg('Seleccione la hora');
      return  false;
    }
    if ( JSON.stringify(this.solicitudes[0].motivo)=='{}' ) {
      this.serviApp.alecrtMsg('Seleccione el motivo');
      return  false;
    }
    if ( JSON.stringify(this.solicitudes[0].fecha)=='' ) {
      this.serviApp.alecrtMsg('Seleccione la fecha');
      return  false;
    }
    return true;
  }
	
	public Log(stuff): void {
		console.log(stuff);
	}
	public event(data: Date): void {}

	setDate(date: Date) {
		console.log(date);
		this.fecha = date;
    this.diaSemana = date.getUTCDay()+1;
		this.solicitudes[0].fecha = this.fecha;
    this.solicitudes[0].bloque_horario = {};
	}

	dismiss() {
	 this.viewCtrl.dismiss();
	}

	verNotificaciones(){
		 this.navCtrl.push('NotificacionesPage');
	}
}
