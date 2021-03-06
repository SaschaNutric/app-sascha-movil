import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Alert, AlertController, IonicPage, Loading, LoadingController, NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  error: string;
  public TAG: string = 'LoginPage ';
  public loading: Loading;
  public loginForm: FormGroup;
  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public auth: AuthProvider,
    formBuilder: FormBuilder,
    public http: HttpClient,
    private storage: Storage) {
    this.loginForm = formBuilder.group({
      email: [
        '',
        Validators.compose([Validators.required, EmailValidator.isValid])
      ],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(4)])
      ]
    });

  }
  async loginUser(): Promise<void> {
    if (!this.loginForm.valid) {
      console.log(`Formulario no valido, concurente valor: ${this.loginForm.value}`);
    } else {
      this.loading = this.loadingCtrl.create();
      this.loading.present();
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      await this.auth.loginUser(email, password).subscribe(
        (res)=>{
          this.storage.set('usuario', res);
          window.location.reload();
          this.loading.dismiss();
        },
        (error)=>{
          console.log( JSON.stringify(error) );
          this.loading.dismiss();
          const alert: Alert = this.alertCtrl.create({
            message: 'correo ó contraseña no valido',
            buttons: [{ text: 'Ok', role: 'cancelar' }]
          });
          alert.present();
        }
      );
    }
  }
  
}
