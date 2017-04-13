import React, {Component, PropTypes} from "react";
import {previewImage} from "../../utils/tools";
import BaseMes from "./BaseMes";
import PictureNav from "../../components/PictureNav";
export default class ImgMes extends BaseMes {
  constructor(props){
    super(props);
    this.plat = null;
    this.onImageClick = this.onImageClick.bind(this);
  }
  componentDidMount(){
    this.plat = "h5"
  }

  //-------------------------------------------------------------------------------------
  // 查看图片
  onImageClick(e){
    const curl = e.target.src;
    if (this.plat=='weixin') {
    }else {
      previewImage([curl]);
    }
  }
  text(){
    const {media_id,url,size} = this.props.mesObject.content;
    const config ={
    	imgList:[{"url":url}],
    	style:{
    		"width":"120px",
    		"height": "150px",
    	}
    }
   
    return (
      <div>
       <PictureNav {...config} />{/*<img src={url} onClick={this.onImageClick}/>*/}
      </div>
    )
  }
  render(){
    const {type, who} = this.state;
    return (
      <div className={`chat-mes img ${who}`}>
        {this.time()}
        {this.headImg()}
        {this.mesContent()}
      </div>
    )
  }

}
ImgMes.propTypes = {
  mesObject: PropTypes.object.isRequired
}
