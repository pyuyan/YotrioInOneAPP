import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * 采购收货检验
 */

@Component({
  selector: 'page-rcv-check',
  templateUrl: 'rcv-check.html',
})
export class RcvCheckPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RcvCheckPage');
  }

}
