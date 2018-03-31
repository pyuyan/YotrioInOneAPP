import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ManagePage } from './manage';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  declarations: [
    ManagePage
  ],
  imports: [
    IonicPageModule.forChild(ManagePage),
    NgxEchartsModule
  ],
  entryComponents: [
    ManagePage
  ],
  exports: [
    ManagePage
  ]
})
export class ManagePageModule {}
