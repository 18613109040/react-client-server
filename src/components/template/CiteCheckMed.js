//引用【检验检查】
import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {Row,Col,Form,Input,Checkbox,Button,Select,message,Radio,Tooltip,Modal,Tree,Icon,Table } from 'antd';
import {getUser} from "../../utils/User";
import {getQueryRecipeTempletTree,addpersonalrecipetemplet,addRecipeTempletDetailed,
		queryRecipeTempletDetail,deleterecipetemplet,modifyrecipetemplet} from "../../store/actions/UsePreTemplate";
import {templateUpdatamodify} from "../../store/actions/CheckMedicine";
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const Option = Select.Option;
class CiteCheckMed extends Component {
  static defaultProps={
		title:"引用【检验检查】模板",
		
	};
	static propTypes = {
		title:PropTypes.string,
		overAllOk:PropTypes.func,
		overAllCancel:PropTypes.func,
		overAllVisble:PropTypes.bool,
		checkId:PropTypes.number
	};
  constructor(props){
    super(props);
    this.state={
    	visible:false,
    	defaluteMediciValue:[],
      defaluteClinilValue:[],
      medical:[],
      selectId:"",
      selectName:"",
      citeData:[],
      getData:[],
      selectAll:[],
      selectData:[]
    }
  }
  //服务器端和客户端都只调用一次，在初始化渲染执行之前立刻调用。如果在这个方法内调用 setState，render() 将会感知到更新后的 state，将会执行仅一次，尽管 state 改变了。
  componentWillMount(){
  	
  }

  //在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）。在生命周期中的这个时间点，组件拥有一个 DOM 展现，你可以通过 this.getDOMNode() 来获取相应 DOM 节点。
  componentDidMount(){
  	
  
  }
  //获取处理列表
  feachData(parent_id){
  	const postData = {
  		page_no:'1',
  		page_size:"100",
  		parent_id:parent_id,
  		staff_id:getUser().doctor_id
  	}
  	this.props.dispatch(getQueryRecipeTempletTree(postData,(res)=>{
  		//console.dir(res);
  		if(res.status.toString()=="0"){
  			if(res.data && res.data.list.length>0)
  			this.setState({
  				citeData:res.data.list
  			})
  		}
  	}))
  }
 
