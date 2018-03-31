import { Injectable } from '@angular/core';
import { HttpClient,HttpRequest,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ContextData } from '../../app/context';
import { Platform } from 'ionic-angular/platform/platform';

/**
 * 文档管理系统连接组件
 */
@Injectable()
export class DocumentsystemProvider {

  contextdata:ContextData;

  static token:string = null;
  static logintime:Date = null;

  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(public http: HttpClient,
    public platform:Platform) {
      //初始化上下文
      this.contextdata = ContextData.Create();
  }

  /**
   * 获取ESB服务器地址
   */
  private GetESBAddress():string{
    let str = this.contextdata.GetESBPortal();
    if(str===null){
      str = "/esbsv";
    }
    if(this.platform.is('mobileweb'))
      str = "/esbsv";
    return str;
  }  

  /**
   * 提交openkm系统auth信息
   */
  CallWebDavAuth(loginuser:string,pass:string):Observable<Object>{
    let currUrl = '';
    let logindata = {
      user:loginuser,
      password:pass
    }
    currUrl = this.GetESBAddress() +'/FileSytemLogin/login';
    console.log('Send filesystemlogin Request to '+currUrl); 
    return this.http.post(currUrl,logindata,{headers:this.headers});
  }

  
  /**
   * 创建目录
   */
  CreateNewFolder(foldpath:string):Promise<any>{
    return this.CallNewFolderAPI(foldpath,DocumentsystemProvider.token).timeout(30000).toPromise().then(
      result=>{
        if(result['createSimpleResponse']){
          result = result['createSimpleResponse']['return'];
        }else{
          //登录失败
          throw new Error('目录创建失败');          
        }
        return new Promise((resolve, reject) => {
          resolve(result);
        }); 
      }
    ).catch(
      err=>{
        return new Promise((resolve, reject) => {
          reject(err);
        }); 
      }
    );
  }

  /**
   * 获取Base64格式文件内容
   * @param filepath 
   */
  GetFileContent(filepath:string):Promise<any>{
    return this.CallFileContentAPI(filepath,DocumentsystemProvider.token).timeout(30000).toPromise().then(
      content=>{
        if(content['getContentResponse']){
          content = content['getContentResponse']['return'];
        }else{
          //检索文件内容失败
          throw new Error('文件路径：'+filepath+'不存在');          
        }
        return new Promise((resolve, reject) => {
          resolve(content);
        }); 
      }
    ).catch(err=>{
      return new Promise((resolve, reject) => {
        reject(err);
      }); 
    });
  }

  /**
   * 获取文件内容API(base64)
   */
  CallFileContentAPI(filepath:string,tokenstr:string):Observable<Object>{
    let currUrl = '';
    let fileinfo = {
      token:tokenstr,
      docPath:filepath
    }
    currUrl = this.GetESBAddress() +'/GetFileContent/getfile';
    console.log('Send GetFileContentAPI Request to '+currUrl); 
    return this.http.post(currUrl,fileinfo,{headers:this.headers});    
  }

  /**
   * 登录到文档系统
   */
  LoginToDocSystem():Promise<any>{
    return this.CallWebDavAuth('yotrio_qc','admin123!').timeout(30000).toPromise().then(
      loginfo=>{
        console.log(loginfo);
        let openkm_token = loginfo['loginResponse'];
        if(openkm_token['return']){
          DocumentsystemProvider.token = openkm_token['return'];
          DocumentsystemProvider.logintime = new Date();
        }else{
          //登录失败
          throw new Error('文档管理系统登录失败');          
        }
        return new Promise((resolve, reject) => {
          resolve(DocumentsystemProvider.token);
        }); 
      }
    ).catch(
      err=>{
        DocumentsystemProvider.token = null;
        DocumentsystemProvider.logintime = null;
        return new Promise((resolve, reject) => {
          reject(err);
        }); 
      }
    );
  }  

  /**
   * 创建文件夹
   */
  CallNewFolderAPI(foldpath:string,tokenstr:string):Observable<Object>{
    let currUrl = '';
    let newfolder = {
      token:tokenstr,
      fldPath:foldpath
    }
    currUrl = this.GetESBAddress() +'/CreateFolder/createSimple';
    console.log('Send filesystemlogin Request to '+currUrl); 
    return this.http.post(currUrl,newfolder,{headers:this.headers});    
  }

  /**
   * 创建文件
   */
  CallNewFileAPI(filepath:string,tokenstr:string,base64content:string):Observable<Object>{
    let currUrl = '';
    let newfiledata = {
      token:tokenstr,
      docPath:filepath,
      content:base64content
    }
    currUrl = this.GetESBAddress() +'/CreateFile/createSimple';
    console.log('Send filesystemlogin Request to '+currUrl); 
    return this.http.post(currUrl,newfiledata,{headers:this.headers});    
  }

  /**
   * 上传新文件
   */
  UploadNewFile(filepath:string,imageData:string):Promise<any>{
    //登录成功，开始执行上传
    return this.CallNewFileAPI(filepath,DocumentsystemProvider.token,imageData).timeout(60000).toPromise().then(
      result=>{
        if(result['createSimpleResponse']){
          result = result['createSimpleResponse']['return'];
        }else{
          //登录失败
          throw new Error('文件上传失败');          
        }
        return new Promise((resolve, reject) => {
          resolve(result);
        }); 
      }
    ).catch(
      err=>{
        return new Promise((resolve, reject) => {
          reject(err);
        }); 
      }
    );
  }

  /**
   * 根据目录检索子项文件API
   */
  CallGetChildrenFilesAPI(foldpath:string,tokenstr:string):Observable<Object>{
    let currUrl = '';
    let foldinfo = {
      token:tokenstr,
      fldPath:foldpath
    }
    currUrl = this.GetESBAddress() +'/GetChildrenFiles/childs';
    console.log('Send GetChildrenFiles Request to '+currUrl); 
    return this.http.post(currUrl,foldinfo,{headers:this.headers});    
  }

  /**
   * 获取文件列表
   */
  GetChildrenFilesInfo(foldpath:string):Promise<any>{
    //登录成功，开始执行上传
    return this.CallGetChildrenFilesAPI(foldpath,DocumentsystemProvider.token).timeout(30000).toPromise().then(
      result=>{
        if(result['getChildrenResponse']){
          result = result['getChildrenResponse']['return'];
        }else{
          //ERROR
          throw new Error('获取文件列表失败');          
        }
        return new Promise((resolve, reject) => {
          resolve(result);
        }); 
      }
    ).catch(
      err=>{
        return new Promise((resolve, reject) => {
          reject(err);
        }); 
      }
    );
  }  

  /**
   * 生成新ID
   */
  GetNewID():Observable<Object>{
    let currUrl = '';
    currUrl = this.GetESBAddress() +'/GetNewID/newid';
    console.log('Send newid Request to '+currUrl); 
    return this.http.get(currUrl,{headers:this.headers});
  }  

}
