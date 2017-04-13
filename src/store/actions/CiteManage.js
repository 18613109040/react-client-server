import {get, phpPost,post} from "./BaseAction";
import {host} from "./hostConf";

export const ADD_HANDLE = "ADD_HANDLE";
export const DELETE_HANDLE = "DELETE_HANDLE";
export const SEARCH_HANDLE = "SEARCH_HANDLE";
export const ADD_DIR = "ADD_DIR";
export const EIDT_DIR = "EIDT_DIR";
export const ADD_CASE = "ADD_CASE";
export const DElETE_CASE = "DElETE_CASE";
export const MEDICRECORD_LIST = "MEDICRECORD_LIST";
export const MEDICRECORD_SAVE = "MEDICRECORD_SAVE";
export const PATIENTINFO = "PATIENTINFO";
export const TONGUENATURE = "TONGUENATURE";
export const MEDICRECORD_DETAIL = "MEDICRECORD_DETAIL";
export const QUERY_HANDLE_TEMPLETDE = "QUERY_HANDLE_TEMPLETDE";
export const SEARCH_CASE = "SEARCH_CASE";
export const ADD_CASE_DETAILED = "ADD_CASE_DETAILED";
export const SEARCH_CASE_DETAILED = "SEARCH_CASE_DETAILED";
export const EIDT_CASE = "EIDT_CASE";
export const CHINE_DIAGNOSE = "CHINE_DIAGNOSE";
export const WESTERN_DIAGNOSE = "WESTERN_DIAGNOSE";
export const SYNCHRONIZATION_CHINE = "SYNCHRONIZATION_CHINE";
export const SYNCHRONIZATION_WESTERN = "SYNCHRONIZATION_WESTERN";
export const TONGUECOAT = "TONGUECOAT";
export const PULSE = "PULSE";
export const REVIEVE_DETAIL_LIST = "REVIEVE_DETAIL_LIST";
export const STATIC_DOCTOR = "STATIC_DOCTOR";
export const REGISTRATION_INTREATMENT = "REGISTRATION_INTREATMENT";
export const REGISTRATION_AFTERTREATMENT = "REGISTRATION_AFTERTREATMENT";
export const REGISTRATION_CONTINUETREATMENT = "REGISTRATION_CONTINUETREATMENT";
export const GET_CLICLENT_DADA = "GET_CLICLENT_DADA";


//医生统计
export function statisticsDoctor(data, callback=(json)=>{}){
  return phpPost(`${host.sHost}api/query-performance`, data,callback, (json)=>{
    return {
      type : STATIC_DOCTOR,
      json
    }
  })
}

//处理另存为模板
export function addHandle(data, callback){
  return post(`${host.cplus}cgi-bin/templetmanage/addhandletempletdetailed`, data,
    callback, (json)=>{
      return {
        type: ADD_HANDLE,
        json
      }
    }
  )
}
//删除处理模板
export function deleteHandle(data, callback){
  return post(`${host.cplus}cgi-bin/templetmanage/deletehandletemplet`, data,
    callback, (json)=>{
      return {
        type: DELETE_HANDLE,
        json
      }
    }
  )
}
//查询处理模板
export function searchHandle(data, callback){
  return get(`${host.cplus}cgi-bin/templetmanage/queryhandletemplet`, data,
    callback, (json)=>{
      return {
        type: SEARCH_HANDLE,
        json
      }
    }
  )
}
//查询处理详情
export function queryHandleTempletde(data, callback){
  return get(`${host.cplus}cgi-bin/templetmanage/queryhandletempletdetailed`, data,
    callback, (json)=>{
      return {
        type: QUERY_HANDLE_TEMPLETDE,
        json
      }
    }
  )
}
//新增处理目录
export function addDir(data, callback){
  return post(`${host.cplus}cgi-bin/templetmanage/addhandletemplet`, data,
    callback, (json)=>{
      return {
        type: ADD_DIR,
        json
      }
    }
  )
}

//修改处理目录
export function eidtDir(data, callback){
  return post(`${host.cplus}cgi-bin/templetmanage/modifyhandletemplet`, data,
    callback, (json)=>{
      return {
        type: EIDT_DIR,
        json
      }
    }
  )
}

