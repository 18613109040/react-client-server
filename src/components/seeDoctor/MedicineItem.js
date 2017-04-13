/*
 * 西医诊断
 */

import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {Row,Col,Select,Button ,Input ,Checkbox} from 'antd';
import {westernDiagnose,synchronizationChine} from "../../store/actions/CiteManage";
import {getUser} from "../../utils/User";
const Option = Select.Option;

class MedicineItem extends Component {
  static defaultProps={
		listDisable:false
	};
	static propTypes = {
		onSelectMedici:PropTypes.func,
		defaluteMediciValue:PropTypes.array,
		emptyMedicine:PropTypes.bool,
		listDisable:PropTypes.bool
	};
  constructor(props){
    super(props);
    this.state={
    	data: [],
      value: '',
      options:[],
      addList: this.props.defaluteMediciValue.length>1?this.props.defaluteMediciValue: [{
																																									      	id:0,
																																									      	type_desc:"主要",
																																									      	check_name:"",
																																									      	is_suspected:'0',
																																									      	code:"",
																																									      	num_code:"",
																																									      	check_type:"2",
																																									      	check_id:""
																																									      }]
    }
  }
  componentWillMount(){
  	
  }
  
  componentDidMount(){
  	/*this.props.dispatch(westernDiagnose({keyword:"",type:"1"},(res)=>{
	  	if(res.status.toString()=="0"){
	  		this.setState({
	  			options:res.data
	  		})
	  	}
	  }))*/
  }
  
