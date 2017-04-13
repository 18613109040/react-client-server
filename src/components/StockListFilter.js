/**
 * Created by simon on 2016/8/29.
 */
import React, {Component, PropTypes} from "react";
//import SearchItem from "../components/SearchItem"
import SearchInput from "../components/SearchInput"
import {Form, Input, Button, Icon, Row, Col} from 'antd';
const FormItem = Form.Item;

class StockListFilter extends Component {
  constructor(props){
    super(props);
    this.onClickSubmit = this.onClickSubmit.bind(this);
  }
  onClickSubmit(e) {
    e.preventDefault();
    const {onSubmit} = this.props;
    onSubmit();
  }
  render(){
    const {initialValue,itemList, onSearchItemChange, onSearchItemSelect, searchInputValue} = this.props;
    // const {getFieldProps} = this.props.form;
    return(
      <Form horizontal className="component stock-list-filter" onSubmit={this.onClickSubmit}>
        <Row type="flex" gutter={5} className="control">
          <Col xs={12} md={6} lg={6}>
            <FormItem label="收费项目" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
              <SearchInput value={searchInputValue} placeholder="请输入收费项目" itemList={itemList} onChange={onSearchItemChange} onSelect={onSearchItemSelect} />
            </FormItem>
          </Col>
          <Col xs={12} md={5} lg={5} offset={1}>
            <Button type="primary" htmlType="submit">查询</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}
StockListFilter = Form.create()(StockListFilter);
StockListFilter.propTypes = {
  onSearchItemChange: PropTypes.func,
  onSearchItemSelect: PropTypes.func,
  searchInputValue: PropTypes.string,
  initialValue:PropTypes.object,
  onSubmit:PropTypes.func,
  itemList:PropTypes.array,
};

export default StockListFilter;