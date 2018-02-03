import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { FormBuilder,Validators } from '@angular/forms'

/**
 * 派工页面
 */

@Component({
  selector: 'page-SetWorkTask',
  templateUrl: 'SetWorkTask.html',
})
export class SetWorkTaskPage {

  FunctionInfo:any = {
    FuncID:'',
    FuncName:'',
    IconName:'',
    PageName:'',
    FuncIdx:1
  }

  constructor(public navCtrl: NavController,
    private formBuilder: FormBuilder,
    public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetWorkTaskPage');
  }

}
