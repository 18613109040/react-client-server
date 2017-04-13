/*
 * 门诊 叫诊
 */

import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {Menu,Row,Col,Tag,Button, Tabs,Modal,message,Icon} from 'antd';
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
import {mul,convertTimeToStr,getAgeByBirthday} from "../utils/tools";
import {getUser,clearPatientInfo} from "../utils/User";
import PatientInfoItem from '../components/PatientInfoItem';
import Yinpian from "../components/seeDoctor/Yinpian";
import ZxMedicine from "../components/seeDoctor/ZxMedicine";
import CheckMedicine from "../components/seeDoctor/CheckMedicine";
import Treatment from "../components/seeDoctor/Treatment";
import Summary from "../components/seeDoctor/Summary";
import {fetchFileInfo} from '../store/actions/Files';
import ClinicalContent from "../components/seeDoctor/ClinicalContent";
import {getCallMis,getCallEnd,getCallUp,getCallDelay} from "../store/actions/OutPatientDepartment";
import {getRecipelistWithOutReduce,postAddrecipelist,deleteRecipeDetail,zYMedicineInfo} from "../store/actions/Medicine";
import {zXMedicineInfo} from "../store/actions/ZxMedicine";
import {getsettingSystem} from "../store/actions/SettingAction";
import PubSub from "pubsub-js";
import Cookie from "js-cookie";
import {loadSave} from "../store/actions/Comon"
import {medicrecordList,medicrecordSave,tongueNature,medicrecordDetail,diagnose,tongueCoat,pulse,getClilentData,registrationaftertreatment} from "../store/actions/CiteManage";
import {requestMedicineList} from "../store/actions/CheckMedicine";

import PrintAll from '../components/print/printAll';
const YINPIAN = "3";
const RECIPESOURCE = "3"; //处方类型
const ZXMEDICINE = "1"; //西药
const RELATIONRECIPE = {
  NOFOUNT:'0',
  DOCTOR:'1',//医生
  RAREMEDICINAL:'2',//贵细人员
  PATIENT:'3',//病人
}

class SeeDoctor extends Component {
  constructor(props){
    super(props);

    this.state={
      showButton:true,
      showTotalPrice:false,
      activeKey:this.props.location.pathname.split("/").pop()=="binli"?'1':this.props.location.pathname.split("/").pop()=="yipian"?'2':this.props.location.pathname.split("/").pop()=="chenyao"?'3':this.props.location.pathname.split("/").pop()=="jiancha"?'4':this.props.location.pathname.split("/").pop()=="liliao"?'5':this.props.location.pathname.split("/").pop()=="huizong"?'6':"1",

      patientInfo:{
        isShow:false,
        allergic_history:'',
      },
      diagnose:"",
      recipes:[],
      isLoading:false,
      finishVisible:false,
      isTreatWay:"1",//0自动叫诊  1手动叫诊
      isMis:false,
      isDelete:false,
      isSimpleOutpatient:false,
    }
    this.static = {
      patientList:[],
      flat1:true,
      flat2:true,
      flat3:true,
      flat4:true,
      clearTime:"",
      printId:'-1',
    }
  }
  componentWillMount(){
  	/********************拉取病历初始化数据存入store**************************/
  	//舌质
  	this.props.dispatch(tongueNature({keyword:""}))
  	//舌苔
  	this.props.dispatch(tongueCoat({keyword:""}))
  	//脉象
  	this.props.dispatch(pulse({keyword:""}))

  	//初始化病历数据
  	this.props.dispatch(medicrecordDetail({patient_id:getUser().patient_id ,deal_id:getUser().deal_id,clinic_id:getUser().shop_no},(res)=>{
        console.dir(res)
	    	if(res.data&&res.data.length>0){
	    		let medical = [];
				if(res.data[0].show_opt)
	    			medical = res.data[0].show_opt.split(',');
		    	this.props.dispatch(getClilentData(Object.assign({},res.data[0],{temperature:res.data[0].temperature/10},{medical:medical})))
	    	}else{
	    		this.props.dispatch(getsettingSystem({doctor_id:getUser().doctor_id},(resdata)=>{

	    				if(resdata.status == '0' && resdata.data.medical_record_for_return_visits.toString()=='1'){

						  	const medicrecord = {
						  		// doctor_id:getUser().doctor_id,
						      // clinic_id:getUser().shop_no,
						      after_treatment:'2',
						  		method:'1',
						  		page_no:'1',
						  		page_size:'7',
						  		patient_id:getUser().patient_id,
						  		deal_type:"3",
						  		user_id:getUser().reservation_phone
						  	}
						  	this.props.dispatch(medicrecordList(medicrecord,(res)=>{
						  		if(res.status.toString()=="0" && res.deal_list.length>0){
						  			 this.props.dispatch(medicrecordDetail({patient_id:getUser().patient_id ,deal_id:res.deal_list[0].deal_id,clinic_id:getUser().shop_no},(res)=>{

                      if(!res.data||res.data.length==0){
                         res.data = [];
                       }
                      if(res.status == '0' && res.data.length>0){
                      	delete res.data[0].record_id;
									    	let medical = [];
												if(res.data[0].show_opt)
								    			medical = res.data[0].show_opt.split(',');
									    	this.props.dispatch(getClilentData(Object.assign({},res.data[0],{temperature:res.data[0].temperature/10},{medical:medical})))
									    }
									  }))
						  		}else{

						  		}
						  	}))

	    				}
	    		}))



	    	}
	    }))
  	/***********************************************************************/

  	/********************拉取检验检查数据存入store**************************/
  	/*const data = {
      query_type:1,//患者维度查询处方列表
      user_id:getUser().reservation_phone,
      page_no:1,
      page_size:2000,
      clinic_id:getUser().shop_no,
      registration_deal_id:getUser().deal_id,
      recipe_source:"3",
      compose:"1"
    }
    this.props.dispatch(getRecipelist(data));*/

  	/***********************************************************************/
  }
  componentDidMount(){
    let {patientInfo} = this.state;
    patientInfo.isShow = ((+getUser().patient_type & 0x800) == '2048')?true:false;
    this.setState({
      patientInfo
    });
    this.getUserInfo();
    this.getDefaultSetting();
    //是否为简易门诊
    if(/SimpleOutPatient/.test(this.props.location.pathname)){
      this.setState({
        isSimpleOutpatient:true,
      })
    }
    if(this.props.location.pathname.split('/').pop() == "binli"){
  		this.setState({
  			activeKey:"1"
  		})
  	}else if(this.props.location.pathname.split('/').pop() == "yipian"){
  		this.setState({
  			activeKey:"2"
  		})
  	}else if(this.props.location.pathname.split('/').pop() == "chenyao"){
  		this.setState({
  			activeKey:"3"
  		})
  	}else if(this.props.location.pathname.split('/').pop() == "jiancha"){
  		this.setState({
  			activeKey:"4"
  		})
  	}else if(this.props.location.pathname.split('/').pop() == "liliao"){
  		this.setState({
  			activeKey:"5"
  		})
  	}else if(this.props.location.pathname.split('/').pop() == "huizong"){
  		this.setState({
  			activeKey:"6"
  		})
  	}
    if(window.gst){
      window.addEventListener(window.gst.events.PRINT_END, function(e){
        if(this.static.printId == e.detail.printId){
          message.success(e.detail.result);
        }else{
          message.error(e.detail.result);
        }
      })
    }
  }
  componentWillUnmount(){
  }
  //获取默认设置
  getDefaultSetting(){
    this.props.dispatch(getsettingSystem({doctor_id:getUser().doctor_id},(json)=>{
      if(json.status == 0){
        if(json.data.treat_way == 0){
          //自动叫诊
          this.setState({isTreatWay:"0"});
        }else{
          // 手动叫诊
          this.setState({isTreatWay:"1"});
        }
      }else{
        message.error(json.message);
      }
    }))
  }
  //获取患者信息
  getUserInfo(){
    //  获取患者档案信息
    this.props.dispatch(fetchFileInfo({
      user_id : getUser().user_id,
      patient_id : getUser().patient_id,
      doctor_id : getUser().doctor_id,
    }, (json)=>{
      let {patientInfo} = this.state;
      if(json.data&&json.data.allergic_history){
        patientInfo.allergic_history = json.data.allergic_history;
        this.setState({
          patientInfo
        });
      }
    }));
  }
    //返回上一级
  renderBack(){
  	this.context.router.push("/consultsSquare");
  }

