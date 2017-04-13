//处方引用模板

import {host} from "./hostConf";
import {get,post,phpPost} from "./BaseAction";

export const QUERYRECIPETEMPLETTREE = "QUERYRECIPETEMPLETTREE";
export const ADD_PERSONAL_RECIPE_TEMPLET = "ADD_PERSONAL_RECIPE_TEMPLET";
export const DELETE_RECIPE_TEMPLET = "DELETE_RECIPE_TEMPLET";
export const MODIFY_RECIPE_TEMPLET = "MODIFY_RECIPE_TEMPLET";
export const ADD_RECIPE_TEMPLET_DETAILED = "ADD_RECIPE_TEMPLET_DETAILED";
export const QUERY_RECIPE_TEMPLET_DETAIL = "QUERY_RECIPE_TEMPLET_DETAIL";
export const QUERY_COMMON_RECIPE_TEMPLET_LIST = "QUERY_COMMON_RECIPE_TEMPLET_LIST";





/**
 * 查询第一级列表
 * @param  {[type]} data             [description]
 * @param  {[type]} [callback=(json] [description]
 * @return {[type]}                  [description]
 */
export function getQueryRecipeTempletTree(data,callback=(json)=>{}){
  return get(`${host.cplus}cgi-bin/templetmanage/queryrecipetemplettree`,data,callback,(json)=>{
    return {
      type: QUERYRECIPETEMPLETTREE,
      json
    }
  });
}

export function getQueryCommonRecipeTempletList(data,callback=(json)=>{}){
  return get(`${host.cplus}cgi-bin/templetmanage/querycommonrecipetempletlist`,data,callback,(json)=>{
    return {
      type: QUERY_COMMON_RECIPE_TEMPLET_LIST,
      json
    }
  });
}

/**
 * 添加二级菜单
 * @param  {[type]} data             [description]
 * @param  {[type]} [callback=(json] [description]
 * @return {[type]}                  [description]
 */
export function addpersonalrecipetemplet(data,callback=(json)=>{}){
  return post(`${host.cplus}cgi-bin/templetmanage/addpersonalrecipetemplet`,data,callback,(json)=>{
    return {
      type: ADD_PERSONAL_RECIPE_TEMPLET,
      json
    }
  });
}

/**
 * 删除菜单  模板
 * @param  {[type]} data             [description]
 * @param  {[type]} [callback=(json] [description]
 * @return {[type]}                  [description]
 */
export function deleterecipetemplet(data,callback=(json)=>{}){
  return post(`${host.cplus}cgi-bin/templetmanage/deleterecipetemplet`,data,callback,(json)=>{
    return {
      type: DELETE_RECIPE_TEMPLET,
      json
    }
  });
}

/**
 * 修改菜单  模板
 * @param  {[type]} data             [description]
 * @param  {[type]} [callback=(json] [description]
 * @return {[type]}                  [description]
 */
export function modifyrecipetemplet(data,callback=(json)=>{}){
  return post(`${host.cplus}cgi-bin/templetmanage/modifyrecipetemplet`,data,callback,(json)=>{
    return {
      type: MODIFY_RECIPE_TEMPLET,
      json
    }
  });
}

/**
 * 新增处方模板详情
 * @param {[type]} data             [description]
 * @param {[type]} [callback=(json] [description]
 */
export function addRecipeTempletDetailed(data,callback=(json)=>{}){
  return post(`${host.cplus}cgi-bin/templetmanage/addrecipetempletdetailed`,data,callback,(json)=>{
    return {
      type: ADD_RECIPE_TEMPLET_DETAILED,
      json
    }
  });
}

/**
 * 查询处方模板详情
 * @param {[type]} data             [description]
 * @param {[type]} [callback=(json] [description]
 */
export function queryRecipeTempletDetail(data,callback=(json)=>{}){
  return get(`${host.cplus}cgi-bin/templetmanage/queryrecipetempletdetail`,data,callback,(json)=>{
    return {
      type: QUERY_RECIPE_TEMPLET_DETAIL,
      json
    }
  });
}
