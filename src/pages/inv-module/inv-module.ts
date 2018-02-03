import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ContextData } from '../../app/context';
import { RootNavTool } from '../../app/rootNav';

/**
 * Generated class for the InvModulePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-inv-module',
  templateUrl: 'inv-module.html',
})

export class InvModulePage {

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

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public platform: Platform,
    private alterCtrl:AlertController) {
      //初始化上下文
      this.contextdata = ContextData.Create();
      //初始化导航器
      this.rootnavtool = RootNavTool.Create();
      //接收模块信息
      if(navParams){
        this.ModuleInfo = navParams.get('ModuleInfo');
      }

  }

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

  ionViewDidLoad() {

  }


  ionViewWillEnter(){
    let token_chk:Promise<any> = this.rootnavtool.CheckLoginToken();
    if(token_chk!=null){
      //登录验证失败
      token_chk.then(()=>this.navCtrl.setRoot(LoginPage));
    }
  }
}