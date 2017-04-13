import React, {Component, PropTypes} from "react";
import {Form,Row,Col} from 'antd';
const FormItem = Form.Item;
class CustForm extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onSubmit(e){
    const {onSubmit,form} = this.props;
    e.preventDefault();
    if (typeof(onSubmit)!=='function') return;
    const data = form.getFieldsValue();
    form.validateFields((err,values)=>{
      if (!err) {
         onSubmit(values);
      }
    });
    // const data = this.props.form.getFieldsValue();
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    return (
      <Form inline onSubmit={this.onSubmit}>
        {
          this.props.children.map((item,index)=>{
            return (
              <FormItem {...item.props} key={index} className={index==2||index==3||index==4?'form-item-w17':(index==1?'form-item-w25':"")}>
              {item.props.name ? getFieldDecorator(item.props.name, Object.assign({},item.props.rules))(item.props.children) : item.props.children}
              </FormItem>
            )
          })
        }
      </Form>
    )
  }
}
const CustomizedForm =  Form.create({
  onFieldsChange(props, changedFields){
    // props.onChange(changedFields);
  },
  // mapPropsToFields(props){
  //   console.log(props);
  // },
  onValuesChange(props, values){

  }
})(CustForm);
export default CustomizedForm;
