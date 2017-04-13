/**
 * 患者咨询
 */
import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import { Menu, Breadcrumb, Icon ,Row,Col,Tabs,Badge,Alert } from 'antd';
const TabPane = Tabs.TabPane;
const SubMenu = Menu.SubMenu;
import Consulting from "./Consulting";
import ConsultsEnd from "./ConsultsEnd";
import {getUser} from "../utils/User";
import {getUsrInfo} from "../store/actions/getUserInfo";
class ConsultsList extends Component {
  constructor(props){
    super(props);
    const { pathname } = this.props.location;
    let tab = pathname.split('/');
    tab = tab[tab.length-1];
    this.state={
    	current:tab
    }
    
    this.handleClick = this._handleClick.bind(this);
  }
  
  componentDidMount(){
  	
    
  }
  _handleClick(e) {
    
    this.setState({
      current: e.key,
    });
  }
  render(){
    
    const rooms =  this.props.getUserInfo.data.rooms;
    const new_message =  this.props.getUserInfo.data.new_message;
 
    return(
      <div className="consultsList" >
        
        <Row className="list-tabs"  type="flex" justify="center">
			    <Col className="card-container" span={23} >
			    	
			    	<div className="nav-stsatus">
				    	<Menu onClick={this.handleClick}
	        		selectedKeys={[this.state.current]}
	        		mode="horizontal"
				      >
				        <Menu.Item key="consulting">
				          <Link to="/patientCounsel/consulting">
				          		<Badge count={new_message} style={{ backgroundColor: '#87d068'   ,  margin: "-5px 0px 0px 15px","marginLeft": "12px" }} >
				          			<span>未结束</span> 
				          		</Badge>
				          </Link> 		
				        </Menu.Item>
				        <Menu.Item key="end">
				         <Link to="/patientCounsel/end"> <span>已结束</span></Link>
				        </Menu.Item>
				      </Menu>
			      </div>
			      <div className="advisory-number" ><span>累计患者咨询:</span><span className="rooms">{rooms==0?<Icon type='loading'/>:rooms}</span></div>
      			{this.props.children}
				    
	        </Col>
        </Row>
        
       
      </div>
    );
  }
}

ConsultsList.contextTypes={
  router: React.PropTypes.object.isRequired
};
function mapStateToProps(state){
	
  return {
  	getUserInfo :state.getUserInfo
  }
}
export default connect(mapStateToProps)(ConsultsList)