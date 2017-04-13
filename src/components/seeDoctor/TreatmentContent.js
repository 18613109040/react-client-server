/*
 * 门诊 检验检查
 */

import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {getUser} from "../../utils/User";
import {Row,Col,Form,Input,Button,Select, Table, Radio, Icon, Modal,InputNumber} from 'antd';
const Option = Select.Option;
const RadioGroup = Radio.Group;
import {requestTreament, requestAcupoints, requestAcupointList,addTreatment,upDataTreatment,deleteTreatment,restData} from "../../store/actions/Treatment";

class TreatmentItem extends Component{
  constructor(props){
    super(props);
    this.state ={
      rowSelection:{},
      data: [],
      itemList: [],  // 保存搜索治疗项目时的数据
      acupoints:[], // 穴位1
      acupoints2:[], // 穴位2
      acupoints3:[], // 穴位3
      acupointList: [] // 穴位方
    }
    this.renderInput = this.renderInput.bind(this);
    this.onClickClose = this.onClickClose.bind(this);
    this.onItemSearch = this.onItemSearch.bind(this);
    this.onItemSelect = this.onItemSelect.bind(this);
    this.acupointSearch = this._acupointSearch.bind(this);
    this.acupointSelect = this._acupointSelect.bind(this);
    this.acupointSelect2 = this._acupointSelect2.bind(this);
    this.acupointSelect3 = this._acupointSelect3.bind(this);
    this.onChangeNumber = this._onChangeNumber.bind(this);
    this.onAcupointListSearch = this._onAcupointListSearch.bind(this);
    this.onAcupointItemSelect = this._onAcupointItemSelect.bind(this);
    this.onItemBurl = this._onItemBurl.bind(this);
  }

