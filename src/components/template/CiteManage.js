//处理模板
import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {Icon ,Button,Row,Col,Modal,Tree,Input } from 'antd';
import {searchHandle,queryHandleTempletde} from "../../store/actions/CiteManage"
import {getUser} from "../../utils/User";
const TreeNode = Tree.TreeNode;
const confirm = Modal.confirm;
class CiteManage extends Component {
  static defaultProps={
		title:"引用【处理】模板"
	};
	static propTypes = {
		title:PropTypes.string,
		visible:PropTypes.bool,
		handleOk:PropTypes.func,
		handleCancel:PropTypes.func
	};
  constructor(props){
    super(props);
    this.state={
    	visible:false,
    	citeData:[],
    	handle:""
    }
  }
  //服务器端和客户端都只调用一次，在初始化渲染执行之前立刻调用。如果在这个方法内调用 setState，render() 将会感知到更新后的 state，将会执行仅一次，尽管 state 改变了。
  componentWillMount(){}

  //在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）。在生命周期中的这个时间点，组件拥有一个 DOM 展现，你可以通过 this.getDOMNode() 来获取相应 DOM 节点。
  componentDidMount(){
  	
  }
  //获取处理列表
  feachData(){
  	this.props.dispatch(searchHandle({staff_id:getUser().doctor_id},(res)=>{
  		//console.dir(res);
  		if(res.status.toString()=="0"){
  			this.setState({
  				citeData:res.data
  			})
  		}
  	}))
  }
  componentWillReceiveProps(nextProps){
  	
  	if(nextProps.visible!= this.props.visible){
  		this.setState({
  			visible:nextProps.visible
  		})
  		this.feachData();
  	}
  	
  }
  handleOk(){
  	
  	const This = this;
  	confirm({
	    title: '引用处理模板',
	    content: '引用处理模板，将覆盖已编辑内容，是否引用',
	    onOk(){
	      if(This.props.handleOk instanceof Function ){
		  		This.props.handleOk(This.state.handle);
		  	}
	    },
	    onCancel() {},
	  });
  	
  		
  }
  handleCancel(){
  	if(this.props.handleCancel instanceof Function ){
  		this.props.handleCancel();
  	}
  		
  	
  }
  //查询处理模板详情
  onSelect(selectedKeys,{selected, selectedNodes, node}){
  	
  	if(selected){
  		if(selectedNodes[0].props["data-isLeaf"]){
  			this.props.dispatch(queryHandleTempletde({staff_id:getUser().doctor_id,
  																						templet_id:selectedKeys[0],
  																						page_no:"1",page_size:"10"},(res)=>{
		  		//console.dir(res);
		  		if(res.status.toString()=="0"){
		  			if(res.data && res.data.list.length>0){
		  				this.setState({
		  					handle:res.data.list[0].handle
		  				})
		  			}
		  		}
		  	}))
  		}
  		
  	}
  	
  	
  }
  render(){
  	
  	const loop = data => data.map((item) => {
  		
      if (item.list && item.list.length) {
        return <TreeNode key={item.templet_id}  className="title-temp"  title={item.templet_name} data-isLeaf={false} >{loop(item.list)}</TreeNode>;
      }
      return <TreeNode key={item.templet_id}  className="title-temp" title={item.templet_name} data-isLeaf={true}/>;
    });
    return(
      <div className="prescriptionTemplate">
      	<Modal title={this.props.title} 
      		maskClosable={false}
      		visible={this.state.visible}
         
          onCancel={this.handleCancel.bind(this)}
          width={"80%"}
          style={{minWidth:"900px"}}
          footer={false}
          wrapClassName="citeManageModel"
        >
          <Row type="flex" justify="space-around" align="top"  className="content">
          	<Col span={5} className="model-left">
          		<div className="title">选择类别:</div>
          		<div className="tree-left addtemple">
          			<Tree
					        onSelect={this.onSelect.bind(this)} 
					      >
          			 	{loop(this.state.citeData)}
      					</Tree>
          		</div>
          	</Col>
          	<Col span={19}  className="model-right">
          		<div className="title">模板内容:</div>
          		<div className="right-content">
          			<Input type="textarea"  value={this.state.handle} rows={7}/>
          		</div>
          		<div className="button-oper">
          			<Button className="button-green" onClick={this.handleCancel.bind(this)} >取消</Button>
                <Button className="button-red" onClick={this.handleOk.bind(this)} >引用</Button>
          		</div>
          	</Col>
          </Row>
        </Modal>
      </div>
    );
  }
}

CiteManage.contextTypes={
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state){
  return state
}

export default connect(mapStateToProps)(CiteManage)
