/*
 * 门诊 主诉
 */

import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {Row,Col,Form,Input,Checkbox,Button,Select,message,Radio,Modal ,InputNumber} from 'antd';
import ClinialItem from "./ClinialItem";
import MedicineItem from "./MedicineItem";
import CiteManage from "../template/CiteManage";
import CiteSaveManage from "../template/CiteSaveManage";
import PrescriptionTemplate from "../template/PrescriptionTemplate";
import MedicalList from "../MedicalList";
import Operation from "../Operation";
import DiseaseHistory from "../template/DiseaseHistory";
import OverallTemplate from "../template/OverallTemplate";
import {medicrecordList,medicrecordSave,tongueNature,medicrecordDetail,diagnose,tongueCoat,pulse,getClilentData} from "../../store/actions/CiteManage";
import {getUser} from "../../utils/User";
import {loadSave} from "../../store/actions/Comon";
import {getsettingSystem} from "../../store/actions/SettingAction";
import Clinical from '../print/Clinical'
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;
let numEnter = 3;
class ClinicalContent extends Component {
  constructor(props){
    super(props);
    this.state={
      medical:[],
      visible:false,
      saveVisble:false,
      saveAsVisble:false,
      defaluteMediciValue:[],
      defaluteClinilValue:[],
      mediciValue:[],
      clinilValue:[],
      handle:"",
      inintData:{
      	medical:[]
      },
      emptyclinia:false,
      emptyMedicine:false,
      quoteVisble:false,
      item:{},
      overAllVisble:false,
      midicalData:[],
      midTotalPage:0,
      dishisId:"" ,
      bear_his:"",
      saveLoading:false,
      flage:false ,//标志位，标志false 保存 true 修改
      record_id:"", //病历ID
      shezhi:[], //舌质
      shetai:[],//舌苔
      maixiang:[], //脉象
      clearData:false,
      printData:{
      	flage:false
      },
      isPrint:false
    }
  }
  componentWillMount(){
  }
  componentWillUnmount(){

  }


