import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import { Menu, Breadcrumb, Modal, Spin, message } from 'antd';
import {getUser} from "../utils/User";
import ChatWin from '../components/chat/ChatWin';
import DocInputArea from '../components/chat/DocInputArea';
import {fetClearList, fetClearErrorList, getMesHistory, getMesNews, sendMes,
  notification, fetchEndChat,readVoiceMessage} from "../store/actions/Message";
import {getAllConsulting,getConsulting} from "../store/actions/willConsult";
import Cookie from "js-cookie";
import piwik from "../utils/Piwik";
const confirm = Modal.confirm;
class ChatCenter extends Component {
  constructor(props){
  	
    super(props);
    const {room_id} = this.props.location.query;
    this.msgType = {
      "IMAGE" : 'image',
      "TEXT"  : 'text',
      "VOICE" : 'voice'
    };
    this.state={
      loading: true,
      collapse:true,
      room_id: parseInt(room_id),
      message_id: 0,
      customEvent:{
        abort : null
      }
    }
    this.onSend = this.onSend.bind(this);
    this.onResend = this.onResend.bind(this);
    this.onPullRefresh = this.onPullRefresh.bind(this);
    this.onClickHead = this.onClickHead.bind(this);
    this.onPlayVoice = this.onPlayVoice.bind(this);
    this.onSendImage = this.onSendImage.bind(this);
    this.endChat = this.endChat.bind(this);
    this.fireAbort = this.fireAbort.bind(this);
  }
  componentDidMount(){
    //  自定义abort事件，当语音标签被点击时触发
    //Cookie.set("newRooms", parseInt(getUser().newRooms)-1 ,{domain:'.gstzy.cn'});
    const customEvent = {
      abort : new CustomEvent("abort",{"detail":"stop play voice"})
    };
    this.setState({customEvent:customEvent});
    document.addEventListener("click",this.fireAbort);


    this.user = getUser();
    // 先清除所有咨询列表
    this.props.dispatch(fetClearList());
    this.props.dispatch(fetClearErrorList());
    this.fetchMesNews((res)=>{
      this.setState({loading:false})
      if(res.status!=0){
        Modal.error({
          title: "错误",
          content: res.message
        })
      }else{
        this.regInterval();
      }
    });
  }
  //在组件接收到新的 props 的时候调用。在初始化渲染的时候，该方法不会调用。
  componentWillReceiveProps(oNextProps){
  	if(this.props.getUserInfo.data.new_rooms){
  		if(this.props.getUserInfo.data.new_rooms.find((n)=>n.toString()== this.props.location.query.room_id)){
  			Cookie.set("newRooms", parseInt(getUser().newRooms)-1 ,{domain:'.gstzy.cn'});
  			Cookie.set("newMessage", parseInt(this.props.getUserInfo.data.new_message) ,{domain:'.gstzy.cn'});
  		}
  	}
  	if(this.props.location.query.room_id !== oNextProps.location.query.room_id){
  		
  		this.setState({
  			room_id:oNextProps.location.query.room_id
  		})
  		this.removeInterval();
  		setTimeout(()=>this.componentDidMount(),300);
  		
  	}
    const {messageList, message_status} = oNextProps;
    this.setState({
      message_id: messageList.length<=0 ? 0 : messageList[0].message_id, // 用于下拉查看聊天记录的消息ID
    })

    if(message_status>=3){
      this.removeInterval();
    }
  }
  componentWillUnmount(){
    this.removeInterval();
  }
  //------------------------------------------------------------
  // 当点击发送
  onSend(text, type){
    const {chatWin} = this.refs;
    this.addMes(text, type);
    piwik.trackEvent("聊天咨询", "click", "咨询发送");
  }
  onResend(mesObj){
    this.reSend(mesObj);
  }
  // 点击发送图片
  onSendImage(e){
    //选择图片
    const file = e;
    if (file.size>2097152) {
      message.warning("请选择2M以内的图片上传");
      return
    }
    this.onSend(file,this.msgType.IMAGE);
  }
  // 下拉刷新
  onPullRefresh(endRefresh){
    this.getMesHistory(endRefresh);
  }
  // 触发停止播放音频事件
  fireAbort(e){
    const tarCls = e.target.classList;
    if (tarCls.contains('large')||tarCls.contains('voice-play')||tarCls.contains('voice')||tarCls.contains('bubble')) {
      const el = Array.prototype.slice.call(document.getElementsByTagName("audio"));
      el.forEach((item)=>{
        if (e.target.dataset.id!=item.id) {
          item.dispatchEvent(this.state.customEvent.abort);
        }
      })
    }
  }
  onClickHead(){

  }
  onPlayVoice(){

  }
  //----------------------------------------------------------
  regInterval(){
    if(this.mesInterval) return;
    this.mesInterval = window.setInterval(()=>{
      this.fetchMesNews();
    }, 5*1000);
  }
  removeInterval(){
    window.clearInterval(this.mesInterval);
    this.mesInterval = null;
  }
  // 获取历史消息列表
  getMesHistory(endRefresh=()=>{}){
    const {room_id, message_id} = this.state;
    const chatWin = this.refs;
    this.props.dispatch(getMesHistory({
      role: this.user.role,
      message_id: message_id,
      room_id:　room_id,
      length: 10
    }, (res)=>{
      if(res.status!=0){
        Modal.error({
          title: "错误",
          content: res.messageList
        })
      }
      endRefresh();
    }))
  }
  // 查询消息
  fetchMesNews(callback=()=>{}){
  	
    const {room_id} = this.state;
    this.props.dispatch(getMesNews({
      length: 15,
      role: this.user.role,
      role_id: this.user.doctor_id,
      room_id: room_id
    }, callback))
  }
  // 发送一条消息,
  addMes(content, type){
    const {room_id} = this.state;
    this.props.dispatch(sendMes({
      content: content,
      role: this.user.role,
      room_id: room_id,    // 房间ID
      type: type,
      user_id: this.user.user_id,
      role_id: this.user.doctor_id
    }, (res)=>{
      if(parseInt(res.status)!=0){
        if(parseInt(res.status)==422){
          Modal.warning({
            title: "警告",
            content: "消息长度不能超过140。"
          })
        }else{
          Modal.error({
            title: "错误",
            content: res.message
          })
        }
      }
    }))
  }
  // 从新发送失败的消息
  reSend(mesObj){
    const {errorMessageList} = this.props;
    let resendObj = null;
    if(!errorMessageList || errorMessageList.length<=0) return;
    for(let i=errorMessageList.length-1; i>=0; i--){
      if(mesObj.temp_id==errorMessageList[i].temp_id){
        resendObj = errorMessageList[i]
        break;
      }
    }
    resendObj.status = 3;
    this.props.dispatch(sendMes(resendObj, (res)=>{
      if(parseInt(res.status)!=0)
        Modal.error({
          title: "错误",
          content: res.message
        })
    }, "resend"))
  }
 
