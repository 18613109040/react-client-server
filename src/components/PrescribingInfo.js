//处方信息
import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {Icon ,Button,Row,Col ,Table } from 'antd';
import {RECIPETYPE,RECIPESTATUS} from '../utils/public'

//1.西药 3.中药饮片 4.检查 5.检验 6.治疗 7.材料 8.其它 9.协定方
const RECIPE_TYPE_XY = '1';
const RECIPE_TYPE_ZY = '3';
const RECIPE_TYPE_JC = '5';
const RECIPE_TYPE_LL = '6';
const RECIPE_TYPE_CL = '7';
const RECIPE_TYPE_QT = '8';
const RECIPE_TYPE_XDF = '9';

export default class PrescribingInfo extends Component {
  constructor(props){
    super(props);
    this.index = 0;
    this.state={
    	current:1,
      selectNum : 0,
    	pagination:12,
    	loading:false,
    	loading2:false
    }
    this.onClickRow = this.onClickRow.bind(this);
    this.onAbrogate = this.onAbrogate.bind(this);
    this.getRowClassName = this.getRowClassName.bind(this);
  }
  //服务器端和客户端都只调用一次，在初始化渲染执行之前立刻调用。如果在这个方法内调用 setState，render() 将会感知到更新后的 state，将会执行仅一次，尽管 state 改变了。
  componentWillMount(){}

  //在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）。在生命周期中的这个时间点，组件拥有一个 DOM 展现，你可以通过 this.getDOMNode() 来获取相应 DOM 节点。
  componentDidMount(){

  }
  onClickRow(record,index){
    const {onClickRow} = this.props;
    if (typeof(onClickRow)!=='function') return;
    onClickRow(record);
    this.setState({selectNum:index});
  }
  onAbrogate(e){
    const {onAbrogate} = this.props;
    const record = this.props.data[e.target.dataset.row]
    e.stopPropagation();
    if (typeof(onAbrogate)!=='function') return;
    onAbrogate(record);
  }
  handleTableChange(pagination, filters, sorter) {
    const pager = this.state.pagination;
    pager.current = pagination.current;
    this.setState({
      selectNum : 0,
      pagination: pager,
      loading:true
    });

  }
  getRowClassName(record,index){
    if (index===this.state.selectNum) {
      return 'active'
    }
  }

  selectDetailTable(){
    const {childData} = this.props;
    switch (childData.recipe_type+"") {
      case RECIPE_TYPE_XY:{
        // name = "中西成药";
        return this.xyDetailTable(childData.items);
        break;
      }
      case RECIPE_TYPE_ZY:{
        return this.zyDetailTable(childData.items);
        break;
      }
      case RECIPE_TYPE_JC:{
        // name = "检验检查";
        return this.jcDetailTable(childData.items);
        break;
      }
      case RECIPE_TYPE_LL:{
        // name = "治疗理疗";
        return this.llDetailTable(childData.items);
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
      <div className="mingxi">
        <div className="title">处方明细:</div>
        <div className="table">
          <Table
            rowKey={(record,index) => index}
            columns={columns_detail}
            dataSource={recipesItems}
            loading={this.state.loading2}
            pagination={false}
          />
        </div>
      </div>
    )
  }



  render(){
    const {data,childData} = this.props;
    this.static = {
      pColumn : [
        {title: '处方号',dataIndex: 'cloud_recipe_id'},
        {title: '类别',dataIndex: 'recipe_type',render:(text)=>{return RECIPETYPE[text]}},
        {title: '金额',dataIndex: 'total_price',render:(text)=>text/10000},
        {title: '所在医馆',dataIndex: 'shop_name'},
        {title: '状态',dataIndex:"is_pay",render:(text)=>{ return (text!='1'?'未付费':'已付费')}},
        {title: '操作',render:(text, record,index) => {
            if(this.props.isHidden == 1){
              return (<div></div>);
            }
            return (record.is_pay!='1'?<a data-row={index} onClick={this.onAbrogate}>报废</a>:'')
          }
        }
      ],
      dColumn : [
        {title: '序号',dataIndex: 'deal_id',render:(text,record,index)=>{return index+1}},
        {title: '名称',dataIndex: 'item_name'},
        {title: '剂量',dataIndex: 'item_amount',render:(text,record)=>`${text}${record.item_unit}`},
        {title: '总量',  dataIndex: 'total_amount',render:(text,record)=>`${text}${record.item_unit}`},
        {title: '细目用法',dataIndex: 'usage_desc'}
      ]
    }
    let all = 0;
    data.map(item=>{
    	all += parseInt(item.total_price);
    })

    return(
      <div className="prescribingInfo">
      	<div className="mingxi">
      		<div className="title">处方项目:</div>
      		<div className="table">
      			<Table
              rowKey={(record,index) => index}
              dataSource={data}
      				columns={this.static.pColumn}
              onRowClick = {this.onClickRow}
              rowClassName = {this.getRowClassName}
						  pagination={this.state.pagination}
						  onChange={this.handleTableChange.bind(this)}
						  loading={this.state.loading}
						  pagination={false}
						  footer={(data) => <span style={{"display":"block",
    "textAlign": "center",
    "fontSize":"15px",
    "color": "black"}}>合计:{all/10000}</span>}
      			/>
      		</div>
      	</div>

        {this.selectDetailTable()}

      </div>
    );
  }
}

PrescribingInfo.contextTypes={
  router: React.PropTypes.object.isRequired
};
PrescribingInfo.propTypes = {
  data : PropTypes.array,
  isHidden:PropTypes.string,
  childData : PropTypes.object.isRequired,
  onClickRow : PropTypes.func.isRequired,
  onAbrogate : PropTypes.func.isRequired //废除处方
};
