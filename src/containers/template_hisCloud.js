import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";

import { Menu, Breadcrumb, Icon } from 'antd';

class template_hisCloud extends Component {
  constructor(props){
    super(props);
    this.state={
      collapse:true
    }
  }
  componentDidMount(){
    
  }
  render(){
    const {collapse} = this.state;
    return(
      <div className="page template_hisCloud">

      </div>
    );
  }
}

template_hisCloud.contextTypes={
  router: React.PropTypes.object.isRequired
};
template_hisCloud.propTypes = {
};
function mapStateToProps(state){
  return state
}
export default connect(mapStateToProps)(template_hisCloud)
