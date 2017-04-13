/*
 * 门诊 病历
 */

import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {Menu,Row,Col,Tag} from 'antd';
import { Button } from 'antd';
import ClinicalContent from "./ClinicalContent";
import {Link} from "react-router";

class ClinicalHistory extends Component {
  constructor(props){
    super(props);
  }
  componentWillMount(){
  	
  }
  componentDidMount(){
  	//console.dir(this.props)
  }
  render(){
    return(
      <Row className="clinical-history">
      	<ClinicalContent location={this.props.location}/>
      </Row>
    );
  }
}
ClinicalHistory.contextTypes={

};
function mapStateToProps(state){
  return {
  }
}
export default ClinicalHistory;
