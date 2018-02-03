import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QccModulePage } from './qcc-module';
import { RcvCheckPage } from './rcv-check/rcv-check';
import { RcvCheckPageModule } from './rcv-check/rcv-check.module';
import { QCImageBrowser } from './rcv-check/rcv-check-showimg';

@NgModule({
  declarations: [
    QccModulePage,
    QCImageBrowser
  ],
  imports: [
    IonicPageModule.forChild(QccModulePage),
    RcvCheckPageModule
  ],
  entryComponents: [
    QCImageBrowser
  ],
  exports: [
    QccModulePage
  ]
})
export class QccModulePageModule {}
