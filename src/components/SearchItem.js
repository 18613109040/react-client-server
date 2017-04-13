import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import { Input, Select, Button, Icon } from 'antd';
export default class SearchItem extends Component{
  constructor(props){
    super(props);
    this.state={
      // visible: false
      value: ""
    }
    // this.onChangeHandler = this.onChangeHandler.bind(this);
  }
  componentWillReceiveProps(oNextProps){
    // this.setState({
    //   visible: oNextProps.visible
    // })
  }
  // onChangeHandler(value){
  //   const {onChange} = this.props;
  //   this.setState({value: value})
  //   onChange(value)
  // }

  render(){
    // const { visible } = this.state;
    const { list, children, placeholder, onChange, onSearch } = this.props;
    return (
      <Input.Group className="ant-input-group ant-search-input">
        <Select showArrow={false}
        combobox
        value={this.state.value}
        filterOption={false}
        placeholder={placeholder}
        onChange={onChange}
        onSearch={onSearch}>
          {
            list.map((item, index)=>{
              return <Select.Option key={item.item_name}>
                {item.item_name}
              </Select.Option>
            })
          }
        </Select>
      </Input.Group>
    )
  }
}
SearchItem.proptypes = {
  placeholder: PropTypes.string,
  // visible: PropTypes.bool,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  children: PropTypes.node.isRequired,
  list: PropTypes.array.isRequired
};
