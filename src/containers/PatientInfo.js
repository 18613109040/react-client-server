//患者信息
import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {Menu,Tag,Button,Row,Col} from 'antd';
import {fetchPatientInfo} from '../store/actions/User';
import {convertGender, convertTimeToStr} from '../utils/tools';
class Item extends Component {
  static defaultProps={
		data:[],
		icon:"icon-baseInfo",
		title:"信息"
	};
	static propTypes = {
		data:PropTypes.array,
		icon:PropTypes.string,
		title:PropTypes.string
	};
  constructor(props){
    super(props);
    this.state={

    }
  }
  componentDidMount(){

  }
  render(){

    return(
      <div className="patientItem">
       	<div className="item-div">
       		<div className={`iconfont item-div1 ${this.props.icon}`}></div>
       		<div className="item-div2">{this.props.title}:</div>
       	</div>

       	<div className={this.props.solid?"content2":"content"} >
       		<Row type="flex" justify="center" align="middle" >
	       		{
	       			this.props.data.map((item)=>(
	       				<Col span={item.span} style={{padding:"5px"}}>
			       			<span className="name">{item.name}:</span>
			       			<span className="value">{item.value}</span>
			       		</Col>))
	       		}
       		</Row>
       	</div>
      </div>
    );
  }
}
class PatientInfo extends Component {
  constructor(props){
    super(props);
    this.state={

    }
  }
  componentDidMount(){
    const {userId, patientId} = this.props.location.query;
  	// this.props.dispatch(fetchPatientInfo({record_id:patientId,user_id:userId},(json)=>{}));

  }

  render(){
    const {card_no,name,sex,birth,phone,address} = this.props.fileInfo;
    const age = birth ? new Date().getFullYear()-new Date(baseInfo.birth*1000).getFullYear() : '';
    const data = [
	    {name:"诊疗卡",value:card_no,span:12},
      {name:"姓名",value:name,span:12},
      {name:"性别",value:sex?convertGender(sex):'',span:12},
      {name:"年龄",value:age,span:12},
      {name:"出生日期",value:birth,span:12},
      {name:"电话号码",value:phone,span:12},
      {name:"身份证号",value:birth,span:12},
      {name:"联系地址",value:address,span:12}
    ]
    const data2 = [
	    {
	    	name:"费别",
	    	value:"医保-居民门诊",
	    	span:12
	    },{
	    	name:"医疗证号",
	    	value:"11111",
	    	span:12
	    }
    ]
    const data3 = [
	    {
	    	name:"医馆就诊次数",
	    	value:"12",
	    	span:24
	    },{
	    	name:"最近就诊",
	    	value:"2016-10-26  15:23:12",
	    	span:24
	    },{
	    	name:"手术史",
	    	value:"无",
	    	span:24
	    },{
	    	name:"过敏史",
	    	value:"无",
	    	span:24
	    },{
	    	name:"既往史",
	    	value:"无",
	    	span:24
	    },{
	    	name:"家族史",
	    	value:"无",
	    	span:24
	    },{
	    	name:"经带待产史",
	    	value:"无",
	    	span:24
	    }
    ]
    return(
      <div className="patientInfo">
       	<Row type="flex" justify="start" align="middle">
       		<Col span={18}>
       			<Item data={data} icon="icon-baseInfo" title="基本信息" solid={false}/>
       			<Item data={data2} icon="icon-yibao" title="医保信息" solid={false}/>
       		</Col>
       		<Col span={6}>
       			<Item data={data3} icon="icon-bingshi" title="病史信息" solid={true}/>
       		</Col>
       	</Row>
      </div>
    );
  }
}
PatientInfo.contextTypes={
  router: React.PropTypes.object.isRequired
};
function mapStateToProps(state){
  return {
    fileInfo : state.fileInfo
  }
}
export default connect(mapStateToProps)(PatientInfo)
