//引用【既往处方】
import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {Row,Col,Input,Checkbox,Button,Select,message,Radio,Modal,Icon,Tabs,Table  } from 'antd';
import {getUser} from "../../utils/User";
import PatientInfoItem from '../PatientInfoItem';
import MedicalList from "../MedicalList";
import {getRecipelistWithOutReduce,getRecipeDetail,addZYTab,searchItemTwo} from "../../store/actions/Medicine";
import {addZXTab} from "../../store/actions/ZxMedicine";
import {mul,div} from "../../utils/tools";
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
const ZXMEDICINE = "1"; //西药
class ZXTemplateHistory extends Component {
  static defaultProps={
		title:"引用【中西成药-既往处方】",
    selectId:"",
    dishisId:"",
    item:{},
	};
	static propTypes = {
		title:PropTypes.string,
		allQuote:PropTypes.func,
		partQuote:PropTypes.func,
		cancel:PropTypes.func,
    selectId:PropTypes.string,
    dishisId:PropTypes.string,
    item:PropTypes.object,
	};
  constructor(props){
    super(props);
    this.state={
    	visible:false,
      panes:[],
      isReference :true,
      item:{},
    }
    this.static = {
      selectKey:'1',
      selectData : {},
    }
  }
  //服务器端和客户端都只调用一次，在初始化渲染执行之前立刻调用。如果在这个方法内调用 setState，render() 将会感知到更新后的 state，将会执行仅一次，尽管 state 改变了。
  componentWillMount(){

  }

  //在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）。在生命周期中的这个时间点，组件拥有一个 DOM 展现，你可以通过 this.getDOMNode() 来获取相应 DOM 节点。
  componentDidMount(){
  	const data = {
      query_type:1,//患者维度查询处方列表
      user_id:getUser().reservation_phone,
      page_no:1,
      page_size:20,
      registration_deal_id:getUser().deal_id,
      recipe_source:"3",
      compose:"1",
    }
    this.props.dispatch(getRecipelistWithOutReduce(data,(res)=>{

    }))
  }

  componentWillReceiveProps(nextProps){
  	if(nextProps.quoteVisble!= this.props.quoteVisble){
      const data = {
        query_type:1,//患者维度查询处方列表
        user_id:getUser().reservation_phone,
        page_no:1,
        page_size:100,
        registration_deal_id:nextProps.selectId,//订单号查询
      }
      this.setState({
        dishisId:nextProps.dishisId,
        selectId:nextProps.selectId,
        item:nextProps.item,
      })
      //通过订单号加载订单数据
      this.loadHistoryDisease(nextProps);
  	}
  }

  loadHistoryDisease(nextProps){
    this.setState({
      isReference:true,
    });
    //获取处方列表
    const data = {
      query_type:1,//患者维度查询处方列表
      user_id:getUser().reservation_phone,
      page_no:1,
      page_size:100,
      registration_deal_id:nextProps.selectId,//订单号查询
      recipe_source:"3",
      compose:"1",
    }
    this.props.dispatch(getRecipelistWithOutReduce(data,(json)=>{
      //区分中药西药
      if(json.status != "0"){
        Modal.error({
          content: json.message,
        });
      }else{
        //过滤中药饮片
        if(json.data && json.data.recipes && json.data.recipes.length > 0){
          const d = json.data.recipes.filter(obj => obj.recipe_type == ZXMEDICINE);
          //遍历处方详情
          let tabList = [];
          // 判断加载数据结束
          let LoadingFinish = 0;
          for (var i = 0; i < d.length; i++) {
            const obj = d[i];
            ((cloud_recipe_id,user_id,i)=>{
              this.props.dispatch(getRecipeDetail({cloud_recipe_id:cloud_recipe_id,user_id:user_id,recipe_source:"3",compose:'1'},(json)=>{
                if(json.data&&json.data.items){
                  for (var j = 0; j < json.data.items.length; j++) {
                    json.data.items[j].item_amount += "";
                    json.data.items[j].item_price += "";
                    json.data.items[j].item_type += "";
                    json.data.items[j].usage_id += "";
                    json.data.items[j].wst_taking_amount += "";
                    json.data.items[j].wst_taking_days += "";
                  }
                  LoadingFinish = LoadingFinish + 1;
                  //添加tab
                  tabList.push({ title: '处方', content: (<div>{this.tableRender(json.data.items,i+1+"")}</div>),key:i+1+""});
                  if(LoadingFinish == d.length){
                    this.setState({
                      panes:[...tabList.sort((i,i2)=>i.key-i2.key)]
                    });
                  }
                }
              }))
            })(obj.cloud_recipe_id,obj.user_id,i)
          }
          if(d.length == 0){
            this.setState({
              isReference:false,
              panes:[{ title: '处方', content: (<div>{this.tableRender([],"1")}</div>),key:"1"}]
            });
          }else if(d[0].doctor_id != getUser().doctor_id){
            this.setState({
              // isReference:false,
            });
          }
        }else{
          this.setState({
            isReference:false,
            panes:[{ title: '处方', content: (<div>{this.tableRender([],"1")}</div>),key:"1"}]
          });
        }
        this.setState({
          visible:nextProps.quoteVisble,
        });
      }
    }))
  }

