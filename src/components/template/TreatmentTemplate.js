//处理另存为模板
import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {Row,Col,Input,Button,Table,Modal} from 'antd';
import {getUser} from "../../utils/User";
import {queryRecipeTempletDetail, addRecipeTempletDetailed} from "../../store/actions/UsePreTemplate";

class TreatmentTemplate extends Component {
  constructor(props){
    super(props);
    this.state = {
      dataSource:[],
      templet_name: ""
    }
    this.static = {
      index:''
    }

    this.cancelClick = this.cancelClick.bind(this);
  }
  makeColumns(){
    return [{
      title: '序号',
      dataIndex: 'index',
      width: 50
    },{
      title: '治疗项目',
      dataIndex: 'item_name',
      width: 300,
      render: (text, record, index)=> this.renderInput(record, index, "item_name", text)
    },{
      title: '单位',
      dataIndex: 'presciption_units',
      width: 70,
    },{
      title: '数量',
      dataIndex: 'number',
      width: 50,
      render: (text, record, index)=> this.renderInput(record, index, "number", text)
    },{
      title: '金额',
      dataIndex: 'sell_price',
      width: 80,
    },{
      title: '穴位1',
      dataIndex: 'item_1',
      width: 70,
      render: (text, record, index)=> this.renderInput(record, index, "item_1", text)
    },{
      title: '穴位2',
      dataIndex: 'item_2',
      width: 70,
      render: (text, record, index)=> this.renderInput(record, index, "item_2", text)
    },{
      title: '穴位3',
      dataIndex: 'item_3',
      width: 70,
      render: (text, record, index)=> this.renderInput(record, index, "item_3", text)
    },{
      title: '穴位方',
      dataIndex: 'items',
      width: 300,
      render: (text, record, index)=> this.renderInput(record, index, "items", text)
    }]
  }
  renderInput(data, index, key, text){
    const {item_name, number, item_1, item_2, item_3, items} = data;
    const {itemList, acupoints} = this.state;
    if(item_name.length<=0) return "";
    switch (key) {
      case "item_name":
        // return (<Input key={index} placeholder="请输入项目名称" defaultValue={item_name} onBlur={value => this.onBlurItemName(key, index, value)}  />)
        return (<Input placeholder="" defaultValue={item_name} disabled={this.props.disabled} />)
        case "number":
          return (<Input defaultValue={number} disabled={this.props.disabled} />)
      case "item_1":
        // return (<Input placeholder="" defaultValue={item_1} onBlur={value => this.onBlurItemName(key, index, value)} />)
        return (<Input placeholder="" defaultValue={item_1} disabled={this.props.disabled} />)
      case "item_2":
        return (<Input placeholder="" defaultValue={item_2} disabled={this.props.disabled} />)
      case "item_3":
        return (<Input placeholder="" defaultValue={item_3} disabled={this.props.disabled} />)
      case "items":
        return (<Input placeholder="" defaultValue={items} disabled={this.props.disabled} />)
      default:
    }
  }
  //服务器端和客户端都只调用一次，在初始化渲染执行之前立刻调用。如果在这个方法内调用 setState，render() 将会感知到更新后的 state，将会执行仅一次，尽管 state 改变了。
  componentWillMount(){
  }

  //在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）。在生命周期中的这个时间点，组件拥有一个 DOM 展现，你可以通过 this.getDOMNode() 来获取相应 DOM 节点。
  componentDidMount(){
    this.static.index = this.props.wholePlate.index;
    const data = {
      page_no:'1',
      page_size:'1',
      templet_id:this.static.index,
    }
    this.props.dispatch(queryRecipeTempletDetail(data,json=>{
      
    }))
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.wholePlate.index != this.static.index){
      this.static.index = nextProps.wholePlate.index
      const data = {
        page_no:'1',
        page_size:'1',
        templet_id:this.static.index,
      }
      this.props.dispatch(queryRecipeTempletDetail(data,json=>{
        if(json.status == 0){
          this.setState({
            dataSource:json.data.list
          });

        }
      }))
    }
  }
  cancelClick(){
    this.props.cancel();
  }
  clickSaveSome(){
    // const {selectIndex, buttonClick,selectName} = this.props;
    // console.log(selectName);
    // if(+selectIndex > 100){
    //   this.saveData(selectIndex,this.static.dataSourceSome,buttonClick);
    // }else{
    //   Modal.warn({
    //     content: '请选择具体的类别后保存',
    //   });
    // }
  }
  clickSaveAll(tree){
    if(!this.varify(tree)) return;
  }
  saveData(tree){
    if(!this.varify(tree)) return;
    // this.static.dataSourceSome.map((item, index)=>{
    //   item.acupoint = [{acupoint_id: item.item_1, acupoint_name: item_1}]
    // })
    let data = {
      parent_id: tree.key[0],
      templet_name: this.static.templet_name,
      templet_type: 7+"",
      staff_id: getUser().doctor_id+"",
      list: this.static.dataSourceSome,
      disease: "test"
    }
    this.props.dispatch(addRecipeTempletDetailed(data, json=>{
      if(json.status!=0){
        Modal.error({
          content: json.message
        })
      }
    }));
  }
  varify(tree){
    if(!tree || !tree.key[0]){
      Modal.warn({
        content: '请选择具体的类别后保存'
      })
      return false;
    }
    const {templet_name, dataSourceSome} = this.static;
    if(!dataSourceSome || dataSourceSome.length<=0){
      Modal.warn({
        content: '请选择治疗项目'
      })
      return false;
    }
    if(!templet_name || templet_name.length<=0){
      Modal.warn({
        content: '请输入模板名称'
      })
      return false
    }
    return true;
  }

  render(){
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.static.dataSourceSome = selectedRows;
      },
    };
    const {data} = this.props;
    return(
      <div>
        <Row>
          <Col span={2}><span style={{color:"red"}}>*</span><label>模板名称: </label></Col>
          <Col span={14}><Input placeholder="请输入模板名称" onChange={e=>{this.static.templet_name= e.target.value; }} /></Col>
        </Row>
        <Row>
          <Table rowKey={(record,index) => index}
            rowSelection={rowSelection}
            columns={this.makeColumns()}
            dataSource={data}
            pagination={false}/>
        </Row>
        {/* <Row className="button-oper">
          <Col style={{'textAlign':'center'}} onClick={this.cancelClick} span={8}><Button className="button-green">取消</Button></Col>
          <Col style={{'textAlign':'center'}} onClick={this.clickSaveSome.bind(this)} span={8}><Button className="button-red" >部分引用</Button></Col>
          <Col style={{'textAlign':'center'}} onClick={this.clickSaveAll.bind(this)} span={8}><Button className="button-orange" >全部引用</Button></Col>
        </Row> */}
      </div>
    )
  }
}

TreatmentTemplate.contextTypes={
  router: React.PropTypes.object.isRequired
};
TreatmentTemplate.defaultProps={
  wholePlate:{},
  cancel:()=>{},
  disabled: true,
  data: [],
};
TreatmentTemplate.propTypes = {
  wholePlate:PropTypes.object,
  cancel:PropTypes.func,
  data: PropTypes.array,
  disabled: PropTypes.bool,
};

export default TreatmentTemplate;
// function mapStateToProps(state){
//   return state
// }
// export default connect(mapStateToProps)(TreatmentTemplate)
