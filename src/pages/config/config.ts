import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http, Response} from '@angular/http';
import "rxjs/add/operator/map";
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { File } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
import { ContextData } from '../../app/context';
import { RootNavTool } from '../../app/rootNav';

/**
 * 1、读取assets/json/config.json值
 * 2、更新LocalStorage参数值
 * 3、更新assets/json/config.json
 */
@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: 'config.html'
})
export class ConfigPage {

  pagedata:any = {
    U9Portal:'',
    ESBPortal:''
  }

  jsondata:any;

  contextdata:ContextData;
  rootnavtool:RootNavTool;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private http:Http,
              private alterCtrl:AlertController,
              private file:File,
              private storage: Storage) {

      //初始化上下文
      this.contextdata = ContextData.Create();
      //初始化导航器
      this.rootnavtool = RootNavTool.Create();
  }

  /**
   * 确定按钮点击保存文件
   */
  onSubmit(){
    console.log(this.file.applicationDirectory);
    console.log(this.file.applicationStorageDirectory);

      this.file.writeExistingFile(this.file.applicationStorageDirectory+'/json/','config.json','{"U9Portal":"'+this.pagedata.U9Portal+'","ESBPortal":"'+this.pagedata.ESBPortal+'"}').
      then((res:any)=>{
        
        console.log("DONE WRITING");
        //this.storage.set('U9Portal',this.pagedata.U9Portal).then(value=>{});
        //this.storage.set('ESBPortal',this.pagedata.ESBPortal).then(value=>{});
        this.contextdata.SetESBPortal(this.pagedata.ESBPortal);

        try{
          this.navCtrl.pop();
        }catch(error){

        }

      },(error)=>{
        console.error("Error while saving image");
        console.log(error);
      });
      console.log('Done');
  }

  /**
   * 进入页面前数据预处理，读取config.json文件
   */
  ionViewWillEnter() {
    this.file.checkDir(this.file.applicationStorageDirectory,'json').then(result=>{
      if(result==false){
        this.file.createDir(this.file.applicationStorageDirectory,'json',false).then(dir=>{

        }).catch(err=>{
          //创建目录失败
        });
      }
    }).catch(err=>{
        this.file.createDir(this.file.applicationStorageDirectory,'json',false).then(dir=>{

        }).catch(err=>{
          //创建目录失败
        });
    });
    this.file.checkFile(this.file.applicationStorageDirectory+'json/','config.json').then(result=>{
      if(result){
        this.file.readAsText(this.file.applicationStorageDirectory+'json/','config.json').then(filestr=>{
          //读取已有文件数据，加载到pagedata
          var jsondata = JSON.parse(filestr);
          this.pagedata.U9Portal = jsondata['U9Portal'];
          this.pagedata.ESBPortal = jsondata['ESBPortal'];
        }).catch(err=>{

        });
      }else{
        this.pagedata.U9Portal='http://192.166.0.164';
        this.pagedata.ESBPortal='http://192.166.0.155:8280';
        this.file.writeFile(this.file.applicationStorageDirectory+'json/','config.json','{"U9Portal":"'+this.pagedata.U9Portal+'","ESBPortal":"'+this.pagedata.ESBPortal+'"}').then(
          writeres=>{

          }
        ).catch(error=>{
          //文件写入失败
        });
      }
    }).catch(error=>{
      //文件夹写入失败
      this.pagedata.U9Portal='http://192.166.0.164';
      this.pagedata.ESBPortal='http://192.166.0.155:8280';
      this.file.writeFile(this.file.applicationStorageDirectory+'json/','config.json','{"U9Portal":"'+this.pagedata.U9Portal+'","ESBPortal":"'+this.pagedata.ESBPortal+'"}').then(
        writeres=>{

        }
      ).catch(err=>{
        //文件写入失败
      });
    })
  }

}
