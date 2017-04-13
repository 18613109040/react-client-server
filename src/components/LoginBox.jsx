/**
 * Created by simon on 2017/3/30.
 */
import "../assets/css/components/login-box.scss";
import React, {Component, PropTypes} from "react";
import {Spin,Modal} from 'antd';
import {reqCASCheckLogin} from "../store/actions/Account";
import {storage} from "../utils/tools";
import Cookie from "js-cookie";

export default class LoginBox extends Component {
  constructor(props){
    super(props);
    this.state = {
      loginLoading:false,
    }
  }

  componentDidMount(){
    this.checkLogin();
  }

  checkLogin(){
    let href = window.location.href;
    let url = href.indexOf('?ticket=')>0?href.slice(0,href.indexOf('?ticket=')):(href.indexOf('&ticket=')>0?href.slice(0,href.indexOf('&ticket=')):href);
    let data = {
      host        : window.location.host,
      hostname    : window.location.hostname,
      // redirect_uri: encodeURIComponent(url),//去除ticket=xxx
      redirect_uri: encodeURIComponent(window.location.origin+"/outPatient"),//去除ticket=xxx
    };
    this.setState({
      loginLoading:true,
    });
    this.context.dispatch(reqCASCheckLogin({
      ticket:this.props.ticket,
    },resp=>{
      //0 成功, 1没登录 ,2 ticket无效 ,3 设置cookie失败 ,4 没权限
      switch(resp.status){
        case 1:
        case 2:
          if(resp.login_url){
            window.location.href = `${resp.login_url}?host=${data.host}&redirect_uri=${data.redirect_uri}`;
          }
          break;
        case 3:
          Modal.error({
            title:'登录失败',
            content:'cookie设置失败,请检查浏览器设置并重新登录',
          });
          break;
        case 4:
          Modal.error({
            title:'登录失败',
            content:'您当前无权访问该页面,请联系您的管理员',
          });
          break;
        default:
          let loginInfo = resp.data, expireTime = 7,domainName = data.hostname;
          //将用户信息写入cookie
          for(let item in loginInfo){
            if('user_name' == item){
              Cookie.remove("doctor_name", {domain: `.gstzy.cn`});
              Cookie.remove("doctor_name", {domain: domainName});
              Cookie.set('doctor_name', loginInfo['user_name'], {domain: domainName});
            }else if('user_id' == item){
              Cookie.remove("doctor_user_id", {domain: `.gstzy.cn`});
              Cookie.remove("doctor_user_id", {domain: domainName});
              Cookie.set( 'doctor_user_id', loginInfo['user_id'], {domain: domainName});
            }else{
              Cookie.remove(item, {domain: `.gstzy.cn`});
              Cookie.remove(item, {domain: domainName});
              Cookie.set( item, loginInfo[item], {domain: domainName});
            }
          }
          
          storage.setObj(loginInfo,'session');
          this.setState({
            loginLoading: false,
          });
          this.props.onSigned({
            loginInfo:loginInfo
          })
      }
    }))
  }

  render(){
    return(
      <div className="component login-box">
        <Spin size="large" />
      </div>
    );
  }
}

LoginBox.contextTypes={
  router: PropTypes.object.isRequired,
  dispatch:PropTypes.func.isRequired,
};
LoginBox.propTypes = {
  onSigned: PropTypes.func,   //登录之后的回调
  ticket  : PropTypes.string, //登录令牌
};
