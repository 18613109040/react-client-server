import {get, phpPost,post,phpGet} from "./BaseAction";
import {host} from "./hostConf";
export const SETTING = 'SETTING';
export const GET_SETTING = 'GET_SETTING';
//修改设置
export function settingSystem(data,callback=(json)=>{}){
  return post(`${host.cplus}cgi-bin/option/setUpForWorkStation`,data,callback,(json)=>{
    return {
      type: SETTING,
      json
    }
  });
  
}
//获取个人设置
export function getsettingSystem(data,callback=(json)=>{}){
  return get(`${host.cplus}cgi-bin/option/queryOptionForWorkStation`,data,callback,(json)=>{
    return {
      type: GET_SETTING,
      json
    }
  });
  
}