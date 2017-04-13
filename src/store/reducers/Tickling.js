export const FEEDBACK_LIST = 'FEEDBACK_LIST';

// 反馈列表
export function feedbackList( state = {
  data:{
    list:[],
    page_no:"0",
    page_size:"0",
    role:"",
    total:"",
    total_page:"",
    user_id:"",
  },
  message:'',
  status:''
}, action){
  const json = action.json;
  switch(action.type){
    case FEEDBACK_LIST:
      if(json.status!="0") return state;
      return json;
    default:
      return state;
  }
}
