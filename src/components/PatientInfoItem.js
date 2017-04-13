/*
 * 患者 头部信息 公共部分
 */
import React, {Component, PropTypes} from "react";
import {Row,Col,Tag} from 'antd';
import Tools from "../utils/tools";
class PatientInfoItem extends Component {

	static propTypes = {
		name:PropTypes.string,
		sex:PropTypes.string,
		age:PropTypes.string,
		treatNum:PropTypes.string,
		diagnose:PropTypes.string,
	};
  constructor(props){
    super(props);

    this.state={
			loading:false
    }
  }
  componentDidMount(){
  }
  render(){
    return(
      <div className="patientInfoItem">
        <div>
        {  this.props.sex==1? <i className="icon iconfont icon-girl"></i> : <i className="icon iconfont icon-man"></i>}
        </div>
        <div>{this.props.name}</div>
        <div>{Tools.convertGender(this.props.sex)}</div>
        <div>{this.props.age}</div>
        {this.props.diagnose!=""?(<div><Tag>{((+this.props.diagnose & 0x800) == '2048')?"初诊":"复诊"}</Tag></div>):""}
      </div>
    );
  }
}
PatientInfoItem.contextTypes={
  router: React.PropTypes.object.isRequired
};

export default PatientInfoItem