	onChange(activeKey){
		if(this.props.getclientdata.medic_check.length>0||activeKey == "1"){
			// if(activeKey.toString()=='6'){
	    //   //汇总加载数据
	    //   const data = {
	    //     query_type:1,//患者维度查询处方列表
	    //     // user_id:getUser().user_id,//Cookie.get('reservation_phone')||"",
	    //     user_id:getUser().reservation_phone,//Cookie.get('reservation_phone')||"",
	    //     page_no:1,
	    //     page_size:100,
	    //     registration_deal_id:getUser().deal_id,
	    //     recipe_source:"3",
	    //     compose:"0",
	    //   }
	    //   this.setState({
	    //     isLoading:true,
	    //   })
	    //   setTimeout(()=>{
	    //     this.props.dispatch(getRecipelistWithOutReduce(data,(json)=>{
	    //       //区分中药西药
	    //       if(json.status != "0"){
	    //         Modal.error({
	    //           content: json.message,
	    //         });
	    //       }else{
	    //         this.setState({
	    //           recipes:json.data.recipes,
	    //           isLoading:false,
	    //         })
	    //       }
	    //     }))
	    //   },3000)
	    // }
		}else{
      if(/SimpleOutPatient/.test(this.props.location.pathname)){
        this.context.router.push("/outPatient/SimpleOutPatient/binli");
      }else{
        this.context.router.push("/outPatient/seeDoctor/binli");
      }
      this.setState({
        activeKey:"1"
      })
      Modal.warning({
		    title: '病历诊断结果没有填写',
		    content: '请填写诊断结果',
		  });
      return false;
		}
    return true;
	}
  //计算总价格
  calcTotalPrice(){
    const {prescriptionInfo,zXPrescriptionInfo,recipelist} = this.props;
    let sum = 0;
    //中药饮片总价格计算
    for (let item in prescriptionInfo) {
      const count = this.calcPerTotalPrice(prescriptionInfo[item].items);
      if(count > 0){
        sum += count;
        this.static.flat1 = false;
      }
    }
    //中西成药总价格计算
    for (let item in zXPrescriptionInfo) {
      const count = this.calcPerTotalPrice(zXPrescriptionInfo[item].items);
      if(count > 0){
        sum += count;
        this.static.flat2 = false;
      }
    }
    let temData = this.props.checkRecipeList.concat();
	  for(let i=0;i<temData.length;i++){
	  	for(let j=0;j<temData[i].data.length;j++){
	  		let total_price = 0
	  		if(parseInt(temData[i].data[j].no)&&parseInt(temData[i].data[j].item_price))
		  		 total_price = parseInt(temData[i].data[j].no) * parseInt(temData[i].data[j].item_price)/10000;
		  	sum += total_price;
        this.static.flat3 = false;
	  	}
	  }
	  let temData2 = this.props.treatmentTemData.concat();
	  temData2.pop();
	  for(let i=0;i<temData2.length;i++){
	  	let total_price = 0;
	  	if(parseInt(temData2[i].item_amount)&&parseInt(temData2[i].item_price))
	  	 total_price = parseInt(temData2[i].item_amount) * parseInt(temData2[i].item_price)/10000
	  	// console.dir(total_price)
	  	sum += total_price;
      this.static.flat4 = false;
	  }
    if(recipelist.data&&recipelist.data.recipes&&recipelist.data.recipes.length>0){
      if (this.static.flat1) {//中药饮片
        const xlist = recipelist.data.recipes.filter((item)=>item.recipe_type == 3)
        for (let i = 0; i < xlist.length; i++) {
          sum += +xlist[i].total_price/10000;
        }
      }
      if (this.static.flat2) {//中西成药
        const zlist = recipelist.data.recipes.filter((item)=>item.recipe_type == 1)
        for (let i = 0; i < zlist.length; i++) {
          sum += +zlist[i].total_price/10000;
        }
      }
      if (this.static.flat3) {//检查检测
        const jlist = recipelist.data.recipes.filter((item)=>item.recipe_type == 5)
        for (let i = 0; i < jlist.length; i++) {
          sum += +jlist[i].total_price/10000;
        }
      }
      if (this.static.flat4) {//理疗
        const llist = recipelist.data.recipes.filter((item)=>item.recipe_type == 6)
        for (let i = 0; i < llist.length; i++) {
          sum += +llist[i].total_price/10000;
        }
      }
    }
	  // console.dir(sum)
    return +sum;
  }

  //计算总价格  中药西药每张处方的价格
  calcPerTotalPrice(data){
    const len = data.length;
    let sum = 0;
    for (var i = 0; i < data.length-1;i++) {
      let num = data[i].total_price ? data[i].total_price:0;
      sum += +num;
    }
    return +sum/10000;
  }

