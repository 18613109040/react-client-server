import React, {Component, PropTypes} from "react";
import PictureNav from "../../components/PictureNav";
import BaseMes from "./BaseMes";
// 问诊消息
export default class QuestionMes extends BaseMes {
  constructor(props){
    super(props);
    this.onClickPic = this.onClickPic.bind(this);
  }

  onClickPic(e){
    const {content} = this.props.mesObject;
    if(!content || !content.images) {
      console.error("消息为类型为question的图片为空");
      return;
    }
    let imgList = []
    for(let item of content.images){
      imgList.push(item.url);
    }
   /* wx.previewImage({
      current:e.target.src,
      urls: imgList
    });*/
  }
  pictures(){
    const {content} = this.props.mesObject;
    if(!content || !content.images || content.images.length<1) {
      console.error("消息为类型为question的图片为空");
      return;
    }
    
    const config ={
    	imgList:content.images,
    	style:{
    		"width":"70px",
    		"height": "70px",
    	}
    }
    return(
      <div>
      	<PictureNav {...config} />
      </div>
    )
  }
  // 可重写此方法改变消息类型
  text(){
    const {patient_name,patient_sex, patient_age, text} = this.props.mesObject.content;
    const {messageCity} = this.props;
    const sex = ["性别保密","男", "女"];
    return (
      <div>
        <dev className="u-info">
          <span>{patient_name}</span>&nbsp;&nbsp;&nbsp;&nbsp;
          <span>{sex[patient_sex]}</span>&nbsp;&nbsp;&nbsp;&nbsp;
          <span>{`${patient_age}岁`}</span>&nbsp;&nbsp;&nbsp;&nbsp;
          <span>{messageCity}</span>
        </dev>
        <dev>{text}</dev>
      </div>
    )
  }
  // 带对话气泡的框
  textContent(){
    const {content} = this.props.mesObject;
    if(!content || typeof(content)=="string") {
      console.error("消息类型为question的内容为空或者类型错误。");
      return;
    }
    return (
      <div className="bubble question">
        {this.text()}
        {this.pictures()}
      </div>
    )
  }

  render(){
    const {type, who} = this.state;
    return (
      <div className={`chat-mes ${who}`}>
        {this.time()}
        {this.headImg()}
        {this.mesContent()}
      </div>
    )
  }

}
QuestionMes.propTypes = {
  mesObject: PropTypes.shape({
    content: PropTypes.shape({
      images: PropTypes.array.isRequired,
      text: PropTypes.string.isRequired,
      patient_id: PropTypes.number.isRequired,
      patient_age: PropTypes.number.isRequired,
      patient_sex: PropTypes.number.isRequired, //0：未知， 1：男性， 2女性
      patient_name: PropTypes.string.isRequired
    }).isRequired,
    who: PropTypes.string.isRequired,
    create_at: PropTypes.number.isRequired,  // 	消息发送时间
    message_id: PropTypes.string.isRequired, // 消息ID
    role: PropTypes.number.isRequired,
    role_id: PropTypes.number.isRequired,
    room_Id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    user_id:　PropTypes.string.isRequired
  })
}
