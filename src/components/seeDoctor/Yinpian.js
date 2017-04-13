/*
 * 门诊 中药饮片
 */

import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {Row,Col,Tabs,Table,Button,Input,InputNumber,Select,Modal,message} from 'antd';
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
import MedicalList from "../MedicalList";
import Operation from "../Operation";
import YinpianTabItem from "./YinpianTabItem";
import {deleteZYTab,addZYTab,postAddrecipelist,getRecipelist,getRecipeDetail,deleteRecipeDetail,searchItem,searchUsage,queryDoctorsthList,queryRareList,searchSuggest,searchDetailUsage,searchPreparation,zYMedicineInfo} from "../../store/actions/Medicine";
import {loadSave} from "../../store/actions/Comon"
import ZYMedicineTemplate from "../template/ZYMedicineTemplate";
import ZYUseMedicineTemplate from "../template/ZYUseMedicineTemplate";
import ZYTemplateHistory from '../template/ZYTemplateHistory';
import YinpianPrint from '../print/YinpianPrint';
import {getUser} from "../../utils/User";
import {mul,convertGender,convertTimeToStr,feeDiscountType} from "../../utils/tools";
import Cookie from "js-cookie";
import PubSub from "pubsub-js";
const YINPIAN = "3";
const RECIPESOURCE = "3"; //处方类型
const RELATIONRECIPE = {
  NOFOUNT:'0',
  DOCTOR:'1',//医生
  RAREMEDICINAL:'2',//贵细人员
  PATIENT:'3',//病人
}

class Yinpian extends Component {

