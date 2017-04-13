import React, {Component, PropTypes} from "react";

// 聊天窗口的基类
export default class BaseWin extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div className="content chat pull-to-refresh-content" data-ptr-distance="55">
      </div>
    )
  }
}
