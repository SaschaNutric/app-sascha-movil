import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';

import { TipoincideciasProvider } from '../../../providers/tipoincidecias/tipoincidecias';
import { BloquehorariosProvider } from '../../../providers/bloquehorarios/bloquehorarios';
import { AppservicioProvider } from '../../../providers/appservicio/appservicio';

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
    bloque_horario:{
      hora_inicio:'',
      hora_fin:''
    },
    motivo: {}
  }

  constructor(
  	public navCtrl: NavController, 
  	public navParams: NavParams,
    public alertCtrl: AlertController,
  	public tipoincidenciasProv: TipoincideciasProvider,
    public horariosProv: BloquehorariosProvider,
  	public serviApp: AppservicioProvider) { 
  		this.visita = navParams.data;
      console.log('POLICE');
      console.log(this.visita);
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

  async getTipoIncidencias(): Promise<void> {
    let metodo = ': metodo getTipoIncidencias';
    this.serviApp.activarProgreso(true,this.TAG + metodo);
    await this.tipoincidenciasProv.getAll()
      .subscribe(
      (res)=>{
        console.log(res['data'])
        let objetos: any[] = res['data'].motivos || [];
        console.log(res['data'].motivos)
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
          this.alertSelectionIncidencia(myImputs);
        }
      this.serviApp.activarProgreso(false,this.TAG + metodo);
      },
      (error)=>{
        this.serviApp.errorConeccion(error);
      }
    );  
  }

  alertSelectionIncidencia(myImputs){
   let editar = this.alertCtrl.create({
      title: 'Por que deseas reprogramar la fecha?',
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
            if( '['+JSON.stringify(data)+']' != '[undefined]') this.enviarReprogramacion(data);
            else this.serviApp.alecrtMsg('Seleccione un motivo');
          }
        }
      ]
    });
    editar.present();
  }

  enviarReprogramacion(data){
    console.log('reprogramar clicked' + JSON.stringify(data) );
  }

}