  constructor(props){
    super(props);
    this.state = ({
      panes:[],
      visible:false,
      activeKey: "1",
      modalSelectIndex:"",
      modalSelectName:"",
      wholePlate:{
        activeKey:'1',
        index:'',
        name:'',
        type:'0',
        visible:false
      },
      historyTemplate:{
        dishisId:'0',
        selectId:'0',
        quoteVisble:false,
        item:{}
      },
      savePre:{
        saveLoading:false,
      },
      isPrint:false,
      isSimpleOutpatient:false,
    });
  }
  componentWillMount(){

  }
  componentWillUnmount(){
  }
  componentDidMount(){
    // setTimeout(()=>{
      const dataKeyword = {keyword:""};
      //细目用法
      this.props.dispatch(searchDetailUsage(dataKeyword));
      // 制法
      this.props.dispatch(searchPreparation(dataKeyword));
      //用法
      this.props.dispatch(searchUsage({...dataKeyword,medince_type:'中药'}));
      //整剂嘱咐
      this.props.dispatch(searchSuggest(dataKeyword));
      // Cookie.set("reservation_phone", '39',{domain:'.gstzy.cn'});
      //
      const doctorParams = {
        shop_no:getUser().shop_no,
        page_size:500,
        page_no:1,
      }
      //医生列表
      this.props.dispatch(queryDoctorsthList(doctorParams));

      let rareParams = {
        app_id: "8",//15 8
        filter: JSON.stringify({
          filter: [{"key": "raretype", "value": 1},]
        }),
      };
      //贵细人员列表
      this.props.dispatch(queryRareList(rareParams,(json)=>{
      }));
    // },0);
    if(/SimpleOutPatient/.test(this.props.location.pathname)){
      this.setState({
        isSimpleOutpatient:true,
      })
    }
    //获取处方列表
    const data = {
      query_type:1,//患者维度查询处方列表
      // user_id:getUser().user_id,//Cookie.get('reservation_phone')||"",
      user_id:getUser().reservation_phone,//Cookie.get('reservation_phone')||"",
      page_no:1,
      page_size:100,
      registration_deal_id:getUser().deal_id,
      recipe_source:RECIPESOURCE,
      compose:"1"
    }
    this.props.dispatch(getRecipelist(data,(json)=>{
      //区分中药西药
      if(json.status != "0"){
        Modal.error({
          content: json.message,
        });
      }else{
        let flat = true;//是否存在中药处方
        //过滤中药饮片
        if(json.data && json.data.recipes && json.data.recipes.length > 0){
          const d = json.data.recipes.filter(obj => obj.recipe_type == YINPIAN);
          //遍历处方详情
          let tabList = [];
          for (var i = 0; i < d.length; i++) {
            const obj = d[i];
            // if(obj.recipe_type != YINPIAN){continue;}//过滤中药饮片
            flat = false;//查到中药饮片处方
            //添加tab
            tabList.push({ title: '处方', content: <YinpianTabItem isSimpleOutpatient={this.state.isSimpleOutpatient} name={(i+1)+""}/>,key:i+1+""});
            ((cloud_recipe_id,user_id,i)=>{
              this.props.dispatch(getRecipeDetail({cloud_recipe_id:cloud_recipe_id,user_id:user_id,compose:"1",recipe_source:RECIPESOURCE},(json)=>{
                if(json.data.items){
                  for (var j = 0; json.data.items && j < json.data.items.length ; j++) {
                    json.data.items[j].item_amount += "";
                    json.data.items[j].item_price += "";
                    json.data.items[j].item_type += "";
                    json.data.items[j].usage_id += "";
                    json.data.items[j].wst_taking_amount += "";
                    json.data.items[j].wst_taking_days += "";
                  }
                }else{
                  json.data.items = []
                }
                this.sendMedicineData(json.data.items,json.data,(i+1)+"")
              }))
            })(obj.cloud_recipe_id,obj.user_id,i)
          }
          this.setState({
            activeKey: "1",
            panes:[...tabList]
          });
        }
        if(flat){
          //没有查询到处方的
          const panes = [
            { title: '处方', content: <YinpianTabItem isSimpleOutpatient={this.state.isSimpleOutpatient} name={'1'}/>,key:"1"},
          ];
          this.setState({
            activeKey: "1",
            panes
          });
        }
      }
    }))
  }
  //拼接数据
  sendMedicineData(data,info,key){
    // 遍历药品
    let count = 0;
    if(data.length == 0){
      const tData = {
        process_desc:"",//制法
        process_type:'0',
        usage_desc:"",//用法
        usage_id:'0',
        quantity:"7",//总剂
        usage_amount_desc:"1",//每日n剂
        taking_desc:"",//嘱咐
        taking_id:'0',
        total_price:"0",//总价格
        items:[{
          item_amount:"0",
          item_code:"0",
          item_id:"1",
          item_name:"",
          item_price:"0",
          item_type:"0",
          item_unit:"",
          total_amount:"0",
          total_price:"0",
          usage_desc:"",
          usage_id:"0",
          min_unit:'1',
          wst_spec:"0",
          wst_taking_amount:"0",
          wst_taking_days:"0",
          wst_taking_desc:"",
          wst_taking_times:"",
          wst_taking_unit:"",
        }]
      }
      this.props.dispatch(addZYTab({name:key,data:tData}));
      return ;
    }
    for (let i = 0; i < data.length; i++) {
      if(data[i].item_name =='丸剂加工费（大于100克）'||
      data[i].item_name =='丸剂加工费（小于等于100克）'||
      data[i].item_name =='膏方制作费（400）'||
      data[i].item_name =='膏方制作费（300）'){
        data[i].acupoint_id1=data[i].acupoint_id1+"";
        data[i].acupoint_id2=data[i].acupoint_id2+"";
        data[i].acupoint_id3=data[i].acupoint_id3+"";
        data[i].acupoint_id4=data[i].acupoint_id4+"";
        data[i].quantity=data[i].quantity+"";
        data[i].item_type = "0";
        count++;
        continue;
      }
      ((index)=>{
        const item_data = {
          keyword:data[index].item_name,
          // pharmacy_type:1<<0,//1<<0中医药房 1<<1西医药房 1<<2 贵细药房 1<<3供应室
          item_type:1<<0,// 1<<0中药饮片 1<<1中成药 1<<2 西药 1<<3 耗材
          shop_no:getUser().shop_no,
        }
        this.props.dispatch(searchItem(item_data,(json)=>{
          if(json.status == '0' && json.data.length > 0){
            for (var j = 0; j < json.data.length; j++) {
              if(json.data[j].value == data[index].item_name){
                //穴位 中药饮片不需要
                data[index].acupoint_id1=data[index].acupoint_id1+"";
                data[index].acupoint_id2=data[index].acupoint_id2+"";
                data[index].acupoint_id3=data[index].acupoint_id3+"";
                data[index].acupoint_id4=data[index].acupoint_id4+"";
                data[index].quantity=data[index].quantity+"";
                data[index].item_type = "0";

                data[index].item_name = json.data[j].value + "";
                data[index].item_id = json.data[j].item_id + "";
                data[index].item_code = json.data[j].item_code + "";
                data[index].fee_type = json.data[j].fee_type + "";
                data[index].item_price = json.data[j].price + "";
                data[index].standard = json.data[j].standard + "";
                data[index].item_unit = json.data[j].presciption_unit + "";
                data[index].min_unit = json.data[j].min_unit + "";
                data[index].wst_taking_unit = json.data[j].unit + "";
                data[index].total_price = mul(data[index].total_amount , data[index].item_price)+"";
                //库存
                data[index].stock = json.data[j].stock + "";
                data[index].status = json.data[j].status + "";
                //禁用标识
                data[index].disable = json.data[j].disable + "";
                break;
              }
            }
            count++;
            if(count > data.length - 1){
              info.items = [...data,{
                item_amount:"0",
                item_code:"0",
                item_id:"1",
                item_name:"",
                item_price:"",
                item_type:"0",
                item_unit:"",
                min_unit:'1',
                total_amount:"0",
                total_price:"",
                usage_desc:"",
                usage_id:"",
                wst_spec:"",
                wst_taking_amount:"",
                wst_taking_days:"",
                wst_taking_desc:"",
                wst_taking_times:"",
                wst_taking_unit:"",
              }];
              this.props.dispatch(addZYTab({name:key,data:info}))
            }
          }else{
            //没有找到该要
          }
        }));
      }
      )(i)
    }

  }
  onChange(activeKey){
    this.setState({
      activeKey:activeKey
    })
  }
  onEdit(targetKey, action) {
    switch (action) {
      case "remove":{
        this.removeTab(targetKey)
        break;
      }
      case "add":{
        this.addTab();
        break;
      }
      default:
    }
  }
  //删除tab
  removeTab(targetKey){
    let {panes} = this.state;
    const _self = this;
    if(panes.length < 2){
      return;
    }
    //遍历查找对应的key
    for (var i = 0; i < panes.length; i++) {
      if(panes[i].key == targetKey){
        confirm({
          title: '是否删除处方'+(parseInt(i)+1),
          onOk() {
            const {prescriptionInfo,recipelist} = _self.props;
            if(!!prescriptionInfo[targetKey].cloud_recipe_id&&+prescriptionInfo[targetKey].cloud_recipe_id > 10){
              //删除处方
              const delData = {
                cloud_recipe_id:prescriptionInfo[targetKey].cloud_recipe_id,
                operator_desc:getUser().doctor_name,
                operator_id:getUser().doctor_id,
                registration_deal_id:getUser().deal_id,//挂号ID
                recipe_source:RECIPESOURCE,
                compose:'1',
              }
              _self.props.dispatch(deleteRecipeDetail(delData,(json)=>{
                if(+json.status == 0){
                  panes.splice(i,1);
                  if(targetKey == _self.state.activeKey){
                    _self.setState({
                      panes:panes,
                      activeKey:panes[0].key,
                    })
                  }else{
                    _self.setState({
                      panes:panes,
                    })
                  }
                  _self.props.dispatch(deleteZYTab({name:targetKey}));
                }else{
                  message.error(json.message);
                }
              }))
            }else{
              panes.splice(i,1);
              if(targetKey == _self.state.activeKey){
                _self.setState({
                  panes:panes,
                  activeKey:panes[0].key,
                })
              }else{
                _self.setState({
                  panes:panes,
                })
              }
              _self.props.dispatch(deleteZYTab({name:targetKey}));
            }
          },
          onCancel() {},
        });
        break;
      }
    }
  }
  //新增tab
  addTab(){
    let {panes} = this.state;
    const key = parseInt(panes[panes.length-1].key)+1;
    panes.push({ title: '处方', content: <YinpianTabItem isSimpleOutpatient={this.state.isSimpleOutpatient} name={key+""}/>,key:key+""});
    const data = {
      process_desc:"",//制法
      process_type:'0',
      usage_desc:"",//用法
      usage_id:'0',
      quantity:"7",//总剂
      usage_amount_desc:"1",//每日n剂
      taking_desc:"",//嘱咐
      taking_id:'0',
      total_price:"0",//总价格
      items:[{
        item_amount:"0",
        item_code:"0",
        item_id:"1",
        item_name:"",
        item_price:"0",
        item_type:"0",
        item_unit:"",
        total_amount:"0",
        total_price:"0",
        usage_desc:"",
        usage_id:"0",
        wst_spec:"0",
        min_unit:'1',
        wst_taking_amount:"0",
        wst_taking_days:"0",
        wst_taking_desc:"",
        wst_taking_times:"",
        wst_taking_unit:"",
      }]
    }
    this.setState({
      panes:panes,
    })
    this.addRecipeData(panes,key,data);
  }
  addRecipeData(panes,key,data){
    this.props.dispatch(addZYTab({name:key,data:data}));
    this.setState({
      activeKey: key+"",
    });
  }
  wholePlate(){
    let {wholePlate,activeKey} = this.state;
    wholePlate.visible = true;
    wholePlate.activeKey=activeKey;
    this.setState({
      wholePlate
    })
  }

