/**
 * Created by Administrator on 2016/9/13.
 */
import React from "react";
import {Table,Select} from 'antd';
const Component = React.Component,
  PropTypes = React.PropTypes;
let timeout = null;
export default class SearchInput extends Component{
  constructor(props){
    super(props);
    this.state={
      value:"",
      hadSelect:false,
    };
    this.handleSelect = this._handleSelect.bind(this);
    this.handleChange = this._handleChange.bind(this);
  }
  _handleSelect(value,option){
    // this.setState({
    //   value:option.props.context.itemName
    // });
    this.props.onSelect(option.props.context,value);
  }
  _handleChange(value){
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout( fetch.bind(this), 300);
    function fetch() {
      this.props.onChange(value);
    }
  }

  renderOptionsList(){
    const {itemList} = this.props;
    let optionsList =[];
    itemList.map((item)=> {
      let obj = {
        itemId: item.item_id,
        itemName: item.item_name,
      };
      // 使用了optionLabelProp="name"属性，显示的值使用了name的值
      optionsList.push(
        <Select.Option key={obj.itemId} value={`${obj.itemId}`} name={obj.itemName}  context={obj}>
          {obj.itemName}
        </Select.Option>
      );
    });
    return optionsList;
  }
  render(){
    // const {value} = this.state;
    const {value, placeholder,notFoundContent} = this.props;
    const optionItems = this.renderOptionsList();
    return (
      <Select
        combobox
        placeholder={placeholder}
        notFoundContent={notFoundContent}
        filterOption={false}
        optionLabelProp="name"
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {optionItems}
      </Select>
    )
  }
}
SearchInput.defaultProps={
  itemList:[]
};
SearchInput.propTypes = {
  itemList: PropTypes.array,
  loading: PropTypes.bool,
  value:PropTypes.string,
  placeholder: PropTypes.string,
  notFoundContent:PropTypes.string
};