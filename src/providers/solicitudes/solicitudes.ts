import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './../general.service'; 

@Injectable()
export class SolicitudesProvider extends GeneralService {

  constructor(protected http: HttpClient) {
    super(http,'solicitud','es')
  }

  create(data){
  	let body:any = {
  		"id_empleado": data.empleado.id_empleado,
  		"id_cliente": data.cliente.id_cliente,
  		"id_servicio": data.servicio.id_servicio,
  		"id_motivo": data.motivo.id_motivo,
  		"id_bloque_horario": data.bloque_horario.id_bloque_horario,
  		"fecha": data.fecha
  	};
    return super.create(body);
  }

}