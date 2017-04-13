import {get, phpPost,post,phpGet} from "./BaseAction";
import {host} from "./hostConf";

export const GET_WILL_CONSULT = "GET_WILL_CONSULT";
export const GET_CONSULTING = "GET_CONSULTING";
export const GET_CONSULTS_END = "GET_CONSULTS_END";
export const GET_ALLCONSULTING = "GET_ALLCONSULTING";
export const GET_ALLCONSULTS_END = "GET_ALLCONSULTS_END";
// 未回复 Action
/*export function getwillConsult(data, callback){
  return phpGet(`${host.oldHost}chat/roomsList`, data,
    callback, (json)=>{
      return {
        type: GET_WILL_CONSULT,
        json
      }
    }
  )
};*/
//问诊中 Action
export function getConsulting(data, callback){
  return phpGet(`${host.oldHost}chat/roomsList`, data,
    callback, (json)=>{
      return {
        type: GET_CONSULTING,
        json
      }
    }
  )
};

export function getAllConsulting(data, callback){
  return phpGet(`${host.oldHost}chat/roomsList`, data,
    callback, (json)=>{
      return {
        type: GET_ALLCONSULTING,
        json
      }
    }
  )
};



//已结束 Action
export function  getConsultsEnd(data, callback){
  return phpGet(`${host.oldHost}chat/roomsList`, data,
    callback, (json)=>{
      return {
        type: GET_CONSULTS_END,
        json
      }
    }
  )
};

export function getAllConsultsEnd(data, callback){
  return phpGet(`${host.oldHost}chat/roomsList`, data,
    callback, (json)=>{
      return {
        type: GET_ALLCONSULTS_END,
        json
      }
    }
  )
};
