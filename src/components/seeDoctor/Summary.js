/*
 * 门诊 总结
 */

import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {Menu,Row,Col,Tag,Table,Modal} from 'antd';
const confirm = Modal.confirm;
import { Button } from 'antd';
import MedicalList from "../MedicalList";
import {getRecipelistWithOutReduce,getRecipelist,getRecipeDetail,deleteRecipeDetail} from "../../store/actions/Medicine";
import {getUser} from "../../utils/User";
import SummaryHistory from '../template/SummaryHistory';

const RECIPE_SOURCE = "3";
//1西药，3中药，5检测检查，6理疗
//1.西药 3.中药饮片 4.检查 5.检验 6.治疗 7.材料 8.其它 9.协定方
const RECIPE_TYPE_XY = '1';
const RECIPE_TYPE_ZY = '3';
const RECIPE_TYPE_JC = '5';
const RECIPE_TYPE_LL = '6';
const RECIPE_TYPE_CL = '7';
const RECIPE_TYPE_QT = '8';
const RECIPE_TYPE_XDF = '9';



class Summary extends Component {
  constructor(props){
    super(props);
    this.state={
      recipes:[],
      recipesType:3,
      recipesItems:[],
      selectIndex:0,
      historyTemplate:{
        dishisId:'0',
        selectId:'0',
        quoteVisble:false,
        item:{}
      },
      isLoading:false,
      isSecLoading:false,
    }
  }
  componentWillMount(){
  }

