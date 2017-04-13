/**
* action 示例参考
* */

import {host} from "./hostConf";
import {get,post} from "./BaseAction";

export const RECEIVE_TEMPLATE = 'RECEIVE_TEMPLATE';

//请求医生/医助个人信息
export function requestTemplate(data,callback=(json)=>{}){
  return get(`${host.oldHost}user_center`,data,callback,(json)=>{
    return {
      type: RECEIVE_TEMPLATE,
      json
    }
  });
}