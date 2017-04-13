/*
 * 中医诊断
 */

import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {Row,Col,Select,Button ,Input ,Checkbox} from 'antd';
const Option = Select.Option;
import {chineDiagnose,synchronizationWestern} from "../../store/actions/CiteManage";
import {getUser} from "../../utils/User";
class ClinialItem extends Component {
  static defaultProps={
		listDisable:false
	};
	static propTypes = {
		onSelectClinia:PropTypes.func,
		defaluteClinilValue:PropTypes.array,
		emptyclinia:PropTypes.bool,
		listDisable:PropTypes.bool
	};
  constructor(props){
    super(props);
    this.state={
    	data: [],
      value: '',
      addList: this.props.defaluteClinilValue.length>1?this.props.defaluteClinilValue:[{
      	id:0,
      	type_desc:"疾病",
      	check_name:"",
      	check_type:"1",
      	is_suspected:'0',
      	check_id:''
      	
      }],
      options:[]
      
    }
  }
  componentWillMount(){
  }
  componentDidMount(){
  	
  	
  	/*this.props.dispatch(chineDiagnose({keyword:"",type:"0",},(res)=>{
	  	if(res.status.toString()=="0"){
	  		this.setState({
	  			options:res.data
	  		})
	  	}
	  }))*/
  		
  }
  componentWillReceiveProps(nextProps){
  	
  	if(this.props.emptyclinia!==nextProps.emptyclinia){
  		this.empty();
  	}
  	if(this.props.defaluteClinilValue !== nextProps.defaluteClinilValue){
  		for(let i=0;i<nextProps.defaluteClinilValue.length;i++){
  			nextProps.defaluteClinilValue[i].id=i;
  		}
  		nextProps.defaluteClinilValue.push({
				      	id:nextProps.defaluteClinilValue.length,
				      	type_desc:"疾病",
				      	check_name:"",
				      	check_type:"1",
				      	is_suspected:'0',
				      	check_id:''
				     })
  		//console.dir(nextProps.defaluteClinilValue)
  		this.setState({
  			addList:nextProps.defaluteClinilValue
  		})
  		if(this.props.onSelectClinia instanceof Function )
  			this.props.onSelectClinia(nextProps.defaluteClinilValue); 
  	}
  	if(this.props.chineDiagnose !== nextProps.chineDiagnose){
  		if(nextProps.chineDiagnose.length>0){
  			this.setState({
	  			options:nextProps.chineDiagnose
	  		})
  		}
  		
  	}
  	
  }
  //清空数据
  empty(){
  	this.setState({
  		addList:[{
      	id:0,
      	type_desc:"疾病",
      	check_name:"",
      	check_type:"1",
      	is_suspected:'0',
      	check_id:""
      }]
  	})
  	this.props.onSelectClinia([]);
  	
  }
 
