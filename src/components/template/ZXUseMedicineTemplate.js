//引用【中西成药】
import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {Row,Col,Form,Input,Checkbox,Button,Select,message,Radio,Tooltip,Modal,Tree,Icon,Table } from 'antd';
import {getUser} from "../../utils/User";
import {getQueryRecipeTempletTree,addpersonalrecipetemplet,addRecipeTempletDetailed,
		queryRecipeTempletDetail,deleterecipetemplet,modifyrecipetemplet} from "../../store/actions/UsePreTemplate";
import {templateUpdatamodify} from "../../store/actions/CheckMedicine";
import {searchItemTwo} from "../../store/actions/Medicine";
import {addZXTab} from "../../store/actions/ZxMedicine";

import {mul,div} from "../../utils/tools";

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const confirm = Modal.confirm;
class ZXUseMedicineTemplate extends Component {
  static defaultProps={
		title:"引用【中西成药】模板",

	};
	static propTypes = {
		title:PropTypes.string,
		overAllOk:PropTypes.func,
		overAllCancel:PropTypes.func,
		overAllVisble:PropTypes.bool,
		checkId:PropTypes.string
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
    const {checkId,zXPrescriptionInfo} = this.props;
    const {items} = zXPrescriptionInfo[checkId];
  	// console.dir(this.state.selectData);
    const _self = this;
  	if(this.state.selectData.length>0){
      //判断处方是否已有数据
      if(items.length > 1){
        confirm({
          title: '现有处方不为空，是否确定覆盖？',
          onOk() {
            //拼接数据
            const {selectData} = _self.state;
            _self.sendMedicineData(selectData,zXPrescriptionInfo[checkId],checkId,_self.props.overAllOk);
          },
          onCancel() {
            _self.props.overAllOk();
          },
        });
      }else{
        //拼接数据
        const {selectData} = _self.state;
        _self.sendMedicineData(selectData,zXPrescriptionInfo[checkId],checkId,_self.props.overAllOk);
      }
  	}
  }
  //拼接数据
  sendMedicineData(data,info,key,cb){
    // 遍历药品
    let count = 0;
    for (let i = 0; i < data.length; i++) {
      ((index)=>{
        const item_data = {
          keyword:data[index].item_name,
          // pharmacy_type:1<<1,//1<<0中医药房 1<<1西医药房 1<<2 贵细药房 1<<3供应室
          item_type:1<<1|1<<2,// 1<<0中药饮片 1<<1中成药 1<<2 西药 1<<3 耗材
          shop_no:getUser().shop_no,
        }
        this.props.dispatch(searchItemTwo(item_data,(json)=>{
          if(json.data.length > 0 && json.status == '0'){
						let drugFlat = 0;//1表示找到药，0没有找到
						for (var j = 0; j < json.data.length; j++) {
	            if(json.data[j].value == data[index].item_name){
								drugFlat = 1;
                //穴位 中药饮片不需要
                data[index].acupoint_id1=data[index].acupoint_id1+"";
                data[index].acupoint_id2=data[index].acupoint_id2+"";
                data[index].acupoint_id3=data[index].acupoint_id3+"";
                data[index].acupoint_id4=data[index].acupoint_id4+"";
                data[index].quantity=data[index].quantity+"";
                data[index].item_type = "0";

								data[index].item_name = json.data[j].value;
								data[index].item_id = json.data[j].item_id || "";
								data[index].item_code = json.data[j].item_code ||"";
								data[index].fee_type = json.data[j].fee_type||"1";
								data[index].item_price = json.data[j].price||"0";
								data[index].item_unit = json.data[j].presciption_unit||"";
								data[index].min_unit = json.data[j].min_unit + "";//最小单位
								data[index].wst_spec = json.data[j].standard||"";//西药规格
								//库存
                data[index].stock = json.data[j].stock + "";
								data[index].status = json.data[j].status + "";
								data[index].wst_taking_unit = json.data[j].presciption_unit||"";//西药每剂单位
								data[index].total_price = mul(data[index].total_amount , data[index].item_price)+"";//西药总量
								data[index].fee_type += "";
								data[index].item_price += "";
								data[index].disable = json.data[j].disable + "";
                break;
              }
            }
						if(drugFlat==0){
							data[index].stock = "0";
							data[index].disable = "2";
						}
            count++;
            if(count > data.length - 1){
              let newPrescriptionInfo = {
                ...info
              }
							newPrescriptionInfo.items = [...data];
              //判断是否有库存
              this.filterStock(newPrescriptionInfo,key,cb);
            }
          }else{
            //没有找到该要
            data[index].stock = "0";
						data[index].disable = "2";
            count++;
            if(count > data.length - 1){
              //判断是否有库存
              let newPrescriptionInfo = {
                ...info
              }
              newPrescriptionInfo.items = [...data];
              //判断是否有库存
              this.filterStock(newPrescriptionInfo,key,cb);
            }
          }
        }));
      }
      )(i)
    }

  }

