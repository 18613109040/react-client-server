/**
 * Created by Administrator on 2016/9/13.
 */
import React, {Component, PropTypes}  from "react";
import {Icon,Modal,Button ,Row,Col,Alert } from 'antd';
let isdrag=false;
let y,x,nTY,nTX;
let oDragObj;
export default class PictureNav extends Component {
 	constructor(props) {
    super(props);
    this.state={
    	visible:false,
    	changeImgId:0,
    	preshow:"",
    	winWidth:document.body.clientWidth||document.documentElement.clientWidth,
      winHeight:document.body.clientHeight||document.documentElement.clientHeight,
      num:0,
      isdrag:false,
      
    }
    this.static={
    	ie:document.all,
			nn6:document.getElementById&&!document.all
    }
   
    
  }
 	
  //鼠标移动
  moveMouse(e) {
	 	if (isdrag) {
		 	oDragObj.style.top  =  (this.static.nn6 ? nTY + e.clientY - y : nTY + event.clientY - y)+"px";
		 	oDragObj.style.left  =  (this.static.nn6 ? nTX + e.clientX - x : nTX + event.clientX - x)+"px";
		 	return false;
		}
	}
  //鼠标按下
  initDrag(e) {
  	if (e.preventDefault) {
      e.preventDefault();
   	}else {
      e.returnValue = false;
   	}
		let oDragHandle = this.static.nn6 ? e.target : event.srcElement;
		let topElement = "HTML";
		while (oDragHandle.tagName != topElement && oDragHandle.className != "dragAble") {
		 	oDragHandle = this.static.nn6 ? oDragHandle.parentNode : oDragHandle.parentElement;
		}
		if (oDragHandle.className=="dragAble") {
			isdrag = true;
			oDragObj = oDragHandle;
			nTY = parseInt(oDragObj.style.top+0);
			y = this.static.nn6 ? e.clientY : event.clientY;
		  nTX = parseInt(oDragObj.style.left+0);
			x = this.static.nn6 ? e.clientX : event.clientX;
			return false;
		}
	}
  //鼠标离开
  onmouseup(){
  	isdrag=false
  }
  componentDidMount(){
  
  }
  componentWillReceiveProps(){
  	
  }
  onClickImg(e){
  	const _this = this;
  	this.setState({
      	visible: true,
      	changeImgId:e.target.attributes["value"].value
    });
    setTimeout(function(){
	    if(_this.refs.imges){
	  		_this.fnWheel(_this.refs.imges,function (down,oEvent){
	  			_this.setState({
		        winWidth:oEvent.clientX,
		        winHeight:oEvent.clientY
		      })
					var oldWidth=this.offsetWidth;
					var oldHeight=this.offsetHeight;
					var oldLeft=this.offsetLeft;
					var oldTop=this.offsetTop;
					var scaleX=(oEvent.clientX-oldLeft)/oldWidth;//比例
					var scaleY=(oEvent.clientY-oldTop)/oldHeight;
					if (down){
						this.style.width=this.offsetWidth*0.9+"px";
						this.style.height=this.offsetHeight*0.9+"px";
					}
					else{
						this.style.width=this.offsetWidth*1.1+"px";
						this.style.height=this.offsetHeight*1.1+"px";
					}
					var newWidth=this.offsetWidth;
					var newHeight=this.offsetHeight;
				//	this.style.left=oldLeft-scaleX*(newWidth-oldWidth)+"px";
				//	this.style.top=oldTop-scaleY*(newHeight-oldHeight)+"px";
			  });
	  	}
    },100)
  }

  handleCancel() {
    this.setState({
      visible: false,
    });

  }
  //上一张
  PreClick(){

  	this.setState({
      changeImgId: parseInt(this.state.changeImgId)-1,
    });
    
    

  }
  //下一张
  NextClick(){

  	this.setState({
      changeImgId:  parseInt(this.state.changeImgId)+1,
    });

    
  }
  