  // 结束对话
  endChat(e){
  	const _this = this;
    const {room_id} = this.state;
    this.setState({loading: true});
  	confirm({
	    title: '结束咨询?',
	    content: '是否结束该条咨询',
	    onOk() {	
		    _this.props.dispatch(fetchEndChat({
		      role: 2,
		      role_id: _this.user.doctor_id,
		      room_id: room_id
		    }, (res)=>{
		      _this.setState({loading: false});
		      if(parseInt(res.status)!=0){
		        if(parseInt(res.status)==402){
		          message.warning("该问题已结束，请重新发起咨询。");
		        }else{
		          message.error(res.message);
		        }
		      }else{
		      	
		      	const postconfig = {
				  		message_status:[1,2] ,
				  		page_no:1,
				  		page_size:1000,
				  		role:getUser().role,
				  		role_id:getUser().doctor_id,
				  		order:"desc",
				  		sort:"last_time"
			  		}
			  		_this.props.dispatch(getConsulting(postconfig,(res)=>{
			  			if(res.data.length>0)
			  				_this.context.router.push(`/chatcenter?room_id=${res.data[0].id}&flage=Consulting`);
			  			else
			  				_this.context.router.push(`/patientCounsel/consulting`);
			  		}));
		      
		      }
		    }));
	    },
	    onCancel() {_this.setState({loading: false});},
	  });
  
    piwik.trackEvent("聊天咨询", "click", "结束咨询");
  }
  render(){
    const {loading} = this.state;
    const {messageList, userInfo, message_status, message_city} = this.props;
    const {patient_sex, patient_name, patient_age, city_name} = userInfo;
    const sex = ["性别保密","男", "女"];
    const status = ["", "未回复", "问诊中","已结束", "已结束"];
    return(
      <Spin spinning={loading}>
        <div className="chat">
          <header>
            <span>{`${patient_name}　${sex[patient_sex]}　${patient_age}岁　　${city_name}`}</span>
            <p>{`${status[message_status]}`}</p>
          </header>
          <ChatWin ref="chatWin"
            messageList={messageList}
            messageStatus={message_status}
            messageCity={message_city}
            userInfo = {userInfo}
            platform = {`pingan`}
            onPullRefresh = {this.onPullRefresh}
            onClickHead = {this.onClickHead}
            onClickResend = {this.onResend}
            onPlayVoice = {this.onPlayVoice}
          />
          <DocInputArea onSend={this.onSend}
            message_status={message_status}
            onSendImage={this.onSendImage}
            endChat={this.endChat}
          />
        </div>
      </Spin>
    );
  }
}

