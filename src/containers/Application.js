import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import CusBreadcrumb from '../components/CusBreadcrumb';
import Tools from '../utils/tools';
import Menus from '../components/Menus';
import { getUsrInfo } from "../store/actions/getUserInfo";
import { getUser } from "../utils/User";
import { getConsulting, getAllConsulting } from "../store/actions/willConsult";
import { getConsults } from "../store/actions/ConsultsSquare";
import Cookie from "js-cookie";
import { Layout, Spin } from 'antd';
import classNames from 'classnames';
import { getsettingSystem } from "../store/actions/SettingAction";
import LoginBox from '../components/LoginBox';
const { Header, Footer, Sider, Content } = Layout;

class Application extends Component {
	constructor(props) {
		super(props);
		let queryTicket = props.location.query.ticket;
		this.state = {
			fontDefault: false,
			fontSmall: false,
			fontLarge: false,
			fontWight: false,
			needLogin: false, //是否需要登录
			menus: [{
				name: "门诊",
				router: "outPatient",
				icon: "outPatient",
				key: "outPatient",
				newMessage: false,
				disable: true,
				num: 0
			}, {
				name: "档案",
				router: "patientFile",
				icon: "patientFile",
				key: "patientFile",
				newMessage: false,
				disable: true,
				num: 0

			}, {
				name: "统计",
				router: "statistics",
				icon: "statistics",
				key: "statistics",
				newMessage: false,
				disable: true,
				num: 0
			}, /*{
				name: "咨询",
				router: "patientCounsel",
				icon: "patientCounsel",
				key: "patientCounsel",
				newMessage: false,
				disable: true,
				num: 0
			}, {
				name: "抢答",
				router: "consultsSquare",
				icon: "consultsSquare",
				key: "consultsSquare",
				newMessage: false,
				disable: true,
				num: 0
			}*/{
				name: "设置",
				router: "setting",
				icon: "setting",
				key: "setting",
				newMessage: false,
				disable: true,
				num: 0
			}/*, {
				name: "反馈",
				router: "tickling",
				icon: "tickling",
				key: "tickling",
				newMessage: false,
				disable: true,
				num: 0
			}*/],
			timer: null
		};
		this.static = {
			ticket: Array.isArray(queryTicket) ? queryTicket[queryTicket.length - 1] : queryTicket, //如果ticket有多个,则变成数组,取最后一个
			userObj: Tools.getUser(),
		};
		this.onSigned = this._onSigned.bind(this);
	}
	getChildContext() {
		return {
			dispatch: this.props.dispatch,
			router: this.context.router
		};
	}
	componentWillUnmount() {
		if(this.state.timer != null) {
			clearInterval(this.state.timer);
		}
	}
	componentWillMount() {
		this.props.dispatch(getsettingSystem({ doctor_id: getUser().doctor_id }, (res) => {
      if(res.status.toString()=="0"){
      	if(res.data&&res.data.font_size.toString() == '0') {
					this.setState({
						fontDefault: false,
						fontSmall: true,
						fontLarge: false
					})
				} else if(res.data&&res.data.font_size.toString() == '1') {
					this.setState({
						fontDefault: true,
						fontSmall: false,
						fontLarge: false
					})
				} else if(res.data&&res.data.font_size.toString() == '2') {
					this.setState({
						fontDefault: false,
						fontSmall: false,
						fontLarge: true
					})
				}
				if(res.data&&res.data.font_type.toString() == '0') {
					this.setState({
						fontWight: false
					})
				} else if(res.data&&res.data.font_type.toString() == '1') {
					this.setState({
						fontWight: true,
					})
				}
      	
      }
			
		}))
	}
	componentDidMount() {
		window.gstTools = Tools; //方便调试
		let { routes } = this.props;
		//let checkRouter = ['patientCounsel','consultsSquare','chatcenter','patientFile','patient','outPatient','statistics','setting','tickling']
		//let noAuthRoute = routes.find(item=>item.noAuth);  //在当前路由中查找是否需要授权的标记
		//let fullPageRoute = routes.find(item=>item.fullPage);  //在当前路由中查找全屏显示标记,有则设置全屏显示
		this.setState({
			needLogin: !(this.static.userObj.system_uid), //需要授权,或者没有登录标记,则走登录框
			// fullPage : !!(fullPageRoute),
		});

	}

	_onSigned(data) {
		this.setState({
			needLogin: false,
			loginInfo: data.loginInfo,
		})
	}

