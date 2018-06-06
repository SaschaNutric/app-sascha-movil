import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './../general.service'; 
@Injectable()
export class ValoracionesServProvider extends GeneralService {

  constructor(protected http: HttpClient) {
    super(http,'criterios/servicio','')
  }

  getBodyId(id,body){
    return super.getBodyId(id,body);
  }

}