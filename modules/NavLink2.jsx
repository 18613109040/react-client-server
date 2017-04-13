import React,{Component} from "react";
import NavLink from "./NavLink";
// import {Link} from "react-router";

export default class NavLink2 extends Component{
  render(){
    return(
      <NavLink {...this.props} activeStyle={{color:"blue"}} >
      </NavLink>
    )
  }
}
