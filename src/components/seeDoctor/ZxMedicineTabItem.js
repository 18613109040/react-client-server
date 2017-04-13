
import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {getUser} from "../../utils/User";
import {mul} from "../../utils/tools";
import {Row,Col,Table,Button,Input,InputNumber,Select,Modal,message} from 'antd';
const Option = Select.Option;
const confirm = Modal.confirm;

import {searchItemTwo} from "../../store/actions/Medicine";
import {changeZXMedicine,deleteZXMedicine,zXMedicineInfo} from "../../store/actions/ZxMedicine";

import InputFocus from "../InputFocus";
//简易门诊关联医生
import SimpleSelectComponent from "./SimpleSelectComponent";

class ZxMedicineTabItem extends Component {
  constructor(props){
    super(props);
    this.state = {
      chargeIndex:'-1',
      charge:'',
      drugSelectItem:{
        drugIndex:'-1',
      }
    }
    this.static = {
      clearTime:"",
    }
  }
  componentWillMount(){

  }
  componentDidMount(){
  }
  //cell删除
  onDelete(index){
    return ()=>{
      const {zXPrescriptionInfo,name} = this.props;
      let medicineInfo = zXPrescriptionInfo[name].items;
      medicineInfo.splice(index, 1);
      this.props.dispatch(deleteZXMedicine({items:medicineInfo,name}));
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
        // pharmacy_type:1<<1,//1<<0中医药房 1<<1西医药房 1<<2 贵细药房 1<<3供应室
        item_type:1<<1|1<<2,// 1<<0中药饮片 1<<1中成药 1<<2 西药 1<<3 耗材
        shop_no:getUser().shop_no,
      }
      this.props.dispatch(searchItemTwo(data));
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
    const {zXPrescriptionInfo,name,drugListTwo} = this.props;
    let drugItem = {};
    for (var i = 0; i < drugListTwo.data.length; i++) {
      if(drugListTwo.data[i].value == value){
      drugItem = drugListTwo.data[i];
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
    const {zXPrescriptionInfo,name,drugListTwo} = this.props;
    let medicineInfo = zXPrescriptionInfo[name].items;
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
      // pharmacy_type:1<<1,//1<<0中医药房 1<<1西医药房 1<<2 贵细药房 1<<3供应室
      item_type:1<<1|1<<2,// 1<<0中药饮片 1<<1中成药 1<<2 西药 1<<3 耗材
      shop_no:getUser().shop_no,
    }
    this.props.dispatch(searchItemTwo(data));
  }
  medicineNameOnBlurFilterOption(index,value){
    let {drugSelectItem} = this.state;
    drugSelectItem = Object.assign({},{
      drugIndex:'-1',
    })
    this.setState({
      drugSelectItem
    })
    const {zXPrescriptionInfo,name,drugListTwo} = this.props;
    let medicineInfo = zXPrescriptionInfo[name].items;
    let tempDrugListObj = {};
    if(drugListTwo.data&&drugListTwo.data.length>0){
      drugListTwo.data = drugListTwo.data.filter(item=>(+item.stock>0||(+item.disable&1<<1)!="2"));
    }
    //删除药品空白行
    if(!value||value.length == 0){
      if(medicineInfo.length == index+1){
        this.sendDrug(medicineInfo,index,"",{},name);
      }else{
        medicineInfo.splice(index, 1);
        this.props.dispatch(deleteZXMedicine({items:medicineInfo,name}));
      }
      return;
    }

    for (var i = 0; i < drugListTwo.data.length; i++) {
      tempDrugListObj[drugListTwo.data[i].value] = drugListTwo.data[i];
      if(drugListTwo.data[i].value == value){
        if((medicineInfo.filter(item=>item.item_name == value && (+item.stock>0||(+item.disable&1<<1)!="2") )).length == 0){
          this.sendDrug(medicineInfo,index,value,drugListTwo.data[i],name);
        }
        return;
      }
    }
    for (var i = 0; i < drugListTwo.data.length; i++) {
      if(drugListTwo.data[i].value.includes(value)){
        if((medicineInfo.filter(item=>item.item_name.includes(value) && (+item.stock>0||(+item.disable&1<<1)!="2"))).length == 0){
          this.sendDrug(medicineInfo,index,drugListTwo.data[i].value,drugListTwo.data[i],name);
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
      this.sendDrug(medicineInfo,index,tempDrugListObj[item].value,tempDrugListObj[item],name);
      break;
    }
    if(flat && medicineInfo.length != (index + 1)){
      // this.sendDrug(medicineInfo,index,"",{},name);
      medicineInfo.splice(index, 1);
      this.props.dispatch(deleteZXMedicine({items:medicineInfo,name}));
    }
  }

  //计算药品总量   每次剂量 * 24*60 * 持续天数 /频次（分钟）*最小单位
  totalDays(item_amount,wst_taking_days,wst_taking_frequency,min_unit){
    if(parseInt(0+wst_taking_frequency) == 0){
      wst_taking_frequency = "1440";
    }
    if(!min_unit||min_unit == "undefined"){
      min_unit = "1";
    }
    const p = (mul(item_amount,wst_taking_days) * 24 * 60 ) / (mul(wst_taking_frequency , min_unit));
    return Math.ceil(p)+"";
  }
  //修改药品信息
  sendDrug(medicineInfo,index,value,drugItem,name){
    const {frequencyList} = this.props;
    if(frequencyList.data.length > 0){
      medicineInfo[index].wst_taking_frequency = frequencyList.data[0].times_per_minu;//分钟
      medicineInfo[index].wst_taking_times = frequencyList.data[0].value;//频次简写
    }else{
      medicineInfo[index].wst_taking_frequency = "1440";//分钟
      medicineInfo[index].wst_taking_times = "";//频次简写
    }
    medicineInfo[index].item_amount = '1';
    medicineInfo[index].wst_taking_days = "1"
    // medicineInfo[index].total_amount = '1';
    medicineInfo[index].item_name = value;
    medicineInfo[index].item_id = drugItem.item_id||"";
    medicineInfo[index].item_code = drugItem.item_code||"";
    medicineInfo[index].fee_type = drugItem.fee_type||"2";
    medicineInfo[index].item_price = drugItem.price||"0";
    medicineInfo[index].item_unit = drugItem.unit||"";
    medicineInfo[index].wst_taking_unit = drugItem.presciption_unit||"";
    medicineInfo[index].min_unit = drugItem.min_unit + "";//最小单位
    medicineInfo[index].wst_spec = drugItem.standard||"";//西药规格
    medicineInfo[index].stock = drugItem.stock||"";
    medicineInfo[index].disable = drugItem.disable||"";
    medicineInfo[index].status = drugItem.status||"";
    medicineInfo[index].wst_taking_unit = drugItem.presciption_unit||"";//西药每剂单位

    medicineInfo[index].total_amount = this.totalDays(medicineInfo[index].item_amount,medicineInfo[index].wst_taking_days,medicineInfo[index].wst_taking_frequency,medicineInfo[index].min_unit);
    medicineInfo[index].total_price = mul(medicineInfo[index].total_amount , medicineInfo[index].item_price)+"";//西药总量
    medicineInfo[index].fee_type += "";
    medicineInfo[index].item_price += "";
    this.props.dispatch(changeZXMedicine({items:medicineInfo,name}));
    // if(this.isMoreThanStock(medicineInfo[index].total_amount,medicineInfo[index])){
    // }
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

  //是否不超过库存 总:totalCount 药品详情:drugItem
  isMoreThanStock(totalCount,drugItem){
    if((+drugItem.disable&1<<1)!="2"){
      return true;
    }
    if(totalCount > +drugItem.stock){
      message.error(`药品总量超过库存,${drugItem.item_name}的最大库存为${+drugItem.stock+drugItem.item_unit}`);
      return false;
    }
    return true;
  }
  //每次剂量改变
  medicineNumChange(index,value){
    if(!value){
      value="0";
    }
    value = (value+"").replace(/(\d*.\d)\d*/,"$1");
    const {zXPrescriptionInfo,name} = this.props;
    let medicineInfo = [...zXPrescriptionInfo[name].items];
    if(medicineInfo[index].item_name && medicineInfo[index].item_name.length >= 0){
      let drugItem = {
        item_amount        : value+"",
        wst_taking_amount  : value+"",
        total_amount       : this.totalDays(value,medicineInfo[index].wst_taking_days,medicineInfo[index].wst_taking_frequency,medicineInfo[index].min_unit),
        total_price        : mul(this.totalDays(value,medicineInfo[index].wst_taking_days,medicineInfo[index].wst_taking_frequency,medicineInfo[index].min_unit) , medicineInfo[index].item_price)+"",//西药总量
      }
      // medicineInfo[index].item_amount = value+"";
      // medicineInfo[index].wst_taking_amount = value+"";
      // //计算药品总量   每次剂量 * 24*60 * 持续天数 /频次（分钟）*最小单位
      // medicineInfo[index].total_amount = this.totalDays(medicineInfo[index].item_amount,medicineInfo[index].wst_taking_days,medicineInfo[index].wst_taking_frequency,medicineInfo[index].min_unit)
      // medicineInfo[index].total_price = medicineInfo[index].total_amount * medicineInfo[index].item_price+"";//西药总量
      if(this.isMoreThanStock(drugItem.total_amount,medicineInfo[index])){
        medicineInfo[index] = Object.assign({},medicineInfo[index],drugItem)
        this.props.dispatch(changeZXMedicine({items:medicineInfo,name}));
      }else{
        this.props.dispatch(changeZXMedicine({items:medicineInfo,name}));
      }
    }else{
      message.error('药品名称不能为空,请先填写药品名称,再填写每次用量');
    }
  }
  //嘱咐改变
  wstTakingDescChange(index,e){
    const value = e.target.value;
    if(value.length < 20 ){
      if(this.state.chargeIndex != '-1'){
        this.setState({
          chargeIndex:index,
          charge:value+"",
        })
      }
    }else{
      message.error('文字不能超过20个字符');
    }
  }
  wstTakingDescFocus(index,e){
    const value = e.target.value;
    const {zXPrescriptionInfo,name} = this.props;
    let medicineInfo = zXPrescriptionInfo[name].items;
    if(medicineInfo[index].item_name && medicineInfo[index].item_name.length >= 0){
      this.setState({
        chargeIndex:index,
        charge:medicineInfo[index].wst_taking_desc,
      })
    }else{
      message.error('药品名称不能为空,请先填写药品名称,再填写每次用量');
    }
  }
  wstTakingDescBlur(index,e){
    const {zXPrescriptionInfo,name} = this.props;
    let medicineInfo = zXPrescriptionInfo[name].items;
    medicineInfo[index].wst_taking_desc = this.state.charge+"";
    this.props.dispatch(changeZXMedicine({items:medicineInfo,name}));
    this.setState({
      chargeIndex:'-1',
      charge:''
    })
  }
  //用法下拉框
  usageDescFilterOption(input){
    // if (!input) {
    //   input = "";
    // }
    // const data = {
    //   keyword:input,
    //   medince_type:'非中药',
    // }
    // this.props.dispatch(searchUsageTwo(data));
  }
  usageDescChange(index,value){
    this.usageDescFilterOption(value);
    this.usageDescSelect(index,value);
  }
  usageDescSelect(index,value){
    const {zXPrescriptionInfo,name,yfListTwo} = this.props;
    const dList = yfListTwo.data.filter(
      (item)=>item.value.includes(value)||
      item.pinyin.includes(value)||
      item.wubi.includes(value));
    let medicineInfo = zXPrescriptionInfo[name].items;
    if(medicineInfo[index].item_name && medicineInfo[index].item_name.length >= 0){
      medicineInfo[index].usage_desc = value;
      this.props.dispatch(changeZXMedicine({items:medicineInfo,name}));
    }else{
      message.error('药品名称不能为空,请先填写药品名称,再填写用法');
    }
  }
  onBlurUsageDescFilterOption(index){
    const {zXPrescriptionInfo,name,yfListTwo} = this.props;
    let medicineInfo = zXPrescriptionInfo[name].items;
    const dList = yfListTwo.data.filter(
      (item)=>item.value.includes(medicineInfo[index].usage_desc)||
      item.pinyin.includes(medicineInfo[index].usage_desc)||
      item.wubi.includes(medicineInfo[index].usage_desc));
    if(medicineInfo[index].usage_desc.length > 0 && dList.length > 0){
      medicineInfo[index].usage_id = dList[0].id;
      medicineInfo[index].usage_desc = dList[0].value;
    }else{
      medicineInfo[index].usage_id = "";
      medicineInfo[index].usage_desc = "";
    }
    this.props.dispatch(changeZXMedicine({items:medicineInfo,name}));
  }
  //频次搜索 searchFrequency
  frequencyChangeFilterOption(input){
    // if (!input) {
    //   input = "";
    // }
    // const data = {
    //   keyword:input,
    // }
    // this.props.dispatch(searchFrequency(data));
  }
  frequencyChange(index,value){
    this.frequencyChangeFilterOption(value);
    this.frequencySelect(index,value);
  }
  frequencySelect(index,value){
    const {zXPrescriptionInfo,name,frequencyList} = this.props;
    let medicineInfo = zXPrescriptionInfo[name].items;
    const dList2 = frequencyList.data.filter(
      (item)=>item.value.includes(value)||
      item.pinyin.includes(value)||
      item.wubi.includes(value));
    const dList = dList2.filter((item)=>{
      const sum = this.totalDays(medicineInfo[index].item_amount,medicineInfo[index].wst_taking_days,parseInt("0"+item.times_per_minu),medicineInfo[index].min_unit);
      return +medicineInfo[index].stock>sum || ((+medicineInfo[index].disable&1<<1)!="2");
    });
    if(medicineInfo[index].item_name && medicineInfo[index].item_name.length >= 0){
      // medicineInfo[index].wst_taking_times = value;
      // for (var i = 0; i < frequencyList.data.length; i++) {
      //   if (dList[i].value == value) {
      //     medicineInfo[index].wst_taking_frequency = parseInt("0"+dList[i].times_per_minu)+"";
      if(medicineInfo[index].wst_taking_frequency == 0){
        medicineInfo[index].wst_taking_frequency = "1";
      }
      //     break;
      //   }
      // }
      medicineInfo[index].wst_taking_times = value + "";
      //计算药品总量   每次剂量 * 24*60 * 持续天数 /频次（分钟）*最小单位
      medicineInfo[index].total_amount = this.totalDays(medicineInfo[index].item_amount,medicineInfo[index].wst_taking_days,medicineInfo[index].wst_taking_frequency,medicineInfo[index].min_unit)
      medicineInfo[index].total_price = mul(medicineInfo[index].total_amount , medicineInfo[index].item_price)+"";//西药总量
      this.props.dispatch(changeZXMedicine({items:medicineInfo,name}));
      // if(this.isMoreThanStock(medicineInfo[index].total_amount,medicineInfo[index])){
      // }




    }else{
      message.error('药品名称不能为空,请先填写药品名称,再填写频次');
    }
  }
  onBlurFrequencyChangeFilterOption(index){
    const {zXPrescriptionInfo,name,frequencyList} = this.props;
    let medicineInfo = zXPrescriptionInfo[name].items;
    const dList2 = frequencyList.data.filter(
      (item)=>item.value.includes(medicineInfo[index].wst_taking_times)||
      item.pinyin.includes(medicineInfo[index].wst_taking_times)||
      item.wubi.includes(medicineInfo[index].wst_taking_times));
    const dList = dList2.filter((item)=>{
      const sum = this.totalDays(medicineInfo[index].item_amount,medicineInfo[index].wst_taking_days,parseInt("0"+item.times_per_minu),medicineInfo[index].min_unit);
      return +medicineInfo[index].stock>sum || ((+medicineInfo[index].disable&1<<1)!="2");;
    });
    if(medicineInfo[index].wst_taking_times.length > 0 && dList.length > 0){
      // medicineInfo[index].wst_taking_times = dList[0].value;
      // medicineInfo[index].wst_taking_frequency = dList[0].times_per_minu;
      let freFlat = true;
      for (var i = 0; i < dList.length; i++) {
        if (dList[i].value == medicineInfo[index].wst_taking_times) {
          freFlat = false;
          medicineInfo[index].wst_taking_frequency = parseInt("0"+dList[i].times_per_minu)+"";
          medicineInfo[index].wst_taking_times = dList[i].value;
          if(medicineInfo[index].wst_taking_frequency == 0){
            medicineInfo[index].wst_taking_frequency = "1440";
          }
          break;
        }
      }
      if(freFlat){
        medicineInfo[index].wst_taking_frequency = parseInt("0"+dList[0].times_per_minu)+"";
        medicineInfo[index].wst_taking_times = dList[0].value;
        if(medicineInfo[index].wst_taking_frequency == 0){
          medicineInfo[index].wst_taking_frequency = "1440";
        }
      }
    }else{
      medicineInfo[index].wst_taking_frequency = "1440";
      medicineInfo[index].wst_taking_times = "";
    }
    medicineInfo[index].total_amount = this.totalDays(medicineInfo[index].item_amount,medicineInfo[index].wst_taking_days,medicineInfo[index].wst_taking_frequency,medicineInfo[index].min_unit);
    medicineInfo[index].total_price = mul(medicineInfo[index].total_amount , medicineInfo[index].item_price)+"";//西药总量
    this.props.dispatch(changeZXMedicine({items:medicineInfo,name}));
  }

  //持续用量
  wstTakingDaysChange(index,value){
    if(!value){
      value="0";
    }
    const {zXPrescriptionInfo,name} = this.props;
    let medicineInfo = zXPrescriptionInfo[name].items;
    if(medicineInfo[index].item_name && medicineInfo[index].item_name.length >= 0){
      let drugItem = {
        wst_taking_days : value+"",
        total_amount    : this.totalDays(medicineInfo[index].item_amount,value,medicineInfo[index].wst_taking_frequency,medicineInfo[index].min_unit),
        total_price     : mul(this.totalDays(medicineInfo[index].item_amount,value,medicineInfo[index].wst_taking_frequency,medicineInfo[index].min_unit) , medicineInfo[index].item_price)+"",//西药总量
      }
      if(this.isMoreThanStock(drugItem.total_amount,medicineInfo[index])){
        medicineInfo[index] = Object.assign({},medicineInfo[index],drugItem)
        this.props.dispatch(changeZXMedicine({items:medicineInfo,name}));
      }else{
        this.props.dispatch(changeZXMedicine({items:medicineInfo,name}));
      }
      // medicineInfo[index].wst_taking_days = value+"";
      //计算药品总量   每次剂量 * 24*60 * 持续天数 /频次（分钟）*最小单位
      // medicineInfo[index].total_amount = this.totalDays(medicineInfo[index].item_amount,medicineInfo[index].wst_taking_days,medicineInfo[index].wst_taking_frequency,medicineInfo[index].min_unit)
      // medicineInfo[index].total_price = medicineInfo[index].total_amount * medicineInfo[index].item_price+"";//西药总量
      // if(this.isMoreThanStock(medicineInfo[index].total_amount,medicineInfo[index])){
      //   this.props.dispatch(changeZXMedicine({items:medicineInfo,name}));
      // }
    }else{
      message.error('药品名称不能为空,请先填写药品名称,再填写持续用量');
    }
  }
  //药品名称下拉框
  drugDropSelect(record,index,drugListTwo,medicineInfo){
    const {name} = this.props;
    const options = drugListTwo.data.map((d,i) =>
    <Option
      className={+d.stock>100?"":"drug-warn"}
      key={i}
      value={d.value}
      disabled={medicineInfo.filter((item,j)=>item.item_name==d.value&&index!=j || (+item.stock==0&&(+item.disable&1<<1)=="2")).length > 0 ?true:false}>
      <span className="flex-display">
        <span className="flex-3">{d.value}</span>
        <span className="flex-1">{d.standard}</span>
        <span className="flex-1">{d.price/10000}</span>
        <span className="flex-1">{d.stock}</span>
        <span className="flex-1">{d.fee_type==2?"医保":(d.fee_type==1?"自费":"")}</span>
        <span className="flex-1">{d.dosage_form}</span>
      </span>
    </Option>);
    return (
      <InputFocus
       left={true}
       up={false}
       right={true}
       down={false}
       enter={true}
      >
       <Select
         ref={"input-"+(index+1)+"-1-"+medicineInfo.length+"-5-"+name}
          disabled={index>4}
          combobox
          value={this.state.drugSelectItem.drugIndex == index?this.state.drugSelectItem.value:record.item_name}
          className={record.status == 2 ? "free_type_color_blue" : (record.fee_type==2?"free_type_color_black":(record.fee_type==1?"free_type_color_red":""))}
          style={{ width: '150px' }}
          dropdownClassName="yp-dropdown-select w450"
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          dropdownMatchSelectWidth={false}
          onSearch={this.medicineNameChange.bind(this,index)}
          onSelect={this.medicineNameSelect.bind(this,index)}
          onBlur={this.medicineNameOnBlurFilterOption.bind(this,index)}
          onFocus={this.medicineNameOnFocusFilterOption.bind(this,index)}
        >
        {
          <Option key='药品名称' disabled>
            <span className="flex-display">
              <span className="flex-3">药品名称</span>
              <span className="flex-1">规格</span>
              <span className="flex-1">单价</span>
              <span className="flex-1">库存</span>
              <span className="flex-1">费别</span>
              <span className="flex-1">剂型</span>
            </span>
          </Option>
        }
        {options}
        </Select>
      </InputFocus>
    )
  }
  //用法下拉框
  usageDescDropSelect(record,index,yfListTwo){
    const {zXPrescriptionInfo,name} = this.props;
    const medicineInfo = zXPrescriptionInfo[name]?zXPrescriptionInfo[name].items:[];
    const dList = yfListTwo.data.filter(
      (item)=>item.value.includes(record.usage_desc)||
      item.pinyin.includes(record.usage_desc)||
      item.wubi.includes(record.usage_desc));
    const options = dList.map((d,i) => <Option key={i} value={d.value}>
      <span className="flex-display">
        <span className="flex-1">{d.num_code}</span>
        <span className="flex-2">{d.value}</span>
        <span className="flex-1">{d.type}</span>
        <span className="flex-1">{d.medince_type}</span>
        <span className="flex-1">{d.rank}</span>
      </span>
    </Option>);
    return (
      <InputFocus
       left={true}
       up={false}
       right={true}
       down={false}
       enter={true}
      >
       <Select
         ref={"input-"+(index+1)+"-3-"+medicineInfo.length+"-5-"+name}
          disabled={index>4}
          combobox
          value={record.usage_desc}
          style={{ width: '100px' }}
          className={record.status == 2 ? "free_type_color_blue" : (record.fee_type==2?"free_type_color_black":(record.fee_type==1?"free_type_color_red":""))}
          dropdownClassName="yp-dropdown-select w300"
          onSearch={this.usageDescChange.bind(this,index)}
          onSelect={this.usageDescSelect.bind(this,index)}
          onFocus={this.usageDescFilterOption.bind(this)}
          onBlur={this.onBlurUsageDescFilterOption.bind(this,index)}
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
                <span className="flex-2">名称</span>
                <span className="flex-1">分类</span>
                <span className="flex-1">类别</span>
                <span className="flex-1">使用范围</span>
              </span>
            </Option>
          }
          {options}
        </Select>
      </InputFocus>
    )
  }
  //频次
  wstTakingTimesDropSelect(record,index,frequencyList){
    const {zXPrescriptionInfo,name} = this.props;
    const medicineInfo = zXPrescriptionInfo[name]?zXPrescriptionInfo[name].items:[];
    const dList = frequencyList.data.filter(
      (item)=>item.value.includes(record.wst_taking_times)||
      item.pinyin.includes(record.wst_taking_times)||
      item.wubi.includes(record.wst_taking_times));
    const options = dList.map((d,i) => {
      let flat = false;
      if((+record.disable&1<<1)=="2"){
        if(+record.stock<this.totalDays(record.item_amount,record.wst_taking_days,parseInt("0"+d.times_per_minu),record.min_unit)){
          flat = true;
        }
      }
      return (<Option key={i} value={d.value} disabled={flat}>
        <span className="flex-display">
          <span className="flex-1">{d.num_code}</span>
          <span className="flex-2">{d.value}</span>
          {/* <span className="flex-1">{d.time}</span> */}
          <span className="flex-2">{d.cycle}</span>
          <span className="flex-1">{d.rank}</span>
        </span>
      </Option>);
    })
    return (
      <InputFocus
       left={true}
       up={false}
       right={true}
       down={false}
       enter={true}
       style={{width:'100%'}}
      >
       <Select
          ref={"input-"+(index+1)+"-4-"+medicineInfo.length+"-5-"+name}
          disabled={index>4}
          combobox
          value={record.wst_taking_times}
          style={{ width: '100%' }}
          className={record.status == 2 ? "free_type_color_blue" : (record.fee_type==2?"free_type_color_black":(record.fee_type==1?"free_type_color_red":""))}
          dropdownClassName="yp-dropdown-select w300"
          onSearch={this.frequencyChange.bind(this,index)}
          onSelect={this.frequencySelect.bind(this,index)}
          onFocus={this.frequencyChangeFilterOption.bind(this)}
          onBlur={this.onBlurFrequencyChangeFilterOption.bind(this,index)}
          notFoundContent=""
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          dropdownMatchSelectWidth={false}
        >
          {
            <Option value='-1' disabled>
              <span className="flex-display">
                <span className="flex-1">代码</span>
                <span className="flex-2">名称</span>
                {/* <span className="flex-1">次数</span> */}
                <span className="flex-2">频次</span>
                <span className="flex-1">使用范围</span>
              </span>
            </Option>
          }
          {options}
        </Select>
      </InputFocus>
    )
  }
  //费别
  feeType(record){
    let name = "";
    if(record.fee_type == 1){
      name = "自费";
    }
    if(record.fee_type == 2){
      name = "医保";
    }
    return (
      <span className={record.status == 2 ? "free_type_color_blue" : (record.fee_type==2?"free_type_color_black":(record.fee_type==1?"free_type_color_red":""))}>
        {name}
      </span>
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
    this.props.dispatch(zXMedicineInfo(data));
  }

  render(){
    const {zXPrescriptionInfo,name,drugListTwo,usageDescList,zfList,yfListTwo,zhufuList,frequencyList} = this.props;
    const medicineInfo = zXPrescriptionInfo[name]?zXPrescriptionInfo[name].items:[];
    const columns = [{
      title: '序号',
      key: 'index',
      width:'1rem',
      render: (text,record,index) => {
        return (
          <span className={record.status == 2 ? "free_type_color_blue" : (record.fee_type==2?"free_type_color_black":(record.fee_type==1?"free_type_color_red":""))}>{index+1}</span>
        )
      },
    }, {
      title: '药品名称',
      dataIndex: 'item_name',
      key: 'item_name',
      width:'6rem',
      render: (text,record,index) => this.drugDropSelect(record,index,drugListTwo,medicineInfo),
    }, {
      title: '规格',
      dataIndex: 'wst_spec',
      key: 'wst_spec',
      width:'10rem',
      render :(text,record,index)=>(<span className={record.status == 2 ? "free_type_color_blue" : (record.fee_type==2?"free_type_color_black":(record.fee_type==1?"free_type_color_red":""))}>{text}</span>)
    },{
      title: '每次用量',
        dataIndex: 'item_amount',
        key: 'item_amount',
        width:'4rem',
        render: (text,record,index) => {
          return (
            <span style={{"width":'4rem','display': 'inline-block'}} className={record.status == 2 ? "free_type_color_blue" : (record.fee_type==2?"free_type_color_black":(record.fee_type==1?"free_type_color_red":""))}>
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
                  ref={"input-"+(index+1)+"-2-"+medicineInfo.length+"-5-"+name}
                  disabled={index>4}
                  className={record.status == 2 ? "free_type_color_blue" : (record.fee_type==2?"free_type_color_black":(record.fee_type==1?"free_type_color_red":"")) + " input-number"}
                  min={0}
                  value={text}
                  onChange={this.medicineNumChange.bind(this,index)} />
              </InputFocus>
              {record.wst_taking_unit}
            </span>
          )
        },
    },{
      title: '用法',
      dataIndex: 'usage_desc',
      key: 'usage_desc',
      width:'5rem',
      render: (text,record,index) => this.usageDescDropSelect(record,index,yfListTwo),
    },{
      title: '频次',
      dataIndex: 'wst_taking_times',
      key: 'wst_taking_times',
      width:'4rem',
      render: (text,record,index) => this.wstTakingTimesDropSelect(record,index,frequencyList),
    },{
      title: '持续用药',
      dataIndex: 'wst_taking_days',
      key:'wst_taking_days',
      width:'4rem',
      render: (text,record,index) => {
        return (
          <span style={{"width":'4rem','display': 'inline-block'}} className={record.status == 2 ? "free_type_color_blue" : (record.fee_type==2?"free_type_color_black":(record.fee_type==1?"free_type_color_red":""))}>
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
                ref={"input-"+(index+1)+"-5-"+medicineInfo.length+"-5-"+name}
                disabled={index>4}
                className={record.status == 2 ? "free_type_color_blue" : (record.fee_type==2?"free_type_color_black":(record.fee_type==1?"free_type_color_red":"input-number"))}
                min={0}
                value={text}
                onChange={this.wstTakingDaysChange.bind(this,index)} />
            </InputFocus>
            天
          </span>
        )
      },
    },{
      title: '药品总量',
      dataIndex: 'total_amount',
      key: 'total_amount',
      width:'2rem',
      render: (text, record) => {
        return (
          <span className={record.status == 2 ? "free_type_color_blue" : (record.fee_type==2?"free_type_color_black":(record.fee_type==1?"free_type_color_red":""))}>
            {record.total_amount+record.item_unit}
          </span>
        )
      },
    }, {
      title: '费别',
      dataIndex: 'medicalTreatmentType',
      key: 'medicalTreatmentType',
      width:'5rem',
      render: (text, record) => this.feeType(record),
    },{
      title: '金额',
      dataIndex: 'total_price',
      key: 'total_price',
      width:'5rem',
      render: (text,record,index) => {
        return (
          <span className={record.status == 2 ? "free_type_color_blue" : (record.fee_type==2?"free_type_color_black":(record.fee_type==1?"free_type_color_red":""))}>{+text/10000}</span>
        )
      },
    },{
      title: '嘱咐',
      dataIndex: 'wst_taking_desc',
      key:'wst_taking_desc',
      width:'10rem',
      render: (text,record,index) => {
        return (
          <span className={record.status == 2 ? "free_type_color_blue" : (record.fee_type==2?"free_type_color_black":(record.fee_type==1?"free_type_color_red":""))}>
            <Input
              className={record.status == 2 ? "free_type_color_blue" : (record.fee_type==2?"free_type_color_black":(record.fee_type==1?"free_type_color_red":""))}
              disabled={index>4} type={"text"}
              value={this.state.chargeIndex == index?this.state.charge:text}
              onChange={this.wstTakingDescChange.bind(this,index)}
              onFocus={this.wstTakingDescFocus.bind(this,index)}
              onBlur={this.wstTakingDescBlur.bind(this,index)}
              />
          </span>
        )
      },
    },{
      title: '操作',
      key: 'action',
      width:'5rem',
      fixed: 'right',
      render: (text, record,index) => {
        if(medicineInfo.length-1 != index){
          return  (<Button className={record.total_price==0?'warn-delete':''} type="dashed" icon="circle" icon="close" onClick={this.onDelete(index)} />)
      	}else{
          return ""
      	}
      },
    }];
    return (
      <div className="yinpian">
        <Table
          rowKey={(record,index) =>index}
          bordered
          columns={columns}
          dataSource={medicineInfo}
          pagination={false}
          scroll={{ x: '66rem' }}
          footer={()=>{
            return (
              <div>
                {
                  medicineInfo.length>5?(
                    <div style={{'float':'left',color:'red'}}>
                      <span >*本处方已有5种药品，继续添加请新增处方。</span>
                    </div>
                  ):(<div></div>)
                }
                {
                  this.isFeeType(medicineInfo)?(
                    <div style={{color:'red',fontSize:'.5rem','textAlign': 'right','paddingBottom': '.5rem'}}>
                      <span>*本处方含自费药品，如需报医保，请开医保药品或另开自费处方。</span>
                    </div>
                  ):(<div style={{color:'rgba(0,0,0,0)',fontSize:'.5rem','textAlign': 'right','paddingBottom': '.5rem'}}>
                    <span>*本处方含自费药品，如需报医保，请开医保药品或另开自费处方。</span>
                  </div>)
                }
                {this.props.isSimpleOutpatient?(
                  <Row>
                    <SimpleSelectComponent
                      changeSimpleSelect={this.changeSimpleSelect.bind(this)}
                      achievements_type={zXPrescriptionInfo[name].achievements_type}
                      achievements_name={zXPrescriptionInfo[name].achievements_name}
                      achievements_rel={zXPrescriptionInfo[name].achievements_rel}
                    />
                  </Row>
                ):""}
                <span className="table_footer">
                  <span>小计（元 ）：</span><span >{this.calcTotalPrice(medicineInfo).toFixed(2)}</span>
                </span>
              </div>
            )
          }}
        />
      </div>
    )
  }
}

ZxMedicineTabItem.contextTypes={
  router: PropTypes.object.isRequired,
};
ZxMedicineTabItem.propTypes = {
  zXPrescriptionInfo:PropTypes.object,
  drugListTwo:PropTypes.object,
  usageDescList:PropTypes.object,
  zfList:PropTypes.object,
  yfListTwo:PropTypes.object,
  zhufuList:PropTypes.object,
  frequencyList:PropTypes.object,
  name:PropTypes.string,
};
function mapStateToProps(state){
  return {
    zXPrescriptionInfo:state.zXPrescriptionInfo,
    drugListTwo:state.drugListTwo,
    usageDescList:state.usageDescList,
    zfList:state.zfList,
    yfListTwo:state.yfListTwo,
    zhufuList:state.zhufuList,
    frequencyList:state.frequencyList,
  }
}
export default ZxMedicineTabItem = connect(mapStateToProps)(ZxMedicineTabItem)
