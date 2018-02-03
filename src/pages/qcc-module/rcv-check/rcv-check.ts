import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ToastController,ModalController } from 'ionic-angular';
import { ContextData } from '../../../app/context';
import { RootNavTool } from '../../../app/rootNav';
import { BarcodeScanner } from '@ionic-native/barcode-scanner'
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { RcvQccProvider } from '../../../providers/rcv-qcc/rcv-qcc';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { ViewChild } from '@angular/core';
import { TextInput } from 'ionic-angular/components/input/input';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Device } from '@ionic-native/device';
import { DocumentsystemProvider } from '../../../providers/documentsystem/documentsystem';
import { errorHandler } from '@angular/platform-browser/src/browser';
import { QCImageBrowser } from './rcv-check-showimg';
//import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

/**
 * 采购收货检验
 */

@IonicPage()
@Component({
  selector: 'page-rcv-check',
  templateUrl: 'rcv-check.html',
  providers:[ImagePicker,Camera,Device]
})
export class RcvCheckPage {


  @ViewChild('RcvNo') rcvno_ctrl:TextInput

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private barcodeScanner:BarcodeScanner,
    private alertCtrl:AlertController,
    private rcvprovider:RcvQccProvider,
    private docprovider:DocumentsystemProvider,
    private loadingCtrl:LoadingController,
    public toastCtrl: ToastController,
    private imagePicker: ImagePicker,
    private camera: Camera,
    private device: Device,
    public modalCtrl: ModalController) {
    //初始化上下文
    this.contextdata = ContextData.Create();
    //初始化导航器
    this.rootnavtool = RootNavTool.Create();    
    //接收模块信息
    if(navParams){
      this.FunctionInfo = navParams.get('FunctionInfo');
    }
  }

  //检验单查询数据
  rcvinfo:any = {
    RecNo: '',
    DocLineNo: '',
    PurchaseNo: '',
    DemandCode: '',
    ItemID: -1,
    ItemCode: '',
    ItemName: '',
    PUQty: 0,
    SumRcvQty: 0,
    ArriveQtyTU: 0,
    UnApproveQty: 0,
    WeightCountFlag: 'N',
    RcvID: -1,
    RcvLineID: -1,
    SupplierID: -1,
    SupplierName: '',
    RcvQtySU: 0,
    RcvQtyCU: 0,
    TotalArriveWeight: 0,
    StoreUOM: -1,
    StoreUOMName: '',
    QCDocID: -1,
    QCDocLineID: -1,
    QCTypeCode: '',
    QCTypeName: '',
    ResultCode: '',
    ResultName: '',
    QCPhoto: '',
    QCDocNo: ''
 }

  contextdata:ContextData;
  rootnavtool:RootNavTool;

  FunctionInfo:any = {
    FuncID:'',
    FuncName:'',
    IconName:'',
    PageName:'',
    FuncIdx:1
  }

  isScanDev:boolean = false;

  /**
   * 接收硬件扫描器输入
   */
  CheckScannerInput(key:KeyboardEvent){
    let keycode = key.keyCode;
    let optype = key.type;
    if(keycode===123&&optype==='keydown'){
      this.isScanDev=true;
      this.rcvno_ctrl.setValue('');
      //扫描键按下开始接收数据
      if(!this.rcvno_ctrl.isFocus()){
        this.rcvno_ctrl.setFocus();
      }
    }
    if(keycode===123&&optype==='keyup'){
      //扫描键弹起，开始检查数据
      let txtvalue = this.rcvno_ctrl.value;
      if(txtvalue)
        this.CheckInputedData(txtvalue);
    }
    if(optype==='keypress'){
      //字符输入
      this.isScanDev = false;
      if(!this.rcvno_ctrl.isFocus()){
        this.rcvno_ctrl.setFocus();
      }
    }
    if(keycode===13&&optype==='keyup'){
      if(!this.isScanDev){
        let txtvalue = this.rcvno_ctrl.value;
        if(txtvalue)
          this.CheckInputedData(txtvalue);
      }
      this.isScanDev = false;
    }
  }  

  /**
   * 校验并转换输入数据
   */
  CheckInputedData(inputdata:string){
    if(inputdata){
      if(inputdata.indexOf('#@#',0)>0){
        //二维码信息处理
        let tmpstr = inputdata.split('#@#')[1];
        tmpstr=tmpstr.replace('RCV#','');
        tmpstr=tmpstr.replace('PO#','');
        this.QueryRcvInfoByService(tmpstr,this.contextdata.GetLoginContext().OrgID);
      }else if(inputdata.indexOf(':')>0||inputdata.indexOf('：')>0){
        //手工输入信息处理
        let loader = this.loadingCtrl.create({
          content: "正在加载收货单数据..."
        });
        loader.present();
        inputdata = inputdata.replace('：',':');
        let params:string[] = inputdata.split(':');
        this.rcvprovider.GetRcvLineInfoByRcvNo(params[0],params[1],this.contextdata.GetLoginContext().OrgID).timeout(30000).subscribe({
          next:rtndata=>{
            console.log(rtndata);
            if(rtndata['RcvInfos']['RcvLine']){
              this.rcvinfo = rtndata['RcvInfos']['RcvLine'][0];
              this.CheckPhotoPath().then(()=>{
                loader.dismiss();
              });
            }else{
              loader.dismiss();
            }
          },error:err=>{
            loader.dismiss();
            let alert = this.alertCtrl.create({
                title: '收货数据加载失败',
                subTitle:'数据加载失败，请检查服务',
                buttons:['确定']
                });
            alert.present(); 
          }
        });
      }else{
        let alert = this.alertCtrl.create({
          title: '数据格式错误',
          subTitle:'数据格式错误，手工输入数据请按照如下格式录入: 收货单号:行号',
          buttons:['确定']
          });
        alert.present();         
      }
    }
  }

  ResetQCCData(){
    this.qccdata ={
      LoginToken:'',
      QCCJsonDatas:[
        {
          BillID:'',
          DocNo:'',
          QCType:'',
          CheckDate:'',
          QCOper:'',
          Approver:'',
          ApproveDate:'',
          UndoApprover:'',
          DocStatus:'',
          Memo:'',
          Org:'',
          CreatedBy:'',
          CreatedOn:'',
          QCCDocLines:[
            {
              LineID:'',
              SrcDocType:'RCV',
              SrcDocID:'',
              SrcDocLineID:'',
              SrcDocSubLineID:'-1',
              ItemMaster:'',
              QCBeginTime:'',
              QCEndTime:'',
              QCUom:'',
              TUom:'',
              QCRcvQty:'0',
              QCOKQty:'0',
              QCResult:'',
              ViceReason:'',
              QCMemo:'',
              QCPhoto:''
            }
          ]
        }
      ]
    };
  }

    //检验单数据
    qccdata:any = {
      LoginToken:'',
      QCCJsonDatas:[
        {
          BillID:'',
          DocNo:'',
          QCType:'',
          CheckDate:'',
          QCOper:'',
          Approver:'',
          ApproveDate:'',
          UndoApprover:'',
          DocStatus:'',
          Memo:'',
          Org:'',
          CreatedBy:'',
          CreatedOn:'',
          QCCDocLines:[
            {
              LineID:'',
              SrcDocType:'RCV',
              SrcDocID:'',
              SrcDocLineID:'',
              SrcDocSubLineID:'-1',
              ItemMaster:'',
              QCBeginTime:'',
              QCEndTime:'',
              QCUom:'',
              TUom:'',
              QCRcvQty:'0',
              QCOKQty:'0',
              QCResult:'',
              ViceReason:'',
              QCMemo:'',
              QCPhoto:''
            }
          ]
        }
      ]
    }


    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
    // 例子： 
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
    private FormatDate(date:Date,fmt:string):string { //author: meizz 
        var o = {
            "M+": date.getMonth() + 1, //月份 
            "d+": date.getDate(), //日 
            "h+": date.getHours(), //小时 
            "m+": date.getMinutes(), //分 
            "s+": date.getSeconds(), //秒 
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
            "S": date.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }


    /**
   * 上传保存检验单
   */
  SaveQCCDoc(){
    this.ResetQCCData();
    let orgid:string = this.contextdata.GetLoginContext().OrgID;
    let orgcode:string = this.contextdata.GetLoginContext().OrgCode;
    if(this.rcvinfo.RcvID>0){
      this.qccdata.LoginToken = this.contextdata.GetLoginContext().Token;
      this.qccdata.QCCJsonDatas[0].BillID = this.rcvinfo.QCDocID;
      this.qccdata.QCCJsonDatas[0].DocNo = this.rcvinfo.QCDocNo;
      this.qccdata.QCCJsonDatas[0].QCType = 'PuRcvQC';
      this.qccdata.QCCJsonDatas[0].CheckDate = this.FormatDate(new Date(),'yyyy-MM-dd hh:mm:ss.S');
      this.qccdata.QCCJsonDatas[0].QCOper = this.contextdata.GetLoginContext().UserCode;
      this.qccdata.QCCJsonDatas[0].DocStatus = 'Opening';
      this.qccdata.QCCJsonDatas[0].Org = this.contextdata.GetLoginContext().OrgID;
      this.qccdata.QCCJsonDatas[0].CreatedBy = this.contextdata.GetLoginContext().UserCode;
      this.qccdata.QCCJsonDatas[0].CreatedOn = this.FormatDate(new Date(),'yyyy-MM-dd hh:mm:ss.S');
      this.qccdata.QCCJsonDatas[0].QCCDocLines[0].LineID = this.rcvinfo.QCDocLineID;
      this.qccdata.QCCJsonDatas[0].QCCDocLines[0].SrcDocType = 'RCV';
      this.qccdata.QCCJsonDatas[0].QCCDocLines[0].SrcDocID = this.rcvinfo.RcvID;
      this.qccdata.QCCJsonDatas[0].QCCDocLines[0].SrcDocLineID = this.rcvinfo.RcvLineID;
      this.qccdata.QCCJsonDatas[0].QCCDocLines[0].SrcDocSubLineID = '-1';
      this.qccdata.QCCJsonDatas[0].QCCDocLines[0].ItemMaster = this.rcvinfo.ItemID;
      //this.qccdata.QCCJsonDatas[0].QCCDocLines[0].QCBeginTime = this.rcvinfo
      //this.qccdata.QCCJsonDatas[0].QCCDocLines[0].QCEndTime = this.rcvinfo
      this.qccdata.QCCJsonDatas[0].QCCDocLines[0].QCUom = this.rcvinfo.StoreUOM;
      this.qccdata.QCCJsonDatas[0].QCCDocLines[0].TUom = this.rcvinfo.StoreUOM;
      this.qccdata.QCCJsonDatas[0].QCCDocLines[0].QCRcvQty = this.rcvinfo.RcvQtySU;
      this.qccdata.QCCJsonDatas[0].QCCDocLines[0].QCOKQty = this.rcvinfo.RcvQtySU;
      this.qccdata.QCCJsonDatas[0].QCCDocLines[0].QCResult = this.rcvinfo.ResultCode;
      this.qccdata.QCCJsonDatas[0].QCCDocLines[0].ViceReason = '';
      this.qccdata.QCCJsonDatas[0].QCCDocLines[0].QCMemo = '';
      this.qccdata.QCCJsonDatas[0].QCCDocLines[0].QCPhoto = this.rcvinfo.QCPhoto;

      let loader = this.loadingCtrl.create({
        content: "执行耗时操作..."
      });
      loader.present();
      try{
        if(this.qccdata.QCCJsonDatas[0].BillID>0){
          //修改
          this.rcvprovider.CallUpdateQCCAPI(JSON.stringify(this.qccdata),orgid,orgcode).timeout(30000).subscribe({
            next:rtndata=>{
              console.log(rtndata);
              if(rtndata){
                let rtninfo:string = rtndata['DoResponse']['DoResult'];
                if(rtninfo.startsWith('[ERROR]')){
                  loader.dismiss();
                  let alert = this.alertCtrl.create({
                    title: '执行失败',
                    subTitle:rtninfo,
                    buttons:['确定']
                    });
                  alert.present(); 
                }else{
                  //调用成功
                  let toast = this.toastCtrl.create({
                    message: '执行成功',
                    duration: 2000,
                    position: 'top'
                  });
              
                  toast.present(toast);

                  this.ResetQCCData();
                  this.DoCancel();
                  loader.dismiss();
                }
              }else{
                throw new Error('调用失败，服务器返回异常,可能网络故障');
              }
            },error:err=>{
              let alert = this.alertCtrl.create({
                title: '执行失败',
                subTitle:'调用失败，服务器返回异常,可能网络故障',
                buttons:['确定']
                });
              alert.present(); 
              if(loader)
                loader.dismiss();
              throw err;
            },complete:()=>{
            }
          });
        }else{
          //新增
          this.rcvprovider.CallCreateQCCAPI(JSON.stringify(this.qccdata),orgid,orgcode).timeout(30000).subscribe({
            next:rtndata=>{
              console.log(rtndata);
              if(rtndata){
                let rtninfo:string = rtndata['DoResponse']['DoResult'];
                if(rtninfo.startsWith('[ERROR]')){
                  loader.dismiss();
                  let alert = this.alertCtrl.create({
                    title: '执行失败',
                    subTitle:rtninfo,
                    buttons:['确定']
                    });
                  alert.present(); 
                }else{
                  //调用成功
                  let toast = this.toastCtrl.create({
                    message: '执行成功',
                    duration: 2000,
                    position: 'top'
                  });
              
                  toast.present(toast);

                  this.ResetQCCData();
                  this.DoCancel();
                  loader.dismiss();
                }
              }else{
                throw new Error('调用失败，服务器返回异常,可能网络故障');
              }
            },error:err=>{
              let alert = this.alertCtrl.create({
                title: '执行失败',
                subTitle:'调用失败，服务器返回异常,可能网络故障',
                buttons:['确定']
                });
              alert.present(); 
              if(loader)
                loader.dismiss();
              throw err;
            },complete:()=>{
            }
          });
        }
      }catch(ex){
        loader.dismiss();
        let alert = this.alertCtrl.create({
          title: '执行失败',
          subTitle:'执行失败:'+ex,
          buttons:['确定']
          });
        alert.present(); 
      }

    }else{
      let alert = this.alertCtrl.create({
        title: '未加载',
        subTitle:'没有加载收货信息!',
        buttons:['确定']
        });
      alert.present(); 
    }
  }

  /**
   * 文件上传
   */
  UploadImageFile(){
    
  }

  /**
   * 数据重置
   * 
   */
  DoCancel(){
    this.rcvinfo = {
			RecNo: '',
			DocLineNo: '',
			PurchaseNo: '',
			DemandCode: '',
			ItemID: -1,
			ItemCode: '',
			ItemName: '',
			PUQty: 0,
			SumRcvQty: 0,
			ArriveQtyTU: 0,
			UnApproveQty: 0,
			WeightCountFlag: 'N',
			RcvID: -1,
			RcvLineID: -1,
			SupplierID: -1,
			SupplierName: '',
			RcvQtySU: 0,
			RcvQtyCU: 0,
			TotalArriveWeight: 0,
			StoreUOM: -1,
			StoreUOMName: '',
			QCDocID: -1,
			QCDocLineID: -1,
			QCTypeCode: '',
			QCTypeName: '',
			ResultCode: '',
			ResultName: '',
			QCPhoto: '',
			QCDocNo: ''
    }    

    // let options = {
    //   maximumImagesCount: 10, //单次允许选择的图片
    //   width: 800,
    //   height: 800,
    //   quality: 80,
    //   outputType: 0
    // };
    // this.imagePicker.getPictures(options).then(
    //   (results) => {
    //     for (var i = 0; i < results.length; i++) {
    //         console.log('Image URI: ' + results[i]);
    //     }
    //   }, (err) => { 
    //     console.log(err);
    //   }
    // );

    // let options: CameraOptions = {
    //   quality: 100,
    //   destinationType: this.camera.DestinationType.DATA_URL,
    //   encodingType: this.camera.EncodingType.JPEG,
    //   mediaType: this.camera.MediaType.PICTURE
    // }

    // this.camera.getPicture(options).then((imageData) => {
    //   // imageData is either a base64 encoded string or a file URI
    //   // If it's base64:
    //   let base64Image = 'data:image/jpeg;base64,' + imageData;

    //  }, (err) => {
    //   // Handle error
    //  });

    //this.photoViewer.show('http://a3.topitme.com/1/a7/7c/11239382057cc7ca71o.jpg');
  }

  /**
   * 打开相机拍摄
   */
  OpenCamera(){
    if(this.rcvinfo.RcvID>0){
      let options: CameraOptions = {
        quality: 85,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }
  
      this.camera.getPicture(options).then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        //let base64Image = 'data:image/jpeg;base64,' + imageData;
        let loader = this.loadingCtrl.create({
          content: "正在上传照片..."
        });
        loader.present();
        if(!this.ValidateDocSystemToken()){
          this.docprovider.LoginToDocSystem().then(loginfo=>{
              //登录成功，开始执行上传
              this.docprovider.UploadNewFile('/okm:personal/yotrio_qc/'+this.rcvinfo.QCPhoto+'/'+this.FormatDate(new Date(),'yyyy-MM-dd hh:mm:ss.S')
                        +'.jpg',imageData).then(result=>{
                          //上传成功
                          loader.dismiss();
                        }).catch(err=>{
                          loader.dismiss();
                          //上传失败
                          let alert = this.alertCtrl.create({
                            title: '照片数据保存失败',
                            subTitle:'照片数据保存失败,请重试'+err,
                            buttons:['确定']
                            });
                          alert.present();  
                        });
          }).catch(()=>{
            throw new Error('上传失败,文档系统未登录');
          });
        }else{
              //开始执行上传
              this.docprovider.UploadNewFile('/okm:personal/yotrio_qc/'+this.rcvinfo.QCPhoto+'/'+this.FormatDate(new Date(),'yyyy-MM-dd hh:mm:ss.S')
                        +'.jpg',imageData).then(result=>{
                          //上传成功
                          loader.dismiss();
                        }).catch(err=>{
                          loader.dismiss();
                          //上传失败
                          let alert = this.alertCtrl.create({
                            title: '照片数据保存失败',
                            subTitle:'照片数据保存失败,请重试'+err,
                            buttons:['确定']
                            });
                          alert.present();  
                        });          
        }
       }, (err) => {
        let alert = this.alertCtrl.create({
          title: '照片数据保存失败',
          subTitle:'照片数据保存失败,请重试'+err,
          buttons:['确定']
          });
        alert.present(); 
       });    
    }
  }


  /**
   * 相机扫描QR码
   */
  OpenCamScanner(){
    this.barcodeScanner.scan().then(
      barcodeData=>{
        console.log(barcodeData);
        //从服务器加载登录组织信息
        if(barcodeData){
          if(barcodeData.text.indexOf('#@#')>0){
            let tmpstr = barcodeData.text.split('#@#')[1];
            tmpstr=tmpstr.replace('RCV#','');
            tmpstr=tmpstr.replace('PO#','');
            this.QueryRcvInfoByService(tmpstr,this.contextdata.GetLoginContext().OrgID);
          }
        }    
      },err=>{
        console.log(err);
      }
    );

    // this.qrscaner.prepare()
    // .then((status: QRScannerStatus) => {
    //    if (status.authorized) {
    //      // camera permission was granted
  
  
    //      // start scanning
    //      let scanSub = this.qrscaner.scan().subscribe((text: string) => {
    //        console.log('Scanned something', text);

    //        if(text.indexOf('#@#')>0)
    //          this.QueryRcvInfoByService(text.split('#@#')[1],this.contextdata.GetLoginContext().OrgID);
  
    //        this.qrscaner.hide(); // hide camera preview
    //        scanSub.unsubscribe(); // stop scanning
    //      });
  
    //      // show camera preview
    //      this.qrscaner.show();
  
    //      // wait for user to scan something, then the observable callback will be called
  
    //    } else if (status.denied) {
    //      // camera permission was permanently denied
    //      // you must use QRScanner.openSettings() method to guide the user to the settings page
    //      // then they can grant the permission from there
    //    } else {
    //      // permission was denied, but not permanently. You can ask for permission again at a later time.
    //    }
    // })
    // .catch((e: any) => console.log('Error is', e));
  }

  /**
   * 调用远端服务查询收货数据
   * @param rcvlineid 
   * @param orgid 
   */
  private QueryRcvInfoByService(rcvlineid:any,orgid:any){
    let loader = this.loadingCtrl.create({
      content: "正在加载收货单数据..."
    });
    loader.present();
    this.rcvprovider.GetRcvLineInfo(rcvlineid,orgid).timeout(30000).subscribe({
      next:rtndata=>{
        if(rtndata['RcvInfos']['RcvLine']){
          this.rcvinfo = rtndata['RcvInfos']['RcvLine'][0];
          
          this.CheckPhotoPath().then(()=>{
            loader.dismiss();
          });
        }else{
          loader.dismiss();
          this.DoCancel();
        }
      },error:err=>{
        loader.dismiss();
        let alert = this.alertCtrl.create({
            title: '组织数据加载失败',
            subTitle:'数据加载失败，请检查服务',
            buttons:['确定']
            });
        alert.present(); 
      }
    });
  }

  /**
   * 检查照片保存路径
   */
  CheckPhotoPath():Promise<{}>{
    if(!this.rcvinfo.QCPhoto){
      //创建新目录
      //顺序执行函数
      let promiseIter = function (promises) {
        return new Promise((resolve, reject) => {
            nextPromise(0, promises);
            function nextPromise(index, promises) {
                let length = promises.length;
                if (index >= length) {
                    resolve();
                }
                let promise:Promise<any> = promises[index]();
                console.log(promise);
                promise.then(() => {
                  nextPromise(index + 1, promises);
                })
                .catch((err) => {
                  reject(err);
                })
            }
        });
      }
      //获取路径名
      let uuid = this.device.uuid;
      let nowdate = new Date();
      let mills = (nowdate.getFullYear()*31536000000+nowdate.getMilliseconds()).toString();
      console.log(mills);
      let setPathname = () => {
        if(!uuid){
          this.docprovider.GetNewID().subscribe({
            next:result=>{
              uuid = result['Guids']['Guid'][0]['NewGuid'];
              console.log(uuid);
              console.log('sqlID');
              this.rcvinfo.QCPhoto = uuid.substring(uuid.length-12,uuid.length)+mills;
            },error:err=>{
              return new Promise((resolve, reject) => {
                reject(err);
              }); 
            },complete:()=>{
              return new Promise((resolve, reject) => {
                resolve();
              }); 
            }
          });
        }else{
          console.log('deviceID');
          this.rcvinfo.QCPhoto = uuid.substring(uuid.length-12,uuid.length)+mills;
          return new Promise((resolve, reject) => {
            resolve();
          }); 
        }
      }
      //保存路径
      let savePathname = () => {
        if(!this.ValidateDocSystemToken()){
          this.docprovider.LoginToDocSystem().then(loginfo=>{
            //登录成功
            this.docprovider.CreateNewFolder('/okm:personal/yotrio_qc/'+this.rcvinfo.QCPhoto).then(
              createinfo=>{
                return new Promise((resolve, reject) => {
                  resolve();
                }); 
              }
            ).catch(
              ()=>{
                return new Promise((resolve, reject) => {
                  reject();
                }); 
              }
            );            
          }).catch(err=>{
            //登录失败
            let alert = this.alertCtrl.create({
              title: '登录失败，请重新打开',
              subTitle:'文档管理系统登录失败',
              buttons:['确定']
              });
            alert.present(); 
            return new Promise((resolve, reject) => {
              reject();
            }); 
          });
        }else{
          this.docprovider.CreateNewFolder('/okm:personal/yotrio_qc/'+this.rcvinfo.QCPhoto).then(
            createinfo=>{
              return new Promise((resolve, reject) => {
                resolve();
              }); 
            }
          ).catch(
            ()=>{
              return new Promise((resolve, reject) => {
                reject();
              }); 
            }
          );
        }
      }
      promiseIter([setPathname, savePathname]);
    }
    return new Promise((resolve, reject) => {
      resolve();
    }); 

  }

  ionViewDidLoad() {
    document.addEventListener('keydown', (key) => {this.CheckScannerInput(key)} );
    document.addEventListener('keypress', (key) => {this.CheckScannerInput(key)} );
    document.addEventListener('keyup', (key) => {this.CheckScannerInput(key)} );
  }

  /**
   * 校验文档系统登录状态
   */
  ValidateDocSystemToken():boolean{
    let nowdate = new Date();
    nowdate.setMinutes(nowdate.getMinutes()-30)
    if(DocumentsystemProvider.token===null||
      (DocumentsystemProvider.logintime!=null&&(nowdate>=DocumentsystemProvider.logintime)))
      return false;
    else
      return true;
  }
  
  /**
   * 照片浏览
   */
  OpenImageBrowser(){
    if(this.rcvinfo.RcvID>0){
      let modal = this.modalCtrl.create(QCImageBrowser,{viewtitle:'测试',fldpath:'/okm:personal/yotrio_qc/'+this.rcvinfo.QCPhoto});
      modal.present();
    }
  }

  /**
   * 进入前检查
   */
  ionViewCanEnter(){
    if(!this.ValidateDocSystemToken()){
        let loader = this.loadingCtrl.create({
          content: "正在加载上下文..."
        });
        loader.present();
        this.docprovider.LoginToDocSystem().then(rtn=>{
          loader.dismiss();
        }).catch(
          err=>{
            let alert = this.alertCtrl.create({
              title: '登录失败，请重新打开',
              subTitle:'文档管理系统登录失败',
              buttons:['确定']
              });
            alert.present(); 
            loader.dismiss();
            return false;
          }
        );
    }
    return true;
  }

}
