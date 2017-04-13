/*
 * 门诊
 */

import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import { Button ,Tabs,Table,Row,Col,DatePicker,Tag,Modal,message} from 'antd';
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import {getUrlPara,getAgeByBirthday} from "../utils/tools";
import {getUser} from "../utils/User";
import {convertTimeToStr,convertStrToStamp,objToUrlString} from "../utils/tools";
import {getCallList,getCallUp,getCallMis,getCallEnd,postTemporaryList,postTemporaryFinishList,postRegisTrationContinueTreatment,phpPostRegisTrationContinueTreatment} from "../store/actions/OutPatientDepartment";
import Cookie from "js-cookie";
import {medicrecordList,registrationintreatment,registrationcontinuetreatment} from "../store/actions/CiteManage";
import {host} from "../store/actions/hostConf";


const TAB = {
  FIRST:"1",
  SECOND:"2",
  THIRD:"3",
}

class OutpatientDepartment extends Component {
  constructor(props){
    super(props);
    this.state={
			arriveLoading:false,//预约已到是否加载
      noArriveLoading:false,//预约未到是否加载
      hasClinicalLoading:false,//已诊是否加载
      jianyi:true, //是否是简易门诊
      simpleOutpatientList:[],
      simpleOutpatientEndList:[],
    }
    this.static = {
      mis_doc_id:'',
      selectTime:convertTimeToStr(new Date(),"yyyy-MM-dd")+' 00:00',
      clearTime:'',
      intervalTime:'',
      activeTab:'1',
    }
    const {tabIndex} = this.props.location.query;
    if(tabIndex){
      this.static.activeTab = tabIndex;
    }
  }
  componentWillMount(){
  }
  componentWillUnmount(){
    clearInterval(this.static.intervalTime);
  }
  componentDidMount(){
    this.static.mis_doc_id = getUser().mis_doc_id;
    this.static.selectTime = convertTimeToStr(new Date(),"yyyy-MM-dd")+' 00:00';
    this.onDateChangeTwo(this.static.selectTime);
    //定时刷新列表
    this.static.intervalTime = setInterval(()=>{
      this.onDateChangeTwo(this.static.selectTime);
    },100000);

  }

  //拉去简易门诊数据
  getSimpleOutpatient(date){
    const medicrecord = {
      reservation_start_time:date.getTime()/1000+'', //convertStrToStamp(convertTimeToStr(date,"yyyy-MM-dd"))/1000+"",
      reservation_end_time:date.getTime()/1000+24*60*60+'', //convertStrToStamp(convertTimeToStr(date,"yyyy-MM-dd"))/1000+24*60*60+"",
      after_treatment:'1',
      get_no:'2',
  		// method:'1',
  		deal_type:"3",
      clinic_id:getUser().shop_no,
      doctor_id:getUser().mis_doc_id,
      page_no:'1',
      page_size:'200',
      fast_registration:"2",
  	}
  	this.props.dispatch(postTemporaryList(medicrecord,(res)=>{
  		if(res.status.toString()=="0"){
        if(res.id_list&&res.id_list.length>0){
          this.setState({
            simpleOutpatientList:[...res.id_list]
            // simpleOutpatientEndList
          })
        }
  		}else{
        this.setState({
          simpleOutpatientList:[]
          // simpleOutpatientEndList
        })
      }
  	}))
    const medicrecordEnd = {
      reservation_start_time:date.getTime()/1000+'', //convertStrToStamp(convertTimeToStr(date,"yyyy-MM-dd"))/1000+"",
      reservation_end_time:date.getTime()/1000+24*60*60+'', //convertStrToStamp(convertTimeToStr(date,"yyyy-MM-dd"))/1000+24*60*60+"",
      after_treatment:'2',
      get_no:'2',
  		// method:'1',
  		deal_type:"3",
      clinic_id:getUser().shop_no,
      doctor_id:getUser().mis_doc_id,
      page_no:'1',
      page_size:'200',
      fast_registration:"2",
  	}
  	this.props.dispatch(postTemporaryList(medicrecordEnd,(res)=>{
  		if(res.status.toString()=="0"){
        if(res.id_list&&res.id_list.length>0){
          this.setState({
            simpleOutpatientEndList:[...res.id_list]
          })
        }
  		}else{
        this.setState({
          simpleOutpatientEndList:[]
        })
      }
  	}))
  }

