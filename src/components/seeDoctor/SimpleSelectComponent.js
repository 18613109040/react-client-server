//诊疗记录
import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {Icon ,Button,Row,Col,Select} from 'antd';
import {getUser} from "../../utils/User";
const Option = Select.Option;

const RELATIONRECIPE = {
  NOFOUNT:'0',
  DOCTOR:'1',//医生
  RAREMEDICINAL:'2',//贵细人员
  PATIENT:'3',//病人
}


class SimpleSelectComponent extends Component {
  constructor(props){
    super(props);
    this.state={
      domType:"0",
      name:"",
      id:"",
    }
    this.static={
      list:[]
    }
  }
  //服务器端和客户端都只调用一次，在初始化渲染执行之前立刻调用。如果在这个方法内调用 setState，render() 将会感知到更新后的 state，将会执行仅一次，尽管 state 改变了。
  componentWillMount(){
  }

  //在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）。在生命周期中的这个时间点，组件拥有一个 DOM 展现，你可以通过 this.getDOMNode() 来获取相应 DOM 节点。
  componentDidMount(){
    const {achievements_type,achievements_name,achievements_rel} = this.props;
    this.setState({
      domType:achievements_type?achievements_type:RELATIONRECIPE.NOFOUNT,
      name:achievements_name?achievements_name:'',
      id:achievements_rel?achievements_rel:'',
    });
  }
  componentWillReceiveProps(oNextProps){
    this.setState({
      domType:oNextProps.achievements_type?oNextProps.achievements_type:RELATIONRECIPE.NOFOUNT,
      name:oNextProps.achievements_name?oNextProps.achievements_name:'',
      id:oNextProps.achievements_rel?oNextProps.achievements_rel:'',
    });
  }
  //一级下拉框选择
  handleChange(value){
    this.props.changeSimpleSelect({
      achievements_type:value,
      achievements_name:'',
      achievements_rel:'',
    })
    this.setState({
      domType:value,
      name:"",
      id:"",
    })
  }
  //二级DOM节点
  domSec(value,id,name){
    switch (value) {
      case RELATIONRECIPE.NOFOUNT:{
        break;
      }
      case RELATIONRECIPE.PATIENT:{
        break;
      }
      case RELATIONRECIPE.DOCTOR:{
        const {queryDoctorsthList} = this.props;
        this.static.list = queryDoctorsthList.doctor_sth_list.filter(item=>item.doctor_name!=getUser().doctor_name);
        return this.selectDom(this.static.list,id,name);
        break;
      }
      case RELATIONRECIPE.RAREMEDICINAL:{
        const {queryRareList} = this.props;
        for (var i = 0; i < queryRareList.data.length; i++) {
          queryRareList.data[i].doctor_name = queryRareList.data[i].name;
          if(queryRareList.data[i].employee_id){
            queryRareList.data[i].doctor_id = queryRareList.data[i].employee_id;
          }else{
            queryRareList.data[i].doctor_id = "88888";
          }
        }
        this.static.list = queryRareList.data;
        return this.selectDom(this.static.list,id,name);
        break;
      }
      default:
    }
    return "";
  }

  selectDom(list,id,name){
    list = list.filter(item=>item.doctor_name.includes(this.state.name));
    return (
      <Select
        combobox
        value={name}
        style={{ width: 180 }}
        defaultActiveFirstOption={false}
        showArrow={false}
        dropdownMatchSelectWidth={false}
        filterOption={false}
        onChange={this.doctorSelectChange.bind(this)}
        onBlur={this.doctorSelect.bind(this)}
      >
        {
          list.map((item,index)=>
            <Option
              key={index}
              value={item.doctor_name} >
              {item.doctor_name}
            </Option>)
        }
      </Select>
    )
  }

  doctorSelectChange(value){
    const [param,param2] = value.split(":");
    this.setState({
      name:param,
      id:param2,
    })
  }

  doctorSelect(){
    const list = this.static.list.filter(item=>item.doctor_name ==this.state.name);
    const {domType} = this.state;
    if(this.state.name){
      if(list.length>0){
        this.props.changeSimpleSelect({
          achievements_type:domType,
          achievements_name:list[0].doctor_name,
          achievements_rel:list[0].doctor_id,
        })
        this.setState({
          name:list[0].doctor_name,
          id:list[0].doctor_name,
        })
      }else{
        this.props.changeSimpleSelect({
          achievements_type:domType,
          achievements_name:"",
          achievements_rel:"",
        })
        this.setState({
          name:"",
          id:"",
        })
      }
    }else{
      this.props.changeSimpleSelect({
        achievements_type:domType,
        achievements_name:"",
        achievements_rel:"",
      })
      this.setState({
        name:"",
        id:"",
      })
    }
  }
  render(){
    const {domType,id,name} = this.state;
    const {achievements_type,achievements_name,achievements_rel} = this.props;
    return(
      <div>
        处方关联:
        <Select
          value={domType}
          style={{ width: 180 }}
          onChange={this.handleChange.bind(this)}
        >
          <Option value={RELATIONRECIPE.NOFOUNT}>请选择处方关联</Option>
          <Option value={RELATIONRECIPE.PATIENT}>患者开方</Option>
          <Option value={RELATIONRECIPE.DOCTOR} >医生转方</Option>
          <Option value={RELATIONRECIPE.RAREMEDICINAL}>贵细开方</Option>
        </Select>
        {this.domSec(domType,id,name)}
      </div>
    )
  }
}

SimpleSelectComponent.contextTypes={
  router: React.PropTypes.object.isRequired
};
SimpleSelectComponent.propTypes = {
  changeSimpleSelect : PropTypes.func,
  achievements_type : PropTypes.string,
  achievements_name : PropTypes.string,
  achievements_rel : PropTypes.string,
};

function mapStateToProps(state){
  return {
    queryDoctorsthList:state.queryDoctorsthList,
    queryRareList:state.queryRareList,
  }
}
export default connect(mapStateToProps)(SimpleSelectComponent)
