import React, {Component, PropTypes} from "react";

import BaseMes from "./BaseMes";
// 文本消息
export default class TextMes extends BaseMes {
  constructor(props){
    super(props);

  }

  render(){
    const {type, who, message_id} = this.state;
    return (
      <div id={message_id} className={`chat-mes ${who}`}>
        {this.time()}
        {this.headImg()}
        {this.mesContent()}
      </div>
    )
  }

}
TextMes.propTypes = {
  mesObject: PropTypes.object.isRequired
}
