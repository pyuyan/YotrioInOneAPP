import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { YotrioInOneAPP } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { File } from '@ionic-native/file'
import { IonicStorageModule, Storage } from '@ionic/storage';
import { LoginPage } from '../pages/login/login';
import { CommModulePage } from '../pages/comm-module/comm-module';
import { MfgModulePage } from '../pages/mfg-module/mfg-module';
import { InvModulePage } from '../pages/inv-module/inv-module';
import { LoginsvrProvider } from '../providers/loginsvr/loginsvr';
import { ResetpassPage } from '../pages/resetpass/resetpass';
import { ConfigPage } from '../pages/config/config';
import { NgxEchartsModule } from 'ngx-echarts';
import { QccModulePage } from '../pages/qcc-module/qcc-module';
import { RootNavTool } from './rootNav';
import { ContextData } from './context';
import { LoginPageModule } from '../pages/login/login.module';
import { CommModulePageModule } from '../pages/comm-module/comm-module.module';
import { MfgModulePageModule } from '../pages/mfg-module/mfg-module.module';
import { InvModulePageModule } from '../pages/inv-module/inv-module.module';
import { ConfigPageModule } from '../pages/config/config.module';
import { QccModulePageModule } from '../pages/qcc-module/qcc-module.module';
import { BarcodeScanner } from '@ionic-native/barcode-scanner'
import { RcvQccProvider } from '../providers/rcv-qcc/rcv-qcc';
import { DocumentsystemProvider } from '../providers/documentsystem/documentsystem';
import { IonicImageViewerModule } from 'ionic-img-viewer';


@NgModule({
  declarations: [
    YotrioInOneAPP,
    ResetpassPage,
  ],
  imports: [
    LoginPageModule,
    CommModulePageModule,
    MfgModulePageModule,
    InvModulePageModule,
    ConfigPageModule,
    QccModulePageModule,
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    NgxEchartsModule,
    IonicImageViewerModule,
    IonicModule.forRoot(YotrioInOneAPP),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    YotrioInOneAPP,
    LoginPage,
    CommModulePage,
    MfgModulePage,
    InvModulePage,
    ResetpassPage,
    ConfigPage,
    QccModulePage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LoginsvrProvider,
    File,
    BarcodeScanner,
    RcvQccProvider,
    DocumentsystemProvider
  ],
  exports: [
    ResetpassPage,
  ]
})

export class AppModule {}
