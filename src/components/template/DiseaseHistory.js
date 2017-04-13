//引用【既往病历】
import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {Row,Col,Form,Input,Checkbox,Button,Select,message,Radio,Tooltip,Modal,Tree,Icon } from 'antd';
import {addCase,deleteCase,addHandle,medicrecordDetail} from "../../store/actions/CiteManage"
import {getUser} from "../../utils/User";
import ClinialItem from "../seeDoctor/ClinialItem";
import MedicineItem from "../seeDoctor/MedicineItem";
import PatientInfoItem from '../PatientInfoItem';
import MedicalList from "../MedicalList";

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const Option = Select.Option;
class DiseaseHistory extends Component {
  static defaultProps={
		title:"引用【既往病历】",
		selectId:"",
    item:{}
	};
	static propTypes = {
		title:PropTypes.string,
		quoteOk:PropTypes.func,
		quoteCancel:PropTypes.func,
		selectId:PropTypes.string,
    item:PropTypes.object,
	};
  constructor(props){
    super(props);
    this.state={
    	visible:false,
    	defaluteMediciValue:[],
      defaluteClinilValue:[],
      mediciValue:[],
      clinilValue:[],
      medical:[],
      bear_his:'',
      getClickData:{},
      item:{},
    }
  }
  //服务器端和客户端都只调用一次，在初始化渲染执行之前立刻调用。如果在这个方法内调用 setState，render() 将会感知到更新后的 state，将会执行仅一次，尽管 state 改变了。
  componentWillMount(){

  }

  //在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）。在生命周期中的这个时间点，组件拥有一个 DOM 展现，你可以通过 this.getDOMNode() 来获取相应 DOM 节点。
  componentDidMount(){}

