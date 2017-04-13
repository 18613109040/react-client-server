import {get, phpPost} from "./BaseAction";
import {host} from "./hostConf";
export const RECEIVE_MES_HISTORY = "RECEIVE_MES_HISTORY";
export const RECEIVE_MES_NEWS = "RECEIVE_MES_NEWS";
export const RECEIVE_MES_SEND = "RECEIVE_MES_SEND";
export const RECEIVE_MES_NOTIFICATION = "RECEIVE_MES_NOTIFICATION";
export const RECEIVE_MES_END_CONVERSATION = "RECEIVE_MES_END_CONVERSATION";
export const RECEIVE_MY_MSG_LIST = "RECEIVE_MY_MSG_LIST";
export const CLEAR_MES_HISTORY = "CLEAR_MES_HISTORY";
export const ADD_ERROR_MESSAGE = "ADD_ERROR_MESSAGE";
export const REMOVE_ERROR_MESSAGE = "REMOVE_ERROR_MESSAGE";
export const DELETE_ERROR_MESSAGE_ALL = "DELETE_ERROR_MESSAGE_ALL";
export const RECEIVE_READ_MSG_LIST = "RECEIVE_READ_MSG_LIST";
export const RECEIVE_READ_VOICE_MSG = "RECEIVE_READ_VOICE_MSG";

export function fetClearList(){
  return{
    type: CLEAR_MES_HISTORY,
    data: {status: 0, data:null}
  }
}
export function fetClearErrorList(){
  return{
    type: DELETE_ERROR_MESSAGE_ALL,
    data: {status: 0, data:[]}
  }
}

// 获取历史消息
export function getMesHistory(data, callback){
  return get(`${host.oldHost}message/history`, data,
    callback, (json)=>{
      return {
        type: RECEIVE_MES_HISTORY,
        json
      }
    }
  )
}

// 获取新消息，每10秒调用一次
export function getMesNews(data, callback){
  return get(`${host.oldHost}message/new`, data,
    callback, (json)=>{
      return {
        type: RECEIVE_MES_NEWS,
        json
      }
    }
  )
}

// 链接reducers，将发送失败的消息添加到errorMessageList列表
function addErrorMes(json){
  return { type: ADD_ERROR_MESSAGE, json }
}
function removeErrorMes(json){
  return {type: REMOVE_ERROR_MESSAGE, json}
}
// 链接reducers，将消息添加到messageList列表
function message(json){
  return {type: RECEIVE_MES_SEND, json}
}
// assistant_id:12, //医助ID
// content: content,
// doctor_id: 235,  //医生ID
// role: Cookie.get("role"),
// room_id: room_id,    // 房间ID
// type: type,
// user_id: Cookie.get("userid")
// sendType为发送类型：send:发送新消息， resend:重新发送
export function sendMes(data, callback, sendType="send"){
  return dispatch => {
    // 模拟成功提交后返回的数据模型，并添加到state里去,这是为了能即时在聊天窗口看到消息而设置的
    // 消息组件会根据status 字段显示消息状态
    let temp = {
      data:Object.assign({}, data, {
          create_at: Date.parse(new Date()),
          temp_id: Date.parse(new Date())+Math.ceil(Math.random()*1000), //生成一个临时ID,用于删除时使用
          status: 2, // 这条消息的状态 0:失败，1：成功， 2：发送中， 3：重发
        })
    }
    if(sendType!="send"){
      temp = {data: data};
      dispatch(removeErrorMes(temp));
    }
    dispatch(message(temp));
    // 发送请求
    let form = new FormData(temp.data);
    for(let i in temp.data){
      form.append(i, temp.data[i])
    }
    return fetch(`${host.oldHost}message/send`, {
      method: "POST",
      body: form
    })
    .then(res=>{return res.json()})
    .then(res=>{
      callback(res);
      dispatch(message(res));
    }, error=>{
      temp.data.status=0;
      dispatch(addErrorMes(temp));
      dispatch(message(temp));
    })
  };
}

// 催问医生 | 邀请医生
export function notification(data, callback){
  return phpPost(`${host.oldHost}chat/notification`, data,
    callback, (json)=>{
      return {
        type: RECEIVE_MES_NOTIFICATION,
        json
      }
    }
  )
}
// 结束对话
export function fetchEndChat(data, callback){
  return phpPost(`${host.oldHost}chat/endConversation`, data,
    callback, (json)=>{
      return {
        type: RECEIVE_MES_END_CONVERSATION,
        json
      }
    }
  )
}

// 获取患者、医生、医助详情



//医生医助端 我的消息列表 接口
export function requestMyMsgList(data,callback=(json)=>{}){

  return phpPost(`${host.oldHost}inbox/list`, data, callback, (json)=>{
    return {
      type: RECEIVE_MY_MSG_LIST,
      json
    }
  })
}

//阅读消息
export function readMessage(data,callback=(json)=>{}){
  return phpPost(`${host.oldHost}inbox/read`, data, callback, (json)=>{
    return {
      type: RECEIVE_READ_MSG_LIST,
      json
    }
  })
}

//  阅读语音消息
export function readVoiceMessage(data,callback=(json)=>{}){
  return dispatch =>{
    let form = new FormData(data);
    for(let i in data){
      form.append(i, data[i])
    }
    return fetch(`${host.oldHost}message/read`, {
      method: "POST",
      body: form
    })
    .then(res=>{return res.json()})
    .then(res=>{
      callback(res);
      dispatch((res)=>{
        return {
          type  : RECEIVE_READ_VOICE_MSG,
          res
        }
      });
      return res
    })
    // .then(res=>{
    //   dispatch(message(res));
    // })
  }
}
