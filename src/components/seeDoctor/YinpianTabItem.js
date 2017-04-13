import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {getUser} from "../../utils/User";
import {mul,div} from "../../utils/tools";
import {ZFItemId} from "../../utils/public";

import {Row,Col,Table,Button,Input,InputNumber,Select,Modal,message,Tooltip} from 'antd';
const Option = Select.Option;
const confirm = Modal.confirm;

import {changeZYMedicine,deleteZYMedicine,zYMedicineInfo,clearSearchItem,searchItem} from "../../store/actions/Medicine";

import InputFocus from "../InputFocus";

//简易门诊关联医生
import SimpleSelectComponent from "./SimpleSelectComponent";


// 060600200001  100024   4000000  膏方制作费（400）
// 060600200002  100025   3000000  膏方制作费（300）
//
// 060600400002  100027   500000   丸剂加工费（小于等于100克）
// 060600400001  100026   600      丸剂加工费（大于100克）


class YinpianTabItem extends Component {
  constructor(props){
    super(props);
    this.static = {
      clearTime:"",
      itemCell:{
        item_type:'0',
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
      },
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
    }
    this.static = Object.assign({},this.static,ZFItemId[getUser().shop_no]);
    this.state = {
      drugSelectItem:{
        drugIndex:'-1',
      },
      herbalPlaster:{
        msg:'请另增独立处方开颗粒剂/协定方成品，再选择制法！',
        visible:false,
        time:5000,
      },
      herbalPlasterTwo:{
        msg:'已选制法的处方不能含颗粒剂/协定方成品，请先放弃制法！',
        visible:false,
        drugIndex:'-1',
        time:5000,
      }
    }
  }
  componentWillMount(){

  }
  componentDidMount(){
  }
  //cell删除
  onDelete(index,record){
    return ()=>{
      const {prescriptionInfo,name} = this.props;
      let medicineInfo = prescriptionInfo[name].items;
      for (var i = 0; i < medicineInfo.length; i++) {
        if(medicineInfo[i].item_name ==record.item_name){
          medicineInfo.splice(i, 1);
          if(medicineInfo.filter(item=>/^01/.test(item.item_code)).length == 0){
            this.deleteZf(medicineInfo,name);
          }else{
            this.props.dispatch(deleteZYMedicine({items:medicineInfo,name}));
            this.calcProcessSum(prescriptionInfo[name].process_desc);
          }
          break;
        }
      }

      // medicineInfo.splice(index, 1);
      // this.props.dispatch(deleteZYMedicine({items:medicineInfo,name}));
    }
  }

  //药品名称改变
  medicineNameChangeFilterOption(index,value){
    let {drugSelectItem} = this.state;
    drugSelectItem = Object.assign({},drugSelectItem,{
      value:value
    })
    this.setState({
      drugSelectItem
    })
    if(this.static.clearTime){
      clearTimeout(this.static.clearTime);
    }
    this.static.clearTime = setTimeout(()=>{
      const data = {
        keyword:value,
        // pharmacy_type:1<<0,//1<<0中医药房 1<<1西医药房 1<<2 贵细药房 1<<3供应室
        item_type:1<<0,// 1<<0中药饮片 1<<1中成药 1<<2 西药 1<<3 耗材
        shop_no:getUser().shop_no,
      }
      this.props.dispatch(searchItem(data));
    },200);
  }
  medicineNameChange(index,value){
    let {drugSelectItem} = this.state;
    drugSelectItem = Object.assign({},drugSelectItem,{
      drugIndex:index,
    });
    this.medicineNameChangeFilterOption(index,value);
    // this.medicineNameSelect(index,value);
  }
  medicineNameSelect(index,value){
    const {prescriptionInfo,name,drugList} = this.props;
    let drugItem = {};
    for (var i = 0; i < drugList.data.length; i++) {
      if(drugList.data[i].value == value){
      drugItem = drugList.data[i];
      break;
      }
    }
    let {drugSelectItem} = this.state;
    drugSelectItem = Object.assign({},drugSelectItem,{
      ...drugItem
    })
    this.setState({
      drugSelectItem
    })
  }
  medicineNameOnFocusFilterOption(index,value){
    const {prescriptionInfo,name,drugList} = this.props;
    let medicineInfo = prescriptionInfo[name].items;
    let {drugSelectItem} = this.state;
    drugSelectItem = Object.assign({},drugSelectItem,{
      drugIndex:index,
      value:medicineInfo[index].item_name
    })
    this.setState({
      drugSelectItem
    });
    const data = {
      keyword:medicineInfo[index].item_name,
      // pharmacy_type:1<<0,//1<<0中医药房 1<<1西医药房 1<<2 贵细药房 1<<3供应室
      item_type:1<<0,// 1<<0中药饮片 1<<1中成药 1<<2 西药 1<<3 耗材
      shop_no:getUser().shop_no,
    }
    this.props.dispatch(searchItem(data));
  }

