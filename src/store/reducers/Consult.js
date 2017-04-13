import {RECIEVE_PATIENT_CONSULT_HISTORY} from "../actions/Consult";

export function consultList(state = {
  status : -1,
  message: '',
  current_page:1,
  total:0,
  data:[]
},action){
  switch (action.type) {
    case RECIEVE_PATIENT_CONSULT_HISTORY:
      return Object.assign({},action.json);
      break;
    default:
      return state;
  }
}
