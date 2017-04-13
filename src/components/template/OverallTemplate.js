//引用【整体病历】
import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {Row,Col,Form,Input,Checkbox,Button,Select,message,Radio,Tooltip,Modal,Tree,Icon } from 'antd';
import {addCase,deleteCase,searchCase,searchCaseDetailed} from "../../store/actions/CiteManage"
import {getUser} from "../../utils/User";
import ClinialItem from "../seeDoctor/ClinialItem";
import MedicineItem from "../seeDoctor/MedicineItem";
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const confirm = Modal.confirm;
class OverallTemplate extends Component {
  static defaultProps={
		title:"引用【整体病历】模板",
		
	};
	static propTypes = {
		title:PropTypes.string,
		overAllOk:PropTypes.func,
		overAllCancel:PropTypes.func,
		overAllVisble:PropTypes.bool
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
      getData:{}
    }
  }
  //服务器端和客户端都只调用一次，在初始化渲染执行之前立刻调用。如果在这个方法内调用 setState，render() 将会感知到更新后的 state，将会执行仅一次，尽管 state 改变了。
  componentWillMount(){
  	
  }

  //在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）。在生命周期中的这个时间点，组件拥有一个 DOM 展现，你可以通过 this.getDOMNode() 来获取相应 DOM 节点。
  componentDidMount(){
  	
  
  }
  //获取处理列表
  feachData(){
  	this.props.dispatch(searchCase({staff_id:getUser().doctor_id},(res)=>{
  	//	console.dir(res);
  		if(res.status.toString()=="0"){
  			this.setState({
  				citeData:res.data
  			})
  		}
  	}))
  }
 
  componentWillReceiveProps(nextProps){
  //	console.dir(nextProps)
  	if(nextProps.overAllVisble!= this.props.overAllVisble){
  		this.feachData();
  		this.setState({
  			visible:nextProps.overAllVisble,
  			//medical:nextProps.inintData.medical?nextProps.inintData.medical:[],
  			//defaluteMediciValue:nextProps.inintData.mediciValue,
  			//defaluteClinilValue:nextProps.inintData.clinilValue
  		})
  		//数据保存
  		//setTimeout(()=>{
  		//	this.props.form.setFieldsValue(nextProps.inintData);
  		//},100)
  		
  	}
  	
  }
  //引用
  overAllOk(){
  	const This = this;
  	confirm({
	    title: '引用整体模板',
	    content: '引用整体模板，将覆盖已编辑内容，是否引用',
	    onOk(){
	      if(This.props.overAllOk instanceof Function ){
		  		This.props.overAllOk(This.state.getData);
		  	}
	    },
	    onCancel() {},
	  });
  	
  		
  }
  //关闭
  overAllCancel(){
  	if(this.props.overAllCancel instanceof Function ){
  		this.props.overAllCancel();
  		
  	}
  }
  //树选择
  onSelect(selectedKeys,{selected, selectedNodes, node}){
  	//console.dir(node);
  	if(selected){
  		if(selectedNodes[0].props["data-isLeaf"]){
  			this.props.dispatch(searchCaseDetailed({
  																						templet_id:selectedKeys[0],
  																						},(res)=>{
		  		
		  		if(res.status.toString()=="0"){
		  			if(res.data.length>0){
		  				 	
					    	let medical = [];
					    	let medata = [];
	    					let cldata = [];
	    					medical = res.data[0].show_opt.split(',');
	    					if(res.data[0].medic_check){
				    			medata = res.data[0].medic_check.filter(item=>item.check_type == '2');
				    			cldata = res.data[0].medic_check.filter(item=>item.check_type == '1');
				    		}
						    this.setState({
					  			selectId:selectedKeys[0],
					  			selectName:node.props.name,
					  			medical:medical,
					  			getData:Object.assign({},res.data[0],{medical:medical},{medata:medata},{cldata:cldata}),
					  			defaluteMediciValue:medata,
		  						defaluteClinilValue:cldata
					  		})	
					  		
					  		this.props.form.setFieldsValue(Object.assign({},res.data[0],{medical:medical}));
		  			}
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
  render(){
  	
  	const { getFieldDecorator,getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };
    let plainOptions = ['既往史', '家族史', '经带待产史','体格检查','辅助检查'];
    
    const loop = data => data.map((item) => {
      if (item.list) {
        return <TreeNode title={item.templet_name} className="title-temp" key={item.templet_id} data-isLeaf={false} >{loop(item.list)}</TreeNode>;
      }
      return <TreeNode title={item.templet_name} className="title-temp" key={item.templet_id} data-isLeaf={true}  />;
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
					        
					      >
          			 	{loop(this.state.citeData)} 
      					</Tree>
          		</div>
          	</Col>
          	<Col span={19} className="model-right" >
	          	<Form className="clinical-content">
				         <FormItem
					          {...formItemLayout}
					          label="主诉:"
					        >
					          {getFieldDecorator('complaint')(
					            <Input disabled={true}/>
					          )}
					        </FormItem>
					        <FormItem
					          {...formItemLayout}
					          label="现病史:"
					        >
					          {getFieldDecorator('now_his')(
					            <Input className="disease-textarea" type="textarea" disabled={true}/>
					          )}
					        </FormItem>
					        <FormItem
					          {...formItemLayout}
					          label="过敏史:"
					        >
					          {getFieldDecorator('all_his')(
					            <Input placeholder="" disabled={true}/>
					          )}
					        </FormItem>
					        <FormItem
					          {...formItemLayout}
					          label="病史:"
					        >
					          {getFieldDecorator('medical')(
					           	<CheckboxGroup options={plainOptions} disabled  />
					          )}
					        </FormItem>
					        <div>{
					        	this.state.medical.includes("既往史")?(
					        		<FormItem
							          {...formItemLayout}
							          label="既往史"
							        >
							          {getFieldDecorator('past_his')(
							          	<Input placeholder="" disabled={true} />
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
							          	<Input placeholder="" disabled={true}/>
							          )}
							        </FormItem>  ):""
					        }</div>
					        <div className="jingdaishi ">{
					        	this.state.medical.includes("经带待产史")?(
					        		<FormItem
							          {...formItemLayout}
							          label="经带待产史:"
							        >
							          {getFieldDecorator('is_menopause')(
							          	<RadioGroup disabled >
										        <Radio value={1}>已绝经</Radio>
										        <Radio value={2}>无生育要求</Radio>
										        <Radio value={3}>有生育要求</Radio>
										      </RadioGroup>
							          )}
							          <div className="div-1"><Input placeholder="" value={this.state.bear_his} /></div>
							        </FormItem>
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
												          <Input placeholder="" disabled={true}/>
											          )}
											        </FormItem>℃
									       		</div>
									       		<div className="div-2">
									       		 	P<FormItem
											         	wrapperCol={{span: 24}}
											          label=""
											        >
											          {getFieldDecorator('p_per')(
												          <Input placeholder="" disabled={true}/>
											          )}
											        </FormItem>次/分
									       		</div>
									       		<div className="div-2">
									       		 	R<FormItem
											         	wrapperCol={{span: 24}}
											          label=""
											        >
											          {getFieldDecorator('r_per')(
												          <Input placeholder="" disabled={true}/>
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
												          <Input placeholder="" disabled={true} />
											          )}
											        </FormItem>
											       /<FormItem
											         	wrapperCol={{span: 24}}
											         
											        >
											          {getFieldDecorator('bp_down')(
												          <Input placeholder="" disabled={true}/>
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
												          <Select  style={{ width: 80 }} disabled>
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
												          <Select style={{ width: 80 }} disabled>
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
											          	<Select style={{ width: 80 }} disabled>
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
										          	<Input className="disease-textarea" type="textarea" rows={4} disabled={true}/>
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
								          	<Input placeholder="" type="textarea" rows={4} disabled={true}/>
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
							        		listDisable={true}
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
								        		listDisable={true}
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
								          <Input type="textarea"  rows={4}   disabled={true} />
								  )}
								  </FormItem>
								        
					      
				      </Form>
          		
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

OverallTemplate.contextTypes={
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state){
  return state
}
OverallTemplate = Form.create({})(OverallTemplate);
export default connect(mapStateToProps)(OverallTemplate)
