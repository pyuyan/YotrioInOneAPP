import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';
import { CommModulePage } from '../comm-module/comm-module';


@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginPage),
  ],
  entryComponents: [

  ],
  exports: [
    LoginPage
  ]
})
export class LoginPageModule {}
