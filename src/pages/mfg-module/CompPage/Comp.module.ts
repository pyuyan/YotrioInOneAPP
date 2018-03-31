import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompPage } from './Comp';

@NgModule({
  declarations: [
    CompPage
  ],
  imports: [
    IonicPageModule.forChild(CompPage),
  ],
  entryComponents: [
    CompPage
  ],
  exports: [
    CompPage
  ]
})
export class CompPageModule {}