  medicineNameOnBlurFilterOption(index,value){
    let {drugSelectItem} = this.state;
    const {drugIndex} = drugSelectItem;
    drugSelectItem = Object.assign({},{
      drugIndex:'-1',
    })
    this.setState({
      drugSelectItem
    })
    let {prescriptionInfo,name,drugList} = this.props;
    let medicineInfo = prescriptionInfo[name].items;
    let tempDrugListObj = {};
    if(drugList.data&&drugList.data.length>0){
      drugList.data = drugList.data.filter(item=>(+item.stock>0||(+item.disable&1<<1)!="2"));
    }
    //删除药品空白行
    if(!value||value.length == 0){
      if(medicineInfo.length == index+1){
        this.sendDrug(medicineInfo,index,"",{},name,drugIndex);
      }else{
        medicineInfo.splice(index, 1);
        // if(medicineInfo.length ==2){
        if(medicineInfo.filter(item=>/^01/.test(item.item_code)).length == 0){
          this.deleteZf(medicineInfo,name);
        }else{
          this.props.dispatch(deleteZYMedicine({items:medicineInfo,name}));
          setTimeout(()=>{
            const {prescriptionInfo,name} = this.props;
            this.calcProcessSum(prescriptionInfo[name].process_desc);
          },200);
        }
      }
      return;
    }
    for (var i = 0; i < drugList.data.length; i++) {
      tempDrugListObj[drugList.data[i].value] = drugList.data[i];
      if(drugList.data[i].value == value){
        if((medicineInfo.filter(item=>item.item_name == value  && (+item.stock>0||(+item.disable&1<<1)!="2"))).length == 0){
          this.sendDrug(medicineInfo,index,value,drugList.data[i],name,drugIndex);
        }
        return;
      }
    }
    for (var i = 0; i < drugList.data.length; i++) {
      if(drugList.data[i].value.includes(value)){
        if((medicineInfo.filter(item=>item.item_name.includes(value) && (+item.stock>0||(+item.disable&1<<1)!="2") )).length == 0){
          this.sendDrug(medicineInfo,index,drugList.data[i].value,drugList.data[i],name,drugIndex);
        }
        return;
      }
    }
    for (var j = 0; j < medicineInfo.length; j++) {
      if(index == j){
        continue;
      }
      delete tempDrugListObj[medicineInfo[j].item_name];
    }
    //tempDrugListObj 是否为空
    let flat = true;
    for (var item in tempDrugListObj) {
      flat = false;
      this.sendDrug(medicineInfo,index,tempDrugListObj[item].value,tempDrugListObj[item],name,drugIndex);
      break;
    }
    if(flat && medicineInfo.length != (index + 1)){
      // this.sendDrug(medicineInfo,index,"",{},name);
      medicineInfo.splice(index, 1);
      if(medicineInfo.filter(item=>/^01/.test(item.item_code)).length == 0){
        this.deleteZf(medicineInfo,name);
      }else{
        this.props.dispatch(deleteZYMedicine({items:medicineInfo,name}));
        setTimeout(()=>{
          const {prescriptionInfo,name} = this.props;
          this.calcProcessSum(prescriptionInfo[name].process_desc);
        },200);
      }
      // this.props.dispatch(deleteZYMedicine({items:medicineInfo,name}));
      // setTimeout(()=>{
      //   const {prescriptionInfo,name} = this.props;
      //   this.calcProcessSum(prescriptionInfo[name].process_desc);
      // },200);
    }
  }
  //清空药品信息
  clearDrugList(){
    this.props.dispatch(clearSearchItem());
  }
  //判断是否存在
  isHasHerbalPlaster(process_desc,drugItem,drugIndex){
    if(!!process_desc && /^010[23]/.test(drugItem.item_code)){
      let {herbalPlasterTwo} = this.state;
      herbalPlasterTwo = Object.assign({},herbalPlasterTwo,{visible:true,drugIndex:drugIndex});
      this.setState({
        herbalPlasterTwo
      });
      setTimeout(()=>{
        herbalPlasterTwo = Object.assign({},herbalPlasterTwo,{visible:false,drugIndex:'-1'});
        this.setState({
          herbalPlasterTwo
        });
      },herbalPlasterTwo.time);
      return true;
    }
    return false;
  }
  //修改药品信息
  sendDrug(medicineInfo,index,value,drugItem,name,drugIndex){
    drugItem=Object.assign({min_unit:'1'},drugItem);
    const {prescriptionInfo} = this.props;
    if(this.isHasHerbalPlaster(prescriptionInfo[name].process_desc,drugItem,drugIndex)){
      return;
    }
    medicineInfo[index].item_amount = '1';
    medicineInfo[index].total_amountTwo = prescriptionInfo[name].quantity + "";
    medicineInfo[index].item_name = value;
    medicineInfo[index].item_id = drugItem.item_id||"";
    medicineInfo[index].item_code = drugItem.item_code||"";
    medicineInfo[index].fee_type = drugItem.fee_type||"2";
    medicineInfo[index].item_price = drugItem.price||"0";
    medicineInfo[index].standard = drugItem.standard||"";
    medicineInfo[index].item_unit = drugItem.presciption_unit||"";
    medicineInfo[index].wst_taking_unit = drugItem.unit||"";
    medicineInfo[index].min_unit = drugItem.min_unit||"";
    medicineInfo[index].stock = drugItem.stock||"";
    medicineInfo[index].disable = drugItem.disable||"";
    medicineInfo[index].status = drugItem.status||"";
    if(medicineInfo[index].wst_taking_unit == "g" || medicineInfo[index].wst_taking_unit == "克"){
      medicineInfo[index].total_amount = Math.round((+prescriptionInfo[name].quantity/+drugItem.min_unit)*10)/10 + "";
    }else{
      medicineInfo[index].total_amount = Math.ceil(+prescriptionInfo[name].quantity/+drugItem.min_unit) + "";
    }
    medicineInfo[index].total_price = mul(medicineInfo[index].total_amount,medicineInfo[index].item_price)+"";
    medicineInfo[index].fee_type += "";
    medicineInfo[index].item_price += "";

    this.props.dispatch(changeZYMedicine({items:medicineInfo,name}));
    // this.clearDrugList();
    setTimeout(()=>{
      const {prescriptionInfo,name} = this.props;
      this.calcProcessSum(prescriptionInfo[name].process_desc);
    },200);
  }
  //计算总价格
  calcTotalPrice(data){
    const len = data.length;
    let sum = 0;
    for (var i = 0; i < data.length-1;i++) {
      let num = data[i].total_price ? data[i].total_price:0;
      sum += +num;
    }
    return +sum/10000;
  }

