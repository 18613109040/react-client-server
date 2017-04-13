/**
 * Created by Administrator on 2016/9/13.
 */
import React, {Component, PropTypes}  from "react";
import {Row,Col } from 'antd';
import {getUser} from "../../utils/User";
import {convertGender,convertTimeToStr} from "../../utils/tools";
const RecipeHeader = ({params})=>{
  return(
    <div>
    <div style={{"textAlign": "center"}}><h2>{getUser().shop_name}</h2></div>
      <div style={{display:'flex'}}>
        
        <div style={{flex:'1','textAlign': 'center'}}>
          <h2></h2>
          <h3>病历处理</h3>
        </div>
      </div>
      <div style={{display:'flex'}}>
        <div style={{width:'100px'}}>
          费别:{getUser().fee_discount_type}
        </div>
      </div>
    </div>
  )
}

const RecipePatientInfo = ({zxDiagnose})=>{

  return(
    <div>
      <div style={{"display":"flex",'padding': '0 0 5px 5px'}}>
        <div style={{"flex":"1"}}>姓名：{getUser().patient_name}</div>
        <div style={{"flex":"1"}}>性别：{convertGender(getUser().patient_sex)}</div>
        <div style={{"flex":"1"}}>年龄：{getUser().patient_age}</div>
      </div>
      <div style={{"display":"flex",'padding': '0 0 5px 5px'}}>
        <div style={{"flex":"1"}}>门诊号：{getUser().deal_id}</div>
        <div style={{"flex":"1"}}>科别：{getUser().department_name}</div>
      </div>
      <div style={{"display":"flex",'padding': '0 0 5px 5px'}}>
        <div style={{"flex":"1"}}>临床诊断：</div>
        <div style={{"flex":"1"}}>开具日期：{convertTimeToStr(new Date(),"yyyy-MM-dd hh:mm")}</div>
      </div>
      <div style={{"display":"flex",'padding': '0 0 5px 5px'}}>
        住址/电话：{getUser().reservation_phone}
      </div>
    </div>
  )
}

const RecipeListInfo = ({checkRecipeList})=>{
  return(
    <div style={{padding:'0 0 0 5px'}}>
      <div>
        <h4>检验检查:</h4>
      </div>
      <div style={{"display": "inline-block","width": "60%"}}>项目名称</div><div style={{"display": "inline-block","width": "20%"}}>数量</div>
      <hr style={{'height':'1px','border':'none','borderTop':'1px dashed'}} />
     	{
				checkRecipeList.map((item)=>(
					<div><div style={{"display": "inline-block","width": "60%"}}>{item.item_name}</div><div style={{"display": "inline-block","width": "20%"}}>{item.no}</div></div>
				))
     	}
    </div>
  )
}

const RecipeDoctorInfo = ({checkRecipeList})=>{
	let price_all = 0 ;
	for(let j=0;j<checkRecipeList.length;j++){
		let total_price = parseInt(checkRecipeList[j].no) * parseInt(checkRecipeList[j].item_price)
		price_all += total_price;

	}
  return(
    <div style={{"position": "absolute","bottom": "40px","width": "539px"}}>
      <div style={{"display":"flex",'padding': '0 0 5px 5px'}}>
        <div style={{"flex":"1"}}>医师：{getUser().doctor_name}</div>
        <div style={{"flex":"1"}}>工号：{getUser().user_id}</div>
        <div style={{"flex":"1"}}>药品金额：{price_all/10000}</div>
      </div>
      
    </div>
  )
}


export default class CheckPrint extends Component {
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
    
    return (
      <div style={{"fontSize":"14px", "width": "559px", "height": "793px", "padding": "10px"}}>
        <RecipeHeader />
        <hr/>
        <RecipePatientInfo />
        <hr/>
        <hr/>
          <RecipeListInfo checkRecipeList={this.props.checkRecipeList}/>
        <hr/>
        <RecipeDoctorInfo checkRecipeList={this.props.checkRecipeList}/>
        <hr/>
      </div>
    )
  }
}
