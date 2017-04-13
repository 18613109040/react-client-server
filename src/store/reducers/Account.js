/**
 * Created by Administrator on 2017/1/12.
 */
import {RECEIVE_ACCOUNT_LIST,RECEIVE_GST_USER_DETAIL} from "../actions/Account";

//门店所有帐号
export function AccountList(state = {
  data: [],
  status: -1,
  message: ""
}, action) {
  const json = action.json;
  switch (action.type) {
    case RECEIVE_ACCOUNT_LIST:
      let data = [];
      if (json.status == 0) {
        data = json.data;
      }
      return {
        data: data,
        status: json.status,
        message: json.message,
      };
      break;
    default:
      return state;
  }
}

//GSTUser 用户信息
export function GstUserDetail(state = {
  data: [],
  status: -1,
  message: ""
}, action) {
  const json = action.json;
  switch (action.type) {
    case RECEIVE_GST_USER_DETAIL:
      let data = [];
      if (json.status == 0) {
        data = json.data;
      }
      return {
        data: data,
        status: json.status,
        message: json.message,
      };
      break;
    default:
      return state;
  }
}
