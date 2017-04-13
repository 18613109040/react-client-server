/*
 * 操作
 */
import React, {Component, PropTypes} from "react";
import {Menu,Row,Col,Tag,Pagination,Button ,Spin } from 'antd';
class Operation extends Component {
  static defaultProps={
		inintData:[
		{
    	name:"引用整体模板",
    	icon:"icon-all-template"
    },{
    	name:"另存为模板",
    	icon:"icon-cpr-template"
    },{
    	name:"打印",
    	icon:"icon-print"
    },{
    	name:"一健清空",
    	icon:"icon-clear"
    }],
    saveLoading:false
    
	};
	static propTypes = {
    inintData:PropTypes.array,
    onClikOperation:PropTypes.func,
    saveLoading:PropTypes.bool
 
	};
  constructor(props){
    super(props);
    
  }
  componentDidMount(){

  }
   componentWillReceiveProps(nextProps){


  	if(nextProps.flage != this.props.flage){
  		this.setState({

  			flage:nextProps.flage
  		})
  	}

  }
  onClick(e){
  	e.preventDefault()
  	const {name} = e.currentTarget.dataset;
  	this.props.onClikOperation(name,e);
  }
  render(){

    return(
      <div className="operation-bar">
      	<Row  type="flex" justify="center" align="top">

      		<Col span={12} className="save-button">
      				<Button type="ghost" ><div data-name={"保存"} className={`iconfont icon-save`}  onClick={this.onClick.bind(this)}></div></Button>
      				<div>保存</div>
      		</Col>
      		<Col span={12} className="save-button">
      			{this.props.inintData.map((item,id)=>(
		      		<Col className={item.loading?"loading bar":"bar"} key={id} span={9}>
                <Spin spinning={item.loading?true:false} >
                  <Button type="ghost"><div className={`iconfont ${item.icon}`} data-name={item.name} onClick={this.onClick.bind(this)}></div></Button>
                  <div className="text">{item.name}</div>
                </Spin>
			      	</Col>
		      	))}

      		</Col>
      	</Row>


      </div>
    );
  }
}
Operation.contextTypes={
  router: React.PropTypes.object.isRequired
};

export default Operation