  componentDidMount(){
  	
    this.onKeyDown();
  	//键盘事件
  	const _this = this;
  	//通过订单Id 拉取保存数据
  	
  	this.props.dispatch(medicrecordDetail({patient_id:getUser().patient_id ,deal_id:getUser().deal_id,clinic_id:getUser().shop_no},(res)=>{

	    	if(res.data&&res.data.length>0){
	    		let medical = [];
	    		let medata = [];
	    		let cldata = [];
	    		if(res.data[0].show_opt)
	    			medical = res.data[0].show_opt.split(',');
	    		if(res.data[0].medic_check){
	    			medata = res.data[0].medic_check.filter(item=>item.check_type == '2');
	    			cldata = res.data[0].medic_check.filter(item=>item.check_type == '1');
	    		}
		    	this.setState({
		  			medical:medical,
		  			record_id:res.data[0].record_id,
		  			defaluteMediciValue:medata,
		  			defaluteClinilValue:cldata
		  		})
		    	this.props.form.setFieldsValue(Object.assign({},res.data[0],{medical:medical},{temperature:res.data[0].temperature/10}))
	    	}else{
    
	    		this.props.dispatch(getsettingSystem({doctor_id:getUser().doctor_id},(resdata)=>{
	    				if(resdata.status == '0' && resdata.data.medical_record_for_return_visits.toString()=='1'){
                	
						  	const medicrecord = {
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
						  			 this.props.dispatch(medicrecordDetail({patient_id:getUser().patient_id ,deal_id:res.deal_list[0].deal_id,clinic_id:getUser().shop_no},(reslist)=>{
                      if(!reslist.data||reslist.data.length==0){
                        reslist.data = [];
                      }
                      if(reslist.status == '0' && reslist.data.length>0){
                      	
                      	delete reslist.data[0].record_id;
									    	let medical = [];
									    	let medata = [];
									    	let cldata = [];
									    	if(reslist.data[0].medic_check){
												  medata = reslist.data[0].medic_check.filter(item=>item.check_type == '2');
												  cldata = reslist.data[0].medic_check.filter(item=>item.check_type == '1');
												}

									    	medical = reslist.data[0].show_opt.split(',');
									    	this.setState({
									  			medical:medical,
									  			defaluteMediciValue:medata,
										  		defaluteClinilValue:cldata,
									  		})
									    	
									    	this.props.form.setFieldsValue(reslist.data[0])
									    	
									    }
									  }))
						  		}else{
										
						  			if(resdata.status == '0' && resdata.data.show.split(",").length>0){
				    					this.setState({
				    						medical:resdata.data.show.split(",")
				    					})
				    					this.props.form.setFieldsValue({medical:resdata.data.show.split(",")})
				    				}
						  		}
						  	}))

	    				}
	    		}))



	    	}
	    }))
	



  }
  handleSubmit(e) {
    e.preventDefault();
   // console.dir()
  }
  //病史
  checkboxOnChange(checkedValues){
  //  console.log(checkedValues);
    this.setState({
    	medical:checkedValues
    })
  }


  //引用
  citeModel(){
  	this.setState({
  		visible:true
  	})
  }
  handleOk(handle){

  	this.setState({
  		visible:false

  	})
  	this.props.form.setFieldsValue({process:handle})
  }
  handleCancel(){
  	this.setState({
  		visible:false
  	})
  }
  //另存为
  citeSaveModel(){
    if(!this.props.form.getFieldsValue(["process"]).process.trim()){
    	 Modal.warning({
		    title: '处理另存为',
		    content: '请填写处理内容',
		  });
    }else{
    	this.setState({
			 saveVisble:true
			})
    }


  }
  saveHandleOk(){
  	this.setState({
  		saveVisble:false
  	})
  }
  saveHandleCancel(){
  	this.setState({
  		saveVisble:false
  	})
  }
  //处理onchange 事件
  onChangeDeal(e){
  	this.setState({
  		handle:e.target.value
  	})
  }
  //引用整体模板
  wholePlate(){
		this.setState({
  		overAllVisble:true
  	})
  }
  //病历存为模板
  casePlate(){
  	//console.dir(this.props.form.getFieldsValue())
  	const data = Object.assign({},
  								this.props.form.getFieldsValue(),
  								{mediciValue: this.state.mediciValue},
  								{clinilValue:this.state.clinilValue});
  	this.setState({
  		saveAsVisble:true,
  		inintData:data
  	})
  }
  //一健清空
  keyEmpty(){
  	this.props.form.resetFields();
  	this.setState({
  		emptyclinia:!this.state.emptyclinia,
  		emptyMedicine:!this.state.emptyMedicine,
  		clearData:true
  	})
  }
  Printpart(id_str){
		var el = document.getElementById(id_str);
		var iframe = document.createElement('IFRAME');
		var doc = null;
		iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;');
		document.body.appendChild(iframe);
		doc = iframe.contentWindow.document;
		doc.write('<div>' + el.innerHTML + '</div>');
		doc.close();
		iframe.contentWindow.focus();
		iframe.contentWindow.print();
		if (navigator.userAgent.indexOf("MSIE") > 0)
		{
		document.body.removeChild(iframe);
		}
	}

  //打印
  printPlate(){
		let mediciValue = this.state.mediciValue.slice(0,this.state.mediciValue.length-1);
	  let clinilValue = this.state.clinilValue.slice(0,this.state.clinilValue.length-1);
		let data =  Object.assign({},this.props.form.getFieldsValue(),
								{mediciValue:mediciValue},{clinilValue:clinilValue},{flage:!this.state.flage})
		this.setState({
			printData:data,
	
		})
	
		if(!window.gst){
			setTimeout(()=>{this.Printpart("testPrint")},500)
		}else{
			setTimeout(()=>{
				this.setState({
			  		isPrint:true,
			  	})
					const GST = window.gst ? window.gst : {};
		 			const {printer, printInfo} =  GST;
	      message.success('开始打印');
		  		printer.printWeb(document.getElementById("testPrint").innerHTML, printInfo.recipe,(res)=>{
		        this.setState({
		          isPrint:false,
		        })
		      });
				},500)
		}
  }
  //中医诊断
  onSelectClinia(data){

  	this.setState({
  		clinilValue:data
  	})


  	let mediciValue = this.state.mediciValue.slice(0,this.state.mediciValue.length-1);
    let clinilValue = data.slice(0,data.length-1);
  	this.props.form.setFieldsValue(Object.assign({},this.props.form.getFieldsValue(),{medic_check:mediciValue.concat(clinilValue)}))

  }

  //西医诊断
  onSelectMedici(data){

  	this.setState({
  		mediciValue:data
  	})

  	let mediciValue = data.slice(0,data.length-1);
    let clinilValue = this.state.clinilValue.slice(0,this.state.clinilValue.length-1);
  	this.props.form.setFieldsValue(Object.assign({},this.props.form.getFieldsValue(),{medic_check:mediciValue.concat(clinilValue)}))

  }
  //引用【既往病历】 确定
  quoteOk(data){

  	let mediciValue = data.medata.slice(0,data.medata.length-1);
    let clinilValue = data.cldata.slice(0,data.cldata.length-1);
  	this.setState({
  		quoteVisble:false,
  		medical:data.medical,
  		mediciValue:mediciValue,
  		clinilValue:clinilValue,
  		defaluteMediciValue:mediciValue,
		  defaluteClinilValue:clinilValue
  	})
  	setTimeout(()=>{
  		this.props.form.setFieldsValue(data)
  		//this.props.dispatch(getClilentData(Object.assign({},data,{medic_check:mediciValue.concat(clinilValue)})))
  		//this.props.form.setFieldsValue(Object.assign({},data,{medic_check:mediciValue.concat(clinilValue)}))
  	},100)

  }
  quoteCancel(){
  	this.setState({
  		quoteVisble:false
  	})
  }
  //另存为模板打开
  saveAsOk(){
  	this.setState({
  		saveAsVisble:false
  	})
  }
  //另存为模板关闭
  saveAsCancel(){
  	this.setState({
  		saveAsVisble:false
  	})
  }
  //就诊记录点击
  onClickRow(data,id){
  	this.setState({
  		quoteVisble:true,
  		dishisId:data.deal_id,
      item:data,
  	})
  }
  onClikOperation(name){

  	if(name == "引用整体模板"){
  		this.wholePlate();
  	}else if(name=="另存为模板"){
  		this.casePlate();
  	}else if(name=="一健清空"){
  		this.keyEmpty();
  	}else if(name=="打印"){
  		this.printPlate()
  	}else if(name=="保存"){
  		this.saveData();
  	}
  }

  //保存数据
  saveData(){
    this.props.dispatch(loadSave(true));
    if(this.props.getclientdata.record_id&&this.props.getclientdata.record_id!==""){
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
	  		this.props.dispatch(loadSave(false));
	  		if(res.status.toString()=="0"){

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
  		delete data.record_id;
	  	delete  data.medical;
	  	this.props.dispatch(medicrecordSave(data,(res)=>{
	  		this.props.dispatch(loadSave(false));
	  		if(res.status.toString()=="0"){
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
  //引用整体模板点击
  overAllOk(data){
  	
  	let mediciValue = data.medata.slice(0,data.medata.length-1);
    let clinilValue = data.cldata.slice(0,data.cldata.length-1);
  	this.setState({
  		overAllVisble:false,
  		medical:data.medical,
  		defaluteMediciValue:mediciValue,
		  defaluteClinilValue:clinilValue
  	})
  	setTimeout(()=>{
  		this.props.form.setFieldsValue(data)
  	},100)
  	
  }
  //引用整体模板取消
  overAllCancel(){
  	this.setState({
  		overAllVisble:false
  	})
  }
  //经带待产史
  onChangeBearHis(e){
  	this.setState({
  		bear_his:e.target.value
  	})
  }
  //舌质
  searchShizhi(value){
  	this.props.dispatch(tongueNature({keyword:value}))
  }
  //舌苔
  searchSheTai(value){
  	this.props.dispatch(tongueCoat({keyword:value}))
  }
  //脉象
  searchMaiXiang(value){
  	this.props.dispatch(pulse({keyword:value}))
  }
  //过敏史
  hisonBlur(){
  	if(this.props.getCilnicalData instanceof Function ){
  		this.props.getCilnicalData(this.props.form.getFieldsValue(["all_his"]).all_his)
  	}
  }
  onKeyDown(){


  	document.getElementById("complaint").onkeydown=function(e){
  		
  		if(e.keyCode == "13")
  			document.getElementById("now_his").focus();
  	}
  	document.getElementById("now_his").onkeydown=function(e){
  		
  		if(e.keyCode == "13")
  		document.getElementById("all_his").focus();
  	}
  }
  render(){

    const { getFieldDecorator,getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    const formItemLayout1 = {
      labelCol: { span: 5},
      wrapperCol: { span:19 },
    };
    const {tongueNature,tongueCoat,pulse} =  this.props;
    // 过敏史默认
    let plainOptions = ['既往史', '家族史', '经带待产史','体格检查','辅助检查'];
    //舌质
    let options = tongueNature.map((data,id)=>(
	  	<Option  key={data.value} >{data.value}</Option>
	  ))
    //舌苔
    let options2 = tongueCoat.map((data,id)=>(
	  	<Option  key={data.value} >{data.value}</Option>
	  ))
    //脉象
    let options3 = pulse.map((data,id)=>(
	  	<Option  key={data.value} >{data.value}</Option>
	  ))
    return(
    <Row type="flex" className="clinical-history">
     	<Col lg={18} md={16} sm={24} xs={24}>
        <Form className="clinical-content" >
	        <div className="top-banner">
	        <FormItem
	          {...formItemLayout}
	          label="主诉:"
	        >
	          {getFieldDecorator('complaint')(
	            <Input id="complaint"  />
	          )}
	        </FormItem>
	        <FormItem
	          {...formItemLayout}
	          label="现病史:"
	        >
	          {getFieldDecorator('now_his')(
	            <Input id="now_his" className="disease-textarea" type="textarea"/>
	          )}
	        </FormItem>
	        <FormItem
	          {...formItemLayout}
	          label="过敏史:"
	        >
	          {getFieldDecorator('all_his')(
	            <Input placeholder="" id="all_his"  onBlur={this.hisonBlur.bind(this)} />
	          )}
	        </FormItem>
	        <FormItem
	          {...formItemLayout}
	          label="病史:"
	        >
	          {getFieldDecorator('medical')(
	           	<CheckboxGroup options={plainOptions}   onChange={this.checkboxOnChange.bind(this)}/>
	          )}
	        </FormItem>
	        <div>{
	        	this.state.medical.includes("既往史")?(
	        		<FormItem
			          {...formItemLayout}
			          label="既往史"
			        >
			          {getFieldDecorator('past_his')(
			          	<Input placeholder="" id="past_his"/>
			          )}
			        </FormItem> ):""
	        }</div>
	        <div>{
	        	this.state.medical.includes("家族史")?(
	        		<FormItem
			          {...formItemLayout}
			          label="家族史"
			        >
			          {getFieldDecorator('family_his')(
			          	<Input placeholder="" id="family_his"/>
			          )}
			        </FormItem>  ):""
	        }</div>
	        <div className="jingdaishi ">{
	        	this.state.medical.includes("经带待产史")?(
	        		<Row type="flex" justify="start">
	        			<Col xs={19} sm={15} md={16} lg={12}>
	        				<FormItem
									  {...formItemLayout1}
						        label="经带待产史:"
					        >
					          {getFieldDecorator('is_menopause')(
					          	<RadioGroup >
								        <Radio value={"1"}>已绝经</Radio>
								        <Radio value={"2"}>无生育要求</Radio>
								        <Radio value={"3"}>有生育要求</Radio>
								      </RadioGroup>
					          )}
					        </FormItem>
	        			</Col>
	        			<Col  xs={5} sm={5} md={5} lg={5}>
	        				<FormItem
					          {...formItemLayout1}
					        >
					          {getFieldDecorator('bear_his')(
						          <Input id="bear_his"/>
					          )}
					        </FormItem>
	        			</Col>
	        		</Row>

	        	):""
	        }</div>
	       	<div>{
	        	this.state.medical.includes("体格检查")?(
	        		<Row className="tigejiancha">
			       		<Col className="title" span={2}>体格检查:</Col>
			       		<Col span={22}>
				       		<div className="div-1">
				       		 	<span>T</span>
				       		 	<FormItem
						         	wrapperCol={{span: 24}}
						        >
						          {getFieldDecorator('temperature')(
							          <InputNumber id="temperature" />
						          )}
						        </FormItem>
						        <span className="iconfont icon-centigrade"></span>
				       		</div>
				       		<div className="div-2">
				       		 	<span>P</span>
				       		 	<FormItem
						         	wrapperCol={{span: 24}}
						        >
						          {getFieldDecorator('p_per')(
							          <InputNumber id="p_per"/>
						          )}
						        </FormItem>
						        <span>次/分</span>
				       		</div>
				       		<div className="div-2">
				       		 	<span>R</span>
				       		 	<FormItem
						         	wrapperCol={{span: 24}}

						        >
						          {getFieldDecorator('r_per')(
							          <InputNumber id="r_per"/>
						          )}
						        </FormItem>
						        <span>次/分</span>
				       		</div>
				       		<div className="div-2">
				       		 	<span>BP</span>
				       		 	<FormItem
						         	wrapperCol={{span: 24}}

						        >
						          {getFieldDecorator('bp_up')(
							          <InputNumber placeholder="" id="bp_up" />
						          )}
						        </FormItem>
						       <span>/</span>
						       <FormItem
						         	wrapperCol={{span: 24}}

						        >
						          {getFieldDecorator('bp_down')(
							          <InputNumber placeholder="" id="bp_down"/>
						          )}
						        </FormItem>
						        <span>m</span>
				       		</div>
				       		<div className="div-2">
				       			舌质:<FormItem
						         	wrapperCol={{span: 24}}

						        >
						          {getFieldDecorator('tongue_name')(
							          <Select
									        combobox
									        notFoundContent=""
									        style={{ width: 80 }}
									        defaultActiveFirstOption={false}
									        showArrow={false}
									        filterOption={false}
									        dropdownClassName=""
									        dropdownMatchSelectWidth={false}
									        onSearch={this.searchShizhi.bind(this)}
							          >
										       {options}
										    </Select>
						          )}
						        </FormItem>
				       		</div>
				       		<div className="div-2">
				       			<span>舌苔:</span>
				       			<FormItem
						         	wrapperCol={{span: 24}}

						        >
						          {getFieldDecorator('tongue_coat_name')(
							          <Select
									        combobox
									        notFoundContent=""
									        style={{ width: 80 }}
									        defaultActiveFirstOption={false}
									        showArrow={false}
									        filterOption={false}
									        dropdownClassName=""
									        dropdownMatchSelectWidth={false}
									        onSearch={this.searchSheTai.bind(this)}
							          >
										       {options2}
										    </Select>
						          )}
						        </FormItem>
				       		</div>
				       		<div className="div-2">
				       			<span>脉象:</span>
				       			<FormItem
						         	wrapperCol={{span: 24}}
						        >
						          {getFieldDecorator('pluse_name')(
						          	<Select
									        combobox
									        notFoundContent=""
									        style={{ width: 80 }}
									        defaultActiveFirstOption={false}
									        showArrow={false}
									        filterOption={false}
									        dropdownClassName=""
									        dropdownMatchSelectWidth={false}
									        onSearch={this.searchMaiXiang.bind(this)}
							          >
										       {options3}
										    </Select>
						          )}
						        </FormItem>
				       		</div>
			       		</Col>
			       		<Col span={22} offset={2} style={{"marginTop": "10px" }} className="text-colare">
			       			<FormItem
					          wrapperCol={{span: 24}}
					        >
					          {getFieldDecorator('physique_check')(
					          	<Input className="disease-textarea" type="textarea" rows={4} id="physique_check"/>
					          )}
					        </FormItem>
			       		</Col>
			        </Row> ):""
	        }</div>
	        <div>{
	        	this.state.medical.includes("辅助检查")?(
	        		<div>
			        	<FormItem
				          {...formItemLayout}
				          label="辅助检查"
				        >
				          {getFieldDecorator('other_check')(
				          	<Input placeholder="" type="textarea" rows={4}/>
				          )}
				        </FormItem>
			        </div> ):""
	        }</div>
          </div>
          <div className="buttom-banner">
	        <Row type="flex" justify="space-around" align="top" style={{"marginBottom":"10px"}}>
	        	<Col span={11}>
	        		<Row type="flex" justify="space-around" align="top">
			        	<Col span={4}>
			        	中医诊断:
			        	</Col>
			        	<Col span={20}>
			        		<ClinialItem
			        			emptyclinia={this.state.emptyclinia}
			        			onSelectClinia={this.onSelectClinia.bind(this)}
			        			defaluteClinilValue={this.state.defaluteClinilValue}
			        		/>
			        	</Col>
			        </Row>
	        	</Col>
	        	<Col span={12} >
		        	<Row type="flex" justify="space-around" align="top">
				        <Col span={4}>
				        	西医诊断:
				        </Col>
				        <Col span={20}>
				        	<MedicineItem
				        		emptyMedicine={this.state.emptyMedicine}
				        		onSelectMedici={this.onSelectMedici.bind(this)}
			        			defaluteMediciValue={this.state.defaluteMediciValue}
				        	/>
				        </Col>
				      </Row>
	        	</Col>
	        </Row>
	        <Row type="flex" justify="space-around" align="middle">
	            <Col span={2}>
	              <label>处理:</label>
	            </Col>
	            <Col span={18}>
	            	<FormItem
				        >
				          {getFieldDecorator('process')(
				          	<Input type="textarea"  rows={4}   />
				          )}
				        </FormItem>

	            </Col>
	            <Col span={4} className="save-template">
	              <div><Button className="button-green" onClick={this.citeModel.bind(this)}>引用模板</Button></div>
	              <div><Button className="button-red" onClick={this.citeSaveModel.bind(this)}>另存为模板</Button></div>
	            </Col>
	        </Row>
	        </div>
	      </Form>
      </Col>
      <Col style={{"display":"none"}} id="testPrint"><Clinical {...this.state.printData}/></Col>
      <Col lg={5} md={7} sm={24} xs={24} offset={1} className="right_fex_option">
        	<MedicalList
        		location={this.props.location}
        		selectId={this.state.dishisId}
        		onClickRow={this.onClickRow.bind(this)}
        		showFooter="more"
        		
        	/>

        	<Operation
        		inintData={
              [{
                name:"引用整体模板",
              	icon:"icon-all-template"
              },{
              	name:"另存为模板",
              	icon:"icon-cpr-template"
              },{
              	name:"打印",
                loading:this.state.isPrint,
              	icon:"icon-print"
              },{
              	name:"一健清空",
              	icon:"icon-clear"
              }]
            }
        		flage={this.state.flage}
        	  onClikOperation={this.onClikOperation.bind(this)}
        	/>
      </Col>
      <div>
      	<CiteManage
      		visible={this.state.visible}
      		handleOk={this.handleOk.bind(this)}
      		handleCancel={this.handleCancel.bind(this)}/>
      </div>
      <div>
      	<CiteSaveManage
      		saveVisble={this.state.saveVisble}
      		saveHandleOk={this.saveHandleOk.bind(this)}
      		dealValue={this.props.form.getFieldsValue(["process"]).process}
      		saveHandleCancel={this.saveHandleCancel.bind(this)}/>
      </div>
      <div>
      	<PrescriptionTemplate
      		saveAsOk={this.saveAsOk.bind(this)}
      		saveAsCancel={this.saveAsCancel.bind(this)}
      		saveAsVisble={this.state.saveAsVisble}
      		inintData={this.state.inintData}
      	/>
      </div>
      <div>
      	<DiseaseHistory
      		quoteOk={this.quoteOk.bind(this)}
      		quoteCancel={this.quoteCancel.bind(this)}
      		quoteVisble={this.state.quoteVisble}
          item={this.state.item}
					selectId={this.state.dishisId}
      	/>
      </div>
      <div>
      	<OverallTemplate
      		overAllOk={this.overAllOk.bind(this)}
					overAllCancel={this.overAllCancel.bind(this)}
					overAllVisble={this.state.overAllVisble}

      	/>
      </div>
   	</Row>
    );
  }
}
ClinicalContent.contextTypes={

};
function mapStateToProps(state){
	
  return {
	setting:state.setting,
  	tongueNature:state.tongueNature,
  	tongueCoat:state.tongueCoat,
  	pulse:state.pulse,
  	getclientdata:state.getclientdata
  }
}
ClinicalContent = Form.create({onValuesChange:(props, values) => {
	props.dispatch(getClilentData(values))
	
}})(ClinicalContent);
export default connect(mapStateToProps)(ClinicalContent)