  //引用
  allQuote(){
    const {checkId,zXPrescriptionInfo} = this.props;
    const {items} = zXPrescriptionInfo[checkId];
  	// console.dir(this.state.selectData);
    const _self = this;
    const selectData = _self.static.selectData[_self.static.selectKey];
  	if(selectData&&selectData.length>0){
      //判断处方是否已有数据
      if(items.length > 1){
        confirm({
          title: '现有处方不为空，是否确定覆盖？',
          onOk() {
            //拼接数据
            _self.sendMedicineData(selectData,zXPrescriptionInfo[checkId],checkId,_self.props.allQuote);
          },
          onCancel() {
            _self.props.allQuote();
          },
        });
      }else{
        //拼接数据
        _self.sendMedicineData(selectData,zXPrescriptionInfo[checkId],checkId,_self.props.allQuote);
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
                data[index].disable = json.data[j].disable + "";
								data[index].wst_taking_unit = json.data[j].presciption_unit||"";//西药每剂单位
								data[index].total_price = mul(data[index].total_amount , data[index].item_price)+"";//西药总量
								data[index].fee_type += "";
								data[index].item_price += "";
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
              //
              // this.props.dispatch(addZXTab({name:key,data:newPrescriptionInfo}))
              // if (typeof cb == "function") {
              //   cb();
              // }
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

  //部分引用
  partQuote(){
  	if(this.props.partQuote instanceof Function ){
  		this.props.partQuote();
  	}
  }
  //取消
  cancel(){
  	if(this.props.cancel instanceof Function ){
  		this.props.cancel();
  	}
  }
  //tab切换
  tabsChange(key){
    this.static.selectKey = key;
  }
  //点击就诊记录 拉取数据
  onClickRow(item,id){
    this.setState({
      dishisId:id,
      selectId:item.deal_id,
      item:item,
    })
    this.loadHistoryDisease({quoteVisble:true,selectId:item.deal_id})
  }

  tableRender(data,key){
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
		  onChange: (selectedRowKeys, selectedRows) => {
        this.static.selectData[this.static.selectKey] = selectedRows;
		  },
		  onSelect: (record, selected, selectedRows) => {
        this.static.selectData[this.static.selectKey] = selectedRows;
		  },
		  onSelectAll: (selected, selectedRows, changeRows) => {
        this.static.selectData[this.static.selectKey] = selectedRows;
		  },
      getCheckboxProps: record => ({
        defaultChecked:true,
      }),
		};
    this.static.selectData = Object.assign(this.static.selectData,{[key]:data});
    return (
      <Table
        rowKey={(record,index) => index}
        columns={columns}
        dataSource={data}
        bordered
        rowSelection={rowSelection}
        pagination={false}
      />);
  }

  render(){
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
    const {selectId} = this.props;
    return(
      <div className="prescriptionTemplate">
      	<Modal
      		title={this.props.title}
      		maskClosable={false}
      		visible={this.state.visible}
          onCancel={this.cancel.bind(this)}
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
	          	<Tabs defaultActiveKey="1" onChange={this.tabsChange.bind(this)}>
                {this.state.panes.map((item,index)=>
                  <TabPane tab={"中西成药"+item.key} key={item.key}>
                    {item.content}
                  </TabPane>
                )}
						  </Tabs>
          		<div className="button-oper">
                <span className='prescription-doctor'>处方医生：{this.state.item.doctor_name}</span>
          			<Button className="button-green" onClick={this.cancel.bind(this)}>取消</Button>
                {/* <Button className="button-red" onClick={this.partQuote.bind(this)}>部分引用</Button> */}
                <Button disabled={!this.state.isReference} className="button-red" onClick={this.allQuote.bind(this)}>引用</Button>
          		</div>
          	</Col>
          </Row>
        </Modal>
      </div>
    );
  }
}

ZXTemplateHistory.contextTypes={
  router: React.PropTypes.object.isRequired
};

function mapStateToProps(state){
  return {
    zXPrescriptionInfo:state.zXPrescriptionInfo,
  }
}

export default connect(mapStateToProps)(ZXTemplateHistory)
