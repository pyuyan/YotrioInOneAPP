import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { LoginPage } from '../pages/login/login';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ContextData } from './context';
import { RootNavTool } from './rootNav';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { ViewChild } from '@angular/core';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';


@Component({
  templateUrl: 'app.html'
})
export class YotrioInOneAPP {
  @ViewChild('mainNav') nav: NavController
  rootPage:any = LoginPage;

  contextdata:ContextData;
  rootnavtool:RootNavTool;


  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private alertCtrl:AlertController) {
      this.contextdata = ContextData.Create();
      this.rootnavtool = RootNavTool.Create();

      platform.ready().then(() => {

        //初始化上下文
        if(ContextData.inited === false){
          ContextData.InitContextData();
        }
        if(RootNavTool.inited === false){
          RootNavTool.InitRootNav(this.nav,this.alertCtrl,this.contextdata);
        }

        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        statusBar.styleDefault();
        setTimeout(()=>{
          splashScreen.hide();
        },100);

    });
  }
}

