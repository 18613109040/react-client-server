/**
 * Created by Administrator on 2016/9/13.
 */
import React, {Component, PropTypes}  from "react";
import {Row,Col } from 'antd';
import {getUser} from "../../utils/User";
import {convertGender,convertTimeToStr} from "../../utils/tools";



export default class PrintAll extends Component {
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
		// temperature:PropTypes.number,
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
		clinilValue:PropTypes.array,
    prescriptionInfo:PropTypes.object,
    zXPrescriptionInfo:PropTypes.object,
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
  	/*console.dir(nextProps)
  	if(this.props.flage !== nextProps.flage){

  	}*/
  }
  //中药打印
  recipeListInfo(recipe,index){
    if(!recipe||!recipe.recipelist||!!recipe.recipelist&&recipe.recipelist.length==1){
      return (<div></div>);
    }
    recipe.recipelist = recipe.recipelist.filter(item=>/^01/.test(item.item_code));
    const itemDiv = (item,index)=>{
      return (
        <div key={index} style={{'display': 'inline-block','width': 100/3+"%",}}>
          {item.item_name}
          {/* {item.item_amount} {item.item_unit} */}
        </div>
      )
    }
    return(
      <div style={{padding:'10px 0 0 0'}} key={index}>
        <div style={{fontWeight:'bold'}}>中药处方{index+1}：</div>
        {recipe.recipelist.map((item,i)=>itemDiv(item,i))}
        <div>
          {recipe.usage_desc}{" "}
          共{recipe.quantity}剂{" "}
          每日{recipe.usage_amount_desc}剂 {" "}
          {recipe.taking_desc}{" "}
          {recipe.process_desc}{" "}
        </div>
        <div>
          {recipe.achievements_type==1?"医生处方关联："+recipe.achievements_name:""}
          {recipe.achievements_type==2?"贵细处方关联："+recipe.achievements_name:""}
          {recipe.achievements_type==3?"患者处方关联":""}
        </div>
        <hr/>
      </div>
    )
  }
  //西药打印
  recipeListInfoTwo(recipe,index){
    if(!recipe||!recipe.recipelist||!!recipe.recipelist&&recipe.recipelist.length==1){
      return (<div></div>);
    }
    recipe.recipelist = recipe.recipelist.filter(item=>!!item.item_name);
    const itemDiv = (item,i)=>{
      return (
        <div key={i}>
          <div style={{"display":"flex",'padding': '0 0 5px 5px',textAlign:'center'}}>
            <div style={{"flex":"2",textAlign:'left'}}>{item.item_name}[{item.wst_spec}]</div>
            <div style={{"flex":"3"}}>
              {item.item_amount+item.wst_taking_unit} {"/  "}
              {item.wst_taking_times}  {"/  "}
              {item.wst_taking_days}天 {"/  "}
              {item.usage_desc}
            </div>
            <div style={{"flex":"1"}}>{item.total_amount+item.item_unit}</div>
          </div>
        </div>
      )
    }
    return (
      <div style={{padding:'10px 0 0 0'}} key={index}>
        <div style={{fontWeight:'bold'}}>西药处方{index+1}：</div>
        {/* ,'borderBottom': '1px solid #e9e9e9' */}
        <div style={{"display":"flex",'padding': '0 0 5px 5px',textAlign:'center'}}>
          <div style={{"flex":"2",textAlign:'left'}}>名称[规格]</div>
          <div style={{"flex":"3"}}>详细用法</div>
          <div style={{"flex":"1"}}>总量</div>
        </div>
        <hr style={{'marginTop': '-5px','height':'1px','border':'none','borderTop':'1px dashed'}} />
        {recipe.recipelist.map((item,i)=>itemDiv(item,i))}
        <div>
          {recipe.achievements_type==1?"医生处方关联："+recipe.achievements_name:""}
          {recipe.achievements_type==2?"贵细处方关联："+recipe.achievements_name:""}
          {recipe.achievements_type==3?"患者处方关联":""}
        </div>
        <hr/>
      </div>
    )
  }
  recipeListInfojc(treatmentTemData,index){
    let list = [];
    list = treatmentTemData.data.filter(item=>item.check);
    if(list.length<=1){
      return (<div></div>);
    }
    return(
      <div style={{padding:'10px 0 0 0'}}>
        <div style={{fontWeight:'bold'}}>检验检查{index+1}：</div>
        {/* <div style={{"display": "inline-block","width": "50%"}}>项目名称</div><div style={{"display": "inline-block","width": "10%"}}>数量</div><div style={{"display": "inline-block","width": "30%"}}>备注</div>
        <hr style={{'height':'1px','border':'none','borderTop':'1px dashed'}} /> */}
        <div style={{"display": "inline-block","width": "60%"}}>项目名称</div><div style={{"display": "inline-block","width": "20%"}}>数量</div>
        <hr style={{'height':'1px','border':'none','borderTop':'1px dashed'}} />
       	{
  				list.map((item,index)=>(
  					<div key={index}>
              <div><div style={{"display": "inline-block","width": "60%"}}>{item.item_name}</div><div style={{"display": "inline-block","width": "20%"}}>{item.no}</div></div>
  						{/* <div style={{"display": "inline-block","width": "50%"}}>{item.item_name}</div>
  						<div style={{"display": "inline-block","width": "10%"}}>{item.min_unit}</div>
  						<div style={{"display": "inline-block","width": "30%"}}>{`穴位:${item.acupoint_name1},${item.acupoint_name2},${item.acupoint_name3},穴位方:${item.acupoint_name4}`}</div> */}
  					</div>
  				))
       	}
        <hr/>
      </div>
    )
  }
  recipeListInfozlll(treatmentTemData){
    if(!treatmentTemData||!!treatmentTemData&&treatmentTemData.length==1){
      return (<div></div>);
    }
    return(
      <div style={{padding:'10px 0 0 0'}}>
        <div style={{fontWeight:'bold'}}>治疗理疗：</div>
        <div style={{"display": "inline-block","width": "50%"}}>项目名称</div><div style={{"display": "inline-block","width": "10%"}}>数量</div><div style={{"display": "inline-block","width": "30%"}}>备注</div>
        <hr style={{'height':'1px','border':'none','borderTop':'1px dashed'}} />
        {
          treatmentTemData.map((item,index)=>{
            if(!item.item_name){
              return (<div key={index}></div>);
            }
            return (
              <div key={index}>
                <div style={{"display": "inline-block","width": "50%"}}>{item.item_name}</div>
                <div style={{"display": "inline-block","width": "10%"}}>{item.min_unit}</div>
                <div style={{"display": "inline-block","width": "30%"}}>{`穴位:${item.acupoint_name1},${item.acupoint_name2},${item.acupoint_name3},穴位方:${item.acupoint_name4}`}</div>
              </div>
            )
          })
        }
        <hr/>
      </div>
    )
  }
  render() {
    const {prescriptionInfo,zXPrescriptionInfo,checkRecipeList,treatmentTemData} = this.props;
  	let clinilValue = "";
  	let mediciValue = ""
  	this.props.medic_check.map(item=>{
      if(item.check_type==1){
        clinilValue+=item.check_name+","
      }
    });
    this.props.medic_check.map(item=>{
      if(item.check_type==2){
        mediciValue+=item.check_name+","
      }
    });

    //中药
    let zyRecipe = [];
    for (let variable in prescriptionInfo) {
      zyRecipe.push({
        process_desc:prescriptionInfo[variable].process_desc,
        quantity:prescriptionInfo[variable].quantity,
        usage_amount_desc:prescriptionInfo[variable].usage_amount_desc,
        usage_desc:prescriptionInfo[variable].usage_desc,
        taking_desc:prescriptionInfo[variable].taking_desc,
        recipelist:[...prescriptionInfo[variable].items],
        achievements_name:prescriptionInfo[variable].achievements_name,
        achievements_type:prescriptionInfo[variable].achievements_type,
      })
    }
    //西药
    let zxRecipe = [];
    for (let variable in zXPrescriptionInfo) {
      zxRecipe.push({
        process_desc:zXPrescriptionInfo[variable].process_desc,
        quantity:zXPrescriptionInfo[variable].quantity,
        usage_amount_desc:zXPrescriptionInfo[variable].usage_amount_desc,
        usage_desc:zXPrescriptionInfo[variable].usage_desc,
        taking_desc:zXPrescriptionInfo[variable].taking_desc,
        recipelist:[...zXPrescriptionInfo[variable].items],
        achievements_name:zXPrescriptionInfo[variable].achievements_name,
        achievements_type:zXPrescriptionInfo[variable].achievements_type,
      })
    }
    return (
      <div style={{"fontSize":"14px",
        "width": "100%",
      	// "width": "559px",
      	// "height": "793px",
      	"padding": "10px","paddingLeft": "0"}}
      >
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
        <hr/>
        <hr/>
        {/* 中药 */}
        {zyRecipe.map((recipe,index)=>(<div key={index}>{this.recipeListInfo(recipe,index)}</div>))}
        {/* 西药 */}
        {zxRecipe.map((recipe,index)=>(<div key={index}>{this.recipeListInfoTwo(recipe,index)}</div>))}
        {/* 检测检查 */}
        {checkRecipeList.map((recipe,index)=>(<div key={index}>{this.recipeListInfojc(recipe,index)}</div>))}
        <hr/>
        {/* 治疗理疗 */}
        {this.recipeListInfozlll(treatmentTemData)}
        <div style={{"float": "right","marginTop": "20px","marginRight":"149px"}}>
          <span>医师:</span>
          <span>{getUser().doctor_name}</span>
        </div>

      </div>
    )
  }
}
