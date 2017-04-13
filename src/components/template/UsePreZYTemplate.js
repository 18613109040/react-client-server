 //处理另存为模板
import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {Row,Col,Input,Button,Table,Modal} from 'antd';
import {getUser} from "../../utils/User";
import {addRecipeTempletDetailed} from "../../store/actions/UsePreTemplate";

class UsePreZYTemplate extends Component {
  constructor(props){
    super(props);
    this.state={
    	visible:true,
    }
    this.static = {
      dataSource:[],
      dataSourceSome:[],
      inputValue:''
    }
  }
  //服务器端和客户端都只调用一次，在初始化渲染执行之前立刻调用。如果在这个方法内调用 setState，render() 将会感知到更新后的 state，将会执行仅一次，尽管 state 改变了。
  componentWillMount(){

  }

  //在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）。在生命周期中的这个时间点，组件拥有一个 DOM 展现，你可以通过 this.getDOMNode() 来获取相应 DOM 节点。
  componentDidMount(){


  }
  componentWillReceiveProps(nextProps){
  }
  inputChange(e){
    this.static.inputValue = e.target.value;
  }
  cancelClick(){
    this.props.buttonClick();
  }
  clickSaveSome(){
    const {selectIndex, buttonClick,selectName} = this.props;
    
    if(+selectIndex > 100){
      this.saveData(selectIndex,this.static.dataSourceSome,buttonClick);
    }else{
      Modal.warn({
        content: '请选择具体的类别后保存',
      });
    }
  }
  clickSaveAll(){
    const {selectIndex, buttonClick} = this.props;
    if(+selectIndex > 100){
      this.saveData(selectIndex,this.static.dataSource,buttonClick);
    }else{
      Modal.warn({
        content: '请选择具体的类别后保存',
      });
    }
  }
  saveData(selectIndex,list,buttonClick){
    if(this.static.inputValue.length < 1){
      Modal.warn({
        content: '请输入模板名称',
      })
      return;
    }
    if(list.length < 1){
      Modal.warn({
        content: '请选择需要保存的药品后再次点击',
      })
    }else{
      const data = {
        disease:'wu',
        list:list,
        staff_id:getUser().doctor_id,
        parent_id:selectIndex,
        templet_name:this.static.inputValue,
        templet_type:'4',//4 中药饮片, 5 中西成药 6检验检查, 7治疗理疗
      }
      this.props.dispatch(addRecipeTempletDetailed(data,json => {
        if (json.status == 0) {
          buttonClick();
        }else{
          Modal.warn({
            content: json.message,
          })
        }
      }))
    }
  }

  render(){
    const {dataSource} = this.props;
    this.static.dataSource = dataSource.slice(0,-1);
    const columns_model = [{
      title: '药品名称',
      dataIndex: 'item_name',
      key: 'item_name',
    }, {
      title: '每次剂量',
      dataIndex: 'item_amount',
      key: 'item_amount',
      render: (text,record,index) => {
        return (
          <span>{record.item_amount+record.item_unit}</span>
        )
      },
    },{
      title: '药品总量',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (text,record,index) => {
        return (
          <span>{record.total_amount+record.item_unit}</span>
        )
      },
    }, {
      title: '细目用法',
      dataIndex: 'usage_desc',
      key: 'usage_desc',
    }];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.static.dataSourceSome = selectedRows;
      },
    };

    return(
      <div style={{'paddingLeft':'.5rem'}} >
        <Row style={{fontSize:".8rem",'paddingBottom':'.3rem'}}>
          <Col span={4}><span style={{color:'red'}}>*</span>模板名称:</Col>
          <Col span={20}><Input onChange={this.inputChange.bind(this)}/></Col>
        </Row>
        <Row>
          <Table rowKey={(record,index) => index}
            rowSelection={rowSelection}
            columns={columns_model}
            dataSource={this.static.dataSource}
            pagination={false}/>
        </Row>
        <Row className="button-oper">
          <Col style={{'textAlign':'center'}} onClick={this.cancelClick.bind(this)} span={8}><Button className="button-green">取消</Button></Col>
          <Col style={{'textAlign':'center'}} onClick={this.clickSaveSome.bind(this)} span={8}><Button className="button-red" >部分保存</Button></Col>
          <Col style={{'textAlign':'center'}} onClick={this.clickSaveAll.bind(this)} span={8}><Button className="button-orange" >全部保存</Button></Col>
        </Row>
      </div>
    )
  }
}

UsePreZYTemplate.contextTypes={
  router: React.PropTypes.object.isRequired
};
UsePreZYTemplate.defaultProps={
  dataSource:[],
  selectIndex:'',
  selectName:'',
  buttonClick:()=>{}
};
UsePreZYTemplate.propTypes = {
  dataSource:PropTypes.array,
  selectIndex:PropTypes.string,
  selectName:PropTypes.string,
  buttonClick:PropTypes.func,
};

function mapStateToProps(state){
  return state
}
export default connect(mapStateToProps)(UsePreZYTemplate)
