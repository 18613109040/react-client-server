//中西成药另存为模板
import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {Icon ,Button,Row,Col,Modal,Tree,Input,Tooltip,Form,message,Table  } from 'antd';
import {getUser} from "../../utils/User";
import {getQueryRecipeTempletTree,addpersonalrecipetemplet,addRecipeTempletDetailed,
		queryRecipeTempletDetail,deleterecipetemplet,modifyrecipetemplet} from "../../store/actions/UsePreTemplate";
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;

class ZXMedicineTemplate extends Component {
  static defaultProps={
		title:"【中西成药】另存为模板",
		dealValue:""
	};
	static propTypes = {
		title:PropTypes.string,
		saveVisble:PropTypes.bool,
		saveHandleOk:PropTypes.func,
		saveHandleCancel:PropTypes.func,
		dealValue:PropTypes.string,
		checkId:PropTypes.string
	};
  constructor(props){
    super(props);
    this.state={
    	visible:false,
    	addVisible:false,
    	addValue:"",
    	eidtVisible:false,
    	eidtValue:"",
    	selectId:"",
    	selectName:"",
    	citeData:[],
    	saveData:[],
    	selectData:[]
    }
  }
  //服务器端和客户端都只调用一次，在初始化渲染执行之前立刻调用。如果在这个方法内调用 setState，render() 将会感知到更新后的 state，将会执行仅一次，尽管 state 改变了。
  componentWillMount(){

  }

