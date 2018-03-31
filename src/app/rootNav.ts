import { CommModulePage } from "../pages/comm-module/comm-module";
import { LoginPage } from "../pages/login/login";
import { QccModulePage } from "../pages/qcc-module/qcc-module";
import { MfgModulePage } from "../pages/mfg-module/mfg-module"
import { ContextData } from "./context";
import { NavController } from "ionic-angular/navigation/nav-controller";
import { AlertController } from "ionic-angular/components/alert/alert-controller";
import { NgModule } from '@angular/core';
import { Injectable } from "@angular/core";

/**
 * 导航工具类
 */
 @Injectable()
 export class RootNavTool{

    static instance:RootNavTool;

    static inited:boolean = false;

    static context:ContextData;

    static commmodulepage:any;
    static loginpage:any;
    static qccmodulepage:any;

    static mainNav:NavController
    static alertCtrl:AlertController

    public static Create(){
        if(!RootNavTool.instance)
            RootNavTool.instance = new RootNavTool();
        return RootNavTool.instance;
      }

    public static InitRootNav(rootnav: NavController,alertctrl:AlertController,contextobj:ContextData){
        RootNavTool.mainNav = rootnav;
        RootNavTool.alertCtrl = alertctrl;

        RootNavTool.commmodulepage = CommModulePage;
        RootNavTool.loginpage = LoginPage;
        RootNavTool.qccmodulepage = QccModulePage;

        if(contextobj)
            RootNavTool.context = ContextData.Create();
        else
            RootNavTool.context = contextobj;

        RootNavTool.inited = true;
    }

   /**
   * 导航到目标模块
   */
  NavToTargetModule(rightinfo:any,childnav:NavController){
    RootNavTool.mainNav.setRoot(rightinfo.PageName,{ModuleInfo:rightinfo});
  }

  /**
   * 导航到目标功能页面
   */
  NavToTargetFunc(funcinfo:any){
    RootNavTool.mainNav.push(funcinfo.PageName,{FunctionInfo:funcinfo});
  }

  /**
   * 导航到默认模块
   */
  NavToDefaultModule(){
    for (const moduleinfo of RootNavTool.context.GetRightContext()) {
      if(moduleinfo.IsDefault==='Y'){
        RootNavTool.mainNav.setRoot(moduleinfo.PageName,{ModuleInfo:moduleinfo});
        break;
      }
    }
  }
  
  /**
   * 打开登录页
   */
  OpenLoginPage(){
    RootNavTool.mainNav.setRoot(LoginPage,{usercode:RootNavTool.context.GetLoginContext().UserCode,
      username:RootNavTool.context.GetLoginContext().UserName,
      orgid:RootNavTool.context.GetLoginContext().OrgID,
      orgcode:RootNavTool.context.GetLoginContext().OrgCode,
      orgname:RootNavTool.context.GetLoginContext().OrgName,
      userpass:RootNavTool.context.GetLoginContext().UserPass});
    RootNavTool.context.ClearLoginContext();
  }

  CheckLoginToken():any{
    if(!ContextData.logincontext.Token){
      //未登录，返回登录页
      let alert = RootNavTool.alertCtrl.create({
        title: '登录验证失败',
        subTitle:'登录过期，请重新登录',
        buttons:['确定']
        });
      return alert.present(); 
    }else{
      return null;
    }
  }

    /**
   * 登出
   */
  doLogout(){
    let confirm = RootNavTool.alertCtrl.create({
      title: '是否退出登录',
      message: '继续将退出本次登录，是否继续？',
      buttons: [
        {
          text: '取消',
          handler: () => {
            
          }
        },
        {
          text: '确定',
          handler: () => {
            this.OpenLoginPage();
          }
        }
      ]
    });
    confirm.present();
  }

 }