  misSeeDoctor(){
    if(this.static.clearTime){
      return;
    }
    this.static.clearTime = "1";
    setTimeout(()=>{this.static.clearTime=""},2000);
    this.setState({
      isMis:true,
    })
    const data = {
      doctor_id:getUser().mis_doc_id,
      deal_id:getUser().deal_id,
      user_id:getUser().patient_user_id,
      registration_no:getUser().patient_registration_no,
      reservation_deal_id:getUser().patient_reservation_deal_id,
    }
    this.props.dispatch(getCallMis(data,(json)=>{
      // this.setState({
      //   isMis:false,
      // })
      //清除患者信息
      clearPatientInfo();
      if(json.status == '0'){
        // this.context.router.push(`/outPatient`);
        window.location.href="/outPatient";
      }else{
        Modal.error({
          title:json.message,
          okText:'确定',
          onOk:()=>window.location.href="/outPatient"//this.context.router.push(`/outPatient`)
        });
      }
    }))
  }
  delaySeeDoctor(){
    if(this.static.clearTime){
      return;
    }
    this.static.clearTime = "1";
    setTimeout(()=>{this.static.clearTime=""},2000);
    this.setState({
      isDelete:true,
    })
    const data = {
      doctor_id:getUser().mis_doc_id,
      deal_id:getUser().deal_id,
      user_id:getUser().patient_user_id,
      registration_no:getUser().patient_registration_no,
      reservation_deal_id:getUser().patient_reservation_deal_id,
    }
    this.props.dispatch(getCallDelay(data,(json)=>{
      //清除患者信息
      clearPatientInfo();
      this.setState({
        isDelete:false,
      })
      if(json.status == '0'){
        window.location.href="/outPatient";
      }else{
        Modal.error({
          title:json.message,
          okText:'确定',
          onOk:()=>window.location.href="/outPatient"//this.context.router.push(`/outPatient`)
        });
      }
    }))
  }
  endSeeDoctor(){
		if(this.props.getclientdata.medic_check.length>0){
      this.handleClick({key:this.state.activeKey},()=>{
        //结束就诊
        if(this.state.isSimpleOutpatient){
          this.endSimpleSeeDoctorPost();
        }else{
          this.endSeeDoctorPost();
        }
      })
    }else{
    	Modal.warning({
		    title: '诊断结果没有填写',
		    content: '请填写诊断结果',
		  });
    }
  }
  //简易门诊结束就诊
  endSimpleSeeDoctorPost(){
    const diagnose = [];
  	this.props.getclientdata.medic_check.map(item=>{
  			diagnose.push(item.check_name)
  	})
    const simpleData = {
      deal_id:getUser().patient_reservation_deal_id,
      diagnose:diagnose.toString(),
      doctor_id:getUser().mis_doc_id,
      doctor_name:getUser().doctor_name,
      user_id:getUser().patient_user_id,
    }
    this.props.dispatch(registrationaftertreatment(simpleData,(json)=>{
      if(json.status == 0){
        window.location.href="/outPatient?tabIndex=3";
      }else{
        message.error(json.message);
      }
      this.props.dispatch(loadSave(false));
    }))
  }
  //结束就诊
  endSeeDoctorPost(){
    const diagnose = [];
  	this.props.getclientdata.medic_check.map(item=>{
  			diagnose.push(item.check_name)
  	})
    const data = {
      doctor_id:getUser().mis_doc_id,
      doctor_name:getUser().doctor_name,
      deal_id:getUser().deal_id,
      user_id:getUser().patient_user_id,
      registration_no:getUser().patient_registration_no,
      reservation_deal_id:getUser().patient_reservation_deal_id,
      diagnose:diagnose.toString()
    }
    if(data.registration_no == "undefined"){
      data.registration_no = "-1";
    }
    this.endSeeDoctorPostAction(data);
  }

  endSeeDoctorPostAction(data){
    this.props.dispatch(getCallEnd(data,(json)=>{
      if(json.status == 0){
        const jsonObj = Object.assign({data:[]},json)
        this.static.patientList=jsonObj.data;
        if(this.static.patientList&&this.static.patientList.length == 0){
          window.location.href="/outPatient";
        }
        if(this.state.isTreatWay == 1){
          //显示弹框
          // this.setState({
          //   finishVisible:true,
          // })
          window.location.href="/outPatient";
        }else{
          //不显示弹框
          // 下一个患者
          this.finishHandleOk();
        }
      }else{
        Modal.error({
          title:json.message,
          okText:'确定',
          onOk:()=>window.location.href="/outPatient",
        });
      }
      this.props.dispatch(loadSave(false));
    }));
  }


  //获取过敏史
  getCilnicalData(data){
		this.setState({
			patientInfo:{
        isShow:this.state.patientInfo.isShow,
        allergic_history:data
      }
		})

  }
  //下一个患者
  finishHandleOk(){
    this.setState({
      finishVisible:false,
    })
    if(this.static.patientList&&this.static.patientList.length > 0){
      //继续看诊
      const data = {
        doctor_id:getUser().mis_doc_id,
        user_id:this.static.patientList[0].user_id,
        patient_id:this.static.patientList[0].patient_id,
        schedule_id:this.static.patientList[0].schedule_id,
        registration_no:this.static.patientList[0].registration_no,
        reservation_deal_id:this.static.patientList[0].reservation_deal_id,
        deal_id:this.static.patientList[0].deal_id,
      }
      this.props.dispatch(getCallUp(data,(json)=>{
        if(json.status == 0){
          this.conSeeDoctor(this.static.patientList[0]);
        }else{
          Modal.error({
            title: "叫诊失败",
          });
        }
      }))
    }else{
      this.finishHandleCancel()
    }
  }
  //继续看诊
  conSeeDoctor(record){
    //清除患者信息
    clearPatientInfo();
    Cookie.set("patient_id", record.patient_id,{domain:'.gstzy.cn'});
    Cookie.set("deal_id", record.deal_id,{domain:'.gstzy.cn'});
    Cookie.set("patient_name", record.patient_name,{domain:'.gstzy.cn'});

    //处方接口需要的患者信息  从患者信息接口获取有可能对应不上
    Cookie.set("patient_age", getAgeByBirthday(record.patient_birth),{domain:'.gstzy.cn'});
    // Cookie.set("patient_birth", record.patient_birth,{domain:'.gstzy.cn'});
    Cookie.set("patient_image", record.patient_image,{domain:'.gstzy.cn'});
    Cookie.set("patient_sex", record.patient_sex,{domain:'.gstzy.cn'});
    Cookie.set("patient_type", record.property,{domain:'.gstzy.cn'});
    // Cookie.set("reservation_phone", record.reservation_phone,{domain:'.gstzy.cn'});
    Cookie.set("reservation_phone", record.user_id,{domain:'.gstzy.cn'});
    Cookie.set("patient_user_id", record.user_id,{domain:'.gstzy.cn'});
    Cookie.set("patient_schedule_id", record.schedule_id,{domain:'.gstzy.cn'});
    Cookie.set("patient_reservation_sort_id", record.reservation_sort_id,{domain:'.gstzy.cn'});
    Cookie.set("patient_reservation_deal_id", record.reservation_deal_id,{domain:'.gstzy.cn'});
    Cookie.set("patient_registration_no", record.registration_no,{domain:'.gstzy.cn'});
    // this.context.router.push("/outPatient/seeDoctor");
    //
    //
    //科别
    Cookie.set("department_name", record.department_name,{domain:'.gstzy.cn'});
    //费别
    Cookie.set("fee_discount_type", record.fee_discount_type,{domain:'.gstzy.cn'});
    if(/SimpleOutPatient/.test(this.props.location.pathname)){
      // this.context.router.push("/outPatient/SimpleOutPatient");
      window.location.href="/outPatient/SimpleOutPatient";
    }else{
      // this.context.router.push("/outPatient/seeDoctor");
      window.location.href='/outPatient/seeDoctor';
    }
  }
  //返回候诊列表
  finishHandleCancel(){
    this.setState({
      finishVisible:false,
    });
    // this.context.router.push(`/outPatient`);
    window.location.href="/outPatient";
  }
  handleClick(e,callback){
    if(this.static.clearTime){
      return;
    }
    this.static.clearTime = "1";
    setTimeout(()=>{this.static.clearTime=""},2000);
  	let path = this.props.location.pathname.split("/").pop();
  	if(path == "binli"){
      //判断是否有诊断
      if(this.onChange(e.key)){
        this.saveBinli((json)=>{
          this.linkRouter(e);
          if(typeof callback == "function"){
            callback()
          }
        });
      }
  	}else if(path == "yipian"){
      if(this.onChange(e.key)){
        this.saveYipian((json)=>{
          if(json.status == 0){
            this.linkRouter(e);
            if(typeof callback == "function"){
              callback()
            }
          }
        });
      }
  	}else if(path == "chenyao"){
      if(this.onChange(e.key)){
        this.saveChenyao((json)=>{
          if(json.status == 0){
            this.linkRouter(e);
            if(typeof callback == "function"){
              callback()
            }
          }
        });
      }
  	}else if(path == "jiancha"){
      if(this.onChange(e.key)){
        this.saveJianyan((json)=>{
          this.linkRouter(e);
          if(typeof callback == "function"){
            callback()
          }
        });
      }
  	}else if(path == "liliao"){
      if(this.onChange(e.key)){
        this.saveZhiliao((json)=>{
          this.linkRouter(e);
          if(typeof callback == "function"){
            callback()
          }
        });
      }
  	}else if(path == "huizong"){
      if(this.onChange(e.key)){
        this.linkRouter(e);
        if(typeof callback == "function"){
          callback()
        }
      }
  	}

  }

