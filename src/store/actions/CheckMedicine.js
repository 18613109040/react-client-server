/**
* action 示例参考
* */

import {host} from "./hostConf";
import {get,post} from "./BaseAction";

export const RECEIVE_MEDICINE_LIST = 'RECEIVE_MEDICINE_LIST';
export const UPDATE_MEDICINE_LIST = "UPDATE_MEDICINE_LIST";
export const ADD_MEDICINE_LIST = "ADD_MEDICINE_LIST";
export const REMOVE_MEDICINE_LIST = "REMOVE_MEDICINE_LIST";
export const REMOVE_ALL_MEDICINE_LIST = "REMOVE_ALL_MEDICINE_LIST";
export const MODIFY_CHECK_RECIP_ITEM = "MODIFY_CHECK_RECIP_ITEM";
export const TEMPLATE_UPDATA_MODIFY = "TEMPLATE_UPDATA_MODIFY";
export const GET_MODIFY = "GET_MODIFY";
export const ADD_COULD_ID = "ADD_COULD_ID";


// 从服务端请求 检验检查所有项目
export function requestMedicineList(data,callback=(json)=>{}){
  const url = `${host.cplus}cgi-bin/pharmacyinfo/queryitem`
  return get(url,data,callback,(json)=>{
    return {
      type: RECEIVE_MEDICINE_LIST,
      json
    }
  });
}
// 添加检验检查处方
export function addCheckRecipe(data){
  return {type: ADD_MEDICINE_LIST, json:data};
}
// 删除所有检验检查处方
export function removeAllCheckRecip(){
  return {type: REMOVE_ALL_MEDICINE_LIST, json: "all"}
}
// 删除指定检验检查处方
export function removeCheckRecipe(data){
	
  return {
  	type: REMOVE_MEDICINE_LIST, 
  	json: data
  }
}
// 修改/更新检验检查处方
export function modifyCheckItem(index, items){
  return {type: MODIFY_CHECK_RECIP_ITEM, json: {index: index, data: items}};
}

// 模板更新检验检查处方
export function templateUpdatamodify(index,data){
  return {type: TEMPLATE_UPDATA_MODIFY, json: {index: index, data:data}};
}

//更新检验检查所有数据
export function getmodify(data){
  return {type: GET_MODIFY, json: {data:data}};
}

//添加处方号
export function addcloudId(data){
	return {
		type:ADD_COULD_ID,
		json:{data:data}
	}
}
