import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import { Row, Col } from 'antd';
import {convertGender, convertTimeToStr,getAgeByBirthday} from '../../utils/tools';

export default class PatientFileBaseInfo extends Component{
  constructor(props) {
    super(props);
    this.static = {
      baseDI : [
        {key:'card_no',text:'诊疗卡',value:''},
        {key:'name',text:'姓名',value:''},
        {key:'sex',text:'性别',value:''},
        {key:'age',text:'年龄',value:''},
        {key:'birth',text:'出生日期',value:''},
        {key:'phone',text:'电话号码',value:''},
        {key:'id_card',text:'身份证号',value:''},
        {key:'address',text:'联系地址',value:''}
      ],
      mecProDI : [
        {key:'',text:'费别',value:''},
        {key:'',text:'保险号',value:''},
        {key:'',text:'农合号',value:''},
        {key:'medicare_card',text:'医疗证号',value:''}
      ],
      mecDI : [
        {key:'',text:'手术史',value:''},
        {key:'last_treat_time',text:'最近就诊',value:''},
        {key:'allergic_history',text:'过敏史',value:''},
        {key:'history',text:'既往史',value:''},
        {key:'family_history',text:'家族史',value:''},
        {key:'band_history',text:'经带待产史',value:''}
      ]
    }
  }

  getDataByKey(key,data){
    return key.map((item,index)=>{
      if (item.key=='sex') {
        item.value = convertGender(data[item.key]);
      }else if (item.key=='last_treat_time') {
        item.value = convertTimeToStr(data[item.key]);
      }else if (item.key=='birth') {
        item.value = data[item.key];
      }else if (item.key=='age') {
        item.value = getAgeByBirthday(data["birth"]);
      }
      else {
        item.value = data[item.key];
      }

      return item;
    });
  }
  render(){
    const {fileInfo} = this.props;
    if (fileInfo.hasOwnProperty('name')){
      this.static.baseDI = this.getDataByKey(this.static.baseDI,fileInfo);
      this.static.mecProDI = this.getDataByKey(this.static.mecProDI,fileInfo);
      this.static.mecDI = this.getDataByKey(this.static.mecDI,fileInfo);
    }

    return (
      <div className="component-file-base-info">
        <Row>
          <Col span={16}>
            <Row>
              <Col span={24}>
                <h3>基本信息：</h3>
                <Item data={this.static.baseDI} colNum={2}/>
              </Col>
              <Col span={24}>
                <h3>医保信息：</h3>
                <Item data={this.static.mecProDI} colNum={2}/>
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <h3>病史信息：</h3>
            <Item data={this.static.mecDI} colNum={1}/>
          </Col>
        </Row>
      </div>
    )
  }
}
PatientFileBaseInfo.propTypes = {
  fileInfo    : PropTypes.object.isRequired
}

class  Item extends Component{
  constructor(props) {
    super(props);
  }

  renderItem(data){
    const {colNum} = this.props;
    if (!data) {
      return ''
    }
    return data.map((item,index)=>{
      return (
        <Col span={24/colNum} key={index}>
          <div className="item">
            <label>{item.text}:</label>
            <span>{item.value}</span>
          </div>
        </Col>
      )
    })
  }
  render(){
    const {data} = this.props;
    return (
      <div>
        <Row>
          {this.renderItem(data)}
        </Row>
      </div>
    )
  }
}
Item.propTypes = {
  colNum    : PropTypes.number.isRequired, // 数据展示列数 (colNum为2的倍数)
  data      : PropTypes.array.isRequired  // 展示的数据{text:text,value:value}
}
