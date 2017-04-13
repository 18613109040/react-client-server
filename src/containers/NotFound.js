import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";

import { Breadcrumb, Icon,Row,Col } from 'antd';

class NotFound extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
  }

  render(){
    return(
        <Row type="flex" justify="center"style={{"width":"100%","height":"100%"}}>
        	<Col span={24} className="not-found"></Col>
        </Row>
      
    );
  }
}

NotFound.propTypes = {
};
function mapStateToProps(state){
  return state
}

export default connect(mapStateToProps)(NotFound)
