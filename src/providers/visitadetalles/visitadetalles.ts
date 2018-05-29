import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './../general.service'; 
@Injectable()
export class VisitadetallesProvider extends GeneralService {

  constructor(protected http: HttpClient) {
    super(http,'detalles/visita','')
  }

  get(id){
    return super.get(id);
  }

}