  // //拉取数据
  // loadData(){
  //   this.static.mis_doc_id = getUser().mis_doc_id;
  //   this.setState({
  //     arriveLoading:true,//预约已到是否加载
  //   })
  //   this.props.dispatch(getCallList({doctor_id:this.static.mis_doc_id},(json)=>{
  //     this.setState({
  //       arriveLoading:false,//预约已到是否加载
  //     })
  //   }));
  //   this.getRegistrationList(this.static.selectTime);
  // }
  //获取预约未到，已诊列表
  getRegistrationList(date){

    const data = {
      reservation_start_time:date.getTime()/1000+'', //convertStrToStamp(convertTimeToStr(date,"yyyy-MM-dd"))/1000+"",
      reservation_end_time:date.getTime()/1000+24*60*60+'', //convertStrToStamp(convertTimeToStr(date,"yyyy-MM-dd"))/1000+24*60*60+"",
      deal_type:'3',//订单类型
      doctor_id:this.static.mis_doc_id,//"10000311122",
      get_no:"1",
      after_treatment:"1",
      order:"2",
      page_no:'1',
      page_size:'200',
      fast_registration:"1",
    }
    this.setState({
      noArriveLoading:true,//预约未到是否加载
    })
    if(this.static.activeTab == TAB.FIRST){
      //预约未到
      this.props.dispatch(postTemporaryList(data,(json)=>{
        this.setState({
          noArriveLoading:false,//预约已到是否加载
        })
      }));
    }

    data.get_no="2";
    data.after_treatment="2";
    data.order = "1";
    data.fast_registration = "1";
    this.setState({
      hasClinicalLoading:true,//已诊是否加载
    })
    if(this.static.activeTab == TAB.SECOND){
      //已诊
      this.props.dispatch(postTemporaryFinishList(data,(json)=>{
        this.setState({
          hasClinicalLoading:false,//预约已到是否加载
        })
      }));
    }
  }
    //返回上一级
  renderBack(){
  	this.context.router.push("/consultsSquare");
  }
  callback(key) {
    this.static.activeTab = key;
    this.onDateChangeTwo(this.static.selectTime);
  }
  strForState(type){
    switch (type) {
      case 1:{
        return {name:"候诊",className:'tab-waiting'};
      }
      case 23:{
        return {name:"候诊",className:'tab-waiting'};
      }
        break;
      case 2:{
        return {name:"应诊",className:'tab-consultation'};
      }
      case 24:{
        return {name:"应诊",className:'tab-consultation'};
      }
        break;
      case 4:{
        return {name:"过诊",className:'tab-lose'};
      }
      case 8:{
        return {name:"延迟",className:'tab-lose'};
      }
        break;
      case "3":{
        return {name:"诊结",className:'tab-finish'};
      }
      case 25:{
        return {name:"诊结",className:'tab-finish'};
      }
        break;
      default:
    }
    return {name:"应诊",className:'tab-consultation'};
  }
  strForState2(type){
    switch (type) {
      case 2048:{
        return "初诊";
      }
        break;
      default:
    }
    return "复诊";
  }
  stateButtonClick(){
    // console.log('click button');
  }
  //叫诊
  seeDoctor(record){
    if(this.static.clearTime){
      return;
    }
    this.static.clearTime = "1";
    setTimeout(()=>{this.static.clearTime=""},1000);
    const data = {
      doctor_id:this.static.mis_doc_id,
      user_id:record.user_id,
      patient_id:record.patient_id,
      schedule_id:record.schedule_id,
      registration_no:record.registration_no,
      reservation_deal_id:record.reservation_deal_id,
      deal_id:record.deal_id,
    }
    this.props.dispatch(getCallUp(data,(json)=>{
      if(json.status == 0){
        this.conSeeDoctor(record);
      }else{
        Modal.error({
          title: "叫诊失败",
        });
      }
    }))
    // this.conSeeDoctor(record);
  }
  //开方
  prescription(record){
  	if(this.static.clearTime){
      return;
    }
    this.static.clearTime = "1";
    setTimeout(()=>{this.static.clearTime=""},1000);
    const data = {
      doctor_id:this.static.mis_doc_id,
      user_id:record.user_id,
      patient_id:record.patient_id,
      schedule_id:record.schedule_id,
      registration_no:record.registration_no,
      reservation_deal_id:record.reservation_deal_id,
      deal_id:record.deal_id,
    }
    this.props.dispatch(getCallUp(data,(json)=>{
      if(json.status == 0){
        this.conPrescription(record);
      }else{
        Modal.error({
          title: "叫诊失败",
        });
      }
    }))
    // this.conSeeDoctor(record);
  }
  //继续开方  简易门诊
  conPrescription(record){
    //候诊状态扭转：通过预约单扭转   reservation_deal_id -> deal_id   reservation_phone -> user_id
  	Cookie.set("patient_id", record.patient_id,{domain:'.gstzy.cn'});
    Cookie.set("deal_id", record.deal_id,{domain:'.gstzy.cn'});
    Cookie.set("patient_name", record.patient_name,{domain:'.gstzy.cn'});

    //处方接口需要的患者信息  从患者信息接口获取有可能对应不上
    Cookie.set("patient_age",getAgeByBirthday(record.patient_birth) ,{domain:'.gstzy.cn'});
    Cookie.set("patient_birth", record.patient_birth,{domain:'.gstzy.cn'});
    Cookie.set("patient_image", record.patient_image,{domain:'.gstzy.cn'});
    Cookie.set("patient_sex", record.patient_sex,{domain:'.gstzy.cn'});
    Cookie.set("patient_type", record.property,{domain:'.gstzy.cn'});
    // Cookie.set("reservation_phone", record.reservation_phone,{domain:'.gstzy.cn'});
    Cookie.set("reservation_phone", record.user_id,{domain:'.gstzy.cn'});
    Cookie.set("patient_user_id", record.reservation_phone,{domain:'.gstzy.cn'});
    Cookie.set("patient_schedule_id", record.schedule_id,{domain:'.gstzy.cn'});
    Cookie.set("patient_reservation_sort_id", record.reservation_sort_id,{domain:'.gstzy.cn'});
    Cookie.set("patient_reservation_deal_id", record.reservation_deal_id,{domain:'.gstzy.cn'});
    Cookie.set("patient_registration_no", record.registration_no,{domain:'.gstzy.cn'});

    //科别
    Cookie.set("department_name", record.department_name,{domain:'.gstzy.cn'});
    //费别
    Cookie.set("fee_discount_type", record.fee_discount_type,{domain:'.gstzy.cn'});

    window.location.href = "/outPatient/SimpleOutPatient/binli";
    // this.context.router.push("/outPatient/SimpleOutPatient/binli");
  }
  //过诊
  misSeeDoctor(record){
    if(this.static.clearTime){
      return;
    }
    this.static.clearTime = "1";
    setTimeout(()=>{this.static.clearTime=""},1000);
    const data = {
      doctor_id:this.static.mis_doc_id,
      user_id:record.user_id,
      patient_id:record.patient_id,
      schedule_id:record.schedule_id,
      registration_no:record.registration_no,
      reservation_deal_id:record.reservation_deal_id,
      deal_id:record.deal_id,
    }
    this.props.dispatch(getCallMis(data,(json)=>{
      // console.log(json);
      if(json.status == 0){

      }else{
        Modal.error({
          title: "过诊失败",
        });
      }
    }))
  }
  //继续看诊
  conSeeDoctor(record){
    Cookie.set("patient_id", record.patient_id,{domain:'.gstzy.cn'});
    Cookie.set("deal_id", record.deal_id,{domain:'.gstzy.cn'});
    Cookie.set("patient_name", record.patient_name,{domain:'.gstzy.cn'});

    //处方接口需要的患者信息  从患者信息接口获取有可能对应不上
    Cookie.set("patient_age",getAgeByBirthday(record.patient_birth) ,{domain:'.gstzy.cn'});
    Cookie.set("patient_birth", record.patient_birth,{domain:'.gstzy.cn'});
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

    //科别
    Cookie.set("department_name", record.department_name,{domain:'.gstzy.cn'});
    //费别
    Cookie.set("fee_discount_type", record.fee_discount_type,{domain:'.gstzy.cn'});

    this.context.router.push("/outPatient/seeDoctor/binli");
  }