  selectWholePlateTreeItem(index,name,type){
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
  usePreAllTemplateChildren(){
    switch (this.state.wholePlate.type) {
      case '0':{
        return (<UsePreAllZYTemplate wholePlate={this.state.wholePlate} buttonClick={this.cancelWholePlateClick.bind(this)}/>);
        break;
      }
      case '1':{
        return (<div>中西成药</div>);
        break;
      }
      case '2':{
        return (<div>校验检查</div>);
        break;
      }
      case '3':{
        return (<div>治疗理疗</div>);
        break;
      }
      case '4':{
        return (<div>普通方</div>);
        break;
      }
      case '5':{
        return (<div>协定方</div>);
        break;
      }
      case '6':{
        return (<div>经验方</div>);
        break;
      }
      default:
    }
  }
  cancelWholePlateClick(){
    let {wholePlate} = this.state;
    wholePlate.visible = false;
    this.setState({
      wholePlate
    })
  }

  casePlate(){
    const {prescriptionInfo} = this.props;
    if(prescriptionInfo[this.state.activeKey].items.length< 2){
      message.error('处方信息为空，不能保存为模板')
    }else{
      this.setState({
        visible:true
      })
    }
  }
  keyEmpty(){
    const {prescriptionInfo,recipelist} = this.props;
    if(!!prescriptionInfo[this.state.activeKey].cloud_recipe_id&&+prescriptionInfo[this.state.activeKey].cloud_recipe_id > 10){
      //删除处方
      const delData = {
        cloud_recipe_id:prescriptionInfo[this.state.activeKey].cloud_recipe_id,
        operator_desc:getUser().doctor_name,
        operator_id:getUser().doctor_id,
        registration_deal_id:getUser().deal_id,//挂号ID
        recipe_source:RECIPESOURCE,
        compose:'1',
      }
      this.props.dispatch(deleteRecipeDetail(delData,(json)=>{
        if(+json.status == 0){
          this.emptyRecipes();
        }else{
          message.error(json.message);
        }
      }));
    }else{
      this.emptyRecipes();
    }
  }
  emptyRecipes(){
    const data = {
      process_desc:"",//制法
      process_type:'0',
      usage_desc:"",//用法
      usage_id:'0',
      quantity:"7",//总剂
      usage_amount_desc:"1",//每日n剂
      taking_desc:"",//嘱咐
      taking_id:'0',
      total_price:"0",//总价格
      items:[{
        item_amount:"0",
        item_code:"0",
        item_id:"1",
        item_name:"",
        item_price:"0",
        item_type:"0",
        item_unit:"",
        total_amount:"0",
        total_price:"0",
        usage_desc:"",
        usage_id:"0",
        wst_spec:"0",
        min_unit:'1',
        wst_taking_amount:"0",
        wst_taking_days:"0",
        wst_taking_desc:"",
        wst_taking_times:"",
        wst_taking_unit:"",
      }]
    }
    this.props.dispatch(addZYTab({name:this.state.activeKey,data:data}))
  }
  printPlate(){
    const GST = window.gst ? window.gst : {};
    const {printer, printInfo} =  GST;
    this.setState({
      isPrint:true,
    });
    message.success('开始打印');
    if(printer){
      printer.printWeb(document.getElementById("yinpianPrint").innerHTML, printInfo.recipe,(res)=>{
        this.setState({
          isPrint:false,
        })
      });
    }
  }
  //使用模板
  useCasesTemplate(name){
    switch (name) {
      case "引用整体模板":{
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
        this.savePrescriptionInfo();
      }
        break;
      default:
    }
  }
  //隐藏模板
  cancelClick(){
    this.setState({
      visible:false
    })
  }
  selectTreeItem(index,name){
    this.setState({
      modalSelectIndex:index.join(),
      modalSelectName:name
    })
  }
  //计算总价格
  calcTotalPrice(data){
    const len = data.length;
    let sum = 0;
    for (var i = 0; i < data.length-1;i++) {
      let num = data[i].total_price ? data[i].total_price:0;
      sum += +num;
    }
    return sum+"";
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

  //刷新处方列表
  refreshRecipe(){
    setTimeout(()=>{
      const data = {
        query_type:1,//患者维度查询处方列表
        // user_id:getUser().user_id,//Cookie.get('reservation_phone')||"",
        user_id:getUser().reservation_phone,//Cookie.get('reservation_phone')||"",
        page_no:1,
        page_size:20,
        registration_deal_id:getUser().deal_id,
        recipe_source:RECIPESOURCE,
        compose:'1',
      }
      this.props.dispatch(getRecipelist(data));
    },2000);
  }
  //保存处方
  savePrescriptionInfo(endSeeDoctor){
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
    //保存按钮
    let {savePre} = this.state;
    savePre.saveLoading = true;
    this.props.dispatch(loadSave(true));
    this.setState({savePre});
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
        total_price:this.calcTotalPrice(prescriptionInfo[variable].items)+"",
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
    if(preFlat){
      //保存按钮
      let {savePre} = this.state;
      savePre.saveLoading = false;
      this.props.dispatch(loadSave(false));
      this.setState({savePre});
      return;
    }
    if(emptyList.length>0){
      //保存按钮
      message.error("中药饮片"+emptyList.join(',')+"存在金额为零的药品，不能保存处方",5);
      let {savePre} = this.state;
      savePre.saveLoading = false;
      this.props.dispatch(loadSave(false));
      this.setState({savePre});
      return;
    }
    const data = {
      operator_desc:getUser().doctor_name,
      operator_id:getUser().doctor_id,
      recipes:list
    }
    this.props.dispatch(postAddrecipelist(data,(json)=>{
      let {savePre} = this.state;
      savePre.saveLoading = false;
      this.props.dispatch(loadSave(false));
      this.setState({savePre});
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
      }else{
        message.error(json.message);
      }
    }))
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

  render(){
    const {medicineNameList,prescriptionInfo} = this.props;
    const {savePre} = this.state;
    // 打印信息
    const printParams = {
      shopName:getUser().shop_name,
      recipeTypeName:'普通',
      drugNumber:'---',
      recipeFeeType:feeDiscountType(getUser().fee_discount_type),
      medicalCard:'医疗卡号',
      recipeCard:'处方编号',
      QRcode:"http://local.gstzy.cn:2085/QRcode.png",
      money:this.calcTotalPrice(prescriptionInfo[this.state.activeKey].items),
      patientInfo:{
        name:getUser().patient_name,
        age:getUser().patient_age,
        sex:getUser().patient_sex,
        sexName:convertGender(getUser().patient_sex),
        address:"",
        phone:getUser().reservation_phone,
        clinicalDiagnosis:this.props.zxDiagnose.clinilValue.trim() +" "+this.props.zxDiagnose.mediciValue.trim(),
        printDate:convertTimeToStr(new Date(),'yyyy-MM-dd hh:mm:ss'),
        outpatientNumber:getUser().deal_id,
        category:getUser().department_name,
      },
      doctorInfo:{
        doctorName:getUser().doctor_name,
        achievementsName:prescriptionInfo[this.state.activeKey].achievements_name,
        doctorId:getUser().doctor_id,
      },
      recipe:{
        processDesc:prescriptionInfo[this.state.activeKey].process_desc,
        quantity:prescriptionInfo[this.state.activeKey].quantity,
        usage_amount_desc:prescriptionInfo[this.state.activeKey].usage_amount_desc,
        usage_desc:prescriptionInfo[this.state.activeKey].usage_desc,
        taking_desc:prescriptionInfo[this.state.activeKey].taking_desc,
        recipelist:[...prescriptionInfo[this.state.activeKey].items]
      }
    }
    return(
      <Row className="yinpin">
        <Col lg={18} md={16} sm={24} xs={24} className="yinpin-tabs">
          <Tabs
            onChange={this.onChange.bind(this)}
            activeKey={this.state.activeKey}
            type="editable-card"
            onEdit={this.onEdit.bind(this)}
          >
            {this.state.panes.map((pane,index) => <TabPane tab={pane.title+(index+1)} key={pane.key}>{pane.content}</TabPane>)}
          </Tabs>
        </Col>
        <Col lg={5} md={7} sm={24} xs={24} offset={1} className="right_fex_option">
          <MedicalList
            onClickRow={this.onClickRow.bind(this)}
            selectId={this.state.historyTemplate.selectId}
            showFooter="more"
          />
          <Operation
            saveLoading={savePre.saveLoading}
            inintData={
              [{
                name:"引用整体模板",
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
            onClikOperation={this.useCasesTemplate.bind(this)}
          />
        </Col>
        <div>
          {/* 中医保存为模板 */}
          <ZYMedicineTemplate
            saveVisble={this.state.visible}
            saveHandleOk={this.cancelClick.bind(this)}
            saveHandleCancel={this.cancelClick.bind(this)}
            checkId = {this.state.activeKey}
          />
          {/* 医生既往处方模板引用 */}
          <ZYUseMedicineTemplate
            overAllVisble={this.state.wholePlate.visible}
            overAllOk={this.cancelWholePlateClick.bind(this)}
            overAllCancel={this.cancelWholePlateClick.bind(this)}
            checkId = {this.state.activeKey}
          />
          {/* 患者既往处方模板引用 */}
          <ZYTemplateHistory
          	quoteVisble={this.state.historyTemplate.quoteVisble}
  					selectId={this.state.historyTemplate.selectId}
            dishisId={this.state.historyTemplate.dishisId}
            item={this.state.historyTemplate.item}
            allQuote={this.allQuote.bind(this)}
  					partQuote={this.partQuote.bind(this)}
  					cancel={this.cancel.bind(this)}
            checkId = {this.state.activeKey}
          />
        </div>
        <div id='yinpianPrint' style={{'display':'none'}}>
          <YinpianPrint printParams={printParams} type={'1'}/>
        </div>
      </Row>
    );
  }
}


Yinpian.contextTypes={
  router: PropTypes.object.isRequired,
};
Yinpian.propTypes = {
  medicineNameList:PropTypes.object,
  prescriptionInfo:PropTypes.object,
  patientinfo:PropTypes.object,
  recipelist:PropTypes.object,
};
function mapStateToProps(state){
  return {
    medicineNameList:state.medicineNameList,
    prescriptionInfo:state.prescriptionInfo,
    recipelist:state.recipelist,
    zxDiagnose:state.zxDiagnose
  }
}
export default connect(mapStateToProps)(Yinpian)