//新增病历模板
export function addCase(data, callback){
  return post(`${host.cplus}cgi-bin/templetmanage/addmedicalrecordtemplet`, data,
    callback, (json)=>{
      return {
        type: ADD_CASE,
        json
      }
    }
  )
}

//修改病历模板
export function eidtCase(data, callback){
  return post(`${host.cplus}cgi-bin/templetmanage/modifymedicalrecordtemplet`, data,
    callback, (json)=>{
      return {
        type: EIDT_CASE,
        json
      }
    }
  )
}

//删除病历模板
export function deleteCase(data, callback){
  return post(`${host.cplus}cgi-bin/templetmanage/deletemedicalrecordtemplet`, data,
    callback, (json)=>{
      return {
        type: DElETE_CASE,
        json
      }
    }
  )
}

//查询病历模板
export function searchCase(data, callback){
  return get(`${host.cplus}cgi-bin/templetmanage/querymedicalrecordtemplettree`, data,
    callback, (json)=>{
      return {
        type: SEARCH_CASE,
        json
      }
    }
  )
}
//查询病历模板详情
export function searchCaseDetailed(data, callback){
  return get(`${host.cplus}cgi-bin/templetmanage/querymedicalrecordtempletdetailed`, data,
    callback, (json)=>{
      return {
        type: SEARCH_CASE_DETAILED,
        json
      }
    }
  )
}

//新增病历模板详情
export function addCaseDetailed(data, callback){
  return post(`${host.cplus}cgi-bin/templetmanage/addmedicalrecordtempletdetailed`, data,
    callback, (json)=>{
      return {
        type: ADD_CASE_DETAILED,
        json
      }
    }
  )
}



//病历就诊记录
export function medicrecordList(data, callback){
  return get(`${host.cplus}cgi-bin/deal/dealList`, data,
 // 	return get(`http://rap.gstzy.dev/mockjsdata/3/cgi-bin/deal/dealList?deal_state_filter=&date_type=&deal_type=&pconfirm_start_time=&pconfirm_end_time=&city_id=&doctor_id=&clinic_id=&deal_start_time=&patient_id=&paied_end_time=&reservation_end_time=&user_id=&reservation_start_time=&page_no=&login_id=&patient_name=&deal_end_time=&page_size=&schedule_id=&member_no=&paied_start_time=&doctor_name=#`, data,
    callback, (json)=>{
      return {
        type: MEDICRECORD_LIST,
        json
      }
    }
  )
}


//扭转订单为应诊
export function registrationintreatment(data, callback){
  return post(`${host.cplus}cgi-bin/deal/registrationintreatment`, data,
 // 	return get(`http://rap.gstzy.dev/mockjsdata/3/cgi-bin/deal/dealList?deal_state_filter=&date_type=&deal_type=&pconfirm_start_time=&pconfirm_end_time=&city_id=&doctor_id=&clinic_id=&deal_start_time=&patient_id=&paied_end_time=&reservation_end_time=&user_id=&reservation_start_time=&page_no=&login_id=&patient_name=&deal_end_time=&page_size=&schedule_id=&member_no=&paied_start_time=&doctor_name=#`, data,
    callback, (json)=>{
      return {
        type: REGISTRATION_INTREATMENT,
        json
      }
    }
  )
}

//扭转订单为已就诊
export function registrationaftertreatment(data, callback){
  return post(`${host.cplus}cgi-bin/deal/registrationaftertreatment`, data,
 // 	return get(`http://rap.gstzy.dev/mockjsdata/3/cgi-bin/deal/dealList?deal_state_filter=&date_type=&deal_type=&pconfirm_start_time=&pconfirm_end_time=&city_id=&doctor_id=&clinic_id=&deal_start_time=&patient_id=&paied_end_time=&reservation_end_time=&user_id=&reservation_start_time=&page_no=&login_id=&patient_name=&deal_end_time=&page_size=&schedule_id=&member_no=&paied_start_time=&doctor_name=#`, data,
    callback, (json)=>{
      return {
        type: REGISTRATION_AFTERTREATMENT,
        json
      }
    }
  )
}

