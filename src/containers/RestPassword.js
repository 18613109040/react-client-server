import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import classNames from 'classnames';
import {verificationCode,smsCode,restPassword} from "../store/actions/restPassWord";
import { Menu, Breadcrumb, Icon ,Row,Col,Form,Button ,Input,Modal} from 'antd';
const FormItem = Form.Item;
import SiteFooter from '../components/SiteFooter';
function noop() {
  return false;
}
class RestPassword extends Component {
  constructor(props){
    super(props);
    this.state={
     	dirty: false,
      passBarShow: false,
      rePassBarShow: false,
      passStrength: 'L',
      rePassStrength: 'L',
      getSmsCode:"获取验证码",
      loading:false,
      disabled:false
    }
  }
  componentDidMount(){
    this.props.dispatch(verificationCode({}));

  }
  //检查手机号码
  userExists(rule, value, callback){
		if(/^1\d{10}$/.test(value)){
			 callback();
		}else{
			callback(new Error("手机号码格式不正确！"));
		}
  }
  //获取密码长度
  getPassStrenth(value, type) {
    if (value) {
      let strength;
      // Customized the password strength, here is just a simple example
      if (value.length < 6) {
        strength = 'L';
      } else if (value.length <= 9) {
        strength = 'M';
      } else {
        strength = 'H';
      }
      this.setState({
        [`${type}BarShow`]: true,
        [`${type}Strength`]: strength,
      });
    } else {
      this.setState({
        [`${type}BarShow`]: false,
      });
    }
  }
  //密码验证
  checkPass(rule, value, callback) {
    const form = this.props.form;
    this.getPassStrenth(value, 'pass');

    if (form.getFieldValue('password') && this.state.dirty) {
      form.validateFields(['rePass'], { force: true });
    }

    callback();
  }
  //重复密码验证
  checkPass2(rule, value, callback) {
    const form = this.props.form;
    this.getPassStrenth(value, 'rePass');

    if (value && value !== form.getFieldValue('password')) {
      callback('两次密码不一致!');
    } else {
      callback();
    }
  }
  renderPassStrengthBar(type) {
    const strength = type === 'password' ? this.state.passStrength : this.state.rePassStrength;
    const classSet = classNames({
      'ant-pwd-strength': true,
      'ant-pwd-strength-low': strength === 'L',
      'ant-pwd-strength-medium': strength === 'M',
      'ant-pwd-strength-high': strength === 'H',
    });
    const level = {
      L: 'Low',
      M: 'Middle',
      H: 'High',
    };

    return (
      <div>
        <ul className={classSet}>
          <li className="ant-pwd-strength-item ant-pwd-strength-item-1" />
          <li className="ant-pwd-strength-item ant-pwd-strength-item-2" />
          <li className="ant-pwd-strength-item ant-pwd-strength-item-3" />
          <span className="ant-form-text">
            {level[strength]}
          </span>
        </ul>
      </div>
    );
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
					loading:true,
				})
	  		_this.props.dispatch(smsCode({
	  			"mobile_number":form.getFieldValue("mobile_number"),
	  			"piccode_res":form.getFieldValue("piccode_res"),
	  			"security_type":"2",
	  			"piccode_key":_this.props.verificationCode.data.code_key,
	  			"push_type":"1",
	  			"token":"",
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
					  		 		loading:true,
					  		 		getSmsCode:`重新发送${i--}秒`
					  		 })
			  		 	  }else{
			  		 	  	_this.setState({
					  		 		loading:false,
					  		 		getSmsCode:"获取验证码"
					  		 })
			  		 	  clearInterval(timer);
			  		 	  }

			  		 }.bind(this),1000);

					}else{

						const modal = Modal.error({
						 	title: '操作失败',
						  content: res.message,
						});
						_this.setState({
							loading:false,
						})
					}

	  		}));
      }
  	});

  }
  //提交表单事件
  enter(e){
  	e.preventDefault();
  	const _this = this;
    this.props.form.validateFields((errors, values) => {
      if (errors) {

        return;
      }
      _this.setState({
      	disabled:true
      })
     	this.props.dispatch(restPassword(values,(res)=>{

     		   _this.setState({
		      	disabled:false
		      })
     		if(res.status === "0" ){
     			Modal.success({
				    title: '密码重置成功',
				    content: "是否前往登录页",
				    okText:"是",
				    cancelText:"否",
				    onOk:()=> (_this.context.router.push('/user/login'))

				  });

     		}else{
     			Modal.error({
				    title: '密码重置失败',
				    content: res.message
				  });

     		}

     	}))
    });

  }
  render(){
  	const { getFieldDecorator, getFieldError, isFieldValidating } = this.props.form;
  	const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };

    return(
   <Row className="login">
    <Row type="flex" className="logo-header">
      		<Col><div className="logo"></div></Col>
      		<Col>|</Col>
      		<Col>医生工作站</Col>
    </Row>
    <Row className="rest_password ">
     	<Row>
        	<Col><h2>重置密码</h2></Col>
      </Row>
      <Row >
      	<Form horizontal>
      		<Row type="flex" align="middle" >
      			<Col span={19}>
      				<FormItem
			          {...formItemLayout}
			          label="手机号码"

			        >
				        {getFieldDecorator('mobile_number', {
				            rules: [
									    { required: true,  message: '请填写手机号码!' },
									    { validator: this.userExists },
									  ],
									  trigger: 'onBlur'
				          })(
				            <Input type="text" placeholder="请输入11位手机号码" />
				        )}
				        </FormItem>
	      			</Col>
	      		</Row>
	      		<Row type="flex" justify="center" >
	      			<Col span={17}>
	      				<FormItem
				          {...formItemLayout}
				          label="图片验证码"

				        >
					          {getFieldDecorator('piccode_res', {
					            validate: [{
					              rules: [
					                { required: true ,message:"请填写验证码"},
					              ],
					              trigger: 'onBlur',
					            }],
					          })(
					            <Input type="text" placeholder="图片验证码" />
					          )}
					        </FormItem>
	      			</Col>
	      			<Col span={7} >
	      				{this.props.verificationCode.status==0?	<img style={{"width":"100px","height":"40px"}} src={this.props.verificationCode.data.code_url}/>:""}
	      			</Col>
	      		</Row>
	      		<Row type="flex" justify="center">
	      			<Col span={17}>
	      				<FormItem
				          {...formItemLayout}
				          label="手机验证码"

				        >
					          {getFieldDecorator('security_code', {
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
	      			<Col span={7} className="smsCode">
	      				<Button onClick={this.getCode.bind(this) } loading={this.state.loading}>{this.state.getSmsCode}</Button>
	      			</Col>
	      		</Row>
      		  <Row type="flex" align="middle">
	            <Col span={19}>
	              <FormItem label="新密码"   {...formItemLayout}>
	                {getFieldDecorator('password', {
	                  rules: [
	                    { required: true,
	                    	whitespace: true,
	                    	min: 6,
	                     	max:20,
	                    	message:"输入密码长度为6至20之间"
	                    },
	                    { validator: this.checkPass.bind(this) }
	                  ],
	                })(
	                  <Input type="password"
	                    onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
	                    autoComplete="off" id="pass"
	                    onChange={(e) => {

	                    }}
	                    onBlur={(e) => {
	                      const value = e.target.value;
	                      this.setState({ dirty: this.state.dirty || !!value });
	                    }}
	                  />
	                )}
	              </FormItem>
	            </Col>
	            <Col span={5}>
	              {this.state.passBarShow ? this.renderPassStrengthBar('pass') : null}
	            </Col>
            </Row>
	          <Row type="flex" align="middle">
	            <Col span={19}>
	              <FormItem label="确认新密码"   {...formItemLayout}>
	                {getFieldDecorator('rePass', {
	                  rules: [{
	                    required: true,
	                    whitespace: true,
	                     min: 6,
	                     max:20,
	                    message: '请再次输入密码长度为6至20之间'
	                  }, {
	                    validator: this.checkPass2.bind(this),
	                  }],
	                })(
	                  <Input type="password"
	                    onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
	                    autoComplete="off" id="rePass"
	                  />
	                )}
	              </FormItem>
	            </Col>
	            <Col span={5}>
	              {this.state.rePassBarShow ? this.renderPassStrengthBar('rePass') : null}
	            </Col>
	          </Row>
	          <Row type="flex" align="center" className="enterButton">
	          	<Col span={10}><Button onClick={this.enter.bind(this)} disabled={this.state.disabled}>确认</Button></Col>
	          </Row>
      	</Form>
      </Row>
    </Row>
    <Row>
        	<SiteFooter/>
    </Row>
  </Row>
    );
  }
}

RestPassword.contextTypes={
  router: React.PropTypes.object.isRequired
};
RestPassword.propTypes = {
};
RestPassword = Form.create({})(RestPassword);
function mapStateToProps(state){
  return {
  	verificationCode : state.verificationCode
  }
}
export default connect(mapStateToProps)(RestPassword)
