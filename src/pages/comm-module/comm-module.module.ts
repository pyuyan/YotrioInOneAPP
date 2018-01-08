import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommModulePage } from './comm-module';
import { forwardRef } from '@angular/core';
import { ContextData } from '../../app/context';
import { RootNavTool } from '../../app/rootNav';

@NgModule({
  declarations: [
    CommModulePage
  ],
  imports: [
    IonicPageModule.forChild(CommModulePage),
  ],
  entryComponents: [

  ],
  exports: [
    CommModulePage,
  ]

})
export class CommModulePageModule {}
