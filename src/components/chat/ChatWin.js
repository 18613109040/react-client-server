import React, {Component, PropTypes} from "react";

import BaseWin from "./BaseWin";
import MesManager from "./MesManager";

export default class ChatWin extends BaseWin {
  constructor(props){
    super(props);
    this.state = {
      message_id:0,
      mesList: [],
      firstMesId: 0, //  第一条消息的Id
      lastMesId: -1, // 最后一条消息的id
    }
    this.endRefresh = this.endRefresh.bind(this);
    this.pullRefresh = this.pullRefresh.bind(this);
  }

  //在组件接收到新的 props 的时候调用。在初始化渲染的时候，该方法不会调用。
  componentWillReceiveProps(oNextProps){
    const {messageList} = oNextProps;
    if(messageList.length>0 && this.state.lastMesId!= messageList[messageList.length-1].message_id){
      this.setState({lastMesId: messageList[messageList.length-1].message_id});
    }
  }

  //在接收到新的 props 或者 state，将要渲染之前调用。该方法在初始化渲染的时候不会调用，在使用 forceUpdate 方法的时候也不会。如果确定新的 props 和 state 不会导致组件更新，则此处应该 返回 false。
  shouldComponentUpdate(oNextProps, oNextState){
    return true;
  }

  // //在接收到新的 props 或者 state 之前立刻调用。在初始化渲染的时候该方法不会被调用。使用该方法做一些更新之前的准备工作。
  // componentWillUpdate(oNextProps, oNextState){}

  //在组件的更新已经同步到 DOM 中之后立刻被调用。该方法不会在初始化渲染的时候调用。使用该方法可以在组件更新之后操作 DOM 元素。
  componentDidUpdate(oNextProps, oNextState){
    // const scroll = $.getScroller($('.content'));
    if(this.state.lastMesId!=oNextState.lastMesId){
      this.myScroll.refresh();
      this.myScroll.scrollTo(0, this.myScroll.maxScrollY);
    }
  }

  // 获取聊天记录的回调
  endRefresh(res){
    // 加载完毕需要重置
    this.myScroll.refresh();
  }
  // 下拉刷新
  pullRefresh(){
    const {onPullRefresh} = this.props;
    onPullRefresh(this.endRefresh);
  }

  //服务器端和客户端都只调用一次，在初始化渲染执行之前立刻调用。如果在这个方法内调用 setState，render() 将会感知到更新后的 state，将会执行仅一次，尽管 state 改变了。
  componentDidMount(){
    this.myScroll = new IScroll('#wrapper', {
  		scrollbars: true,
  		mouseWheel: true,
  		interactiveScrollbars: true,
  		shrinkScrollbars: 'scale',
  		fadeScrollbars: true
  	});

    this.myScroll.on("scrollEnd", (e)=>{
      this.myScroll.refresh();
      if(this.myScroll.y==0){
        this.pullRefresh()
      }
    })
    document.addEventListener('touchmove', (e)=>{ e.preventDefault(); }, false);
  }
  componentWillUnmount(){
  	
   
  }
  render(){
    const {mesList} = this.state;
    const {messageList, messageStatus, userInfo, onClickHead,onClickResend,platform,onPlayVoice,messageCity} = this.props;
    return (
      <div className="content" id="wrapper">
        {/*默认的下拉刷新层*/}
        {/* <div className="pull-to-refresh-layer">
          <div className="preloader"></div>
          <div className="pull-to-refresh-arrow"></div>
        </div> */}
        <MesManager ref="mesManager"
          messageList={messageList}
          messageStatus={messageStatus}
          messageCity={messageCity}
          userInfo={userInfo}
          platform={platform}
          onClickHead={onClickHead}
          onClickResend={onClickResend}
          onPlayVoice = {onPlayVoice}
        />
      </div>
    )
  }

}


ChatWin.proptypes = {
  messageList: PropTypes.array.isRequired,
  messageStatus: PropTypes.number.isRequired,
  onPullRefresh: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
  onClickHead: PropTypes.func.isRequired,
  onClickResend: PropTypes.func.isRequired,
  platform: PropTypes.string.isRequired
}
