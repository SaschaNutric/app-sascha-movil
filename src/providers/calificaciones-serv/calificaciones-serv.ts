import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './../general.service'; 
@Injectable()
export class CalificacionesServProvider  extends GeneralService {

  constructor(protected http: HttpClient) {
    super(http,'calificaciones/orden_servicio','')
  }

  createId(body,id){
    return super.createId(body,id);
  }

}