  //每次剂量改变
  medicineNumChange(index,value){
    if(!value){
      value="0";
    }
    value = (value+"").replace(/(\d*.\d)\d*/,"$1");
    const {prescriptionInfo,name} = this.props;
    let medicineInfo = [...prescriptionInfo[name].items];
    if(medicineInfo[index].item_name && medicineInfo[index].item_name.length >= 0){
      if(this.isMoreThanStock(value,prescriptionInfo[name].quantity,medicineInfo[index])){
        medicineInfo[index].item_amount = value+"";
        medicineInfo[index].total_amountTwo = mul(value , prescriptionInfo[name].quantity)+"";
        if(medicineInfo[index].wst_taking_unit == "g" || medicineInfo[index].wst_taking_unit == "克"){
          medicineInfo[index].total_amount = Math.round((+mul(value , prescriptionInfo[name].quantity)/+medicineInfo[index].min_unit)*10)/10 + "";
        }else{
          medicineInfo[index].total_amount = Math.ceil(+mul(value , prescriptionInfo[name].quantity)/+medicineInfo[index].min_unit)+"";
        }
        medicineInfo[index].total_price = mul(medicineInfo[index].total_amount , medicineInfo[index].item_price)+"";
        this.props.dispatch(changeZYMedicine({items:medicineInfo,name}));
      }
      setTimeout(()=>{
        const {prescriptionInfo,name} = this.props;
        this.calcProcessSum(prescriptionInfo[name].process_desc);
      },200);
    }else{
      message.error('药品名称不能为空,请先填写药品名称,再填写每次剂量');
    }
  }
  //是否不超过库存 每次剂量:perCount  总剂:quantity 药品详情:drugItem
  isMoreThanStock(perCount,quantity,drugItem){
    if((+drugItem.disable&1<<1)!="2"){
      return true;
    }
    if(mul(perCount,quantity) > +drugItem.stock){
      message.error(`药品总量超过库存,${drugItem.item_name}的最大库存为${+drugItem.stock+drugItem.item_unit}`);
      return false;
    }
    return true;
  }
 //总剂
 totalChange(value){
   if(!value){
     value="0";
   }
   const {prescriptionInfo,name} = this.props;
   let medicineInfo = [...prescriptionInfo[name].items];
   const data = {
     name,
     [name]:{
       quantity:value,
     }
   }
   let isOverFlow = true;
   for (var i = 0; i < medicineInfo.length-1;i++) {
     if(!this.isMoreThanStock(medicineInfo[i].item_amount,value,medicineInfo[i])){
       isOverFlow = false;
       break;
     }
   }
   if(isOverFlow){
     for (var i = 0; i < medicineInfo.length-1;i++) {
       if(/^0606/.test(medicineInfo[i].item_code)){
         continue;
       }
       medicineInfo[i].total_amountTwo =mul(medicineInfo[i].item_amount , value) + "";
       if(medicineInfo[i].wst_taking_unit == "g" || medicineInfo[i].wst_taking_unit == "克"){
         medicineInfo[i].total_amount = Math.round((mul(medicineInfo[i].item_amount , value)/+medicineInfo[i].min_unit)*10)/10 + "";
       }else{
         medicineInfo[i].total_amount =Math.ceil(mul(medicineInfo[i].item_amount , value)/+medicineInfo[i].min_unit) + "";
       }
      //  medicineInfo[i].total_amount =Math.ceil(mul(medicineInfo[i].item_amount , value)/+medicineInfo[i].min_unit) + "";
       medicineInfo[i].total_price = mul(medicineInfo[i].total_amount , medicineInfo[i].item_price) + "";
     }
     this.props.dispatch(zYMedicineInfo(data));
     this.props.dispatch(changeZYMedicine({items:medicineInfo,name}));
   }
   setTimeout(()=>{
     const {prescriptionInfo,name} = this.props;
     this.calcProcessSum(prescriptionInfo[name].process_desc);
   },200);
 }
 //每日总剂
 perTotalChange(value){
   if(!value){
     value="0";
   }
   const {name} = this.props;
   const data = {
     name,
     [name]:{
       usage_amount_desc:value,
     }
   }
   this.props.dispatch(zYMedicineInfo(data));
 }
 //细目用法修改
 usageChangeFilterOption(input){
  //  if (!input) {
  //    input = "";
  //  }
  //  const data = {
  //    keyword:input,
  //  }
  //  this.props.dispatch(searchDetailUsage(data));
 }
 onBlurUsageChangeFilterOption(index,value){
   const {prescriptionInfo,name} = this.props;
   let medicineInfo = prescriptionInfo[name].items;
   if(medicineInfo[index].item_name && medicineInfo[index].item_name.length >= 0){
     const {usageDescList} = this.props;
     const d = usageDescList.data.filter(
       (item)=>item.value.includes(value)||
       item.pinyin.includes(value)||
       item.wubi.includes(value));
     if(d.length > 0 && value.length>0){
       this.usageSelect(index,d[0].value);
     }else{
       this.usageSelect(index,'');
     }
   }else{
     this.usageSelect(index,'');
     message.error('药品名称不能为空,请先填写药品名称,再填写细目用法');
   }
 }
 usageChange(index,value){
   this.usageChangeFilterOption(value);
   this.usageSelect(index,value);
 }
 usageSelect(index,value){
   const {prescriptionInfo,name,usageDescList} = this.props;
   const d = usageDescList.data.filter((item)=>item.value == value);
   let medicineInfo = prescriptionInfo[name].items;
   if(medicineInfo[index].item_name && medicineInfo[index].item_name.length >= 0){
     medicineInfo[index].usage_desc = value;
     if(d.length>0){
       medicineInfo[index].usage_id = d[0].num_code;
     }
     this.props.dispatch(changeZYMedicine({items:medicineInfo,name}));
   }else{
     medicineInfo[index].usage_desc = "";
     this.props.dispatch(changeZYMedicine({items:medicineInfo,name}));
     message.error('药品名称不能为空,请先填写药品名称,再填写细目用法');
   }
 }

 //制法下拉框
 zfChangefilterOption(input){
   const {name,prescriptionInfo} = this.props;
   let zfListItem = {
     process_desc:'',
     process_type:'0'
   }
   //判断是否存在颗粒剂，膏方
   if(!!input && this.isHasOtherTypeMedicine(prescriptionInfo[name].items,zfListItem,name)){
     return;
   }
  //  const {name,zfList,prescriptionInfo} = this.props;
  //  if (!input) {
  //    input=""
  //  }
  //  const data = {
  //    keyword:input,
  //  }
  //  this.props.dispatch(searchPreparation(data));
  //  let zfListItem = {
  //    process_desc:'',
  //    process_type:'0'
  //  }
   //
  //  zfListItem.process_desc = input;//zfList.data[i].value;
  //  const datat = {
  //    name,
  //    [name]:{
  //      ...zfListItem
  //    }
  //  }
  //  this.props.dispatch(zYMedicineInfo(datat));
 }
 //修改制法
 zfChangeValue(zfListItem,name){
   const data = {
     name,
     [name]:{
       ...zfListItem
     }
   }
   this.props.dispatch(zYMedicineInfo(data));
 }
 zfChange(value){
   const {name,zfList,prescriptionInfo} = this.props;
   let zfListItem = {
     process_desc:'',
     process_type:'0'
   }
   //判断是否存在颗粒剂，膏方
   if(!!value && this.isHasOtherTypeMedicine(prescriptionInfo[name].items,zfListItem,name)){
     return;
   }
  //  if (value.length == 0) {
  //    return;
  //  }
  //  debugger;
   //遍历制法
  //  for (var i = 0; i < zfList.data.length; i++) {
  //    if(zfList.data[i].value == value){
       zfListItem.process_desc = value;//zfList.data[i].value;
  //      zfListItem.process_type = zfList.data[i].type;
  //    }
  //  }
  //  const data = {
  //    name,
  //    [name]:{
  //      ...zfListItem
  //    }
  //  }
  //  this.props.dispatch(zYMedicineInfo(data));
   this.zfChangeValue(zfListItem,name);
 }

