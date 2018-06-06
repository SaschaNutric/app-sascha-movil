import { Component } from '@angular/core';
import { AlertController, IonicPage, Platform, NavParams, ViewController, NavController } from 'ionic-angular';

import { EspecialidadesProvider } from '../../../providers/especialidades/especialidades';
import { TipoparametrosProvider } from '../../../providers/tipoparametros/tipoparametros';
import { AppservicioProvider } from '../../../providers/appservicio/appservicio';

@IonicPage()
@Component({
  selector: 'page-filtro',
  templateUrl: 'filtro.html'
})
export class FiltroPage {
  filtro;
  public TAG:string = 'FiltroPage';
  public filtrables:any[]=[];
  public filtro_top: any = {
    "ranges": [{
      "id": "parametro_1",
      "titulo": "Precio Desde",
      "min": 0,
      "max": 0,
      "valor": 0,
      "slep": 2,
      "unidad": "$"
    } , {
      "id": "parametro_2",
      "titulo": "Precio Hasta",
      "min": 0,
      "max": 0,
      "valor": 0,
      "slep": 2,
      "unidad": "$"
    } , {
      "id": "parametro_3",
      "titulo": "Duracion en",
      "min": 1,
      "max": 1,
      "valor": 1,
      "slep": 1,
      "unidad": "visitas"
    }] ,
    "especialidades":[]
  };
  
  public evalParametros: any[] = [];
  public evalEspecialidades: any[] = [];

  constructor(
    public platform: Platform,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public params: NavParams,
    public viewCtrl: ViewController,
    public filtrablesProv: TipoparametrosProvider,
    public especialidadesProv: EspecialidadesProvider,
    public serviApp: AppservicioProvider) {
    console.log(JSON.stringify(params.data))
      let max = params.data.rangoPrecio.max;
      let min = params.data.rangoPrecio.min;
      this.filtro_top.ranges[0].max = max;
      this.filtro_top.ranges[0].min = min;
      this.filtro_top.ranges[0].valor = min;
      this.filtro_top.ranges[1].max = max;
      this.filtro_top.ranges[1].min = min;
      this.filtro_top.ranges[1].valor = max;
      this.filtro_top.ranges[2].max = params.data.max_duracion;
      this.filtro_top.ranges[2].valor = params.data.max_duracion;
      console.log(JSON.stringify(params.data));
    }

  ngOnInit(){
    this.filtro = "filtroTop";
  }

  async getFiltrables(): Promise<void> {
    let metodo = ': metodo getTipoParametros';
    this.serviApp.activarProgreso(true,this.TAG + metodo);
    await this.filtrablesProv.getAll()
    .subscribe(
      (res)=>{
        this.filtrables = res['data'] || [];
        this.serviApp.activarProgreso(false,this.TAG + metodo);
      },
      (error)=>{
        this.serviApp.errorConeccion(error);
      }
    );  
  }

  selectView(id_tipo_parametro,tipo,parametros){
    let aux: any[]=[];
    for ( let i in this.evalParametros ){
      if ( this.evalParametros[i].id_tipo_parametro == id_tipo_parametro ){
        aux = this.evalParametros[i].parametros;
        break;
      } 
    }
    let objetos: any[] = parametros
    if (objetos.length != 0){
      let myImputs:any =[];
      for ( let i in objetos ){
        let isCheck: boolean = false;
        for ( let y in aux){
          if ( objetos[i].id_parametro == aux[y].id_parametro ){
            isCheck = true;
            break;
          }else isCheck = false;
        }
        let data:any = { 
          type: 'checkbox',
          label: objetos[i].nombre,
          value: objetos[i],
          checked: isCheck
        };
        myImputs.push(data);
      }
      this.alertSelection(id_tipo_parametro,tipo,myImputs);
    }
  }

