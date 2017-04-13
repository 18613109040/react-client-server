import {LOAD_SAVE,ZXDIAGNOSE} from "../actions/Comon";
export function loadType(state={
	loading:false
},action){
  switch (action.type) {
    case LOAD_SAVE:
      return Object.assign({},state,{loading:action.data}) 
      break;
    default:
      return state;
  }
}

export function zxDiagnose(state={clinilValue:"",mediciValue:''},action){
	
  switch (action.type) {
    case ZXDIAGNOSE:
     
      return Object.assign({},state,action.data)
      break;
    default:
      return state;
  }
}

