import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RcvCheckPage } from './rcv-check';

@NgModule({
  declarations: [
    RcvCheckPage
  ],
  imports: [
    IonicPageModule.forChild(RcvCheckPage),
  ],
  entryComponents: [
    RcvCheckPage
  ],
  exports: [
    RcvCheckPage
  ]
})
export class RcvCheckPageModule {}