  alertSelection(id_tipo_parametro,titulo,myImputs){
   let editar = this.alertCtrl.create({
      title: titulo,
      inputs: myImputs,
      buttons: [{
        text: 'Cancelar',
        handler: data => {
          console.log('Cancelar clicked');
        }
      } , {
        text: 'Ok',
        handler: data => {
          let objeto = {
            id_tipo_parametro: id_tipo_parametro,
            parametros: data
          };
          let index: any = -1;
          if ( this.evalParametros.length == 0 ){
            this.evalParametros.push(objeto);
          } else {
            let enc: boolean = false;
            for ( let i in this.evalParametros ){
              if ( this.evalParametros[i].id_tipo_parametro == objeto.id_tipo_parametro ){
                index = i;
                enc = true;
                break;
              } 
            }  
            if (!enc) this.evalParametros.push(objeto);
            else if ( index != -1 ) this.evalParametros[index] = objeto;
          }
        }
      }]
    });
    editar.present();
  }

  dismiss() {
   this.viewCtrl.dismiss();
  }

  aceptar(){
    let id_parametros: any[]=[];
    for ( let i in this.evalParametros ){
      for ( let y in this.evalParametros[i].parametros ){
        id_parametros.push(this.evalParametros[i].parametros[y].id_parametro)
      }
    }
    let id_especialidades: any[]=[];
    for ( let i in this.evalEspecialidades ){
        id_especialidades.push(this.evalEspecialidades[i].id_especialidad);
    }
    let rangoPrecio: any = {
      "desde": this.filtro_top.ranges[0].valor, 
      "hasta": this.filtro_top.ranges[1].valor
    };
    let duracion: number = this.filtro_top.ranges[2].valor; 
    this.viewCtrl.dismiss({
      "id_parametros": id_parametros,
      "id_especialidades": id_especialidades,
      "rangoPrecio": rangoPrecio,
      "duracion": duracion
    }); 
  }

  rangeChange(evento,idRange){
    //console.log(evento.value);
    console.log(idRange);
    let ranges: any[]=[];
    for( var _i = 0; _i < this.filtro_top.ranges.length; _i++ ){
      ranges = this.filtro_top.ranges;
      if( ranges[_i].id == idRange ){
        let desval: number = ranges[0].valor;
        let hasval: number = ranges[1].valor;
        console.log( desval +' < '+hasval)
        if ( idRange == 'parametro_1' )
          this.filtro_top.ranges[_i].valor = ( desval < hasval )? evento.value : this.filtro_top.ranges[1].valor;
        else if ( idRange == 'parametro_2' )
          this.filtro_top.ranges[_i].valor = ( desval < hasval )? evento.value : this.filtro_top.ranges[0].valor;
        else this.filtro_top.ranges[_i].valor = evento.value;
      }    
    }
    console.log(JSON.stringify(ranges));
  }

  async getEspecialidades(): Promise<void> {
    if ( this.filtro_top.especialidades.length == 0 ){
      let metodo = ': metodo getEspecialidades';
      this.serviApp.activarProgreso(true,this.TAG + metodo);
      await this.especialidadesProv.getAll()
        .subscribe(
        (res)=>{
          let objetos: any[] = res['data'];
          for ( let i in objetos ){
            let checkeded: boolean = false;
            let data:any = { 
              type: 'checkbox',
              label: objetos[i].nombre,
              value: objetos[i],
              checked: checkeded 
            };
            this.filtro_top.especialidades.push(data);
          }
          this.serviApp.activarProgreso(false,this.TAG + metodo);
          this.alertEspecialidades(this.filtro_top.especialidades);
        },
        (error)=>{
          this.serviApp.errorConeccion(error);
        }
      );  
    } else this.alertEspecialidades(this.filtro_top.especialidades);
  }

  alertEspecialidades(especialidades){
   let editar = this.alertCtrl.create({
      title: "Especialidades",
      inputs: especialidades,
      buttons: [{
        text: 'Cancelar',
        handler: data => {
          console.log('Cancelar clicked');
        }
      } , {
        text: 'Ok',
        handler: data => {
          console.log(JSON.stringify(data))
          this.evalEspecialidades = data;
          this.resetIscheck();
          for ( let i in data ) this.ischeck(data[i].id_especialidad);
        }
      }]
    });
    editar.present();
  }

  resetIscheck(){
    for ( let i in this.filtro_top.especialidades )  
      this.filtro_top.especialidades[i].checked = false;
  }

  ischeck(id_especialidad){
    for ( let i in this.filtro_top.especialidades )  
      if ( this.filtro_top.especialidades[i].value.id_especialidad == id_especialidad ){
        this.filtro_top.especialidades[i].checked = true ;
        break
      }
  }

}
