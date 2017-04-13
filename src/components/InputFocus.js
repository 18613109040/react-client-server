/*
 *    输入框获取接口
 */
import React, {Component, PropTypes} from "react";

// 键盘标识
const KEY = {
  TAB : "9",  //tab键
  ENTER : "13",//enter键
  LEFT : "37",
  UP : "38",
  RIGHT : "39",
  DOWN : "40",
}

class InputFocus extends Component{
	constructor(props){
	    super(props);
	    this.state={
	    };
	}
  componentDidMount(){
  }
  componentDidUpdate(oNextProps, oNextState){
    const key = this.props.children.ref;
    this.refs[key].querySelector('input').name=key;
    this.refs[key].querySelector('input').onkeydown=this.hotkey.bind(this);
  }
  hotkey(e)
  {
    const [name,level,index,hMax,wMax,key] = this.props.children.ref.split("-");
    const keyDown = window.event.keyCode;
    this.switchKey(keyDown+"",e,name,level,index,hMax,wMax,key);
  }
  // tab
  tab(e,name,level,index,hMax,wMax,key){
    e.preventDefault();
    let eleName = name+"-"+level+"-"+index+"-"+hMax+"-"+wMax+"-"+key;
    if(+index<+wMax){
      eleName = name+"-"+level+"-"+(+index+1)+"-"+hMax+"-"+wMax+"-"+key;
    }else if(+level<+hMax){
      eleName = name+"-"+(+level+1)+"-"+"1"+"-"+hMax+"-"+wMax+"-"+key;
    }
    if(document.querySelector(`input[name=${eleName}]`)){
      document.querySelector(`input[name=${eleName}]`).focus();
    }
  }
  enter(e,name,level,index,hMax,wMax,key){
    const {enter} = this.props;
    if(!enter){
      return;
    }
    setTimeout(()=>{
      this.tab(e,name,level,index,hMax,wMax,key);
    },0);
  }
  right(e,name,level,index,hMax,wMax,key){
    const {right} = this.props;
    if(!right){
      return;
    }
    this.tab(e,name,level,index,hMax,wMax,key);
  }
  left(e,name,level,index,hMax,wMax,key){
    const {left} = this.props;
    if(!left){
      return;
    }
    e.preventDefault();
    let eleName = name+"-"+level+"-"+index+"-"+hMax+"-"+wMax+"-"+key;
    if(+index>1){
      eleName = name+"-"+level+"-"+(+index-1)+"-"+hMax+"-"+wMax+"-"+key;
    }else if(+level>1){
      eleName = name+"-"+(+level-1)+"-"+wMax+"-"+hMax+"-"+wMax+"-"+key;
    }
    let inputDom = document.querySelector(`input[name=${eleName}]`);
    if(inputDom){
      inputDom.focus();
      inputDom.select();
    }
  }
  up(e,name,level,index,hMax,wMax,key){
    const {up} = this.props;
    if(!up){
      return;
    }
    e.preventDefault();
    let eleName = name+"-"+level+"-"+index+"-"+hMax+"-"+wMax+"-"+key;
    if(+level>1){
      eleName = name+"-"+(+level-1)+"-"+index+"-"+hMax+"-"+wMax+"-"+key;
    }
    if(document.querySelector(`input[name=${eleName}]`)){
      document.querySelector(`input[name=${eleName}]`).focus();
    }
  }
  down(e,name,level,index,hMax,wMax,key){
    const {down} = this.props;
    if(!down){
      return;
    }
    e.preventDefault();
    let eleName = name+"-"+level+"-"+index+"-"+hMax+"-"+wMax+"-"+key;
    if(+level<+hMax){
      eleName = name+"-"+(+level+1)+"-"+index+"-"+hMax+"-"+wMax+"-"+key;
    }
    if(document.querySelector(`input[name=${eleName}]`)){
      document.querySelector(`input[name=${eleName}]`).focus();
    }
  }
  //选择
  switchKey(type,e,name,level,index,hMax,wMax,key){
    switch (type) {
      case KEY.TAB:{
        this.tab(e,name,level,index,hMax,wMax,key);
        break;
      }
      case KEY.ENTER:{
        this.enter(e,name,level,index,hMax,wMax,key);
        break;
      }
      case KEY.LEFT:{
        this.left(e,name,level,index,hMax,wMax,key);
        break;
      }
      case KEY.UP:{
        this.up(e,name,level,index,hMax,wMax,key);
        break;
      }
      case KEY.RIGHT:{
        this.right(e,name,level,index,hMax,wMax,key);
        break;
      }
      case KEY.DOWN:{
        this.down(e,name,level,index,hMax,wMax,key);
        break;
      }
      default:
    }
  }
  render() {
    const {className,style} = this.props;
    return(
      <div className={className} style={style} ref={this.props.children.ref}>
        {this.props.children}
      </div>
    )
  }
}

InputFocus.propTypes = {
  left:PropTypes.bool,
  up:PropTypes.bool,
  right:PropTypes.bool,
  down:PropTypes.bool,
  enter:PropTypes.bool,
  className:PropTypes.string,
  style:PropTypes.object,
};
InputFocus.defaultProps = {
  left:true,
  up:true,
  right:true,
  down:true,
  enter:true,
  className:"",
  style:{},
};

export default InputFocus;
