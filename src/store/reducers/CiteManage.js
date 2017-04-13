import {MEDICRECORD_LIST,SYNCHRONIZATION_CHINE,SYNCHRONIZATION_WESTERN,REVIEVE_DETAIL_LIST,GET_CLICLENT_DADA,TONGUENATURE,TONGUECOAT,PULSE} from "../actions/CiteManage";
const initialState ={

};

export function medicrecordList(state = initialState, action){
  const json = action.json;
  switch(action.type) {
    case MEDICRECORD_LIST:
     
       return Object.assign({},state, json);
    default:
      return state;
  }
}

export function chineDiagnose(state = [], action){
  switch(action.type) {
    case SYNCHRONIZATION_CHINE:
    	if(action.data && action.data.check)
      	return eval(action.data.check);
      else
      	return []
    default:
      return state;
  }
}

export function westernDiagnose(state = [], action){
  switch(action.type) {
    case SYNCHRONIZATION_WESTERN:
    	if(action.data && action.data.check)
       	return eval(action.data.check);
      else
      	return []
    default:
      return state;
  }
}

export function dealList(state={
  status : -1,
  message : '',
  page_no : 1,
  deal_list : [],
  total_page : 0,
  deal_list_num : 0,
  deal_total_num : 0,
},action){
  switch (action.type) {
    case REVIEVE_DETAIL_LIST:
      return Object.assign({},action.json);
      break;
    default:
      return state
  }
}
export function medicrecordDetail(state={
  data : [],
  status : -1,
  message : ''
},action){
  switch (action.type) {
    case REVIEVE_DETAIL_LIST:
      return Object.assign({},action.json);
      break;
    default:
      return state;
  }
}


export function getclientdata(state={
	all_his:"",
	bear_his:"",
	bp_down:"",
	bp_up:"",
	clinic_id:"",
	clinic_name:"",
	complaint:"",
	deal_id:"",
	doctor_id:"",
	doctor_name:"",
	family_his:"",
	is_menopause:"",
	medic_check:[],
	need_bear:"",
	now_his:"",
	opt_type:"",
	other_check:"",
	p_per:"",
	past_his:"",
	patient_id:"",
	patient_name:"",
	physique_check:"",
	pluse_id:"",
	pluse_name:"",
	process:"",
	r_per:"",
	record_id:"",
	show_opt:"",
	temperature:"",
	tongue_coat_id:"",
	tongue_coat_name:"",
	tongue_id:"",
	tongue_name:""
},action){
	switch (action.type) {
		case GET_CLICLENT_DADA:
		  return Object.assign({},state,action.data)
		default:
	      return state;
	}
}

//舌质
export function tongueNature(state=[],action){
	const json = action.json;
  switch (action.type) {
    case TONGUENATURE:
      if(json.status.toString() == "0" && json.data.length>0){
      	return Array.concat([],json.data);
      }else{
      	return Array.concat([]);
      }
      
    default:
      return state;
  }
}

//舌苔
export function tongueCoat(state=[],action){
	const json = action.json;
  switch (action.type) {
    case TONGUECOAT:
      if(json.status.toString() == "0" && json.data.length>0){
      	return Array.concat([],json.data);
      }else{
      	return Array.concat([]);
      }
      
    default:
      return state;
  }
}

//脉象
export function pulse(state=[],action){
	const json = action.json;
  switch (action.type) {
    case PULSE:
      if(json.status.toString() == "0" && json.data.length>0){
      	return Array.concat([],json.data);
      }else{
      	return Array.concat([]);
      }
      
    default:
      return state;
  }
}
