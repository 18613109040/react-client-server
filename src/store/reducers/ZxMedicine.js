import {
  CHANGE_ZX_MEDICINE,
  DELETE_ZX_MEDICINE,
  ZX_MEDICINE_INFO,
  DELETE_ZX_TAB,
  ADD_ZX_TAB,
} from "../actions/ZxMedicine";

//中西成药
export function zXPrescriptionInfo(state = {
  "1":{
      process_desc:"",//制法
      process_type:'0',
      usage_desc:"",//用法
      usage_id:'0',
      quantity:"1",//总剂
      usage_amount_desc:"1",//每日n剂
      taking_desc:"",//嘱咐
      taking_id:'0',
      total_price:"0",//总价格
      items:[{
        item_amount:"0",
        item_code:"0",
        item_id:"1",
        item_name:"",
        item_price:"0",
        item_type:"0",
        item_unit:"",
        total_amount:"0",
        total_price:"0",
        usage_desc:"",
        usage_id:"0",
        wst_spec:"0",
        min_unit:'1',
        wst_taking_amount:"0",
        wst_taking_days:"0",
        wst_taking_desc:"",
        wst_taking_times:"",
        wst_taking_frequency:"1",
        wst_taking_unit:"",
      }]
    }
} , action){
  if (action.type == CHANGE_ZX_MEDICINE) {
    Object.assign(state[action.data.name].items,action.data.items);
  }
  if(action.type == DELETE_ZX_MEDICINE){
    Object.assign(state[action.data.name].items,action.data.items);
  }
  if(action.type == ZX_MEDICINE_INFO){
    Object.assign(state[action.data.name],action.data[action.data.name]);
  }
  if(action.type == DELETE_ZX_TAB){
    delete state[action.data.name];
  }
  if(action.type == ADD_ZX_TAB){
    Object.assign(state,{[action.data.name]:Object.assign({},action.data.data)});
  }
  return {
    ...state
  };
}
