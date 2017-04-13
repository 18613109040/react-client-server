/**
 * Created by Administrator on 2016/9/13.
 */
import React, {Component, PropTypes}  from "react";
import {Icon,Modal,Button ,Row,Col,Alert ,Spin,Badge} from 'antd';
import {Link} from "react-router";
import {getUser} from "../utils/User";
import {connect} from "react-redux";
import {getConsulting,getConsultsEnd,getAllConsulting,getAllConsultsEnd} from "../store/actions/willConsult";
import {getConsults} from "../store/actions/ConsultsSquare";

const ChatLinkListItem = React.createClass({
	
	onClickLink(){
		const {room_id,flage} = this.props.query;
		this.props.context.router.push(`/chatcenter?room_id=${this.props.id}&flage=${flage}`);

	},
	render(){
		const {room_id,flage} = this.props.query;
		return(
		<Link  onClick={this.onClickLink} >
			<Row  className={this.props.id.toString()===room_id.toString()?"link-item active":"link-item "} type="flex" justify="space-around" align="middle"  >
				<Col span={6} ><img src={this.props.user_img}/></Col>
				<Col span={14}>
					<Row type="flex" className="user-info">
						<span className="name">{this.props.patient_name}</span>
						{/*<span>{this.props.patient_sex==0?"未知":this.props.patient_sex==1?"男":"女"}</span>*/}
					   {/*<span className="age">{this.props.patient_age}</span>*/}
					    {this.props.badge_num>0?(<span className="badge-number"><Badge count={this.props.badge_num} /></span>):""}
					</Row>
					{/*<Row className="item-title">
						{this.props.last_message.slice(0,18)+'...'}
					</Row>*/}
				</Col>
			</Row>
		</Link>
		)
	}
	
})
let num = 1;
class ChatLinkList extends Component {
  constructor(props) {
    super(props);
    this.state={
    	
    }
  }
  componentDidMount(){
    const {flage} = this.props.query;
    this.myScroll = new IScroll('#wrap', {
		  scrollbars: true,
		  mouseWheel: true,
		  interactiveScrollbars: true,
		  shrinkScrollbars: 'scale',
		  fadeScrollbars: true
		});
	   
	  this.myScroll.on("scrollEnd", (e)=>{
	  
	   
	    if(this.myScroll.y<=0){
		  if(flage === "Consulting"){
		  	
		  		/*if(num>this.props.getAllConsul.total_page){
		  			return ;
		  		}else{
		  			const postconfig = {
			  			message_status:[1,2] ,
			  			page_no:++num,
			  			page_size:10,
			  			role:getUser().role,
			  			role_id:getUser().doctor_id,
			  			order:"desc",
			  			sort:"last_time"
		  			}
		  			this.props.dispatch(getConsulting(postconfig))
		  		}*/
		  		
		  }else if(flage === "ConsultsEnd"){
		  	if(num>this.props.getAllConsulEnd.total_page){
		  		return;
		  	}else{
		  			const postconfig = {
			  			message_status:[3,4] ,
			  			page_no:++num,
			  			page_size:10,
			  			role:getUser().role,
			  			role_id:getUser().doctor_id,
			  			order:"desc",
			  			sort:"last_time"
			  		}
		  			this.props.dispatch(getAllConsultsEnd(postconfig));
		  			this.myScroll.refresh();
		  	}
		  		
		  }
	        
	    }
	  })
  }
  //返回
  renderBack(){
  	const {flage} = this.props.query;
    if(flage === "Consulting"){
    	this.context.router.push("/patientCounsel/consulting");
    	
    }else if(flage === "ConsultsEnd"){
    	this.context.router.push("/patientCounsel/end");
    	
    }else if(flage === "ConsultsSquare"){
  		this.context.router.push("/consultsSquare");
  	}
  	
  }
  render() {
  	
  	return (
  		<div>
	  		<div>
	  				<Button className="back-button" onClick={this.renderBack.bind(this)} >返回</Button>
	  		</div>
	  		
	  		<div className="chat-link-list" id="wrap">
			    <div className="scroller">     	
			      {
							this.props.data.map((data,id)=>(<ChatLinkListItem key={id} {...data} dispatch={this.props.dispatch} context={this.props.context} query={this.props.query}/>))
						}
			    </div>
		    </div>
	    </div>
	)
  	
    
  }
}
ChatLinkList.contextTypes={
  router: React.PropTypes.object.isRequired
};
ChatLinkList.propTypes = {
};
function mapStateToProps(state){
  return state
}
export default connect(mapStateToProps)(ChatLinkList)