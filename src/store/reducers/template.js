/*
* reducer参考
* */

import {RECEIVE_TEMPLATE} from "../actions/template";

export function template(state={
  data:{},
  current_page: 0,
  total_page: 0,
  total_num: 0,
  status: -1,
  message: ""
}, action){
  const json = action.json;
  switch(action.type){
    case RECEIVE_TEMPLATE:
      let list = [];
      if(json.current_page<=1){
        list = json.data.list?json.data.list:[];
      }else{
        list = state.data.list.concat(json.data.list);
      }
      return {
        status: json.status,
        message: json.message,
        total_num: json.total_num,
        total_page: json.total_page,
        current_page: json.current_page,
        data: {list:list}
      };
      break;
    default:
      return state;
  }
}
