/*
 * 咨询广场详情
 */

import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {getContentById,answer} from "../store/actions/ConsultsSquare";
import { Button ,Spin,Modal} from 'antd';
import PictureNav from "../components/PictureNav";
import {getUrlPara} from "../utils/tools";
import {getUser} from "../utils/User";
const confirm = Modal.confirm;
import {convertTimeToStr} from "../utils/tools";
class AdvisoryDetails extends Component {
  constructor(props){
    super(props);
    this.state={
			loading:false
    }
  }
  componentWillMount(){}
  componentDidMount(){
  	let getid = getUrlPara("room_id");
  	this.props.dispatch(getContentById({id:getid}));
  }
  answer(){
  	this.setState({ loading: true });
  	let _this  =  this;
  	let getid = getUrlPara("room_id");
  	let role_id = getUser().doctor_id
  	this.props.dispatch(answer({id:getid,doctor_id:role_id},(res)=>{
  		this.setState({ loading: false });
  		if(res.status == 403){
  			 confirm({
			    title: '信息提示',
			    content: res.message,
			    okText:"去结束",
			    cancelText:"抢答其他问题",
			    onOk(){
			    	_this.context.router.push(`/chatcenter?room_id=${res.data.id}&flage=Consulting`);
			    },
			    onCancel(){
			    	_this.context.router.push("/consultsSquare");
			    }
			  });

  		}else if(res.status == 209 || res.status == 404){
  			Modal.warning({
			    title: '信息提示',
			    content: res.message,
			    okText:"确定",
			    onOk(){
			    	_this.context.router.push("/consultsSquare");
			    }
			});
  		}else if(res.status == 402){
  			Modal.warning({
			    title: '信息提示',
			    content: res.message,
			    okText:"确定",
			    onOk(){
			    	_this.context.router.push("/patientCounsel/consulting");
			    }
			});
  		}else if(res.status == 0){
  			_this.context.router.push(`/chatcenter?room_id=${res.data.id}&flage=Consulting`);
  		}

  	}));

  }
  //返回上一级
  renderBack(){
  	
  	this.context.router.push("/consultsSquare");
  }
  render(){
  	const content = this.props.getContentById;
    const config ={
    	imgList:content.status==0?content.data.content.images:[]
    }
    return(
    <div>{
    	content.status==0?(
    	 	<div className="advisoryDetails">
    	 	  <div><Button type="primary"  icon="rollback" onClick={this.renderBack.bind(this)}>返回</Button></div>
		     	<div className="maninformation">
		     		<span className="avatar"><img  className="ant-img-style" src={content.data.user_img}/></span>
		     		<span className="name">{content.data.patient_name}</span>
		     		<span className="sex">{content.data.patient_sex==0?"未知":content.data.patient_sex==1?"男":"女"}</span>
		     		<span className="age">{content.data.patient_age}岁</span>
		     		<span className="address">{content.data.city_name}</span>
		     		<span className="time">{convertTimeToStr(content.data.created_at,"yyyy-MM-dd hh:mm:ss")}</span>
		     	</div>
		     	<div className="description">病情描述:</div>
		     	<div  className="descriptionContent">{content.data.content.text}</div>
		     	<div className="descriptionImg">
		     		<PictureNav {...config}/>
		     	</div>
		     	<hr/>
		     	<div className="prompt">点击"我要抢答"后,则开始与患者一对一隐私聊天者</div>
		     	<div className="answerButton">
		     		<Button onClick={this.answer.bind(this)} loading={this.state.loading} >我要抢答</Button>
		     	</div>
		    </div>
    	):(
    	 	<Spin tip="Loading...">
    	  	    数据加载中.....
    	  	</Spin>
    	)}
    </div>

    );
  }
}
AdvisoryDetails.contextTypes={
  router: React.PropTypes.object.isRequired
};
function mapStateToProps(state){

  return {
  	getContentById:state.getContentById,
  	answer:answer
  }
}
export default connect(mapStateToProps)(AdvisoryDetails)
