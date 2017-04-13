/*
 * 检验检查
 */

import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import Cookie from "js-cookie";
import {Row,Col,Tabs, Button, Modal, Spin,message} from 'antd';
import CheckContent from "./CheckContent";
const TabPane = Tabs.TabPane;
import MedicalList from "../MedicalList";
import Operation from "../Operation";
import {requestMedicineList, addCheckRecipe,modifyCheckItem,
  removeCheckRecipe, removeAllCheckRecip,templateUpdatamodify,addcloudId} from "../../store/actions/CheckMedicine";
import CheckMedHistory from '../template/CheckMedHistory'
import SaveCheckMed from '../template/SaveCheckMed'
import CiteCheckMed from '../template/CiteCheckMed'
import {postAddrecipelist,getRecipelist,getRecipeDetail,deleteRecipeDetail} from "../../store/actions/Medicine";
import {getUser} from "../../utils/User";
import {loadSave} from "../../store/actions/Comon"
import PubSub from "pubsub-js";
import CheckPrint from '../print/CheckPrint'
class CheckMedicine extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      checkRecipeList: this.props.checkRecipeList,
      data: this.props.data,
      status: this.props.status,
      activeKey: "tab_1",
      panes: [],
      quoteVisble:false,
      dishisId:"",
      visible:false,
      overAllVisble:false,
      historyTemplate:{
        dishisId:'0',
        selectId:'0',
        quoteVisble:false,
        item:{}
      },
      cloud_recipe_id:[],
      printData:[],
      isPrint:false
    }
    this.onChange = this.onChange.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.add =  this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.onClickMedicalList = this.onClickMedicalList.bind(this);
    this.onClikOperation = this.onClikOperation.bind(this);
    this.requestMedicineListCallback = this.requestMedicineListCallback.bind(this);
  }
  componentWillMount(){
	  this.props.dispatch(removeAllCheckRecip());
  }
  componentWillUnmount(){
   
  }
  componentDidMount(){

  	/*this.pubsub_token = PubSub.subscribe("saveData", (data,flag)=>{
      if(flag == 4){
      	this.saveData();
      }
    })*/
    
  	const {data} = this.state;
    const shop_no = getUser().shop_no;


    this.props.dispatch(requestMedicineList({
        method: 9,
        page_size:10000,
        page_no:1,
        source: 1,
        clinicid: shop_no,
        dep_type:'0'
    }, this.requestMedicineListCallback));

  }

  // 在组件接收到新的 props 的时候调用。在初始化渲染的时候，该方法不会调用。
  componentWillReceiveProps(nextProps){

    const {checkRecipeList, data} = nextProps;
   
    const {pane} = this.state;
    let panes = [];
    const typeName=["全部科室", "常规", "妇科", "男科","眼科","皮肤科"];
    checkRecipeList.filter(items=>items.data.length>0).map((item, index)=>{
       panes.push({title: `处方${index+1}`, content: <CheckContent dispatch={this.props.dispatch} index={index} data={item.data} dept_id={`${item.dept_id}`} />, key:`tab_${index+1}`})
    })
    this.setState({panes, loading: false, data:data, checkRecipeList});
  }
  // // 在接收到新的 props 或者 state，将要渲染之前调用。该方法在初始化渲染的时候不会调用，在使用 forceUpdate 方法的时候也不会。
  // shouldComponentUpdate(nextProps, nextState){
  //
  // }
  // 在接收到新的 props 或者 state 之前立刻调用。在初始化渲染的时候该方法不会被调用。
  componentWillUpdate(nextProps, nextState){

  }

  requestMedicineListCallback(json){
    if(json.status !== "0") {
      Modal.error({content: "检验检查项目为空，请联系门店负责人录入检验检查项目。"});
    }
    if(!json.data) {
      Modal.error({content: "检验检查项目为空，请联系门店负责人录入检验检查项目。"});
      json.data = [];
    }
    let json_data = json.data.concat();
    json_data.map((item, index)=>{
        Object.assign( item,
        	{check: false, no: 0, index: index},
        	{item_id:item.itemid},
        	{item_price:item.sell_price});

    })
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
    	if(res.status == "0" && res.data){
    		if(res.data.recipes && res.data.recipes.length>0){
    			let recipeData	= res.data.recipes.filter(item => item.recipe_type == 5);
    			if(recipeData.length>0){
    				for(let j=0;j<recipeData.length;j++){
    					this.props.dispatch(getRecipeDetail({cloud_recipe_id:recipeData[j].cloud_recipe_id,user_id:getUser().reservation_phone,recipe_source:"3", compose:"1"},(resd)=>{
						    let temData = json_data.concat();
						   	temData.map((itemd, index)=>{
						        Object.assign( itemd,
						        	{check: false, no: 0, index: index},
						        	{item_id:itemd.itemid},
						        	{item_price:itemd.sell_price});

						    })
	    					if(resd.status=='0'&&resd.data.items!=null){
	    						for(let m=0;m<resd.data.items.length;m++){
	    							temData.map(function(items){
	    								if(items.item_code.toString() == resd.data.items[m].item_code.toString()){
	    									Object.assign(items,resd.data.items[m],
	    																					{check:true},{index:m},
	    																					{no: resd.data.items[m].item_amount},
	    																					{wst_taking_amount:resd.data.items[m].wst_taking_amount.toString()},
	    																					{wst_taking_days:resd.data.items[m].wst_taking_days.toString()},
	    																					{wst_taking_times:resd.data.items[m].wst_taking_times.toString()},
	    																					{acupoint_id1:resd.data.items[m].acupoint_id1.toString()},
	    																					{acupoint_id2:resd.data.items[m].acupoint_id2.toString()},
	    																					{acupoint_id3:resd.data.items[m].acupoint_id3.toString()},
	    																					{acupoint_id4:resd.data.items[m].acupoint_id4.toString()},
	    																					{quantity:resd.data.items[m].quantity.toString()},
	    																					{usage_id:resd.data.items[m].usage_id.toString()})
	    								}
	    							})
	    						}
	    						this.props.dispatch(addCheckRecipe({data:temData,cloud_recipe_id:recipeData[j].cloud_recipe_id}));
	    					}
	    				}))
    				}
    			}else{
    				this.add();
    			}
    		}else{
    			this.add();

    		}
    	}
    }));

  }
  //就诊记录点击
  onClickRow(item,id){
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
  onChange(activeKey){
    this.setState({activeKey});
  }
  onEdit(targetKey, action){
    this[action](targetKey);
  }
  add(){
    const {data, checkRecipeList} = this.state;
    this.props.dispatch(addCheckRecipe(data));
    
    const activeKey = `tab_${checkRecipeList.length+1}`;
    this.setState({activeKey});
  }
  remove(targetKey){
    const {panes} = this.state;
    if(panes.length<=1) return;
    Modal.confirm({
      content:`确定删除处方吗？`,
      onOk: ()=> this.closeTab(targetKey)
    })
  }
  closeTab(targetKey){
   
    const {panes, checkRecipeList} = this.state;
    let {activeKey} = this.state;
    let lastIndex;
    panes.forEach((pane, i)=>{
      if(pane.key === targetKey){
        lastIndex = i;
      }
    })
    this.props.dispatch(deleteRecipeDetail({cloud_recipe_id:this.props.checkRecipeList[lastIndex].cloud_recipe_id,
  																						operator_desc:getUser().doctor_name,
  																						operator_id:getUser().doctor_id,
  																						compose:"1"
  																					},(res)=>{console.dir(res.message)}))
    this.props.dispatch(removeCheckRecipe({id:lastIndex}));
    if(lastIndex== checkRecipeList.length){
      this.setState({activeKey: `tab_${checkRecipeList.length}`});
    }

  }


  onClickMedicalList(){
  }
  //另存为模板
  casePlate(){

  	if(this.props.checkRecipeList[parseInt(this.state.activeKey.split("_")[1])-1].data.filter(d=>d.check==true).length>0){
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
 	//一健清空
	keyEmpty(){
		
		let copyList = this.props.checkRecipeList.slice();
		copyList[parseInt(this.state.activeKey.split("_")[1])-1].data.map((item)=>{

				Object.assign(item,{check:false},{no:0})
		})
	
		if(this.props.checkRecipeList[parseInt(this.state.activeKey.split("_")[1]-1)].cloud_recipe_id){
      	this.props.dispatch(deleteRecipeDetail({cloud_recipe_id:this.props.checkRecipeList[parseInt(this.state.activeKey.split("_")[1]-1)].cloud_recipe_id,
  																						operator_desc:getUser().doctor_name,
  																						operator_id:getUser().doctor_id,
  																						compose:"1"
  																					},(res)=>{console.dir(res.message)}))
		}
		
	  this.props.dispatch(modifyCheckItem(parseInt(this.state.activeKey.split("_")[1]-1),copyList[parseInt(this.state.activeKey.split("_")[1])-1]));

  }
  saveData(){

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
	this.props.dispatch(loadSave(true));
	this.ajaxData(Array.concat(saveData.filter(item_t => item_t.items.length>0),updataData.filter(item_t => item_t.items.length>0)));
	}
  //检验检查ajax
  ajaxData(recipes){
  
  	if(recipes.length==0){
  		this.props.dispatch(loadSave(false));
			return;
		}
		const postData = {
	  	operator_desc:getUser().doctor_name,
	  	operator_id:getUser().doctor_id,
	  	recipes:recipes
		}

		this.props.dispatch(postAddrecipelist(postData,(res)=>{
			this.props.dispatch(loadSave(false));
	  	if(res.status == '0'&& res.data){
				this.props.dispatch(addcloudId({data:res.data.recipes}));
	  	}else{
	  		Modal.error({
				  title: '校验检查',
				  content: '保存失败',
				});
	  	}

		}))
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

  	this.setState({
  		printData:this.props.checkRecipeList[parseInt(this.state.activeKey.split("_")[1])-1].data.filter(d=>d.check==true)
  	})
  	if(!window.gst){
  		setTimeout(()=>{this.Printpart("testPrint2")},500)
  	}else{
  		this.setState({
	        isPrint:true,
	    })
  		setTimeout(()=>{
				const GST = window.gst ? window.gst : {};
	 			const {printer, printInfo} =  GST;
        message.success('开始打印');
	  		printer.printWeb(document.getElementById("testPrint2").innerHTML, printInfo.recipe,(res)=>{
	        this.setState({
	          isPrint:false,
	        })
	      });
			},500)
  	}
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

  render(){
    const {loading, activeKey, data, checkRecipeList, status} = this.state;
    return(
      <Row>
        <Col lg={18} md={16} sm={24} xs={24}>
          <Spin spinning={loading}>
            <Tabs type="editable-card" hideAdd={false}
              onChange={this.onChange}
              onEdit={this.onEdit}
              activeKey={this.state.activeKey}>
              {this.state.panes.map(pane=><TabPane tab={pane.title} key={pane.key}>{pane.content}</TabPane>)}
            </Tabs>
          </Spin>
        </Col>
        <Col lg={5} md={7} sm={24} xs={24} offset={1} className="right_fex_option">
          <MedicalList
            location={this.props.location}
        		selectId={this.state.historyTemplate.selectId}
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
            onClikOperation={this.onClikOperation}
          />
        </Col>
        <Col  id="testPrint2" style={{"display":"none"}}  span={24}>
        	<CheckPrint checkRecipeList = {this.state.printData} />
        </Col>
        <div>
          {/* 患者既往处方模板引用 */}
          <CheckMedHistory
          	quoteVisble={this.state.historyTemplate.quoteVisble}
            selectId={this.state.historyTemplate.selectId}
            dishisId={this.state.historyTemplate.dishisId}
            item={this.state.historyTemplate.item}
            allQuote={this.allQuote.bind(this)}
  					partQuote={this.partQuote.bind(this)}
  					cancel={this.cancel.bind(this)}
            checkId={parseInt(this.state.activeKey.split("_")[1])}
          />
        </div>
        <div>
        	<SaveCheckMed
        		saveVisble={this.state.visible}
        		saveHandleOk={this.saveHandleOk.bind(this)}
        		saveHandleCancel={this.saveHandleCancel.bind(this)}
        		checkId = {parseInt(this.state.activeKey.split("_")[1])}
        	/>
        </div>
        <div>
        	<CiteCheckMed
        		overAllVisble={this.state.overAllVisble}
        		overAllOk={this.overAllOk.bind(this)}
        		overAllCancel={this.overAllCancel.bind(this)}
        		checkId = {parseInt(this.state.activeKey.split("_")[1])}
        	/>
        </div>
      </Row>
    );
  }
}
CheckMedicine.propTypes={
  checkRecipeList: PropTypes.array.isRequired,
  data:PropTypes.object.isRequired,
  status: PropTypes.string.isRequired
};
function mapStateToProps(state){
  return {
    checkRecipeList: state.checkRecipeList,     // 列表
    data: state.checkMedicineList,              // 服务器端全部检查项目
    status: state.checkMedicineList.status
  }
}
export default connect(mapStateToProps)(CheckMedicine);
