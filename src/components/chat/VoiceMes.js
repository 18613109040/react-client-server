import React, {Component, PropTypes} from "react";
import BaseMes from "./BaseMes";
import { Menu, Breadcrumb, Icon, Modal, Spin } from 'antd';

export default class VoiceMes extends BaseMes {
  constructor(props){
    super(props);
    this.state = Object.assign({},this.state,{play:false});
    this.onPlayVoice = this.onPlayVoice.bind(this);
    this.onPlayEnd = this.onPlayEnd.bind(this);
    this.onPause = this.onPause.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onAbort = this.onAbort.bind(this);
  }
  //  如果在播放则停止播放，如果没有开始播放则开始播放
  onPlayVoice(e){
    const {play} = this.state; // 播放状态
    const {audio} = this.refs;
    if (play) {  //  播放则停止播放
      audio.pause();
    }else {
      audio.play();
    }
  }
  //  当播放结束时，改变播放状态
  onPlayEnd(e){
  }
  //  当暂停播放时，从新加载并改变播放状态
  onPause(e){
    e.target.load();
    this.changePlayState(false);
  }
  onPlay(e){
    const {onPlayVoice} = this.props;
    if (onPlayVoice) {
      onPlayVoice(e);
    }
    this.changePlayState();
  }
  //  当播放器失去焦点时
  onAbort(e){
    if (this.refs.audio.id==300) {
    }
    if (this.state.play) {
      this.pause()
    }
  }
  //  改变语音的播放状态
  changePlayState(status){
    this.setState({play: status|!this.state.play})
  }
  //  暂停语音播放
  pause(){
    this.refs.audio.pause();
  }
  //  组件移除时关闭正在播放的语音文件
  componentWillUnmount(){
    this.pause();
    // $.closeModal();
  }

  renderVoice(){
    const {message_id,content} = this.props.mesObject;
    const {who,play} = this.state;
    const style = {
      width : (180*Math.log10(content.duration/6+1))+'px'
    };
    return (
      <a onClick={this.onPlayVoice}  style={style} data-type="voice">
        <div className={who=="self"?"voice-play rotate":"voice-play"} data-id={message_id}>
          <div className="small"></div>
          <div className={play?"middle play":"middle"}></div>
          <div className={play?"large play":"large"}></div>
        </div>
        <audio
          preload="load"
          ref="audio"
          onEnded={this.onPlayEnd}
          onPause={this.onPause}
          onPlay={this.onPlay}
          onAbort={this.onAbort}
          id={message_id}
          data-message_id={message_id}
          data-user_read={content.user_read}
          data-assistant_read={content.assistant_read}
          data-doctor_read={content.doctor_read}
        >
          <source src={content.url} type="audio/amr" />
          <source src={content.url} type="audio/mp3" />
          您的设备不支持该功能
        </audio>
      </a>
    )
  }
  text(){
    return (
      <div>
        {this.renderVoice()}
      </div>
    )
  }
  render(){
    const {type, who} = this.state;
    return (
      <div className={`chat-mes voice ${who}`}>
        {this.time()}
        {this.headImg()}
        {this.mesContent()}
      </div>
    )
  }

}
VoiceMes.propTypes = {
  mesObject: PropTypes.object.isRequired,
  onPlayVoice: PropTypes.func
}
