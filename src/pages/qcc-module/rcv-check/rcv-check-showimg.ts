import { Component } from '@angular/core';
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { DocumentsystemProvider } from '../../../providers/documentsystem/documentsystem';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ImageViewerController } from 'ionic-img-viewer';

@Component({
    templateUrl: 'imagesbrowser.html',
}
)
export class QCImageBrowser {
    imagesContext:Array<any> = new Array<any>();

    _imageViewerCtrl: ImageViewerController;

    viewtitle:string = '图片浏览';
  
    constructor(
      public platform: Platform,
      public params: NavParams,
      public viewCtrl: ViewController,
      private docprovider: DocumentsystemProvider,
      private loadingCtrl:LoadingController,
      private alertCtrl:AlertController,
      private imageViewerCtrl: ImageViewerController
    ) {

        this._imageViewerCtrl = imageViewerCtrl;  

      //this.imagesContext = characters[this.params.get('photopath')];
      this.viewtitle = this.params.get('title');

      let fldpath = this.params.get('fldpath');

      if(fldpath){
        let loader = this.loadingCtrl.create({
            content: "正在加载照片..."
          });
          loader.present();
          this.docprovider.GetChildrenFilesInfo(fldpath).then(fileset=>{
            if(fileset){
                let count = 0;
                if(Array.isArray(fileset)){
                    fileset.forEach(element => {
                        console.log(element['path']);
                        let mimetype:string = element['mimeType'];
                        if(mimetype.startsWith('image')){
                            this.docprovider.GetFileContent(element['path']).then(filecontent=>{
                                let imagedata = {
                                    filepath:element['path'],
                                    content:'data:'+mimetype+';base64,'+filecontent,
                                    memo:'test'
                                }
                                this.imagesContext.push(imagedata);
                                count = count + 1;
                                if(count===fileset.length)
                                    loader.dismiss();
                            }).catch(err2=>{
    
                            });
                        }else{
                            count = count + 1;
                            if(count===fileset.length)
                            loader.dismiss();
                        }
                    });
                }else{
                    let mimetype:string = fileset['mimeType'];
                    if(mimetype.startsWith('image')){
                        this.docprovider.GetFileContent(fileset['path']).then(filecontent=>{
                            let imagedata = {
                                filepath:fileset['path'],
                                content:'data:'+mimetype+';base64,'+filecontent,
                                memo:'test'
                            };
                            this.imagesContext.push(imagedata);
                            loader.dismiss();
                        }).catch(err2=>{
    
                        });
                    }else
                        loader.dismiss();
                }
            }
          }).catch(err=>{
            console.log(err);
            this.imagesContext = new Array<any>();
            loader.dismiss();
          });
      }
    }

    /**
     * 图片全屏显示 
     * @param myImage 
     */
    PresentImage(myImage) {
        const imageViewer = this._imageViewerCtrl.create(myImage);
        imageViewer.present();
    
        //setTimeout(() => imageViewer.dismiss(), 1000);
        //imageViewer.onDidDismiss(() => alert('Viewer dismissed'));
      }    

    /**
     * 下载图片
     * @param image 
     */
    DownloadImage(image:any){

    }

    /**
     * 删除图片
     * @param imagepath  
     */
    DeleteImage(imagepath:any){
        
    }

  
    dismiss() {
      this.viewCtrl.dismiss();
    }
  }