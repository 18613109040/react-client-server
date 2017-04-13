/*
* reducer参考
* 检验检查的接口
* */

import {RECEIVE_TREAMENT_LIST,ADD_TREATMENT,UPDATA_TREATMENT,DELETE_TREATMENT,REST_TREATMENT,REST_DATA} from "../actions/Treatment";

const initialState = {
  data:[],
  status: "-1",
  total_page:0
}

// 从接口返回治疗理疗项目
export function treatmentList( state = initialState, action){
  const json = action.json;
  switch(action.type){
    case RECEIVE_TREAMENT_LIST:
      if(json.status!="0") return state;
      return json;
    default:
      return state;
  }
}

//治疗理疗数据管理
export function treatmentTemData(state = [
	{
		id:-1,
		item_name:"",
		acupoint_name1:"",
		acupoint_name2:"",
		acupoint_name3:"",
		acupoint_name4:"",
		item_unit:"",
		item_amount:"",
		item_price:"",
		item_code:""
	}
], action){
	
	const json = action.data;
  switch(action.type){
    case ADD_TREATMENT:
    	state.splice(state.length-1,0,json);
      state.pop();
      state.push({
				id:-1,
				item_name:"",
				acupoint_name1:"",
				acupoint_name2:"",
				acupoint_name3:"",
				acupoint_name4:"",
				item_unit:"",
				item_amount:"",
				item_price:"",
				item_code:""
			})
    	return Array.concat(state, []);
    case UPDATA_TREATMENT:
    	state[json.id] = Object.assign({},state[json.id],json);
    	return Array.concat(state, []);
    case DELETE_TREATMENT:
    	return Array.concat(state.filter((item,index)=>index != json.id), []);
    case REST_TREATMENT :
      json.push({
				id:-1,
				item_name:"",
				acupoint_name1:"",
				acupoint_name2:"",
				acupoint_name3:"",
				acupoint_name4:"",
				item_unit:"",
				item_amount:"",
				item_price:"",
				item_code:""
			})
    	state =  json;
    	return Array.concat(state, []);
    case REST_DATA:
     	return Array.concat(state, []);
    default:
      return state;
  }
}
