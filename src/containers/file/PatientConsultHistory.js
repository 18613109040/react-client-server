//患者咨询记录
import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import { Table, Button} from 'antd';
import {fetchPatientConsultHistory} from '../../store/actions/Consult';
import {getUser} from "../../utils/User";
import {convertGender, convertTimeToStr} from '../../utils/tools';

class PatientConsultHistory extends Component {
  constructor(props){
    super(props);
    const {userId, recordId} = this.props.location.query;
    this.msgStatus = {
      1:'未回复',
      2:'问诊中',
      3:'已完成',
      4:'自动结束'
    }
    this.static = {
      columns : [
        {title:'时间',dataIndex:'last_time',render:(text,record)=>{return convertTimeToStr(text)}},
        {title:'内容',dataIndex:'last_message'},
        {title:'状态',dataIndex:'message_status',render:(text)=>{return this.msgStatus[text]}}
      ]
    };
    this.queryParams = {
      page_no : 1,
      page_size : 10,
      patient_id : recordId,
      user_id : userId,
      role_id : '',
      role : 2
    }
    this.onRowClick = this.onRowClick.bind(this);
    this.nextPage = this.nextPage.bind(this);
  }
  componentDidMount(){
    //  获取用户信息
    this.queryParams.role_id = getUser().doctor_id;
    //  拉取患者的就诊记录
    this.props.dispatch(fetchPatientConsultHistory(this.queryParams,(json)=>{}));
  }
  onRowClick(record){
    this.context.router.push(`/chatcenter?room_id=${record.id}&flage=Consulting`)
  }
  nextPage(){
    this.queryParams.page_no = this.queryParams.page_no+1;
    //  拉取患者的就诊记录
    this.props.dispatch(fetchPatientConsultHistory(this.queryParams,(json)=>{}));
  }
  //----------------------------------------------------------------------------

  render(){
    const {data,current_page,total} = this.props.patientConsultHistory;
    return (
      <div className="patient-consult-history">
        <Table
          onRowClick={this.onRowClick}
          columns={this.static.columns}
          onChange={this.nextPage}
          dataSource={data}
          size="middle"
        />
      </div>
    )
  }
}

function mapStateToProps(state){
  return {
    patientConsultHistory : state.consultList
  }
}
PatientConsultHistory.contextTypes={
 router  : React.PropTypes.object.isRequired
};
export default connect(mapStateToProps)(PatientConsultHistory);
