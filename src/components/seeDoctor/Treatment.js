/*
 * 门诊 理疗治疗
 */

import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {Row,Col,Tag, Tabs, Button,Modal,message} from 'antd';
const TabPane = Tabs.TabPane;
import TreatmentContent from "./TreatmentContent";
import MedicalList from "../MedicalList";
import Operation from "../Operation";
import SaveTreatment from '../template/SaveTreatment'
import CiteTreatment from '../template/CiteTreatment'
import {postAddrecipelist,getRecipelist,getRecipeDetail,deleteRecipeDetail} from "../../store/actions/Medicine";
import {restTreatment,upDataTreatment} from "../../store/actions/Treatment";
import {getUser} from "../../utils/User";
import TreatmentHistory from '../template/TreatmentHistory'
import {loadSave} from "../../store/actions/Comon"
import PubSub from "pubsub-js";
import TreatPrint from '../print/TreatPrint'
class Treatment extends Component {
  constructor(props){
    super(props);
    this.state={
    	quoteVisble:false,
      dishisId:"",
      visible:false,
      overAllVisble:false,
      cloud_recipe_id:"",
      historyTemplate:{
        dishisId:'0',
        selectId:'0',
        quoteVisble:false,
        item:{}
      },
      printData:[]
    }
    this.onClickMedicalList = this.onClickMedicalList.bind(this);
    this.onClikOperation = this.onClikOperation.bind(this);

    this.cancelUseModal = this.cancelUseModal.bind(this);
    this.cancelSaveModal = this.cancelSaveModal.bind(this);
    this.selectTreeItem = this.selectTreeItem.bind(this);
    this.saveModal = this.saveModal.bind(this);


    // this.allQuote=this._allQuote.bind(this);
		// this.partQuote=this._partQuote.bind(this);
		// this.cancel=this._cancel.bind(this);

    this.selectWholePlateTreeItem = this.selectWholePlateTreeItem.bind(this);

  }
  componentWillMount(){

    this.setState({
  		midicalData:[],
  		midTotalPage:10,
      showUseModal: false,
      showSaveModal: false,
      saveModalData: null,
      selectTreeObj: null,

      wholePlate:{
        activeKey:'1',
        index:'',
        name:'',
        type:'0',
        visible:false
      },
      isPrint:false
  	})
  }
  componentWillUnmount(){
      PubSub.unsubscribe(this.pubsub_token);
  }
  componentDidMount(){

  	//获取服务器数据
  	const data = {
      query_type:1,//患者维度查询处方列表
      user_id:getUser().reservation_phone,
      page_no:1,
      page_size:2000,
      clinic_id:getUser().shop_no,
      registration_deal_id:getUser().deal_id,
      recipe_source:"3",
      compose:"1"
    }
    this.props.dispatch(getRecipelist(data,(res)=>{
    	if(res.status == "0"){

    		if(res.data.recipes && res.data.recipes.length>0){
    			let recipeData	= res.data.recipes.filter(item => item.recipe_type == 6);
    			
    			if(recipeData.length>0){
    				this.props.dispatch(getRecipeDetail({cloud_recipe_id:recipeData[0].cloud_recipe_id,user_id:getUser().reservation_phone,recipe_source:"3",compose:"1"},(res)=>{

    					if(res.status=='0'&&res.data.items!=null){

    						for(let i=0;i<res.data.items.length;i++){
    							Object.assign(res.data.items[i],
    								{acupoint_id1:res.data.items[i].acupoint_id1.toString()},
    								{acupoint_id2:res.data.items[i].acupoint_id2.toString()},
    								{acupoint_id3:res.data.items[i].acupoint_id3.toString()},
    								{acupoint_id4:res.data.items[i].acupoint_id4.toString()},
    								{wst_taking_amount:res.data.items[i].wst_taking_amount.toString()},
    								{wst_taking_days:res.data.items[i].wst_taking_days.toString()},
    								{wst_taking_times:res.data.items[i].wst_taking_times.toString()},
    								{item_amount:res.data.items[i].item_amount.toString()},
    								{usage_id:res.data.items[i].usage_id.toString()},
    								{quantity:res.data.items[i].quantity.toString()},
    								{cloud_recipe_id:recipeData[0].cloud_recipe_id}

    								)
    						}

    						this.props.dispatch(restTreatment(res.data.items))
    					}
    				}))

    			}
    		}
    	}
    }));
  }
  onClickMedicalList(item,id){
    let {historyTemplate} = this.state;
    historyTemplate.quoteVisble = true;
    historyTemplate.dishisId = id;//item.deal_id;
    historyTemplate.selectId = item.deal_id;
    historyTemplate.item = item;
    this.setState({
      historyTemplate
    })
  }
  //全部引用
  allQuote(){
    let {historyTemplate} = this.state;
    historyTemplate.quoteVisble = false;
    this.setState({
      historyTemplate
    })
  }
  //部分引用
  partQuote(){
    this.allQuote();
  }
  //取消
  cancel(){
    this.allQuote();
  }
  //另存为模板
  casePlate(){

  	if(this.props.treatmentTemData.length>1){
  		this.setState({
	  		visible:true
	  	})
  	}else{
  		  message.error('不能保存空模板');
  	}

  }
  saveHandleOk(){
  	this.setState({
  		visible:false
  	})
  }
  saveHandleCancel(){
  	this.setState({
  		visible:false
  	})
  }

