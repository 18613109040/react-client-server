import {get,post} from "./BaseAction";
import {host} from "./hostConf";

export const RECIEVE_COMMENT_LIST = 'RECIEVE_COMMENT_LIST';
export const RECIEVE_REMOVE_REPLAY = 'RECIEVE_REMOVE_REPLAY';
export const RECIEVE_DELETE_COMMENT = 'RECIEVE_DELETE_COMMENT';
export const RECIEVE_CREATE_COMMENT = 'RECIEVE_CREATE_COMMENT';

function removeReply(json){
  return {
    type : RECIEVE_REMOVE_REPLAY,
    json
  }
}
export function fetchPatientCommentList(data, callback=(json)=>{}){
  return get(`${host.cplus}cgi-bin/comment/querydoctorcommentlist`, data,callback, (json)=>{
  // return get(`http://rap.gstzy.cn/mockjsdata/22/cgi-bin/comment/queryusercommentlist?user_id=&page_no=&page_size=`, data,callback, (json)=>{
    return {
      type : RECIEVE_COMMENT_LIST,
      json
    }
  })
}
/**
 * 删除医生huifu
 * @param  {[type]} data             [description]
 * @param  {[type]} [callback=(json] [description]
 * @return {[type]}                  [description]
 */
export function deleteCommentReply(data, callback=(json)=>{}){
  return post(`${host.cplus}cgi-bin/comment/deletereply`, data,callback, (json)=>{
    return {
      type : RECIEVE_DELETE_COMMENT,
      json
    }
  })
}
/**
 * 新建医生评论
 * @param  {[type]} data             [description]
 * @param  {[type]} [callback=(json] [description]
 * @return {[type]}                  [description]
 */
export function createCommentReply(data, callback=(json)=>{}){
  return post(`${host.cplus}cgi-bin/comment/addreply`, data,callback, (json)=>{
    return {
      type : RECIEVE_CREATE_COMMENT,
      json
    }
  })
}
