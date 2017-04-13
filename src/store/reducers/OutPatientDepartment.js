import {GET_CALL_LIST,GET_CALL_UP,GET_CALL_MIS,GET_CALL_END,GET_CALL_DELAY,TEMPORARY_LIST,TEMPORARY_FINISH_LIST} from "../actions/OutPatientDepartment";


const initialState = {
  data:[],
  message:"",
  status:"",
  total_num:"",
}

export function callPatientsList(state = initialState, action){

  let json = action.json;
  if((!json) || (json&&!json.data)){
    json = Object.assign({},json,{data:[]});
  }
  switch(action.type) {
    case GET_CALL_LIST://列表
      return Object.assign({},state, json);
    case GET_CALL_UP://叫诊
      return Object.assign({},state, json);
    case GET_CALL_MIS://过诊
      return Object.assign({},state, json);
    case GET_CALL_END://诊结
      return Object.assign({},state, json);
    case GET_CALL_DELAY://延迟就诊
      return Object.assign({},state, json);
    default:
      return state;
  }
  return state;
}

export function temporaryList(state={
  "id_list": [],
  "id_list_num": "1",
  "message": "",
  "status": "0",
  "total_num": "1"
},action){
  let json = action.json;
  // if(json&&!json.id_list){
  //   json.id_list = [];
  // }
  if((!json) || (json&&!json.id_list)){
    json = Object.assign({},json,{id_list:[]});
  }
  switch (action.type) {
    case TEMPORARY_LIST:{
      return Object.assign({},state, json);
    }
    break;
    default:
  }
  return state;
}
export function temporaryFinishList(state={
  "id_list": [],
  "id_list_num": "1",
  "message": "",
  "status": "0",
  "total_num": "1"
},action){
  let json = action.json;
  // if(json&&!json.id_list){
  //   json.id_list = [];
  // }
  if((!json) || (json&&!json.id_list)){
    json = Object.assign({},json,{id_list:[]});
  }
  switch (action.type) {
    case TEMPORARY_FINISH_LIST:{
      return Object.assign({},state, json);
    }
    break;
    default:
  }
  return state;
}
