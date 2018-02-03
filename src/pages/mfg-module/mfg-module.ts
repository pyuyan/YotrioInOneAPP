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

  ModuleInfo:any = {
    ModuleID:'',
    ModuleName:'',
    IconName:'',
    PageName:'',
    FuncNum:0,
    SubFuncs:[]
  };

  /**
   * 计算功能行数
   */
  GetRowCount():any{
    let rows:Array<Number> = new Array<Number>();
    let i = 1;
    if(this.ModuleInfo.FuncNum>0){
      while(i<=this.ModuleInfo.FuncNum){
        let row = Math.ceil(i/3);
        if(rows.indexOf(row,0)<0)
          rows.push(row);
        i = i+1;
      }
    }

    return rows;
  }  

  constructor(public navCtrl: NavController, public navParams: NavParams) {

      //初始化上下文
      this.contextdata = ContextData.Create();
      //初始化导航器
      this.rootnavtool = RootNavTool.Create();
      //接收模块信息
      if(navParams){
        this.ModuleInfo = navParams.get('ModuleInfo');
      }
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
