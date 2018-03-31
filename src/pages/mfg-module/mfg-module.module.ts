import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MfgModulePage } from './mfg-module';
import { NgxEchartsModule } from 'ngx-echarts';
import { CompPageModule } from './CompPage/Comp.module';
import { EmployeePageModule } from './EmployeePage/employee.module';
import { ManagePageModule } from './ManagePage/manage.module';
import { SetWorkTaskPageModule } from './SetWorkTaskPage/SetWorkTask.module';

@NgModule({
  declarations: [
    MfgModulePage,
  ],
  imports: [
    IonicPageModule.forChild(MfgModulePage),
    NgxEchartsModule,
    CompPageModule,
    EmployeePageModule,
    ManagePageModule,
    SetWorkTaskPageModule,
  ],
  entryComponents: [
  ],
  exports: [
    MfgModulePage,
  ],
  providers:[

  ]
})
export class MfgModulePageModule {}