  componentWillReceiveProps(nextProps){

  	if(nextProps.quoteVisble!= this.props.quoteVisble){

  		this.props.dispatch(medicrecordDetail({patient_id:getUser().patient_id ,deal_id:nextProps.selectId,clinic_id:getUser().shop_no},(res)=>{
	    	if(res.status=="0" && res.data && res.data.length>0 ){
	    		let medical = [];
		    	let medata = [];
		    	let cldata = [];
		    	delete res.data[0].record_id;
		    	if(res.data[0].medic_check){
					  medata = res.data[0].medic_check.filter(item=>item.check_type == '2');
					  cldata = res.data[0].medic_check.filter(item=>item.check_type == '1');
					}
		    	medical = res.data[0].show_opt.split(',')
		    	let updata = {
		    		all_his: res.data[0].all_his,
		    		bear_his: res.data[0].bear_his,
		    		bp_down: res.data[0].bp_down,
		    		bp_up: res.data[0].bp_up,
		    		complaint: res.data[0].complaint,
		    		family_his: res.data[0].family_his,
		    		is_menopause: res.data[0].is_menopause,
		    		need_bear: res.data[0].need_bear,
		    		now_his: res.data[0].now_his,
		    		other_check: res.data[0].other_check,
		    		p_per: res.data[0].p_per,
		    		past_his: res.data[0].past_his,
		    		physique_check: res.data[0].physique_check,
		    		pluse_id: res.data[0].pluse_id,
		    		pluse_name: res.data[0].pluse_name,
		    		process: res.data[0].process,
		    		r_per: res.data[0].r_per,
		    		temperature: res.data[0].temperature,
		    		tongue_coat_id: res.data[0].tongue_coat_id,
		    		tongue_coat_name: res.data[0].tongue_coat_name,
		    		tongue_id: res.data[0].tongue_id,
		    		tongue_name: res.data[0].tongue_name,
		    		show_opt: res.data[0].show_opt
		    	}
		    	this.setState({
		  			visible:nextProps.quoteVisble,
            item:nextProps.item,
            selectId:nextProps.selectId,
		  			medical:medical,
		  			bear_his:res.data[0].bear_his,
		  			getClickData:Object.assign({},updata,{medical:medical},{bear_his:res.data[0].bear_his},{medata:medata},{cldata:cldata}),
		  			defaluteMediciValue:medata,
			  		defaluteClinilValue:cldata
		  		})
		    	this.props.form.setFieldsValue(Object.assign({},updata,{medical:medical}))
	    	}else{
	    		this.props.form.resetFields();
	    		this.setState({
		  			visible:nextProps.quoteVisble,
		  			defaluteMediciValue:[],
		  			defaluteClinilValue:[]
		  		})

	    	}
	    }))
  	}

  }
  //引用
  onQuote(){

  	if(this.props.quoteOk instanceof Function ){
  		this.props.quoteOk(this.state.getClickData);
  	}
		
  }
  //取消
  handleCancel(){
  	if(this.props.quoteCancel instanceof Function ){
  		this.props.quoteCancel();

  	}
  }
  //点击就诊记录 拉取数据
  onClickRow(item,id){
  	this.props.dispatch(medicrecordDetail({patient_id:getUser().patient_id ,deal_id:item.deal_id,clinic_id:getUser().shop_no},(res)=>{
      if(!res.data||res.data.length==0){
        res.data = [];
      }
  		if(res.status == '0' && res.data.length>0){
  			delete res.data[0].record_id;
	    	let medical = [];
	    	let medata = [];
	    	let cldata = [];
	    	if(res.data[0].medic_check){
				  medata = res.data[0].medic_check.filter(item=>item.check_type == '2');
				  cldata = res.data[0].medic_check.filter(item=>item.check_type == '1');
				}
				let updata = {
		    		all_his: res.data[0].all_his,
		    		bear_his: res.data[0].bear_his,
		    		bp_down: res.data[0].bp_down,
		    		bp_up: res.data[0].bp_up,
		    		complaint: res.data[0].complaint,
		    		family_his: res.data[0].family_his,
		    		is_menopause: res.data[0].is_menopause,
		    		need_bear: res.data[0].need_bear,
		    		now_his: res.data[0].now_his,
		    		other_check: res.data[0].other_check,
		    		p_per: res.data[0].p_per,
		    		past_his: res.data[0].past_his,
		    		physique_check: res.data[0].physique_check,
		    		pluse_id: res.data[0].pluse_id,
		    		pluse_name: res.data[0].pluse_name,
		    		process: res.data[0].process,
		    		r_per: res.data[0].r_per,
		    		temperature: res.data[0].temperature,
		    		tongue_coat_id: res.data[0].tongue_coat_id,
		    		tongue_coat_name: res.data[0].tongue_coat_name,
		    		tongue_id: res.data[0].tongue_id,
		    		tongue_name: res.data[0].tongue_name,
		    		show_opt: res.data[0].show_opt
		    	}
	    	medical = res.data[0].show_opt.split(',');
	    	this.setState({
	  			medical:medical,
          item:item,
          selectId:item.deal_id,
	  			bear_his:res.data[0].bear_his,
	  			defaluteMediciValue:medata,
		  		defaluteClinilValue:cldata,
	  			getClickData:Object.assign({},updata,{medical:medical},{bear_his:res.data[0].bear_his},{medata:medata},{cldata:cldata}),
	  		})
	    	this.props.form.setFieldsValue(updata)
	    }else{
	    	this.props.form.resetFields();
	    	this.setState({
	  			defaluteMediciValue:[],
		  		defaluteClinilValue:[]
	  		})
	    }
	  }))
  }
  render(){
  	const { getFieldDecorator,getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    };
    let plainOptions = ['既往史', '家族史', '经带待产史','体格检查','辅助检查'];

    const patient = {
      headerImg:getUser().patient_image,
      patientName:getUser().patient_name,
      sex:getUser().patient_sex,
      age:getUser().patient_age,
      diagnose:"",
      imgSpan:7,
			patientSpan:8,
			sexSpan:3,
			ageSpan:6
    }
    return(
      <div className="prescriptionTemplate">
      	<Modal
      		title={this.props.title}
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
          		<PatientInfoItem {...patient} />
          		<MedicalList
          			location={this.props.location}
		        		onClickRow={this.onClickRow.bind(this)}
		        		selectId={this.state.selectId}
		        		showFooter="pagination"
		        	/>
          	</Col>
          	<Col span={19}  className="model-right">
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
					        <div className="bear_his">{
					        	this.state.medical.includes("经带待产史")?(

					        				<FormItem
									          {...formItemLayout}
									          label="经带待产史:"
									        >
									          {getFieldDecorator('is_menopause')(
									          	<RadioGroup >
												        <Radio value={'1'}>已绝经</Radio>
												        <Radio value={'2'}>无生育要求</Radio>
												        <Radio value={'3'}>有生育要求</Radio>
												      </RadioGroup>
									          )}
									          <div className="div-1" style={{"display": "inline-block"}}><Input placeholder="" value={this.state.bear_his}/></div>
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
                <span className='prescription-doctor'>处方医生：{this.state.item.doctor_name}</span>
          			<Button className="button-green" onClick={this.handleCancel.bind(this)}>取消</Button>
                <Button className="button-red" onClick={this.onQuote.bind(this)}>引用</Button>
          		</div>
          	</Col>
          </Row>
        </Modal>
      </div>
    );
  }
}

DiseaseHistory.contextTypes={
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state){
  return state
}
DiseaseHistory = Form.create({})(DiseaseHistory);
export default connect(mapStateToProps)(DiseaseHistory)
