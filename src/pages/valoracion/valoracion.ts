import { Component } from '@angular/core';
import { ViewController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ValoracionesProvider } from '../../providers/valoraciones/valoraciones';
import { ValoracionesServProvider } from '../../providers/valoraciones-serv/valoraciones-serv';
import { AppservicioProvider } from '../../providers/appservicio/appservicio';

@IonicPage()
@Component({
  selector: 'page-valoracion',
  templateUrl: 'valoracion.html',
})
export class ValoracionPage {

  public TAG:string = 'ValoracionPage';
  public criterios: any[]=[]; 
  public calificaciones: any[]=[];
  public titulo: string='';

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController, 
  	public navParams: NavParams,
  	public valoracionesProv: ValoracionesProvider,
    public valoracionesServProv: ValoracionesServProvider,
  	public serviApp: AppservicioProvider) { 
    this.titulo = navParams.data.titulo;
    console.log(this.titulo)
  }

  ngOnInit(){
    if( this.titulo == 'Valorar visita' )
      this.getCriteriosVisitas();
    if( this.titulo == 'Valorar servicio' )
      this.getCriteriosServicios();
  }

  async getCriteriosServicios():Promise<void>{
    let metodo = ': metodo getCriteriosServicios';
    this.serviApp.activarProgreso(true,this.TAG + metodo);
    await this.valoracionesServProv.getAll()
    .subscribe(
      (res)=>{
        let _criterios = res['data'];

        let nuevo_criterios: any[]=[];

        for( let i in _criterios ){
          let c = _criterios[i];
          let valoraciones: any[]=[];
          for( let y in _criterios[i].valoraciones ){
            let id_criterio_valoracion = _criterios[i].id_criterio + '-' +_criterios[i].valoraciones[y].id_valoracion;
            valoraciones.push({
              "id_criterio_valoracion": id_criterio_valoracion,
              "id_criterio": _criterios[i].id_criterio,
              "id_valoracion": _criterios[i].valoraciones[y].id_valoracion,
              "nombre": _criterios[i].valoraciones[y].nombre
            });
          }
          nuevo_criterios.push({
            "id_criterio": c.id_criterio,
            "descripcion": c.descripcion,
            "tipo_criterio": c.tipo_criterio,
            "tipo_valoracion": c.tipo_valoracion,
            "valoraciones": valoraciones
          });
        }
        this.criterios = nuevo_criterios;
        console.log(JSON.stringify(this.criterios))
        this.serviApp.activarProgreso(false,this.TAG + metodo);
      },
      (error)=>{
        this.serviApp.errorConeccion(error);
      }
    ); 
  }


  async getCriteriosVisitas():Promise<void>{
    let metodo = ': metodo getCriteriosVisitas';
    this.serviApp.activarProgreso(true,this.TAG + metodo);
    await this.valoracionesProv.getAll()
    .subscribe(
      (res)=>{
        let _criterios = res['data'];

        let nuevo_criterios: any[]=[];

        for( let i in _criterios ){
          let c = _criterios[i];
          let valoraciones: any[]=[];
          for( let y in _criterios[i].valoraciones ){
            let id_criterio_valoracion = _criterios[i].id_criterio + '-' +_criterios[i].valoraciones[y].id_valoracion;
            valoraciones.push({
              "id_criterio_valoracion": id_criterio_valoracion,
              "id_criterio": _criterios[i].id_criterio,
              "id_valoracion": _criterios[i].valoraciones[y].id_valoracion,
              "nombre": _criterios[i].valoraciones[y].nombre
            });
          }
          nuevo_criterios.push({
            "id_criterio": c.id_criterio,
            "descripcion": c.descripcion,
            "tipo_criterio": c.tipo_criterio,
            "tipo_valoracion": c.tipo_valoracion,
            "valoraciones": valoraciones
          });
        }
        this.criterios = nuevo_criterios;
        console.log(JSON.stringify(this.criterios))
        this.serviApp.activarProgreso(false,this.TAG + metodo);
      },
      (error)=>{
        this.serviApp.errorConeccion(error);
      }
    ); 
  }

  selectView(entidad,data){
    let enc: boolean = false;
    for( let i in this.calificaciones ){
      if( this.calificaciones[i].id_criterio == data.id_criterio ){
        this.calificaciones[i] = data
        enc = true;
        break;
      }
    }
    if(!enc) this.calificaciones.push({
      "id_criterio":  data.id_criterio,
      "id_valoracion": data.id_valoracion
    });
    console.log(JSON.stringify(this.calificaciones));
  }

  enviar(visita){
    this.viewCtrl.dismiss({
      "calificaciones": this.calificaciones
    }); 
  	//this.navCtrl.push('DetalleEvolucionPage');
  }

  dismiss() {
   this.viewCtrl.dismiss();
  }

}