  linkRouter(e){
  	if(e.key == '1'){
      if(/SimpleOutPatient/.test(this.props.location.pathname)){
        this.context.router.push("/outPatient/SimpleOutPatient/binli");
      }else{
        this.context.router.push("/outPatient/seeDoctor/binli");
      }
  		this.setState({
  			activeKey:"1"
  		})
  	}else if(e.key == '2'){
      if(/SimpleOutPatient/.test(this.props.location.pathname)){
        this.context.router.push("/outPatient/SimpleOutPatient/yipian");
      }else{
        this.context.router.push("/outPatient/seeDoctor/yipian");
      }
  		this.setState({
  			activeKey:"2"
  		})
  	}else if(e.key == '3'){
      if(/SimpleOutPatient/.test(this.props.location.pathname)){
        this.context.router.push("/outPatient/SimpleOutPatient/chenyao");
      }else{
        this.context.router.push("/outPatient/seeDoctor/chenyao");
      }
  		this.setState({
  			activeKey:"3"
  		})
  	}else if(e.key == '4'){
      if(/SimpleOutPatient/.test(this.props.location.pathname)){
        this.context.router.push("/outPatient/SimpleOutPatient/jiancha");
      }else{
        this.context.router.push("/outPatient/seeDoctor/jiancha");
      }
  		this.setState({
  			activeKey:"4"
  		})
  	}else if(e.key == '5'){
      if(/SimpleOutPatient/.test(this.props.location.pathname)){
        this.context.router.push("/outPatient/SimpleOutPatient/liliao");
      }else{
        this.context.router.push("/outPatient/seeDoctor/liliao");
      }
  		this.setState({
  			activeKey:"5"
  		})
  	}else if(e.key == '6'){
      if(/SimpleOutPatient/.test(this.props.location.pathname)){
        this.context.router.push("/outPatient/SimpleOutPatient/huizong");
      }else{
        this.context.router.push("/outPatient/seeDoctor/huizong");
      }
  		this.setState({
  			activeKey:"6"
  		})
  	}
  }
  //病历保存
  saveBinli(callback=(json)=>{}){
  	if(this.props.getclientdata.record_id){
  		let data = Object.assign({},this.props.getclientdata,{
		  	clinic_id:getUser().shop_no,
		  	clinic_name:getUser().shop_name,
		  	deal_id:getUser().deal_id,
		  	doctor_id:getUser().doctor_id,
		  	doctor_name:getUser().doctor_name,
		  	opt_type:"2",
		  	patient_id:getUser().patient_id,
		  	patient_name:getUser().patient_name,
		  	show_opt:this.props.getclientdata.medical?this.props.getclientdata.medical.toString():"",
		  	temperature:(this.props.getclientdata.temperature*10).toString(),
		  	p_per:this.props.getclientdata.p_per.toString(),
		  	r_per:this.props.getclientdata.r_per.toString(),
		  	bp_up:this.props.getclientdata.bp_up.toString(),
		  	bp_down:this.props.getclientdata.bp_down.toString()
	  	})
	  	delete  data.medical ;
	  	this.props.dispatch(medicrecordSave(data,(res)=>{
	  		if(res.status.toString()=="0"){
	  			callback(res)
	  		}else{
	  			Modal.error({
				    title: '病历保存',
				    content: res.message,
				  });
	  		}
	  	}))
  	}else{
  		let data = Object.assign({},this.props.getclientdata,{
	  		clinic_id:getUser().shop_no,
	  		clinic_name:getUser().shop_name,
	  	  deal_id:getUser().deal_id,
	  		doctor_id:getUser().doctor_id,
	  		doctor_name:getUser().doctor_name,
	  	  opt_type:"1",
	  		patient_id:getUser().patient_id,
	  		patient_name:getUser().patient_name,
	  		show_opt:this.props.getclientdata.medical?this.props.getclientdata.medical.toString():"",
	  		temperature:(this.props.getclientdata.temperature*10).toString(),
		  	p_per:this.props.getclientdata.p_per.toString(),
		  	r_per:this.props.getclientdata.r_per.toString(),
		  	bp_up:this.props.getclientdata.bp_up.toString(),
		  	bp_down:this.props.getclientdata.bp_down.toString()
	  	})
	  	delete  data.medical ;
	  	this.props.dispatch(medicrecordSave(data,(res)=>{
	  		if(res.status.toString()=="0"){
		  		callback()
		  		this.props.dispatch(getClilentData({record_id:res.m_dwRecordId}))
	  		}else{
		  			Modal.error({
					    title: '病历保存',
					    content: res.message,
					  });
		  	}

	  	}))
  	}
  }