  fnWheel(obj,fncc){
		obj.onmousewheel = fn;
		if(obj.addEventListener){
			obj.addEventListener('DOMMouseScroll',fn,false);
		}
		function fn(ev){
			var oEvent = ev || window.event;
			var down = true;
			if(oEvent.detail){
				down = oEvent.detail>0
			}else{
				down = oEvent.wheelDelta<0
			}
			if(fncc){
				fncc.call(this,down,oEvent);
			}
			if(oEvent.preventDefault){
				oEvent.preventDefault();
			}
			return false;
		}
	
		
  }
  //放大缩小事件
  enlargeOrNarrow(en){
    
	  var oldWidth=this.refs.imges.offsetWidth;
		var oldHeight=this.refs.imges.offsetHeight;
		var oldLeft=this.refs.imges.offsetLeft;
		var oldTop=this.refs.imges.offsetTop;
		var scaleX=(this.state.winWidth-oldLeft)/oldWidth;//比例
		var scaleY=(this.state.winHeight-oldTop)/oldHeight;
		
		if (en === "enlarge"){
			this.refs.imges.style.width=this.refs.imges.offsetWidth*1.1+"px";
			this.refs.imges.style.height=this.refs.imges.offsetHeight*1.1+"px";
		}
		else{
			
			this.refs.imges.style.width=this.refs.imges.offsetWidth*0.9+"px";
			this.refs.imges.style.height=this.refs.imges.offsetHeight*0.9+"px";
		}
		
		var newWidth=this.refs.imges.offsetWidth;
		var newHeight=this.refs.imges.offsetHeight;
	
		//this.refs.imges.style.left=oldLeft-scaleX*(newWidth-oldWidth)+"px";
		//this.refs.imges.style.top=oldTop-scaleY*(newHeight-oldHeight)+"px";
  }
  //放大
  enLarge(){
  	this.enlargeOrNarrow("enlarge");	
  }
  //缩小
  narrow(){
  	this.enlargeOrNarrow("narrow");
  }
  //旋转
  Rotate(){
  	
  	let	num = (this.state.num+90)%360;      
    this.refs.imges.style.transform = 'rotate('+num+'deg)';
  	this.setState({
  		num:num
  	})
  }
  
  render() {
  	let imgList:number[] = [];
    imgList =  this.props.imgList;
   
    return (
      <div className="pictrueNav">

       	<div>
       	 		{ parseInt(imgList.length)>0?(
       	 			imgList.map((data,id)=>(
	       	 				<div className="pictrueNavImg" key={id}>
	       	 					<img style={this.props.style}   src={data.url} onClick={this.onClickImg.bind(this)} value={id}/>
	       	 				</div>

	       	 			))
	       	 		):(<Col span={22} >
	       	 			 <Alert
								    message="友情提示"
								    description="该患者没有上传病情相关图片"
								    type="info"
								    showIcon
								  />
	       	 		</Col>)
       	 		}

       	</div>

       	 <Modal  visible={this.state.visible}
          onCancel={this.handleCancel.bind(this)}
          width="100%"
          height="100%"
          wrapClassName="pictureNavModel"
          maskClosable={false}
        >
       		<div className="imge-page"   >
       			<img style={{"width":"100%","position":"relative" }} onMouseUp={this.onmouseup.bind(this)} onMouseDown={this.initDrag.bind(this)}  onMouseMove={this.moveMouse.bind(this)}
       					ref="imges"   className="dragAble"  src={imgList.length>0?imgList[this.state.changeImgId].url:""}  />
       		</div>
       		<div className="pre" onClick={this.PreClick.bind(this)}  style={{"display":this.state.changeImgId>0?"":"none"}}></div>
       		<div className="next" onClick={this.NextClick.bind(this)} style={{"display":this.state.changeImgId<imgList.length-1?"":"none"}}></div>
       	 {/*<Row type="flex" justify="space-around" align="middle">
			<Col span={3} offset={1}><div className="pre" onClick={this.PreClick.bind(this)}  style={{"display":this.state.changeImgId>0?"":"none"}}></div></Col>
			<Col span={14} style={{"textAlign": "center"}}></Col>
			<Col span={3} offset={1} ><div className="next" onClick={this.NextClick.bind(this)} style={{"display":this.state.changeImgId<imgList.length-1?"":"none"}}></div></Col>
		</Row>*/}

					<Row type="flex" justify="space-around" align="middle" className="actionBar" >
						<Col span={2}><div className="enlarge" onClick={this.enLarge.bind(this)}></div></Col>
						<Col span={2}><div className="narrow" onClick={this.narrow.bind(this)}></div></Col>
						<Col span={2}><div className="download" onClick={this.Rotate.bind(this)} ></div></Col>
					</Row>
        </Modal>
      </div>
    )
  }
}
