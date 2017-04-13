import React, {Component, PropTypes} from "react";
import {Link,IndexLink} from "react-router";
import { Breadcrumb, Icon } from 'antd';
//从写includes
Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
    'use strict';
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) {
        return true;
      }
      k++;
    }
    return false;
};
  
export default class CusBreadcrumb extends Component{
  constructor(props){
    super(props);
  }
  
  render(){
    
    const getBread =  this.props.menus.filter(data=>(
    	this.props.pathname.split("/").includes(data.router)
    ))
   // console.dir(this.props.query)
   /* let {flage} = this.props.query;
    if(getBread.length==0){
    	if(flage == "Consulting"){
    		getBread[0]="患者咨询(未结束)"
    	}else if(flage == "ConsultsEnd"){
    		getBread[0]="咨询抢答"
    	}else if(flage == "ConsultsSquare"){
    		getBread[0]="患者咨询(已结束)"
    	}
    }*/
    return(
      <div className="site-breadcrumb">
        <Breadcrumb separator=">>">
          <Breadcrumb.Item>医生工作站</Breadcrumb.Item>
           <Breadcrumb.Item>{getBread.length>0?getBread[0].name:""}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
    )
  }
}

CusBreadcrumb.contextTypes={
  router: React.PropTypes.object.isRequired
};
