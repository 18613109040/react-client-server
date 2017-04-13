import {VERIFICATION_CODE,SMS_CODE,REST_PASSWORD} from "../actions/restPassWord";
const initialState ={
	status:-2
}

export function verificationCode(state = initialState, action){
  const json = action.json;
  switch(action.type) {
    case VERIFICATION_CODE:
       return Object.assign({},state, json);
    default:
      return state;
  }
}

export function smsCode(state = initialState, action){
  const json = action.json;
  switch(action.type) {
    case SMS_CODE:
       return Object.assign({},state, json);
    default:
      return state;
  }
}

export function restPassword(state = initialState, action){
  const json = action.json;
  switch(action.type) {
    case REST_PASSWORD:
       return Object.assign({},state, json);
    default:
      return state;
  }
}