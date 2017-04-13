/**
 * Created by Administrator on 2016/9/13.
 */
import React, {Component, PropTypes}  from "react";
import {Row,Col } from 'antd';
import {getUser} from "../../utils/User";
// import {convertGender,convertTimeToStr} from "../../utils/tools";
import {NoToChinese} from "../../utils/tools";
//
//
//
const RecipeHeader = ({params})=>{
  return(
    <div>
      <div style={{display:'flex'}}>
        {/* <div style={{width:'100px'}}>
          <img width='60' height='60' src={params.QRcode}/>
          <span style={{'float': 'right','lineHeight': '60px'}}>{params.recipe.processDesc}</span>
        </div> */}
        <div style={{flex:'1','textAlign': 'center'}}>
          <h2>{params.shopName}</h2>
          <h3>病历处理</h3>
        </div>
        {/* <div style={{width:'70px'}}>
          <div style={{border:'1px solid',textAlign:'center',"lineHeight":"40px"}}>
            {params.recipeTypeName}
          </div>
          <div style={{width:'70px',"fontSize":"12px","lineHeight":"20px"}}>
            取药号：{params.drugNumber}
          </div>
        </div> */}
      </div>
      <div style={{display:'flex'}}>
        <div style={{width:'100px'}}>
          费别:{params.recipeFeeType}
        </div>
        {/* <div style={{flex:'1'}}>
          医保卡号:{params.medicalCard}
        </div>
        <div style={{width:'150px',textAlign:'right'}}>
          处方编号:{params.recipeCard}
        </div> */}
      </div>
    </div>
  )
}

const RecipePatientInfo = ({patientInfo})=>{
  return(
    <div>
      <div style={{"display":"flex",'padding': '0 0 5px 5px'}}>
        <div style={{"flex":"1"}}>姓名：{patientInfo.name}</div>
        <div style={{"flex":"1"}}>性别：{patientInfo.sexName}</div>
        <div style={{"flex":"1"}}>年龄：{patientInfo.age}</div>
      </div>
      <div style={{"display":"flex",'padding': '0 0 5px 5px'}}>
        <div style={{"flex":"1"}}>门诊号：{patientInfo.outpatientNumber}</div>
        <div style={{"flex":"1"}}>
          {/* 科别：{patientInfo.category} */}
          电话：{patientInfo.phone}
        </div>
      </div>
      <div style={{"display":"flex",'padding': '0 0 5px 5px'}}>
        <div style={{"flex":"1"}}>临床诊断：{patientInfo.clinicalDiagnosis}</div>
        <div style={{"flex":"1"}}>开具日期：{patientInfo.printDate}</div>
      </div>
      {/* <div style={{"display":"flex",'padding': '0 0 5px 5px'}}>
        住址/电话：{patientInfo.address+patientInfo.address?patientInfo.address+patientInfo.address+" / ":""}{patientInfo.phone}
      </div> */}
    </div>
  )
}
const RecipeListInfoTwo = ({recipe,type})=>{
  recipe.recipelist = recipe.recipelist.filter(item=>!!item.item_name);
  const itemDiv = (item,index)=>{
    return (
      <div key={index}>
        <div style={{"display":"flex",'padding': '0 0 5px 5px'}}>
          <div style={{"flex":"1"}}>{index}){item.item_name}</div>
          <div style={{"flex":"1"}}>{item.wst_spec}</div>
        </div>
        <div style={{"textAlign":"center"}}>
          Sig：
          {item.item_amount+item.wst_taking_unit} {"  "}
          {item.usage_desc}  {"  "}
          {item.wst_taking_times}  {"  "}
          {item.wst_taking_days}天
        </div>
      </div>
    )
  }
  return (
    <div>
      <div>
        <h2>Rp</h2>
      </div>
      <div>
        {recipe.recipelist.map((item,index)=>itemDiv(item,index+1))}
      </div>
    </div>
  )
}

const RecipeListInfo = ({recipe,type})=>{
  recipe.recipelist = recipe.recipelist.filter(item=>/^01/.test(item.item_code));
  let styleRow = {
    'display': 'inline-block',
    'width': 100/2+"%",
  }
  const styleRowTwo = {
    'display': 'inline-block',
    'width': 100/3+"%",
  }
  if(recipe.recipelist.length>20){
    styleRow = styleRowTwo;
  }
  const itemDiv = (item,index)=>{
    return (
      <div key={index} style={styleRow}>
        {item.item_name} {item.item_amount} {item.item_unit}
      </div>
    )
  }
  return(
    <div style={{padding:'0 0 0 5px'}}>
      <div>
        <h2>Rp</h2>
      </div>
      <div>
        {recipe.recipelist.map((item,index)=>itemDiv(item,index))}
      </div>
      <hr style={{'height':'1px','border':'none','borderTop':'1px dashed'}} />
      <div style={{textAlign:'center'}}>
        共{NoToChinese(recipe.quantity)}剂{" "}
        每日{NoToChinese(recipe.usage_amount_desc)}剂 {" "}
        {recipe.usage_desc}{" "}
        {recipe.taking_desc}
      </div>
    </div>
  )
}

const RecipeDoctorInfo = ({doctorInfo,money})=>{
  return(
      <div style={{"float": "right","marginTop": "20px","marginRight":"149px"}}>
        <span>医师:</span>
        <span>{getUser().doctor_name}</span>
        {/* <div style={{"position":"absolute",'bottom':'40px',width:'539px'}}> */}
        {/* <div style={{"display":"flex",'padding': '0 0 5px 5px'}}>
          <div style={{"flex":"1"}}>医师：{doctorInfo.doctorName} {!!doctorInfo.achievementsName?" "+doctorInfo.achievementsName:""}</div>
          <div style={{"flex":"1"}}>工号：{doctorInfo.doctorId}</div>
          <div style={{"flex":"1"}}>药品金额：{money/10000}</div>
        </div> */}
        {/* <div style={{"display":"flex",'padding': '0 0 5px 5px'}}>
          <div style={{"flex":"1"}}>审核：</div>
          <div style={{"flex":"1"}}>调配：</div>
        </div>
        <div style={{"display":"flex",'padding': '0 0 5px 5px'}}>
          <div style={{"flex":"1"}}>核对：</div>
          <div style={{"flex":"1"}}>发药：</div>
        </div> */}
      {/* </div>*/}
    </div>
  )
}


export default class YinpianPrint extends Component {
 	static defaultProps={

	};
	static propTypes = {

	};
 	constructor(props) {
    super(props);

  }
  componentDidMount(){
  }
  componentWillReceiveProps(nextProps){

  }
  render(){
    const {printParams,type} = this.props;
    return (
      <div style={{"fontSize":"14px",
      //  "width": "559px",
        "width": "100%",
      //  "height": "793px",
       "padding": "10px 0"}}>
        <RecipeHeader params={printParams}/>
        <hr/>
        <RecipePatientInfo patientInfo={printParams.patientInfo}/>
        <hr/>
        <hr/>
        {type=="1"?
          (<RecipeListInfo recipe={printParams.recipe} type={type}/>):
          (<RecipeListInfoTwo recipe={printParams.recipe}/>)
        }
        <RecipeDoctorInfo doctorInfo={printParams.doctorInfo} money={printParams.money}/>
        <hr/>
      </div>
    )
  }
}
