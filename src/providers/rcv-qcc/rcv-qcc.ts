import { Injectable } from '@angular/core';
import { HttpClient,HttpRequest,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ContextData } from '../../app/context';
import { Platform } from 'ionic-angular/platform/platform';


/**
 * 收货服务
 */

@Injectable()
export class RcvQccProvider {

  contextdata:ContextData;

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
   * 获取收货行信息
   */
  GetRcvLineInfo(rcvlineid:string,orgid:string):Observable<Object>{
    let currUrl = '';
    currUrl = this.GetESBAddress() +'/getrcvline/do?RcvLineID='+rcvlineid+'&OrgID='+orgid;
    console.log('Send getrcvline Request to '+currUrl); 
    return this.http.get(currUrl,{headers:this.headers});
  }

   /**
   * 根据手输收货单号获取收货行信息
   */
  GetRcvLineInfoByRcvNo(rcvno:string,lineno:string,orgid:string):Observable<Object>{
    let currUrl = '';
    currUrl = this.GetESBAddress() +'/getrcvline2/do?RcvNo='+rcvno+'&LineNo='+lineno+'&OrgID='+orgid;
    console.log('Send getrcvline Request to '+currUrl); 
    return this.http.get(currUrl,{headers:this.headers});
  }


  /**
   * 调用检验单新增API
   */
  CallCreateQCCAPI(newJsondata:string,orgid:string,orgcode:string):Observable<Object>{
    let currUrl = '';
    currUrl = this.GetESBAddress() +'/qccreate/Do?OrgCode='+orgcode+'&OrgID='+orgid+'&newJsondata='+newJsondata;
    console.log('Send getrcvline Request to '+currUrl); 
    return this.http.get(currUrl,{headers:this.headers});
  }

  /**
   * 调用检验单修改API
   */
  CallUpdateQCCAPI(updateJsondata:string,orgid:string,orgcode:string):Observable<Object>{
    let currUrl = '';
    currUrl = this.GetESBAddress() +'/qcupdate/Do?OrgCode='+orgcode+'&OrgID='+orgid+'&updateJsondata='+updateJsondata;
    console.log('Send getrcvline Request to '+currUrl); 
    return this.http.get(currUrl,{headers:this.headers});
  }

}
