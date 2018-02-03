
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform,ActionSheetController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ContextData } from '../../app/context';
import { RootNavTool } from '../../app/rootNav';
import { RcvQccProvider } from '../../providers/rcv-qcc/rcv-qcc';

/**
 * 质检模块导航页
 */

@IonicPage()
@Component({
  selector: 'page-qcc-module',
  templateUrl: 'qcc-module.html',
})
export class QccModulePage {

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public platform: Platform,
    private alterCtrl:AlertController,
    private rcvprovider:RcvQccProvider) {

      //初始化上下文
      this.contextdata = ContextData.Create();
      //初始化导航器
      this.rootnavtool = RootNavTool.Create();
      //接收模块信息
      if(navParams){
        this.ModuleInfo = navParams.get('ModuleInfo');
      } 
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

  ionViewWillLeave(){
 
  }
}
