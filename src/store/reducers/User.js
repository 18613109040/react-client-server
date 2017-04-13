import {USER_LOGIN,RECIEVE_PATIENT_INFO} from "../actions/User";
const initialState ={
	status:-2
}

export function userInfo(state = initialState, action){
  const json = action.json;
  switch(action.type) {
    case USER_LOGIN:
       return Object.assign({},state, json);
    default:
      return state;
  }
}
export function patientInfo(state={
	status : -1,
	message : '',
	record_id:-1,
	family_sex:'',
	family_age:'',
	family_img:'',
	family_name:'',
	family_birth:'',
	family_phone:'',
	family_Address:'',
	family_indentity_num:'',
	family_indentity_type:'',
},action){
	switch (action.type) {
		case 'RECIEVE_PATIENT_INFO':
			return Object.assign({},action.json)
			break;
		default:
			return state
	}
}