  saveYipian(callback=(json)=>{}){
    this.saveYipianPrescriptionInfo("1",callback);
  }
  //代煎
  calcProcessSum(sum,type){
    let price = 0;
    switch (type) {
      case "制散":{
        price = this.calcProcessPill(sum);
          break;
      }
      case "制丸":{
        price = this.calcProcessPill(sum);
          break;
      }
      case "制膏":{
        price = this.calcProcessPaste(sum);
        break;
      }
      default:{
        price = 0;
      }
    }
    return price;
  }
  //制散  制丸
  calcProcessPill(sum){
    if(sum==0){
      return 0;
    }else if(sum <= 100){
      return 500000;
    }
    return (500000 + (sum - 100) * 600);
  }
  // 制膏
  calcProcessPaste(sum){
    const curDate = new Date();
    const brithDate = new Date(getUser().patient_birth);
    if(sum==0){
      return 0;
    }else if(curDate.getYear() - brithDate.getYear() > 14){
      return 4000000;
    }else if(curDate.getMonth() < brithDate.getMonth()){
      return 3000000;
    }else if(curDate.getDay() < brithDate.getDay()){
      return 3000000;
    }
    return 4000000;
  }
  //计算总价格
  calcYipianTotalPrice(data){
    const len = data.length;
    let sum = 0;
    for (var i = 0; i < data.length-1;i++) {
      let num = data[i].total_price ? data[i].total_price:0;
      sum += +num;
    }
    return sum+"";
  }
  //保存处方
  saveYipianPrescriptionInfo(endSeeDoctor,callback){
    const {prescriptionInfo,recipelist} = this.props;
    //判断处方是否关联医生
    if(this.state.isSimpleOutpatient){
      let recipeIndex = 1;
      for (let item in prescriptionInfo) {
        if(
          (prescriptionInfo[item].achievements_type == RELATIONRECIPE.PATIENT)||
          (prescriptionInfo[item].achievements_type == RELATIONRECIPE.DOCTOR&&
            !!prescriptionInfo[item].achievements_name &&
            !!prescriptionInfo[item].achievements_rel)||
          (prescriptionInfo[item].achievements_type == RELATIONRECIPE.RAREMEDICINAL&&
            !!prescriptionInfo[item].achievements_name &&
            !!prescriptionInfo[item].achievements_rel
          )
        ){}else{
          if(prescriptionInfo[item].items.length > 1){
            message.error(`中药饮片处方${recipeIndex}没有填写关联信息，请补充完整后保存提交`);
            return;
          }
        }
        recipeIndex++;
      }
    }
    //判断是否
    let list = [];
    //存在处方金额为零的处方
    let emptyList = [];
    let recipeEmptyIndex=1;
    //判断是否存在处方
    let preFlat = true;
    for (var variable in prescriptionInfo) {
      //计算代煎费用
      let process_sum = 0;
      for (let k = 0; k < prescriptionInfo[variable].items.length; k++) {
        // if(prescriptionInfo[variable].items[k].status != 2){
        if(prescriptionInfo[variable].items[k].status != 2 && /^01/.test(prescriptionInfo[variable].items[k].item_code)){
          // process_sum += +prescriptionInfo[variable].items[k].total_amount;
          process_sum += mul(+prescriptionInfo[variable].items[k].item_amount , prescriptionInfo[variable].quantity);
        }
      }
      //判断处方药品金额
      for (var kk = 0; kk < prescriptionInfo[variable].items.length-1; kk++) {
        if(/01/.test(prescriptionInfo[variable].items[kk].item_code)){
          if(+prescriptionInfo[variable].items[kk].item_amount * +prescriptionInfo[variable].items[kk].item_price == 0){
            emptyList.push('处方'+recipeEmptyIndex);
            break;
          }
        }
      }
      recipeEmptyIndex++;
      let item = {
        //从候诊列表获取患者信息
        registration_deal_id:getUser().deal_id,//Cookie.get('deal_id')||"",
        family_id:getUser().patient_id,//Cookie.get('patient_id')||"",
        family_name:getUser().patient_name,//Cookie.get('patient_name')||"",
        family_age:getUser().patient_age,//Cookie.get('patient_age')||"",
        family_phone:getUser().patient_user_id,//Cookie.get('patient_user_id')||"",
        family_sex:getUser().patient_sex,//Cookie.get('patient_sex')||"",
        // user_id:getUser().user_id,//Cookie.get('reservation_phone')||"",
        user_id:getUser().reservation_phone,//Cookie.get('reservation_phone')||"",
        doctor_name:getUser().doctor_name,
        doctor_id:getUser().doctor_id,
        items:prescriptionInfo[variable].items.slice(0,-1),
        shop_name:getUser().shop_name,
        shop_no:getUser().shop_no,
        process_desc:prescriptionInfo[variable].process_desc+"",
        process_price:this.calcProcessSum(process_sum,prescriptionInfo[variable].process_desc+"") + "",
        process_type:prescriptionInfo[variable].process_type+"",
        quantity:prescriptionInfo[variable].quantity+"",
        taking_desc:prescriptionInfo[variable].taking_desc+"",
        taking_id:prescriptionInfo[variable].taking_id+"",
        total_price:this.calcYipianTotalPrice(prescriptionInfo[variable].items)+"",
        usage_amount_desc:prescriptionInfo[variable].usage_amount_desc+"",
        usage_desc:prescriptionInfo[variable].usage_desc+"",
        usage_id:prescriptionInfo[variable].usage_id+"",
        recipe_type:YINPIAN,//中药饮片
        is_precious:'0',//是否贵系
        recipe_source:RECIPESOURCE,//1：HIS 2：拍照处方 处方来源
        compose:'1',
        // his_recipe_id:Math.random()*100000+"",//his 处方id没有  待后台解决
        achievements_type:prescriptionInfo[variable].achievements_type,
        achievements_name:prescriptionInfo[variable].achievements_name,
        achievements_rel:prescriptionInfo[variable].achievements_rel,
      }
      if(!!prescriptionInfo[variable].cloud_recipe_id&&+prescriptionInfo[variable].cloud_recipe_id > 10){
        item.cloud_recipe_id = prescriptionInfo[variable].cloud_recipe_id;
        item.opt_type = '1';
      }else{
        item.opt_type = '0';
      }
      if(!item.process_type){
        item.process_type="0";
      }
      if(item.items.length > 0){
        preFlat = false;
        list.push(item);
      }
    }
    if(emptyList.length>0){
      //保存按钮
      message.error("中药饮片"+emptyList.join(',')+"存在金额为零的药品，不能保存处方",5);
      return;
    }
    if(preFlat){
      for (var variable in prescriptionInfo) {
        if(!!prescriptionInfo[variable].cloud_recipe_id&&+prescriptionInfo[variable].cloud_recipe_id > 10){
          //删除处方
          const delData = {
            cloud_recipe_id:prescriptionInfo[variable].cloud_recipe_id,
            operator_desc:getUser().doctor_name,
            operator_id:getUser().doctor_id,
            registration_deal_id:getUser().deal_id,//挂号ID
            recipe_source:RECIPESOURCE,
            compose:'1',
          }
          this.props.dispatch(deleteRecipeDetail(delData,(json)=>{
            if(+json.status == 0){
              callback(json);
            }else{
              // message.error(json.message);
            }
          }))
        }else{
          callback({status:'0'});
        }
      }
      return;
    }
    const data = {
      operator_desc:getUser().doctor_name,
      operator_id:getUser().doctor_id,
      recipes:list
    }
    this.props.dispatch(postAddrecipelist(data,(json)=>{
      if(json.status == "0"){
        //更新处方
        // this.refreshRecipe();
        let recipeIndex = 0;
        for (let recipe in prescriptionInfo) {
          const recipe_data = {
            name:recipe,
            [recipe]:{
              cloud_recipe_id:json.data.recipes[recipeIndex].cloud_recipe_id,
            }
          }
          this.props.dispatch(zYMedicineInfo(recipe_data));
          recipeIndex++;
        }
        //保存成功
        callback(json);
      }else{
        message.error(json.message);
      }
    }))
  }

