import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import Cookie from "js-cookie";
import {isLogin} from "../../utils/tools";
import QuestionMes from "./QuestionMes";
import TextMes from "./TextMes";
import ImgMes from "./ImgMes";
import VoiceMes from "./VoiceMes";

// 按类型渲染消息
export default class MesManager extends Component{
  constructor(props){
    super(props);
  }

  send(mesObj, index, previousTime){
    const {userInfo, onClickHead, onClickResend,onImageClick,platform,onPlayVoice,messageCity} = this.props
    if(!mesObj || typeof(mesObj)!="object"){return;}
    const userId = isLogin();
    if(mesObj.user_id == userId){
      mesObj.who="self";
    }else{
      mesObj.who="you";
    }
    switch (mesObj.type) {
      case "text":
        return (
          <TextMes key={index}
            previousTime={previousTime}
            mesObject={mesObj}
            userInfo={userInfo}
            onClickHead={onClickHead}
            onClickResend={onClickResend}
          ></TextMes>
        )
      case "question":
        return(
          <QuestionMes key={index}
            mesObject={mesObj}
            messageCity={messageCity}
            userInfo={userInfo}
            onClickHead={onClickHead}
            platform={platform}
            onClickResend={onClickResend}
          />
        )
      case "image":
        return(
          <ImgMes key={index}
            mesObject={mesObj}
            userInfo={userInfo}
            platform={platform}
            previousTime={previousTime}
            onClickHead={onClickHead}
            onImageClick={onImageClick}
          />
        )
      case "voice":
        return(
          <VoiceMes key={index}
            mesObject={mesObj}
            onClickHead={onClickHead}
            previousTime={previousTime}
            platform={platform}
            onPlayVoice = {onPlayVoice}
            userInfo={userInfo}
          />
        )
      default:

    }
  }

  render(){
    const {messageList} = this.props;
    return (
      <div className="scroller">
        {
          messageList.map((item, index)=>{
            return this.send(item, index, messageList[index-1]?messageList[index-1].created_at:0)
          })
        }
      </div>
    )
  }

}
MesManager.proptypes = {
  messageList: PropTypes.array.isRequired,
  messageStatus: PropTypes.number.isRequired,
  userInfo: PropTypes.object.isRequired,
  onClickHead: PropTypes.func.isRequired,
  onClickResend: PropTypes.func.isRequired,
  messageCity:PropTypes.string
}
