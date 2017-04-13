import {host, staticHost} from "./hostConf";
import {get,post,phpPost} from "./BaseAction";

export const RECEIVE_ACCOUNT_LIST = "RECEIVE_ACCOUNT_LIST";
export const RECEIVE_GST_USER_DETAIL = "RECEIVE_GST_USER_DETAIL";

export const RECEIVE_CAS_CHECK_LOGIN = "RECEIVE_CAS_CHECK_LOGIN";
export const RECEIVE_CAS_LOGOUT = "RECEIVE_CAS_LOGOUT";

//CAS 检查登录
export function reqCASCheckLogin(data,callback){
  return get(`${host.cplus}cgi-bin/auth/checklogin`,data,callback,(json)=>{
    return {
      type: RECEIVE_CAS_CHECK_LOGIN,
      json
    }
  });
}
//CAS 退出登录
export function reqCASLogOut(data,callback){
  return get(`${host.cplus}cgi-bin/auth/loginout`,data,callback,(json)=>{
    return {
      type: RECEIVE_CAS_LOGOUT,
      json
    }
  });
}