  //结束就诊
  endSeeDoctor(record){//patient_id,schedule_id,reservation_sort_id,deal_id
    if(this.static.clearTime){
      return;
    }
    this.static.clearTime = "1";
    setTimeout(()=>{this.static.clearTime=""},1000);
    const _self = this;
    const data = {
      doctor_id:this.static.mis_doc_id,
      doctor_name:getUser().doctor_name,
      user_id:record.user_id,
      patient_id:record.patient_id,
      schedule_id:record.schedule_id,
      registration_no:record.registration_no,
      reservation_deal_id:record.reservation_deal_id,
      deal_id:record.deal_id,
    }
    if(data.registration_no == "undefined"){
      data.registration_no = "-1";
    }

    confirm({
      title: '是否结束就诊?',
      onOk() {
        _self.props.dispatch(getCallEnd(data,(json)=>{
          if(json.status == 0){
            // _self.loadData();
            _self.onDateChangeTwo(_self.static.selectTime);
          }else{
            //诊结失败
            Modal.error({
              title: "诊结失败",
            });
          }
        }));
      },
      onCancel() {

      },
    });
  }

  //续诊
  continueSeeDoctor(record){
    if(this.static.clearTime){
      return;
    }
    this.static.clearTime = "1";
    setTimeout(()=>{this.static.clearTime=""},1000);
    const {callPatientsList} = this.props;
    if(callPatientsList.length > 0){
      if(callPatientsList[0].status == 2){
        Modal.warn({
          title: "已有患者在就诊，请结束患者就诊后续诊",
        });
        return;
      }
    }
    let data = {
      registration_no:'-1',
    }
    // const data = {
    //   operator_name:getUser().doctor_name,
    //   operator_id:getUser().doctor_id,
    //   user_id:record.user_id,
    //   deal_id:record.deal_id,
    // }
    this.props.dispatch(phpPostRegisTrationContinueTreatment(Object.assign(data,record),(json)=>{
      if(json.status == 0){
        this.conSeeDoctor(json.data[0]);
      }else{
        //续诊失败
        Modal.error({
          title: "续诊失败",
        });
      }
    }));
  }
  //查看病人信息
  seePatientInfo(record){
    this.context.router.push(`/patient/patientinfo?patientId=${record.patient_id}&userId=${record.user_id}&phone=${record.user_id}`);
  }

