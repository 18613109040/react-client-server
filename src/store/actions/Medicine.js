//处方Action
import {get,post,phpPost} from "./BaseAction";
import {host} from "./hostConf";

//中医
export const CHANGE_ZY_MEDICINE = "CHANGE_ZY_MEDICINE";
export const DELETE_ZY_MEDICINE = "DELETE_ZY_MEDICINE";
export const ZY_MEDICINE_INFO = "ZY_MEDICINE_INFO";
export const DELETE_ZY_TAB = "DELETE_ZY_TAB";//删除tab
export const ADD_ZY_TAB = "ADD_ZY_TAB"; //新增tab
export const ADD_ZY_RECIPELIST = "ADD_ZY_RECIPELIST";//新增处方
export const LIST_ZY_RECIPELIST = "LIST_ZY_RECIPELIST";//查询处方列表
export const LIST_ZY_RECIPELIST_WITH_OUT_REDUCE = "LIST_ZY_RECIPELIST_WITH_OUT_REDUCE";//查询处方列表(不存储reduce)
export const LIST_ZY_RECIPEDETAIL = "LIST_ZY_RECIPEDETAIL";//查询处方列表  单张详情
export const DELETE_ZY_RECIPELIST = "DELETE_ZY_RECIPELIST";//删除处方 单张

export const SEARCH_PREPARATION = "SEARCH_PREPARATION"; //制法搜索
export const SEARCH_USAGE = "SEARCH_USAGE"; //用法搜索
export const SEARCH_USAGE_TWO = "SEARCH_USAGE_TWO"; //用法搜索 非中药
export const SEARCH_DETAIL_USAGE = "SEARCH_DETAIL_USAGE"; //细目用法搜索
export const SEARCH_ITEM = "SEARCH_ITEM"; //药品搜索
export const SEARCH_ITEM_TWO = "SEARCH_ITEM_TWO"; //药品搜索
export const CLEAR_SEARCH_ITEM = "CLEAR_SEARCH_ITEM"; //药品搜索清空
export const CLEAR_SEARCH_ITEM_TWO = "CLEAR_SEARCH_ITEM_TWO"; //药品搜索清空
export const SEARCH_SUGGEST = "SEARCH_SUGGEST"; //整剂嘱咐搜索
export const SEARCH_FREQUENCY = "SEARCH_FREQUENCY"; //频次搜索
export const RECIEVE_EDIT_RECIPE = "RECIEVE_EDIT_RECIPE"; //修改处方状态
export const CHANGE_RECIPE_STATE = "CHANGE_RECIPE_STATE"; //转换厨房状态
export const QUERY_DOCTORSTH_LIST = "QUERY_DOCTORSTH_LIST"; //医生列表
export const QUERY_RARE_LIST = "QUERY_RARE_LIST"; //医生列表




export function changeZYMedicine(data){
  // 判断最后一行是否有数据
  const {items} = data;
  const len = items.length;
  if(items[len-1].item_name != ""){
    items.push({
      item_amount:"0",
      item_code:"0",
      item_id:"1",
      item_name:"",
      item_price:"",
      item_type:"0",
      item_unit:"",
      total_amount:"0",
      total_price:"",
      usage_desc:"",
      usage_id:"",
      wst_spec:"",
      min_unit:'1',
      wst_taking_amount:"",
      wst_taking_days:"",
      wst_taking_desc:"",
      wst_taking_times:"",
      wst_taking_unit:"",
    })
  }
  return{
    type: CHANGE_ZY_MEDICINE,
    data: {
      items:[...items],
      name:data.name
    },
  }
}

export function deleteZYMedicine(data){
  return{
    type: DELETE_ZY_MEDICINE,
    data: data,
  }
}

export function zYMedicineInfo(data){
  return{
    type: ZY_MEDICINE_INFO,
    data: data,
  }
}