  //在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）。在生命周期中的这个时间点，组件拥有一个 DOM 展现，你可以通过 this.getDOMNode() 来获取相应 DOM 节点。
  componentDidMount(){
		setTimeout(()=>{			
			this.feachData();
		},2000)
  }
  //获取中西成药列表
  feachData(){
  	const postData = {
  		page_no:'1',
  		page_size:"100",
  		parent_id:"2",
  		staff_id:getUser().doctor_id
  	}
  	this.props.dispatch(getQueryRecipeTempletTree(postData,(res)=>{

  		if(res.status.toString()=="0"){
  			if(res.data && res.data.list.length>0)
  			this.setState({
  				citeData:res.data.list
  			})
  		}
  	}))
  }
  componentWillReceiveProps(nextProps){
  	if(nextProps.saveVisble!= this.props.saveVisble){
  		let num = [];
  		for(let i=0;i<nextProps.checkRecipeList[this.props.checkId].items.length - 1;i++){
	  		num.push(i)
	  	}
  		this.setState({
  			visible:nextProps.saveVisble,
  			saveData:nextProps.checkRecipeList[this.props.checkId].items.slice(0,-1),
  			selectData:nextProps.checkRecipeList[this.props.checkId].items.slice(0,-1),
  			selectAll:num
  		})

  	}
  }
  handleOk(){
  	if(this.props.saveHandleOk instanceof Function ){
  		this.props.saveHandleOk();
  	}
  }
  handleCancel(){
  	if(this.props.saveHandleCancel instanceof Function ){
  		this.props.saveHandleCancel();

  	}
  }
  onSelect(selectedKeys,{selected, selectedNodes, node}){

  	/*const getData = {
  		page_no : '1',
  		page_size : "10",
  		templet_id : selectedKeys[0]
  	}
  	this.props.dispatch(queryRecipeTempletDetail(getData,(res)=>{
  		console.dir(res);
  	}))*/
  	if(selected){
  		this.setState({
  			selectId:selectedKeys[0],
  			selectName:node.props.name
  		})
  	}
		// else{
  	// 	this.setState({
  	// 		selectId:"",
  	// 		selectName:""
  	// 	})
  	// }
  }
  //新增目录
  addCatalog(){
  	this.setState({
  		addVisible:true
  	})
  }
  //删除目录
  deleteCatalog(e){
  	const This = this ;
  	const {id,name} = e.currentTarget.dataset;
  	Modal.confirm({
	    title: '删除',
	    content: <span >是否删除<span style={{"color":"red"}}>[{name}]</span>目录</span>,
	    okText: '确定',
	    cancelText: '取消',
	    onOk(){
	    	This.props.dispatch(deleterecipetemplet({staff_id:getUser().doctor_id,templet_id:id},(res)=>{
	    		if(res.status.toString()=="0"){
					  message.success('删除成功');
					  This.setState({
					  	citeData:This.state.citeData.filter((item)=>(item.templet_id.toString() !== id.toString()))
					  })
					}else{
					  message.error(res.message);
					}
	    	}))
	    },
	    onCancel() {},
	  });
  }
  //修改目录
  eidtCatalog(e){
  	const {id,name} = e.currentTarget.dataset;
  	this.setState({
		  eidtVisible:true,
		  eidtValue:name,
		  selectId:id
		})
  }
  //新增目录提交按键
  addHandleOk(){
  	const postData = {
  		parent_id:'2',
  		staff_id:getUser().doctor_id,
  		templet_name:this.state.addValue
  	}
		if(this.state.citeData.filter(item=>item.templet_name==this.state.addValue).length>0){
       message.error(`${this.state.addValue}已存在`);
    }else{
			this.props.dispatch(addpersonalrecipetemplet(postData,(res)=>{
				if(res.status.toString()=='0'){
					message.success('新增目录成功');
					let  data = this.state.citeData;
					data.push({templet_id:res.data.templet_id,templet_name:res.data.templet_name,parent_id:res.data.parent_id})
					this.setState({
						addVisible:false,
						addValue:"",
						citeData:data
					})
				}else{
					message.error(res.message);
				}
			}))
		}

  }
  //
  addHandleCancel(){
  	this.setState({
  		addVisible:false,
  		addValue:""
  	})
  }
  //
  onChangeUserName(e){
  	this.setState({
  		addValue:e.target.value
  	})
  }
  //修改
  onEidtName(e){

  	this.setState({
  		eidtValue:e.target.value
  	})

  }
  //修改目录提交按键
  eidtHandleOk(){
		if(this.state.citeData.filter(item=>item.templet_name==this.state.eidtValue).length>0){
       message.error(`${this.state.eidtValue}已存在`);
    }else{
			this.props.dispatch(modifyrecipetemplet({templet_id:this.state.selectId,templet_name:this.state.eidtValue},(res)=>{
				if(res.status.toString()=="0"){
					message.success('修改成功');
					let data = this.state.citeData;
					data.map((item)=>{
						if(item.templet_id == this.state.selectId) {
							item.templet_name = this.state.eidtValue;
						}
					})
					this.setState({
						eidtVisible:false,
						citeData:data
					})

				}else{
					message.error(res.message);
				}
			}))
		}

  }
  eidtHandleCancel(){

  	this.setState({
  		eidtVisible:false
  	})

  }
  //保存
  onSave(e){
  	e.preventDefault();
  	const This = this ;
		if(this.state.addValue=="" && this.state.selectId.toString()=="0-0"){
			Modal.error({
				title: '模板添加错误',
				content: '另存为模板不可添加根目录上，请先创建模板目录',
			});
		}else{
			this.props.form.validateFields((err, values) => {
				if (!err && values.templet_name.trim()!="" ) {
					if (!err) {
						if(this.state.selectId!=""){
							Modal.confirm({
								title: '添加模板',
								content: <span>确定将<span style={{"color":"red"}}>[{values.templet_name}]</span>添加到<span style={{"color":"red"}}>[{this.state.selectName}]</span>下</span>,
								okText: '确定',
								cancelText: '取消',
								onOk(){
									let temp = [];

									This.state.selectData.map((data) =>(
										temp.push(Object.assign({},
											{item_id:data.item_id},   //药品id
											{item_code:data.item_code},   //药品code
											{item_name:data.item_name}, //药品name
											{usage_desc:data.usage_desc},   //用法
											{usage_id:data.usage_id},     //用法ID
											{total_amount:data.total_amount}, //总量
											{total_unit:data.item_unit},    //总量单位  total_unit
											{wst_taking_desc:data.wst_taking_desc}, //嘱咐
											{wst_spec:data.wst_spec},  //药品规格
											{item_amount:data.item_amount}, //每次剂量
											{item_unit:data.wst_taking_unit}, //每次剂量单位
											{wst_taking_times:data.wst_taking_times}, //频次
											{wst_taking_frequency:data.wst_taking_frequency},//频次周期
											{wst_taking_count:data.wst_taking_days}, //持续天数
										))
									))
									const saveData = {
										disease:This.state.selectName,
										parent_id:This.state.selectId,
										staff_id:getUser().doctor_id,
										templet_name:values.templet_name,
										templet_type:'5',//4 中药饮片, 5 中西成药 6检验检查, 7治疗理疗
										list:temp
									}
									This.props.dispatch(addRecipeTempletDetailed(saveData,(res)=>{

										if(res.status.toString()=="0"){
											message.success('添加成功');
											This.handleCancel();
										}else{
											message.error(res.message);
										}
									}))
								}
							});
						}else{
							Modal.error({
								title: '类别没选择',
								content: '请选择要将模板添加到的类别',
							});
						}
					}
				}else{
					message.error('模板名称不能为空格');
				}
			});
		}
  }
  render(){
    const columns = [{
      title: '药品名称',
      dataIndex: 'item_name',
      key: 'item_name',
    }, {
      title: '规格',
      dataIndex: 'wst_spec',
      key: 'wst_spec',
    }, {
      title: '每次剂量',
      dataIndex: 'item_amount',
      key: 'item_amount',
      render: (text,record,index) => {
        return (
          <span>{record.item_amount+record.wst_taking_unit}</span>
        )
      },
    },{
      title: '用法',
      dataIndex: 'usage_desc',
      key: 'usage_desc'
    },{
      title: '频次',
      dataIndex: 'wst_taking_times',
      key: 'wst_taking_times'
    },{
      title: '持续用药',
      dataIndex: 'wst_taking_days',
      key:'wst_taking_days',
      className: 'text-center',
      render: (text,record,index) => {
        return (
          <span>
            {record.wst_taking_days}天
          </span>
        )
      },
    },{
      title: '药品总量',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (text,record,index) => {
        return (
          <span>{record.total_amount+record.item_unit}</span>
        )
      },
    }, {
      title: '嘱咐',
      dataIndex: 'wst_taking_desc',
      key:'wst_taking_desc'
    }];
		const rowSelection = {
			selectedRowKeys:this.state.selectAll,
		  onChange: (selectedRowKeys, selectedRows) => {
		  	this.setState({
		  		selectAll:selectedRowKeys
		  	})

		  },
		  onSelect: (record, selected, selectedRows) => {

		    this.setState({
		    	selectData:selectedRows
		    })

		  },
		  onSelectAll: (selected, selectedRows, changeRows) => {

		     this.setState({
		    	selectData:selectedRows
		    })
		  },
		};
  	const { getFieldDecorator,getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 19 },
    };