  componentWillReceiveProps(nextProps){
  	if(this.props.emptyMedicine!==nextProps.emptyMedicine){
  		this.empty();
  	}
  	if(this.props.defaluteMediciValue !== nextProps.defaluteMediciValue){
  		for(let i=0;i<nextProps.defaluteMediciValue.length;i++){
  			nextProps.defaluteMediciValue[i].id=i;
  		}
  		nextProps.defaluteMediciValue.push({
				      	id:nextProps.defaluteMediciValue.length,
				      	type_desc:"主要",
								check_name:"",
								is_suspected:'0',
								num_code:"",
      					code:"",
								check_type:"2",
								check_id:""
				    })
  		this.setState({
  			addList:nextProps.defaluteMediciValue
  		})
  		if(this.props.onSelectMedici instanceof Function )
  			this.props.onSelectMedici(nextProps.defaluteMediciValue);
  	}
  	
  	if(this.props.westernDiagnose !== nextProps.westernDiagnose){
  		if(nextProps.westernDiagnose.length>0){
  			this.setState({
	  			options:nextProps.westernDiagnose
	  		})
  		}
  		
  	}
  }
  empty(){
  	this.setState({
  		addList:[{
      	id:0,
				type_desc:"主要",
				check_name:"",
				is_suspected:'0',
				num_code:"",
      	code:"",
				check_type:"2",
				check_id:""
      }]
  	})
  	this.props.onSelectMedici([]);
  }
  handleChange(name,id,value){
  	
  	let data = this.state.addList;
  	data[id].check_name = value;
  	this.props.dispatch(westernDiagnose({keyword:value,type:"1"},(res)=>{
  		if(res.status.toString()=="0"){
  			this.setState({
  				options:res.data,
  				addList:data
  				
  			})
  		}
  	}))
  	
  }
  //西医诊断名称
  handleSelect(name,id,value,option) {
  	//console.dir(option)
  	this.props.dispatch(synchronizationChine(option.props.cont));
  	let data = this.state.addList;
  	data.map((item)=>{
  		if(id.toString() == item.check_id.toString()){
  			item.check_name = value;
  			item.check_id = option.props.cont.id;
  			item.code = option.props.code;
  			item.num_code = option.props.code;
  		}
  	})
  	
  	if(data.filter(item=>item.check_name.toString() == name.toString()).length>0){
  		this.setState({
	  		addList:data
	  	})
  	}else{
  		data = data.filter(item=>item.check_name.trim()!="");
  		data.push({
  			id:data.length,
      	type_desc:"主要",
      	check_name:"",
      	is_suspected:'0',
      	code:"",
      	num_code:"",
      	check_type:"2",
      	check_id:""
  		})
  		this.setState({
	  		addList:data
	  	})
  	}
  	if(this.props.onSelectMedici instanceof Function )
  		this.props.onSelectMedici(data);
  }
  onblurSelect(){
  	let data = this.state.addList;
  	data = data.filter(item=>item.check_id.trim()!="");
  	data = data.filter(item=>item.check_name.trim()!="");
  	data.push({
  			id:data.length,
      	type_desc:"主要",
      	check_name:"",
      	check_type:"2",
      	is_suspected:'0',
      	check_id:"",
      	num_code:"",
      	code:""
  		})
  		this.setState({
	  		addList:data
	  	})
    if(this.props.onSelectClinia instanceof Function ){
  			this.props.onSelectClinia(data);
  		}
  }
  //类别
  onChange(name,value){
  	let data = this.state.addList;
  	data.map((item)=>{
  		if(name.toString() == item.check_name.toString()){
  			item.type_desc = value;
  		}
  	})
  	this.setState({
  		addList:data
  	})
  	if(this.props.onSelectMedici instanceof Function )
  		this.props.onSelectMedici(data);
  }
  //疑诊
  onCheckChange(name,e){
  //	console.log(`checked = ${e.target.checked}`);
  	let data = this.state.addList;
  	data.map((item)=>{
  		if(name.toString() == item.check_name.toString()){
  			if(e.target.checked){
  				item.is_suspected = '1';
  			}else{
  				item.is_suspected = '0';
  			}
  			
  		}
  	})
  	this.setState({
  		addList:data
  	})
  	if(this.props.onSelectMedici instanceof Function )
  		this.props.onSelectMedici(data);
  }
  //删除数据
 	deleteRow(name,e){
 		let data = this.state.addList;
  	this.setState({
  		addList:data.filter((item)=>item.code.toString() != name.toString() )
  	})
  	if(this.props.onSelectMedici instanceof Function )
  		this.props.onSelectMedici(data.filter((item)=>item.code.toString() != name.toString() ));
 	}
  render(){
  	
  	let options = this.state.options.map((data,id)=>(
	  	<Option className="medicinet-item-option" key={id} value={data.check_name} code={data.code} cont={data} disabled={this.state.addList.filter((item)=>item.check_name==data.check_name).length>0?true:false} >
        <div className="number">{id}</div>
        <div className="name">{data.check_name}</div>
        <div className="binyin">{data.pinyin}</div>
        <div className="wubi">{data.wubi}</div>
      </Option>
	  ))
    return(
      <div className="medicineItem">
        <div className="header-title">
	        <div className="div-1">类别</div>
	        <div className="div-2">西医诊断名称</div>
	        <div className="div-3">疑诊</div>
	        <div className="div-4">ICD-10码</div>
	        <div className="div-5">操作</div>
        </div>
        <div>
        {
        	!this.props.listDisable?(
        		<div>
        			{this.state.addList.map((item,id)=>(
			        	<div className="content" key={id} >
				        	<div className="select-item">
				        		<Select 
				        			value={item.type_desc}
				        			onChange={this.onChange.bind(this,item.check_name)}
				        		>
								      <Option value="主要">主要</Option>
								      <Option value="其它">其它</Option>
								    </Select>
				        	</div>
				        	<div className="select-fec">
				        		<Select
							        combobox
							        value={item.check_name}
							        placeholder={this.props.placeholder}
							        notFoundContent=""
							        style={this.props.style}
							        filterOption={false}
							        onSelect={this.handleSelect.bind(this,item.check_name,item.check_id)}
							        dropdownClassName=""
							        dropdownMatchSelectWidth={false} 
							        onSearch={this.handleChange.bind(this,item.check_name,id)}
							         onBlur = {this.onblurSelect.bind(this)}
							      > 
							      	<Option className="medicinet-item-option" disabled={true} key={-1}>
								        <div className="number">代码</div>
								        <div className="name">疾病名称</div>
								       {/*<div className="zhenduan">诊断码</div>*/}
								        <div className="binyin">拼音首码</div>
								        <div className="wubi">五笔首码</div>
								      </Option>
								      
							        {options}
							      </Select>
				        	</div>
				        	<div className="check-1">
				        		<Checkbox checked={item.is_suspected=='1'?true:false} onChange={this.onCheckChange.bind(this,item.check_name)}/>
				        	</div>
				        	<div className="icdCode">
				        		{item.code}
				        	</div>
				        	<div className="check-2">
				        		 {item.check_id?<Button  icon="close-circle" onClick={this.deleteRow.bind(this,item.code)}/>:""}
				        	</div>
				        </div>
			        ))}
			        
        		</div>
        	):(
        		<div>
        			{this.state.addList.map((item,id)=>(
			        	<div className="content" key={id} >
				        	<div className="select-item">
				        		<Select 
				        			value={item.type_desc}
				        			disabled 
				        		>
								      <Option value="1">主要</Option>
								      <Option value="2">其它</Option>
								    </Select>
				        	</div>
				        	<div className="select-fec" style={{"lineHeight": "27px"}}>
				        		{item.check_name}
				        	</div>
				        	<div className="check-1">
				        		<Checkbox checked={item.is_suspected=='1'?true:false} disabled/>
				        	</div>
				        	<div className="icdCode">
				        		{item.code}
				        	</div>
				        </div>
			        ))}
        		</div>
        	)
        }		
        </div>
      
      </div>
    );
  }
}
MedicineItem.contextTypes={

};
function mapStateToProps(state){
  return {
  	chineDiagnose:state.chineDiagnose,
  	westernDiagnose:state.westernDiagnose
  }
}
export default connect(mapStateToProps)(MedicineItem)