  //整体模板
  wholePlate(){
  	this.setState({
  		overAllVisble:true
  	})
  }
  //整体模板引用
  overAllOk(){
  	this.setState({
  		overAllVisble:false
  	})
  }
  overAllCancel(){
  	this.setState({
  		overAllVisble:false
  	})
  }
  //保存
  saveData(){

  let temData = this.props.treatmentTemData.concat();
	temData.pop();

	let temL =  temData.filter(item => item.cloud_recipe_id);
	if(temData.length==0 || temData.length==0){
		return;
	}
	if(temL.length>0){
		this.props.dispatch(loadSave(true));
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
		  	this.props.dispatch(loadSave(false));
		  	if(res.status == '0'){

		  	}else{
		  		Modal.error({
					  title: '治疗理疗',
					  content: '保存失败',
					});
		  	}

		  }))
	  }else{
	  	this.props.dispatch(loadSave(true));
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
		  	this.props.dispatch(loadSave(false));
		  	if(res.status == '0'){
				this.props.dispatch(upDataTreatment(Object.assign({},{cloud_recipe_id:res.data.recipes[0].cloud_recipe_id},{id:0})));
		  	}else{
		  		Modal.error({
					  title: '治疗理疗',
					  content: '保存失败',
					});
		  	}

		  }))
	  }



  }
  //一键清空
  keyEmpty(){
  	this.props.dispatch(restTreatment([]));

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

    if(!window.gst){
  		setTimeout(()=>{this.Printpart("testPrint3")},500)
  	}else{
  		setTimeout(()=>{
				const GST = window.gst ? window.gst : {};
	 			const {printer, printInfo} =  GST;
	      this.setState({
	        isPrint:true,
	      })
        message.success('开始打印');
	  		printer.printWeb(document.getElementById("testPrint3").innerHTML, printInfo.recipe,(res)=>{
	        this.setState({
	          isPrint:false,
	        })
	      });
			},500)
  	}


  }
  onClikOperation(name){
  	switch (name) {
      case "引用模板":{
        this.wholePlate();
      }
        break;
      case "处方存为模板":{
        this.casePlate();
      }
        break;
      case "一健清空":{
        this.keyEmpty();
      }
        break;
      case "打印":{
        this.printPlate();
      }
        break;
      case "保存":{
        this.saveData();
      }
        break;
      default:
    }

  }
  cancelUseModal(){
    this.setState({showUseModal: false})
  }
  cancelSaveModal(){
    this.setState({showSaveModal: false})
  }
  selectTreeItem(key, name){
    this.setState({selectTreeObj: {key: key, name: name}});
  }
  selectWholePlateTreeItem(index, name, type){
    let {activeKey} = this.state;
    this.setState({
      wholePlate:{
        index:index.join(""),
        name,
        type,
        activeKey,
        visible:true
      }
    })
  }
  // 保存模板 type="all"时，全部保存，否则保存部分
  saveModal(e, type="all"){
    const {selectTreeObj} = this.state;
    const saveModal = this.refs.saveModal;
    if(type=="all"){
      saveModal.clickSaveAll(selectTreeObj);
    }else{
      saveModal.saveData(selectTreeObj)
    }
  }
  render(){

    return(
      <div className="treatMent">
      <Row>
        <Col lg={18} md={16} sm={24} xs={24}>
          <Tabs type="card">
            <TabPane key="1" tab="处方">
              <TreatmentContent ref="content" dispatch={this.props.dispatch} />
            </TabPane>
          </Tabs>
        </Col>
        <Col lg={5} md={7} sm={24} xs={24} offset={1} className="right_fex_option">
          <MedicalList
            midicalData={this.state.midicalData}
            totalPage={this.state.midTotalPage}
            selectId={this.state.historyTemplate.selectId}
            onClickRow={this.onClickMedicalList}
            showFooter="more"
          />
          <Operation
          	inintData={
              [{
                name:"引用模板",
              	icon:"icon-all-template"
              },{
              	name:"处方存为模板",
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
            onClikOperation={this.onClikOperation.bind(this)}
          />
        </Col>
        <Col  id="testPrint3" style={{"display":"none"}}  span={24}>
        	<TreatPrint treatmentTemData = {this.props.treatmentTemData} />
        </Col>
        <div>
        	<SaveTreatment
        		saveVisble={this.state.visible}
        		saveHandleOk={this.saveHandleOk.bind(this)}
        		saveHandleCancel={this.saveHandleCancel.bind(this)}
        		saveModalData = {this.refs.content}
        	/>

        	<CiteTreatment
        		overAllVisble={this.state.overAllVisble}
        		overAllOk={this.overAllOk.bind(this)}
        		overAllCancel={this.overAllCancel.bind(this)}
        	/>
          {/* 患者治疗理疗既往处方模板引用 */}
          <TreatmentHistory
            quoteVisble={this.state.historyTemplate.quoteVisble}
            selectId={this.state.historyTemplate.selectId}
            dishisId={this.state.historyTemplate.dishisId}
            item={this.state.historyTemplate.item}
            allQuote={this.allQuote.bind(this)}
            partQuote={this.partQuote.bind(this)}
            cancel={this.cancel.bind(this)}
          />
        </div>
      </Row>
      </div>
    );
  }
}
Treatment.contextTypes={

};
function mapStateToProps(state){

  return {
  	treatmentTemData:state.treatmentTemData
  }
}
export default connect(mapStateToProps)(Treatment);