  //中医诊断名称
  handleSelect(name,id,value,option) {
  	this.props.dispatch(synchronizationWestern(option.props.cont))
  	let data = this.state.addList;
  	data.map((item)=>{
  		if(id.toString() == item.check_id.toString()){
  			item.check_name = value;
  			item.check_id = option.props.cont.id;
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
      	type_desc:"疾病",
      	check_name:"",
      	check_type:"1",
      	is_suspected:'0',
      	check_id:""
  		})
  		this.setState({
	  		addList:data
	  	})
  	}
  	if(this.props.onSelectClinia instanceof Function ){
  		this.props.onSelectClinia(data);
  	}
  	
  		 	
  }
  onblurSelect(){
  	let data = this.state.addList;
  	data = data.filter(item=>item.check_id.trim()!="");
  	data = data.filter(item=>item.check_name.trim()!="");
  	data.push({
  			id:data.length,
      	type_desc:"疾病",
      	check_name:"",
      	check_type:"1",
      	is_suspected:'0',
      	check_id:""
  		})
  		this.setState({
	  		addList:data
	  	})
  		if(this.props.onSelectClinia instanceof Function ){
  			this.props.onSelectClinia(data);
  		}
  }
  //
  handleChange(name,id,value){
  	let data = this.state.addList;
  	data[id].check_name = value;
  	this.props.dispatch(chineDiagnose({keyword:value.trim(),type:"0"},(res)=>{
  		if(res.status.toString()=="0"){
  			this.setState({
  				options:res.data,
  				addList:data
  				
  			})
  		}
  	}))
  	
  }
  //类别
  onChange(name,value){
  	
  	let data = this.state.addList.concat();
  	data.map((item)=>{
  		if(name.toString() == item.check_name.toString()){
  			
  			item.type_desc = value;
  		}
  	})
  	//console.dir(data)
  	this.setState({
  		addList:data
  	})
  	if(this.props.onSelectClinia instanceof Function )
  		this.props.onSelectClinia(data);
  }
  //疑诊
  onCheckChange(name,e){
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
  	if(this.props.onSelectClinia instanceof Function )
  		this.props.onSelectClinia(data);
  }
  //删除数据
 	deleteRow(name,e){
 		let data = this.state.addList;
  	if(data.length==1){
  		return ;
  	}
  	this.setState({
  		addList:data.filter((item)=>item.check_id.toString() != name.toString() )
  	})
  	
  	if(this.props.onSelectClinia instanceof Function )
  		this.props.onSelectClinia(data.filter((item)=>item.check_id.toString() != name.toString() ));
 	}
  render(){
  	
  	let options = this.state.options.map((data,id)=>(
	  	<Option className="clinial-item-option" key={data.check_name} cont={data} disabled={this.state.addList.filter((item)=>item.check_name==data.check_name).length>0?true:false}>
        <div className="number">{data.num_code}</div>
        <div className="name">{data.check_name}</div>
        <div className="binyin">{data.pinyin}</div>
        <div className="wubi">{data.wubi}</div>
      </Option>
	  ))

    return(
      <div className="clinialItem">
        <div className="header-title">
	        <div className="div-1">类别</div>
	        <div className="div-2">中医诊断名称</div>
	        <div className="div-3">疑诊</div>
	        <div className="div-4">操作</div>
        </div>
        <div>
        {
        	!this.props.listDisable?(
        		<div>
        			{this.state.addList.map((item,idnum)=>(
			        	<div className="content" key={idnum} >
				        	<div className="select-item">
				        		<Select 
				        			value={item.type_desc}
				        			onChange={this.onChange.bind(this,item.check_name)}
				        		>
								      <Option value="证型">证型</Option>
								      <Option value="疾病">疾病</Option>
								    </Select>
				        	</div>
				        	<div className="select-fec">
				        		<Select
							        combobox
							        value={item.check_name}
							        placeholder={this.props.placeholder}
							        notFoundContent=""
							        style={this.props.style}
							        defaultActiveFirstOption={false}
							        showArrow={false}
							        filterOption={false}
							        onSelect={this.handleSelect.bind(this,item.check_name,item.check_id)}
							        dropdownClassName=""
							        dropdownMatchSelectWidth={false}
							        onSearch={this.handleChange.bind(this,item.check_name,idnum)} 
							        onBlur = {this.onblurSelect.bind(this,item.check_id)}
							      > 
							      	<Option className="clinial-item-option" disabled={true} key={-1}>
								        <div className="number">代码</div>
								        <div className="name">疾病名称</div>
								        <div className="binyin">拼音首码</div>
								        <div className="wubi">五笔首码</div>
								      </Option>
								      
							        {options}
							      </Select>
				        	</div>
				        	<div className="check-1">
				        		<Checkbox checked={item.is_suspected=='1'?true:false} onChange={this.onCheckChange.bind(this,item.check_name)}/>
				        	</div>
				        	<div className="check-2">
				        		 {item.check_id?<Button  icon="close-circle" onClick={this.deleteRow.bind(this,item.check_id)}/>:""}
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
								      <Option value="证型">证型</Option>
								      <Option value="疾病">疾病</Option>
								    </Select>
				        	</div>
				        	<div className="select-fec" style={{"lineHeight": "27px"}}>
				        		{item.check_name}
				        	</div>
				        	<div className="check-1">
				        		<Checkbox checked={item.is_suspected=='1'?true:false}  disabled />
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
ClinialItem.contextTypes={

};
function mapStateToProps(state){
  return {
  	westernDiagnose:state.westernDiagnose,
  	chineDiagnose:state.chineDiagnose
  }
}
export default connect(mapStateToProps)(ClinialItem)
