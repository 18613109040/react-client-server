/*
 * 患者咨询 结束
 */
import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import { Menu, Breadcrumb, Icon,Row,Col,Tag } from 'antd';
import {getConsultsEnd} from "../store/actions/willConsult";
import TableGrid from '../components/TableGrid';
import {getUser} from "../utils/User";
import {convertTimeToStr} from "../utils/tools"
class ConsultsEnd extends Component {
  constructor(props){
    super(props);

  }
  componentDidMount(){
    const postconfig = {
  		message_status:[3,4] ,
  		page_no:1,
  		page_size:10,
  		role:getUser().role,
  		role_id:getUser().doctor_id,
  		order:"desc",
  		sort:"last_time"
  	}

  	this.props.dispatch(getConsultsEnd(postconfig));
  }
  render(){
  	const columns = [ {
     key: "1",
		  title: '姓名',
		  width: '40%',
		  render : (text,recod) =>(
		  	<div className="">
		  		<Row type="flex" justify="start" align="middle">
				      <Col ><img src={recod.user_img} className="ant-img-style"/></Col>
				      <Col  offset={2}>{recod.patient_name}</Col>
				      <Col  offset={2}>{recod.patient_sex==0?(<span>未知</span>):recod.patient_sex==1?(<span >男</span>):(<span>女</span>)}</Col>
				      <Col  offset={2}>{recod.patient_age}</Col>
				</Row>
		  	</div>
		  )
		},
		{
      key: "2",
			title:"内容",
			dataIndex:'last_message',
			width: '30%',

			render : (text,recod) =>(
		  	   <span className="colFormat">{text}</span>
		   )
		},
   		{
        key: "3",
			title:"时间",
			dataIndex:'last_time',
			width: '20%',

			render : (text,recod) =>(
		  	<span ><Icon type="clock-circle-o" style={{"marginRight":"15px"}} />{convertTimeToStr(text,"yyyy-MM-dd hh:mm:ss")}</span>
		   )

		},
   		{
        key: "4",
		title:"来源",
		dataIndex:'source',
		width: '10%',
		render : (text,recod) =>(
		  	<Tag  color="green"> {text == 3?"微信":text==18?"H5":text==28?"平安金管家":"未知"}</Tag>
		)
		}];

    const dataSource = this.props.getConsultsEnd;
    const setgrid = getConsultsEnd;
    const dispatch =  this.props.dispatch;
    const routerpath = "/chatcenter";
    const flage = "ConsultsEnd";
    const pageSize = 10;
    const config = {
    	dataSource,
    	setgrid,
    	columns,
    	dispatch,
    	pageSize,
    	routerpath,
    	flage,
    	postconfig :{
	  		message_status:[3,4] ,
	  		page_no:1,
	  		page_size:10,
	  		role:getUser().role,
	  		role_id:getUser().doctor_id,
	  		order:"desc",
	  		sort:"last_time"
	  	}

    }
    return(
      <div className="inner-page stock-flow">

			<TableGrid {...config}/>

      </div>
    );
  }
}

ConsultsEnd.contextTypes={
  router: React.PropTypes.object.isRequired
};
ConsultsEnd.propTypes = {
};
function mapStateToProps(state){
  return {
    getConsultsEnd:state.getConsultsEnd
  }
}
export default connect(mapStateToProps)(ConsultsEnd)
