//个人设置
import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {Input,Table,Tabs,Row,Col,Button,Form,Modal,Pagination} from 'antd';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
import {getFeedbackList,postFeedbackSubmit} from '../store/actions/Tickling';
import {getUser} from "../utils/User";
import {convertTimeToStr} from "../utils/tools";


class Tickling extends Component {
  constructor(props){
    super(props);
    this.state={
      textareaValue:'',
      pagination:{
        pageSize:10,
        current:1,
      },
      loading: false,
    }
  }
  //服务器端和客户端都只调用一次，在初始化渲染执行之前立刻调用。如果在这个方法内调用 setState，render() 将会感知到更新后的 state，将会执行仅一次，尽管 state 改变了。
  componentWillMount(){}

  //在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）。在生命周期中的这个时间点，组件拥有一个 DOM 展现，你可以通过 this.getDOMNode() 来获取相应 DOM 节点。
  componentDidMount(){
    const data = {
      page_no:1,
      page_size:this.state.pagination.pageSize,
      role:2,
      user_id:getUser().user_id,
    }
    this.feelbackFetch(data);
  }
  feelbackFetch(data={}){
    this.setState({ loading: true });
    this.props.dispatch(getFeedbackList(data,(json)=>{
      const pagination = this.state.pagination;
      pagination.total = json.data.total;
      this.setState({
        loading: false,
        pagination,
      });
    }));
  }
  handleTableChange(current, pageSize) {
   const pager = this.state.pagination;
   pager.current = current;
   pager.pageSize = pageSize;
   this.setState({
     pagination: pager,
   });
   this.feelbackFetch({
     page_size: pageSize,
     page_no: current,
     role:2,
     user_id:getUser().user_id,
   });
 }
 handleTableChangePage(page){
   const pager = this.state.pagination;
   pager.current = page;
   this.setState({
     pagination: pager,
   });
   this.feelbackFetch({
     page_size: this.state.pagination.pageSize,
     page_no: page,
     role:2,
     user_id:getUser().user_id,
   });
 }
  feelback(){
    return (
      <Form>
        <FormItem
          validateStatus={this.state.textareaValue.length<501?"success":"error"}
          help={this.state.textareaValue.length<501?"":"您输入的意见不能超过500个字"}
        >
          <span className="textarea-span">{this.state.textareaValue.length}/500</span>
          <Input
            type="textarea"
            placeholder="请输入您宝贵的意见"
            rows={6}
            maxLength="501"
            onChange={this.textareaChange}
            value={this.state.textareaValue}
          />
        </FormItem>
        <Row className="feelback-button-center buttom-set">
          <Button className="f-button-submit button-green" onClick={this.submit.bind(this)}>提交</Button>
          <Button className="f-button-reset button-red" onClick={this.resetTextarea.bind(this)}>重置</Button>
          <span className="span-right">如需联系客服，请拨打：400-626-7777</span>
        </Row>
      </Form>
    )
  }
  textareaChange = (e) => {
    this.setState({ textareaValue: e.target.value });
  }
  submit(){
    const data = {
      content:this.state.textareaValue,
      mobile:getUser().doctor_phone,
      role:"2",//1用户 2医生 4医助 8运营 16系统
      user_id:getUser().user_id,
    }
    this.props.dispatch(postFeedbackSubmit(data,(json)=>{
      if(json.status == '0'){
        Modal.success({
          title: '您的内容已提交成功，我们会尽快回复您，感谢您的反馈！',
        });
        this.setState({ textareaValue: "" });
        const pager = this.state.pagination;
        pager.current = 1;
        this.setState({
          pagination: pager,
        });
        const data = {
          page_no:1,
          page_size:this.state.pagination.pageSize,
          role:2,
          user_id:getUser().user_id,
        }
        this.feelbackFetch(data);
      }else{
        Modal.error({
          title: json.message,
        });
      }
    }))
  }
  resetTextarea(){
    this.setState({ textareaValue: "" });
  }
  feelbackHistory(){
    const data = [];
    const {feedbackList} = this.props;
    const columns = [{
      title: '历史反馈:',
      dataIndex: 'name',
      key: 'name',
      render: (text,record,index) => this.tableCell(text,record,index),
    }]
    return (
      <div className="f-margin-top">
        <Table
          rowKey={(record,index) => index}
          columns={columns}
          dataSource={feedbackList.data.list}
          pagination={false}
          loading={this.state.loading}
          >
        </Table>
        <div style={{"float": "right"}}>
          <Pagination  showSizeChanger onChange={this.handleTableChangePage.bind(this)} onShowSizeChange={this.handleTableChange.bind(this)} current={+(this.state.pagination.current)} total={+(feedbackList.data.total)} pageSizeOptions={['10', '20', '30', '40']} />
        </div>

      </div>
    )
  }
  tableCell(text,record,index){
    let list = [];
    for (let i = 0; i < record.msgs.length; i++) {
      if(record.msgs[i].type == 1){
        list.push((
          <Row key={index + "-" + i}>
          <Col span={21}>{record.msgs[i].content}</Col>
          <Col span={3} style={{"textAlign":"right"}}>{convertTimeToStr(record.msgs[i].created_at*1000,'yyyy-MM-dd hh:mm:ss')}</Col>
          </Row>))
      }else{
        list.push((
          <Row key={index + "-2" + i} className="feelback-answer">
          {record.msgs[i].content}
          </Row>))
      }
    }
    return (
      <div>
        {list}
      </div>
    )
  }
  render(){
    return(
      <div className="tickling">
        <Tabs
          type="card"
          defaultActiveKey="1">
          <TabPane tab="意见反馈" key="1">
            {this.feelback()}
            {this.feelbackHistory()}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

Tickling = Form.create({})(Tickling);

Tickling.contextTypes={
  router: React.PropTypes.object.isRequired
};

Tickling.propTypes = {
  feedbackList:React.PropTypes.object.isRequired
};
function mapStateToProps(state){
  return {
    feedbackList:state.feedbackList
  }
}

export default connect(mapStateToProps)(Tickling)