  componentWillMount(){

  }
  componentDidMount(){
  	this.props.dispatch(requestAcupoints({
      keyword: ""
    },(res)=>{
    	this.setState({
    		acupoints: res.data,
    		acupoints2:res.data,
    		acupoints3:res.data
    	})
    }))
  	this.props.dispatch(requestAcupointList({
      keyword: ""
   },(res)=>{
	   	this.setState({
	   		acupointList:res.data
	   	})
    }))
  }
	//项目
  onItemSearch(value, index){
  	let d = Object.assign({},
    												{item_name:value.trim()},
    												{item_price:""},
    												{item_unit:""})
    this.props.dispatch(upDataTreatment(Object.assign({},d,{id:index})))
    const shop_no = getUser().shop_no;
    this.props.dispatch(requestTreament({
      pharmacy_type: 32,
      shop_no: shop_no,
      keyword: value
    },(res)=>{
    	if(res.status=='0'){
    		if(res.data.length>0){
    			this.setState({itemList: res.data})
    		}else{
    			this.setState({itemList: []})
    		}
    	}

    }))
  }
  _onItemBurl(index,data){
  	if(!data.item_name.trim()&&data.item_code!==""){
  		/*let d = Object.assign({},
    												{item_price:""},
    												{item_unit:""},
    												{item_code:""}
  		)
    	this.props.dispatch(upDataTreatment(Object.assign({},d,{id:index})))*/
    	
    	this.props.dispatch(deleteTreatment({id:index}));
  	}
  }
  onItemSelect(value, option, record, index){
  	
    const obj = option.props.context;
    if(this.props.treatmentTemData.filter(item => item.item_name.trim() == value.trim()).length>0){
    	Modal.error({
		   title: '治疗项目重复',
		   content: `${this.props.treatmentTemData.filter(item => item.item_name.trim() == value)[0].item_name.trim()}已选择`,
		});
		return ;
		//this.props.dispatch(restData());
    }else if(this.props.treatmentTemData.length-1==index){
    	
    		let d = Object.assign({},record,option.props.context,
    												{item_name:option.props.context.value},
    												{item_price:option.props.context.price},
    												{item_unit:option.props.context.unit},
    												{item_amount:"1"})
    		this.props.dispatch(addTreatment(Object.assign({},d,{id:index})))
    
    	
    	
    }else{
    	
    	let d = Object.assign({},record,option.props.context,
    												{item_name:option.props.context.value},
    												{item_price:option.props.context.price},
    												{item_unit:option.props.context.unit})
    	this.props.dispatch(upDataTreatment(Object.assign({},d,{id:index})))
    	
    }
  }
  //数量
  _onChangeNumber(e, record, index){
  	if(record.item_name.trim()!=""){
    	let d = Object.assign({},{item_amount:e.target.value});
    	this.props.dispatch(upDataTreatment(Object.assign({},d,{id:index})));
    }else{
  		Modal.error({
		    title: '治疗项目为空',
		    content: "请填写治疗项目",
		  });
  	}

  }
  //学位方
  _onAcupointListSearch(value, index,data){
  	this.props.dispatch(requestAcupointList({
      keyword: value.trim()
   },(res)=>{
   		let d = Object.assign({},{acupoint_name4:value})
    	this.props.dispatch(upDataTreatment(Object.assign({},d,{id:index})))
   		this.setState({
   			acupointList:res.data
   		})

    }))
  }
  _onAcupointItemSelect(value, option, record, index){
  	
  	if(record.item_name.trim()!=""){
  		
    	let d = Object.assign({},record,option.props.context,{acupoint_id4:option.props.context.id},{acupoint_name4:option.props.context.major})
    	this.props.dispatch(upDataTreatment(Object.assign({},d,{id:index})))
    	
  	}else{
  		Modal.error({
		    title: '治疗项目为空',
		    content: "请填写治疗项目",
		  });
  	}
  }
  //穴位
  _acupointSearch(value,type,index){
    this.props.dispatch(requestAcupoints({
      keyword: value
    },(res)=>{
    	if(res.status=="0"){
    		if(type=="acupoint_name1"){
	    		let d = Object.assign({},{acupoint_name1:value});
	    		this.props.dispatch(upDataTreatment(Object.assign({},d,{id:index})));
	    		this.setState({acupoints: res.data})
	    	}else if(type=="acupoint_name2"){
	    		let d = Object.assign({},{acupoint_name2:value});
	    		this.props.dispatch(upDataTreatment(Object.assign({},d,{id:index})));
	    		this.setState({acupoints2: res.data})
	    	}else if(type=="acupoint_name3"){
	    		let d = Object.assign({},{acupoint_name3:value});
	    		this.props.dispatch(upDataTreatment(Object.assign({},d,{id:index})));
	    		this.setState({acupoints3: res.data})
	    	}
    	}
    }))
  }
  _acupointSelect(value, option, record, index){
  	if(record.item_name!=""){
  		let d = Object.assign({},record,option.props.context,{acupoint_id1:option.props.context.id},{acupoint_name1:option.props.context.value})
    	this.props.dispatch(upDataTreatment(Object.assign({},d,{id:index})))
  	}else{
  		Modal.error({
		    title: '治疗项目为空',
		    content: "请填写治疗项目",
		  });
  	}
  }
  _acupointSelect2(value, option, record, index){
    if(record.item_name!=""){
    	let d = Object.assign({},record,option.props.context,{acupoint_id2:option.props.context.id},{acupoint_name2:option.props.context.value})
    	this.props.dispatch(upDataTreatment(Object.assign({},d,{id:index})))
    }else{
  		Modal.error({
		    title: '治疗项目为空',
		    content: "请填写治疗项目",
		  });
  	}
  }
  _acupointSelect3(value, option, record, index){
  	if(record.item_name!=""){
    	let d = Object.assign({},record,option.props.context,{acupoint_id3:option.props.context.id},{acupoint_name3:option.props.context.value})
    	this.props.dispatch(upDataTreatment(Object.assign({},d,{id:index})))
    }else{
  		Modal.error({
		    title: '治疗项目为空',
		    content: "请填写治疗项目",
		  });
  	}
  }
  renderInput(data, index, key, text){
  	
    const {itemList, acupoints,acupoints2,acupoints3,acupointList} = this.state;
    const options1 = itemList.map((item, index)=>
			                (<Option key={index} value={item.value} name={item.value} context={item} >
			                  <span className="flex-display">
			                    <span className="flex-1">{item.item_code}</span>
			                    <span className="flex-1">{item.value}</span>
			                    <span className="flex-1">{item.presciption_units}</span>
			                    <span className="flex-1">{item.price}</span>
			                  </span>
			                </Option>)
			              )
    const options2 = acupoints.map((item, index)=>
			                (<Option key={index} value={item.value} name={item.value} context={item}>
			                  <span className="flex-display">
			                    <span className="flex-1">{item.num_code}</span>
			                    <span className="flex-1">{item.value}</span>
			                  </span>
			                </Option>)
			              )
    const options3 = acupoints2.map((item, index)=>
	                 (<Option key={index} value={item.value} name={item.value} context={item}>
	                  <span className="flex-display">
	                    <span className="flex-1">{item.num_code}</span>
	                    <span className="flex-1">{item.value}</span>
	                  </span>
	                </Option>)
	              )

    const options4 = acupoints3.map((item, index)=>
                (
	                <Option key={index} value={item.value} name={item.value} context={item}>
	                  <span className="flex-display">
	                    <span className="flex-1">{item.num_code}</span>
	                    <span className="flex-1">{item.value}</span>
	                  </span>
	                </Option>)
              )
    const options5 = acupointList.map((item, index)=>
	                (
		                <Option className="clinial-item-option"  key={index} value={item.major} name={item.major} context={item}>
		                  <span className="flex-display">
		                    <span className="flex-1">{item.num_code}</span>
		                    <span className="flex-1">{item.value}</span>
		                     <span className="flex-1">{item.major}</span>
		                  </span>
		                </Option>)
	              )
    switch (key) {
      case "item_name":
        return (<Select
        	combobox
          style={{'width':'calc(100%)'}}
          dropdownClassName="yp-dropdown-select w300"
          dropdownMatchSelectWidth={false}
          defaultActiveFirstOption={false}
		  showArrow={false}
		  filterOption={false}
          onSearch={(value)=> this.onItemSearch(value, index)}
          onSelect={(value, option) => this.onItemSelect(value, option, data, index)}
          onBlur={()=>this.onItemBurl(index,data)}
          placeholder="请输入项目名称"
          value={data.item_name}
          >
            <Option key="-1" disabled><span className="flex-display"><span className="flex-1">代码</span><span className="flex-1">项目名称</span><span className="flex-1">计价单位</span><span className="flex-1">价格</span></span></Option>
            {
            	options1
            }
          </Select>)
      case "acupoint_name1":
        return (
        	<Select
	        	combobox
	          style={{'width':'calc(100%)'}}
	          dropdownClassName="yp-dropdown-select w300"
	          dropdownMatchSelectWidth={false}
	          defaultActiveFirstOption={false}
						showArrow={false}
						filterOption={false}
	          onSearch={(value)=> this.acupointSearch(value,"acupoint_name1",index,data)}
	          onSelect={(value, option)=> this.acupointSelect(value, option, data, index)}
	         	value={data.acupoint_name1}
	          >
	            <Option key="-1" disabled><span className="flex-display"><span className="flex-1">代码</span><span className="flex-1">穴位名称</span></span></Option>
	            {
	              options2
	            }
          </Select>
        )
      case "acupoint_name2":
      	return (
      		<Select
	      		combobox
	          style={{'width':'calc(100%)'}}
	          dropdownClassName="yp-dropdown-select w300"
	          dropdownMatchSelectWidth={false}
	          defaultActiveFirstOption={false}
						showArrow={false}
						filterOption={false}
	          onSearch={(value)=> this.acupointSearch(value,"acupoint_name2",index,data)}
	          onSelect={(value, option)=> this.acupointSelect2(value, option, data, index)}
	          value={data.acupoint_name2}
	         >
	            <Option key="-1" disabled><span className="flex-display"><span className="flex-1">代码</span><span className="flex-1">穴位名称</span></span></Option>
	            {
	            	options3
	            }
          </Select>
        )
      case "acupoint_name3":
       return (
       	<Select
       		combobox
          style={{'width':'calc(100%)'}}
          dropdownClassName="yp-dropdown-select w300"
          dropdownMatchSelectWidth={false}
          defaultActiveFirstOption={false}
					showArrow={false}
					filterOption={false}
        	onSearch={(value)=> this.acupointSearch(value,"acupoint_name3",index,data)}
          onSelect={(value, option)=> this.acupointSelect3(value, option, data, index)}
          value={data.acupoint_name3}
          >
            <Option key="-1" disabled><span className="flex-display"><span className="flex-1">代码</span><span className="flex-1">穴位名称</span></span></Option>
            {
            	options4
            }
        </Select>
        )
      case "acupoint_name4":
        return (
        	<Select
	        	combobox
	          style={{'width':'calc(100%)'}}
	          dropdownClassName="yp-dropdown-select"
	          dropdownMatchSelectWidth={false}
	          defaultActiveFirstOption={false}
						showArrow={false}
						filterOption={false}
	          onSearch={(value)=> this.onAcupointListSearch(value,index,data)}
	          onSelect={(value, option)=> this.onAcupointItemSelect(value, option, data, index)}
	          value={data.acupoint_name4}
	         >
	            <Option key="-1" disabled className="clinial-item-option" ><span className="flex-display"><span className="flex-1">代码</span><span className="flex-1">主治</span><span className="flex-1">穴位方</span></span></Option>
	            {
	            	options5
	            }
          </Select>
        )
      case "item_amount":
      	return (
      		 <Input value={data.item_amount} onChange={(e)=>this.onChangeNumber(e, data, index)} id={`itemamount${index}`} />
      	)
      default:
    }
  }