  componentWillReceiveProps(nextProps){
  
  	if(nextProps.overAllVisble!= this.props.overAllVisble){
  		
  		this.setState({
  			visible:nextProps.overAllVisble,
  			
  		})
  		
  	}
  	
  }
  //引用
  overAllOk(){
  	//console.dir(this.state.selectData);
  	if(this.state.selectData.length>0)
  		this.props.dispatch(templateUpdatamodify(this.props.checkId,this.state.selectData));
  	if(this.props.overAllOk instanceof Function ){
  		this.props.overAllOk(this.state.getData);
  	}
  		
  }
  //关闭
  overAllCancel(){
  	if(this.props.overAllCancel instanceof Function ){
  		this.props.overAllCancel();
  		
  	}
  }
  //树选择
  onSelect(selectedKeys,{selected, selectedNodes, node}){
  	
  	if(selected){
  		if(selectedNodes[0].props["data-isLeaf"]){
  			let getData =  {
  				page_no:"1",
  				page_size:"100",
  				templet_id:selectedKeys
  			}
  			this.props.dispatch(queryRecipeTempletDetail(getData,(res)=>{
  				if(res.status == '0'){
  					let num = [];
  					for(let i=0;i<res.data.list.length;i++){
		  				num.push(i);
		  				Object.assign(res.data.list[i],{no:res.data.list[i].quantity},{standard:res.data.list[i].unit},{check:true})
			  		}
	  				this.setState({
	  					getData:res.data.list,
	  					selectAll:num,
	  					selectData:res.data.list
	  				})
  				}
  			}))
  		}
  	}else{
  		this.setState({
  			selectId:"",
  			selectName:""
  		})
  	}
  }
  onLoadData(treeNode) {
  	
  	const postData = {
  		page_no:'1',
  		page_size:"100",
  		parent_id:treeNode.props.eventKey,
  		staff_id:getUser().doctor_id
  	}
  	return new Promise((resolve) => {
	  	this.props.dispatch(getQueryRecipeTempletTree(postData,(res)=>{
	  		
	  		if(res.status.toString()=="0"){
	  			let tem = this.state.citeData;
	  			if(res.data && res.data.list.length>0){
		  			if(tem.filter(data => data.templet_id == treeNode.props.eventKey).length>0){
		  				tem.map((data)=>{
			  				if(data.templet_id == treeNode.props.eventKey){
			  					data.children = res.data.list
			  				} 
			  			})
		  				
		  				this.setState({
				  			citeData:tem
				  		})
		  			}else{
		  				res.data.list.map(data=>data.eventkey=3)
		  				this.setState({
				  			citeData:res.data.list
				  		})
		  			}
	  			}
		  		
		  		resolve();
	  		}
	  	}))
  	});
  
  }
  render(){
  	
  	const columns = [{
		  title: '项目名称',
		  dataIndex: 'item_name'
		}, {
		  title: '数量',
		  dataIndex: 'no',
		}, {
		  title: '单位',
		  dataIndex: 'standard',
		}];
		const rowSelection = {
			selectedRowKeys:this.state.selectAll,
		  onChange: (selectedRowKeys, selectedRows) => {
		  	this.setState({
		  		selectAll:selectedRowKeys
		  	})
		    
		  },
		  onSelect: (record, selected, selectedRows) => {
		  	
		  	let tem = this.state.selectData;
		  	if(selected){
		  		tem.map((data)=>{
				    if(record.item_id == data.item_id){
				    	data.check = true;
				    }
			    })
		  	}else{
		  		tem.map((data)=>{
				    if(record.item_id == data.item_id){
				    	data.check = false;
				    }
			    })
		  	}
		    this.setState({
		    	selectData:tem
		    })
		  },
		  onSelectAll: (selected, selectedRows, changeRows) => {
		    let tem = this.state.selectData;
		    tem.map((data)=>{
		    	if(selectedRows.length == 0){
		    		data.check = false;
		    	}else{
		    		
			    	data.check = true;
			    		
			    }
		    	
		    })
		    this.setState({
		    	selectData:tem
		    })
		  },
		};
    const loop = data => data.map((item) => {
      if(item.children){
        return <TreeNode title={item.templet_name} className="title-temp" key={item.templet_id} data-isLeaf={false} >{loop(item.children)}</TreeNode>;
      }
      return <TreeNode title={item.templet_name}  className="title-temp" key={item.templet_id} data-isLeaf={true} isLeaf={item.eventkey?false:true} />;
    });
    return(
      <div className="prescriptionTemplate">
      	<Modal 
      		title={this.props.title}
      		maskClosable={false}
      		visible={this.state.visible}
          onCancel={this.overAllCancel.bind(this)}
          width={"80%"}
          style={{minWidth:"900px"}}
          footer={false}
          wrapClassName="citeManageModel"
        >
          <Row type="flex" justify="space-around" align="top"  className="content">
          	<Col span={5} className="model-left">
          		<div className="title">选择类别:</div>
          		<div className="tree-left">
          			<Tree
					        onSelect={this.onSelect.bind(this)} 
					        loadData={this.onLoadData.bind(this)}
					      >
          				<TreeNode 
          					title="检验检查"
					        	key="3">
          			 		{loop(this.state.citeData)} 
          			 	 </TreeNode>
      					</Tree>
          		</div>
          	</Col>
          	<Col span={19} className="model-right" >
          		<div>
          			<Table 
				      		columns={columns}
							    dataSource={this.state.getData}
							    size="small"
							    rowSelection={rowSelection}
							    rowKey={(record,index) => index} 
				      	/>
          		</div>
          		<div className="button-oper">
          			<Button className="button-green" onClick={this.overAllCancel.bind(this)}>取消</Button>
                <Button className="button-red" onClick={this.overAllOk.bind(this)}>引用</Button>
          		</div>
          	</Col>
          </Row>
        </Modal>
      </div>
    );
  }
}

CiteCheckMed.contextTypes={
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state){
  return state
}
export default connect(mapStateToProps)(CiteCheckMed)
