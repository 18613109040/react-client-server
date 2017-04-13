//诊疗记录
import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {Icon ,Button ,Input ,Tabs,Row,Col,Modal,message} from 'antd';
import CaseInfo from "../components/CaseInfo";
import PrescribingInfo from "../components/PrescribingInfo";
import MedicalList from "../components/MedicalList";
import {getUser} from '../utils/User';
import {medicrecordDetail,fetchDealList} from "../store/actions/CiteManage";
import {getRecipelist,getRecipeDetail,changeReciptState} from "../store/actions/Medicine";
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
class MedicalRecord extends Component {
  constructor(props){
    super(props);
    this.static = {
      errorMsg : {
        title : '错误',
        content : ''
      },
      doctor_id : '',
      doctor_name : ''
    }
    this.params={
      compose:0,
      isHidden:'0',
    };
    this.state = {
      medicrecordDetail : {}, //病历详细
      recipeDetail : {},     //处方详细
      recipeList : []       //处方列表
    }
    this.onLoad = this.onLoad.bind(this);
    this.showError = this.showError.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);
    this.fetchRecipeDetail = this.fetchRecipeDetail.bind(this);
    this.fetchMedicalRecordDetail = this.fetchMedicalRecordDetail.bind(this);
  }
  //服务器端和客户端都只调用一次，在初始化渲染执行之前立刻调用。如果在这个方法内调用 setState，render() 将会感知到更新后的 state，将会执行仅一次，尽管 state 改变了。
  componentWillMount(){

  }

  //在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）。在生命周期中的这个时间点，组件拥有一个 DOM 展现，你可以通过 this.getDOMNode() 来获取相应 DOM 节点。
  componentDidMount(){
    this.static.doctor_id = getUser().doctor_id;
    this.static.doctor_name = getUser().doctor_name;
  }
  //  获取病历详细
  fetchMedicalRecordDetail(data){
    const {deal_id,clinic_id,patient_id} = data;
    this.props.dispatch(medicrecordDetail({deal_id,clinic_id,patient_id},(json)=>{
      if (json.status!='0'){
        this.showError(json.message);
        return
      }
      this.setState({medicrecordDetail:json.data[0]});
    }))
  }
  //  获取处方列表
  fetchRecipeList(data){
    const {clinic_id,user_id,deal_id,deal_create_time} = data;
    const params = {user_id,registration_deal_id:deal_id,query_type:1,compose:this.params.compose,recipe_source:'3'};
    this.setState({recipeList:[]});
    this.props.dispatch(getRecipelist(params,(json)=>{
      if(parseInt(json.status)!=0){
        this.showError(json.message);
        return
      }
      if (json.total_num<1){
        this.setState({recipeList:[]});
      }else {
        this.fetchRecipeDetail(json.data.recipes[0],deal_create_time);
        this.setState({recipeList:json.data.recipes});
      }
      this.setState({recipeDetail:{items:[]}});
    }));
  }
  //  获取处方详细
  fetchRecipeDetail(data,creatTime){
    const {cloud_recipe_id,user_id} = data;
    const params = {cloud_recipe_id,user_id,compose:this.params.compose,recipe_source:'3'};
    this.props.dispatch(getRecipeDetail(params,(json)=>{
      if (json.status!='0'&&json.status!='14'){
        this.showError(json.message);
        return
      }
      this.setState({recipeDetail:json.data||{items:[]}});
    }));
  }
  deleteRecipe(record){
    const {cloud_recipe_id,his_recipe_id} = record;
    const {doctor_id,doctor_name} = this.static;
    const dispatch = this.props.dispatch;
    const error = this.showError;
    confirm({
      title : '确认废改?',
      content : '是否报废改处方单',
      onOk(){
        dispatch(changeReciptState({cloud_recipe_id,operator_id:doctor_id,operator_desc:doctor_name,recipe_state:'11',check_notes:'报废',is_ship:'0',process_type:'0'},(json)=>{
          if (json.status!='0'){
            error(json.message);
            return
          }
          message.success('操作成功')
        }))
      },
      onCancel(){}
    })
  }
  //就诊列表数据加载完成之后，获取本次就诊的病历信息和处方信息
  onLoad(data){
    const d = new Date();
    if(new Date(data.deal_create_time*1000).getTime()>new Date(`${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()} 00:00:00`).getTime()){
      this.params.compose=0;
      this.params.isHidden='0';
    }else {
      this.params.compose=1;
      this.params.isHidden='1';
    }
    //  获取病历信息
    this.fetchMedicalRecordDetail(data);
    //  获取处方列表
    this.fetchRecipeList(data);
    // //  获取处方详细
    // this.fetchRecipeDetail(data);
  }
  //  显示错误信息的弹框
  showError(errorMsg){
    this.static.errorMsg.content = errorMsg;
    Modal.error(this.static.errorMsg);
  }

  render(){
    const {patientId,userId,phone} = this.props.location.query;
    const {medicrecordDetail,recipeDetail,recipeList} = this.state;
    return(
      <div className="medicalRecord">
      	<div className="medtabls">
          <Row type="flex" justify="start">
            <Col span={18}>
              <Tabs>
                <TabPane tab={<span>病历</span>} key="1">
                  <CaseInfo data={medicrecordDetail}/>
                </TabPane>
                <TabPane tab={<span>处方信息</span>} key="2">
                  <PrescribingInfo
                   data={recipeList}
                   childData={recipeDetail}
                   onClickRow={this.fetchRecipeDetail}
                   onAbrogate={this.deleteRecipe}
                   isHidden={this.params.isHidden}
                  />
                </TabPane>
              </Tabs>
            </Col>
            <Col span={6}>
              <div className="med-list">
                <MedicalList
                  patientId={patientId}
                  userId={phone}
                  onLoad={this.onLoad}
                  onClickRow={this.onLoad}
                  doctor_id_flage={true}
                  clinic_id={true}
                />
              </div>
            </Col>
          </Row>
			  </div>
      </div>
    );
  }
}

MedicalRecord.contextTypes={
  router: React.PropTypes.object.isRequired
};
MedicalRecord.propTypes = {
};
function mapStateToProps(state){
  return {
    // dealList : state.dealList,
    // recipelist : state.recipelist.data?state.recipelist.data.recipes : []
  }
}

export default connect(mapStateToProps)(MedicalRecord)
