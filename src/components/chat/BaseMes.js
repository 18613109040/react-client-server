import React, {Component, PropTypes} from "react";
import {convertTimeToStr,getUser} from "../../utils/tools";
import {Icon} from "antd";
// message的基类
export default class BaseMes extends Component{
  constructor(props){
    super(props);
    this.state = this.props.mesObject;
    this.state.previousTime = parseInt(this.props.previousTime);
    this.state.userInfo = this.props.userInfo;

    this.clickHeadHandle = this.clickHeadHandle.bind(this);
    this.reSendHandle = this.reSendHandle.bind(this);
  }

  //  在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）。在生命周期中的这个时间点
  componentWillMount(){
    const curRole = getUser().cur_role;
    this.setState(Object.assign(this.state,{curRole:curRole}))
  }
  //在组件接收到新的 props 的时候调用。在初始化渲染的时候，该方法不会调用。
  componentWillReceiveProps(oNextProps){
    const {mesObject, previousTime, userInfo} = oNextProps;
    this.setState(Object.assign( mesObject,{
      previousTime: previousTime,
      who: mesObject.who,
      created_at: parseInt(mesObject.created_at),
      message_id: mesObject.message_id,
      userInfo: userInfo
    }));
  }

  // 当点击头像
  clickHeadHandle(e){
    const {mesObject, onClickHead} = this.props;
    if(typeof onClickHead != "function") return;
    onClickHead(mesObject, this.showModal, this);
    // $.showIndicator();
    // this.showModal()
  }
  // 当点击重新发送，消息发送失败时才有重新发送的按钮
  reSendHandle(e){
    const {onClickResend, mesObject} = this.props;
    if(typeof onClickResend != "function") return;
    onClickResend(mesObject);
  }
  showModal(obj){
    const docPageBtn = obj.showDoctorPageBtn ? `<a class="button button-fill button-danger" href="/doctorinfo/${obj.doctor_id}/${obj.mis_doctor_id}">医生主页</a>` : "";
    $.modal({
      // title:  'Vertical Buttons Layout',
      text: `<div class="user-info">
              <p><img src=${obj.user_img} /></p>
              <p>${obj.user_name}</p>
              <p>${docPageBtn}</p>
            </div>`,
      verticalButtons: true,
      buttons: [{
          close: true,
          text: '关闭',
          onClick: function() {
            // $.alert('You clicked first button!')
          }
        }]
    })
  }
  //根据角色获取用户信息系
  formatUserInfo(){
    const {doctor_img, assistant_img, user_img, doctor_id, assistant_id, user_id} = this.state.userInfo;
    const {role} = this.state;
    let data = {
      user_id: 0,
      img: "",
    }
    switch (parseInt(role)) {
      case 1: //用户
        data.user_id = user_id;
        data.img = user_img;
        return data;
      case 2: //医生
        data.user_id = doctor_id;
        data.img = doctor_img;
        return data;
      case 4: //医助
      case 8: //客服
      case 16://系统
        data.user_id = assistant_id;
        data.img = assistant_img;
        return data;
      default:
        return data;
    }
  }