  //保存处方
  saveChenyaoPrescriptionInfo(endSeeDoctor,callback){
    const {zXPrescriptionInfo,recipelist} = this.props;
    //判断处方是否关联医生
    if(this.state.isSimpleOutpatient){
      let recipeIndex = 1;
      for (let item in zXPrescriptionInfo) {
        if(
          (zXPrescriptionInfo[item].achievements_type == RELATIONRECIPE.PATIENT)||
          (zXPrescriptionInfo[item].achievements_type == RELATIONRECIPE.DOCTOR&&
            !!zXPrescriptionInfo[item].achievements_name &&
            !!zXPrescriptionInfo[item].achievements_rel)||
          (zXPrescriptionInfo[item].achievements_type == RELATIONRECIPE.RAREMEDICINAL&&
            !!zXPrescriptionInfo[item].achievements_name &&
            !!zXPrescriptionInfo[item].achievements_rel
          )
        ){}else{
          if(zXPrescriptionInfo[item].items.length > 1){
            message.error(`中西成药处方${recipeIndex}没有填写关联信息，请补充完整后保存提交`);
            return;
          }
        }
        recipeIndex++;
      }
    }
    //判断是否
    let list = [];
    //存在处方金额为零的处方
    let emptyList = [];
    let recipeEmptyIndex=1;
    //判断是否存在处方
    let preFlat = true;
    for (var variable in zXPrescriptionInfo) {
      //判断处方药品金额
      for (var kk = 0; kk < zXPrescriptionInfo[variable].items.length-1; kk++) {
        if(+zXPrescriptionInfo[variable].items[kk].item_amount * +zXPrescriptionInfo[variable].items[kk].item_price == 0){
          emptyList.push('处方'+recipeEmptyIndex);
          break;
        }
      }
      recipeEmptyIndex++;
      const item = {
        //从候诊列表获取患者信息
        registration_deal_id:Cookie.get('deal_id')||"",
        family_id:Cookie.get('patient_id')||"",
        family_name:Cookie.get('patient_name')||"",
        family_age:Cookie.get('patient_age')||"",
        family_phone:Cookie.get('patient_user_id')||"",
        family_sex:Cookie.get('patient_sex')||"",
        user_id:Cookie.get('reservation_phone')||"",
        doctor_name:getUser().doctor_name,
        doctor_id:getUser().doctor_id,
        items:zXPrescriptionInfo[variable].items.slice(0,-1),
        shop_name:getUser().shop_name,
        shop_no:getUser().shop_no,
        process_desc:zXPrescriptionInfo[variable].process_desc+"",
        process_type:zXPrescriptionInfo[variable].process_type+"",
        quantity:zXPrescriptionInfo[variable].quantity+"",
        taking_desc:zXPrescriptionInfo[variable].taking_desc+"",
        taking_id:zXPrescriptionInfo[variable].taking_id+"",
        total_price:this.calcYipianTotalPrice(zXPrescriptionInfo[variable].items)+"",
        usage_amount_desc:zXPrescriptionInfo[variable].usage_amount_desc+"",
        usage_desc:zXPrescriptionInfo[variable].usage_desc+"",
        usage_id:zXPrescriptionInfo[variable].usage_id+"",
        recipe_type:ZXMEDICINE,//中西成药
        is_precious:'0',//是否贵系
        recipe_source:RECIPESOURCE,//1：HIS 2：拍照处方 处方来源
        compose:'1',
        // his_recipe_id:Math.random()*100000+"",//his 处方id没有  待后台解决
        achievements_type:zXPrescriptionInfo[variable].achievements_type,
        achievements_name:zXPrescriptionInfo[variable].achievements_name,
        achievements_rel:zXPrescriptionInfo[variable].achievements_rel,
      }
      if(!!zXPrescriptionInfo[variable].cloud_recipe_id&&+zXPrescriptionInfo[variable].cloud_recipe_id > 10){
        item.cloud_recipe_id = zXPrescriptionInfo[variable].cloud_recipe_id;
        item.opt_type = '1';
      }else{
        item.opt_type = '0';
      }
      if(!item.process_type){
        item.process_type="0";
      }
      if(item.items.length > 0){
        preFlat = false;
        list.push(item);
      }
    }
    if(emptyList.length>0){
      //保存按钮
      message.error("中西成药"+emptyList.join(',')+"存在金额为零的药品，不能保存处方",5);
      return;
    }
    if(preFlat){
      for (var variable in zXPrescriptionInfo) {
        if(!!zXPrescriptionInfo[variable].cloud_recipe_id&&+zXPrescriptionInfo[variable].cloud_recipe_id > 10){
          //删除处方
          const delData = {
            cloud_recipe_id:zXPrescriptionInfo[variable].cloud_recipe_id,
            operator_desc:getUser().doctor_name,
            operator_id:getUser().doctor_id,
            registration_deal_id:getUser().deal_id,//挂号ID
            recipe_source:RECIPESOURCE,
            compose:'1',
          }
          this.props.dispatch(deleteRecipeDetail(delData,(json)=>{
            if(+json.status == 0){
              callback(json);
            }else{
              // message.error(json.message);
            }
          }))
        }else{
          callback({status:'0'});
        }
      }
      return;
    }
    const data = {
      operator_desc:getUser().doctor_name,
      operator_id:getUser().doctor_id,
      recipes:list
    }
    this.props.dispatch(postAddrecipelist(data,(json)=>{
      if(json.status == "0"){
        callback(json);
      }else{
        message.error(json.message);
      }
    }))
  }

