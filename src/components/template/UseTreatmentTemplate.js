//处理另存为模板
import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {Row,Col,Input,Button,Table,Modal} from 'antd';
const confirm = Modal.confirm;
import {getUser} from "../../utils/User";
import {queryRecipeTempletDetail} from "../../store/actions/UsePreTemplate";
import {addZYTab,searchItem} from "../../store/actions/Medicine";

class TreatmentTemplate extends Component {
  constructor(props){
    super(props);
    this.state = {
      dataSource:[]
    }
    this.static = {
      index:'',
      dataSourceSome:[]
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
      page_size:'100',
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
        page_size:'100',
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
    this.props.buttonClick();
  }
  clickSaveSome(){
    const {wholePlate,prescriptionInfo} = this.props;
    const {items} = prescriptionInfo[wholePlate.activeKey];
    const _self = this;
    //判断处方是否已有数据
    if(items.length > 1){
      confirm({
        title: '现有处方不为空，是否确定覆盖？',
        onOk() {
          //拼接数据
          const {dataSourceSome} = _self.static;
          _self.sendMedicineData(dataSourceSome,prescriptionInfo[wholePlate.activeKey],wholePlate.activeKey,_self.props.buttonClick());
        },
        onCancel() {
          _self.props.buttonClick();
        },
      });
    }else{
      //拼接数据
      const {dataSourceSome} = _self.static;
      _self.sendMedicineData(dataSourceSome,prescriptionInfo[wholePlate.activeKey],wholePlate.activeKey,_self.props.buttonClick());
    }
  }
  clickSaveAll(){
    const {wholePlate,prescriptionInfo} = this.props;
    const {items} = prescriptionInfo[wholePlate.activeKey];
    const _self = this;
    //判断处方是否已有数据
    if(items.length > 1){
      confirm({
        title: '现有处方不为空，是否确定覆盖？',
        onOk() {
          //拼接数据
          const {dataSource} = _self.state;
          _self.sendMedicineData(dataSource,prescriptionInfo[wholePlate.activeKey],wholePlate.activeKey,_self.props.buttonClick());
        },
        onCancel() {
          _self.props.buttonClick();
        },
      });
    }else{
      //拼接数据
      const {dataSource} = _self.state;
      _self.sendMedicineData(dataSource,prescriptionInfo[wholePlate.activeKey],wholePlate.activeKey,_self.props.buttonClick());
    }
  }
  //拼接数据
  sendMedicineData(data,info,key,cb){
    // 遍历药品
    let count = 0;
    for (let i = 0; i < data.length; i++) {
      ((index)=>{
        const item_data = {
          keyword:data[index].item_name,
          pharmacy_type:1<<0,//1<<0中医药房 1<<1西医药房 1<<2 贵细药房 1<<3供应室
          shop_no:getUser().shop_no,
        }
        this.props.dispatch(searchItem(item_data,(json)=>{
          if(json.data.length > 0 && json.status == '0'){
            data[index].item_type = "0";
            data[index].item_name = json.data[0].value + "";
            data[index].item_id = json.data[0].item_id + "";
            data[index].item_code = json.data[0].item_code + "";
            data[index].fee_type = json.data[0].fee_type + "";
            data[index].item_price = json.data[0].price + "";
            data[index].standard = json.data[0].standard + "";
            data[index].item_unit = json.data[0].presciption_unit + "";
            //库存
            data[index].stock = json.data[0].stock + "";
            data[index].total_price = data[index].total_amount * data[index].item_price+"";
            count++;
            if(count > data.length - 1){
              let newPrescriptionInfo = {
                ...info
              }
              newPrescriptionInfo.quantity = data[index].total_amount / data[index].item_amount;
              newPrescriptionInfo.items = [...data,{
                item_amount:"0",
                item_code:"0",
                item_id:"1",
                item_name:"",
                item_price:"",
                item_type:"0",
                item_unit:"",
                total_amount:"",
                total_price:"",
                usage_desc:"",
                usage_id:"",
                wst_spec:"",
                wst_taking_amount:"",
                wst_taking_days:"",
                wst_taking_desc:"",
                wst_taking_times:"",
                wst_taking_unit:"",
              }];
              this.props.dispatch(addZYTab({name:key,data:newPrescriptionInfo}))
              if (typeof cb == "function") {
                cb();
              }
            }
          }else{
            //没有找到该要
          }
        }));
      }
      )(i)
    }

  }
  saveData(selectIndex,list,buttonClick){

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
  render(){
    const columns_model = this.makeColumns();
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.static.dataSourceSome = selectedRows;
      },
    };
    const {dataSource} = this.state;
    return(
      <div style={{'paddingLeft':'.5rem'}} >
        <Row>
          <Table rowKey={(record,index) => index}
            rowSelection={rowSelection}
            columns={columns_model}
            dataSource={dataSource}
            pagination={false}/>
        </Row>
        <Row className="button-oper">
          <Col style={{'textAlign':'center'}} onClick={this.cancelClick.bind(this)} span={8}><Button className="button-green">取消</Button></Col>
          <Col style={{'textAlign':'center'}} onClick={this.clickSaveSome.bind(this)} span={8}><Button className="button-red" >部分引用</Button></Col>
          <Col style={{'textAlign':'center'}} onClick={this.clickSaveAll.bind(this)} span={8}><Button className="button-orange" >全部引用</Button></Col>
        </Row>
      </div>
    )
  }
}

TreatmentTemplate.contextTypes={
  router: React.PropTypes.object.isRequired
};
TreatmentTemplate.defaultProps={
  wholePlate:{},
  buttonClick:()=>{}
};
TreatmentTemplate.propTypes = {
  wholePlate:PropTypes.object,
  buttonClick:PropTypes.func,
  prescriptionInfo:PropTypes.object,
};
function mapStateToProps(state){
  return {
    prescriptionInfo:state.prescriptionInfo,
  }
}
export default connect(mapStateToProps)(TreatmentTemplate)
