import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";

import { Menu, Breadcrumb, Icon } from 'antd';
class ChatCenter extends Component {
  constructor(props){
    super(props);
    this.state={
      collapse:true
    }
  }
  componentDidMount(){
    
  }
  render(){
    return(
      <div className="quick-reply">
        快速回复
      </div>
    );
  }
}

ChatCenter.contextTypes={
  router: React.PropTypes.object.isRequired
};
ChatCenter.propTypes = {
};
function mapStateToProps(state){
  return state
}
export default connect(mapStateToProps)(ChatCenter)
