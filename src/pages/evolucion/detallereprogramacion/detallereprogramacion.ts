import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';

import { BloquehorariosProvider } from '../../../providers/bloquehorarios/bloquehorarios';
import { AgendareproProvider }    from '../../../providers/agendarepro/agendarepro';
import { AppservicioProvider }    from '../../../providers/appservicio/appservicio';
import { ServicioPage } from '../../servicio/servicio';

@IonicPage()
@Component({
  selector: 'page-detallereprogramacion',
  templateUrl: 'detallereprogramacion.html',
})
export class DetallereprogramacionPage {

  public TAG: string = 'DetallereprogramacionPage';

	public fecha: Date = new Date();
  public min: Date = new Date();
  public maxDate: Date = new Date(new Date().setDate(new Date().getDate() + 800));

  public visita: any = null;

  private diaSemana = this.fecha.getUTCDay();
  private dia_laborables: any[] = [];

  public reprogramar: any = {
    "bloque_horario":{},
    "motivo": {},
    "numeroVisita": 1,
    "id_cliente": null
  }

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    public alertCtrl: AlertController,
    public horariosProv: BloquehorariosProvider,
    public reprosProv: AgendareproProvider,
  	public serviApp: AppservicioProvider) { 
  		this.visita = navParams.data.visita;
      this.reprogramar.numeroVisita = navParams.data.numeroVisita;
      this.reprogramar.id_cliente = navParams.data.id_cliente;
  }

  public Log(stuff): void {
    console.log(stuff);
  }

  public event(data: Date): void {}

  setDate(date: Date) {
    this.fecha = date;
    this.diaSemana = date.getUTCDay()+1;
    this.reprogramar.bloque_horario = {};
  }

  seleccion(entidad,title) {
    if ( entidad == 'bloque_horario' )
      this.getBloqueHoras(entidad,title);
  }

  async getBloqueHoras(entidad,title): Promise<void> {
    let metodo = ': metodo getBloqueHoras';
    this.serviApp.activarProgreso(true,this.TAG + metodo);
    let body: any = {
      "id_empleado": this.visita.id_empleado,
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
            let valor2 = this.reprogramar.bloque_horario.hora_inicio + ' - ' + this.reprogramar.bloque_horario.hora_fin;
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
                this.reprogramar.bloque_horario = data || {};
              else if ( entidad == 'motivos-solicitud' )
                this.reprogramar.motivo = data ;
              else console.log('entidad no exite');
            }
          }
        }
      ]
    });
    editar.present();
  }

  esValido(data): boolean{
    if ( JSON.stringify(this.reprogramar)=='{}' ) {
      this.serviApp.alecrtMsg('Seleccione todo los campos');
      return false;
    }
    if ( JSON.stringify(this.reprogramar.bloque_horario)=='{}' ) {
      this.serviApp.alecrtMsg('Seleccione la hora');
      return  false;
    }
    return true;
  }
  
  enviarReprogramacion(){
    if ( this.esValido(this.visita) ){
      let id_tipo_cita = 1;
      if ( this.reprogramar.numeroVisita != 1 ) id_tipo_cita = 2
      let body: any = {
        "fecha": this.fecha,
        "id_tipo_cita": id_tipo_cita,
        "id_orden_servicio": this.visita.id_orden_servicio,
        "id_cliente": this.visita.id_cliente,
        "id_bloque_horario": this.reprogramar.bloque_horario.id_bloque_horario,
        "id_empleado": this.visita.id_empleado
      } 
      console.log(body);
      this.reprosProv.getBody(body)
      .subscribe(
        (res)=>{  
          this.serviApp.activarProgreso(false,this.TAG);
          this.serviApp.alecrtMsg('Su reprogramacion fue exitosa');
          this.navCtrl.setRoot(ServicioPage);
        },
        (error)=>{
          this.serviApp.errorConeccion(error);
        }
      );  
    }
  }

}