  saveChenyao(callback=(json)=>{}){
    this.saveChenyaoPrescriptionInfo('1',callback);
  }


  //检验检查保存
  saveJianyan(callback=(json)=>{}){
  	let temData = this.props.checkRecipeList.concat();
  	let updataData = temData.filter(item=>item.cloud_recipe_id);
  	let saveData = temData.filter(item=>!item.cloud_recipe_id);
	  for(let i=0;i<updataData.length;i++){
	  	let price_all = 0 ;
	  	for(let j=0;j<updataData[i].data.length;j++){
	  		let total_amount =  parseInt(updataData[i].data[j].item_amount);
		  	let total_price = parseInt(updataData[i].data[j].no) * parseInt(updataData[i].data[j].item_price)
		  	updataData[i].data[j] = Object.assign({},updataData[i].data[j],
		  																{item_type:'0'},
		  																{item_unit:updataData[i].data[j].presciption_units},
		  																{item_amount:updataData[i].data[j].no.toString()},
		  																{item_price:updataData[i].data[j].item_price.toString()},
		  																{total_amount:updataData[i].data[j].no.toString()},
		  																{total_price:total_price.toString()})
		  	price_all += total_price;

	  	}
	  	updataData[i].items = updataData[i].data.filter(d=>d.check==true);
	  	updataData[i] = Object.assign({},updataData[i],{
	  		doctor_id:getUser().doctor_id,
	  		doctor_name:getUser().doctor_name,
	  		// his_recipe_id:(Math.random(1)*10000).toString(),
	  		family_age:getUser().patient_age,
	  		family_id:getUser().patient_id,
	  		family_name:getUser().patient_name,
	  		family_phone:getUser().reservation_phone,
	  		family_sex:getUser().patient_sex,
	  		recipe_type:"5",
	  		shop_name:getUser().shop_name,
	  		shop_no:getUser().shop_no,
	  		user_id:getUser().reservation_phone,
	  		registration_deal_id:getUser().deal_id,
	  		is_precious:'0',
	  		process_type:"0",
	  		quantity:"0",
	  		total_price:price_all.toString(),
	  		recipe_source:"3",
	  		opt_type:"1"

	  	})
	  	delete updataData[i].data
	  }
	  for(let i=0;i<saveData.length;i++){
	  	let price_all = 0 ;
	  	for(let j=0;j<saveData[i].data.length;j++){
	  		let total_amount =  parseInt(saveData[i].data[j].item_amount);
		  	let total_price = parseInt(saveData[i].data[j].no) * parseInt(saveData[i].data[j].item_price)
		  	saveData[i].data[j] = Object.assign({},saveData[i].data[j],
		  																{item_type:'0'},
		  																{item_unit:saveData[i].data[j].presciption_units},
		  																{item_amount:saveData[i].data[j].no.toString()},
		  																{item_price:saveData[i].data[j].item_price.toString()},
		  																{total_amount:saveData[i].data[j].no.toString()},
		  																{total_price:total_price.toString()})
		  	price_all += total_price;

	  	}
	  	saveData[i].items = saveData[i].data.filter(d=>d.check==true);
	  	saveData[i] = Object.assign({},saveData[i],{
	  		doctor_id:getUser().doctor_id,
	  		doctor_name:getUser().doctor_name,
	  		// his_recipe_id:(Math.random(1)*10000).toString(),
	  		family_age:getUser().patient_age,
	  		family_id:getUser().patient_id,
	  		family_name:getUser().patient_name,
	  		family_phone:getUser().reservation_phone,
	  		family_sex:getUser().patient_sex,
	  		recipe_type:"5",
	  		shop_name:getUser().shop_name,
	  		shop_no:getUser().shop_no,
	  		user_id:getUser().reservation_phone,
	  		registration_deal_id:getUser().deal_id,
	  		is_precious:'0',
	  		process_type:"0",
	  		quantity:"0",
	  		total_price:price_all.toString(),
	  		recipe_source:"3",
	  		opt_type:"0"

	  	})
	  	delete saveData[i].data
	  }
		this.ajaxData(saveData,callback);
		this.ajaxData(updataData,callback);

  }
  //检验检查ajax
  ajaxData(data,callback){
  	if(data.filter(item_t => item_t.items.length>0).length==0){
			callback();
      return;

		}
	  const postData = {
	  	operator_desc:getUser().doctor_name,
	  	operator_id:getUser().doctor_id,
	  	recipes:data.filter(item_t => item_t.items.length>0)
	  }

	  this.props.dispatch(postAddrecipelist(postData,(res)=>{
	  	if(res.status == '0'){
				callback(res)
	  	}else{
	  		Modal.error({
				  title: '校验检查',
				  content: '保存失败',
				});
	  	}

	  }))
  }
  //治疗理疗保存
  saveZhiliao(callback=(json)=>{}){
  	let temData = this.props.treatmentTemData.concat();
	  temData.pop();
	  let temL =  temData.filter(item => item.cloud_recipe_id);
		if(temData.length==0 || temData.length==0){
		  callback();
		  return ;
		}
	  if(temL.length>0){
	  	let price_all = 0 ;
		  for(let i=0;i<temData.length;i++){
		  		let total_amount =  parseInt(temData[i].item_amount)
		  		let total_price = parseInt(temData[i].item_amount) * parseInt(temData[i].item_price)
		  		temData[i] = Object.assign({},temData[i],
		  																{item_type:'0'},
		  																{item_price:temData[i].item_price.toString()},
		  																{total_amount:total_amount.toString()},
		  																{total_price:total_price.toString()},
		  																{item_amount:temData[i].item_amount.toString()}
		  																)
		  		price_all += total_price;
		  }

		  const postData = {
		  	operator_desc:getUser().doctor_name,
		  	operator_id:getUser().doctor_id,
		  	recipes:[{
		  			doctor_id:getUser().doctor_id,
		  			doctor_name:getUser().doctor_name,
		  			// his_recipe_id:(Math.random(1)*10000).toString(),
		  			family_age:getUser().patient_age,
		  			family_id:getUser().patient_id,
		  			family_name:getUser().patient_name,
		  			family_phone:getUser().reservation_phone,
		  			family_sex:getUser().patient_sex,
		  			items:temData,
		  			recipe_type:"6",
		  			shop_name:getUser().shop_name,
		  			shop_no:getUser().shop_no,
		  			user_id:getUser().reservation_phone,
		  			registration_deal_id:getUser().deal_id,
		  			is_precious:'0',
		  			process_type:"0",
		  			quantity:"0",
		  			total_price:price_all.toString(),
		  			recipe_source:"3",
		  			opt_type:"1",
		  			cloud_recipe_id:temL[0].cloud_recipe_id
		  	}]
		  }
		  this.props.dispatch(postAddrecipelist(postData,(res)=>{
		  	if(res.status == '0'){
					callback(res)
		  	}else{
		  		Modal.error({
					  title: '治疗理疗',
					  content: '保存失败',
					});
		  	}

		  }))
	  }else{
	  	let price_all = 0 ;
		  for(let i=0;i<temData.length;i++){
		  		let total_amount =  parseInt(temData[i].item_amount)
		  		let total_price = parseInt(temData[i].item_amount) * parseInt(temData[i].item_price)
		  		temData[i] = Object.assign({},temData[i],
		  																{item_type:'0'},
		  																{item_price:temData[i].item_price.toString()},
		  																{total_amount:total_amount.toString()},
		  																{total_price:total_price.toString()},
		  																{item_amount:temData[i].item_amount.toString()}
		  																)
		  		price_all += total_price;
		  }

		  const postData = {
		  	operator_desc:getUser().doctor_name,
		  	operator_id:getUser().doctor_id,
		  	recipes:[{
		  			doctor_id:getUser().doctor_id,
		  			doctor_name:getUser().doctor_name,
		  			// his_recipe_id:(Math.random(1)*10000).toString(),
		  			family_age:getUser().patient_age,
		  			family_id:getUser().patient_id,
		  			family_name:getUser().patient_name,
		  			family_phone:getUser().reservation_phone,
		  			family_sex:getUser().patient_sex,
		  			items:temData,
		  			recipe_type:"6",
		  			shop_name:getUser().shop_name,
		  			shop_no:getUser().shop_no,
		  			user_id:getUser().reservation_phone,
		  			registration_deal_id:getUser().deal_id,
		  			is_precious:'0',
		  			process_type:"0",
		  			quantity:"0",
		  			total_price:price_all.toString(),
		  			recipe_source:"3",
		  			opt_type:"0"
		  	}]
		  }
		  this.props.dispatch(postAddrecipelist(postData,(res)=>{
		  	if(res.status == '0'){
					callback(res)
		  	}else{
		  		Modal.error({
					  title: '治疗理疗',
					  content: '保存失败',
					});
		  	}

		  }))
	  }


  }
  printPlate(){
    const GST = window.gst ? window.gst : {};
    const {printer, printInfo} =  GST;
    message.success('开始打印');
    if(printer){
      printer.printWeb(document.getElementById("testPrint").innerHTML, printInfo.recipe,(printId)=>{
        this.static.printId = printId;
      });
    }
  }
  render(){
  	//console.dir(this.props.zxDiagnose)
    const patient = {
      headerImg:getUser().patient_image,
      name:getUser().patient_name,
      sex:getUser().patient_sex,
      age:getUser().patient_age,
      diagnose:getUser().patient_type,
    }
    const {prescriptionInfo,zXPrescriptionInfo,treatmentTemData,checkRecipeList} = this.props;
    let totalPrice = this.calcTotalPrice();
    // for (var variable in prescriptionInfo) {
    //   totalPrice+=this.calcTotalPrice()
    // }
    return(
      <div className="see-doctor">
        <div>
          <Row className="patient-info" type="flex" justify="space-around" align="middle">
            <Col span={10} className="patien-info-left">
            	<PatientInfoItem {...patient}/>
            </Col>

            <Col className="patient-buts" span={12}>
              {
              	this.props.location.pathname.split("/").pop()=="binli"&&!this.state.isSimpleOutpatient?(
              		<span style={{"float":"left"}}>
              			<Button loading={this.state.isMis} onClick={this.misSeeDoctor.bind(this)} className="button-orange">延迟看诊</Button>
              			{/* <Button loading={this.state.isDelete} onClick={this.delaySeeDoctor.bind(this)} className="button-green">延迟看诊</Button> */}
              		</span>):""
              }
              <Button onClick={this.printPlate.bind(this)} className="button-green">打印</Button>
              <Button onClick={this.endSeeDoctor.bind(this)} className="button-red">结束就诊</Button>

            </Col>
          </Row>
          {
            !!this.props.getclientdata.all_his&&this.props.location.pathname.split("/").pop()!="binli"?(
              <Row className="patient-allergy">
                <Col span={12} className="allergy-history"><span className="allergy-title">过敏史：</span><span>{this.props.getclientdata.all_his}</span></Col>
              </Row>
            ):""
          }
          <div style={{"marginTop": "10px"}}>
          	<Menu
			        onClick={this.handleClick.bind(this)}
			        selectedKeys={[this.state.activeKey]}
			        mode="horizontal"
			      >
			        <Menu.Item key="1">
			          <Icon type="solution" />病历
			        </Menu.Item>
			        <Menu.Item key="2" >
			          <Icon type="appstore" />中药饮片
			        </Menu.Item>
			        <Menu.Item key="3" >
			          <Icon type="appstore" />中西成药
			        </Menu.Item>
			        <Menu.Item key="4" >
			          <Icon type="appstore" />检验检查
			        </Menu.Item>
			        <Menu.Item key="5" >
			          <Icon type="appstore" />治疗理疗
			        </Menu.Item>
			        <Menu.Item key="6" >
			          <Icon type="appstore" />汇总
			        </Menu.Item>
			      </Menu>
			    </div>
          <div className="card-container">
          	{this.props.children}

          </div>

        </div>
        {
          this.props.location.pathname.split("/").pop()!="binli"?(<Row className="cost-all">
            <Col span={18}><span>本次累计开方总额：<span className="total-price">{totalPrice.toFixed(2)}</span>元</span></Col>
          </Row>):''
        }
        <div>
          <Modal
            visible={this.state.finishVisible}
            title="温馨提醒"
            onOk={this.finishHandleOk.bind(this)}
            onCancel={this.finishHandleCancel.bind(this)}
            footer={[
              <Button key="back" size="large" onClick={this.finishHandleCancel.bind(this)}>返回候诊</Button>,
              <Button disabled={this.static.patientList.length==0} key="submit" type="primary" size="large" onClick={this.finishHandleOk.bind(this)}>
                下一个患者
              </Button>,
            ]}
          >
            <span>是否看诊下一个患者？</span>
          </Modal>
        </div>
        <div style={{"display":"none"}} id="testPrint"><PrintAll {...this.props.getclientdata} checkRecipeList={checkRecipeList} treatmentTemData={treatmentTemData} prescriptionInfo={prescriptionInfo} zXPrescriptionInfo={zXPrescriptionInfo}/></div>
      </div>
    );
  }
}
SeeDoctor.contextTypes={
  router: React.PropTypes.object.isRequired
};
SeeDoctor.propTypes = {
};
function mapStateToProps(state){
  return {
    prescriptionInfo:state.prescriptionInfo,
    zXPrescriptionInfo:state.zXPrescriptionInfo,
    checkRecipeList:state.checkRecipeList,
    treatmentTemData:state.treatmentTemData,
    zxDiagnose:state.zxDiagnose,
    recipelist:state.recipelist,
    getclientdata:state.getclientdata
  }
}
export default connect(mapStateToProps)(SeeDoctor)
