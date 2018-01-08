import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvModulePage } from './inv-module';
import { InvcheckPage } from './invcheck/invcheck';

@NgModule({
  declarations: [
    InvModulePage,
    InvcheckPage
  ],
  imports: [
    IonicPageModule.forChild(InvModulePage),
  ],
  entryComponents: [
    InvcheckPage
  ],
  exports: [
    InvModulePage
  ]
})
export class InvModulePageModule {}