 //判断是否存在颗粒剂，膏方
 isHasOtherTypeMedicine(items,zfListItem,name){
   for (var i = 0; i < items.length; i++) {
     if(/^010[23]/.test(items[i].item_code+'')){
       let {herbalPlaster} = this.state;
       herbalPlaster = Object.assign({},herbalPlaster,{visible:true});
       this.zfChangeValue(zfListItem,name);
       this.setState({
         herbalPlaster
       })
       setTimeout(()=>{
         herbalPlaster = Object.assign({},herbalPlaster,{visible:false});
         this.setState({
           herbalPlaster
         });
       },herbalPlaster.time);
       return true;
     }
   }
   return false;
 }


 zfOnBlurChangefilterOption(){
   const {name,zfList,prescriptionInfo} = this.props;

   const dList = zfList.data.filter(
     (item)=>item.value.includes(prescriptionInfo[name].process_desc)||
     item.pinyin.includes(prescriptionInfo[name].process_desc)||
     item.wubi.includes(prescriptionInfo[name].process_desc));
   let zfListItem = {
     process_desc:'',
     process_type:'0'
   }
   //判断是否存在颗粒剂，膏方
   if(!!prescriptionInfo[name].process_desc&&this.isHasOtherTypeMedicine(prescriptionInfo[name].items,zfListItem,name)){
     return;
   }
   for (var i = 0; i < dList.length; i++) {
     if(dList[i].value == prescriptionInfo[name].process_desc){
       zfListItem.process_desc = dList[i].value;
       zfListItem.process_type = dList[i].num_code;
       const data = {
         name,
         [name]:{
           ...zfListItem
         }
       }
       this.calcProcessSum(zfListItem.process_desc);
       this.props.dispatch(zYMedicineInfo(data));
       return;
     }
   }
   if(dList.length > 0 && prescriptionInfo[name].process_desc.length>0){
     zfListItem.process_desc = dList[0].value;
     zfListItem.process_type = dList[0].num_code;
   }
   const data = {
     name,
     [name]:{
       ...zfListItem
     }
   }
   this.props.dispatch(zYMedicineInfo(data));
   if(zfListItem.process_desc == ""){
    let medicineInfo = prescriptionInfo[name].items;
    for (var i =  medicineInfo.length-1; i >=0 ; i--) {
      if(medicineInfo[i].item_name =='丸剂加工费（大于100克）'||
      medicineInfo[i].item_name =='丸剂加工费（小于等于100克）'||
      medicineInfo[i].item_name =='膏方制作费（400）'||
      medicineInfo[i].item_name =='膏方制作费（300）'){
        medicineInfo.splice(i, 1);
        this.props.dispatch(deleteZYMedicine({items:medicineInfo,name}));
      }
    }
   }
  }

  //用法下拉框
  yfChangefilterOption(input){
    // const {name,zfList} = this.props;
    // if (!input) {
    //   input = "";
    // }
    // const data = {
    //   keyword:input,
    //   medince_type:'中药',
    // }
    // this.props.dispatch(searchUsage(data));
    // const yfListItem = {
    //   usage_desc:'',
    //   usage_id:'0'
    // }
    // yfListItem.usage_desc = input;
    // const datat = {
    //   name,
    //   [name]:{
    //     ...yfListItem
    //   }
    // }
    // this.props.dispatch(zYMedicineInfo(datat));
  }
  yfChange(value){
    const {name,yfList} = this.props;
    const yfListItem = {
      usage_desc:'',
      usage_id:'0'
    }
    // if(value.length == 0){
    //   return;
    // }
    //遍历制法
    // for (var i = 0; i < yfList.data.length; i++) {
    //   if(yfList.data[i].value == value){
        yfListItem.usage_desc = value;
    //     yfListItem.usage_id = yfList.data[i].type;
    //   }
    // }
    const data = {
      name,
      [name]:{
        ...yfListItem
      }
    }
    this.props.dispatch(zYMedicineInfo(data));
  }
  yfOnBlurChangefilterOption(){
    const {name,yfList,prescriptionInfo} = this.props;
    const dList = yfList.data.filter(
      (item)=>item.value.includes(prescriptionInfo[name].usage_desc)||
      item.pinyin.includes(prescriptionInfo[name].usage_desc)||
      item.wubi.includes(prescriptionInfo[name].usage_desc));
    const yfListItem = {
      usage_desc:'',
      usage_id:'0'
    }
    for (var i = 0; i < dList.length; i++) {
      if(dList[i].value == prescriptionInfo[name].usage_desc){
        return;
      }
    }
    if(dList.length > 0 && prescriptionInfo[name].usage_desc.length > 0){
      yfListItem.usage_desc = dList[0].value;
      yfListItem.usage_id = dList[0].type;
    }
    const data = {
      name,
      [name]:{
        ...yfListItem
      }
    }
    this.props.dispatch(zYMedicineInfo(data));
  }
  //整剂嘱咐下拉框
  zjChangefilterOption(input){
    // const {name,zhufuList} = this.props;
    // if (!input) {
    //   input = "";
    // }
    // const data = {
    //   keyword:input,
    // }
    // this.props.dispatch(searchSuggest(data));
    // const zhufuListItem = {
    //   taking_desc:'',
    //   taking_id:'0'
    // }
    // zhufuListItem.taking_desc = input;
    // const datat = {
    //   name,
    //   [name]:{
    //     ...zhufuListItem
    //   }
    // }
    // this.props.dispatch(zYMedicineInfo(datat));
  }
  zjChange(value){
    const {name,zhufuList} = this.props;
    const zhufuListItem = {
      taking_desc:'',
      taking_id:'0'
    }
    // if(value.length == 0){
    //   return;
    // }
    zhufuListItem.taking_desc = value;
    const data = {
      name,
      [name]:{
        ...zhufuListItem
      }
    }
    this.props.dispatch(zYMedicineInfo(data));
  }
  zjOnBlurChangefilterOption(){
    const {name,zhufuList,prescriptionInfo} = this.props;
    const dList = zhufuList.data.filter(
      (item)=>item.value.includes(prescriptionInfo[name].taking_desc)||
      item.pinyin.includes(prescriptionInfo[name].taking_desc)||
      item.wubi.includes(prescriptionInfo[name].taking_desc));
    const zhufuListItem = {
      taking_desc:'',
      taking_id:'0'
    }
    for (var i = 0; i < dList.length; i++) {
      if(dList[i].value == prescriptionInfo[name].taking_desc){
        return;
      }
    }
    if(dList.length > 0  && prescriptionInfo[name].taking_desc.length > 0){
      zhufuListItem.taking_desc = dList[0].value;
      zhufuListItem.taking_id = dList[0].num_code;
    }
    const data = {
      name,
      [name]:{
        ...zhufuListItem
      }
    }
    this.props.dispatch(zYMedicineInfo(data));
  }
  //药品名称
  drugSelect(record,index,drugList,medicineInfo){
    const {name} = this.props;
    const options = drugList.data.map((d,i) =>
    <Option
      className={+d.stock>100?"":"drug-warn"}
      key={i +""+ Math.random()*1000}
      value={d.value}
      disabled={medicineInfo.filter((item,j)=>item.item_name==d.value&&index!=j || (+item.stock==0&&(+item.disable&1<<1)=="2")).length > 0 ?true:false}>
      <span className="flex-display">
        <span className="flex-3">{d.value}</span>
        <span className="flex-1">{d.price/10000}</span>
        <span className="flex-1">{d.stock}</span>
        <span className="flex-1">{d.fee_type==2?"医保":(d.fee_type==1?"自费":"")}</span>
      </span>
    </Option>);
    let {herbalPlasterTwo} = this.state;
    return (
      <Tooltip placement="topLeft" visible={herbalPlasterTwo.visible&&herbalPlasterTwo.drugIndex==index} title={herbalPlasterTwo.msg}>
         <InputFocus
          left={true}
          up={false}
          right={true}
          down={false}
          enter={true}
         >
          <Select
          ref={"input-"+(index+1)+"-1-"+medicineInfo.length+"-2-"+name}
          combobox
          value={this.state.drugSelectItem.drugIndex == index?this.state.drugSelectItem.value:record.item_name}
          style={{ width: '100%' }}
          className={record.status == 2 ? "free_type_color_blue" : (record.fee_type==2?"free_type_color_black":(record.fee_type==1?"free_type_color_red":""))}
          dropdownClassName="yp-dropdown-select w450"
          defaultActiveFirstOption={false}
          showArrow={false}
          dropdownMatchSelectWidth={false}
          filterOption={false}
          onSearch={this.medicineNameChange.bind(this,index)}
          onSelect={this.medicineNameSelect.bind(this,index)}
          onBlur={this.medicineNameOnBlurFilterOption.bind(this,index)}
          onFocus={this.medicineNameOnFocusFilterOption.bind(this,index)}
          >
          {
            <Option key='药品名称' disabled>
            <span className="flex-display">
            <span className="flex-3">药品名称</span>
            <span className="flex-1">单价</span>
            <span className="flex-1">库存</span>
            <span className="flex-1">费别</span>
            </span>
            </Option>
          }
          {options}
          </Select>
        </InputFocus>
      </Tooltip>
    )
  }