/**
 * 删除tab
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function deleteZYTab(data){
  return{
    type: DELETE_ZY_TAB,
    data: data,
  }
}

export function addZYTab(data){
  return{
    type: ADD_ZY_TAB,
    data: data,
  }
}

/**
 * 添加处方列表
 * @param  {[type]}   data     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
export function postAddrecipelist(data,callback){
  return post(`${host.cplus}cgi-bin/recipe/addrecipelist`,data,callback,(json)=>{
    return {
      type: ADD_ZY_RECIPELIST,
      json
    }
  });
}

/**
 * 处方列表
 * @param  {[type]}   data     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
export function getRecipelist(data,callback){
  // return get(`http://rap.gstzy.cn/mockjsdata/23/cgi-bin/recipe/queryrecipelist?his_recipe_id=&family_phone=&cloud_recipe_id=&registration_deal_id=&pharmacy_id=&page_no=&user_id=&clinic_id=&start_time=&recipe_state=&family_name=&is_ship=&end_time=&page_size=&pharmacy_type=&process_type=&query_type=#`,data,callback,(json)=>{
  return get(`${host.cplus}cgi-bin/recipe/queryrecipelist`,data,callback,(json)=>{
    return {
      type: LIST_ZY_RECIPELIST,
      json
    }
  });
}
/**
 * 处方列表，数据不存储在reduce里面
 * @param  {[type]}   data     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
export function getRecipelistWithOutReduce(data,callback){
  return get(`${host.cplus}cgi-bin/recipe/queryrecipelist`,data,callback,(json)=>{
    return {
      type: LIST_ZY_RECIPELIST_WITH_OUT_REDUCE,
      json
    }
  });
}

/**
 * 处方详情
 * @param  {[type]}   data     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
export function getRecipeDetail(data,callback){
  // return get(`http://rap.gstzy.cn/mockjsdata/23/cgi-bin/recipe/queryrecipedetail?user_id=&cloud_recipe_id=#`,data,callback,(json)=>{
  return get(`${host.cplus}cgi-bin/recipe/queryrecipedetail`,data,callback,(json)=>{
    return {
      type: LIST_ZY_RECIPEDETAIL,
      json
    }
  });
}
/**
 * 修改处方
 * @param  {[type]}   data     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
export function editRecipe(data,callback){
  return post(`${host.cplus}cgi-bin/recipe/modifyrecipe`,data,callback,(json)=>{
    return {
      type : RECIEVE_EDIT_RECIPE,
      json
    }
  })
}
/**
 * 删除处方
 * @param  {[type]}   data     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
export function deleteRecipeDetail(data,callback){
  return post(`${host.cplus}cgi-bin/recipe/deleterecipe`,data,callback,(json)=>{
    return {
      type: DELETE_ZY_RECIPELIST,
      json
    }
  });
}
export function changeReciptState(data,callback){
  return post(`${host.cplus}cgi-bin/recipe/recipetranstate`,data,callback,(json)=>{
    return {
      type: CHANGE_RECIPE_STATE,
      json
    }
  });
}

/*****************************字典搜索***************************************/
/**
 * 用法搜索 中药
 * @param  {[type]}   data     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
export function searchUsage(data,callback){
  return get(`${host.cplus}cgi-bin/search/usage`,data,callback,(json)=>{
    return {
      type: SEARCH_USAGE,
      json
    }
  });
}
/**
 * 用法搜索 非中药
 * @param  {[type]}   data     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
export function searchUsageTwo(data,callback){
  return get(`${host.cplus}cgi-bin/search/usage`,data,callback,(json)=>{
    return {
      type: SEARCH_USAGE_TWO,
      json
    }
  });
}
/**
* 整剂嘱咐搜索
* @param  {[type]}   data     [description]
* @param  {Function} callback [description]
* @return {[type]}            [description]
*/
export function searchSuggest(data,callback){
  return get(`${host.cplus}cgi-bin/search/suggest`,data,callback,(json)=>{
    return {
      type: SEARCH_SUGGEST,
      json
    }
  });
}
/**
 * 细目用法搜索
 * @param  {[type]}   data     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
export function searchDetailUsage(data,callback){
  return get(`${host.cplus}cgi-bin/search/detailUsage`,data,callback,(json)=>{
    return {
      type: SEARCH_DETAIL_USAGE,
      json
    }
  });
}
/**
 * 药品搜索
 * @param  {[type]}   data     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
export function searchItem(data,callback){
  return get(`${host.cplus}cgi-bin/search/item`,data,callback,(json)=>{
    return {
      type: SEARCH_ITEM,
      json
    }
  });
}
/**
 * 药品搜索 中西成药
 * @param  {[type]}   data     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
export function searchItemTwo(data,callback){
  return get(`${host.cplus}cgi-bin/search/item`,data,callback,(json)=>{
    return {
      type: SEARCH_ITEM_TWO,
      json
    }
  });
}
/**
 * 药品搜索清空
 * @param  {[type]}   data     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
export function clearSearchItem(){
  return {
    type: CLEAR_SEARCH_ITEM,
  }
}
export function clearSearchItemTwo(){
  return {
    type: CLEAR_SEARCH_ITEM_TWO,
  }
}


/**
 * 制法搜索
 * @param  {[type]}   data     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
export function searchPreparation(data,callback){
  return get(`${host.cplus}cgi-bin/search/preparation`,data,callback,(json)=>{
    return {
      type: SEARCH_PREPARATION,
      json
    }
  });
}

/**
 * 频次搜索
 * @param  {[type]}   data     [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
export function searchFrequency(data,callback){
  return get(`${host.cplus}cgi-bin/search/frequency`,data,callback,(json)=>{
    return {
      type: SEARCH_FREQUENCY,
      json
    }
  });
}

/**
* 医生搜索
* @param  {[type]}   data     [description]
* @param  {Function} callback [description]
* @return {[type]}            [description]
*/
export function queryDoctorsthList(data,callback){
  return get(`${host.cplus}cgi-bin/user/querydoctorsthlist`,data,callback,(json)=>{
    return {
      type: QUERY_DOCTORSTH_LIST,
      json
    }
  });
}

/**
* 贵细人员列表
* @param  {[type]}   data     [description]
* @param  {Function} callback [description]
* @return {[type]}            [description]
*/
export function queryRareList(data,callback){
  // return phpPost(`${host.cas}api/userList`,data,callback,(json)=>{
  return phpPost(`${host.cas}api/userList`,data,callback,(json)=>{
    return {
      type: QUERY_RARE_LIST,
      json
    }
  });
}
