/**
 * Created by Administrator on 2016/9/13.
 */
import React from "react";
import {Table} from 'antd';
import Tools from "../utils/tools";
const Component = React.Component,
  PropTypes = React.PropTypes;

export default class ItemDetailTable extends Component {
  constructor(props) {
    super(props);
    this.static = {
      columns: [
        {
          title: "收费项目",
          dataIndex: "item_name"
        }, {
          title: "药房",
          dataIndex: "pharmacy_name"
        }, {
          title: "批次号",
          dataIndex: "batch_number"
        }, {
          title: "指导售价",
          dataIndex: "price",
          render:(text, record, index) => text ? Tools.convertPrice(text,4) : ""
        }, {
          title: "可用存量",
          dataIndex: "amount"
        }, {
          title: "有效日期",
          dataIndex: "expiration_time"
        }, {
          title: "最新入库时间",
          dataIndex: ""
        }
      ]
    };
  }

  render() {
    const {loading, list} = this.props;
    const {columns} = this.static;
    const pagination = {
      showSizeChanger: true,
      showTotal(total){
        return `共 ${total} 条数据`;
      }
    };
    return (
      <div>
        <Table loading={loading} columns={columns} dataSource={list} pagination={pagination}/>
      </div>
    )
  }
}
ItemDetailTable.propTypes = {
  list: PropTypes.array,
  loading: PropTypes.bool
};