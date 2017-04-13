import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import { Spin, Form, Input, Row,Col,Button, Checkbox, Radio, Modal,Icon, Select,notification,Tooltip} from 'antd';
import {userLogin,getStore} from "../store/actions/User";
import Cookie from "js-cookie";
import {isLogin,getUser} from "../utils/User";
import {decodeSign,encodeSign} from "../utils/tools";
import SiteFooter from '../components/SiteFooter';
import {verificationCode,smsCode,restPassword} from "../store/actions/restPassWord";
import piwik from "../utils/Piwik";
const FormItem = Form.Item;
const createForm = Form.create;
const Option = Select.Option;
class Login extends Component {
  constructor(props){
    super(props);
    this.state={
      loading:false,
      getSmsCode:"获取验证码",
      loadingcode:false,
      shop_list:[]
    };
  }
  componentWillMount(){


  }
  componentDidMount(){
  	let {userid} = getUser();

    if(userid){
      window.location.href='/outPatient';
    }else{
    	this.props.dispatch(verificationCode({}));
    }


  }
  valioperating(res){
  	const form = this.props.form;
  	const _this = this;
  	if(res.status.toString() === "8193"){
		    		this.setState({
		    			loading:false
		    		})
		    		this.resetPassword(res);
		}else if(res.status.toString() === "0"){

		  if(decodeSign(res.user_role,1)){
		   	notification.success({
					message: '登录成功',
					duration:2
				})
		    piwik.trackEvent("登录", "click", "登录总数");
		    //piwik.trackEvent("登录", "click",res.user_id );
			  if(form.getFieldValue("expire_type")){
			  	Cookie.set("userid", res.user_id,{domain:'.gstzy.cn',expires:7});
					Cookie.set("role", 2,{domain:'.gstzy.cn',expires:7});
					Cookie.set("user_role", res.user_role,{domain:'.gstzy.cn',expires:7});
					Cookie.set("doctor_id", res.doctor_id,{domain:'.gstzy.cn',expires:7});
					Cookie.set("assistant_id", res.assistant_id,{domain:'.gstzy.cn',expires:7});

			  }else{
			  	Cookie.set("userid", res.user_id,{domain:'.gstzy.cn'});
					Cookie.set("role", 2,{domain:'.gstzy.cn'});
					Cookie.set("user_role", res.user_role,{domain:'.gstzy.cn'});
					Cookie.set("doctor_id", res.doctor_id,{domain:'.gstzy.cn'});
					Cookie.set("assistant_id", res.assistant_id,{domain:'.gstzy.cn'});
			  }
				const shopInfo =  this.state.shop_list.filter((data)=>(data.shop_name == this.props.form.getFieldValue("changeClinic")));
				if(shopInfo.length>0){
					Cookie.set("shop_name", shopInfo[0].shop_name,{domain:'.gstzy.cn',expires:7});
					Cookie.set("mis_doc_id", shopInfo[0].mis_doc_id,{domain:'.gstzy.cn',expires:7});
					Cookie.set("shop_no", shopInfo[0].shop_no,{domain:'.gstzy.cn',expires:7});
					Cookie.set("shop_phone", shopInfo[0].shop_phone,{domain:'.gstzy.cn',expires:7});

				}
				this.context.router.push('/outPatient');
		  }else{
		   	 	Modal.warning({
					  title: '登录失败',
					  content: "您好，您登录的账号不是医生账号",
					   onOk(){
					    window.location.href='/user/login';
					   }
					});
				//_this.props.dispatch(verificationCode({}));
		  }
		  this.setState({
		    		loading:false
		  })
		}else{
		  Modal.warning({
				title: '登录失败',
				content: res.message

			});
			this.setState({
		    		loading:false
		  })
		  this.props.dispatch(verificationCode({}));
		}
  }
  onClickSubmit(e){
   	const _this = this;
    e.preventDefault();
    this.setState({
    	loading:true
    })
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        this.setState({
		    	loading:false
		    })
        return;
      }
      if(values.expire_type){
      	this.props.dispatch(userLogin(Object.assign({},values,{push_type:"2",expire_type:"2"}),(res)=>{
      		_this.valioperating(res);
        }));
      }else{
      	this.props.dispatch(userLogin(Object.assign({},values,{push_type:"2",expire_type:""}),res=>{
      		_this.valioperating(res);

      	}));
      }

    });



  }
  /*
   * 重置密码
   */
  resetPassword(res) {
  	const _this = this;
	  const modal = Modal.error({
	    title: res.message+",请重置密码",
	    content: '3秒后自动跳转到重置界面',
	  });


	  setTimeout(() =>{ modal.destroy() ;
	  									_this.context.router.push('/user/rest');}, 3000);
  }

  componentWillReceiveProps (nextprops){



  }


  componentWillUnmount(){

  }
  userExists(rule, value, callback){
		if(/^1\d{10}$/.test(value)){
			 callback();
		}else{
			callback(new Error("手机号码格式不正确！"));
		}
  }
	//点击图片验证码获取新的图片验证码
	changeVerificationCode(){
		this.props.dispatch(verificationCode({}));
	}
	 //获取手机验证码事件
  getCode(){
  	const form = this.props.form;
  	const _this = this;
  	this.props.form.validateFields(["mobile_number","piccode_res"],(errors, values) => {
  	 	if (errors) {

        return;
      }else{
      	_this.setState({
					loadingcode:true,
				})
	  		_this.props.dispatch(smsCode({
	  			"mobile_number":form.getFieldValue("mobile_number"),
	  			"piccode_res":form.getFieldValue("piccode_res"),
	  			"security_type":"4",
	  			"piccode_key":_this.props.verificationCode.data.code_key,
	  			"push_type":"2",
	  			"tokenid":"",
	  			"os_type":"1"
	  		},(res)=>{
	  			if(res.status == 0){

						const modal = Modal.success({
						  title: '操作成功',
						  content: res.message,
						});
						let i=60;
			  		let timer = setInterval(function(){
			  		if(i>0){
			  		 	  	_this.setState({
					  		 		loadingcode:true,
					  		 		getSmsCode:`重新发送${i--}秒`
					  		 })
			  		}else{
			  		 	_this.setState({
					  		loadingcode:false,
					  		getSmsCode:"获取验证码"
						  })
				  		 	clearInterval(timer);
				  		}

			  		}.bind(this),1000);
            setTimeout(()=>_this.props.dispatch(verificationCode({})),60000)

					}else{

						const modal = Modal.error({
						 	title: '操作失败',
						  	content: res.message,
						});
						_this.setState({
							loadingcode:false,
						})

					}


	  		}));
      }
  	});

  }
  //手机号输入
  nameOnblur(e){
 
  	if(this.props.form.getFieldValue("mobile_number")){
  		this.props.dispatch(getStore({mobile_number:this.props.form.getFieldValue("mobile_number")},(res)=>{
	  		
	  		if(res.status.toString()=="0"){
	  			this.setState({
		  			shop_list:res.doc2shop_list
		  		})
	  		}else{
	  			Modal.warning({
						title: '请检查手机号码',
						content: '很抱歉，您尚未在固生堂做出诊登记，请联系我们的客服！'
	
					});
	  		}
	  	}));
  	}
  	
  }
  render(){

    const { getFieldDecorator, getFieldError, isFieldValidating } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 24},
      wrapperCol: { span: 24 },
    };
    const children = [];
    this.state.shop_list.map((data)=>{
			children.push(<Option key={data.shop_name}>{data.shop_name}</Option>)
		})
    return(
      <div className="login">
      	<Row type="flex" className="logo-header">
      		<Col><div className="logo"></div></Col>
      		<Col>|</Col>
      		<Col>医生工作站</Col>
      	</Row>

        <Row type="flex" justify="space-around" align="middle" className="logo-bg" >
        	<Col  offset={12} span={2} ><div className="leaves"></div></Col>
        	<Col  span={10} >

		        <Row className="login-content" justify="center" type="flex" >

		         	<Col span={20} >
			         	<Spin size="large"  spinning={this.state.loading} tip="Loading...">
			            <Form horizontal  >
			                    <Row type="flex" justify="center"><Col className="login-box"></Col></Row>
				        		<Row type="flex" justify="center" ><Col className="login-title">欢迎登录</Col></Row>

					            <Row type="flex" align="top" className="login_account">
						              <Col span={12}>账号</Col>
						              <Col span={12} className="auto-login" >
						              		<FormItem>
								                {getFieldDecorator('expire_type', {
											            valuePropName:'2',
											          })(
											           <Checkbox >自动登录</Checkbox>
											          )}
								            </FormItem>
						              </Col>
					              </Row>
					              <Row>
						              <FormItem {...formItemLayout}  >
							              {getFieldDecorator('mobile_number', {
									            rules: [
									              { required: true,  message: '请填写用户名!' },
									              { validator: this.userExists },
									            ],
									            trigger: 'onBlur'
									          })(
									            <Input  placeholder="请输入用户名" onBlur={this.nameOnblur.bind(this)} />
									          )}

						              </FormItem>
					            </Row>
					       {/* <Row>密码</Row>
					            <Row>
					              <FormItem {...formItemLayout}  >
					                {getFieldDecorator('password', {
								            rules: [
								              { required: true,  message: '请输入密码!' }

								            ]

								          })(
								            <Input placeholder="请输入密码" type="password" autoComplete="off" />
								          )}

					              </FormItem>
					            </Row>*/}
					       			<Row>图片验证码</Row>
					       			<Row type="flex" justify="center" >
						      			<Col span={16}>
						      				<FormItem>
										       	{getFieldDecorator('piccode_res', {
										          validate: [{
										            rules: [
										              { required: true ,message:"请填写图片验证码"},
										            ],
										              trigger: 'onBlur',
										            }],
										          })(
										            <Input type="text" placeholder="图片验证码" />
										        )}
										        </FormItem>
						      			</Col>
						      			<Col span={8} >
  												{this.props.verificationCode.status==0?
  													(<Tooltip  placement="top" title={<span>看不清,重新换张</span>}>
  														<img style={{"width":"100px","height":"46px","cursor":"pointer"}} onClick={this.changeVerificationCode.bind(this)} src={this.props.verificationCode.data.code_url}/>
  													</Tooltip>):""
  												}
						      			</Col>
						      		</Row>
						      		<Row>手机验证码</Row>
											<Row type="flex" justify="center">
						      			<Col span={16}>
						      				<FormItem>
										          {getFieldDecorator('password', {
										            validate: [{
										              rules: [
										                { required: true ,message:"请输入手机验证码"},
										              ],
										              trigger: 'onBlur',
										            }],
										          })(
										            <Input type="text" placeholder="验证码" />
										          )}
										        </FormItem>
						      			</Col>
						      			<Col span={8} className="smsCode">
						      				<Button onClick={this.getCode.bind(this) } loading={this.state.loadingcode}>{this.state.getSmsCode}</Button>
						      			</Col>
						      		</Row>
						      		<Row>选择医馆</Row>
						      		<Row>
							      		<FormItem>
											    {getFieldDecorator('changeClinic', {
											      validate: [{
											          rules: [
											            { required: true ,message:"请选择医馆"},
											          ],
											          trigger: 'onBlur',
											        }],
											      })(
											        <Select >
													     {children}
													    </Select>
											    )}
											  </FormItem>
										  </Row>
					            <FormItem wrapperCol={{ span:24}} style={{ marginTop: 24 }}>
					                <Button type="primary" onClick={this.onClickSubmit.bind(this)} >登录</Button>
					            </FormItem>

				                 <Row type="flex" justify="end">
						        	<Col><Icon type="customer-service"/>如无法登录可直接联系客服中心</Col>
						        </Row>
				        </Form>
			          </Spin>
		          </Col>
		        </Row>

        	</Col>
        </Row>
        <Row>
        	<SiteFooter/>
        </Row>
      </div>
    );
  }
}

Login.contextTypes={
  router: React.PropTypes.object.isRequired
};
Login.propTypes = {

};
Login = Form.create({})(Login);

function mapStateToProps(state){
  return{
    user:state.userInfo,
    verificationCode : state.verificationCode
  }
}

export default connect(mapStateToProps)(Login)
