import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MfgModulePage } from './mfg-module';
import { ManagePage } from './ManagePage/manage';
import { EmployeePage } from './EmployeePage/employee';
import { CompPage } from './CompPage/Comp';
import { SetWorkTaskPage } from './SetWorkTaskPage/SetWorkTask';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  declarations: [
    MfgModulePage,
    ManagePage,
    EmployeePage,
    CompPage,
    SetWorkTaskPage
  ],
  imports: [
    IonicPageModule.forChild(MfgModulePage),
    NgxEchartsModule
  ],
  entryComponents: [
    ManagePage,
    EmployeePage,
    CompPage,
    SetWorkTaskPage
  ],
  exports: [
    MfgModulePage
  ]
})
export class MfgModulePageModule {}