  // componentWillReceiveProps(oNextProps){
  //   // this.setState({
  //   //   recipesItems:[],
  //   // })
  //   // if(oNextProps.recipes&&oNextProps.recipes.length>0){
  //   //   this.onRowClickTable(oNextProps.recipes[0],0);
  //   //   if(oNextProps.recipelist.data.recipes&&oNextProps.recipelist.data.recipes.length==0){
  //   //     this.loadMoney();
  //   //   }
  //   // }
  // }
  //加载金额
  loadMoney(){
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
  componentDidMount(){
    //汇总加载数据
    const data = {
      query_type:1,//患者维度查询处方列表
      // user_id:getUser().user_id,//Cookie.get('reservation_phone')||"",
      user_id:getUser().reservation_phone,//Cookie.get('reservation_phone')||"",
      page_no:1,
      page_size:100,
      registration_deal_id:getUser().deal_id,
      recipe_source:"3",
      compose:"1",
    }
    this.setState({
      isLoading:true,
    })
    this.props.dispatch(getRecipelistWithOutReduce(data,(json)=>{
      //区分中药西药
      if(json.status != "0"){
        Modal.error({
          content: json.message,
        });
      }else{
        if(json.data.recipes&&json.data.recipes.length > 0){
          this.setState({
            recipes:json.data.recipes,
            isLoading:false,
          })
          this.onRowClickTable(json.data.recipes[0],0);
        }else{
          this.setState({
            recipes:[],
            isLoading:false,
          })
        }
      }
    }))
  }

  //处方类型判断
  prescriptionType(recipe_type){
    let name = "";
    // record.recipe_type
    switch (recipe_type) {
      case RECIPE_TYPE_XY:{
        name = "中西成药";
        break;
      }
      case RECIPE_TYPE_ZY:{
        name = "中药饮片";
        break;
      }
      case RECIPE_TYPE_JC:{
        name = "检验检查";
        break;
      }
      case RECIPE_TYPE_LL:{
        name = "治疗理疗";
        break;
      }
      case RECIPE_TYPE_CL:{
        name = "材料";
        break;
      }
      case RECIPE_TYPE_QT:{
        name = "其它";
        break;
      }
      case RECIPE_TYPE_XDF:{
        name = "协定方";
        break;
      }
      default:{
        name = "其它";
      }
    }
    return name;
  }
  //table select event
  onRowClickTable(record, index){
    this.setState({
      isSecLoading:true,
    })
    this.props.dispatch(
      getRecipeDetail({
        cloud_recipe_id:record.cloud_recipe_id,
        user_id:getUser().reservation_phone,
        recipe_source:"3",
        compose:"1"
      },(res)=>{
        this.setState({
          isSecLoading:false,
        });
        if(res.status == 0){
          this.setState({
            recipesType:record.recipe_type,
            recipesItems:res.data.items,
            selectIndex:index,
          })
        }
      }));
  }
  //row select 样式
  rowClassNameSelect(record, index){
    if(index == this.state.selectIndex){
      return "select-row";
    }else{
      return ""
    }
  }
  selectDetailTable(){
    const {recipesItems,recipesType} = this.state;
    switch (recipesType+"") {
      case RECIPE_TYPE_XY:{
        // name = "中西成药";
        return this.xyDetailTable(recipesItems);
        break;
      }
      case RECIPE_TYPE_ZY:{
        return this.zyDetailTable(recipesItems);
        break;
      }
      case RECIPE_TYPE_JC:{
        // name = "检验检查";
        return this.jcDetailTable(recipesItems);
        break;
      }
      case RECIPE_TYPE_LL:{
        // name = "治疗理疗";
        return this.llDetailTable(recipesItems);
        break;
      }
      case RECIPE_TYPE_CL:{
        return this.zyDetailTable([]);
        break;
      }
      case RECIPE_TYPE_QT:{
        return this.zyDetailTable(recipesItems);
        break;
      }
      case RECIPE_TYPE_XDF:{
        return this.zyDetailTable([]);
        break;
      }
      default:{
        return this.zyDetailTable([]);
      }
    }
  }
  //对应的table详情   中西成药
  xyDetailTable(recipesItems){
    const columns = [{
      title: '序号',
      key: 'index',
      className:"text-center",
      render: (text,record,index) => {
        return (
          <span>{index+1}</span>
        )
      },
    }, {
      title: '药品名称',
      dataIndex: 'item_name',
      key: 'item_name',
      className:"text-center",
    }, {
      title: '每次剂量',
      dataIndex: 'item_amount',
      key: 'item_amount',
      className:"text-center",
      render: (text,record,index) => {
        return (
          <span>
            {
              record.item_amount+
              record.wst_taking_unit+" / "+
              record.wst_taking_times+" / "+
              record.wst_taking_days+"天 / "+
              record.usage_desc
            }
          </span>
        )
      }
    },{
      title: '总量',
      dataIndex: 'total_amount',
      key: 'total_amount',
      className:"text-center",
      render: (text, record) => {
        return (<span>{record.total_amount+record.item_unit}</span>)
      },
    },{
      title: '嘱咐',
      dataIndex: 'wst_taking_desc',
      key:'wst_taking_desc',
      className:"text-center",
    }];
    return this.returnTable(columns,recipesItems);
  }
  //对应的table详情   检测检验
  jcDetailTable(recipesItems){
    const columns = [{
      title: '序号',
      key: 'index',
      className:"text-center",
      render: (text,record,index) => {
        return (
          <span>{index+1}</span>
        )
      },
    },{
      key: "item_name",
      title: '项目名称',
      dataIndex: 'item_name',
      className:"text-center",
    },{
      title: '单位',
      dataIndex: 'item_unit',
      key:'item_unit',
      className:"text-center",
    },{
      key: "item_price",
      title: '单价',
      dataIndex: 'item_price',
      className:"text-center",
      render: (text)=>(<span>{text/10000}</span>)
    },{
      title: '数量',
      dataIndex: 'item_amount',
      key: "item_amount",
      className:"text-center",
    }]
    return this.returnTable(columns,recipesItems);
  }
  //对应的table详情   治疗理疗
  llDetailTable(recipesItems){
    const columns = [{
      title: '序号',
      key: 'index',
      className:"text-center",
      render: (text,record,index) => {
        return (
          <span>{index+1}</span>
        )
      },
    },{
		  title: '治疗项目名称',
		  dataIndex: 'item_name',
      key: 'item_name',
      className:"text-center",
		}, {
		  title: '单位',
		  dataIndex: 'item_unit',
      key: 'item_unit',
      className:"text-center",
		},{
		  title: '数量',
		  dataIndex: 'item_amount',
      key: 'item_amount',
      className:"text-center",
		},{
      key: "total_price",
      title: '金额',
      dataIndex: 'total_price',
      className:"text-center",
      render: (text)=>(<span>{text/10000}</span>)
		},{
			title: '穴位1',
      dataIndex: 'acupoint_name1',
      key: 'acupoint_name1',
      className:"text-center",
		  render: (text, record) => (<span>{record.acupoint_name1||"----"}</span>)
		},{
			title: '穴位2',
      dataIndex: 'acupoint_name2',
      key: 'acupoint_name2',
      className:"text-center",
		  render: (text, record) => (<span>{record.acupoint_name2||"----"}</span>)
		},{
			title: '穴位3',
      dataIndex: 'acupoint_name3',
      key: 'acupoint_name3',
      className:"text-center",
		  render: (text, record) => (<span>{record.acupoint_name3||"----"}</span>)
		},{
			title: '穴位方',
      dataIndex: 'acupoint_name4',
      key: 'acupoint_name4',
      className:"text-center",
		  render: (text, record) => (<span>{record.acupoint_name4||"----"}</span>)
		}];
    return this.returnTable(columns,recipesItems);
  }
  //对应的table详情   中药饮片
  zyDetailTable(recipesItems){
    const columns = [{
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      className:"text-center",
      render: (text, record,index) => {
        return (<span>{index+1}</span>)
      },
    },{
      title: '名  称',
      dataIndex: 'item_name',
      key: 'item_name',
      className:"text-center",
    },{
      title: '剂量',
      dataIndex: 'item',
      key: 'item',
      className:"text-center",
      render: (text,record,index) => {
        return (
          <span>{record.item_amount+record.item_unit}</span>
        )
      },
    },{
      title: '总量',
      dataIndex: 'total',
      key: 'total',
      className:"text-center",
      render: (text,record,index) => {
        return (
          <span>{record.total_amount+record.wst_taking_unit}</span>
        )
      },
    },{
      title: '细目用法',
      dataIndex: 'usage_desc',
      className:"text-center",
      key: 'usage_desc',
    }];
    return this.returnTable(columns,recipesItems);
  }
  returnTable(columns_detail,recipesItems){
    return (
      <Table
        rowKey={(record,index) => index}
        title={()=>(
          <div>
            <span>处方明细：</span>
          </div>)}
        columns={columns_detail}
        loading={this.state.isSecLoading}
        pagination={false}
        dataSource={recipesItems}
      />
    )
  }
  render(){
    const prescriptionDetailList = [];
    const {recipes} = this.state;
    const columns = [{
      title: '处方号',
      dataIndex: 'cloud_recipe_id',
      key: 'cloud_recipe_id',
      className:"text-center",
      width:"25%",
    },{
      title: '处方类型',
      dataIndex: 'recipe_type',
      key: 'recipe_type',
      className:"text-center",
      width:"25%",
      render: (text, record,index) => {
        // 1.西药 3.中药饮片 4.检查 5.检验 6.治疗 7.材料 8.其它 9.协定方 10.其它
        return (<span>{this.prescriptionType(record.recipe_type+"")}</span>);
      }
    },{
      title: '总金额',
      dataIndex: 'total_price',
      key: 'total_price',
      className:"text-center",
      width:"10%",
      render: (text, record,index) => {
        return (<span>{record.total_price/10000}</span>);
      }
    },{
      title: '备注',
      className:"text-center",
      dataIndex: 'taking_desc',
      key: 'taking_desc',
      width:"40%",
    }];

    return(
      <div className="seedoctor-summary">
      <Col lg={18} md={16} sm={24} xs={24} className="yinpin-tabs">
        <Row>
          <Table
          rowKey={(record,index) => index}
          title={()=>(
            <div>
            <span>处方项目：</span>
            </div>
          )}
          rowClassName={this.rowClassNameSelect.bind(this)}
          pagination={false}
          columns={columns}
          scroll={{ y: 240 }}
          dataSource={recipes}
          loading={this.state.isLoading}
          onRowClick={this.onRowClickTable.bind(this)}
          />
        </Row>
        <Row style={{"paddingTop":".8rem"}}>
          {this.selectDetailTable()}
        </Row>
      </Col>
      <Col lg={5} md={7} sm={24} xs={24} offset={1} className="right_fex_option">
        <MedicalList
          onClickRow={this.onClickRow.bind(this)}
          selectId={this.state.historyTemplate.selectId}
          showFooter="more"
        />
      </Col>
      <Col>
        {/* 患者既往处方模板  汇总查看*/}
        <SummaryHistory
          quoteVisble={this.state.historyTemplate.quoteVisble}
          selectId={this.state.historyTemplate.selectId}
          dishisId={this.state.historyTemplate.dishisId}
          item={this.state.historyTemplate.item}
          allQuote={this.allQuote.bind(this)}
          partQuote={this.partQuote.bind(this)}
          cancel={this.cancel.bind(this)}
          checkId = {this.state.activeKey}
        />
      </Col>
      </div>
    );
  }
}
Summary.contextTypes={

}
Summary.defaultProps={
};
Summary.propTypes = {
  recipelist:PropTypes.object,
}
function mapStateToProps(state){
  return {
    recipelist:state.recipelist,
  }
}
export default connect(mapStateToProps)(Summary)
