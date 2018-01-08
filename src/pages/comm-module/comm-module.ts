import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ContextData } from '../../app/context';
import { RootNavTool } from '../../app/rootNav';

/**
 * 公共页面 
 */

@IonicPage()
@Component({
  selector: 'page-comm-module',
  templateUrl: 'comm-module.html',
})
export class CommModulePage {

  contextdata:ContextData;
  rootnavtool:RootNavTool;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public platform: Platform,
    private alterCtrl:AlertController) {

      this.contextdata = ContextData.Create();
      this.rootnavtool = RootNavTool.Create();

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