  onClickClose(record,index, value){

		this.props.dispatch(deleteTreatment({id:index}))

  }


  render(){

  	const columns = [{
      title: '序号',
      dataIndex: 'item_code',
      width: 300
    },{
      title: '治疗项目',
      dataIndex: 'item_name',
      width: 300,
      render: (text, record, index)=> this.renderInput(record, index, "item_name", text)
    },{
      title: '单位',
      dataIndex: 'item_unit',
      width: 50,
    },{
      title: '数量',
      dataIndex: 'item_amount',
      width: 70,
      render: (text, record, index)=> this.renderInput(record, index, "item_amount", text)
    },{
      title: '金额',
      dataIndex: 'item_price',
      width: 80,
      render: (text)=> <span>{text?text/10000:""}</span>
    },{
      title: '穴位1',
      dataIndex: 'acupoint_name1',
      width: 70,
      render: (text, record, index)=> this.renderInput(record, index, "acupoint_name1", text)
    },{
      title: '穴位2',
      dataIndex: 'acupoint_name2',
      width: 70,
      render: (text, record, index)=> this.renderInput(record, index, "acupoint_name2", text)
    },{
      title: '穴位3',
      dataIndex: 'acupoint_name3',
      width: 70,
      render: (text, record, index)=> this.renderInput(record, index, "acupoint_name3", text)
    },{
      title: '穴位方',
      dataIndex: 'acupoint_name4',
      width: 300,
      render: (text, record, index)=> this.renderInput(record, index, "acupoint_name4", text)
    },{
      title: '操作',
      render: (text, record, index)=>{
      	if(!record.item_code){
      		return ""
      	}else{
      		return  (<Button type="dashed" icon="circle" icon="close" onClick={event => this.onClickClose( record,index, event)} />)
      	}
      }
    }];
    let money = 0;
    this.props.treatmentTemData.map((item)=>{
    	//console.dir(item)
    	if(item.item_amount&&item.item_price)
    		money += parseInt(item.item_amount)*parseInt(item.item_price)
    })
    return(
      <Table
      	rowKey={(record,index) => index}
      	pagination={false}
      	dataSource={this.props.treatmentTemData}
      	columns={columns}
      	footer={() => <span className="table_footer">小计:{money/10000}</span>}
      	/>
    )
  }
}


// -------------------------------------------------------------------------------------------------------------

class TreatmentContent extends Component {
  constructor(props){
    super(props);
    this.state={
      value:1
    }

  }
  render(){
  	console.dir(this.props.treatmentTemData)
    return (
      <Row>
        <TreatmentItem  dispatch={this.props.dispatch} ref="lists" treatmentTemData={this.props.treatmentTemData}/>
      </Row>
    )
  }
}
TreatmentContent.proptypes={
}
function mapStateToProps(state){
   return {
   	treatmentTemData:state.treatmentTemData
   }
 }
export default connect(mapStateToProps)(TreatmentContent);;
