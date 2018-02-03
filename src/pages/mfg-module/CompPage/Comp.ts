import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { FormBuilder,Validators } from '@angular/forms'
import { ViewChild,ElementRef } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner'

/**
 * 报工点收页
 * 2017-12-23
 * Yuyan Pan
 */

@Component({
  selector: 'page-comp',
  templateUrl: 'Comp.html',
})
export class CompPage {

  FunctionInfo:any = {
    FuncID:'',
    FuncName:'',
    IconName:'',
    PageName:'',
    FuncIdx:1
  }

  constructor(public navCtrl: NavController,
    private formBuilder: FormBuilder,
    public navParams: NavParams,
    private barcodeScanner:BarcodeScanner,
    private alertCtrl:AlertController) {

  }

  OpenCam(){
    this.barcodeScanner.scan().then(
      barcodeData=>{
                            let alert = this.alertCtrl.create({
                                title: '扫描成功',
                                subTitle:barcodeData.text,
                                buttons:['确定']
                                });
                                alert.present();         
      },err=>{
        console.log(err);
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompPage');
  }

}
