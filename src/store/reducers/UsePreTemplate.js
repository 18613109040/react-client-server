import {
  QUERYRECIPETEMPLETTREE,
  ADD_RECIPE_TEMPLET_DETAILED
} from "../actions/UsePreTemplate";


export function queryRecipeTempletTree(state={
  "status": 0,
  "message": "",
  "page_size": 10,
  "current_page": 1,
  "total_page": 1,
  "total_num": 7,
  "data": {
    "list":[],
    "list_num": 7
  }
},action){
  const json = action.json;
  switch (action.type) {
    case QUERYRECIPETEMPLETTREE:{
      return Object.assign({}, state, json);
    }
      break;
    default:
  }
  return state
}
