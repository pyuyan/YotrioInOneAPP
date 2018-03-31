import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Button } from 'ionic-angular';

/**
 * 密码重置页
 */


@Component({
  selector: 'page-resetpass',
  templateUrl: 'resetpass.html',
})
export class ResetpassPage {

  @ViewChild('sendcodebtn') sendcodeBtn:Button

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
    Token:''
  }

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  /** 
   * 发送短信验证码
  */
  SendSMSCode(){
    this.sendcodeBtn.color = "light";
    this.sendcodeBtn.getNativeElement().innerText = "已发送";
    this.sendcodeBtn.getNativeElement().disabled = true;
   
    setTimeout(resetBtn=>{
      this.sendcodeBtn.color = "danger";
      this.sendcodeBtn.getNativeElement().innerText = "重新发送";
      this.sendcodeBtn.getNativeElement().disabled = false;
    },30000);
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetpassPage');
  }

}
