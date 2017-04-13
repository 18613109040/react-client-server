import React, {Component, PropTypes} from "react";
import {Link,IndexLink} from "react-router";
import {routerMap} from "../routes";
//import {} from "../utils/tools";
//import {} from "../utils/public";

import { Breadcrumb, Icon } from 'antd';

export default class SiteBreadcrumb extends Component{
  constructor(props){
    super(props);
  }
  renderBreadItem(path){
    if(!path) return;
    let aPath = [],dom=[];
    let curPath = path.split('/').slice(1);
    // curPath.forEach((item)=>{
    //   this.findPath(routerMap,item,aPath);
    // });
    this.findPath(routerMap,curPath,0,aPath);
    aPath.forEach((item,index)=>{
    	
      if(item.children && item.children.length){
        dom.push(
          <Breadcrumb.Item key={index}>{item.text}</Breadcrumb.Item>
        )
      }else{
        dom.push(
          <Breadcrumb.Item key={index}><a href={item.path.join('/')}>{item.text}</a></Breadcrumb.Item>
        )
      }
    });
    return dom;
  }
  //在数组中查找path.join('')==value的项的text
  findPath(array,tarStr,index,res){
    array.forEach((item)=>{
      if(item.path[0]==tarStr[index]){
        res.push(item);
        if(item.hasOwnProperty("children") && Array.isArray(item["children"]) ){
          this.findPath(item.children,tarStr,index+1,res);
        }
        return false;//跳出循环
      }
    });
  }
  render(){
    const {path} = this.props;
    return(
      <div className="component site-breadcrumb">
        <Breadcrumb separator=">">
          <Breadcrumb.Item><IndexLink to={'/'}>主页</IndexLink></Breadcrumb.Item>
          {this.renderBreadItem(path)}
        </Breadcrumb>
      </div>
    )
  }
}

SiteBreadcrumb.contextTypes={
  router: React.PropTypes.object.isRequired
};
SiteBreadcrumb.proptypes = {
  path:PropTypes.string
};
