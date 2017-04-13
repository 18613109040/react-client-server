/**
* 重置密码
* */

import {host} from "./hostConf";
import {get,post,phpPost} from "./BaseAction";

export const VERIFICATION_CODE = 'VERIFICATION_CODE';
export const SMS_CODE = 'SMS_CODE';
export const REST_PASSWORD = 'REST_PASSWORD';
//获取图片验证码
export function verificationCode(data,callback=(json)=>{}){
  return post(`${host.cplus}cgi-bin/user/getpicsecurity`,data,callback,(json)=>{
    return {
      type: VERIFICATION_CODE,
      json
    }
  });
  
}

//获取短信验证码
export function smsCode(data,callback=(json)=>{}){
  return post(`${host.cplus}cgi-bin/user/sendsecuritycodemessage`,data,callback,(json)=>{
    return {
      type: SMS_CODE,
      json
    }
  });
}
//重置密码
export function restPassword(data,callback=(json)=>{}){
  return post(`${host.cplus}cgi-bin/user/usermodifypassword`,data,callback,(json)=>{
    return {
      type: REST_PASSWORD,
      json
    }
  });
}