//诊疗记录
import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {Icon ,Button,Row,Col  } from 'antd';
export default class CaseInfo extends Component {
  constructor(props){
    super(props);
    this.state={

    }
  }
  //服务器端和客户端都只调用一次，在初始化渲染执行之前立刻调用。如果在这个方法内调用 setState，render() 将会感知到更新后的 state，将会执行仅一次，尽管 state 改变了。
  componentWillMount(){}

  //在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）。在生命周期中的这个时间点，组件拥有一个 DOM 展现，你可以通过 this.getDOMNode() 来获取相应 DOM 节点。
  componentDidMount(){

  }
  render(){
  	
    const {now_his='无',all_his='无',physique_check='无',process='无',check_name='无',medic_check=[]} = this.props.data||{};
    let zy = [];
    let xy = [];
    medic_check.filter(item=>item.check_type=='1').map(d=>zy.push(d.check_name))
    medic_check.filter(item=>item.check_type=='2').map(d=>xy.push(d.check_name))
    return(
      <div className="caseinfo">
      	<Row>
      		<Col span={24}>
            <h4>现病史:</h4>
            <p>{now_his}</p>
          </Col>
      		<Col span={24}>
            <h4>过敏史:</h4>
            <p>{all_his}</p>
          </Col>
      		<Col span={24}>
            <h4>体格检查:</h4>
            <p>{physique_check}</p>
          </Col>
      		<Col span={24}>
            <Row>
              <Col span={12}>
                <h4>中医诊断:</h4>
                <p>{zy.toString()}</p>
              </Col>
              <Col span={12}>
                <h4>西医诊断:</h4>
                <p>{xy.toString()}</p>
              </Col>
            </Row>
          </Col>
      		<Col span={24}>
            <h4>医嘱及处理:</h4>
            <p>{process}</p>
          </Col>
      	</Row>

      </div>
    );
  }
}

CaseInfo.contextTypes={
  router: React.PropTypes.object.isRequired
};
CaseInfo.propTypes = {
  data : PropTypes.object
};