  	const loop = data => data.map((item) => {
      return <TreeNode
      				key={item.templet_id}
      				name={item.templet_name}
      				title={<div className="addtemple">
      								<span className="title-temp">{item.templet_name}</span>
      								<span className="icon-hiden">
												<span>
													<Tooltip placement="topLeft" title="删除目录" arrowPointAtCenter>
														<Icon type="minus-circle-o" onClick={this.deleteCatalog.bind(this)} data-id={item.templet_id} data-name={item.templet_name}/>
													</Tooltip>
												</span>
												<span style={{"marginLeft": "10px"}}>
													<Tooltip placement="topLeft" title="修改目录" arrowPointAtCenter>
														<Icon type="edit" onClick={this.eidtCatalog.bind(this)} data-id={item.templet_id} data-name={item.templet_name}/>
													</Tooltip>
												</span>
											</span>
      							</div>}
      				isLeaf={false}/>;
    });
    return(
      <div className="prescriptionTemplate">
      	<Modal
      		title={this.props.title}
      		maskClosable={false}
      		visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
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
					        defaultExpandAll={true}
					      >
          				<TreeNode
          					title={
	          					<div className="addtemple">
		          					<span className="title-temp">中西成药</span>
		          					<span className="icon-hiden">
							        		<Tooltip placement="topLeft" title="新增目录" arrowPointAtCenter>
							        			<Icon type="addfolder" onClick={this.addCatalog.bind(this)}/>
							        		</Tooltip>
						        		</span>
					        		</div>
					        	}
					        	key="0-0">
          			 		{loop(this.state.citeData)}
          			 	 </TreeNode>
      					</Tree>
          		</div>
          	</Col>
          	<Col span={19} className="model-right">
	          	<Form>
				        <FormItem
				          {...formItemLayout}
				          label="模板名称:"
				        >
				          {getFieldDecorator('templet_name',{
				            rules: [{ required: true, message: '请填写模板名称' }],
				          })(
				            <Input />
				          )}
				        </FormItem>
				      </Form>
				      <div>
				      	<Table
				      		columns={columns}
							    dataSource={this.state.saveData}
							    size="small"
							    rowSelection={rowSelection}
							    rowKey={(record,index) => index}
									pagination={false}
				      	/>
				      </div>
          		<div className="button-oper">
          			<Button className="button-green" onClick={this.handleCancel.bind(this)}>取消</Button>
                <Button className="button-red" onClick={this.onSave.bind(this)}>保存</Button>
          		</div>
          	</Col>
          </Row>
        </Modal>

        <Modal
        	title="新增模板"
      		maskClosable={false}
      		visible={this.state.addVisible}
          footer={false}
          wrapClassName="citeAddtemplate"
          onCancel={this.addHandleCancel.bind(this)}
        >
        	<div className="mulu">
        		<span>目录名称:</span>
        		<span><Input onChange={this.onChangeUserName.bind(this)} value={this.state.addValue}/></span>
        	</div>
        	<div className="button-oper">
          	<Button className="button-green" onClick={this.addHandleOk.bind(this)}>确定</Button>
            <Button className="button-red" onClick={this.addHandleCancel.bind(this)}>取消</Button>
          </div>
        </Modal>

        <Modal
        	title="修改目录"
      		maskClosable={false}
      		visible={this.state.eidtVisible}
          footer={false}
          wrapClassName="citeAddtemplate"
          onCancel={this.eidtHandleCancel.bind(this)}
        >
        	<div className="mulu">
        		<span>目录名称:</span>
        		<span><Input onChange={this.onEidtName.bind(this)} value={this.state.eidtValue}/></span>
        	</div>
        	<div className="button-oper">
          	<Button className="button-green" onClick={this.eidtHandleOk.bind(this)}>修改</Button>
            <Button className="button-red" onClick={this.eidtHandleCancel.bind(this)}>取消</Button>
          </div>
        </Modal>
      </div>
    );
  }
}

ZXMedicineTemplate.contextTypes={
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state){
  return {
    checkRecipeList: state.zXPrescriptionInfo,     // 列表
  }
}
ZXMedicineTemplate = Form.create({})(ZXMedicineTemplate);
export default connect(mapStateToProps)(ZXMedicineTemplate)
