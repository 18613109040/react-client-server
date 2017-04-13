/*
 *左侧导航用户信息
 *
 */
import React, {Component, PropTypes} from "react";
import { Row,Col,Icon,Card,Spin,Badge,Modal} from 'antd';
import {connect} from "react-redux";
import {getUsrInfo} from "../store/actions/getUserInfo";
import {cleanUser,getUser} from "../utils/User";
import {host} from "../store/actions/hostConf";
class UserInfo extends Component{
	constructor(props){
	    super(props);
	    this.state={

	    };
	}
	componentDidMount() {
		//屏蔽
		/*this.props.dispatch(getUsrInfo({role: getUser().role, role_id:getUser().doctor_id },(res)=>{

			if(res.status.toString() ==="205"){
				cleanUser();
				Modal.error({
			    title: '登录失败',
			    content: '您无权限登录',
			  });

			  this.context.router.push('/user/login')
			}
		}));*/
	}

  	render() {
		const {getUserInfo} = this.props;
	    return (
	    	<div>
		    	{getUserInfo.status==0?(
		    		<Card className="top-card">
					    <div className="custom-image">
					      <img alt="example" width="100%" src={host.dr_img + getUserInfo.data.doctor_img}/>
					    </div>
					    <div className="custom-card">
					      <h2>{getUserInfo.data.doctor_name}</h2>
					      <h4>{getUserInfo.data.doctor_title}</h4>
					      <div className="doctor-part">
					      	<Row  type="flex" justify="center">
						      	{getUserInfo.data.doc2shop_list.map((data,id)=>
						      		<Col offset={1} key={id}>{data.shop_name}</Col>
						     	)}
					      	</Row>
					      </div>
					    </div>
					</Card>
		    	):(
		    		 <Card loading title="登陆人信息" >
					    Whatever content
					 </Card>

		    	)}

	    	</div>

	    );
	}

}


UserInfo.contextTypes={
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state){
  return {
  	getUserInfo :state.getUserInfo
  }
}

export default connect(mapStateToProps)(UserInfo)
