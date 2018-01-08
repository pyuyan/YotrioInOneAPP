import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Storage } from '@ionic/storage';

/*
U9系统登录登出服务操作
*/
@Injectable()
export class LoginsvrProvider {

  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(public http: HttpClient,
              private storage: Storage) {

  }

  /*
  登录U9系统
  */
  doLogin(OrgCode:string,OrgID:string,loginUserCode:string,password:string):Promise<Observable<Object>>{
    let currUrl = '';
    return this.storage.get('ESBPortal').then(str=>{
      console.log(str);
      if(str===null){
        str = "/u9login";
      }
      currUrl = str +'/u9login/Do?OrgCode='+OrgCode+'&OrgID='+OrgID+'&loginUserCode='+loginUserCode+'&password='+password;
      console.log('Send Login Request to '+currUrl); 
      return this.http.get(currUrl,{'headers':this.headers});
    });
  }

  /**
   * 获取登录组织信息
   */
  getOrgInfos():Promise<Observable<Object>>{
    let currUrl = '';
    return this.storage.get('ESBPortal').then(str=>{
      console.log(str);
      currUrl = str +'/getorgs/orgs';
      console.log('Send GetOrg Request to '+currUrl); 
      return this.http.get(currUrl,{'headers':this.headers});
    });
  }

}
