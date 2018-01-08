import { Injectable } from "@angular/core";

/*
 * 上下文记录存储
*/
@Injectable()
export class ContextData {

    static instance:ContextData;

  static inited:boolean = false;

  //登录上下文
  static logincontext:any = {
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

  public static Create(){
    if(!ContextData.instance)
       ContextData.instance = new ContextData();
    return ContextData.instance;
  }

  static rightcontext:Array<any> = new Array<any>();

  static mfgcontext:any = {

  }

  static imcontext:any = {

  }

  static invcontext:any = {

  }

  /**
   * 初始化上下文
   */
  public static InitContextData() {
    ContextData.logincontext.Token = '';

    ContextData.rightcontext.push(
      {
        ModuleID:'COMM',
        ModuleName:'公共门户',
        IconName:'home',
        PageName:'CommModulePage',
        SubFuncs:[
            {
                FuncID:'COMM_01',
                FuncName:'人员信息',
                IconName:'contact',
                PageName:'PersonPage',
                FuncIdx:1
            },
            {
                FuncID:'COMM_02',
                FuncName:'消息通知',
                IconName:'chatboxes',
                PageName:'MessagePage',
                FuncIdx:2
            },
            {
                FuncID:'COMM_03',
                FuncName:'密码修改',
                IconName:'key',
                PageName:'ResetpassPage',
                FuncIdx:3
            }
        ]
      },
      {
        ModuleID:'QCC',
        ModuleName:'质量检验',
        IconName:'icon-QCC',
        PageName:'QccModulePage',
        SubFuncs:[
            {
                FuncID:'QCC_01',
                FuncName:'采购入库检验',
                IconName:'icon-QCC',
                PageName:'RcvCheckPage',
                FuncIdx:1
            }
        ]
      },
      {
        ModuleID:'MFG',
        ModuleName:'生产管理',
        IconName:'icon-MFG',
        PageName:'MfgModulePage',
        SubFuncs:[
            {
                FuncID:'MFG_01',
                FuncName:'车间派工',
                IconName:'clipboard',
                PageName:'SetWorkTaskPage',
                FuncIdx:1
            },
            {
                FuncID:'MFG_02',
                FuncName:'报工点收',
                IconName:'bulb',
                PageName:'CompPage',
                FuncIdx:2
            },
            {
                FuncID:'MFG_03',
                FuncName:'员工查询',
                IconName:'archive',
                PageName:'EmployeePage',
                FuncIdx:3
            },
            {
                FuncID:'MFG_04',
                FuncName:'经理查询',
                IconName:'stats',
                PageName:'ManagePage',
                FuncIdx:4
            }
        ]
      }
    );
    
    ContextData.inited = true;
  }

  GetRightContext():any{
    return ContextData.rightcontext;
  }

  SetRightContext(valueobj:any){
    ContextData.rightcontext=valueobj;
  }

  SetLoginContext(valueobj:any){
    ContextData.logincontext = valueobj;
  }

  GetLoginContext():any{
    return ContextData.logincontext;
  }

  ClearLoginContext(){

      // this.logincontext.UserCode='';
      // this.logincontext.UserName='';
      // this.logincontext.OrgID=-1;
      // this.logincontext.OrgCode='';
      // this.logincontext.OrgName='';
      ContextData.logincontext.UserPass='';
      ContextData.logincontext.DeptID='';
      ContextData.logincontext.DeptCode='';
      ContextData.logincontext.DeptName='';
      ContextData.logincontext.Location='';
      ContextData.logincontext.LocationName='';
      ContextData.logincontext.Token='';

  }

}
