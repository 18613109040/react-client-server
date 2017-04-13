import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";

import { Menu, Breadcrumb, Icon,Row,Col,Button  } from 'antd';
import Chat from "./Chat";
import QuickReply from "./QuickReply";
import ChatLinkList from "../components/ChatLinkList";
import {getConsulting,getConsultsEnd,getAllConsulting,getAllConsultsEnd} from "../store/actions/willConsult";
import {getConsults} from "../store/actions/ConsultsSquare";
import {getUser} from "../utils/User";
import TableGrid from '../components/TableGrid';

class ChatCenter extends Component {
  constructor(props){
    super(props);
    this.state={
      collapse:true
    }
  }
  componentDidMount(){
  	const {flage} = this.props.location.query;
  	if(flage === "Consulting"){
  		const postconfig = {
	  		message_status:[1,2] ,
	  		page_no:1,
	  		page_size:1000,
	  		role:getUser().role,
	  		role_id:getUser().doctor_id,
	  		order:"desc",
	  		sort:"last_time"
  		}
  		this.props.dispatch(getConsulting(postconfig));
  	}else if(flage === "ConsultsEnd"){
  		const postconfig = {
	  		message_status:[3,4] ,
	  		page_no:1,
	  		page_size:10,
	  		role:getUser().role,
	  		role_id:getUser().doctor_id,
	  		order:"desc",
	  		sort:"last_time"
	  	}
  		this.props.dispatch(getAllConsultsEnd(postconfig));
  	}else if(flage === "ConsultsSquare"){
  		this.props.dispatch(getConsults({page_no: 1, page_size:10 }));
  	}
  	
  	
  }
  componentDidUpdate(oNextProps, oNextState){
   
    
  }
  
  render(){
  	
    const { pathname } = this.props.location;
    const tab = pathname.split('/');
    let path = tab[tab.length-1];
    let data = null ;
    let setgrid =null ;
    let postconfig = null;
    let {flage,room_id} = this.props.location.query;
  	if(flage === "Consulting" || flage === "ConsultsSquare"){
  		data =  this.props.getConsulting;
  	}else if(flage === "ConsultsEnd"){
	  	data =  this.props.getAllConsulEnd;
	  	
  	}
    return(
	    <div className="chat-center">
	     
	      	<Row>
		      	<Col xs={{ span: 10}} sm={{span:10}} md={{span:6}} lg={{span:6}} style={{"maxWidth":"210px","height":"720px"}} >
			     		<div className="content">
					     		<ChatLinkList {...data}  dispatch={this.props.dispatch} query={this.props.location.query} context={this.context} />
			     		</div>
			      </Col>
			      <Col  xs={{ span: 14}} sm={{span:14}} md={{span:18}} lg={{span:18}} >
			        <Chat {...this.props}/>
			      </Col>
		      </Row>
	      
	      
	    </div>
    );
  }
}

ChatCenter.contextTypes={
  router: React.PropTypes.object.isRequired
};
ChatCenter.propTypes = {
};
function mapStateToProps(state){
  return state
}
export default connect(mapStateToProps)(ChatCenter)
