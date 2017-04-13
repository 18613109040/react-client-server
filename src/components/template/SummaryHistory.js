//引用【既往处方】
import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {Row,Col,Input,Checkbox,Button,Select,message,Radio,Modal,Icon,Tabs,Table  } from 'antd';
import {getUser} from "../../utils/User";
import PatientInfoItem from '../PatientInfoItem';
import MedicalList from "../MedicalList";
import {getRecipelistWithOutReduce,getRecipeDetail,addZYTab,searchItem} from "../../store/actions/Medicine";
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

const COMPOSE = "1"
const RECIPE_SOURCE = "3";
//1西药，3中药，5检测检查，6理疗
const RECIPE_TYPE_XY = 1;
const RECIPE_TYPE_ZY = 3;
const RECIPE_TYPE_JC = 5;
const RECIPE_TYPE_LL = 6;
class SummaryHistory extends Component {
  static defaultProps={
		title:"【汇总-既往处方】",
		selectId:"",
    dishisId:"",
    item:{}
	};
	static propTypes = {
		title:PropTypes.string,
		allQuote:PropTypes.func,
		partQuote:PropTypes.func,
		cancel:PropTypes.func,
		selectId:PropTypes.string,
    dishisId:PropTypes.string,
    item:PropTypes.object,
	};
  constructor(props){
    super(props);
    this.state={
    	visible:false,
      selectIndex:0,
      recipesType:3,
      recipesItems:[],
      recipes:[],
      isLoading:false,
      isSecLoading:false,
      item:{},
    }
    this.static = {
      selectKey:'1',
      selectData : {},
    }
  }
  //服务器端和客户端都只调用一次，在初始化渲染执行之前立刻调用。如果在这个方法内调用 setState，render() 将会感知到更新后的 state，将会执行仅一次，尽管 state 改变了。
  componentWillMount(){

  }

  //在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）。在生命周期中的这个时间点，组件拥有一个 DOM 展现，你可以通过 this.getDOMNode() 来获取相应 DOM 节点。
  componentDidMount(){
  }

  componentWillReceiveProps(nextProps){
  	if(nextProps.quoteVisble!= this.props.quoteVisble){
      this.setState({
        dishisId:nextProps.dishisId,
        selectId:nextProps.selectId,
        item:nextProps.item,
      })
      //通过订单号加载订单数据
      this.loadHistoryDisease(nextProps);
  	}
  }

  loadHistoryDisease(nextProps){
    const data = {
      query_type:1,//患者维度查询处方列表
      user_id:getUser().reservation_phone,//Cookie.get('reservation_phone')||"",
      page_no:1,
      page_size:100,
      registration_deal_id:nextProps.selectId,
      recipe_source:RECIPE_SOURCE,
      compose:COMPOSE,
    }
    this.setState({
      isLoading:true,
    })
    this.props.dispatch(getRecipelistWithOutReduce(data,(json)=>{
      this.setState({
        isLoading:false,
      })
      //区分中药西药
      if(json.status != "0"){
        Modal.error({
          content: json.message,
        });
      }else{
        this.setState({
          recipes:json.data.recipes
        });
        if(json.data.recipes&&json.data.recipes.length>0){
          this.onRowClickTable(json.data.recipes[0],0)
        }
      }
    }))
    this.setState({
      visible:nextProps.quoteVisble,
    });
  }

  //取消
  cancel(){
    if(this.props.cancel instanceof Function ){
      this.props.cancel();
    }
  }

  //点击就诊记录 拉取数据
  onClickRow(item,id){
    this.setState({
      dishisId:id,
      selectId:item.deal_id,
      item:item,
      recipesType:3,
      recipesItems:[],
      recipes:[],
    })
    this.loadHistoryDisease({quoteVisble:true,selectId:item.deal_id})
  }
  //row select 样式
  rowClassNameSelect(record, index){
    if(index == this.state.selectIndex){
      return "select-row";
    }else{
      return ""
    }
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
        compose:COMPOSE
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
  selectDetailTable(){
    const {recipesItems,recipesType} = this.state;
    switch (recipesType) {
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
              record.wst_taking_unit+"/"+
              record.wst_taking_times+"/"+
              record.wst_taking_days+"/"+
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
    const patient = {
      headerImg:getUser().patient_image,
      patientName:getUser().patient_name,
      sex:getUser().patient_sex,
      age:getUser().patient_age,
      diagnose:"",
      imgSpan:7,
			patientSpan:8,
			sexSpan:3,
			ageSpan:6
    }
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
        return (<span>{this.prescriptionType(record.recipe_type)}</span>);
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
      <div className="prescriptionTemplate">
      	<Modal
      		title={this.props.title}
      		maskClosable={false}
      		visible={this.state.visible}
          onCancel={this.cancel.bind(this)}
          width={"80%"}
          style={{minWidth:"900px"}}
          footer={false}
          wrapClassName="citeManageModel"
        >
          <Row type="flex" justify="space-around" align="top"  className="content">
          	<Col span={5} className="model-left">
          		<PatientInfoItem {...patient} />
          		<MedicalList
          			location={this.props.location}
		        		onClickRow={this.onClickRow.bind(this)}
		        		selectId={this.state.selectId}
		        		showFooter="pagination"
		        	/>
          	</Col>
          	<Col span={19}  className="model-right">
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
                dataSource={this.state.recipes}
                loading={this.state.isLoading}
                onRowClick={this.onRowClickTable.bind(this)}
                />
              </Row>
              <Row style={{"paddingTop":".8rem"}}>
                {this.selectDetailTable()}
              </Row>
              <Row>
                <span className='prescription-doctor'>处方医生：{this.state.item.doctor_name}</span>
              </Row>
          	</Col>
          </Row>
        </Modal>
      </div>
    );
  }
}

SummaryHistory.contextTypes={
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state){
  return {
    prescriptionInfo:state.prescriptionInfo,
  }
}

export default connect(mapStateToProps)(SummaryHistory)
