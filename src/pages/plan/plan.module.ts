import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlanPage } from './plan';

@NgModule({
  declarations: [
    PlanPage
  ],
  imports: [
    IonicPageModule.forChild(PlanPage)
  ],
  entryComponents: [
  	PlanPage
  ]
})
export class PlanPageModule {}