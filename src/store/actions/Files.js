import {get,post} from "./BaseAction";
import {host} from "./hostConf";

export const RECIEVE_PATIENT_FILE_LIST = 'RECIEVE_PATIENT_FILE_LIST';
export const RECIEVE_PATIENT_FILE_INFO = 'RECIEVE_PATIENT_FILE_INFO';
export const RECIEVE_PATIENT_MEDICAL_RECORD_INFO = 'RECIEVE_PATIENT_MEDICAL_RECORD_INFO';

/**
 * 获取患者的档案列表
 * @param  {[type]} data             [description]
 * @param  {[type]} [callback=(json] [description]
 * @return {[type]}                  [description]
 */
export function fetchFileList(data, callback=(json)=>{}){
  return get(`${host.cplus}cgi-bin/patient/queryRegisterPatient`, data,callback, (json)=>{
  // return get(`http://rap.gstzy.cn/mockjsdata/28/cgi-bin/patient/queryRegisterPatient`, data,callback, (json)=>{
    return {
      type : RECIEVE_PATIENT_FILE_LIST,
      json
    }
  })
}

/**
 * 获取患者档案信息
 * @param  {[type]} data             [description]
 * @param  {[type]} [callback=(json] [description]
 * @return {[type]}                  [description]
 */
export function fetchFileInfo(data, callback=(json)=>{}){
  return get(`${host.cplus}cgi-bin/patient/registerPatientInfo`,data,callback,(json)=>{
  // return get(`http://rap.gstzy.cn/mockjsdata/28/cgi-bin/patient/registerPatientInfo?name=&phone=&shop_no=&patient_id=&user_id=&doctor_id=`,data,callback,(json)=>{
    return {
      type : RECIEVE_PATIENT_FILE_INFO,
      json
    }
  });
}

/**
 * 获取患者病历
 * @param  {[type]} data             [description]
 * @param  {[type]} [callback=(json] [description]
 * @return {[type]}                  [description]
 */
export function fetchMedicalRecord(data, callback=(json)=>{}){
  return get(`${host.cplus}cgi-bin/patient/registerPatientInfo`,data,callback,(json)=>{
  // return get(`http://rap.gstzy.cn/mockjsdata/28/cgi-bin/patient/registerPatientInfo?name=&phone=&shop_no=&patient_id=&user_id=&doctor_id=`,data,callback,(json)=>{
    return {
      type : RECIEVE_PATIENT_MEDICAL_RECORD_INFO,
      json
    }
  });
}
