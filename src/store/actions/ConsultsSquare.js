import {get, phpPost,post} from "./BaseAction";
import {host} from "./hostConf";

export const GET_CONSULTS = "GET_CONSULTS";
export const GET_CONTENT_BY_ID = "GET_CONTENT_BY_ID";
export const ANSWER = "ANSWER";

// 获取表格信息
export function getConsults(data, callback){
  return get(`${host.oldHost}question/list`, data,
    callback, (json)=>{
      return {
        type: GET_CONSULTS,
        json
      }
    }
  )
}
export function getContentById(data, callback){
	return get(`${host.oldHost}question/index`,data,
		callback, (json)=>{
      return {
        type: GET_CONTENT_BY_ID,
        json
      }
    })
	
}
export function answer(data,callback){
	return  phpPost(`${host.oldHost}question/bind`,data,
		callback, (json)=>{
      return {
        type: ANSWER,
        json
      }
    })
}
