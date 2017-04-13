import {get, phpPost,post,phpGet} from "./BaseAction";
import {host} from "./hostConf";

export const RECIEVE_PATIENT_CONSULT_HISTORY = 'RECIEVE_PATIENT_CONSULT_HISTORY';

/**
 * 获取患者在指定医生下的问诊记录
 * @param  {[type]} data             [description]
 * @param  {[type]} [callback=(json] [description]
 * @return {[type]}                  [description]
 */
export function fetchPatientConsultHistory(data, callback=(json)=>{}){
  // return phpGet(`http://rap.gstzy.cn/mockjsdata/17/chat/roomsList?role_id=&page_no=&message_status=&user_id=&role=&patient_id=&sort=&order=&page_size=`, data,callback, (json)=>{
  return phpGet(`${host.oldHost}chat/roomsList`, data,callback, (json)=>{
    return {
      type : RECIEVE_PATIENT_CONSULT_HISTORY,
      json
    }
  })
}
