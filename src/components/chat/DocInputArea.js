import React, {Component, PropTypes} from "react";
import {Row, Col, Button, Icon, Upload, Modal} from "antd";
import BaseInput from "./BaseInput";
import Status from "./Status";
// 用户输入区域类
export default class DocInputArea extends BaseInput{
  constructor(props){
    super(props);
  }

  //在组件接收到新的 props 的时候调用。在初始化渲染的时候，该方法不会调用。
  componentWillReceiveProps(oNextProps){
    const {message_status, role, is_push, last_time, doctor_id,onBookClick,plat} = oNextProps;
    this.setState({
      message_status: message_status,
      is_push: is_push,
      last_time: last_time,
      role: role,
      doctor_id: doctor_id,
      onBookClick:onBookClick,
      plat:plat
    });
  }

  uploadObj(){
    return {
      action: "/upload.do",
      multiple: true,
      accept: "image/*",
      beforeUpload: (file)=>{
        const {onSendImage} = this.props;
        const isImg = (file.type === "image/png" || file.type==="image/jpeg");
        if(!isImg){
          Modal.error({
            title: "错误",
            content: `文件格式错误，只支持.jpg和.png文件。`
          })
          return false;
        }
        onSendImage(file);
        return false;
      }
    }
  }
  onKeyDown(e){
  	
  }
  //判断中文和英文，字符串的长度是否超标
  checkstr(str, digit) {
    let n = 0;
    for (let i = 0; i < str.length; i++) {
        var leg = str.charCodeAt(i);//ASCII码
        if (leg > 255) {//大于255的都是中文
            n += 2;//如果是中文就是2个字节
        } else {
            n += 1;//英文
        }
    }
    if (n > digit) {
        return true;
    } else {
        return false;
    }
	}
  onChange(e){
  	if (this.checkstr(e.target.value, 280)) {//判断字符串长度是不是超标
      this.refs.textArea.value = e.target.value.substring(0, 140);//删除超除的多余字符串
   		Modal.warning({
		    title: '输入过长',
		    content: '最多输入140个汉字'
  		})
  	}
  }
  // 根据不同状态渲染控制面板
  renderPanel(){
    const {message_status} = this.state;
    const uploadProps = this.uploadObj.bind(this)();
    if(message_status>=3){// 咨询已结束
      return (
        <nav className="input-area end">
          --咨询已结束--
        </nav>
      )
    }else {//问诊中
      return (
        <nav className="input-area">
          {/* <div>
            <Status role={2}
              message_status={message_status}
            />
          </div> */}
          <div className="control-panel">
            <Upload {...uploadProps}>
              <Icon type="picture" onClick={this.uploadObj} />
            </Upload>
          </div>
          <Row gutter={8} className="input-panel">
            <Col className="gutter-row inputArea"  xs={{ span: 12}} sm={{span:15}} md={{span:14}} lg={{span:20}}>
              <textarea ref="textArea" type="text"
              onFocus={this.onInputFocus}
              onInput={this.onInput}
              onKeyDown={this.onKeyDown} onChange={this.onChange.bind(this)}/>
            </Col>
            <Col className="gutter-row btn"  xs={{ span: 12}} sm={{span:7}} md={{span:10}} lg={{span:4}}>
              <div><Button className="btn-send" onClick={this.onClickSend} >&nbsp;发&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;送&nbsp;</Button></div>
              <div><Button className="btn-end" onClick={this.onEndChat}>结束咨询</Button></div>
            </Col>
          </Row>
        </nav>
      )
    }
  }

  render(){
    const {message_status, last_time} = this.state;
    return this.renderPanel();
  }

}
