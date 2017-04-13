import {get, phpPost,post,phpGet} from "./BaseAction";
import {host} from "./hostConf";

export const GET_USER_INFO = "GET_USER_INFO";

export function getUsrInfo(data, callback){
  return get(`${host.oldHost}user_center`, data,
    callback, (json)=>{
      return {
        type: GET_USER_INFO,
        json
      }
    }
  )
}


