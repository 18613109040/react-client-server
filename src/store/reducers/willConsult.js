import {GET_WILL_CONSULT,
	GET_CONSULTING,
	GET_CONSULTS_END,
	GET_ALLCONSULTING,
	GET_ALLCONSULTS_END} from "../actions/willConsult";
const initialState ={
	data:[],
  	current_page: 1,
  	status: -1,
  	message: "",
	page_size:10,
	total:40
};

/*export function getwilCousult(state = initialState, action){
 
  const json = action.json;
  switch(action.type) {
    case GET_WILL_CONSULT:
       return Object.assign({},state, json);
    default:
      return state;
  }
}*/


export function getConsulting(state = initialState, action){
 
  const json = action.json;
  switch(action.type) {
    case GET_CONSULTING:
       return Object.assign({},state, json);
    
    
    default:
      return state;
  }
}

export function getAllConsul(state = initialState, action){
	const json = action.json;
	let data = null ;
  	switch(action.type) {
    	case GET_ALLCONSULTING:
    		if(state.status == -1){
    	    	return Object.assign({},state, json);
    
    	    }else{
    	    	
    	    	return Object.assign({},state, json);
    	    	//return  Object.assign({}, json, {data: Array.concat(state.data, json.data)});    
    	
    	    }
	   default:
      		return state;
  	}

}
export function getAllConsulEnd(state = initialState, action){
	const json = action.json;
  	switch(action.type) {
    	case GET_ALLCONSULTS_END:
    	    if(state.status == -1){
    	    	return Object.assign({},state, json);
    
    	    }else{
    	    	return  Object.assign({}, json, {data: Array.concat(state.data, json.data)});    
    	
    	    }
	   default:
      		return state;
  	}

}
export function getConsultsEnd(state = initialState, action){
 
  const json = action.json;
  switch(action.type) {
    case GET_CONSULTS_END:
       return Object.assign({},state, json);
    default:
      return state;
  }
}