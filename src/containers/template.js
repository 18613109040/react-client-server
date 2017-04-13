import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";

import {Breadcrumb, Icon } from 'antd';
import SiteHeader from '../components/SiteHeader';
import SiteSide from '../components/SiteSide';
import SiteFooter from '../components/SiteFooter';

class Template extends Component {
  constructor(props){
    super(props);
  }

  //服务器端和客户端都只调用一次，在初始化渲染执行之前立刻调用。如果在这个方法内调用 setState，render() 将会感知到更新后的 state，将会执行仅一次，尽管 state 改变了。
  componentWillMount(){}

  //在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）。在生命周期中的这个时间点，组件拥有一个 DOM 展现，你可以通过 this.getDOMNode() 来获取相应 DOM 节点。
  componentDidMount(){
  }

  //在组件接收到新的 props 的时候调用。在初始化渲染的时候，该方法不会调用。
  componentWillReceiveProps(oNextProps){}

  //在接收到新的 props 或者 state，将要渲染之前调用。该方法在初始化渲染的时候不会调用，在使用 forceUpdate 方法的时候也不会。如果确定新的 props 和 state 不会导致组件更新，则此处应该 返回 false。
  shouldComponentUpdate(oNextProps, oNextState){}

  //在接收到新的 props 或者 state 之前立刻调用。在初始化渲染的时候该方法不会被调用。使用该方法做一些更新之前的准备工作。
  componentWillUpdate(oNextProps, oNextState){}

  //在组件的更新已经同步到 DOM 中之后立刻被调用。该方法不会在初始化渲染的时候调用。使用该方法可以在组件更新之后操作 DOM 元素。
  componentDidUpdate(oNextProps, oNextState){}

  //在组件从 DOM 中移除的时候立刻被调用。在该方法中执行任何必要的清理，比如无效的定时器，或者清除在 componentDidMount 中创建的 DOM 元素。
  componentWillUnmount(){
  }

  render(){
    return(
      <div className="page template">
        TEMPLATE
      </div>
    );
  }
}

Template.contextTypes={
  router: React.PropTypes.object.isRequired
};
Template.propTypes = {
};
function mapStateToProps(state){
  return state
}

export default connect(mapStateToProps)(Template)