ChatCenter.contextTypes={
  router: React.PropTypes.object.isRequired
};
ChatCenter.propTypes = {
  errorMessageList: PropTypes.array.isRequired,
  messageList: PropTypes.array.isRequired,
  message_city: PropTypes.string,
  message_status: PropTypes.number.isRequired,
  last_time: PropTypes.number.isRequired,
  userInfo: PropTypes.shape({
    doctor_id: PropTypes.number.isRequired,
    doctor_img: PropTypes.string.isRequired,
    doctor_name: PropTypes.string.isRequired,
    user_id: PropTypes.number.isRequired,
    user_img: PropTypes.string.isRequired,
    patient_id: PropTypes.number.isRequired,
    city_name: PropTypes.string.isRequired,
    patient_name: PropTypes.string.isRequired,
    patient_age: PropTypes.number.isRequired,
    patient_sex: PropTypes.number.isRequired,
    assistant_id: PropTypes.number.isRequired,
    assistant_img: PropTypes.string.isRequired
  })
};
function mapStateToProps(state){
  return {
  	
    errorMessageList: state.errorMessageList.data,
    messageList: state.messageList.data,
    message_city: state.messageList.city_name,
    message_status: parseInt(state.messageList.message_status), //1：未回复；2：问诊中；3：手动结束；4：自动结束
    last_time: parseInt(state.messageList.last_time), // 最后一条消息的发送时间
    userInfo: {
      doctor_id: parseInt(state.messageList.doctor_id),
      doctor_img: state.messageList.doctor_img,
      doctor_name: state.messageList.doctor_name,
      user_id: parseInt(state.messageList.user_id),
      user_img: state.messageList.user_img,
      patient_id: parseInt(state.messageList.patient_id),
      city_name: state.messageList.city_name,
      patient_name: state.messageList.patient_name,
      patient_age: parseInt(state.messageList.patient_age),
      patient_sex: parseInt(state.messageList.patient_sex),
      assistant_id: parseInt(state.messageList.assistant_id),
      assistant_img: state.messageList.assistant_default_img
    },
    roomInfo: {
      doctor_id: parseInt(state.messageList.doctor_id),
      patient_id: parseInt(state.messageList.patient_id),
      room_id: state.messageList.id,
      hash : state.messageList.hash
    },
    getUserInfo:state.getUserInfo
  }
}
export default connect(mapStateToProps)(ChatCenter)
