/*
 * 就诊记录
 * showFooter: more 显示更多  pagination：显示分页  none :不显示
 */
import React, {Component, PropTypes} from "react";
import {Menu,Row,Col,Tag,Pagination} from 'antd';
import {connect} from "react-redux";
import {medicrecordList} from "../store/actions/CiteManage";
import {getUser} from "../utils/User";
import {Link} from "react-router";
import {convertTimeToStr} from "../utils/tools"
class MedicalList extends Component {
  static defaultProps={
		showFooter:"none",
		selectId:"",
		doctor_id_flage:false
	};
	static propTypes = {
		//doctor_id_flage:PropTypes.bool
	};
  constructor(props){
    super(props);
    this.state={
			loading:false,
			changeId:this.props.selectId,
			current:1,
    	pagination:7,
    	total:0,
    	midicalData:[]
    },
    this.getData = this.getData.bind(this);
  }
  componentWillReceiveProps(nextProps){
    if(!!nextProps.selectId && nextProps.selectId != this.state.changeId){
      this.setState({
        changeId:nextProps.selectId,
      })
    }
  }
  componentDidMount(){
  	setTimeout(()=>{
      this.getData();
    },0);
  }
  getData(page){
  	const {patientId=getUser().patient_id,userId,clinic_id,deal_state_filter} = this.props;
  	
  	const medicrecord = {
      after_treatment:'2',
  		method:'1',
  		page_no:page?page:"1",
  		page_size:'7',
  		patient_id:patientId,
  		deal_type:"3",
  		user_id:userId?userId:getUser().reservation_phone
  	}
    if(window.location.pathname == "/patient/patientinfo"){
      medicrecord.doctor_id = getUser().doctor_id;
    }
    if(deal_state_filter){
    	Object.assign(medicrecord,{deal_state_filter:deal_state_filter.toString()})
    }
  	// if(!clinic_id){
  	// 	Object.assign(medicrecord,{clinic_id:getUser().shop_no})
  	// }
  	// if(this.props.doctor_id_flage){
  	// 	Object.assign(medicrecord,{doctor_id:getUser().doctor_id})
  	// }
  	this.props.dispatch(medicrecordList(medicrecord,(res)=>{
      const {onLoad} = this.props;
  		if(res.status.toString()=="0"){
  			if(res.total_page>0){
  				this.setState({midicalData:res.deal_list,total:parseInt(res.total_num)});
          //  数据加载完成后的回掉方法
          if (typeof(onLoad)!=='function') return
          onLoad(res.deal_list[0]);
  			}else{
  				this.setState({midicalData:[],total:0})
  			}
  		}
  	}))
  }
  //  点击行触发事件
  clickRow(e){
    const {onClickRow} = this.props;
  	const {id} = e.currentTarget.dataset;
    if (typeof(onClickRow)!=='function') return;
  	onClickRow(this.state.midicalData[id],id);
    this.setState({changeId:this.state.midicalData[id].deal_id});
  }
  onChange(page) {
    this.setState({
      current: page,
    });
    this.getData(page);
  }
  render(){

    return(
      <div className="medicalList">
        <div className="title">就诊记录</div>
        <div className="table-header">
        	<div className="header">
        		<div className="time">日期</div>
        		<div className="zhenduan">诊断</div>
        	</div>
        </div>
        <div className="table-content">
        	{this.state.midicalData.map((item,id)=>(
        		<div  key={item.deal_id} className={this.state.changeId==item.deal_id?"content action":"content"} data-id={id}  onClick={this.clickRow.bind(this)}>
        			<div className="time">{convertTimeToStr(item.reservation_end_time,'yyyy-MM-dd')}</div>
        			<div className="zhenduan">{item.diagnose}</div>
        		</div>
        	))}
        </div>
        {
        	this.state.total>=7?(
        		<div className="table-footer">
			        {this.props.showFooter=="more"?(<div className="footer"><Link to={`/patient/patientinfo?patientId=${getUser().patient_id}&phone=${getUser().reservation_phone}`}>更多>></Link></div>):this.props.showFooter=="pagination"?(<div className="footer-pag">
			        	<Pagination
			        		simple
						      onChange={this.onChange.bind(this)}
									total={this.state.total}
									current={this.state.current}
									pageSize={this.state.pagination}
								/>
			        </div>):""}
			      </div>
        	):""
        }

      </div>
    );
  }
}
MedicalList.propTypes = {
  userId : React.PropTypes.string,
  onLoad : React.PropTypes.func,
  patientId : React.PropTypes.string,
  showFooter:PropTypes.string,
  onClickRow:PropTypes.func,
  selectId:PropTypes.string
}
MedicalList.contextTypes={
  router: React.PropTypes.object.isRequired
};
function mapStateToProps(state){
  return state
}
export default connect(mapStateToProps)(MedicalList)
