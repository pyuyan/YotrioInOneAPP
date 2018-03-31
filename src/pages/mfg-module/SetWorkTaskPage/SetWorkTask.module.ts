import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SetWorkTaskPage } from './SetWorkTask';

@NgModule({
  declarations: [
    SetWorkTaskPage
  ],
  imports: [
    IonicPageModule.forChild(SetWorkTaskPage),
  ],
  entryComponents: [
    SetWorkTaskPage
  ],
  exports: [
    SetWorkTaskPage
  ]
})
export class SetWorkTaskPageModule {}