  //细目用法
  detailUse(record,index,usageDescList,medicineInfo){
    const d = usageDescList.data.filter(
      (item)=>item.value.includes(record.usage_desc)||
              item.pinyin.includes(record.usage_desc)||
              item.wubi.includes(record.usage_desc));
    const options = d.map((d,i) => <Option key={i} value={d.value}>
      <span className="flex-display">
        <span className="flex-1">{d.num_code}</span>
        <span className="flex-1">{d.value}</span>
        <span className="flex-1">{d.pinyin}</span>
        <span className="flex-1">{d.wubi}</span>
      </span>
    </Option>);
    return (
      <Select
        combobox
        value={record.usage_desc}
        style={{ width: '100%' }}
        className={record.status == 2 ? "free_type_color_blue" : (record.fee_type==2?"free_type_color_black":(record.fee_type==1?"free_type_color_red":""))}
        dropdownClassName="yp-dropdown-select w300"
        onSearch={this.usageChange.bind(this,index)}
        onSelect={this.usageSelect.bind(this,index)}
        onBlur={this.onBlurUsageChangeFilterOption.bind(this,index)}
        notFoundContent=""
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        dropdownMatchSelectWidth={false}
      >
      {
        <Option value='' disabled>
          <span className="flex-display">
            <span className="flex-1">代码</span>
            <span className="flex-1">细目用法</span>
            <span className="flex-1">拼音</span>
            <span className="flex-1">五笔</span>
          </span>
        </Option>
      }
      {options}
      </Select>
    )
  }

  //费别
  feeType(record,index){
    let name = "";
    if(record.fee_type == 2){
      name = "医保";
    }
    if(record.fee_type == 1){
      name = "自费";
    }
    return (
      <span className={record.status == 2 ? "free_type_color_blue" : (record.fee_type==2?"free_type_color_black":(record.fee_type==1?"free_type_color_red":""))}>
        {name}
      </span>
    )
  }

  //制法,用法,整剂嘱咐 下拉框
  dropSelect(title,value,list,changefilterOption,change,onBlurChangefilterOption,styleObj,disabled){
    const dList = list.data.filter(
      (item)=>item.value.includes(value)||
      item.pinyin.includes(value)||
      item.wubi.includes(value));
    const options = dList.map((d,i) => <Option key={i} value={d.value}>
      <span className="flex-display">
        <span className="flex-1">{d.num_code}</span>
        <span className="flex-1">{d.value}</span>
      </span>
    </Option>)
    return (
      <div>
        {title+":"}
        <Select
          combobox
          disabled={!disabled}
          style={styleObj}
          placeholder={title}
          value={value||""}
          dropdownClassName="yp-dropdown-select w300"
          onSearch={changefilterOption.bind(this)}
          onChange={change.bind(this)}
          onBlur={onBlurChangefilterOption.bind(this)}
          notFoundContent=""
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          dropdownMatchSelectWidth={false}
        >
          <Option value='-1' disabled>
            <span className="flex-display">
              <span className="flex-1">代码</span>
              <span className="flex-1">名称</span>
            </span>
          </Option>
          {
            options
          }
        </Select>
      </div>
    )
  }

  //计算是否存在非医保药
  isFeeType(medicineInfo){
    let flat = false;
    medicineInfo.map(item=>{
      if(item.fee_type == 1){
        flat = true;
      }
    })
    return flat;
  }

