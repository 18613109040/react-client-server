import Cookie from "js-cookie";

/**
 * @description 判断是否登录,没有登录则自动登录
 */
export function isLogin(callBackUrl = "") {
  if (typeof window == "undefined") return;
  const {user_id} = getUser(); //获取用户id
  if (user_id) {
    return user_id;
  } else {
    goLogin(callBackUrl);
    return false;
  }
}

/**
 * @description 从cookie中取用户信息,返回用户对象
 * @returns {{user_id: (*|boolean), login_id: (*|boolean), open_id: (*|boolean), user_role: (*|boolean), cur_role: (*|boolean)}}
 */
export function getUser(){
  // Cookie.remove("doctor_name", {domain: `.gstzy.cn`});
  const data = {
    user_id:Cookie.get('userid') || false,
    userid:Cookie.get('userid') || false,
    doctor_id:Cookie.get('doctor_id') || 148008,
    assistant_id:Cookie.get('assistant_id') || 0,
    role:Cookie.get('role') || 2,
    user_role:Cookie.get('user_role') || 3,
    user_tel:Cookie.get('user_tel') || '',
    newRooms:Cookie.get('newRooms') || 0,
    newMessage:Cookie.get('newMessage') || 0,
    shop_name:Cookie.get('clinic_name') || "",
    mis_doc_id:Cookie.get('mis_doc_id') || "",
    shop_no:Cookie.get('clinic_id') || "",
    clinic_id:Cookie.get('clinic_id') || "",
    shop_phone:Cookie.get('shop_phone') || "",
    doctor_name:Cookie.get('doctor_name') || "",
    doctor_phone:Cookie.get('doctor_phone') || "",
    //患者信息
    patient_id:Cookie.get('patient_id') || "",
    deal_id:Cookie.get('deal_id') || "",  //门诊号 ，订单ID
    patient_name:Cookie.get('patient_name') || "",
    patient_age:Cookie.get('patient_age') || "",
    patient_birth:Cookie.get('patient_birth') || "",
    patient_image:Cookie.get('patient_image') || "",
    patient_sex:Cookie.get('patient_sex') || "",
    patient_type:Cookie.get('patient_type') || "",
    reservation_phone:Cookie.get('reservation_phone') || "",
    patient_user_id:Cookie.get('patient_user_id') || "",
    patient_schedule_id:Cookie.get('patient_schedule_id') || "",
    patient_reservation_sort_id:Cookie.get('patient_reservation_sort_id') || "",
    patient_reservation_deal_id:Cookie.get('patient_reservation_deal_id') || "",
    patient_registration_no:Cookie.get('patient_registration_no') || "",

    department_name:Cookie.get('department_name') || "", //科室
    fee_discount_type:Cookie.get('fee_discount_type') || "", //费别
  };
  return data;
}

export function clearPatientInfo(){
  //患者信息清理
  Cookie.remove("patient_id",{domain:'.gstzy.cn'}); Cookie.remove("patient_id");
  Cookie.remove("deal_id",{domain:'.gstzy.cn'}); Cookie.remove("deal_id");
  Cookie.remove("patient_name",{domain:'.gstzy.cn'}); Cookie.remove("patient_name");
  Cookie.remove("patient_age",{domain:'.gstzy.cn'}); Cookie.remove("patient_age");
  Cookie.remove("patient_birth",{domain:'.gstzy.cn'}); Cookie.remove("patient_birth");
  Cookie.remove("patient_image",{domain:'.gstzy.cn'}); Cookie.remove("patient_image");
  Cookie.remove("patient_sex",{domain:'.gstzy.cn'}); Cookie.remove("patient_sex");
  Cookie.remove("patient_type",{domain:'.gstzy.cn'}); Cookie.remove("patient_type");
  Cookie.remove("reservation_phone",{domain:'.gstzy.cn'}); Cookie.remove("reservation_phone");
  Cookie.remove("patient_user_id",{domain:'.gstzy.cn'}); Cookie.remove("patient_user_id");
  Cookie.remove("patient_schedule_id",{domain:'.gstzy.cn'}); Cookie.remove("patient_schedule_id");
  Cookie.remove("patient_reservation_sort_id",{domain:'.gstzy.cn'}); Cookie.remove("patient_reservation_sort_id");
  Cookie.remove("patient_reservation_deal_id",{domain:'.gstzy.cn'}); Cookie.remove("patient_reservation_deal_id");
  Cookie.remove("patient_registration_no",{domain:'.gstzy.cn'}); Cookie.remove("patient_registration_no");
  Cookie.remove("department_name",{domain:'.gstzy.cn'}); Cookie.remove("department_name");
  Cookie.remove("fee_discount_type",{domain:'.gstzy.cn'}); Cookie.remove("fee_discount_type");

}

/**
 * @description 本地存储包装器
 * @param type不传默认为 localStorage, 传 session 为 sessionStorage
 */
