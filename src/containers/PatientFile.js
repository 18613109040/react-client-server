//患者档案
import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {Breadcrumb, Icon ,Button ,DatePicker ,Input ,Pagination ,Table,Form} from 'antd';
import CustomizedForm from '../components/CustomizedForm';
import {fetchFileList} from '../store/actions/Files';
import {getUser} from '../utils/User';
import {convertGender, convertTimeToStr,getAgeByBirthday} from '../utils/tools';
const { RangePicker } = DatePicker;
const Search = Input.Search;
class PatieItem extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){

  }
  render(){
    const {id, name, sex, age, time, userId, phone, recordId} = this.props;
  	return(
  		<div className="patient">
        <div className="info-man">
        	<div className='img-man'>
        		<img src="//admin.gstzy.cn/data/upload/doctor/201603/25/56f4e1fc9e01c.png"/>
        	</div>
        	<div className="man-title">
        		<div className="title">
        			<span>{name}</span>
        			<span>{convertGender(sex)}</span>
        			<span>{age}岁</span>
        		</div>
        		<div className="time">{convertTimeToStr(time)}</div>
        	</div>
        </div>
        <div className="search-info"><Link to={`/patient?patientId=${id}&userId=${userId}&phone=${phone}&recordId=${recordId}`}>查看档案详情</Link></div>
      </div>
  	)
  }
}
PatieItem.propTypes = {
  id : PropTypes.string.isRequired,
  sex : PropTypes.string.isRequired,
  age : PropTypes.string.isRequired,
  name : PropTypes.string.isRequired,
  time : PropTypes.string.isRequired,
  phone : PropTypes.string.isRequired,
  userId : PropTypes.number.isRequired,
  recordId : PropTypes.string.isRequired,
}
class PatientFile extends Component {
  constructor(props){
    super(props);
    this.state={
    	current:1,
    	pagination:12,
    	loading:false,
    	type:true
    }
    this.queryParams = {
      page_no : 1,
      page_size : 10,
      doctor_id : ''
    };
    this.formData = {}
    this.static = {
      columns : [
        {title: '头像',dataIndex: 'keshi',render:(text, record) => (<span><img src="//admin.gstzy.cn/data/upload/doctor/201603/25/56f4e1fc9e01c.png" className="ant-img-style"/></span>)},
        {title: '姓名',dataIndex: 'name'},
        {title: '性别',dataIndex: 'sex',render:(text, record)=>{return <span>{convertGender(text)}</span>}},
        {title: '年龄',dataIndex: 'birth',render: (text, record) => (
				    <span>{getAgeByBirthday(text)}</span>
				  )},
        {title: '时间',dataIndex: 'last_treat_time',render:(text)=>{return convertTimeToStr(text)}},
        {title: '操作',render:(text, record) => (<Link to={`/patient?patientId=${record.patient_id}&userId=${record.user_id}&phone=${record.phone}&recordId=${record.record_id}`}>查看档案详情</Link>)}
      ]
    };
    this.onChange = this.onChange.bind(this);
    this.changeType = this.changeType.bind(this);
    this.searchFile = this.searchFile.bind(this);
    this.searchAllFile = this.searchAllFile.bind(this);
  }

  //服务器端和客户端都只调用一次，在初始化渲染执行之前立刻调用。如果在这个方法内调用 setState，render() 将会感知到更新后的 state，将会执行仅一次，尽管 state 改变了。
  componentWillMount(){}

  //在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）。在生命周期中的这个时间点，组件拥有一个 DOM 展现，你可以通过 this.getDOMNode() 来获取相应 DOM 节点。
  componentDidMount(){
    const user = getUser();
    this.queryParams.doctor_id = user.doctor_id;
    this.queryParams.shop_no = user.shop_no;
    this.fetchFileList(this.queryParams);
  }
  fetchFileList(params){
    if (!this.state.loading) {
      this.setState({loading:true});
    }
    this.props.dispatch(fetchFileList(params, (json)=>{
      this.setState({loading:false});
    }));
  }
  searchFile(formValues){
    this.formData = {};
    this.queryParams.page_no = 1;
    for (var p in formValues) {
      if (formValues[p]) {
        if (p=='date'&&formValues[p].length>1) {
          this.formData.start_treat_time = (new Date(formValues.date[0].format('YYYY/MM/DD')).getTime())/1000;
          this.formData.end_treat_time = (new Date(formValues.date[1].format('YYYY/MM/DD')).getTime())/1000+86400;
        }else {
          this.formData[p] = formValues[p];
        }
      }
    }
    this.fetchFileList({...this.queryParams,...this.formData});
  }
  searchAllFile(){
    this.refs.form.resetFields();
    this.formData = {};
    this.queryParams.page_no = 1;
    this.fetchFileList(this.queryParams);
  }
  //切换选项卡
  onChange(page) {
    this.queryParams.page_no = page;
    this.fetchFileList({...this.queryParams,...this.formData});
  }
  //  切换数据展示格式，true:列表展示，false:card展示
  changeType(){
  	this.setState({
      type: !this.state.type,
    });
  }
  //  不可用时间
  disabledDate(current){
    return current && current.valueOf() > Date.now();
  }
  //  渲染数据列表
  renderList(data){
    if (this.state.type) {
      return (
        <Table
          columns={this.static.columns}
          dataSource={data}
          pagination={false}
          loading={this.state.loading}
        />
      )
    }else {
      return data.map((item,index)=>{
        return (
          <div className="patie-item">
            <PatieItem
              id={item.patient_id}
              sex={item.sex}
              age={item.age}
              name={item.name}
              phone={item.phone}
              userId={item.user_id}
              recordId={item.record_id}
              time={item.last_treat_time}
            />
          </div>
        )
      })
    }
  }
  render(){
  	const {data, total_num, current_page} = this.props.fileList;
    const pageSize = this.queryParams.page_size;
    return(
      <div className="patientFile">
        <CustomizedForm onSubmit={this.searchFile} ref="form">
          <div>
            <Button type="primary" onClick={this.searchAllFile}>全部病人</Button>
          </div>
          <div label="就诊日期" name="date" rules={[{type:'array'}]}>
            <RangePicker format={'YYYY/MM/DD'} disabledDate={this.disabledDate}/>
          </div>
          <div label="病人姓名" name="name">
            <Search placeholder="病人姓名" />
          </div>
          <div label="手机号码" name="phone">
            <Search placeholder="病人手机号" />
          </div>
          <div label="诊疗卡号" name="card_no">
            <Search placeholder="诊疗卡号" />
          </div>
          <div>
            <Button type="primary" htmlType="submit">搜索</Button>
          </div>
          {/* <div style={{float:"right",fontSize:"1.5rem",lineHeight:"1.2rem"}}>
            <Icon onClick={this.changeType} type={this.state.type?"bars":"appstore-o"} ref='typeIcon'/>
          </div> */}
        </CustomizedForm>
        <div className="page-body">{this.renderList(data)}</div>
        <div className="page-bar">
          <Pagination
            onChange={this.onChange}
            defaultCurrent={this.queryParams.page_no}
            total={total_num}
            current={current_page}
            pageSize={pageSize}
          />
        </div>
      </div>
    );
  }
}

PatientFile.contextTypes={
  router: React.PropTypes.object.isRequired
};
function mapStateToProps(state){
  return {
    fileList : state.fileList,
    userInfo : state.userInfo
  }
}
export default connect(mapStateToProps)(PatientFile)
