import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QccModulePage } from './qcc-module';
import { RcvCheckPage } from './rcv-check/rcv-check';

@NgModule({
  declarations: [
    QccModulePage,
    RcvCheckPage
  ],
  imports: [
    IonicPageModule.forChild(QccModulePage),
  ],
  entryComponents: [
    RcvCheckPage,
  ],
  exports: [
    QccModulePage
  ]
})
export class QccModulePageModule {}
