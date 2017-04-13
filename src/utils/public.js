import Cookie from "js-cookie";


export const RECIPESTATUS = {
  1:'待下单',
  2:'已下单',
  3:'已结算',
  4:'已审方',
  5:'已调剂',
  6:'已加工',
  7:'待发药',
  8:'已挂起',
  9:'已发药',
  10:'已退款'
};
export const RECIPETYPE = {
  1:"西药",
  3:"中药饮片",
  4:"检查",
  5:"检验",
  6:"治疗",
  7:"材料",
  8:"其它",
  9:"协定方",
  10:"其它"
}
export const fryStatusMap={
  '0': '',
  '1': '代煎'
};
export const shipStatusMap={
  '0': '',
  '1': '代寄'
};
export const genderMap={
  '0': '未填写',
  '1': '男',
  '2': '女',
};


export const ZFItemId = {
  "311":{//海珠
    paste400:{
      item_id:"100024",
    },
    paste300:{
      item_id:"100025",
    },
    pill:{
      item_id:"100027",
    },
    pill100:{
      item_id:"100026",
    }
  },
  "251":{//广州骏景分院
    paste400:{
      item_id:"100018",
    },
    paste300:{
      item_id:"100019",
    },
    pill:{
      item_id:"100021",
    },
    pill100:{
      item_id:"100020",
    }
  },
  "1011":{//深圳宝安中医院
    paste400:{
      item_id:"100077",
    },
    paste300:{
      item_id:"100078",
    },
    pill:{
      item_id:"100080",
    },
    pill100:{
      item_id:"100079",
    }
  }
}

/**
 * @desc js里的Date类型转为时间戳(时间戳转为Date类型请参照tools.js里convertTimeToStr)
 * @author hao
 * @param date Date类型
 * @return number
 * */
export function dateToStamp(date) {
  //判断是否为Date类型，也可以 (typeof date=='object')&&date.constructor==Date
  if( !(date instanceof Date) ){
    return 0;
  }
  //Date.parse(date)方法获得的是 1470898476000
  //date.getTime() 方法获得的是 1470898476295
  return Math.round(date.getTime()/1000);
}

/**
 * @desc 转换成数字
 * @author hao
 * @param v 一个待处理的字符串
 * @return number
 * */
export function toNumber(v) {
  if (!v || !v.trim()) {
    return undefined;
  }
  let num = Number(v);
  if (!isNaN(num)) {
    num = parseInt(v, 10);
  }
  return isNaN(num) ? v : num;
}
/**
 * @desc 单据类型转换
 * @author hao
 * @param number
 * @return string
 * */
export function docTypeMap(num){
  const MAP = ["", "入库", "退库", "报损"];
  if (typeof num !== "number") {
    return "";
  }
  if (num > 0 && num < 4) {
    return MAP[num];
  }else{
    return "";
  }
}

export function isDate(obj) {
  if(_typeof(obj) === "date"){
    return true;
  }else{
    return false;
  }
}
/**
 * @desc 判断类型
 * @author hao
 * @param obj
 * @return string 返回一个类型名称
 * */
export function _typeof(obj){
  var class2type = {} ;
  "Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(function(e,i){
    class2type[ "[object " + e + "]" ] = e.toLowerCase();
  });
  if ( obj == null ){
    return String( obj );
  }
  return typeof obj === "object" || typeof obj === "function" ?
  class2type[ class2type.toString.call(obj) ] || "object" :
    typeof obj;
}

const Public={
  dateToStamp,
  toNumber,
  docTypeMap,
  _typeof,
  isDate,
  RECIPETYPE
};

export default Public;
