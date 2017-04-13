import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {Link} from "react-router";
import {Modal,Icon, Dropdown,Menu,Select } from 'antd';
import {getUsrInfo} from "../store/actions/getUserInfo";
import {cleanUser,getUser} from "../utils/User";
import {host} from "../store/actions/hostConf";
import UserInfo from './UserInfo';
import {storage} from "../utils/tools";
import Cookie from "js-cookie";
const Option = Select.Option;
import {reqCASLogOut} from "../store/actions/Account";
export class SiteHeader extends Component{
  constructor(props){
    super(props);
    this.state={
			shop_list:[]
    };
   // this.onClickLogout = this.onClickLogout.bind(this);
  }
  componentDidMount(){

    /*this.props.dispatch(getUsrInfo({role: getUser().role, role_id:getUser().doctor_id },(res)=>{

			if(res.status.toString() ==="205"){
				cleanUser();
				Modal.error({
			    title: '登录失败',
			    content: '您无权限登录',
			 });
			  this.context.router.push('/user/login')
			}else{
				Cookie.set("doctor_name",res.data.doctor_name,{domain:'.gstzy.cn',expires:7});
				Cookie.set("doctor_phone",res.data.doctor_phone,{domain:'.gstzy.cn',expires:7});
				this.setState({
					shop_list:res.data.doc2shop_list
				})

			}
		}));*/


  }
  onClickLogout(){
  	storage.clear('session');
    let _self=this;
    Modal.confirm({
      title: '注意',
      content: '确定要注销吗?',
      onOk(){
				 _self.props.dispatch(reqCASLogOut(null,resp=>{
          if(resp.status === 0){
            console.log('注销成功');
            cleanUser();
            window.location.href = "/outPatient";
          }else{
            console.log('注销失败');
          }
        }))
      },
      onCancel(){},
    })
  }

	handleChange(value,option){

		Cookie.set("shop_name", option.props.data.shop_name,{domain:'.gstzy.cn',expires:7});
		Cookie.set("mis_doc_id", option.props.data.mis_doc_id,{domain:'.gstzy.cn',expires:7});
		Cookie.set("shop_no", option.props.data.shop_no,{domain:'.gstzy.cn',expires:7});
		Cookie.set("shop_phone", option.props.data.shop_phone,{domain:'.gstzy.cn',expires:7});
		location.href="/outPatient"

	}
  render(){
  	const menu = (
		  <Menu>
		    <Menu.Item>
		    	<UserInfo/>
		    </Menu.Item>
		  </Menu>
		);
    const {getUserInfo} = this.props;
    const children = [];
    this.state.shop_list.map((data)=>{
			children.push(<Option key={data.shop_name} value={data.shop_name} data={data}>{data.shop_name}</Option>)
		})
    return(
      <header className="component site-header" style={{}}>
        <div className="header-logo"></div>
        <div className="header-content"></div>
        <div className="header-action">
          <nav>
            <span className="action-mec-name">

            	{/* <Select
            		onSelect={this.handleChange.bind(this)}
            		defaultValue={getUser().shop_name}
            	>
								{children}
							</Select> */}
              {'※ '+ getUser().shop_name}
           	</span>
            <span className="action-user-name">
              {getUser().doctor_name}
            	{/* <img alt="example" width="100%" src={host.dr_img + getUserInfo.data.doctor_img}/> */}
					  </span>

					  {/* <Dropdown overlay={menu} trigger={['click']}>
					    <span>{getUserInfo.data.doctor_name}<Icon type="down" /></span>
					  </Dropdown> */}
            <span className="action-log-out" onClick={this.onClickLogout.bind(this)}><Icon type="logout" /><span>退出系统</span></span>
          </nav>
        </div>
      </header>
    )
  }
}
SiteHeader.contextTypes={
  router: React.PropTypes.object.isRequired
};
function mapStateToProps(state){
  return {
  	getUserInfo :state.getUserInfo
  }
}
export default connect(mapStateToProps)(SiteHeader)
