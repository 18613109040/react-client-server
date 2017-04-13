import {RECEIVE_MES_HISTORY,
    RECEIVE_MES_NEWS,
    RECEIVE_MES_SEND,
    RECEIVE_MES_END_CONVERSATION,
    RECEIVE_MY_MSG_LIST,
    CLEAR_MES_HISTORY,
    RECEIVE_MES_NOTIFICATION,
    ADD_ERROR_MESSAGE,
    REMOVE_ERROR_MESSAGE,
    DELETE_ERROR_MESSAGE_ALL,
    RECEIVE_READ_VOICE_MSG
  } from "../actions/Message";

// 临时存放发送失败的消息, 用于重新发送
export function errorMessageList(state={
  data: []
}, action){
  const json = action.json;
  let data = null;
  switch (action.type) {
    case DELETE_ERROR_MESSAGE_ALL:
      return data = {data: []}
    case ADD_ERROR_MESSAGE:
      if(state.data.length<=0){
        data = state.data.push(json.data);
      }else{
        for(let i=state.data.length-1; i>=0; i--){
          if(state.data[i].temp_id==json.data.temp_id){
            state.data.splice(i, 1, json.data);//如果temp_id相同，替换旧的
          }else{
            state.data.push(json.data);//添加新的错误消息
          }
        }
      }
      data = Object.assign({}, state, {data: Array.concat(state.data, [])})
      return data
    case REMOVE_ERROR_MESSAGE:
      for(let i=state.data.length-1; i>=0; i--){
        if(state.data[i].temp_id == json.data.temp_id){
          state.data.splice(i, 1);
        }
      }
      data = Object.assign({}, state, {data: Array.concat(state.data, [])});
      return data;
    default:
      return state;
  }
}
export function messageList(state={
  message: "",
  status: -1,
  message_status: 0, //1：未回复；2：问诊中；3：手动结束；4：自动结束
  assistant_id: 0,
  assistant_default_img: "//weixin.gstzy.cn/assets/img/i-doctor-head-default.png",
  assistant_img: "//weixin.gstzy.cn/assets/img/i-doctor-head-default.png",
  created_at: 0,
  doctor_id: 0,
  doctor_img: "",
  doctor_name: "",
  patient_age: 0,
  patient_id:0,
  city_name: "未知",
  patient_name: "",
  patient_sex: "",
  user_id: 0,
  user_img: "",
  is_push: 0,
  last_time: 0,
  id: 0,
  data:[] //,
  // total_num: 0,
  // list_num:0
}, action){
  const json = action.json;
  let data = null;
  let list = null;
  switch(action.type){
    case CLEAR_MES_HISTORY:
      state.data = []
      return state;
    case RECEIVE_MES_HISTORY:
      if(parseInt(json.status) != 0){
        return state;
      }
      list = Array.concat(json.data.list, state.data);
      data = Object.assign({}, state, json.data)
      data.data = list;
      // data = {
      //   message: json.message,
      //   status: json.status,
      //   message_status: json.data.message_status,
      //   data: Array.concat(json.data.list, state.data)
      // }
      return data;
    case RECEIVE_MES_NEWS:
      if(parseInt(json.status) != 0){
        return state;
      }
      removeSame(state.data, json.data.list);
      list = Array.concat(state.data, json.data.list);
      data = Object.assign({}, state, json.data);
      data.data = list;
      return data;
    case RECEIVE_MES_SEND:
      if(json.hasOwnProperty("status")){ // 如果有status 属性说明是从服务器返回的数据，否则是虚拟的数据
        let temp_index = -1;
        for(let i=state.data.length-1; i>=0; i--){
          if(!state.data[i].hasOwnProperty("temp_id")) continue;
          if(state.data[i].temp_id == parseInt(json.data.temp_id)){
            temp_index = i;
          }
        }
        json.data.status = 1;
        state.data.splice(temp_index, 1, json.data); // 替换state.data 相应位置里的对象
        data = Object.assign({}, state, {data: Array.concat(state.data, [])})
      }else{
        if(json.data.status==0 || json.data.status==3 ){ //网络错误或者发送中
          for(let i=state.data.length-1; i>=0; i--){
            if(state.data[i].temp_id == json.data.temp_id){
              state.data.splice(i, 1, json.data);
            }
          }
          data = Object.assign({}, state, {data: Array.concat(state.data, [])})
        }else{
          data = Object.assign({}, state, {data: Array.concat(state.data, json.data)});
        }
      }
      return data;
    case RECEIVE_MES_END_CONVERSATION:
        if(json.status == 0){
          data = Object.assign({}, state, {
            message_status: 3, // 1：未回复；2：问诊中；3：手动结束；4：自动结束
          })
          return data;
        }
      return state;
    case RECEIVE_MES_NOTIFICATION:
      if(json.status!=0) return state;
        data = Object.assign({}, state, {is_push:1});
        return data;
    case RECEIVE_READ_VOICE_MSG:
      if (json.status == 0) {
        state.data = state.data.map((item)=>{
          if (item.message_id==json.data.message_id) {
            item.content.user_read = 1 ;
            item.content.assistant_read = 1 ;
            item.content.doctor_read = 1 ;
          }
        });
        data = Object.assign({}, state)
      }else {
        data = json
      }
      return data
    default:
      state;
  }
  return state;
}

export function myMsgList(state = {
  status: -1,
  list:[],
  current_page: 0,
  total_page:0, //总页码
  total: 0,   //总数目
  message: "",
}, action){
  const json = action.json;
  switch(action.type){
    case RECEIVE_MY_MSG_LIST:
      if(parseInt(json.status) != 0){
        return state;
      }
      let list = [];
      if(json.current_page<=1){
        list = json.data?json.data:[];
      }else{
        list = state.data.concat(json.data);
      }
      return Object.assign({},json,{data:list});
      /*return {
       message: json.message,
       status: json.status,
       current_page: json.current_page,
       data: list
       };*/
      break;
    default:
      return state;
  }
}

// 删除state.data中与新消息中相同的对话，根据message_id相同的就删除
function removeSame(stateList, jsonList){
  for(let index=jsonList.length-1; index>=0; index--){
    const item = jsonList[index];
    for(let i=stateList.length-1; i>=0; i--){
      if(stateList[i].message_id==item.message_id){
        stateList.splice(i, 1);
        break;
      }
    }
  }
}