  //简易门诊
  changeSimpleSelect(obj){
    const {name} = this.props;
    const data = {
      name,
      [name]:{
        ...obj
      }
    }
    this.props.dispatch(zYMedicineInfo(data));
  }

  //table footer
  tableFooter(prescriptionInfo,name,medicineInfo,zfList,yfList,zhufuList){
    let yfOptions = yfList.data.map((d,i) =>(<Option key={i} value={d.value}>
        <span className="flex-display">
          <span className="flex-1">{d.num_code}</span>
          <span className="flex-1">{d.value}</span>
          {/* <span className="flex-1">{d.pinyin}</span>
          <span className="flex-1">{d.wubi}</span> */}
        </span>
      </Option>))
    const zfMedicineInfo = medicineInfo.filter(item=>item.item_name =='丸剂加工费（大于100克）'||item.item_name =='丸剂加工费（小于等于100克）'||item.item_name =='膏方制作费（400）'||item.item_name =='膏方制作费（300）');
    const {herbalPlaster} = this.state;
    return (
      <div>
        {
          this.isFeeType(medicineInfo)?(
            <div style={{color:'red',fontSize:'.5rem','textAlign': 'right','paddingBottom': '.5rem'}}>
              <span>*本处方含自费药品，如需报医保，请开医保药品或另开自费处方。</span>
            </div>
          ):""
        }
        <Row className="padding-5">
          <Col span={6}>
            <Tooltip placement="topLeft" visible={herbalPlaster.visible} title={herbalPlaster.msg}>
              {this.dropSelect("制法",prescriptionInfo[name].process_desc,zfList,this.zfChangefilterOption,this.zfChange,this.zfOnBlurChangefilterOption,{'width':'calc(100% - 2rem)'},medicineInfo.length>1)}
            </Tooltip>
          </Col>
          <Col span={6}>
            {this.dropSelect("用法",prescriptionInfo[name].usage_desc,yfList,this.yfChangefilterOption,this.yfChange,this.yfOnBlurChangefilterOption,{'width':'calc(100% - 2rem)'},true)}
          </Col>
          <Col span={3}>共<InputNumber min={1} value={prescriptionInfo[name]?prescriptionInfo[name].quantity:0} style={{'width':'calc(100% - 2rem)'}} onChange={this.totalChange.bind(this)}/>剂</Col>
          <Col span={3}>每日<InputNumber min={1} value={prescriptionInfo[name]?prescriptionInfo[name].usage_amount_desc:1} style={{'width':'calc(100% - 3rem)'}} onChange={this.perTotalChange.bind(this)}/>剂</Col>
          <Col span={6}>
            {this.dropSelect("整剂嘱咐",prescriptionInfo[name].taking_desc,zhufuList,this.zjChangefilterOption,this.zjChange,this.zjOnBlurChangefilterOption,{'width':'calc(100% - 4rem)'},true)}
          </Col>
        </Row>
        {this.props.isSimpleOutpatient?(
          <Row>
            <SimpleSelectComponent
              changeSimpleSelect={this.changeSimpleSelect.bind(this)}
              achievements_type={prescriptionInfo[name].achievements_type}
              achievements_name={prescriptionInfo[name].achievements_name}
              achievements_rel={prescriptionInfo[name].achievements_rel}
            />
          </Row>
        ):""}
        <Row>
          <span className="table_footer">
            {zfMedicineInfo.length>0?
              (zfMedicineInfo.length>1?
                (<span style={{marginRight:'10px'}}>{prescriptionInfo[name].process_desc}加工费:{zfMedicineInfo[0].total_price/10000+zfMedicineInfo[1].total_price/10000}</span>):
                (<span style={{marginRight:'10px'}}>{prescriptionInfo[name].process_desc}加工费:{zfMedicineInfo[0].total_price/10000}</span>)):
              ''
            }
            <span>小计（元）：</span><span >{this.calcTotalPrice(medicineInfo).toFixed(2)}</span>
          </span>
        </Row>
      </div>
    )
  }
  // 060600200001  100024   4000000  膏方制作费（400）
  // 060600200002  100025   3000000  膏方制作费（300）
  //
  // 060600400002  100027   500000   丸剂加工费（小于等于100克）
  // 060600400001  100026   600      丸剂加工费（大于100克）
  //代煎
  calcProcessSum(type){
    const {prescriptionInfo,name} = this.props;
    //计算代煎费用
    let sum = 0.0;
    for (let k = 0; k < prescriptionInfo[name].items.length; k++) {
      if(prescriptionInfo[name].items[k].status != 2 && /^01/.test(prescriptionInfo[name].items[k].item_code)){
        sum += mul(+prescriptionInfo[name].items[k].item_amount , prescriptionInfo[name].quantity);
      }
    }
    switch (type) {
      case "制散":{
        this.calcProcessPill(sum);
        return;
      }
      case "制丸":{
        this.calcProcessPill(sum);
        return;
      }
      case "制膏":{
        this.calcProcessPaste(sum);
        return;
      }
      default:{
        return;
      }
    }
  }
  //制散  制丸
  calcProcessPill(sum){
    const {prescriptionInfo,name} = this.props;
    let medicineInfo = prescriptionInfo[name].items;
    medicineInfo = medicineInfo.filter(item=>item.item_name !='丸剂加工费（大于100克）');
    medicineInfo = medicineInfo.filter(item=>item.item_name !='丸剂加工费（小于等于100克）');
    medicineInfo = medicineInfo.filter(item=>item.item_name !='膏方制作费（400）');
    medicineInfo = medicineInfo.filter(item=>item.item_name !='膏方制作费（300）');
    if(sum <= 100){
      let itemPro = Object.assign({},this.static.itemCell,{
        item_code :'060600400002',
        item_id   : this.static.pill.item_id,
        item_name :'丸剂加工费（小于等于100克）',
        item_price:"500000",
        total_price:"500000",
        item_amount:'1',
        total_amount:'1',
      })
      if(+sum == 0){
        itemPro = Object.assign({},this.static.itemCell,{
          item_code :'060600400002',
          item_id   : this.static.pill.item_id,
          item_name :'丸剂加工费（小于等于100克）',
          item_price:"500000",
          total_price:"0",
          item_amount:'0',
          total_amount:'0',
        })
        this.props.dispatch(changeZYMedicine({items:[...medicineInfo.slice(0,-1),itemPro],name}));
        return;
      }
      this.props.dispatch(changeZYMedicine({items:[...medicineInfo.slice(0,-1),itemPro],name}));
    }else{
      let itemPro = Object.assign({},this.static.itemCell,{
        item_code :'060600400002',
        item_id   : this.static.pill.item_id,
        item_name :'丸剂加工费（小于等于100克）',
        item_price:"500000",
        total_price:"500000",
        item_amount:'1',
        total_amount:'1',
      })
      let itemProTwo = Object.assign({},this.static.itemCell,{
        item_code :'060600400001',
        item_id   : this.static.pill100.item_id,
        item_name :'丸剂加工费（大于100克）',
        item_amount:(+sum - 100)+'',
        total_amount:(+sum - 100)+'',
        item_price:"600",
        total_price:(+sum - 100) * 600+"",
      })
      this.props.dispatch(changeZYMedicine({items:[...medicineInfo.slice(0,-1),itemPro,itemProTwo],name}));
    }
  }
  // 制膏
  calcProcessPaste(sum){
    const {prescriptionInfo,name} = this.props;
    let medicineInfo = prescriptionInfo[name].items;
    medicineInfo = medicineInfo.filter(item=>item.item_name !='丸剂加工费（大于100克）');
    medicineInfo = medicineInfo.filter(item=>item.item_name !='丸剂加工费（小于等于100克）');
    medicineInfo = medicineInfo.filter(item=>item.item_name !='膏方制作费（400）');
    medicineInfo = medicineInfo.filter(item=>item.item_name !='膏方制作费（300）');
    const curDate = new Date();
    const brithDate = new Date(getUser().patient_birth);
    if(curDate.getYear() - brithDate.getYear() > 14){
      let itemPro = Object.assign({},this.static.itemCell,{
        item_code :'060600200001',
        item_id   : this.static.paste400.item_id,
        item_name :'膏方制作费（400）',
        item_price:"4000000",
        total_price:"4000000",
        item_amount:'1',
        total_amount:'1',
      })
      if(+sum == 0){
        itemPro = Object.assign({},this.static.itemCell,{
          item_code :'060600200001',
          item_id   : this.static.paste400.item_id,
          item_name :'膏方制作费（400）',
          item_price:"4000000",
          total_price:"0",
          item_amount:'0',
          total_amount:'0',
        })
        this.props.dispatch(changeZYMedicine({items:[...medicineInfo.slice(0,-1),itemPro],name}));
        return 0;
      }
      this.props.dispatch(changeZYMedicine({items:[...medicineInfo.slice(0,-1),itemPro],name}));
      return 4000000;
    }else if(curDate.getMonth() > brithDate.getMonth()){
      let itemPro = Object.assign({},this.static.itemCell,{
        item_code :'060600200002',
        item_id   : this.static.paste300.item_id,
        item_name :'膏方制作费（300）',
        item_price:"3000000",
        total_price:"3000000",
        item_amount:'1',
        total_amount:'1',
      })
      if(+sum == 0){
        itemPro = Object.assign({},this.static.itemCell,{
          item_code :'060600200002',
          item_id   : this.static.paste300.item_id,
          item_name :'膏方制作费（300）',
          item_price:"3000000",
          total_price:"0",
          item_amount:'0',
          total_amount:'0',
        })
        this.props.dispatch(changeZYMedicine({items:[...medicineInfo.slice(0,-1),itemPro],name}));
        return 0;
      }
      this.props.dispatch(changeZYMedicine({items:[...medicineInfo.slice(0,-1),itemPro],name}));
      return 3000000;
    }else if(curDate.getDay() > brithDate.getDay()){
      let itemPro = Object.assign({},this.static.itemCell,{
        item_code :'060600200002',
        item_id   : this.static.paste300.item_id,
        item_name :'膏方制作费（300）',
        item_price:"3000000",
        total_price:"3000000",
        item_amount:'1',
        total_amount:'1',
      })
      if(+sum == 0){
        itemPro = Object.assign({},this.static.itemCell,{
          item_code :'060600200002',
          item_id   : this.static.paste300.item_id,
          item_name :'膏方制作费（300）',
          item_price:"3000000",
          total_price:"0",
          item_amount:'0',
          total_amount:'0',
        })
        this.props.dispatch(changeZYMedicine({items:[...medicineInfo.slice(0,-1),itemPro],name}));
        return 0;
      }
      this.props.dispatch(changeZYMedicine({items:[...medicineInfo.slice(0,-1),itemPro],name}));
      return 3000000;
    }
    let itemPro = Object.assign({},this.static.itemCell,{
      item_code :'060600200001',
      item_id   : this.static.paste400.item_id,
      item_name :'膏方制作费（400）',
      item_price:"4000000",
      total_price:"4000000",
      item_amount:'1',
      total_amount:'1',
    })
    if(+sum == 0){
      itemPro = Object.assign({},this.static.itemCell,{
        item_code :'060600200001',
        item_id   : this.static.paste400.item_id,
        item_name :'膏方制作费（400）',
        item_price:"4000000",
        total_price:"0",
        item_amount:'0',
        total_amount:'0',
      })
      this.props.dispatch(changeZYMedicine({items:[...medicineInfo.slice(0,-1),itemPro],name}));
      return 0;
    }
    this.props.dispatch(changeZYMedicine({items:[...medicineInfo.slice(0,-1),itemPro],name}));
    return 4000000;
  }
  deleteZf(medicineInfo,name){
    const data = {
      name,
      [name]:{
        process_desc:'',
        process_type:'0'
      }
    }
    this.props.dispatch(zYMedicineInfo(data));
    setTimeout(()=>{
      medicineInfo = medicineInfo.filter(item=>!(/^0606/.test(item.item_code)))
      this.props.dispatch(changeZYMedicine({items:[{
        item_type:'0',
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
      }],name}));
    },0);
  }
  render(){
    const {prescriptionInfo,name,drugList,usageDescList,zfList,yfList,zhufuList} = this.props;

    let medicineInfo = prescriptionInfo[name]?prescriptionInfo[name].items:[];
    // medicineInfo = medicineInfo.filter(item=>item.item_name !='丸剂加工费（大于100克）');
    // medicineInfo = medicineInfo.filter(item=>item.item_name !='丸剂加工费（小于等于100克）');
    // medicineInfo = medicineInfo.filter(item=>item.item_name !='膏方制作费（400）');
    // medicineInfo = medicineInfo.filter(item=>item.item_name !='膏方制作费（300）');
    const columns = [{
      title: '序号',
      key: 'index',
      width:'1rem',
      render: (text,record,index) => {
        if(medicineInfo.length-1 != index){
          return (
            <span className={record.status == 2 ? "free_type_color_blue" : (record.fee_type==2?"free_type_color_black":(record.fee_type==1?"free_type_color_red":""))}>{index+1}</span>
          )
        }else{
          return ""
        }
      },
    }, {
      title: '药品名称',
      dataIndex: 'item_name',
      key: 'item_name',
      render: (text,record,index) => {
        if(record.item_name =='丸剂加工费（大于100克）'||record.item_name =='丸剂加工费（小于等于100克）'||record.item_name =='膏方制作费（400）'||record.item_name =='膏方制作费（300）'){
          return (<span>{text}</span>)
        }else{
          return this.drugSelect(record,index,drugList,medicineInfo);
        }
      }
    }, {
      title: '每次剂量',
      dataIndex: 'item_amount',
      key: 'item_amount',
      width:'5rem',
      render: (text,record,index) => {
        if(record.item_name =='丸剂加工费（大于100克）'||record.item_name =='丸剂加工费（小于等于100克）'||record.item_name =='膏方制作费（400）'||record.item_name =='膏方制作费（300）'){
          return (<span></span>)
        }else{
          return (
            <span style={{"width":'5rem','display': 'inline-block'}} className={record.status == 2 ? "free_type_color_blue" : (record.fee_type==2?"free_type_color_black":(record.fee_type==1?"free_type_color_red":""))}>
              <InputFocus
              left={true}
              up={false}
              right={true}
              down={false}
              enter={true}
              className=""
              style={{"width":'3rem','display': 'inline-block'}}
              >
                <InputNumber
                  style={{"width":'3rem','display': 'inline-block'}}
                  ref={"input-"+(index+1)+"-2-"+medicineInfo.length+"-2-"+name}
                  className={(record.fee_type==2?"free_type_color_black":(record.fee_type==1?"free_type_color_red":""))+' input-number'}
                  min={0}
                  value={text}
                  onChange={this.medicineNumChange.bind(this,index)} />
              </InputFocus>
              {" "+record.item_unit}
            </span>
          )
        }
      },
    },{
      title: '药品总量',
      dataIndex: 'total_amount',
      key: 'total_amount',
      width:'5rem',
      render: (text, record) =>  {
        if(record.item_name =='丸剂加工费（大于100克）'||record.item_name =='丸剂加工费（小于等于100克）'||record.item_name =='膏方制作费（400）'||record.item_name =='膏方制作费（300）'){
          return (<span>{text}</span>)
        }else{
          return (
            <span className={record.status == 2 ? "free_type_color_blue" : (record.fee_type==2?"free_type_color_black":(record.fee_type==1?"free_type_color_red":""))}>
              {record.total_amount+record.wst_taking_unit}</span>
          )
        }
      },
    }, {
      title: '细目用法',
      dataIndex: 'usage_desc',
      key: 'usage_desc',
      render: (text,record,index) => {
        if(record.item_name =='丸剂加工费（大于100克）'||record.item_name =='丸剂加工费（小于等于100克）'||record.item_name =='膏方制作费（400）'||record.item_name =='膏方制作费（300）'){
          return (<span></span>)
        }else{
          return this.detailUse(record,index,usageDescList,medicineInfo);
        }
      }
    }, {
      title: '费别',
      dataIndex: 'medicalTreatmentType',
      key: 'medicalTreatmentType',
      width:'5rem',
      render: (text, record, index) => {
        if(record.item_name =='丸剂加工费（大于100克）'||record.item_name =='丸剂加工费（小于等于100克）'||record.item_name =='膏方制作费（400）'||record.item_name =='膏方制作费（300）'){
          return (<span></span>)
        }else{
          return this.feeType(record,index);
        }
      }
    },{
      title: '金额',
      dataIndex: 'total_price',
      key: 'total_price',
      width:'5rem',
      render: (text,record,index) => {
        if(record.item_name =='丸剂加工费（大于100克）'||record.item_name =='丸剂加工费（小于等于100克）'||record.item_name =='膏方制作费（400）'||record.item_name =='膏方制作费（300）'){
          return (<span>{text/10000}</span>)
        }else{
          return (
            <span className={record.status == 2 ? "free_type_color_blue" : (record.fee_type==2?"free_type_color_black":(record.fee_type==1?"free_type_color_red":""))}>{+text/10000}</span>
          )
        }
      }
    },{
      title: '操作',
      key: 'action',
      render: (text, record,index) => {
        if(record.item_name =='丸剂加工费（大于100克）'||record.item_name =='丸剂加工费（小于等于100克）'||record.item_name =='膏方制作费（400）'||record.item_name =='膏方制作费（300）'){
          return (<span></span>)
        }else{
          if(medicineInfo.length-1 != index){
            return  (<Button className={record.total_price==0?'warn-delete':''} type="dashed" icon="circle" icon="close" onClick={this.onDelete(index,record)}
                    />)
        	}else{
            return ""
        	}
        }
      },
    }];
    return (
      <div className="yinpian">
        <Table
          rowKey={(record,index) =>index}
          bordered
          loading={medicineInfo.length < 1}
          columns={columns}
          dataSource={medicineInfo}
          pagination={false}
          footer={()=>this.tableFooter(prescriptionInfo,name,prescriptionInfo[name]?prescriptionInfo[name].items:[],zfList,yfList,zhufuList)}
          rowClassName={(record, index)=>{
            const {herbalPlaster} = this.state;
            if(/^0606/.test(record.item_code)){
              return "zf-style";
            }
            if(herbalPlaster.visible&&/^010[23]/.test(record.item_code)){
              return "warn-info";
            }
            return "";
          }}
        />
      </div>
    )
  }
}

YinpianTabItem.contextTypes={
  router: PropTypes.object.isRequired,
};
YinpianTabItem.propTypes = {
  prescriptionInfo:PropTypes.object,
  drugList:PropTypes.object,
  usageDescList:PropTypes.object,
  zfList:PropTypes.object,
  yfList:PropTypes.object,
  zhufuList:PropTypes.object,
  name:PropTypes.string,
  isSimpleOutpatient:PropTypes.bool,
};
function mapStateToProps(state){
  return {
    prescriptionInfo:state.prescriptionInfo,
    drugList:state.drugList,
    usageDescList:state.usageDescList,
    zfList:state.zfList,
    yfList:state.yfList,
    zhufuList:state.zhufuList,
  }
}
export default YinpianTabItem = connect(mapStateToProps)(YinpianTabItem)
