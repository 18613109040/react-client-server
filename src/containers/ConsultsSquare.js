/*
 * 咨询广场
 */
import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {getConsults} from "../store/actions/ConsultsSquare";
import {getUsrInfo} from "../store/actions/getUserInfo";
import { Menu, Breadcrumb, Icon ,Row,Col,Tabs,Badge,Tag,Alert} from 'antd';
import TableGrid from '../components/TableGrid';
import {convertTimeToStr} from "../utils/tools";
import {getUser} from "../utils/User";

class ConsultsSquare extends Component {
  constructor(props){
    super(props);
    this.state={
      collapse:true,
      consultsNumber:11111
    }
  }
  componentDidMount(){

    this.props.dispatch(getConsults({page_no: 1, page_size:10 }, (res)=>{
    }));
    this.props.dispatch(getUsrInfo({role: 2, role_id:getUser().doctor_id }));


  }

  render(){

	const columns = [ {
      	key: "1",
		title: '姓名',
		width: '40%',
		render : (text,recod) =>(
		  	<div >
		  		<Row type="flex" justify="start" align="middle">
				      <Col><img src={recod.user_img} className="ant-img-style"/></Col>
				      <Col  offset={1}>{recod.patient_name}</Col>
				      <Col  offset={1}>{recod.patient_sex==0?(<span>未知</span>):recod.patient_sex==1?(<span >男</span>):(<span>女</span>)}</Col>
				      <Col  offset={1}>{recod.patient_age}</Col>
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
		},{
        key: "3",
		title:"时间",
		dataIndex:'last_time',
		width: '20%',
		render : (text,recod) =>(
		  	<span ><Icon type="clock-circle-o"  />{convertTimeToStr(text,"yyyy-MM-dd hh:mm:ss")}</span>
		)
		},{
        key: "4",
		title:"来源",
		dataIndex:'source',
		width: '10%',
		render : (text,recod) =>(
		 <Tag  color="green"> {text == 3?"微信":text==18?"H5":text==28?"平安金管家":"未知"}</Tag>
		)
		}
	];

    const dataSource = this.props.getConsultsList;
    const setgrid = getConsults;
    const dispatch =  this.props.dispatch;
    const pageSize = 10;
    const routerpath = "consultsSquare/advisoryDetails";
    const flage = "ConsultsSquare";
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
    const rooms =  this.props.getUserInfo.data.rooms;
    return(
      <div className="consultsList">
       {/*<div className="advisory-number">
					<Alert
				    message="累计患者咨询"
				    description={rooms==0?<Icon type='loading'/>:rooms}
				    type="info"
				    showIcon
				  />
					
				</div>*/}
        <Row className="list-tabs-consult"  type="flex" justify="center">
        	<Col span={23} >
				<TableGrid {...config}/>
			</Col>
        </Row>
      </div>
    );
  }
}

ConsultsSquare.contextTypes={
  router: React.PropTypes.object.isRequired
};
ConsultsSquare.propTypes = {

};
function mapStateToProps(state){

  return {
  	getConsultsList:state.getConsultsList,
  	getUserInfo :state.getUserInfo
  }
}
export default connect(mapStateToProps)(ConsultsSquare)