  //禁止今日之后的时间
  disabledDate(current) {
    return current && current.valueOf() > Date.now();
  }
  onDateChange(date, dateString){
    this.static.selectTime = dateString?dateString:convertTimeToStr(new Date(),"yyyy-MM-dd")+' 00:00';
    this.onDateChangeTwo(this.static.selectTime);
  }
  onDateChangeTwo(dateString){
    const data = {
      doctor_id:this.static.mis_doc_id,
      schedule_date:dateString,
      page_no:'1',
      page_size:'200',
    }
    this.setState({
      arriveLoading:true,//预约已到是否加载
    })
    //tab
    if(this.static.activeTab == TAB.FIRST){
      //候诊
      this.props.dispatch(getCallList(data,(json)=>{
        this.setState({
          arriveLoading:false,//预约已到是否加载
        })
      }));
    }
    //预约未到，已诊
    this.getRegistrationList(dateString?new Date(dateString):new Date());
    //tab
    if(this.static.activeTab == TAB.THIRD){
      //简易门诊
      this.getSimpleOutpatient(dateString?new Date(dateString):new Date());
    }
  }


  //简易门诊  叫诊
  simpleOutpatientPrescrip(record){
    const data = {
      operator_id:getUser().mis_doc_id,
      operator_name:getUser().doctor_name,
      // deal_id:record.deal_id,
      deal_id:record.reservation_deal_id,
      // user_id:record.user_id,
      user_id:record.reservation_phone,

    }
    this.props.dispatch(registrationintreatment(data,(res)=>{
      if(res.status == 0){
        this.conPrescription(record);
      }else{
        message.error(res.message);
      }
    }))
  }

