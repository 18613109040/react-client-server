import {RECIEVE_COMMENT_LIST,RECIEVE_PATIENT_COMMENT_LIST,RECIEVE_REMOVE_REPLAY} from "../actions/Comments";

export function commentList(state={
  data : [],
  status : -1,
  message : '',
  page_size : '',
  total_num : '',
  total_page : ''
},action){
  switch (action.type) {
    case RECIEVE_PATIENT_COMMENT_LIST:
    case RECIEVE_COMMENT_LIST:
      return Object.assign({},action.json);
      break;
    case RECIEVE_REMOVE_REPLAY:
      const data = state.data.map((item,index)=>{
        if (item.comment_id==json.comment_id) {
          item.reply_list = item.reply_list.filter((i)=>{
            return i.reply_id!=json.reply_id
          });
          return item;
        }
      });
      return {...state,data:data}
    default:
      return state
  }
}