export let storage={
  checkWindow(){
    if(!window){
      console.warn("[Storage] === Storage can ONLY used in browser.");
      return false;
    }
    return true;
  },
  checkSupport(type){
    let winFlag = this.checkWindow();
    if(winFlag && window[type]){
      return true
    }else{
      console.warn(`[Storage] === ${type} Storage is NOT supported.`);
      return false
    }
  },
  checkType(type){
    if(type && type == 'session'){
      return 'sessionStorage'
    }else{
      return 'localStorage'
    }
  },
  setObj(obj,type){
    Object.keys(obj).forEach((item)=>{
      this.set(item,obj[item],type);
    })
  },
  set(key, value, type){
    let target = this.checkType(type);
    if(this.checkSupport(target)){
      return window[target].setItem(key, JSON.stringify(value))
    }
  },
  get(key,type){
    let target = this.checkType(type);
    if(this.checkSupport(target)){
      if (window[target][key] && window[target][key] !== 'undefined') {
        return JSON.parse(window[target][key])
      } else {
        return window[target][key]
      }
    }
  },
  removeArr(arr,type){
    if(Array.isArray(arr) && arr.length){
      arr.forEach((item)=>{
        this.remove(item,type)
      })
    }else{
      console.warn("[Storage] === Params must be an array.");
    }
  },
  remove(key,type){
    let target = this.checkType(type);
    if(this.checkSupport(target)){
      if( window[target][key] && window[target][key] !== 'undefined'){
        return window[target].removeItem(key)
      }
    }
  },
  clear(type){
    let target = this.checkType(type);
    window[target].clear();
  },
};

/**
 * @description 清理当前用户信息
 */
export function cleanUser() {
  Cookie.remove("user_id",{domain:'.gstzy.cn'}); Cookie.remove("user_id");
  Cookie.remove("role",{domain:'.gstzy.cn'}); Cookie.remove("role");
  Cookie.remove("user_role",{domain:'.gstzy.cn'}); Cookie.remove("user_role");
  Cookie.remove("user_tel",{domain:'.gstzy.cn'}); Cookie.remove("user_tel");
  Cookie.remove("doctor_id",{domain:'.gstzy.cn'}); Cookie.remove("doctor_id");
  Cookie.remove("assistant_id",{domain:'.gstzy.cn'}); Cookie.remove("assistant_id");
  Cookie.remove("userid",{domain:'.gstzy.cn'}); Cookie.remove("userid");
  Cookie.remove("newRooms",{domain:'.gstzy.cn'}); Cookie.remove("newRooms");
  Cookie.remove("newMessage",{domain:'.gstzy.cn'}); Cookie.remove("newMessage");
  //患者信息清理
  Cookie.remove("patient_id",{domain:'.gstzy.cn'}); Cookie.remove("patient_id");
  Cookie.remove("deal_id",{domain:'.gstzy.cn'}); Cookie.remove("deal_id");
  Cookie.remove("patient_name",{domain:'.gstzy.cn'}); Cookie.remove("patient_name");
  Cookie.remove("patient_age",{domain:'.gstzy.cn'}); Cookie.remove("patient_age");
  Cookie.remove("patient_birth",{domain:'.gstzy.cn'}); Cookie.remove("patient_birth");
  Cookie.remove("patient_image",{domain:'.gstzy.cn'}); Cookie.remove("patient_image");
  Cookie.remove("patient_sex",{domain:'.gstzy.cn'}); Cookie.remove("patient_sex");
  Cookie.remove("patient_type",{domain:'.gstzy.cn'}); Cookie.remove("patient_type");
  Cookie.remove("reservation_phone",{domain:'.gstzy.cn'}); Cookie.remove("reservation_phone");
  Cookie.remove("patient_user_id",{domain:'.gstzy.cn'}); Cookie.remove("patient_user_id");
  Cookie.remove("patient_schedule_id",{domain:'.gstzy.cn'}); Cookie.remove("patient_schedule_id");
  Cookie.remove("patient_reservation_sort_id",{domain:'.gstzy.cn'}); Cookie.remove("patient_reservation_sort_id");
  Cookie.remove("patient_reservation_deal_id",{domain:'.gstzy.cn'}); Cookie.remove("patient_reservation_deal_id");
  Cookie.remove("patient_registration_no",{domain:'.gstzy.cn'}); Cookie.remove("patient_registration_no");


  if(typeof document !== 'undefined' && window){
    let domainName = window.location.hostname;
    Cookie.remove("user_id", {domain: domainName});
    Cookie.remove("user_name", {domain: domainName});
    Cookie.remove("work_no", {domain: domainName});
    Cookie.remove("login_account", {domain: domainName});
    Cookie.remove("clinic_id", {domain: domainName});
    Cookie.remove("clinic_name", {domain: domainName});
    Cookie.remove("city_id",{domain: domainName});
    Cookie.remove("city_name",{domain: domainName});
    Cookie.remove("pharmacy_id", {domain: domainName});
    Cookie.remove("pharmacy_name", {domain: domainName});
    Cookie.remove("pharmacy_type", {domain: domainName});
    Cookie.remove("login_to", {domain: domainName});
    Cookie.remove("pharmacy_state", {domain: domainName});
    Cookie.remove("check_id", {domain: domainName});
    Cookie.remove("system_uid", {domain: domainName});
    storage.removeArr(["user_id", "user_name", "login_account", "clinic_id", "clinic_name", "city_id","city_name", "pharmacy_id", "pharmacy_name", "pharmacy_type", "is_central_pharmacy", "pharmacy_state"])
  }
}

const User={
  isLogin           : isLogin,
  getUser           : getUser,
  cleanUser         : cleanUser
};

export default User;
