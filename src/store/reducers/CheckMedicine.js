/*
* reducer参考
* 检验检查的接口
* */

import {RECEIVE_MEDICINE_LIST, UPDATE_MEDICINE_LIST,
  ADD_MEDICINE_LIST, REMOVE_MEDICINE_LIST,TEMPLATE_UPDATA_MODIFY,
  REMOVE_ALL_MEDICINE_LIST, MODIFY_CHECK_RECIP_ITEM,ADD_COULD_ID} from "../actions/CheckMedicine";

const initialState = {
  data:[{
    item_name:"",
    itemid:"",
    sell_price:"",
    standard: ""
  }],
  status: "-1",
  total_page:0
}
function compare(property){
    return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value2 - value1;
    }
}
function totop(data){
 	let tmp =  data.data.filter(item=> parseInt(item.no)>0);
	let temp2 = data.data.filter(item=> parseInt(item.no)==0);
	return {
		data:Array.concat(tmp,temp2),
		dept_id:data.dept_id
	}
}
// 从接口返回的检验检查列表
export function checkMedicineList( state = initialState, action){

  const json = action.json;
  switch(action.type){
    case RECEIVE_MEDICINE_LIST:
      if(json.status!="0") return state;
      let list = [];
      if(json.data&&json.data.length>0){
        json.data.map((item, index)=>{
          const temp = Object.assign({}, item,
            {check: false, no: 0, index: index},
            {item_id:item.itemid},
            {item_price:item.sell_price});
          list.push(temp);
        })
      }
      return {
        status: json.status,
        message: json.message,
        total_num: json.total_num,
        total_page: json.total_page,
        current_page: json.current_page,
        data: list
      };
      break;
    default:
      return state;
  }
}

// 检验检查处方列表
export function checkRecipeList(state=[{data:[]}], action){
  const json = action.json;
  switch (action.type) {
    case ADD_MEDICINE_LIST:
      const temp = []
      json.data.map((item, index)=>{
        temp.push(Object.assign({}, item));
      })
      const data={
        dept_id: "0",
        data: temp,
        cloud_recipe_id:json.cloud_recipe_id
      }
      return Array.concat(state, [data]).filter(item=>item.data.length>0);
    case REMOVE_MEDICINE_LIST:
      state.splice(parseInt(json.id), 1);
      return Array.concat(state, []);
    case REMOVE_ALL_MEDICINE_LIST:
      return [];
    case MODIFY_CHECK_RECIP_ITEM:
      state[json.index] =  Object.assign({},state[json.index],json.data) ;
      //state[json.index] =  totop(json.data)
      return Array.concat(state, []);
    case TEMPLATE_UPDATA_MODIFY:
    	state[json.index-1].data.map((data)=>{
    		for(let i=0;i<json.data.length;i++){
    			if(data.item_code.toString() == json.data[i].item_code.toString() ){
	    			Object.assign(data,json.data[i])
	    		}
    		}
    	})
    	return Array.concat(state, []);
    case ADD_COULD_ID:
    	json.data.data.map((item,id)=>{
    		state[id] = Object.assign({},state[id],{cloud_recipe_id:item.cloud_recipe_id})
    	})
    	return Array.concat(state, []);
    default:
      return state;
  }
}