// a9.扭转订单续诊
export function registrationcontinuetreatment(data, callback){
  return post(`${host.cplus}cgi-bin/deal/registrationcontinuetreatment`, data,
 // 	return get(`http://rap.gstzy.dev/mockjsdata/3/cgi-bin/deal/dealList?deal_state_filter=&date_type=&deal_type=&pconfirm_start_time=&pconfirm_end_time=&city_id=&doctor_id=&clinic_id=&deal_start_time=&patient_id=&paied_end_time=&reservation_end_time=&user_id=&reservation_start_time=&page_no=&login_id=&patient_name=&deal_end_time=&page_size=&schedule_id=&member_no=&paied_start_time=&doctor_name=#`, data,
    callback, (json)=>{
      return {
        type: REGISTRATION_CONTINUETREATMENT,
        json
      }
    }
  )
}




//病历明细
export function medicrecordDetail(data, callback){
  // return get(`http://rap.gstzy.cn/mockjsdata/28/cgi-bin/medicrecord/detail?patient_id=&deal_id=&record_id=&clinic_id=`, data,
  return get(`${host.cplus}cgi-bin/medicrecord/detail`, data,
    callback, (json)=>{
      return {
        type: MEDICRECORD_DETAIL,
        json
      }
    }
  )
}


//保存病历
export function medicrecordSave(data, callback){
  return post(`${host.cplus}cgi-bin/medicrecord/update`, data,
    callback, (json)=>{
      return {
        type: MEDICRECORD_SAVE,
        json
      }
    }
  )
}

//中医诊断
export function chineDiagnose(data, callback){
  return get(`${host.cplus}cgi-bin/search/diagnose`, data,
    callback, (json)=>{
      return {
        type: CHINE_DIAGNOSE,
        json
      }
    }
  )
}
//西医诊断
export function westernDiagnose(data, callback){
  return get(`${host.cplus}cgi-bin/search/diagnose`, data,
    callback, (json)=>{
      return {
        type: WESTERN_DIAGNOSE,
        json
      }
    }
  )
}

//西医诊断同步中医诊断
export function synchronizationChine(data){
	return {
		type:SYNCHRONIZATION_CHINE,
		data
	}
}

//中医诊断同步西医诊断
export function synchronizationWestern(data){
	return {
		type:SYNCHRONIZATION_WESTERN,
		data
	}
}


//获取患者信息 (接口没有)
export function patientInfo(data, callback){
  return get(`${host.cplus}cgi-bin/medicrecord/update`, data,
    callback, (json)=>{
      return {
        type: PATIENTINFO,
        json
      }
    }
  )
}
//获取舌质列表
export function tongueNature(data, callback){
  return get(`${host.cplus}cgi-bin/search/tongue`, data,
    callback, (json)=>{
      return {
        type: TONGUENATURE,
        json
      }
    }
  )
}
//获取舌苔列表
export function tongueCoat(data, callback){
  return get(`${host.cplus}cgi-bin/search/tongueCoat`, data,
    callback, (json)=>{
      return {
        type: TONGUECOAT,
        json
      }
    }
  )
}
//获取脉象列表
export function pulse(data, callback){
  return get(`${host.cplus}cgi-bin/search/pulse`, data,
    callback, (json)=>{
      return {
        type: PULSE,
        json
      }
    }
  )
}
//  获取患者在医生出的就诊记录
export function fetchDealList(data, callback){
  // return get(`http://rap.gstzy.dev/mockjsdata/3/cgi-bin/deal/dealList?deal_state_filter=&date_type=&deal_type=&pconfirm_start_time=&pconfirm_end_time=&city_id=&doctor_id=&clinic_id=&deal_start_time=&patient_id=&paied_end_time=&reservation_end_time=&user_id=&reservation_start_time=&page_no=&login_id=&patient_name=&deal_end_time=&page_size=&schedule_id=&member_no=&paied_start_time=&doctor_name=#`, data,callback, (json)=>{
  return get(`${host.cplus}cgi-bin/deal/dealList`, data,callback, (json)=>{
      return {
        type: REVIEVE_DETAIL_LIST,
        json
      }
    }
  )
}



//获取病历所有保存数据 
export function getClilentData(data){
	return {
		type:GET_CLICLENT_DADA,
		data
	}
}
