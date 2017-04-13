//个人设置
import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {Row,Col,Icon ,Button ,Select,Form,Radio,Checkbox,Spin,message} from 'antd';
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
import {settingSystem,getsettingSystem} from "../store/actions/SettingAction";
import {getUser} from "../utils/User";
class Setting extends Component {
  constructor(props){
    super(props);
    this.state={
    	loading:false,
    	checked:false
    }
    
  }
  //服务器端和客户端都只调用一次，在初始化渲染执行之前立刻调用。如果在这个方法内调用 setState，render() 将会感知到更新后的 state，将会执行仅一次，尽管 state 改变了。
  componentWillMount(){}

  //在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）。在生命周期中的这个时间点，组件拥有一个 DOM 展现，你可以通过 this.getDOMNode() 来获取相应 DOM 节点。
  componentDidMount(){
	  this.props.dispatch(getsettingSystem({doctor_id:getUser().doctor_id},(res)=>{
	   	
	   	if(res.status == '0'){
	   		let sets = Object.assign({},res.data,{show:res.data.show.split(',')},{font_type:res.data.font_type.toString()=='1'?true:false}) 
	   		
	   		this.props.form.setFieldsValue(sets)
	   		this.setState({
		      checked: res.data.font_type.toString()=='1'?true:false
		    });
	   	}
	  }))
	  
	  
  }
    
  componentWillReceiveProps(nextProps){
  	
  	
  }
  rest(){
  	this.props.form.resetFields();
  }
  save(){
  	this.setState({
  		loading:true
  	})
  	this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      
      this.props.dispatch(settingSystem(Object.assign({},values,{
      		doctor_id:getUser().doctor_id,
      		show:this.props.form.getFieldsValue(["show"]).show?this.props.form.getFieldsValue(["show"]).show.toString():"",
      		font_size:this.props.form.getFieldsValue(["font_size"]).font_size?this.props.form.getFieldsValue(["font_size"]).font_size.toString():"",
      		font_type:this.props.form.getFieldsValue(["font_type"]).font_type?"1":"0",
      		medical_record_for_return_visits:this.props.form.getFieldsValue(["medical_record_for_return_visits"]).medical_record_for_return_visits?this.props.form.getFieldsValue(["medical_record_for_return_visits"]).medical_record_for_return_visits.toString():"",
      		treat_way:this.props.form.getFieldsValue(["treat_way"]).treat_way?this.props.form.getFieldsValue(["treat_way"]).treat_way.toString():""
      }),(res)=>{
      	if(res.status.toString() == '0'){
      		this.setState({
      			loading:false
      		})
      		message.success('设置保存成功');
      		location.href="/setting";
      	}else{
      		message.error('设置保存失败');
      	}
      }))
    })
  }
  onChange = (e) => {
    this.setState({
      checked: e.target.checked,
    });
  }
  render(){
  	const { getFieldDecorator,getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 17 },
    };
    const plainOptions = ['既往史','家族史','经带待产史','体格检查','辅助检查']
    return(
      <div className="setting">
       <Spin spinning={this.state.loading} tip="设置保存中..." >
       	<Form>
	      	<div>
	      		<div className="jiemian">
		      		<span className="title">界面设置</span>
		      		<span className="check">
		      			<Checkbox >预览</Checkbox>
		      		</span>
	      		</div>
	      		<div className="set-font">
	      			<FormItem
			          {...formItemLayout}
			          label="字体大小："
			          
			        >
			          {getFieldDecorator('font_size', {
			            rules: []
			          })(
			            <RadioGroup>
						        <Radio value={0}>小号</Radio>
						        <Radio value={1}>中号</Radio>
						        <Radio value={2}>大号</Radio>
						      </RadioGroup>
			          )}
			        </FormItem>
			        <FormItem
			          {...formItemLayout}
			          label="字体样式："
			          
			        >
			          {getFieldDecorator('font_type', {
			            rules: []
			          })(
			            <Checkbox checked={this.state.checked}  onChange={this.onChange.bind(this)}>加粗</Checkbox>
			          )}
			        </FormItem>
	      		</div>
	      	</div>
	      	<div >
	      		<div className="jiemian"><span className="title">看诊设置</span></div>
	      		<div className="set-font">
	      			<FormItem
			          {...formItemLayout}
			          label="叫诊方式："
			          
			        >
			          {getFieldDecorator('treat_way', {
			            rules: []
			          })(
			            <RadioGroup >
						        <Radio value={1}>手动叫诊</Radio>
						        <Radio value={0}>自动叫诊</Radio>
						      </RadioGroup>
			          )}
			        </FormItem>
	      		</div>
	      	</div>
	      	<div >
	      		<div className="jiemian"><span className="title">病历设置</span></div>
	      		<div  className="set-font">
	      			<FormItem
			          {...formItemLayout}
			          label="默认展示项："
			          
			        >
			          {getFieldDecorator('show', {
			            rules: []
			          })(
			            <CheckboxGroup 
			            	options={plainOptions} 
			           	/>
			          )}
			        </FormItem>
			        <FormItem
			          {...formItemLayout}
			          label="复诊患者初始病历类型："
			          
			        >
			          {getFieldDecorator('medical_record_for_return_visits', {
			            rules: []
			          })(
			            <RadioGroup>
						        <Radio value={0}>引用空白病历</Radio>
						        <Radio value={1}>引用最近就诊病历</Radio>
						      </RadioGroup>
			          )}
			        </FormItem>
	      		</div>
	      	</div>
	      	<div className="buttom-set">
	      			<Button className="button-red" onClick={this.rest.bind(this)}>重置</Button>
	      			<span className="save">
	      				<Button  className="button-green" onClick={this.save.bind(this)}>保存设置</Button>
	      			</span>
	      	</div>
      	</Form>
      	</Spin>
      </div>
    );
  }
}

Setting.contextTypes={
  router: React.PropTypes.object.isRequired
};
Setting = Form.create({})(Setting);
function mapStateToProps(state){
  return {
  	 setting:state.setting
  }
}
export default connect(mapStateToProps)(Setting)
