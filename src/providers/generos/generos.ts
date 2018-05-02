import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './../general.service'; 

@Injectable()
export class GenerosProvider extends GeneralService {

  constructor(protected http: HttpClient) {
    super(http,'generos')
  }

  getAll(){
    return super.getAll();
  }

}