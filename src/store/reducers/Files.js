import {RECIEVE_PATIENT_FILE_LIST,RECIEVE_PATIENT_FILE_INFO,RECIEVE_PATIENT_MEDICAL_RECORD_INFO} from "../actions/Files";

export function fileList(state = {
  status : -1,
  message: '',
  data:[],
  current_page:-1,
  total_num:-1,
  total_page:-1
},action){
  switch (action.type) {
    case RECIEVE_PATIENT_FILE_LIST:
      return Object.assign({},action.json);
      break;
    default:
      return state;
  }
}

export function fileInfo(state = {
  status : -1,
  message : '',
  data : {}
},action){
  switch (action.type) {
    case RECIEVE_PATIENT_FILE_INFO:
      return Object.assign({},action.json);
      break;
    default:
      return state;
  }
}
export function medicalRecordInfo(state = {
  status : -1,
  message : '',
  data : {}
},action){
  switch (action.type) {
    case RECIEVE_PATIENT_MEDICAL_RECORD_INFO:
      return Object.assign({},action.json);
      break;
    default:
      return state;
  }
}
