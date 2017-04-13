//统计
import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {Breadcrumb,Row,Col, Icon ,Button ,Select,DatePicker ,Input ,Pagination ,Table,Form} from 'antd';
const { RangePicker } = DatePicker;
import {medicrecordList,statisticsDoctor} from "../store/actions/CiteManage";
const Option = Select.Option;
import {getStore} from "../store/actions/User";
import moment from 'moment';
import {getUser} from "../utils/User";
import {convertTimeToStr,convertStrToStamp,objToUrlString,convertGender,getAgeByBirthday,dealState} from "../utils/tools";

class Statistics extends Component {
  constructor(props){
    super(props);
    this.state={
    	info:true,
    	clinic_id:"",
    	date:convertTimeToStr(new Date(),'yyyy-MM-dd'),
    	deal_start_time:convertStrToStamp(new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()-1),true),
    	deal_end_time:convertStrToStamp(new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()),true),
    	dataList:[],
    	getshopstore:[],
    	dataStatic:[],
    	pagination: {
    		
    	},
    	pagination2: {
    		
    	}
    }
    this.onChangeDate = this._onChangeDate.bind(this);
    this.handleChange = this._handleChange.bind(this);
    this.onRowClick = this._onRowClick.bind(this);
    this.statistics = this._statistics.bind(this);
    this.static = {
	    columns : [{
			  title: '日期',
			  dataIndex: 'created_at',
			  key: 'created_at',
			  width: 150,
			  render: (text, record) => (
			  	record.Shop_Id.toString() == '-1'?(<span>合计</span>):(<span>{convertTimeToStr(text,'yyyy-MM-dd')}</span>)
				)
			},{
			  title: '门店名称',
			  dataIndex: 'shop_name',
			  key: 'shop_name',
			  render: (text, record) => (
			  	record.Shop_Id.toString() == '-1'?(<span></span>):(
			  		<span>{this.state.getshopstore.filter(item=>item.shop_no == record.Shop_Id).length>0?
			  			this.state.getshopstore.filter(item=>item.shop_no == record.Shop_Id)[0].shop_name:"医馆名称错误"}</span>
			  	)
				)
			},{
			  title: '挂号费',
			  dataIndex: 'GuaHaoFee',
			  key: 'GuaHaoFee',
			},{
			  title: '治疗费',
			  dataIndex: 'ZhiLiaoFee',
			  key: 'ZhiLiaoFee',
			},{
			  title: '中成药费',
			  dataIndex: 'ZhongChengYaoFee',
			  key: 'ZhongChengYaoFee',
			},{
			  title: '西药费',
			  dataIndex: 'XiYaoFee',
			  key: 'XiYaoFee',
			},{
			  title: '协定方费',
			  dataIndex: 'XieDFZhuanJia',
			  key: 'XieDFZhuanJia',
			},{
			  title: '贵细产品费',
			  dataIndex: 'GuiXiFee',
			  key: 'GuiXiFee',
			},{
			  title: '合计',
			  dataIndex: 'all',
			  key: 'all',
			  render: (text, record) => (
				  <span>{parseInt(record.GuaHaoFee)+parseInt(record.ZhiLiaoFee)+parseInt(record.ZhongChengYaoFee)+parseInt(record.XiYaoFee)+parseInt(record.XieDFZhuanJia)+parseInt(record.GuiXiFee)}</span>
				)
			}],
	  	columns2:[
		  	{
				  title: '看诊日期',
				  dataIndex: 'recipe_time',
				  key: 'recipe_time',
				  render: (text, record) => (
				    <span>{convertTimeToStr(text,'yyyy-MM-dd')}</span>
				  )
				},{
				  title: '患者姓名',
				  dataIndex: 'patient_name',
				  key: 'patient_name',
				},{
				  title: '诊疗卡号',
				  dataIndex: 'member_no',
				  key: 'member_no',
				},{
				  title: '性别',
				  dataIndex: 'patient_sex',
				  key: 'patient_sex',
				  render: (text, record) => (
				    <span>{convertGender(text)}</span>
				  )
				},{
				  title: '年龄',
				  dataIndex: 'patient_birth',
				  key: 'patient_birth',
				  render: (text, record) => (
				    <span>{getAgeByBirthday(text)}</span>
				  )
				},{
				  title: '挂号单',
				  dataIndex: 'deal_id',
				  key: 'deal_id',
				},{
				  title: '号别',
				  dataIndex: 'address',
				  key: 'a7',
				},{
				  title: '医馆',
				  dataIndex: 'clinic_name',
				  key: 'clinic_name',
				  render: (text, record) => (
			  	
			  		<span>{this.state.getshopstore.filter(item=>item.shop_no == record.clinic_id).length>0?
			  			this.state.getshopstore.filter(item=>item.shop_no == record.clinic_id)[0].shop_name:"医馆名称错误"}</span>
			  	
				  )
				},{
				  title: '看诊医生',
				  dataIndex: 'doctor_name',
				  key: 'doctor_name',
				},{
				  title: '挂号员',
				  dataIndex: 'registration_operator',
				  key: 'registration_operator',
				},{
				  title: '状态',
				  dataIndex: 'deal_state',
				  key: 'deal_state',
				  render: (text, record) => (
				   	<span>{dealState(text.toString())}</span>
				  )
				},{
				  title: '主要诊断',
				  dataIndex: 'diagnose',
				  key: 'diagnose',
				}
	  	]
    }
  }
  //服务器端和客户端都只调用一次，在初始化渲染执行之前立刻调用。如果在这个方法内调用 setState，render() 将会感知到更新后的 state，将会执行仅一次，尽管 state 改变了。
  componentWillMount(){}

  //在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）。在生命周期中的这个时间点，组件拥有一个 DOM 展现，你可以通过 this.getDOMNode() 来获取相应 DOM 节点。
  componentDidMount(){
  	this.props.dispatch(getStore({doctor_id:getUser().doctor_id,page_no:"1",page_size:"1000",push_type:"0"},(res)=>{
  		if(res.status.toString()=="0"&&res.data.length>0){
  			this.setState({
	  			getshopstore:res.data
	  		})
  		}
  		
  	}));
  	this.getData(1,15);
  }
  //时间选择
  _onChangeDate(date, dateString){
  	
  	
    this.setState({
    	date:dateString[0],
			deal_start_time:(new Date(dateString[0]).getTime())/1000,
			deal_end_time:(new Date(dateString[1]).getTime())/1000+86400
		})
       
  	
  }
  //统计
  _statistics(){
  	this.getData(1,15);
  }
  rest(){
  	this.getData(1,15);
  }
  getData(page_no,page_size){
  	if(this.state.info){
  		const medicrecord = {
	  		doctor_id:getUser().doctor_id,
	      clinic_id:this.state.clinic_id,
	      reservation_start_time:this.state.deal_start_time,
	      reservation_end_time:this.state.deal_end_time,
	  		page_no:page_no,
	  		page_size:page_size,
	  		deal_type:"3",
	  		
	  	}
	  	this.props.dispatch(medicrecordList(medicrecord,(res)=>{
	  		if(res.status.toString()=="0" ){
	  			if(res.deal_list.length>0){
	  				this.setState({
		  				dataList:res.deal_list,
		  				pagination:{
		  					total:parseInt(res.total_num),
		  					pageSize:parseInt(res.page_size)
		  				}
		  			})
	  			}else{
	  				this.setState({
			  			dataList:[]
			  		})
	  			}
	  		}else{
	  			this.setState({
		  			dataList:[]
		  		})
	  		}
	  	}))
  	}else{
  		
  		const medicrecord = {
	  		doctor_id:getUser().doctor_id,
	      shop_id:this.state.clinic_id,
	     	date:this.state.date,
	  		page:page_no,
	  		size:page_size,
	  		type:"doctor"
	  	}
	  	this.props.dispatch(statisticsDoctor(medicrecord,(res)=>{
	  		if(res.status.toString()=="0" ){
	  			if(res.data &&res.data.data.length>0){
	  				this.setState({
		  				dataStatic:res.data.data,
		  				pagination2:{
		  					total:parseInt(res.total_num),
		  					pageSize:15
		  				}
		  			})
	  			}else{
	  				this.setState({
			  			dataStatic:[]
			  		})
	  			}
	  		}else{
	  			this.setState({
		  			dataStatic:[]
		  		})
	  		}
	  	}))
  		
  	}
  }
  _handleChange(value){
  	this.setState({
  		clinic_id:value
  		
  	})
  }
  _onRowClick(record,index){
  	this.setState({
  		info:true,
  		clinic_id:record.Shop_Id
  	})
  }
  handleTableChange(pagination, filters, sorter){
    const pager = this.state.pagination;
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.getData(pagination.current,pagination.pageSize)
  }
  handleTableChange2(pagination, filters, sorter){
    const pager = this.state.pagination2;
    pager.current = pagination.current;
    this.setState({
      pagination2: pager,
    });
    this.getData(pagination.current,pagination.pageSize)
  }
  resback(){
  	this.setState({
  		info:false
  	})
  }
  render(){
  	
  	
  	const children = [];
  	children.push(<Option key={"0"} value={""} >全部</Option>)
  	this.state.getshopstore.map((data)=>{
			children.push(<Option key={data.shop_no} value={data.shop_no.toString()} data={data}>{data.shop_name}</Option>)
		})
    return(
      <div className="statistics">
      	<Row  type="flex" justify="center" align="middle" className="title-set">
      		<Col span={8}>
      			<span>看诊时间:</span>
      			<span> 
      				<RangePicker 
      					 defaultValue={[moment(new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()-1), 'YYYY/MM/DD'), moment(new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()-1), 'YYYY/MM/DD')]}
      					onChange={this.onChangeDate}/>
      			</span>
      		</Col>
      		<Col span={8}>
      			<span>所在医馆:</span>
      			<span>
      				<Select  style={{ width: 200 }} onChange={this.handleChange} value={this.state.clinic_id}>
					      	{children}
					    </Select>
      			</span>
      		</Col>
      		<Col span={8}>
      			<Row type="flex" justify="space-around">
      				<Col span={8}>
      					<Button onClick={this.statistics} type="primary" icon="search">统计</Button>
      				</Col>
      				<Col span={8}>
      					<Button type="primary" ghost onClick={this.rest.bind(this)}>刷新</Button>
      				</Col>
      				<Col span={8}>
      					<Button onClick={this.resback.bind(this)} type="primary" >返回</Button>
      				</Col>
      			</Row>
      		</Col>
      	</Row>
      	<Row className="table_content">
      		{this.state.info?(
      			<Table
	      			columns={this.static.columns2} 
	      			dataSource={this.state.dataList}
	      			rowKey={(record,id) => id}
	      		  pagination={this.state.pagination}
	      		  onChange={this.handleTableChange.bind(this)}
	      		  
	      		/>
      		):(
      			<Table
	      			columns={this.static.columns}
	      			dataSource={this.state.dataStatic}
	      			rowKey={(record,id) => id}
	      			pagination={this.state.pagination2}
	      			onChange={this.handleTableChange2.bind(this)}
	      			onRowClick={(record,index)=>{this.onRowClick(record,index)}}
	      		/>
      		)}
      		
      	</Row>
      </div>
    );
  }
}

Statistics.contextTypes={
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state){
  return {
  	
  }
}
export default connect(mapStateToProps)(Statistics)

