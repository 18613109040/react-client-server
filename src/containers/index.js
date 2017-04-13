/*
 * 首页
 */
import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {  Tabs , Icon ,Row,Col} from 'antd';
import TableGrid from '../components/TableGrid';
//import {getUser} from "../utils/User";
const TabPane = Tabs.TabPane;

/*
 * 时间格式化
 *
 */
Date.prototype.format = function (fmt) {
	var o = {
	    "M+" : this.getMonth()+1, //月份
	    "d+" : this.getDate(), //日
	    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
	    "H+" : this.getHours(), //小时
	    "m+" : this.getMinutes(), //分
	    "s+" : this.getSeconds(), //秒
	    "q+" : Math.floor((this.getMonth()+3)/3), //季度
	    "S" : this.getMilliseconds() //毫秒
    };
    var week = {
	    "0" : "日",
	    "1" : "一",
	    "2" : "二",
	    "3" : "三",
	    "4" : "四",
	    "5" : "五",
	    "6" : "六"
    };
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "星期" : "周") : "")+week[this.getDay()+""]);
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
};

const Item = React.createClass({
	render(){
		const data =new Date(this.props.time).format("MM/dd");
		const whichDay = new Date(this.props.time).format("E");
		return (
				<div  className={this.props.scheduleFull?"schedule-full":"schedule-notfull"}>
					 <div className="data-time">
					 	<p>{data}</p>
					 	<p>{whichDay}</p>
					 </div>
					 <div className="data-name">{this.props.arrangeTime}</div>
				</div>
		)
	}

})
class Index extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
     //this.props.dispatch(getUsrInfo({role: getUser().role, role_id:getUser().doctor_id }));
  }
  handleClick(){

  }
  render(){
  	const schedulList=[
  		{
  			name:"廣州駿景分院",
  			schedule:[
  				{
  					time:new Date().getTime(),
  					scheduleFull:true,
  					arrangeTime:"上"

  				},
  				{
  					time:new Date('2016/10/5').getTime(),
  					scheduleFull:false,
  					arrangeTime:"上"

  				},
  				{
  					time:new Date('2016/10/6').getTime(),
  					scheduleFull:true,
  					arrangeTime:"上"

  				},
  				{
  					time:new Date('2016/10/7').getTime(),
  					scheduleFull:false,
  					arrangeTime:"上"

  				}
  			]
  		},{
  			name:"廣州海珠分院",
  			schedule:[
  				{
  					time:new Date().getTime(),
  					scheduleFull:true,
  					arrangeTime:"上"

  				},
  				{
  					time:new Date('2016/10/10').getTime(),
  					scheduleFull:false,
  					arrangeTime:"上"

  				},
  				{
  					time:new Date('2016/10/11').getTime(),
  					scheduleFull:true,
  					arrangeTime:"上"

  				},
  				{
  					time:new Date('2016/10/9').getTime(),
  					scheduleFull:false,
  					arrangeTime:"全"

  				}
  			]
  		}

  	]
  	//表格
  	const columns = [ {
			key: "1",
		  title: '姓名',
		  width: '10%',
		  dataIndex:"patient_name"

		},{
			key: "2",
		  title: '性别',
		  width: '10%',
		  dataIndex:"patient_sex",
		  render : (text,recod) =>(
		  	<span>{text==0?("未知"):text==1?("男"):("女")}</span>
		  )
		},{
			key: "3",
			 title: '年龄',
		  width: '10%',
		 dataIndex: "patient_age"

		},{
			key: "4",
			 title: '医馆',
		  width: '30%',
		  dataIndex:"medical_museum"

		},{
			key: "5",
			title: '类型',
		  width: '10%',
		  dataIndex:"type",
		   render : (text,recod) =>(
		  	<span>{text==0?("首诊"):text==1?("已诊"):("未知")}</span>
		  )
		},

   		{
			key: "6",
			title:"就诊时间",
			dataIndex:'time',
			width: '20%'


		},{
			key: "7",
		  title:"报到情况",
			dataIndex:'registration',
			width: '10%',
			render : (text,recod) =>(
		  	<span>{text==0?("爽约"):text==1?("已到"):("未到")}</span>
		    )
     	}];
    //添加表格模拟数据
    let dataSources = [];
    for(let i=0;i<10;i++){
    	dataSources.push({
    	patient_name:'张三',
    	patient_sex:1,
    	patient_age:15,
    	medical_museum:"广州骏景医院",
    	type:0,
    	time:"10:00-12:00",
    	registration:1,
    	id:i
     })
    }
    let dataSource = {data:dataSources}
    const pageSize = 10;
    const config = {
    	dataSource,
    	columns,
    	pageSize
    }
    return(
      <div className="indexHome ">
        <Row type="flex" justify="center">
        	<Col span={7} >
	        	<div className="task-card-fans">
	        		<div>222222</div>
	        		<h3>我的粉丝</h3>
	        	</div>
        	</Col>
        	<Col offset={1} span={7}>
        		<div className="task-card-advisory">
	        		<div>222222</div>
	        		<h3>累计咨询</h3>
	        	</div>
        	</Col>
        	<Col  offset={1} span={7}>
        		<div className="task-card-treatment">
	        		<div>222222</div>
	        		<h3>累计就诊</h3>
	        	</div>
        	</Col>
        </Row>
        <Row className="scheduling">
        	<Col  span={24}  className="scheduling-title">
        		<div>本周排班</div>
        	</Col>

        	<Col span={24} className="scheduling-content">
        			<Tabs tabPosition="left">
        			{schedulList.map((data,id)=>(
        				<TabPane tab={data.name} key={id}>
				          	<div className="table-content">
				          		<div>
				          			<span className="radio-full"></span><span className="title-full">已約滿</span>
				          			<span className="radio-notfull"></span><span className="title-notfull">未約滿</span>
				          		</div>
				          		<div className="tablepane-list">
				          			{data.schedule.map((res,id)=>(<Item {...res} key={id}/>))}
				          		</div>
				          	</div>
			            </TabPane>

        			))}


			        </Tabs>
        	</Col>
        </Row>

        <Row className="index-table-title">
        	<Col>
        	    今日预约患者
        	</Col>
        </Row>
        <Row>
        	<Col >
        	    <TableGrid {...config}/>
        	</Col>
        </Row>
      </div>
    );
  }
}

Index.contextTypes={
  router: React.PropTypes.object.isRequired
};
Index.propTypes = {
};
function mapStateToProps(state){
  return {

  }
}

export default connect(mapStateToProps)(Index)
