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
@IonicPage()
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

  totalsalemnydatas:any = {
    backgroundColor:'#fff',
    title : {
       text: '累计接单金额',
       textStyle:{fontSize:18}
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)",

    },
    legend: {
        left:10,
        top:35,
        data:['外部工厂','内部工厂'],
                textStyle: {
            color: '#000'
        }
    },
    series: [
         
        {
            name:'累计接接单金额内外工厂占比',
            type:'pie',
            radius: ['0', '35%'],
            center:['24%','30%'],
            color: ['#FF9200', '#0B61A4'],
            label: {
                normal: {
                    formatter: '{b}\n{d}%',
                    position:'inner'
                },
          
            },
            data:[
                {value:35, name:'外部工厂'},
                {value:79, name:'内部工厂'},
            ]
        }
    ]
  };

  totalbenfitdatas:any = {
    backgroundColor:'#fff',
    title : {
       text: '累计毛利金额',
       textStyle:{fontSize:18}
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)",

    },
    legend: {
        left:10,
        top:35,
        data:['外部工厂','内部工厂'],
                textStyle: {
            color: '#000'
        }
    },
    series: [
         
        {
            name:'累计毛利金额内外工厂占比',
            type:'pie',
            radius: ['0', '35%'],
            center:['24%','30%'],
            color: ['#FF9200', '#0B61A4'],
            label: {
                normal: {
                    formatter: '{b}\n{d}%',
                    position:'inner'
                },
          
            },
            data:[
                {value:35, name:'外部工厂'},
                {value:79, name:'内部工厂'},
            ]
        }
    ]
  };    

  benfitratedatas:any = {
    backgroundColor:'#fff',
    title : {
       text: '毛利率',
       textStyle:{fontSize:18}
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)",

    },
    legend: {
        left:10,
        top:35,
        data:['外部工厂','内部工厂'],
                textStyle: {
            color: '#000'
        }
    },
    series: [
         
        {
            name:'毛利率内外工厂占比',
            type:'pie',
            radius: ['0', '35%'],
            center:['24%','30%'],
            color: ['#FF9200', '#0B61A4'],
            label: {
                normal: {
                    formatter: '{b}\n{d}%',
                    position:'inner'
                },
          
            },
            data:[
                {value:35, name:'外部工厂'},
                {value:79, name:'内部工厂'},
            ]
        }
    ]
  };   

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
        data: [320, 302, 341, 374, 390, 1000]
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


  FunctionInfo:any = {
    FuncID:'',
    FuncName:'',
    IconName:'',
    PageName:'',
    FuncIdx:1
  }

  constructor(public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private echartsvr:NgxEchartsService, 
    public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompPage');
  }


  doChange(obj:any){
    //this.options.series.forEach(value=>{
    //    value.data=[Math.ceil(Math.random()*1000),Math.ceil(Math.random()*1000),Math.ceil(Math.random()*1000),Math.ceil(Math.random()*1000),Math.ceil(Math.random()*1000),Math.ceil(Math.random()*1000)];
    //});

    this.options.series[0].data[0] = Math.ceil(Math.random()*1000);
    this.barChartInstance = this.echartsvr.echarts.init(this.barchartdiv.nativeElement.querySelector('div'));
    this.barChartInstance.setOption(this.options);
  }

  ionViewWillEnter(){

  }

}
