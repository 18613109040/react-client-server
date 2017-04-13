import React, {Component, PropTypes} from "react";

// 输入区域基类
export default class BaseInput extends Component{
constructor(props){
  super(props);
  this.onInputFocus = this.onInputFocus.bind(this);
  this.onInputBlur = this.onInputBlur.bind(this);
  this.onKeyDown = this.onKeyDown.bind(this);
  this.onInput = this.onInput.bind(this);
  this.onClickSend = this.onClickSend.bind(this);
  // this.onClickVoice = this.onClickVoice.bind(this);
  // this.onSendVoice = this.onSendVoice.bind(this);
  // this.onStartVoice = this.onStartVoice.bind(this);
  // this.onCancleRecord = this.onCancleRecord.bind(this);
  this.onSendImage = this.onSendImage.bind(this);
  this.onEndChat = this.onEndChat.bind(this);
  // this.onClickPlus = this.onClickPlus.bind(this);
  // this.onPushClick = this.onPushClick.bind(this);
  // this.onBookClick = this.onBookClick.bind(this);
  // this.registTouchMove = this.registTouchMove.bind(this);
  // this.onInviteDoctor = this.onInviteDoctor.bind(this);
  this.state = {
    inputType: "text", // 标记为语言输入或者文本输入  text：文本输入， voice：语言输入
    isSend: false, // 标记为是否可以发送文本 false:不可发送
    controlPanel: false, // 是否打开功能控制面板 false：不打开
    mesText: "", // 存放用户输入的文本
    message_status: 1,

    message_status: this.props.message_status,
    is_push: this.props.is_push,
    last_time: this.props.last_time,
    role: this.props.role,
    plat: this.props.plat
  }
  this.hammertime = null;
}
componentDidUpdate(oNextProps, oNextState){
  // this.registTouchMove();
}

// 输入框获取焦点
onInputFocus(){
  this.setState({controlPanel: false}); // 关闭功能控制面板
}
// 输入框失去焦点
onInputBlur(){
}
onKeyDown(e){
  if(e.keyCode!=13) return;
  this.sendMes();
  this.setState({mesText: "", isSend: false});
  e.target.value = "";
  e.preventDefault()
}
// 单输入框输入时
onInput(e){
  const target = e.target;
  this.setState({
    isSend:target.value.length>0,
    mesText: target.value
  });
}
// 点击发送
onClickSend(e){
  const {isSend} = this.state;
  if(!isSend) return; // 如果不为发送状态则返回
  this.sendMes();
  this.setState({mesText: "", isSend: false});
  this.refs.textArea.value = "";
}
// 点击语音或键盘，切换到语音模式
// onClickVoice(e){
//   //  禁用H5的语音功能
//   if (this.state.plat!='weixin'&&this.state.inputType=="text") return;
//   this.setState({inputType:this.state.inputType=="text"? "voice": "text"});
// }
// 点击语音按钮开始说话
onStartVoice(e){
  e.stopPropagation();
  e.preventDefault();
  const {onStartVoice} = this.props;
  this.showModal()
  onStartVoice(e);
}
// 释放录音按钮的回调
onSendVoice(e){
  const {onSendVoice} = this.props;
 // $.closeModal();
  onSendVoice(e);
}
// registTouchMove(){
//   if (this.state.inputType=="voice") {
//     // if (!this.hammertime) return;
//     this.hammertime = new Hammer(this.refs.voiceBtn);
//     this.hammertime.add(new Hammer.Swipe());
//     this.hammertime.on('swipeup',this.onCancleRecord)
//   }else {
//     if (!this.hammertime) return;
//     this.hammertime.off("swipeup");
//   }
// }
// 取消录音
onCancleRecord(e){
  e.stopPropagation();
  e.preventDefault();
  const {onCancleRecord} = this.props;
  onCancleRecord(e);
}
// 点击“加”功能按钮
onClickPlus(e){
  this.setState({
    controlPanel: !this.state.controlPanel
  })
}
// 催问
onPushClick(e){
  const {pushDoctor} = this.props;
  if(typeof(pushDoctor)!="function") return;
  pushDoctor(e);
}
// 预约
onBookClick(e){
  const {onBookClick} = this.props;
  if(typeof(onBookClick)!="function") return;
  onBookClick(e);
}
// 点击结束咨询
onEndChat(e){
  const {endChat} = this.props;
  if(typeof(endChat)!="function") return;
  endChat(e);
  this.setState({
    controlPanel: !this.state.controlPanel
  })
}
// 点击邀请导师
onInviteDoctor(e){
  const {inviteDoctor} = this.props;
  if(typeof(inviteDoctor)!="function") return;
  inviteDoctor();
  this.setState({
    controlPanel: !this.state.controlPanel
  })
}
// 点击发送图片
onSendImage(e){
  const {onSendImage} = this.props;
  if (typeof(onSendImage)!="function") return;
  onSendImage(e);
  // this.setState({
  //   controlPanel: !this.state.controlPanel
  // })
}
// 点击结束咨询
  onEndChat(e){
    const {endChat} = this.props;
    if(typeof(endChat)!="function") return;
    endChat(e);
  }


// 键盘与语言切换按钮
inputType(){
  const {inputType} = this.state;
  return (
    <div key="0" className="type">
      {
        inputType!="text" ?
        (<a><span className="icon iconfont iconfont-key" onClick={this.onClickVoice}></span></a>):
        (<a><span className="icon iconfont iconfont-voice" onClick={this.onClickVoice}></span></a>)
      }
    </div>
  )
}
// 输入框或者语言输入
inputArea(){
  const{inputType} = this.state;
  return (
    <div key="1" className="input" onTouchMove={this.onCancleRecord}>
      {
        inputType!="text"?
        (<a href="javascript:;" className="button button-light voice" ref="voiceBtn" onTouchStart={this.onStartVoice} onTouchEnd={this.onSendVoice}>按住 说话</a>):
        (<div>
          <textarea ref="textArea" type="text"
          onFocus={this.onInputFocus}
          onBlur={this.onInputBlur}
          onInput={this.onInput}
          onKeyDown={this.onKeyDown} />
          </div>
        )
      }
    </div>
  )
}
// 功能按鈕
plusBtn(){
  const {role} = this.state;
  return (
    <div key="2" className="plus">
      <a><span className="icon iconfont iconfont-add" onClick={this.onClickPlus}></span></a>
    </div>
  );
}
// 发送按钮
sendBtn(){
  const {isSend, inputType} = this.state;
  if(inputType=="voice") return "";
  return (
    <div key="3">
      <a href="javascript:;"
        className={`button button-fill send${isSend?"":" disabled"}`}
        onClick={this.onClickSend}>发送</a>
    </div>
  )
}
// 催问按钮
pushBtn(){
  return (<a key="4" href="javascript:;" className="button button-fill button-danger"
    onClick={this.onPushClick}>催问</a>)
}
// 结束问诊时患者端的“预约挂号”按钮
bookBtn(){
  const {doctor_id} = this.props
  return (<a key="5" href={`/jsapi/gotodocinfo/${doctor_id}`} className="button button-fill button-danger"
    onClick={this.onBookClick}>预约挂号</a>)
}

// 控制面板功能按钮------------------------------------------------------
// 结束对话/结束咨询
endChat(){
  return (
    <div key="5" className="btn">
      <a><span className="icon iconfont iconfont-endchat" onClick={this.onEndChat}></span></a>
      <span>结束咨询</span>
    </div>
  )
}
// 邀请导师邀请医生回答
inviteDoctor(){
  const {role} = this.props;
  if(role!=4) return ""
  return (
    <div key="6" className="btn">
      <a><span className="icon iconfont iconfont-add" onClick={this.onInviteDoctor}></span></a>
      <span>@导师回答</span>
    </div>
  )
}
renderAddImgBtn(){
  const {plat} = this.state;
  if (plat=='weixin') {
    return (<span className="icon iconfont iconfont-image" onClick={this.onSendImage}></span>)
  }else {
    return (
      <span>
        <span className="icon iconfont iconfont-image"></span>
        <input accept="image/*" type="file" onChange={this.onSendImage}/>
      </span>
    )
  }
}
//发送图片
sendImage(){
  return (
    <div key="7" className="btn">
      <a>
        {this.renderAddImgBtn()}
      </a>
      <span>图片</span>
    </div>
  )
}
showModal(obj){
  $.modal({
    // title:  'Vertical Buttons Layout',
    text: `<div class="record-panel">
            <p><i class="icon iconfont iconfont-record-voice"></i>请说话...</p>
            <p>松开发送，上滑取消</p>
          </div>`,
    extraClass : 'record-modal'
  })
}
sendMes(){
  const {onSend} = this.props;
  const {mesText, inputType} = this.state;
  if(mesText.trim().length<=0) return false;
  onSend(mesText, inputType);
}
render(){
  return (
    <nav className="input-area">
    </nav>
  )
}

static proptypes = {
  onSend: PropTypes.func.isRequired,
  onSendVoice: PropTypes.func.isRequired,
  onCancleRecord : PropTypes.func.isRequired,
  endChat: PropTypes.func.isRequired, // 结束咨询
  inviteDoctor: PropTypes.func.isRequired, // 邀请导师
  message_status: PropTypes.number.isRequired,
  role: PropTypes.number.isRequired,
  is_push: PropTypes.number.isRequired, // 是否已经催问过 0；未催问， 1：已催问
  last_time: PropTypes.number.isRequired, // 最后一条消息的发送时间
  pushDoctor: PropTypes.func.isRequired,  // 催问医生
  onSendImage: PropTypes.func.isRequired,  // 催问医生
  doctor_id: PropTypes.number.isRequired //医生ID
}
}
