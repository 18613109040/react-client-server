/*
 * 简单表格封装
 * columns：表格列描述数据对象
 * dataSource：表格数据
 * pagination ：分页器
 * pageSize:每页显示多少
 *
 */
import React, {Component, PropTypes} from "react";
import { Input, Select, Button, Icon ,Table} from 'antd';

export default class TableGrid extends Component{
	constructor(props){
	    super(props);
	    this.state={
		    loading: false,
		    pageSize:this.props.pageSize?this.props.pageSize:10,
		    current:this.props.dataSource.current_page?this.props.dataSource.current_page:1
	    };
	}
	componentDidMount() {
		
	}
	showTotal(total) {
	  return `共 ${total} 条`;
	}
	handleTableChange(pagination, filters, sorter){
		this.setState({
			loading: true,
			pageSize:pagination.pageSize,
			current:pagination.current
		});
		const current =  pagination.current;
		const pagesize = pagination.pageSize;
		if(this.props.postconfig){
			
			this.props.dispatch(this.props.setgrid( Object.assign({},this.props.postconfig, {page_no: current , page_size:pagesize }), (res)=>{
	      		if(res.status===0){
	      			this.setState({ loading: false });
	     	 	}
	  		}));
		}else{
			this.props.dispatch(this.props.setgrid({page_no: current , page_size:pagesize }, (res)=>{
	      		if(res.status===0){
	      			this.setState({ loading: false });
	     	 	}
	  		}));

		}
        
	}
	onRowClick(record, index){
		if(this.props.routerpath)
		this.context.router.push(`${this.props.routerpath}?room_id=${record.id}&flage=${this.props.flage}`);
	}
  	render() {
       
  		const paginations = {
			  total: this.props.dataSource.total,
			  showSizeChanger: true,
			  pageSize:this.state.pageSize,
			  showTotal:this.showTotal,
			  showQuickJumper:true,
			  current:this.state.current == this.props.dataSource.current_page?this.state.current:this.props.dataSource.current_page,
			  pageSizeOptions:["10",'20','50','100']
			};
	    return (
	      <Table columns={this.props.columns}
	        rowKey={record => record.id}
	        dataSource={this.props.dataSource.data}
	        pagination={paginations}
	        loading={this.state.loading}
	        onChange={this.handleTableChange.bind(this)}
	        onRowClick={this.onRowClick.bind(this)}
	      />
	    );
	}

}

TableGrid.contextTypes={
 router  : React.PropTypes.object.isRequired
};
