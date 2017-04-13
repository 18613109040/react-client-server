import {phpGet, phpPost,post} from "./BaseAction";
import {host} from "./hostConf";

export const GET_CALL_LIST = "GET_CALL_LIST";
export const GET_CALL_UP = "GET_CALL_UP";
export const GET_CALL_MIS = "GET_CALL_MIS";
export const GET_CALL_END = "GET_CALL_END";
export const GET_CALL_DELAY = "GET_CALL_DELAY";
export const TEMPORARY_LIST = "TEMPORARY_LIST";
export const TEMPORARY_FINISH_LIST = "TEMPORARY_FINISH_LIST";
export const REGIS_TRATION_CONTINUE_TREATMENT = "REGIS_TRATION_CONTINUE_TREATMENT";//续诊
export const PHP_REGIS_TRATION_CONTINUE_TREATMENT = "PHP_REGIS_TRATION_CONTINUE_TREATMENT";//续诊php






//运营后台 门店挂号
/**
 *  候诊列表查询
 *
 *
 */
export function getCallList(data, callback){
  return phpPost(`${host.mHost}Doctorpc/Api/calllist`, data,
    callback, (json)=>{
      return {
        type: GET_CALL_LIST,
        json
      }
    }
  )
}
/**
 *  叫诊
 *
 *
 */
export function getCallUp(data, callback){
  return phpPost(`${host.mHost}Doctorpc/Api/callup`, data,
    callback, (json)=>{
      // callback(json);
      return {
        type: GET_CALL_UP,
        json
      }
    }
  )
}

/**
 *  过诊
 *
 *
 */
export function getCallMis(data, callback){
  return phpPost(`${host.mHost}Doctorpc/Api/callmis`, data,
    callback, (json)=>{
      // callback(json);
      return {
        type: GET_CALL_MIS,
        json
      }
    }
  )
}
/**
 *  诊结
 */
export function getCallEnd(data, callback){
  return phpPost(`${host.mHost}Doctorpc/Api/callend`, data,
    callback, (json)=>{
      // callback(json);
      return {
        type: GET_CALL_END,
        json
      }
    }
  )
}

/**
 *  延迟叫诊
 */
export function getCallDelay(data, callback){
  return phpPost(`${host.mHost}Doctorpc/Api/calldelay`, data,
    callback, (json)=>{
      // callback(json);
      return {
        type: GET_CALL_DELAY,
        json
      }
    }
  )
}

/**
 *  预约没报道
 */
export function postTemporaryList(data, callback){
  return post(`${host.cplus}cgi-bin/deal/temporaryList`, data,
    callback, (json)=>{
      // callback(json);
      return {
        type: TEMPORARY_LIST,
        json
      }
    }
  )
}
/**
 *  已诊
 */
export function postTemporaryFinishList(data, callback){
  return post(`${host.cplus}cgi-bin/deal/temporaryList`, data,
    callback, (json)=>{
      // callback(json);
      return {
        type: TEMPORARY_FINISH_LIST,
        json
      }
    }
  )
}

/**
 *  续诊
 */
export function postRegisTrationContinueTreatment(data, callback){
  return post(`${host.cplus}cgi-bin/deal/registrationcontinuetreatment`, data,
    callback, (json)=>{
      // callback(json);
      return {
        type: REGIS_TRATION_CONTINUE_TREATMENT,
        json
      }
    }
  )
}

/**
 *  续诊php
 */
export function phpPostRegisTrationContinueTreatment(data, callback){
  return phpPost(`${host.mHost}Doctorpc/Api/callagain`, data,
    callback, (json)=>{
      // callback(json);
      return {
        type: PHP_REGIS_TRATION_CONTINUE_TREATMENT,
        json
      }
    }
  )
}
