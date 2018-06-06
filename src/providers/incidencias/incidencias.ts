import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './../general.service'; 

@Injectable()
export class IncidenciasProvider  extends GeneralService {

  constructor(protected http: HttpClient) {
    super(http,'incidencia','s')
  }

  create(body){
    return super.create(body);
  }

}