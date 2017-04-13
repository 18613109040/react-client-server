import {polyfill} from "es6-promise";
import fetch from "isomorphic-fetch";
import {host} from "./hostConf";
import {parseParams} from "../../utils/tools"

const option = {
  timeout: 10000,
  credentials: 'include',
};

export function get(url="", data=null, callback=(json)=>{}, reducersConnect=(json)=>{}){
  const params = parseParams(data), tarUrl = data==null?url:`${url}?${params}`;
  return dispatch=>{
    return fetch(tarUrl, {method: "GET",timeout: 300,...option})
      .then( response => {
        return response.json()
      })
      .then(json=>{
        dispatch(reducersConnect(json));
        callback(json);
      })
  }
}

export function phpGet(url="", data=null, callback=(json)=>{}, reducersConnect=(json)=>{}){
  let postData = {};
  for(let i in data){
    if ((typeof data[i]==="object")&&(data[i].constructor===Array)) {
      data[i].map((item,index)=>{
        postData[i+"["+index+"]"] = item
      });
    }else{
      postData[i] = data[i]
    }
  }
  const params = parseParams(postData), tarUrl = data==null?url:`${url}?${params}`;
  return dispatch=>{
    return fetch(tarUrl, {method: "GET",timeout: 300,option})
      .then( response => {
        return response.json()
      })
      .then(json=>{
        dispatch(reducersConnect(json));
        callback(json);
      })
  }
}

export function post(url="", data=null, callback=(json)=>{}, reducersConnect=(json)=>{}){
  return dispatch=>{
    return fetch(url, {method: "POST",body:JSON.stringify(data),option})
      .then( response => {
        return response.json()
      })
      .then(json=>{
        dispatch(reducersConnect(json));
        callback(json);
      })
  }
}

export function phpPost(url="", data=null, callback=(json)=>{}, reducersConnect=(json)=>{}){
  let form = new FormData(data);
  for(let i in data){
    if ((typeof data[i]==="object")&&(data[i].constructor===Array)) {
      data[i].map((item,index)=>{
        form.append(i+"["+index+"]",item)
      })
    }else {
      form.append(i, data[i])
    }
  }
  return dispatch=>{
    return fetch(url, {method: "POST", body:form,option})
      .then( (response, onRejected) => {
        return response.json()
      })
      .then(json=>{
        dispatch(reducersConnect(json));
        callback(json);
      })
  }
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}
