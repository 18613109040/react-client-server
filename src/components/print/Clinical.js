/**
 * Created by Administrator on 2016/9/13.
 */
import React, {Component, PropTypes}  from "react";
import {Row,Col } from 'antd';
import {getUser} from "../../utils/User";
import {convertGender,convertTimeToStr} from "../../utils/tools";
import "./clinical.scss"
export default class Clinical extends Component {
 	static defaultProps={
		medical:[],
		complaint:"主诉",
		now_his:"现病史",
		all_his:"过敏史",
		past_his:"既往史",
		family_his:"家族史",
		is_menopause:"",
		bear_his:"",
		temperature:"",
		p_per:"",
		r_per:"",
		bp_up:"",
		bp_down:"",
		tongue_name:"",
		tongue_coat_name:"",
		pluse_name:"",
		physique_check:"",
		other_check:"",
		process:"",
		mediciValue:[],
		clinilValue:[]
	};
	static propTypes = {
		medical:PropTypes.array,
		complaint:PropTypes.string,
		now_his:PropTypes.string,
		all_his:PropTypes.string,
		past_his:PropTypes.string,
		family_his:PropTypes.string,
		is_menopause:PropTypes.string,
		bear_his:PropTypes.string,
		temperature:PropTypes.string,
		p_per:PropTypes.string,
		r_per:PropTypes.string,
		bp_up:PropTypes.string,
		bp_down:PropTypes.string,
		tongue_name:PropTypes.string,
		tongue_coat_name:PropTypes.string,
		pluse_name:PropTypes.string,
		physique_check:PropTypes.string,
		other_check:PropTypes.string,
		process:PropTypes.string,
		mediciValue:PropTypes.array,
		clinilValue:PropTypes.array
	};
 	constructor(props) {
    super(props);
    this.state={


    }
    this.static={

    }
  }
  componentDidMount(){

  }
  componentWillReceiveProps(nextProps){
  
  }
  render() {
  	let clinilValue = "";
  	let mediciValue = ""
  	this.props.clinilValue.map(item=>clinilValue+=item.check_name+",");
  	this.props.mediciValue.map(item=>mediciValue+=item.check_name+",");
    return (
      <div style={{"fontSize":"14px",
	"width": "559px",
	"height": "793px",
	"padding": "10px"}}>
      	<div style={{"textAlign": "center"}}><h2>{getUser().shop_name}</h2></div>
      	<div style={{"textAlign": "center",
		"marginTop": "5px",
		"marginBottom":"10px"}}><h3>病历</h3></div>
      	<hr/>
      	<div style={{"marginTop": "10px"}}>
  				<div style={{"display":"inline-block","width":"33%"}}>
  					<span style={{"marginRight": "10px"}}>就诊时间:</span>
  					<span >{convertTimeToStr(new Date(),"yyyy-MM-dd")}</span>
  				</div>
  				<div style={{"display":"inline-block","width":"30%"}}>
  					<span style={{"marginRight": "10px"}}>诊疗号:</span>
  					<span ></span>
  				</div>
  				<div style={{"display":"inline-block","width":"20%"}}>
  					<span style={{"marginRight": "10px"}}>挂号号:</span>
  					<span >{getUser().deal_id}</span>
  				</div>
  			</div>
  			<div style={{"marginTop": "10px"}}>
  				<div style={{"display":"inline-block","width":"33%"}}>
	  				<span style={{"marginRight": "10px"}}>姓名:</span>
	  				<span >{getUser().patient_name}</span>
  				</div>
  				<div style={{"display":"inline-block","width":"30%"}}>
	  				<span style={{"marginRight": "10px"}}>性别:</span>
	  				<span >{convertGender(getUser().patient_sex)}</span>
  				</div>
  				<div style={{"display":"inline-block","width":"20%"}}>
	  				<span style={{"marginRight": "10px"}}>年龄:</span>
	  				<span >{getUser().patient_age}</span>
  				</div>
  			</div>
  			<div style={{"marginTop": "10px","marginBottom":"10px"}}>
  				<span style={{"marginRight": "10px"}}>住址/电话</span>
  				<span>{getUser().reservation_phone}</span>
  			</div>
  			<hr/>
  			<div style={{"marginTop": "10px"}}>
  				<span style={{"marginRight": "10px"}}>主诉:</span>
      		<span>{this.props.complaint}</span>
  			</div>
  			<div style={{"marginTop": "15px"}}>现病史:</div>
  			<div style={{"marginRight": "10px","marginTop": "5px"}}>{this.props.now_his}</div>
  			<div style={{"marginTop": "10px"}}>
  				<span style={{"marginRight": "10px"}}>过敏史:</span>
  				<span>{this.props.all_his}</span>
  			</div>
  			<div>{
  				this.props.medical.includes("既往史")?(
  					<div style={{"marginTop": "15px"}}>
		  				<span style={{"marginRight": "10px"}}>既往史:</span>
		  				<span>{this.props.past_his}</span>
		  			</div>
  				):""
  			}</div>
  			<div>
  			{
  				this.props.medical.includes("家族史")?(
  					<div style={{"marginTop": "15px"}}>
		  				<span style={{"marginRight": "10px"}}>家族史:</span>
		  				<span>{this.props.family_his}</span>
		  			</div>
  				):""
  			}
  			</div>
  			<div>
  			{
  				this.props.medical.includes("经带待产史")?(
  					<div style={{"marginTop": "15px"}}>
		  				<span style={{"marginRight": "10px"}}>经带待产史:</span>
		  				<span style={{"marginRight": "10px"}}>{this.props.is_menopause == '1'?"已绝经":this.props.is_menopause == '2'?"无生育要求":this.props.is_menopause == '3'?"有生育要求":""}</span>
		  				<span style={{"marginRight": "10px"}}>备注:{this.props.bear_his}</span>
		  			</div>
  				):""
  			}
  			</div>
  			<div>{
  				this.props.medical.includes("体格检查")?(
  					<div style={{"marginTop": "15px"}}>
		  				<span style={{"marginRight": "3px"}}>体格检查:</span>
		  				<span style={{"marginRight": "3px"}}>T{this.props.temperature}℃,</span>
		  				<span style={{"marginRight": "3px"}}>P{this.props.p_per}次/分,</span>
		  				<span style={{"marginRight": "3px"}}>R{this.props.r_per}次/分,</span>
		  				<span style={{"marginRight": "3px"}}>BP{this.props.bp_up}/{this.props.bp_down}m,</span>
		  				<span style={{"marginRight": "3px"}}>舌质{this.props.tongue_name},</span>
		  				<span style={{"marginRight": "3px"}}>舌苔{this.props.tongue_coat_name},</span>
		  				<span style={{"marginRight": "3px"}}>脉象{this.props.pluse_name},</span>
		  				<span style={{"marginRight": "3px"}}>{this.props.physique_check}</span>
		  			</div>
  				):""
  			}</div>
  			<div>{
  					this.props.medical.includes("辅助检查")?(
  						<div style={{"marginTop": "15px"}}>
			  				<span style={{"marginRight": "10px"}}>辅助检查:</span>
			  				<span>{this.props.other_check}</span>
			  			</div>
  					):""
  			}</div>

  			<div style={{"marginTop": "15px"}}>初步诊断:</div>
  			<div style={{"marginTop": "5px"}}>
  				<span style={{"marginRight": "10px"}}>中医诊断:</span>
  				<span>{clinilValue}</span>
  			</div>
  			<div>
  				<span style={{"marginRight": "10px"}}>西医诊断:</span>
  				<span>{mediciValue}</span>
  			</div>
  			<div style={{"marginTop": "15px"}}>
  				<div style={{"marginRight": "10px"}}>处理:</div>
  				<div style={{"marginTop": "5px"}}>{this.props.process}</div>
  			</div>
  			<div style={{"float": "right","marginTop": "20px","marginRight":"149px"}}>
  				<span>医师:</span>
  				<span>{getUser().doctor_name}</span>
  			</div>
      </div>
    )
  }
}
