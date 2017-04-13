import {get,post} from "./BaseAction";
import {host} from "./hostConf";

//中西成药
export const CHANGE_ZX_MEDICINE = "CHANGE_ZX_MEDICINE";
export const DELETE_ZX_MEDICINE = "DELETE_ZX_MEDICINE";
export const ZX_MEDICINE_INFO = "ZX_MEDICINE_INFO";
export const DELETE_ZX_TAB = "DELETE_ZX_TAB";//删除tab
export const ADD_ZX_TAB = "ADD_ZX_TAB"; //新增tab




export function changeZXMedicine(data){
  // 判断最后一行是否有数据
  const {items} = data;
  const len = items.length;
  if(items[len-1].item_name != ""){
    items.push({
      item_amount:"0",
      item_code:"0",
      item_id:"1",
      item_name:"",
      item_price:"",
      item_type:"0",
      item_unit:"",
      total_amount:"0",
      total_price:"",
      usage_desc:"",
      usage_id:"",
      wst_spec:"",
      min_unit:'1',
      wst_taking_amount:"",
      wst_taking_days:"",
      wst_taking_desc:"",
      wst_taking_times:"",
      wst_taking_unit:"",
    })
  }
  return{
    type: CHANGE_ZX_MEDICINE,
    data: {
      items:[...items],
      name:data.name
    },
  }
}

export function deleteZXMedicine(data){
  return{
    type: DELETE_ZX_MEDICINE,
    data: data,
  }
}

export function zXMedicineInfo(data){
  return{
    type: ZX_MEDICINE_INFO,
    data: data,
  }
}

/**
 * 删除tab
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function deleteZXTab(data){
  return{
    type: DELETE_ZX_TAB,
    data: data,
  }
}

export function addZXTab(data){
  return{
    type: ADD_ZX_TAB,
    data: data,
  }
}
