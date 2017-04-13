//整体病历另存为模板
import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {Row,Col,Form,Input,Checkbox,Button,Select,message,Radio,Tooltip,Modal,Tree,Icon } from 'antd';
import {addCase,deleteCase,searchCase,addCaseDetailed,eidtCase} from "../../store/actions/CiteManage"
import {getUser} from "../../utils/User";
import ClinialItem from "../seeDoctor/ClinialItem";
import MedicineItem from "../seeDoctor/MedicineItem";
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const Option = Select.Option;
class PrescriptionTemplate extends Component {
  static defaultProps={
		title:"【整体病历】另存为模板",
		dealValue:""
	};
	static propTypes = {
		title:PropTypes.string,
		saveAsVisble:PropTypes.bool,
		saveAsOk:PropTypes.func,
		saveAsCancel:PropTypes.func,
		dealValue:PropTypes.string
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
    	medical:[],
    	defaluteMediciValue:[],
      defaluteClinilValue:[],
      mediciValue:[],
      clinilValue:[]
    }
  }
  //服务器端和客户端都只调用一次，在初始化渲染执行之前立刻调用。如果在这个方法内调用 setState，render() 将会感知到更新后的 state，将会执行仅一次，尽管 state 改变了。
  componentWillMount(){

  }

  //在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）。在生命周期中的这个时间点，组件拥有一个 DOM 展现，你可以通过 this.getDOMNode() 来获取相应 DOM 节点。
  componentDidMount(){
  	this.feachData();
  }
  //获取处理列表
  feachData(){
  	this.props.dispatch(searchCase({staff_id:getUser().doctor_id},(res)=>{
  		//console.dir(res);
  		if(res.status.toString()=="0"){
  			this.setState({
  				citeData:res.data
  			})
  		}
  	}))
  }
  //中医诊断
  onSelectClinia(data){

  	this.setState({
  		clinilValue:data
  	})
  }
  //西医诊断
  onSelectMedici(data){

  	this.setState({
  		mediciValue:data
  	})

  }
  componentWillReceiveProps(nextProps){
  	if(nextProps.saveAsVisble!= this.props.saveAsVisble){
  		this.setState({
  			visible:nextProps.saveAsVisble,
  			medical:nextProps.inintData.medical?nextProps.inintData.medical:[],
  			defaluteMediciValue:nextProps.inintData.mediciValue,
  			defaluteClinilValue:nextProps.inintData.clinilValue,
  			mediciValue:nextProps.inintData.mediciValue,
  			clinilValue:nextProps.inintData.clinilValue

  		})
  		//数据保存
  		setTimeout(()=>{
  			this.props.form.setFieldsValue(nextProps.inintData);
  		},100)
  	}
  }
  //病史
  checkboxOnChange(checkedValues){
    //console.log(checkedValues);
    this.setState({
    	medical:checkedValues
    })
  }
  handleOk(){
  	if(this.props.saveAsOk instanceof Function ){
  		this.props.saveAsOk();
  	}

  }
  handleCancel(){
  	if(this.props.saveAsCancel instanceof Function ){
  		this.props.saveAsCancel();

  	}
  }
  onSelect(selectedKeys,{selected, selectedNodes, node}){
  	//console.dir(node);
  	if(selected){
  		this.setState({
  			selectId:selectedKeys[0],
  			selectName:node.props.name
  		})
  	}else{
  		/*this.setState({
  			selectId:"",
  			selectName:""
  		})*/
  	}
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
	    	This.props.dispatch(deleteCase({staff_id:getUser().doctor_id,templet_id:id},(res)=>{
	    		if(res.status.toString()=="0"){
					  message.success('删除成功');
					  This.setState({
					  	citeData:This.state.citeData.filter((item)=>(item.templet_id.toString() !== id.toString()))
					  })
					}else{
					  message.error('删除失败');
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
  //新增病历模板
  addHandleOk(){
  	if(this.state.addValue.trim()){
	  	if(this.state.citeData.filter(item=>item.templet_name==this.state.addValue).length>0){
	  		 message.error(`${this.state.addValue}已存在`);
	  	}else{
	  		const postData = {
		  		staff_id:getUser().doctor_id,
		  		templet_name:this.state.addValue
		  	}
		  	this.props.dispatch(addCase(postData,(res)=>{
		  		if(res.status.toString()=='0'){
		  		  message.success('新增目录成功');
		  		  let  data = this.state.citeData;
		  		  data.push({templet_id:res.templet_id,templet_name:this.state.addValue})
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
  	}else{
  		 message.error('请填写目录名称');
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
  	if(this.state.eidtValue.trim()){
	  	if(this.state.citeData.filter(item=>item.templet_name==this.state.eidtValue).length>0){
	  		 message.error(`${this.state.eidtValue}已存在`);
	  	}else{
		  	this.props.dispatch(eidtCase({templet_id:this.state.selectId,templet_name:this.state.eidtValue},(res)=>{
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
	  }else{
  		 message.error('请填写目录名称');
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

    this.props.form.validateFields((err, values) => {
      if (!err && values.templet_name.trim()!="" ) {
        if(this.state.selectId!=""){
        	Modal.confirm({
					  title: '添加模板',
					  content: <span>确定将{values.templet_name}添加到{this.state.selectName}下</span>,
					  okText: '确定',
					  cancelText: '取消',
					  onOk(){
					  	let mediciValue = This.state.mediciValue.slice(0,This.state.mediciValue.length-1);
    					let clinilValue = This.state.clinilValue.slice(0,This.state.clinilValue.length-1);
					  	const postData = Object.assign({},{
					  		parent_id:This.state.selectId,
					  		staff_id:getUser().doctor_id,
					  		templet_name:values.templet_name,
					  		doctor_id:getUser().doctor_id,
					  		disease:This.state.selectName
					  	},{medic_check:mediciValue.concat(clinilValue)},
					  	{show_opt:This.props.form.getFieldsValue(["medical"]).medical?This.props.form.getFieldsValue(["medical"]).medical.toString():""})

					    delete  values.medical ;
					  	This.props.dispatch(addCaseDetailed( Object.assign({},
					  		values,postData),(res)=>{
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
      }else{
	      	message.error('模板名称不能为空格');
	    }
    });
  }

  render(){

  	const { getFieldDecorator,getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };
		const formItemLayout1 = {
      labelCol: { span: 5},
      wrapperCol: { span:19 },
    };
  	const loop = data => data.map((item) => {
      return <TreeNode key={item.templet_id} name={item.templet_name} title={<div className="addtemple">
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
      																							</div>} isLeaf={false}/>;
    });
    let plainOptions = ['既往史', '家族史', '经带待产史','体格检查','辅助检查'];

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
          				<TreeNode title={
          					<div className="addtemple">
	          					<span className="title-temp">模板</span>
	          					<span className="icon-hiden">
						        		<Tooltip placement="topLeft" title="新增目录" arrowPointAtCenter>
						        			<Icon type="addfolder" onClick={this.addCatalog.bind(this)}/>
						        		</Tooltip>
					        		</span>
				        		</div>} key="0-0">
          			 		{loop(this.state.citeData)}
          			 	 </TreeNode>
      					</Tree>
          		</div>
          	</Col>
          	<Col span={19}  className="model-right" >
	          	<Form className="clinical-content">
				        <div className="moban-name">
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
				        </div>
				        <div className="moban-content">
				         <FormItem
					          {...formItemLayout}
					          label="主诉:"
					        >
					          {getFieldDecorator('complaint')(
					            <Input />
					          )}
					        </FormItem>
					        <FormItem
					          {...formItemLayout}
					          label="现病史:"
					        >
					          {getFieldDecorator('now_his')(
					            <Input className="disease-textarea" type="textarea"/>
					          )}
					        </FormItem>
					        <FormItem
					          {...formItemLayout}
					          label="过敏史:"
					        >
					          {getFieldDecorator('all_his')(
					            <Input placeholder="" />
					          )}
					        </FormItem>
					        <FormItem
					          {...formItemLayout}
					          label="病史:"
					        >
					          {getFieldDecorator('medical')(
					           	<CheckboxGroup options={plainOptions} onChange={this.checkboxOnChange.bind(this)}/>
					          )}
					        </FormItem>
					        <div>{
					        	this.state.medical.includes("既往史")?(
					        		<FormItem
							          {...formItemLayout}
							          label="既往史"
							        >
							          {getFieldDecorator('past_his')(
							          	<Input placeholder="" />
							          )}
							        </FormItem> ):""
					        }</div>
					        <div>{
					        	this.state.medical.includes("家族史")?(
					        		<FormItem
							          {...formItemLayout}
							          label="家族史"
							        >
							          {getFieldDecorator('family_his')(
							          	<Input placeholder="" />
							          )}
							        </FormItem>  ):""
					        }</div>
					        <div className="jingdaishi ">{
					        	this.state.medical.includes("经带待产史")?(
					        		<Row type="flex" justify="start">
					        			<Col xs={19} sm={15} md={16} lg={12}>
					        				<FormItem
													  {...formItemLayout1}
										        label="经带待产史:"
									        >
									          {getFieldDecorator('is_menopause')(
									          	<RadioGroup >
												        <Radio value={"1"}>已绝经</Radio>
												        <Radio value={"2"}>无生育要求</Radio>
												        <Radio value={"3"}>有生育要求</Radio>
												      </RadioGroup>
									          )}
									        </FormItem>
					        			</Col>
					        			<Col  xs={5} sm={5} md={5} lg={5}>
					        				<FormItem
									          {...formItemLayout1}
									        >
									          {getFieldDecorator('bear_his')(
										          <Input />
									          )}
									        </FormItem>
					        			</Col>
					        		</Row>
					        	):""
					        }</div>
					       	<div>{
					        	this.state.medical.includes("体格检查")?(
					        		<Row className="tigejiancha">
							       		<Col className="title" offset={2} span={3}>体格检查:</Col>
							       		<Col span={19} className="back-grd">
							       			<Col span={24}>
									       		<div className="div-1">
									       		 	T<FormItem
											         	wrapperCol={{span: 24}}
											          label=""
											        >
											          {getFieldDecorator('temperature')(
												          <Input placeholder="" />
											          )}
											        </FormItem>℃
									       		</div>
									       		<div className="div-2">
									       		 	P<FormItem
											         	wrapperCol={{span: 24}}
											          label=""
											        >
											          {getFieldDecorator('p_per')(
												          <Input placeholder="" />
											          )}
											        </FormItem>次/分
									       		</div>
									       		<div className="div-2">
									       		 	R<FormItem
											         	wrapperCol={{span: 24}}
											          label=""
											        >
											          {getFieldDecorator('r_per')(
												          <Input placeholder="" />
											          )}
											        </FormItem>次/分
									       		</div>
									       		<div className="div-2">
									       		 	BP
									       		 	<FormItem
											         	wrapperCol={{span: 24}}
											          label=""
											        >
											          {getFieldDecorator('bp_up')(
												          <Input placeholder="" />
											          )}
											        </FormItem>
											       /<FormItem
											         	wrapperCol={{span: 24}}

											        >
											          {getFieldDecorator('bp_down')(
												          <Input placeholder="" />
											          )}
											        </FormItem>m
									       		</div>
								       		</Col>
								       		<Col span={24}>
								       			<div className="div-2">
									       			<span>舌质:</span>
									       			<FormItem
											         	wrapperCol={{span: 24}}

											        >
											          {getFieldDecorator('tongue_name')(
												          <Select  style={{ width: 80 }}>
															      <Option value="jack">Jack</Option>
															      <Option value="lucy">Lucy</Option>
															    </Select>
											          )}
											        </FormItem>
									       		</div>
									       		<div className="div-2">
									       			<span>舌苔:</span>
									       			<FormItem
											         	wrapperCol={{span: 24}}

											        >
											          {getFieldDecorator('tongue_coat_name')(
												          <Select style={{ width: 80 }}>
															      <Option value="jack">Jack</Option>
															      <Option value="lucy">Lucy</Option>
															    </Select>
											          )}
											        </FormItem>
									       		</div>
									       		<div className="div-2">
									       			<span>脉象:</span>
									       			<FormItem
											         	wrapperCol={{span: 24}}

											        >
											          {getFieldDecorator('pluse_name')(
											          	<Select style={{ width: 80 }}>
															      <Option value="jack">Jack</Option>
															      <Option value="lucy">Lucy</Option>
															    </Select>
											          )}
											        </FormItem>
									       		</div>
								       		</Col>
								       		<Col span={24}  className="text-colare">
								       			<FormItem
										          wrapperCol={{span: 24}}

										        >
										          {getFieldDecorator('physique_check')(
										          	<Input className="disease-textarea" type="textarea" rows={4} />
										          )}
										        </FormItem>
								       		</Col>
							       		</Col>

							        </Row>):""
					        }</div>
					        <div>{
					        	this.state.medical.includes("辅助检查")?(
					        		<div>
							        	<FormItem
								          {...formItemLayout}
								          label="辅助检查"
								        >
								          {getFieldDecorator('other_check')(
								          	<Input placeholder="" type="textarea" rows={4}/>
								          )}
								        </FormItem>
							        </div> ):""
					        }</div>

					        <Row type="flex" justify="space-around" align="top" style={{"marginBottom":"10px"}}>
					        	<Col span={9} offset={1}>
					        		<Row type="flex" justify="space-around" align="top">
							        	<Col span={1}>
							        	中医诊断:
							        	</Col>
							        	<Col span={23}>
							        	<ClinialItem
							        		onSelectClinia={this.onSelectClinia.bind(this)}
			        						defaluteClinilValue={this.state.defaluteClinilValue}/>
							        	</Col>
							        </Row>
					        	</Col>
					        	<Col span={13} >
						        	<Row type="flex" justify="space-around" align="top">
								        <Col span={1}>
								        	西医诊断:
								        </Col>
								        <Col span={23}>
								        	<MedicineItem
								        		onSelectMedici={this.onSelectMedici.bind(this)}
			        							defaluteMediciValue={this.state.defaluteMediciValue}/>
								        </Col>
								      </Row>
					        	</Col>
					        </Row>
					        <FormItem
								    {...formItemLayout}
								     label="处理"
								  >
								  {getFieldDecorator('process')(
								          <Input type="textarea"  rows={4}    />
								  )}
								  </FormItem>
					      </div>
				      </Form>

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

PrescriptionTemplate.contextTypes={
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state){
  return state
}
PrescriptionTemplate = Form.create({})(PrescriptionTemplate);
export default connect(mapStateToProps)(PrescriptionTemplate)