	//是否不超过库存 总:totalCount 药品详情:drugItem
	isMoreThanStock(drugItem){
		if((+drugItem.disable&1<<1)!="2"){
      return false;
    }
		if(!drugItem.stock){
			drugItem.stock="0";
		}
		if(+drugItem.total_amount > +drugItem.stock){
			return true;
		}
		return false;
	}

	filterStock(newPrescriptionInfo,key,cb){
		const _self = this;
		const {items} = newPrescriptionInfo;
		let newItem = [];
		let newOverItem = [];
		for (let i = 0; i < items.length; i++) {
			if(this.isMoreThanStock(items[i])){
				newOverItem.push(items[i].item_name);
			}else{
				newItem.push(items[i])
			}
		}
		newItem = [...newItem,{
			item_amount:"0",
			item_code:"0",
			item_id:"1",
			item_name:"",
			item_price:"",
			item_type:"0",
			item_unit:"",
			total_amount:"0",
			total_price:"",
			usage_desc:"",
			usage_id:"",
			wst_spec:"",
			min_unit:'1',
			wst_taking_amount:"",
			wst_taking_days:"",
			wst_taking_desc:"",
			wst_taking_times:"",
			wst_taking_unit:"",
		}];
		if(newOverItem.length > 0){
			confirm({
				title: `该模板的[${newOverItem.join(',')}]药品/饮片没有使用权限${newOverItem.length==items.length?"。":"，是否继续引用该模板其他内容！"}`,
				onOk() {
					_self.props.dispatch(addZXTab({name:key,data:Object.assign({},newPrescriptionInfo,{items:newItem})}))
					if (typeof cb == "function") {
						cb();
					}
				},
				onCancel() {
					if (typeof cb == "function") {
						cb();
					}
				},
			});
		}else{
			_self.props.dispatch(addZXTab({name:key,data:Object.assign({},newPrescriptionInfo,{items:newItem})}));
			if (typeof cb == "function") {
				cb();
			}
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
		  				Object.assign(
                res.data.list[i],
                {wst_taking_unit:res.data.list[i].item_unit},//每次剂量
                {wst_taking_amount:res.data.list[i].item_amount},//每次剂量单位
                {wst_taking_days:res.data.list[i].wst_taking_count},//持续天数
                {item_unit:res.data.list[i].total_unit},//总量单位
              )
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
      title: '药品名称',
      dataIndex: 'item_name',
      key: 'item_name',
    }, {
      title: '规格',
      dataIndex: 'wst_spec',
      key: 'wst_spec',
    }, {
      title: '每次剂量',
      dataIndex: 'wst_taking_amount',
      key: 'wst_taking_amount',
      render: (text,record,index) => {
        return (
          <span>{record.wst_taking_amount+record.wst_taking_unit}</span>
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
			onChange: (selectedRowKeys, selectedRows) => {
				this.setState({
		    	selectData:selectedRows
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
			getCheckboxProps: record => ({
				defaultChecked:true,
			}),
		};
    const loop = data => data.map((item) => {
      if(item.children){
        return <TreeNode title={item.templet_name} className="title-temp" key={item.templet_id} data-isLeaf={false} >{loop(item.children)}</TreeNode>;
      }
      return <TreeNode title={item.templet_name} className="title-temp" key={item.templet_id} data-isLeaf={true} isLeaf={item.eventkey?false:true} />;
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
          					title="中西成药"
					        	key="2">
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
									pagination={false}
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

ZXUseMedicineTemplate.contextTypes={
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state){
  return {
    zXPrescriptionInfo:state.zXPrescriptionInfo,
  }
}
export default connect(mapStateToProps)(ZXUseMedicineTemplate)
