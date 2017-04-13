import React, {Component, PropTypes} from "react";

import BaseMes from "./BaseMes";
// 输入框上面的文本状态条
export default class Status extends Component {
  constructor(props){
    super(props);

  }
  //-----------------------------------------------------------------------------------------
  // //服务器端和客户端都只调用一次，在初始化渲染执行之前立刻调用。如果在这个方法内调用 setState，render() 将会感知到更新后的 state，将会执行仅一次，尽管 state 改变了。
  // componentDidMount(){
  //   this. role =
  //   $(document).on('refresh', '.pull-to-refresh-content', this.pullRefresh)
  // }
  renderBody(){
    const {message_status, role, doctor_id,onBookClick} = this.props;
    switch (message_status) {
      case 1: // 未回复
        if(role==1){
          return (<p>咨询已通知医生，若有回复将在微信中通知您</p>);
        }else{
          return (<p>回复的消息，将会在微信中通知患者</p>)
        }
        break;
      case 2: // 问诊中
        if(role==1){
          return (<p>
              医生建议仅供参考，如需面诊请<a href={`/jsapi/gotodocinfo/${doctor_id}`} onClick={onBookClick.bind(this)}>点击预约 ></a>
            </p>);
        }else{
          return (<p>如问题已解决，可点击“+”结束咨询</p>);
        }
        break;
      case 3: // 手动结束
        if(role==1){
          return (<p>本次咨询已自动结束，如有问题可再向我咨询</p>)
        }else {
          return (<p>本次咨询已自动结束，如有问题可再向我咨询</p>)
        }
        break;
      case 4: // 自动结束
        if(role==1){
          return (<p>本次咨询已自动结束，如有问题可再向我咨询</p>)
        }else{
          return (<p>本次咨询已自动结束，如有问题可再向我咨询</p>)
        }
        break;
      default: // 手动结束
        return (<p></p>);
    }
  }
  render(){
    return (
      <div className="status">
        {this.renderBody()}
      </div>
    )
  }

  static propTypes = {
    message_status: PropTypes.number.isRequired,
    role: PropTypes.number.isRequired,
    doctor_id: PropTypes.number,
    onBookClick: PropTypes.func
  }
}
