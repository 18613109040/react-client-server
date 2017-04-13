//患者評價记录
import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {Table,Col,Row,Button,Rate,Modal,Pagination}  from 'antd';
import {fetchPatientCommentList,deleteCommentReply,createCommentReply} from '../../store/actions/Comments';
import {getUser} from "../../utils/User";
import {convertTimeToStr} from "../../utils/tools";

class CommentList extends Component {
  constructor(props){
    super(props);
    const {userId, recordId} = this.props.location.query;
    this.queryParams = {
      user_id : userId,
      page_no : 1,
      page_size : 10,
      paient_id : recordId,
      doctor_id : '',
    };
    this.static = {
      content : '',
      record : {},
      columns : [{dataIndex:'data',render:this.renderColumn.bind(this)}]
    };
    this.state = {
      visible : false
    };
    this.onChange = this.onChange.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.replayComment = this.replayComment.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }
  componentDidMount(){
    this.queryParams.doctor_id = getUser().doctor_id;
    //  獲取患者對醫生的評論
    this.props.dispatch(fetchPatientCommentList(this.queryParams,(json)=>{}));
  }
  //  回复评论
  replayComment(record,index){
    this.props.dispatch(createCommentReply({
      user_role : '1',
      reply : this.static.content,
      comment_id : `${this.static.record.id}`,
      user_id : `${this.static.record.user_id}`,
      user_sex : `${this.static.record.user_sex}`,
      doctor_id : `${this.static.record.doctor_id}`,
      user_name : `${this.static.record.user_name}`
    },(json)=>{
      if (parseInt(json.status)!=0) {

      }else{
        this.props.dispatch(fetchPatientCommentList(this.queryParams,(json)=>{}));
      }
      this.setState({visible:false});
    }));
  }
  //  删除回复评论
  deleteComment(record,index){
    const replayId = record.reply_list.filter((item,index)=>{
      return item.user_role == '1'
    });
    Modal.confirm({
      title: '警告',
      content: '是否确定删除该评价的回复内容！',
      okText: '确认',
      cancelText: '取消',
      onOk:()=>{
        this.props.dispatch(deleteCommentReply({
          user_id : record.user_id,
          comment_id : record.id,
          reply_id : replayId[0].reply_id,
          user_role : '1',
        },(json)=>{
          if (parseInt(json.status)!=0) {

          }else{
            this.props.dispatch(fetchPatientCommentList(this.queryParams,(json)=>{}));
          }
        }));
      }
    });
  }
  //  取消回复
  handleCancel(){
    this.static.record = {};
    this.setState({visible:false});
  }
  //  text area输入监听
  onChange(e){
    this.static.content = e.target.value;
  }
  nextPage(page){
    this.queryParams.page_no = page;
    this.props.dispatch(fetchPatientCommentList(this.queryParams,(json)=>{}));
  }
  renderColumn(text,record,index){
    let replayDom = [];
    const deleteFn = ()=> this.deleteComment(text,index);
    const replayFn = ()=> {
      this.static.record = text;
      this.setState({visible:true});
    };

    if (text.reply_list) {
      for (let i = 0; i < text.reply_list.length; i++) {
        if (text.reply_list[i].user_role=='1') {
          replayDom.push(
            <div className="replay">
              <strong>【医生回复】</strong>
              <span>{text.reply_list[i].reply}</span>
            </div>
          )
        }
      }
    }
    return (
      <div className="comments-col">
        <Row rowKey={index}>
          <Col span={7}>{convertTimeToStr(text.create_time)}</Col>
          <Col span={7}>评价星级：<Rate value={parseInt(text.score)} allowHalf={true}/></Col>
          <Col span={7}>评价标签：{text.tag}</Col>
          <Col span={3}>
            <div className="v-center">
              {
                replayDom.length>0 ?
                <Button type="danger" onClick={deleteFn}>刪除回复</Button> :
                <Button type="primary" onClick={replayFn}>我要回复</Button>
              }
              <Modal title="回复" visible={this.state.visible} onOk={this.replayComment} onCancel={this.handleCancel}>
                <textarea rows="10" placeholder="请输入回复内容" onChange={this.onChange} style={{width:'100%'}}></textarea>
              </Modal>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div>{text.comment}</div>
            {replayDom}
          </Col>
        </Row>
      </div>
    )
  }
  render(){
    const {total,pageSize,current,commentList=[]} = this.props;
    const data = commentList.map((item,index)=>{
      return {data:item}
    });
    const pagination = {onChange:this.nextPage,
      defaultCurrent:this.queryParams.page_no,total,current,pageSize}
    return (
      <div className="comment-list">
      <Table
        rowKey='comment_id'
        pagination = {pagination}
        columns={this.static.columns}
        dataSource={data}
        style={{paddingBottom:"5rem"}}
      />
      </div>
    )
  }
}
function mapStateToProps(state){
  return {
    total:parseInt(state.commentList.total_num),
    pageSize : parseInt(state.commentList.page_size),
    current:state.commentList.current_page,
    commentList : state.commentList.data,
  }
}
export default connect(mapStateToProps)(CommentList);