  //简易门诊 续诊
  continueSimpleSeeDoctor(record){
    if(this.static.clearTime){
      return;
    }
    this.static.clearTime = "1";
    setTimeout(()=>{this.static.clearTime=""},1000);
    const data = {
      operator_id:getUser().mis_doc_id,
      operator_name:getUser().doctor_name,
      // deal_id:record.deal_id,
      deal_id:record.reservation_deal_id,
      // user_id:record.user_id,
      user_id:record.reservation_phone,
    }
    this.props.dispatch(registrationcontinuetreatment(data,(json)=>{
      if(json.status == 0){
        this.conPrescription(record);
      }else{
        //续诊失败
        Modal.error({
          title: "续诊失败",
        });
      }
    }));
  }

  //医生外屏显示
  patientListInSrceen(){
    const mis_doc_id = encodeURIComponent(this.static.mis_doc_id);//getUser().doctor_desc;
    const doctor_id = encodeURIComponent(getUser().doctor_id);
    const img_url = encodeURIComponent(host.dr_img);
    const patient_url = encodeURIComponent(host.mHost);
    const doctor_url = encodeURIComponent(host.cplus);
    return `/outPatientList.html?doctor_id=${doctor_id}&mis_doc_id=${mis_doc_id}&img_url=${img_url}&patient_url=${patient_url}&doctor_url=${doctor_url}`
  }

