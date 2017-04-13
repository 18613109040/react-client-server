

import {host} from "./hostConf";
import {phpPost,phpGet} from "./BaseAction";

export const FEEDBACK_SUBMIT = 'FEEDBACK_SUBMIT';
export const FEEDBACK_LIST = 'FEEDBACK_LIST';


//提交反馈
export function postFeedbackSubmit(data,callback=(json)=>{}){
  return phpPost(`${host.feelbackHost}feedback/submit`,data,callback,(json)=>{
    return {
      type: FEEDBACK_SUBMIT,
      json
    }
  });
}

//获取反馈列表
export function getFeedbackList(data,callback=(json)=>{}){
  return phpGet(`${host.feelbackHost}feedback`,data,callback,(json)=>{
    return {
      type: FEEDBACK_LIST,
      json
    }
  });
}
