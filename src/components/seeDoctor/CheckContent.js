/*
 * 门诊 检验检查
 */

import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {Row,Col,Form,Input,Checkbox,Button,Select, Table, Radio} from 'antd';
import {modifyCheckItem} from "../../store/actions/CheckMedicine";
const Option = Select.Option;
const RadioGroup = Radio.Group;

class CheckItem extends Component{
  constructor(props){
    super(props);
    const tempSource=[];
    for(let i=0; i<13; i++){
      tempSource.push({
        key: i,
        index: i,
        name:`item name ${i}`,
        number: `danwei , ${i}`,
        price:"jiaqian",
        select: false,
        acount: i
      })
    }
    this.state ={
      rowSelection:{},
      data: this.props.data,
      dept_id: this.props.dept_id
    }
    this.renderCheckBoxCol = this.renderCheckBoxCol.bind(this);
    this.onCheckBoxChange = this.onCheckBoxChange.bind(this);
    this.renderSelect = this.renderSelect.bind(this);
    this.onSelected = this.onSelected.bind(this);
  }
  makeColumns(){
    return [{
      key: "item_code",
      title: '序号',
      dataIndex: 'item_code'
    },{
      key: "item_name",
      title: '项目名称',
      dataIndex: 'item_name'
    },{
      title: '单位',
      dataIndex: 'standard'
    },{
      key: "sell_price",
      title: '单价',
      dataIndex: 'sell_price',
      render: (text)=>(<span>{text/10000}</span>)
    },{
      title: '选择',
      dataIndex: 'check',
      render: (text, record, index)=> this.renderCheckBoxCol(this.state.data, index, "check", text)
    },{
      title: '数量',
      dataIndex: 'no',
      render: (text, record, index)=> this.renderSelect(this.state.data, index, "no", text)
    }]
  }
  componentWillMount(){
  }
  componentDidMount(){
  }
  // 在组件接收到新的 props 的时候调用。在初始化渲染的时候，该方法不会调用。
  componentWillReceiveProps(nextProps){
    this.setState({data: nextProps.data, dept_id: nextProps.dept_id});
  }
  // 渲染CheckBox
  renderCheckBoxCol(data, index, key, text){
  	
    const {check} = data[index]
    return (
      <Checkbox key={`${this.props.index}_index`} checked={check} onChange={value => this.onCheckBoxChange(key, index, value)} />
    )
  }
  // 处理CheckBox点击事件
  onCheckBoxChange(key, index, value){
    const {data, dept_id} = this.state;
    data[index][key] = !data[index][key];
    
    if(Number(data[index][key])==true){
      data[index]['no'] = 1;
    }else{
      data[index]['no'] = 0;
    }
    this.props.dispatch(modifyCheckItem(this.props.index, {data, dept_id}));
  }
  renderSelect(data, index, key, text){
    const {no} = data[index];
    return (
      <Select key={`${index}_${no}`}
        defaultValue={String(no)}
       style={{ width: 100 }}
        onSelect={(value, option) => this.onSelected(key, index, value)}
        >
        <Option value="0">0</Option>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
        <Option value="3">3</Option>
        <Option value="4">4</Option>
        <Option value="5">5</Option>
        <Option value="6">6</Option>
        <Option value="7">7</Option>
        <Option value="8">8</Option>
        <Option value="9">9</Option>
        <Option value="10">10</Option>
      </Select>
    )
  }
  onSelected(key, index, value){
    const {data} = this.state;
    data[index][key] = value; //value.target.value;
    if(Number(data[index][key])!=0){
      data[index]["check"] = true;
    }else{
      data[index]["check"] = false;
    }
    this.setState(data);
  }
  getSelectItems(){
    const {data} = this.state;
    let list = [];
    for(let i=0; i<data.length; i++){
      if(data[i]["check"]==true){
        list.push(data[i]);
      }
    }
    return list;
  }
  
  render(){
    let money = 0;
   // console.dir(this.props.data)
    this.props.data.map((item)=>{
    	money += parseInt(item.item_price)*parseInt(item.no);
    })
   // console.dir(this.state.dept_id);
    let dataSouse = [];
    if(this.state.dept_id.toString() == '0'){
    	dataSouse = this.state.data;
    }else{
    	dataSouse = this.state.data.filter(item => item.dep_type.toString() == this.state.dept_id.toString() )
    }
   
    return(
      <Table 	pagination={false} 
      				dataSource={dataSouse} 
      				columns={this.makeColumns()} 
      				rowKey={(record,id) => id}
      				footer={() => <span className="table_footer">小计:{money/10000}</span>}/>
    )
  }
}

// 上面是组件，下面才是检验检查的内容----------------------------------------------------------------------------------------------------------------------------------

class CheckContent extends Component {
  constructor(props){
    super(props);
    // 科室类别
    this.depts=[{
      dept_id: "0",
      dept_name: "全部科室"
    }, {
      dept_id: "1",
      dept_name: "常规"
    }, {
      dept_id: "2",
      dept_name: "妇科"
    }, {
      dept_id: "3",
      dept_name: "男科"
    }, {
      dept_id: "4",
      dept_name: "眼科"
    }, {
      dept_id: "5",
      dept_name: "皮肤科"
    }]
    this.state={
      dept_id: this.props.dept_id
    }

    this.onChangeHandle = this.onChangeHandle.bind(this);

  }
  componentWillMount(){

  }
  componentDidMount(){
  }
  // 在组件接收到新的 props 的时候调用。在初始化渲染的时候，该方法不会调用。
  componentWillReceiveProps(nextProps){

  }
  onChangeHandle(e){
    // this.setState({dept_id: e.target.value});
    this.props.dispatch(modifyCheckItem(this.props.index, {data: this.props.data, dept_id: e.target.value}))
  }

  render(){
    const {index, dept_id, data} = this.props
    return (
      <div>
        <Row style={{"paddingBottom":"10px"}}>
          <label>科室类别：</label>
          <RadioGroup onChange={this.onChangeHandle} value={dept_id}>
            {this.depts.map((dept, index)=>{
              return (<Radio key={index} value={dept.dept_id}>{dept.dept_name}</Radio>)
            })}
          </RadioGroup>
        </Row>
        <Row>
          <CheckItem dispatch={this.props.dispatch} index={index} data={data} dept_id={dept_id} />
        </Row>
      </div>
    )
  }
}

CheckContent.proptypes={
  index: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
  dept_id: PropTypes.string.isRequired
};

export default CheckContent;