  render(){
    const {callPatientsList,temporaryList,temporaryFinishList} = this.props;
    const {simpleOutpatientList,simpleOutpatientEndList} = this.state;
    const columns_common_second = [{
      title: '头像',
      dataIndex: 'patient_image',
      className: 'text-center',
      width:'7%',
      key: 'patient_image',
      render: text => <img className={'head-img'} src={text}></img>,
    }, {
      title: '姓名',
      dataIndex: 'patient_name',
      className: 'text-center',
      width:'10%',
      key: 'patient_name',
    }, {
      title: '性别',
      dataIndex: 'patient_sex',
      className: 'text-center',
      width:'7%',
      key: 'patient_sex',
      render: text => <span >{text=='1'?'男':(text=='2'?'女':'未填写')}</span>,
    }, {
      title: '年龄',
      dataIndex: 'patient_birth',
      className: 'text-center',
      width:'7%',
      key: 'patient_birth',
      render: text => <span >{getAgeByBirthday(text)}</span>,
    }, {
      title: '就诊记录',
      dataIndex: 'property',
      className: 'text-center',
      width:'7%',
      key: 'property',
      render: text => <span>{this.strForState2(+text&0x800)}</span>,
    }, {
      title: '时间',
      dataIndex: 'reservation_start_time',
      className: 'text-center',
      width:'15%',
      key: 'reservation_start_time',
      render: (text, record,index) =>{
        return (
          <span>
            {convertTimeToStr(record.reservation_start_time||new Date(),'yyyy-MM-dd hh:mm').substring(10)}-
            {convertTimeToStr(record.reservation_end_time||new Date(),'yyyy-MM-dd hh:mm').substring(10)}
          </span>
        )
      },
    }]
    // 已报道
    const columns_check = [{
      title: '状态',
      dataIndex: 'status',
      className: 'text-center',
      width:'7%',
      key: 'status',
      render: text =>{
        if(this.static.selectTime != convertTimeToStr(new Date(),"yyyy-MM-dd")+' 00:00'){
          text = 4;
        }
        return (
          <Tag
            className={this.strForState(text).className}
            onClick={this.stateButtonClick.bind(this)}
          >
            {this.strForState(text).name}
          </Tag>
        )
      }
        ,
    }, {
      title: '号码',
      dataIndex: 'registration_no',
      className: 'text-center',
      width:'7%',
      key: 'registration_no',
    },
    ...columns_common_second
    , {
      title: '',
      key: 'action',
      dataIndex: 'status',
      className: 'text-center',
      render: (text, record,index) => {
        if(index > 0){
          return "";
        }
        if(this.static.selectTime != convertTimeToStr(new Date(),"yyyy-MM-dd")+' 00:00'){
          return "";
        }
        if(text == 1 || text == 4){
          return (
            <span>
              <Button onClick={this.seeDoctor.bind(this,record)} className="button button-green">叫诊</Button>
            </span>);
        }else{
          return (
            <span>
              <Button onClick={this.misSeeDoctor.bind(this,record)} className="button button-orange" >延迟看诊</Button>
              <Button onClick={this.conSeeDoctor.bind(this,record)} className="button button-green" >继续看诊</Button>
              {/* <Button onClick={this.endSeeDoctor.bind(this,record)} className="button button-red" >诊结</Button> */}
            </span>
          )
        }
      },
    }];

    //简易门诊未开方
    const columns_check2 = [{
      title: '状态',
      dataIndex: 'deal_state',
      className: 'text-center',
      width:'7%',
      key: 'status',
      render: text =>{
        if(this.static.selectTime != convertTimeToStr(new Date(),"yyyy-MM-dd")+' 00:00'){
          text = 4;
        }
        return (
          <Tag
            className={this.strForState(+text).className}
            onClick={this.stateButtonClick.bind(this)}
          >
            {this.strForState(+text).name}
          </Tag>
        )
      }
        ,
    }, {
      title: '号码',
      dataIndex: 'registration_no',
      className: 'text-center',
      width:'7%',
      key: 'registration_no',
    },
    ...columns_common_second
    , {
      title: '',
      key: 'action',
      dataIndex: 'deal_state',
      className: 'text-center',
      render: (text, record,index) => {
        if(this.static.selectTime != convertTimeToStr(new Date(),"yyyy-MM-dd")+' 00:00'){
          return "";
        }
        if(+text == 23){
          return (
            <span>
              <Button onClick={this.simpleOutpatientPrescrip.bind(this,record)} className="button button-green">开方</Button>
            </span>);
        }else{
          return (
            <span>
              <Button onClick={this.conPrescription.bind(this,record)} className="button button-green" >继续开方</Button>
            </span>
          )
        }
      },
    }];


    // 已预约
    const columns_uncheck = [{
      title: '',
      dataIndex: '',
      className: 'text-center',
      width:'10%',
      render: text => <span></span>,
    },
    ...columns_common_second
    ];
    // 已诊
    const columns_done = [
      {
        title: '状态',
        dataIndex: 'deal_type',
        className: 'text-center',
        width:'7%',
        key: 'deal_type',
        render: text => <Tag className={this.strForState(text).className} onClick={this.stateButtonClick.bind(this)}>{this.strForState(text).name}</Tag>,
      }, {
        title: '号码',
        dataIndex: 'registration_no',
        className: 'text-center',
        width:'7%',
        key: 'registration_no',
      },
      ...columns_common_second
      , {
        title: '',
        key: 'action',
        dataIndex: 'state',
        className: 'text-center',
        render: (text, record) => {
          if(this.static.selectTime != convertTimeToStr(new Date(),"yyyy-MM-dd")+' 00:00'){
            return (
              <span>
                <Button onClick={this.seePatientInfo.bind(this,record)} className="button button-orange" >查看</Button>
              </span>
            )
          }
          return (
            <span>
              {
                (+record.property & 0x2000) == '8192'?
                <Button className="button button-green button-transparent">续诊</Button>:
                <Button onClick={this.continueSeeDoctor.bind(this,record)} className="button button-green" >续诊</Button>
              }
              <Button onClick={this.seePatientInfo.bind(this,record)} className="button button-orange" >查看</Button>
            </span>
          )
        },
      }
    ];
    // 已诊
    const columns_uncheck2 = [
      {
        title: '状态',
        dataIndex: 'deal_type',
        className: 'text-center',
        width:'7%',
        key: 'deal_type',
        render: text => <Tag className={this.strForState(text).className} onClick={this.stateButtonClick.bind(this)}>{this.strForState(text).name}</Tag>,
      }, {
        title: '号码',
        dataIndex: 'registration_no',
        className: 'text-center',
        width:'7%',
        key: 'registration_no',
      },
      ...columns_common_second
      , {
        title: '',
        key: 'action',
        dataIndex: 'state',
        className: 'text-center',
        render: (text, record) => {
          if(this.static.selectTime != convertTimeToStr(new Date(),"yyyy-MM-dd")+' 00:00'){
            return (
              <span>
                <Button onClick={this.seePatientInfo.bind(this,record)} className="button button-orange" >查看</Button>
              </span>
            )
          }
          return (
            <span>
              {
                (+record.property & 0x2000) == '8192'?
                <Button className="button button-green button-transparent">续诊</Button>:
                <Button onClick={this.continueSimpleSeeDoctor.bind(this,record)} className="button button-green" >续诊</Button>
              }
              <Button onClick={this.seePatientInfo.bind(this,record)} className="button button-orange" >查看</Button>
            </span>
          )
        },
      }
    ];
    const {arriveLoading,noArriveLoading,hasClinicalLoading} = this.state;
    return(
      <Row className="outpatient-department">
        <Col>
          <Tabs
            type="card"
            defaultActiveKey={this.static.activeTab}
            onChange={this.callback.bind(this)}
            tabBarExtraContent={
              <div>
                {/* <Button onClick={this.patientListInSrceen.bind(this)}>屏显</Button> */}
                <a className="ant-btn" href={this.patientListInSrceen()} target="_blank">屏显</a>
                <DatePicker
                  format="YYYY-MM-DD"
                  onChange={this.onDateChange.bind(this)}
                  disabledDate={this.disabledDate}
                  size={'large'}
                  defaultValue={moment(new Date(), 'YYYY-MM-DD')}
                />
              </div>
            }>
          <TabPane tab="未诊病人" key="1">
            <Row>
              <Table
                rowKey={(record,index) => index}
                title={()=>(
                  <div>
                    <span className={'font-weight'}>已预约报到病人：{callPatientsList?callPatientsList.length:'0'} </span>
                    <span className={'font-size-m'}>(状态说明:应诊_指患者当前正在看病；候诊_指患者当前正在排队看病；过诊_指患者报到时间超过就诊时间或者医生叫诊时患者未及时应诊)</span>
                  </div>)}
                loading={arriveLoading}
                pagination={false}
                scroll={{ y: 240 }}
                columns={columns_check}
                dataSource={callPatientsList} />
            </Row>
            <Row style={{"paddingTop":".8rem"}}>
              <Table
                rowKey={(record,index) => index}
                title={()=>(
                  <div>
                    <span className={'font-weight'}>已预约未报到病人：{temporaryList?temporaryList.length:'0'} </span>
                  </div>)}
                loading={noArriveLoading}
                columns={columns_uncheck}
                pagination={false}
                scroll={{ y: 240 }}
                dataSource={temporaryList} />
            </Row>
          </TabPane>
          <TabPane tab="已诊病人" key="2">
            <Row>
              <Table
                rowKey={(record,index) => index}
                title={()=>(
                  <div>
                    <span className={'font-weight'}>已诊病人：{temporaryFinishList?temporaryFinishList.length:'0'}  </span>
                  </div>)}
                loading={hasClinicalLoading}
                columns={columns_done}
                pagination={false}
                scroll={{ y: 557 }}
                dataSource={temporaryFinishList} />
            </Row>
          </TabPane>
          {
          	this.state.jianyi?(
          	<TabPane tab="简易门诊" key="3">
	            <Row>
	              <Table
	                rowKey={(record,index) => index}
	                title={()=>(
	                  <div>
	                    <span className={'font-weight'}>未开方病人：{simpleOutpatientList.length}</span>
	                  </div>)}
	                pagination={false}
	                scroll={{ y: 240 }}
	                columns={columns_check2}
	                dataSource={simpleOutpatientList} />
	            </Row>
	            <Row style={{"paddingTop":".8rem"}}>
	              <Table
	                rowKey={(record,index) => index}
	                title={()=>(
	                  <div>
	                    <span className={'font-weight'}>已开方病人：{simpleOutpatientEndList.length}</span>
	                  </div>)}
	                columns={columns_uncheck2}
	                pagination={false}
	                scroll={{ y: 240 }}
	                dataSource={simpleOutpatientEndList} />
	            </Row>
          </TabPane>):""
          }


          </Tabs>
        </Col>
      </Row>
    );
  }
}
OutpatientDepartment.contextTypes={
  router: React.PropTypes.object.isRequired
};
OutpatientDepartment.propTypes = {
  callPatientsList: PropTypes.array,
  temporaryList: PropTypes.array,
  temporaryFinishList: PropTypes.array,
};
function mapStateToProps(state){
  return {
    callPatientsList:state.callPatientsList.data,
    temporaryList:state.temporaryList.id_list,
    temporaryFinishList:state.temporaryFinishList.id_list,
  }
}
export default connect(mapStateToProps)(OutpatientDepartment)
