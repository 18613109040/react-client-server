import {GET_CONSULTS,GET_CONTENT_BY_ID,ANSWER} from "../actions/ConsultsSquare";
const initialState ={
	data:[],
  	current_page: 1,
  	status: -1,
  	message: "",
	page_size:10,
	total_page:40
};

export function getConsultsList(state = initialState, action){
 
  const json = action.json;
  switch(action.type) {
    case GET_CONSULTS:
       return Object.assign({},state, json);
       
    default:
      return state;
  }
}


export function getContentById(state = initialState, action){
 
  const json = action.json;
  switch(action.type) {
   case GET_CONTENT_BY_ID:
    	 return Object.assign({},state, json);
    default:
      return state;
  }
}

export function answer(state=[] , action){
 
  const json = action.json;
  switch(action.type) {
   case ANSWER:
    	 return Object.assign({},state, json);
    default:
      return state;
  }
}


 
