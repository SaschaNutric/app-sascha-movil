import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';

/**
 * Generated class for the PerfilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {

  constructor(public navCtrl: NavController) {
  }

  ionViewDidEnter(){
    console.log('ionViewDidLoad PerfilPage');
  }

}