	mp3Play() {
		let audio = document.createElement("audio");
		audio.src = "http://zjdx1.sc.chinaz.com/Files/DownLoad/sound1/201402/4092.mp3";
		audio.play();
	}
	//判断是否患者咨询是否有新消息
	isNewMessage() {
		let _this = this;
		if(_this.props.location.pathname.includes('user/')) {
			return;
		} else {

			this.state.timer = setInterval(function() {
				const postconfig = {
					message_status: [1, 2],
					page_no: 1,
					page_size: 1000,
					role: getUser().role,
					role_id: getUser().doctor_id,
					order: "desc",
					sort: "last_time"
				}
				this.props.dispatch(getConsults({ page_no: 1, page_size: 10 }));
				this.props.dispatch(getConsulting(postconfig));
				this.props.dispatch(getUsrInfo({ role: getUser().role, role_id: getUser().doctor_id }, (res) => {
					if(res.status == 0) {
						let a = _this.state.menus;

						if((res.data.new_rooms > 0 && res.data.new_rooms.length != getUser().newRooms) || (res.data.new_message > getUser().newMessage)) {

							Cookie.set("newRooms", parseInt(res.data.new_rooms.length), { domain: '.gstzy.cn' });
							Cookie.set("newMessage", parseInt(res.data.new_message), { domain: '.gstzy.cn' });
							_this.mp3Play();
						}
						if(res.data.new_message > 0 && res.data.questions > 0) {
							a[3] = {
								name: "患者咨询",
								router: "patientCounsel",
								icon: "patientCounsel",
								key: "patientCounsel",
								newMessage: true,
								disable: true,
								num: res.data.new_message
							};
							a[4] = {
								name: "咨询抢答",
								router: "consultsSquare",
								icon: "consultsSquare",
								key: "consultsSquare",
								newMessage: true,
								disable: true,
								num: res.data.questions
							}

						} else if(res.data.new_message > 0 && res.data.questions == 0) {
							a[3] = {
								name: "患者咨询",
								router: "patientCounsel",
								icon: "patientCounsel",
								key: "patientCounsel",
								newMessage: true,
								disable: true,
								num: res.data.new_message
							};
							a[4] = {
								name: "咨询抢答",
								router: "consultsSquare",
								icon: "consultsSquare",
								key: "consultsSquare",
								newMessage: false,
								disable: true,
								num: res.data.questions
							}

						} else if(res.data.new_message == 0 && res.data.questions > 0) {
							a[3] = {
								name: "患者咨询",
								router: "patientCounsel",
								icon: "patientCounsel",
								key: "patientCounsel",
								newMessage: false,
								disable: true,
								num: res.data.new_message
							};
							a[4] = {
								name: "咨询抢答",
								router: "consultsSquare",
								icon: "consultsSquare",
								key: "consultsSquare",
								newMessage: true,
								disable: true,
								num: res.data.questions
							}

						} else {
							a[3] = {
								name: "患者咨询",
								router: "patientCounsel",
								icon: "patientCounsel",
								key: "patientCounsel",
								newMessage: false,
								disable: true,
								num: res.data.new_message
							};
							a[4] = {
								name: "咨询抢答",
								router: "consultsSquare",
								icon: "consultsSquare",
								key: "consultsSquare",
								newMessage: false,
								disable: true,
								num: res.data.questions
							}
						}
						_this.setState({
							menus: a
						})
						/*const postconfig = {
			  		message_status:[1,2] ,
			  		page_no:1,
			  		page_size:10,
			  		role:getUser().role,
			  		role_id:getUser().doctor_id,
			  		order:"desc",
			  		sort:"last_time"
			  	}
			  	this.props.dispatch(getConsulting(postconfig));
	         	this.props.dispatch(getConsults({page_no: 1, page_size:10 }));*/
					}

				}));

			}.bind(this), 5000);
		}

	}
	componentDidUpdate(oNextProps, oNextState) {

	}
	/*
	 * 退出销毁定时函数
	 */
	onDropOut() {
		this.componentWillUnmount();
	}
	render() {
		const classSet = classNames({
			'font-size-default': this.state.fontDefault,
			'font-size-small': this.state.fontSmall,
			'font-size-large': this.state.fontLarge,
			'font-wight-set': this.state.fontWight
		});

		const { pathname } = this.props.location;
		const { loading } = this.props.loadType
		const { needLogin } = this.state;
		const { ticket } = this.static;
		if(needLogin) {
			return(
				<div className="root login">
		          <LoginBox ticket={ticket} onSigned={this.onSigned}/>
		        </div>
			)
		} else {
			return(
				<div className="root">
	        	<div className={classSet} style={{"height": "100%"}}>
	        	 
	        	<Layout>
						  <Header>
						   	<SiteHeader onDropOut = {this.onDropOut.bind(this)}/>
						  </Header>
	
					    <Layout id="components-layout-demo-side"  >
					      <Sider width={80}>
					      	<Menus menus={this.state.menus}  pathname={this.props.location} />
					      </Sider>
					      <Layout id="components-layout-demo-content" >
						      <Content className="page" >
						      		<Spin spinning={loading}  tip="数据保存...">
							      		{this.props.children}
							      	</Spin>
						      </Content>
						      <Footer id="components-layout-demo-footer">
						    		<SiteFooter />
						    	</Footer>
					    	</Layout>
					    </Layout>
	
					  </Layout>
						</div>
	        </div>
			)
		}
	}
}

Application.propTypes = {
	children: PropTypes.node
};
Application.contextTypes = {
	router: React.PropTypes.object.isRequired
};
Application.childContextTypes = {
	dispatch: PropTypes.func,
	router: PropTypes.object
};

function mapStateToProps(state) {

	return {
		loadType: state.loadType

	}
}
export default connect(mapStateToProps)(Application)
