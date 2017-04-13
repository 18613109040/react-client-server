import React,{Component} from "react";
import {Link} from "react-router";

export default class NotFound extends Component{
  componentWillMount(){
    // console.log('--componentWillMount--');
  }
  render(){
    return (
      <div>
        NotFound
        <hr/>
        <Link to="/">go back</Link>
      </div>
    )
  }
}

// module.exports = NotFound;
