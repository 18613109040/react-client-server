import {GET_USER_INFO} from "../actions/getUserInfo";
const initialState ={
	data:{
		rooms:0,
		new_message:0,
		private_msg:0,
		new_rooms:[],
		doc2shop_list:[]
	},
	status:-2
};

export function getUserInfo(state = initialState, action){
  const json = action.json;
  switch(action.type) {
    case GET_USER_INFO:
       return Object.assign({},state, json);
    default:
      return state;
  }
}
