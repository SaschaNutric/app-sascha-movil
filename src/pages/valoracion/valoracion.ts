import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ValoracionesProvider } from '../../providers/valoraciones/valoraciones';
import { AppservicioProvider } from '../../providers/appservicio/appservicio';

@IonicPage()
@Component({
  selector: 'page-valoracion',
  templateUrl: 'valoracion.html',
})
export class ValoracionPage {

  public TAG:string = 'ValoracionPage';
  public criterios: any[]=[];
  public calificacion: any[]=[];

  constructor(public navCtrl: NavController,
  			  public navParams: NavParams,
  			  public valoracionesProv: ValoracionesProvider,
  			  public serviApp: AppservicioProvider) { }

  ngOnInit(){
    this.getCriterios();
  }

  async getCriterios():Promise<void>{
    let metodo = ': metodo getCriterios';
    this.serviApp.activarProgreso(true,this.TAG + metodo);
    await this.valoracionesProv.getAll()
    .subscribe(
      (res)=>{
        this.criterios = res['data'];
        console.log(JSON.stringify(this.criterios))
        this.serviApp.activarProgreso(false,this.TAG + metodo);
      },
      (error)=>{
        this.serviApp.errorConeccion(error);
      }
    ); 
  }

  selectView(entidad,data){
    console.log(JSON.stringify(data))
  }

  enviar(){
  	this.navCtrl.push('DetalleEvolucionPage');
  }

}
