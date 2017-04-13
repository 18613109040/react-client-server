/**
* action 治疗理疗
* */

import {host} from "./hostConf";
import {get,post} from "./BaseAction";

export const RECEIVE_TREAMENT_LIST= 'RECEIVE_TREAMENTll_LIST';
export const RECIVE_ACUPOINTS="RECIVE_ACUPOINTS";
export const RECIVE_ACUPOINT_LIST="RECIVE_ACUPOINT_LIST";
export const ADD_TREATMENT="ADD_TREATMENT";
export const UPDATA_TREATMENT="UPDATA_TREATMENT";
export const DELETE_TREATMENT="DELETE_TREATMENT";
export const REST_TREATMENT="REST_TREATMENT";
export const REST_DATA="REST_DATA";

// 从服务端请求 治疗理疗项目
export function requestTreament(data,callback=(json)=>{}){
  // const url = `http://rap.gstzy.dev/mockjsdata/20/cgi-bin/pharmacyinfo/queryitem`;
  const url = `${host.cplus}cgi-bin/search/item`;
  return get(url,data,callback,(json)=>{
    return {
      type: RECEIVE_TREAMENT_LIST,
      json
    }
  });
}

// 穴位
export function requestAcupoints(data,callback=(json)=>{}){
  const url = `${host.cplus}cgi-bin/search/xueWei`;
  return get(url,data,callback,(json)=>{
    return {
      type: RECIVE_ACUPOINTS,
      json
    }
  });
}

// 穴位方
export function requestAcupointList(data,callback=(json)=>{}){
  const url = `${host.cplus}cgi-bin/search/xueWeiFang`;
  return get(url,data,callback,(json)=>{
    return {
      type: RECIVE_ACUPOINT_LIST,
      json
    }
  });
}

//添加治疗理疗
export function addTreatment(data){
	return {
		type:ADD_TREATMENT,
		data:data
	}
}
//修改治疗理疗
export function upDataTreatment(data){
	return {
		type:UPDATA_TREATMENT,
		data:data
	}
}
//删除治疗理疗
export function deleteTreatment(data){
	return {
		type:DELETE_TREATMENT,
		data:data
	}
}

//重置治疗理疗
export function restTreatment(data){
	return {
		type:REST_TREATMENT,
		data:data
	}
}

//更新数据
export function restData(){
	return {
		type:REST_DATA
	}
}
