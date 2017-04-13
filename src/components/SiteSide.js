import React, {Component, PropTypes} from "react";
import {routerMap} from "../routes";

import { Menu, Icon, Card } from 'antd';
const SubMenu = Menu.SubMenu;

export default class SiteSide extends Component{
  constructor(props){
    super(props);
    this.static={
      defaultOpen:['recipe','stock','public','search','inbound','outbound']
    };
    this.state={
      collapse: false,
    };
    this.onCollapseChange = this.onCollapseChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  //获取当前页面path
  componentDidMount(){
  }
  //面板折叠回调
  onCollapseChange() {
    this.setState({
      collapse:!this.state.collapse,
    })
  }
  //页面跳转回调
  handleClick(info){
    //const {onClickMenuItem} = this.props;
    this.context.router.push(info.key);
    this.setState({path:info.key});
  }
  renderMenus(routerMap,parentPath){
    let subMenus=[];
    let nodes = Array.isArray(routerMap)?routerMap:routerMap.children;
    nodes.map((item)=>{
      if(!item.menuHidden){
        if(item.children && item.children.length){ //含有子菜单且子菜单项目不为空
          //let itemPath=Array.isArray(routerMap)?item.path:routerMap.path.concat(item.path);
          subMenus.push(
            <SubMenu key={item.path.join('')} title={<span><Icon type={item.icon} /><span>{item.text}</span></span>}>
              {this.renderMenus(item,Array.isArray(routerMap)?null:routerMap.path)}
            </SubMenu>
          )
        }else{
          let itemPath=parentPath?(parentPath.concat(routerMap.path?routerMap.path.concat(item.path):item.path)):(routerMap.path?routerMap.path.concat(item.path):item.path);
          subMenus.push(<Menu.Item key={`/${itemPath.join('/')}`}>{item.text}</Menu.Item>)
        }
      }
    });
    return subMenus;
  }
  render(){
    const {collapse,openKeys}=this.state;
    const {defaultOpen}=this.static;
    const {path} = this.props;
    return(
      <aside className={`component site-side ${collapse ? "side-collapse" : ""}`}>
        <Card>
          <div className="custom-image">
            <img alt="example" width="100%" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
          </div>
          <div className="custom-card">
            <h3>Europe Street beat</h3>
            <p>www.instagram.com</p>
          </div>
        </Card>
        <Menu key="menu" defaultOpenKeys={defaultOpen}
              selectedKeys={[path]}
              onClick={this.handleClick}
              mode={collapse?"vertical":"inline"}>
          {this.renderMenus(routerMap)}
        </Menu>

        <div className="side-action" onClick={this.onCollapseChange}>
          {collapse ? <Icon type="right" /> : <Icon type="left" />}
        </div>
      </aside>
    )
  }
}

SiteSide.contextTypes={
  router: React.PropTypes.object.isRequired
};
SiteSide.proptypes = {
  path:PropTypes.string
};
