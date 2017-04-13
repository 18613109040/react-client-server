import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {Menu,Tag,Button,Tabs,Row,Col } from 'antd';
import CommentList from './file/CommentList';
import MedicalRecord from '../containers/MedicalRecord';
import PatientInfoItem from '../components/PatientInfoItem';
import PatientConsultHistory from './file/PatientConsultHistory';
import PatientFileBaseInfo from '../components/file/PatientFileBaseInfo';
import {fetchFileInfo} from '../store/actions/Files';
import {getUser} from '../utils/User';
import {getAgeByBirthday} from '../utils/tools';

const TabPane = Tabs.TabPane;
class PatientInformation extends Component {
  constructor(props){
    super(props);
    this.state={
			loading:false
    }
    const {userId, patientId} = this.props.location.query;
    this.queryParams = {
      user_id : userId,
      patient_id : patientId,
      doctor_id : ''
    };
    this.onBackClcik = this.onBackClcik.bind(this);
  }
  componentDidMount(){
  	const { pathname } = this.props.location;
    const {userId, patientId} = this.props.location.query;
    const doctorId = getUser().doctor_id;
    //  获取患者档案信息
    this.props.dispatch(fetchFileInfo({
      user_id : userId,
      patient_id : patientId,
      doctor_id : doctorId
    }, (json)=>{}));
  }
  onBackClcik(){
    this.context.router.goBack();
  }
  render(){

    const {fileInfo,medicalRecordInfo} = this.props;
    const { pathname } = this.props.location;
    const {userId, patientId} = this.props.location.query;
    if (!fileInfo||fileInfo&&!fileInfo.patient_id) {
      return (<div></div>)
    }

    return(
      <div className="patientInfomation">
       	<div className="info">
          <Row type="flex" justify="center" align="middle">
            <Col span={18}>
              <PatientInfoItem
                id={fileInfo.patient_id}
                age={`${getAgeByBirthday(fileInfo.birth)}`}
                sex={`${fileInfo.sex}`}
                name={fileInfo.name}
                diagnose={`${fileInfo.treat_num>1?0x0:0x800}`}
              />
            </Col>
            <Col span={6}>
              <div className="back">
                <Button onClick={this.onBackClcik}>返回</Button>
              </div>
            </Col>
          </Row>
       	</div>
        <div className="component card-container body">
          <Tabs type="card">
            <TabPane tab="患者信息" key="1">
              <PatientFileBaseInfo fileInfo={fileInfo}/>
            </TabPane>
            <TabPane tab="诊疗记录" key="2">
              <MedicalRecord {...this.props}/>
            </TabPane>
            <TabPane tab="咨询记录" key="3">
              <PatientConsultHistory {...this.props}/>
            </TabPane>
            <TabPane tab="评价记录" key="4">
              <CommentList {...this.props}/>
            </TabPane>
          </Tabs>
        </div>
       	{/*
          <div>
       		 {this.props.children}
       	  </div>
        */}
      </div>
    );
  }
}
PatientInformation.contextTypes={
  router: React.PropTypes.object.isRequired
};
function mapStateToProps(state){
  return {
    fileInfo : state.fileInfo.data
  }
}
export default connect(mapStateToProps)(PatientInformation)
