/*
 * 用户登录
 */
import {host} from "./hostConf";
import {get,post,phpPost} from "./BaseAction";

export const USER_LOGIN = 'USER_LOGIN';
export const GET_STORE = 'GET_STORE';
export const RECIEVE_PATIENT_INFO = 'RECIEVE_PATIENT_INFO';

//请求医生/医助个人信息
export function userLogin(data,callback=(json)=>{}){
  return post(`${host.cplus}cgi-bin/user/userlogin`,data,callback,(json)=>{
    return {
      type: USER_LOGIN,
      json
    }
  });
}

//获取门店
export function getStore(data,callback=(json)=>{}){
  return post(`${host.cplus}cgi-bin/user/querydoctorshopall`,data,callback,(json)=>{
    return {
      type: GET_STORE,
      json
    }
  });
}

export function fetchPatientInfo(data, callback=(json)=>{}){
  return get(`${host.cplus}cgi-bin/user/queryuserfamilydetail`,data,callback,(json)=>{
    return {
      type : RECIEVE_PATIENT_INFO,
      json
    }
  })
}
