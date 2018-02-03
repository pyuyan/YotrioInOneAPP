import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * 库存盘点
 */

@Component({
  selector: 'page-invcheck',
  templateUrl: 'invcheck.html',
})
export class InvcheckPage {

  FunctionInfo:any = {
    FuncID:'',
    FuncName:'',
    IconName:'',
    PageName:'',
    FuncIdx:1
  }

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InvcheckPage');
  }

}
