import { Component } from '@angular/core';
import { App } from 'ionic-angular/components/app/app';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular/platform/platform';
import { StatusBar } from '@ionic-native/status-bar';
import { File } from '@ionic-native/file';
import { Select } from 'ionic-angular/components/select/select';
import { LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/timeout'
import { LoginsvrProvider } from '../../providers/loginsvr/loginsvr';
import { CommModulePage } from '../comm-module/comm-module';
import { ConfigPage } from '../config/config';
import { ResetpassPage } from '../resetpass/resetpass';
import { QccModulePage } from '../qcc-module/qcc-module';
import { ContextData } from '../../app/context';
import { RootNavTool } from '../../app/rootNav';
import { Observable } from 'rxjs';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

    contextdata:ContextData;
    rootnavtool:RootNavTool;

  logindata:any = {
    UserCode:'',
    UserName:'',
    OrgID:-1,
    OrgCode:'',
    OrgName:'',
    UserPass:'',
    DeptID:'',
    DeptCode:'',
    DeptName:'',
    Location:'',
    LocationName:'',
    Token:'',
    SaveFlag:false
  }

    orginfos:any = {
        LoginOrgs:{
            LoginOrg:[{

            }]
        }
    };

    constructor(
        public navCtrl:NavController,
        public navparam:NavParams,
        private alterCtrl:AlertController,
        private loginSvrTool:LoginsvrProvider,
        public storage:Storage,
        private file:File,
        private loadingCtrl: LoadingController,
        public platform:Platform) {


        //初始化上下文
        this.contextdata = ContextData.Create();
        //初始化导航器
        this.rootnavtool = RootNavTool.Create();

            if(navparam){
                //设置默认值
                this.logindata.UserCode = navparam.get('usercode');
                this.logindata.UserName = navparam.get('username');
                this.logindata.OrgID = navparam.get('orgid');
                this.logindata.OrgCode = navparam.get('orgcode');
                this.logindata.OrgName = navparam.get('orgname');
                this.logindata.UserPass = navparam.get('userpass');
            }

           //从配置文件加载远端服务器地址
           this.file.checkFile(this.file.applicationStorageDirectory+'json/','config.json').then(result=>{
            if(result){
                this.file.readAsText(this.file.applicationStorageDirectory+'json/','config.json').then(filestr=>{
                    //读取已有文件数据，加载到pagedata
                    var jsondata = JSON.parse(filestr);
                    //this.storage.set('U9Portal',jsondata['U9Portal']).then(value=>{});
                    //this.storage.set('ESBPortal',jsondata['ESBPortal']).then(value=>{});
                    this.contextdata.SetESBPortal(jsondata['ESBPortal']);
                  }).catch(err=>{

                  });
            }else{
                //this.storage.set('U9Portal','http://192.166.0.164').then(value=>{});
                //this.storage.set('ESBPortal','http://192.168.0.197:8280').then(value=>{});
                this.contextdata.SetESBPortal('http://192.168.0.197:8280');
            }
        }).catch(error=>{
            //this.storage.set('U9Portal','http://192.166.0.164').then(value=>{});
            //this.storage.set('ESBPortal','http://192.168.0.197:8280').then(value=>{});
            this.contextdata.SetESBPortal('http://192.168.0.197:8280');
        });

        //从服务器加载登录组织信息
        let loader = this.loadingCtrl.create({
            content: "正在加载组织数据..."
        });
        loader.present();        
        setTimeout(doinit=>{
            this.loginSvrTool.getOrgInfos().timeout(30000).subscribe({
                next:orgs=>{
                this.orginfos = orgs;
                //console.log(this.orginfos);
                },error:err=>{
                    loader.dismiss();
                    let alert = this.alterCtrl.create({
                        title: '组织数据加载失败',
                        subTitle:this.contextdata.GetESBPortal()+'数据加载失败，请检查服务.'+err,
                        buttons:['确定']
                        });
                    alert.present(); 
                },complete:()=>{
                    loader.dismiss();
                }
            });
        },2000);

        //读取保存的登录信息
        this.storage.get('logindata').then(result=>{
            if(result){
                this.logindata = result;
            }
        }).catch(()=>{
      
        });
    }

    /**
     * 组织变更
     */
    onOrgChange(obj:Select){
        this.logindata.OrgCode = obj._text.split('-',2)[0];
        this.logindata.OrgName = obj._text.split('-',2)[1];
        this.logindata.OrgID = obj._value;

        //console.log(this.logindata);
    }

    /**
     * 打开配置页面
     */
    doConfig(){
        this.navCtrl.push(ConfigPage)
    }

    doReset(){
        this.navCtrl.push(ResetpassPage)
    }    

    /**
     * 执行登录动作
     */
    doLogin(){

        // this.logindata.Token = 'xxxxxx';
        // this.contextdata.SetLoginContext(this.logindata);
        // this.rootnavtool.NavToDefaultModule();

        // console.log(this.contextdata.GetLoginContext());

        try{
            var loginresult:string = '';
            this.ValidateLoginInfo();
            let loader = this.loadingCtrl.create({
                content: "登录系统..."
              });
            loader.present();
            this.loginSvrTool.doLogin(this.logindata.OrgCode,this.logindata.OrgID,this.logindata.UserCode,this.logindata.UserPass).timeout(30000).subscribe({
                next:data=>{
                  loginresult = data['DoResponse']['DoResult'];
                  this.logindata.Token = loginresult;
                  this.contextdata.SetLoginContext(this.logindata);
                  if(this.logindata.SaveFlag){
                        this.storage.set('logindata',this.logindata).then(value=>{});
                  }else{
                        this.storage.set('logindata',null).then(value=>{});
                  }
                    
                },
                error:ex=>{
                  //console.log(ex);
                  loader.dismiss();
                    try{
                        loginresult = ex['error']['Fault']['faultstring']['$']
                        let alert = this.alterCtrl.create({
                          title: '登录失败',
                          subTitle:loginresult,
                          buttons:['确定']
                          });
                          alert.present();  
                    }catch(ex2){
                        let alert = this.alterCtrl.create({
                            title: '登录失败,未知错误',
                            subTitle:ex,
                            buttons:['确定']
                            });
                            alert.present(); 
                    }
                },
                complete:()=>{
                    loader.dismiss();
                    //跳转到主导航页并设为Root
                    this.rootnavtool.NavToDefaultModule();
                }
              });
        }catch(e){
            let alert = this.alterCtrl.create({
                title: '登录失败',
                subTitle:e,
                buttons:['确定']
            });
            alert.present();
        }
    }

    /**
     * 登录校验
     */
    ValidateLoginInfo(){
        
        if(this.logindata.UserCode==''||this.logindata.UserPass==''){
            throw new Error('登录用户名与密码不能为空');
        }
        if(this.logindata.OrgCode==''||this.logindata.OrgCode==null){
            throw new Error('登录组织不能为空');
        }
        
    }

    /**
     * 首次加载页面，从远端服务读取数据
     */
    ionViewDidLoad(){

    }

    /*
    * 每次进入页面读取配置远程服务器地址
    */
    ionViewCanEnter(){
        
        return true;
    }

}