  // 消息发送时间
  time(){
    const {created_at} = this.state;
    // const time = new Date(parseInt(created_at));
    // console.log("kkkkkkkssss00000000000000000000000000000",created_at, time.getHours(), time.getSeconds());
    const timeStr = this.formatTime(created_at);
    if(!timeStr) return "";
    return(
      <p className="time">
        <span>{timeStr}</span>
      </p>
    )
  }
  // Math.floor((new Date().getTime()-(last_time*1000))/(24*60*60*1000));
  formatTime(time){
    let {previousTime} = this.state;
    let str = '',
    date = new Date(parseInt(time)*1000),
    curDate = new Date();
    if(!previousTime) previousTime=time+5*61
    if(Math.abs(time-previousTime) > 5*60){
      if(date.getDate()==curDate.getDate()){
        const h = ("00"+date.getHours()).substr(-2, 2),
        m = ("00"+date.getMinutes()).substr(-2,2);
        str = `今天 ${h}:${m}`
      }else{
        str = `${convertTimeToStr(time)}`
        // str = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getSeconds()}`
      }
    }else{
      str = false;
    }
    return str;
  }
  // 头像
  headImg(){
    const data = this.formatUserInfo();
    const {role} = this.state;
    const img = (role==2)? `http://admin.360gst.com/data/upload/${data.img}`: data.img;
    return (
      <div ref="head" data-userid={data.user_id} onClick={this.clickHeadHandle}>
        <img className="head"
        src={img}
        />
      </div>
    )
  }
  name(){
    return (
      <h4>---</h4>
    )
  }
  // 可重写此方法改变消息类型
  text(){
    const {content} = this.props.mesObject
    return (
      <div>{content}</div>
    )
  }
  // 消息状态, 这条消息的状态 0:失败，1：成功， 2：发送中, 3: 重发,
  mesStatus(){
    const {mesObject} = this.props;
    if(!mesObject.hasOwnProperty("status") && mesObject.status == 1) return "";
    if (mesObject.content.hasOwnProperty("")) {

    }
    // return (mesObject.status == 2 || mesObject.status==3) ? (<div className="mes-status"><img className="mes-sendin" src="https://res.wx.qq.com/zh_CN/htmledition/v2/images/icon/ico_loading2e4e03.gif" /></div>):
    return (mesObject.status == 2 || mesObject.status==3) ? (<div className="mes-status"><Icon type="loading" /></div>):
    (mesObject.status == 0 ? (<div className="mes-status"><i onClick={this.reSendHandle} title="重新发送">i</i></div>) : "")
    // return (<div className="mes-status"><img className="mes-sendin" src="https://res.wx.qq.com/zh_CN/htmledition/v2/images/icon/ico_loading2e4e03.gif" /></div>)
  }
  //  消息阅读状态，目前只针对语音类型的消息，如果未读则显示小红点
  mesReadStatus(){
    const {content,role,type} = this.props.mesObject;
    const {curRole,who} = this.state;
    let {user_read,assistant_read,doctor_read,duration} = content;
    const status = {
      1 : user_read,
      2 : doctor_read,
      4 : assistant_read
    };
    duration = Math.round(duration);
    let tips = [];
    // const tips = [
    //   (<span className="circle-badge"></span>),
    //   (<span className="text-tips">{duration}''</span>)
    // ]
    if (type!='voice') return "";
    if (duration) {
      tips.push((<span className="text-tips">{duration+'"'}</span>))
    }
    if (role!=curRole&&status[curRole]=='0') {
      tips.push((<span className="circle-badge"></span>))
    }
    return (
      <div className="mes-read-tips">
        {who=="self" ? tips.reverse() : tips}
      </div>
    )
  }
  // 带对话气泡的框
  textContent(){
    return (
      <div className="bubble">
        {this.text()}
        {this.mesStatus()}
        {this.mesReadStatus()}
      </div>
    )
  }
  // 姓名+消息内容
  mesContent(){
    return (
      <div className="mes-content clearfix">
        {/*{this.name()}*/}
        {this.textContent()}
      </div>
    )
  }


// https://wx2.qq.com/cgi-bin/mmwebwx-bin/webwxgeticon?seq=0&username=@fdf8bda41872a6325109724eb1a99bd1&chatroomid=@ae2340cc61b4d2aa29be4c1f694e0226&skey=
  render(){
    return (
      <div className="chat-mes">
      </div>
    )
  }

}
BaseMes.propTypes = {
  onClickHead:PropTypes.func.isRequired,
  onClickResend:PropTypes.func.isRequired, //
  previousTime: PropTypes.number.isRequired, //上一条消息的发送时间
  userInfo: PropTypes.shape({
    doctor_id: PropTypes.number.isRequired,
    doctor_img: PropTypes.string.isRequired,
    doctor_name: PropTypes.string.isRequired,
    user_id: PropTypes.number.isRequired,
    user_img: PropTypes.string.isRequired,
    patient_id: PropTypes.number.isRequired,
    assistant_id: PropTypes.number.isRequired,
    assistant_img: PropTypes.string.isRequired
  }),
  mesObject: PropTypes.shape({
    who: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    create_at: PropTypes.number.isRequired,  // 	消息发送时间
    message_id: PropTypes.string.isRequired, // 消息ID
    role: PropTypes.number.isRequired,
    role_id: PropTypes.number.isRequired,
    room_Id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    user_id:　PropTypes.string.isRequired,
    temp_id: PropTypes.number
  })
}
