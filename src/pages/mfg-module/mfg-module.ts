import { Component } from '@angular/core';
import { ManagePage } from './ManagePage/manage';
import { EmployeePage } from './EmployeePage/employee';
import { CompPage } from './CompPage/Comp';
import { SetWorkTaskPage } from './SetWorkTaskPage/SetWorkTask';
import { NavController, NavParams,IonicPage } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ContextData } from '../../app/context';
import { RootNavTool } from '../../app/rootNav';

@IonicPage()
@Component({
  selector: 'page-mfg-module',
  templateUrl: 'mfg-module.html'
})
export class MfgModulePage {

  contextdata:ContextData;
  rootnavtool:RootNavTool;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.contextdata = ContextData.Create();
    this.rootnavtool = RootNavTool.Create();

  }

  OpenUserInfoPage(){
    //this.navCtrl.push(LoginPage);
  }

  doLogout(){
    this.navCtrl.push(LoginPage);
  }
  

  OpenEmployeePage(){
    this.navCtrl.push(EmployeePage);
  }

  OpenManagePage(){
    this.navCtrl.push(ManagePage);
  }

  OpenSetWorkTaskPage(){
    this.navCtrl.push(SetWorkTaskPage);
  }

  OpenCompPage(){
    this.navCtrl.push(CompPage);
  }

  ionViewWillEnter(){
    let token_chk:Promise<any> = this.rootnavtool.CheckLoginToken();
    if(token_chk!=null){
      //登录验证失败
      token_chk.then(()=>this.navCtrl.setRoot(LoginPage));
    }
  }

}
