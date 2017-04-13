import {GET_SETTING} from "../actions/SettingAction";
const initialState ={
	data:{
		font_size:"0",
		font_type:"0",
		medical_record_for_return_visits:"0",
		show:"",
		treat_way:"0"
	},
	status:"-1"
};

export function setting(state = initialState, action){
  const json = action.json;
  switch(action.type) {
    case GET_SETTING:
    	if(json.status.toString()=="0"){
    	 	return Object.assign({},state, json);
    	}else{
    		return state
    	} 
    default:
      return state;
  }
}
