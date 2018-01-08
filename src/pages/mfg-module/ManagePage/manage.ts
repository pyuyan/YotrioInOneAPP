import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { FormBuilder,Validators } from '@angular/forms';
import { ViewChild,ElementRef } from '@angular/core';
import { LoginPage } from '../../login/login';
import { NgxEchartsService,NgxEchartsModule } from 'ngx-echarts';
import { ContextData } from '../../../app/context';

/**
 * 组长查询页面
 */

@Component({
  selector: 'page-manage',
  templateUrl: 'manage.html'
})
export class ManagePage {

  logindata:any = {
    UserCode:'',
    UserName:'',
    OrgID:-1,
    OrgCode:'',
    OrgName:'',
    UserPass:'',
    DeptID:'',
    DeptCode:'',
    DeptName:''
}


barChartInstance:any

  @ViewChild('barchart')
  barchartdiv:ElementRef;

  options = {
    legend: {
      data: ['订单数量', '报工数量','待完工']
    },
    tooltip : {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'value'
      }
    ],
    yAxis: [
      {
        type: 'category',
        axisTick: {show: false},
        data: ['10/切割','20/打弯','30/焊接','40/喷涂','50/组装','60/包装']
      }
    ],
    series: [
      {
        name: '订单数量',
        type: 'bar',
        itemStyle: {
          normal: {
            color:'#51616D'
          },
          emphasis: {
              barBorderWidth: 1,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowColor: 'rgba(0,0,0,0.5)'
          }
        },
        label: {
          normal: {
            show: true,
            position: 'insideLeft'
          }
        },
        data: [320, 302, 341, 374, 390, 450]
      },
      {
        name: '报工数量',
        type: 'bar',
        stack: 'Total',
        itemStyle: {
          normal: {
            color:'#77ABAD'
          },
          emphasis: {
              barBorderWidth: 1,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowColor: 'rgba(0,0,0,0.5)'
          }
        },
        label: {
          normal: {
            show: true,
            position: 'insideLeft'
          }
        },
        data: [200, 170, 240, 244, 200, 220]
      },
      {
        name: '待完工',
        type: 'bar',
        stack: 'Total',
        itemStyle: {
          normal: {
            color:'#C25552'
          },
          emphasis: {
              barBorderWidth: 1,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowColor: 'rgba(0,0,0,0.5)'
          }
        },
        label: {
          normal: {
            show: true,
            position: 'insideLeft'
          }
        },
        data: [120, 132, 101, 134, 190, 230]
      }
    ]
  };


  constructor(public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private echartsvr:NgxEchartsService, 
    public navParams: NavParams) {
      this.logindata = this.navParams.get('logindata');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompPage');
  }


  doChange(obj:any){
    this.options.series.forEach(value=>{
        value.data=[Math.ceil(Math.random()*1000),Math.ceil(Math.random()*1000),Math.ceil(Math.random()*1000),Math.ceil(Math.random()*1000),Math.ceil(Math.random()*1000),Math.ceil(Math.random()*1000)];
    });
    this.barChartInstance = this.echartsvr.echarts.init(this.barchartdiv.nativeElement.querySelector('div'));
    this.barChartInstance.setOption(this.options);
  }

  ionViewWillEnter(){

  }

}
