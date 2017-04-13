import {
  CHANGE_ZY_MEDICINE,
  DELETE_ZY_MEDICINE,
  ZY_MEDICINE_INFO,
  DELETE_ZY_TAB,
  ADD_ZY_TAB,
  ADD_ZY_RECIPELIST,
  LIST_ZY_RECIPELIST,
  SEARCH_PREPARATION,//制法搜索
  SEARCH_USAGE,//用法
  SEARCH_USAGE_TWO,
  SEARCH_SUGGEST,//整剂嘱咐
  SEARCH_DETAIL_USAGE,//细目用法
  SEARCH_ITEM,//药品搜索
  SEARCH_ITEM_TWO,
  CLEAR_SEARCH_ITEM,
  CLEAR_SEARCH_ITEM_TWO,
  SEARCH_FREQUENCY,//频次搜索
  QUERY_DOCTORSTH_LIST,//门店医生列表
  QUERY_RARE_LIST,//贵细人员列表
} from "../actions/Medicine";

//中药数据
export function prescriptionInfo(state = {
  "1":{
      process_desc:"",//制法
      process_type:'0',
      usage_desc:"",//用法
      usage_id:'0',
      quantity:"7",//总剂
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
        wst_taking_unit:"",
      }]
    }
} , action){
  if (action.type == CHANGE_ZY_MEDICINE) {
    state[action.data.name].items = [...action.data.items];
    // Object.assign(,action.data.items);
  }
  if(action.type == DELETE_ZY_MEDICINE){
    state[action.data.name].items = [...action.data.items];
    // Object.assign(state[action.data.name].items,action.data.items);
  }
  if(action.type == ZY_MEDICINE_INFO){
    Object.assign(state[action.data.name],action.data[action.data.name]);
  }
  if(action.type == DELETE_ZY_TAB){
    delete state[action.data.name];
  }
  if(action.type == ADD_ZY_TAB){
    Object.assign(state,{[action.data.name]:Object.assign({},action.data.data)});
  }
  return {
    ...state
  };
}

/**
 * 处方列表
 * @param  {Object} [state={}] [description]
 * @param  {[type]} action     [description]
 * @return {[type]}            [description]
 */
export function recipelist(state = {
   "current_page" : 1,
   "data" : {
      "recipes" : []
   },
   "list_num" : 1,
   "message" : "(用户)查询处方列表成功",
   "status" : "0",
   "total_num" : 1,
   "total_page" : 1
},action){
	const json = action.json;
	switch (action.type) {
		case LIST_ZY_RECIPELIST:
		 	return Object.assign({},state, json);
		 default:
		 	return state
	}

}



//药品 SEARCH_ITEM
export function drugList(state={
  current_page: 1,
  data:[],
  message: "",
  page_size: 0,
  status: 0,
  total_num: 0,
  total_page: 0
},action){
  const json = action.json;
  switch (action.type) {
    case SEARCH_ITEM:
      return Object.assign({},state, json);
    case CLEAR_SEARCH_ITEM:{
      return {
        current_page: 1,
        data:[],
        message: "",
        page_size: 0,
        status: 0,
        total_num: 0,
        total_page: 0
      }
    }
    default:
      return state
  }
}
//药品 SEARCH_ITEM
export function drugListTwo(state={
  current_page: 1,
  data:[],
  message: "",
  page_size: 0,
  status: 0,
  total_num: 0,
  total_page: 0
},action){
  const json = action.json;
  switch (action.type) {
    case SEARCH_ITEM_TWO:
      return Object.assign({},state, json);
    case CLEAR_SEARCH_ITEM_TWO:{
      return {
        current_page: 1,
        data:[],
        message: "",
        page_size: 0,
        status: 0,
        total_num: 0,
        total_page: 0
      }
    }
    default:
      return state
  }
}

// //药搜索
// export function drugList(state={
//   data:[{
//     dosage_form:"剂型1",
//     fee_type:"1",
//     price:"16.8",
//     standard:"3kg",
//     stock:"100",
//     value:"生枇杷叶",
//     unit:'kg',
//     "id":"106279",
//     "code":"010100100198",
//   }],
//   message:"success",
//   status:'1'
// },action){
//   return state;
// }

//细目用法 SEARCH_DETAIL_USAGE
export function usageDescList(state={
  data:[],
  message:"success",
  status:'1'
},action){
  const json = action.json;
  switch (action.type) {
    case SEARCH_DETAIL_USAGE:
      return Object.assign({},state, json);
    default:
      return state
  }
}

//制法 SEARCH_PREPARATION
export function zfList(state={
  data:[],
  message:"success",
  status:'1'
},action){
  const json = action.json;
  switch (action.type) {
    case SEARCH_PREPARATION:
      return Object.assign({},state, json);
    default:
      return state
  }
}

//用法
export function yfList(state={
  data:[],
  message:"success",
  status:'1'
},action){
  const json = action.json;
  switch (action.type) {
    case SEARCH_USAGE:
      return Object.assign({},state, json);
    default:
      return state
  }
}
//用法
export function yfListTwo(state={
  data:[],
  message:"success",
  status:'1'
},action){
  const json = action.json;
  switch (action.type) {
    case SEARCH_USAGE_TWO:
      return Object.assign({},state, json);
    default:
      return state
  }
}

//整剂嘱咐 SEARCH_SUGGEST
export function zhufuList(state={
  data:[],
  message:"success",
  status:'1'
},action){
  const json = action.json;
  switch (action.type) {
    case SEARCH_SUGGEST:
      return Object.assign({},state, json);
    default:
      return state
  }
}

//频次搜索 SEARCH_FREQUENCY
export function frequencyList(state={
  data:[],
  message:"success",
  status:'1'
},action){
  const json = action.json;
  switch (action.type) {
    case SEARCH_FREQUENCY:
      return Object.assign({},state, json);
    default:
      return state
  }
}

//门店医生 SEARCH_FREQUENCY
export function queryDoctorsthList(state={
  current_page: 1,
  doctor_sth_list: [],
  doctor_sth_list_size: 0,
  message: "搜索医生返回成功",
  status: 0,
  total_num: 0,
  total_page: 0
},action){
  const json = action.json;
  switch (action.type) {
    case QUERY_DOCTORSTH_LIST:
      return Object.assign({},state, json);
    default:
      return state
  }
}

//门店贵细人员 SEARCH_FREQUENCY
export function queryRareList(state={
  data: [],
  status: 0,
  message: "success"
},action){
  const json = action.json;
  switch (action.type) {
    case QUERY_RARE_LIST:
      return Object.assign({},state, json);
    default:
      return state
  }
}
