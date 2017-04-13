import React,{Component} from "react";

export default class Abort extends Component{
  constructor (props) {
    super(props);
    console.log('---server----abort-------');
  }
  render(){
    return (
      <div>Abort</div>
    )
  }
}
