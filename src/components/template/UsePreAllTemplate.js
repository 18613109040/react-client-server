//引用模板
import React, {Component, PropTypes} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {Row,Col,Input,Checkbox,Button,Select,message,Tooltip,Modal,Tree,Icon } from 'antd';
import {getUser} from "../../utils/User";
import {getQueryRecipeTempletTree,addpersonalrecipetemplet,deleterecipetemplet,modifyrecipetemplet} from "../../store/actions/UsePreTemplate";
const TreeNode = Tree.TreeNode;

class UsePreAllTemplate extends Component {
  constructor(props){
    super(props);
    this.state={
    	visible:true,
      subModal:{
        visible:false,
        value:'',
        parentId:'',
        isModify:false,
      },
      tree:[]
    }
  }
  //服务器端和客户端都只调用一次，在初始化渲染执行之前立刻调用。如果在这个方法内调用 setState，render() 将会感知到更新后的 state，将会执行仅一次，尽管 state 改变了。
  componentWillMount(){

  }

  //在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）。在生命周期中的这个时间点，组件拥有一个 DOM 展现，你可以通过 this.getDOMNode() 来获取相应 DOM 节点。
  componentDidMount(){
    const data = {
      page_size:20,
      page_no:1,
      staff_id:getUser().doctor_id
    }
    this.props.dispatch(getQueryRecipeTempletTree(data,json=>{
      if(json.data&&json.data.list){
        this.setState({
          tree:[...json.data.list]
        })
        //遍历第二级目录
        const listTree = json.data.list;
        for (let i = 0; i < listTree.length; i++) {
          const subData = {
            page_size:20,
            page_no:1,
            staff_id:getUser().doctor_id,
            parent_id:listTree[i].templet_id,
          }
          // debugger;
          this.props.dispatch(getQueryRecipeTempletTree(subData,json=>{
            if(json.status==0){
              let tree = this.state.tree;
              for (let j = 0; j < tree.length; j++) {
                if(tree[j].templet_id == subData.parent_id){
                  tree[j].tree = [...json.data.list]
                  break;
                }
              }
              this.setState({
                tree
              })
            }
          }))
        }
      }
    }))
  }
  componentWillReceiveProps(nextProps){
  }

  //model ok
  handleOk(){
    if(this.props.saveHandleOk instanceof Function ){
      this.props.saveHandleOk();
    }
  }
  //model cancel
  handleCancel(){
    this.props.cancelClick()
  }
  // model tree select
  onSelect(selectedKeys,{selected, selectedNodes, node}){
    let arrIndex = node.props.pos.split("-");
    if(arrIndex.length == 5){
      this.props.selectItem(selectedKeys,node.props.name,arrIndex[2]);
    }
  }

  addCatalog(item){
    let {subModal} = this.state;
    subModal.visible=true;
    subModal.parentId=item.templet_id+"";
    subModal.isModify=false;
    subModal.value="";
    this.setState({
      subModal
    })
  }
  deleteCatalog(item,parent_id){
    const __self = this;
    Modal.confirm({
	    title: '删除',
	    content: <span >是否删除<span style={{"color":"red"}}>[{item.templet_name}]</span>目录</span>,
	    okText: '确定',
	    cancelText: '取消',
	    onOk(){
        const data = {
          staff_id:getUser().doctor_id,
          templet_id:item.templet_id+"",
        }
        __self.props.dispatch(deleterecipetemplet(data,json=>{
          if(json.status==0){
            message.success('删除成功');
            let tree = __self.state.tree;
            let flat = true;
            for (var i = 0; i < tree.length && flat; i++) {
              if(tree[i].templet_id == parent_id){
                let subTree = tree[i].tree;
                for (var j = 0; j < subTree.length && flat; j++) {
                  if(subTree[j].templet_id == item.templet_id){
                    subTree.splice(j,1)
                    flat = false;
                  }
                }
                tree[i].tree = subTree;
              }
            }
            __self.setState({
              tree
            })
          }else{
            message.error('删除失败');
          }
        }))
	    },
	    onCancel() {},
	  });

  }
  eidtCatalog(item,parent_id){
    let {subModal} = this.state;
    subModal.visible=true;
    subModal.value=item.templet_name;
    subModal.parentId=item.templet_id+"";
    subModal.isModify=true;
    this.setState({
      subModal
    })
  }

  //修改目录  添加目录
  onChangeUserName(e){
    let {subModal} = this.state;
    subModal.value=e.target.value
    this.setState({
      subModal
    })
  }
  addHandleOk(){
    this.state.subModal.isModify?this.modifyTree():this.saveTree();
  }
  modifyTree(){
    const data = {
      templet_id:this.state.subModal.parentId,
      templet_name:this.state.subModal.value,
      staff_id:getUser().doctor_id
    }
    this.props.dispatch(modifyrecipetemplet(data,json=>{
      if(json.status == 0){
        let {tree} = this.state
        tree.map(item=>{
          item.tree.map(item2=>{
            if(item2.templet_id == data.templet_id){
              item2.templet_name = data.templet_name;
            }
          })
        })
        message.success("修改目录成功");
        this.setState({
          tree,
          subModal:{
            visible:false,
            isModify:false,
            value:'',
            parentId:'',
            value:"",
          },
        })
      }
    }));
  }
  saveTree(){
    const data = {
      parent_id:this.state.subModal.parentId,
      templet_name:this.state.subModal.value,
      staff_id:getUser().doctor_id
    }
    this.props.dispatch(addpersonalrecipetemplet(data,json=>{
      if(json.status == 0){
        //更新对应树节点
        const subData = {
          page_size:20,
          page_no:1,
          staff_id:getUser().doctor_id,
          parent_id:this.state.subModal.parentId,
        }
        this.props.dispatch(getQueryRecipeTempletTree(subData,json=>{
          if(json.status == 0){
            let tree = this.state.tree;
            for (var i = 0; i < tree.length; i++) {
              if(tree[i].templet_id == subData.parent_id){
                tree[i].tree = [...json.data.list]
                break;
              }
            }
            message.success("添加目录成功");
            this.setState({
              tree,
              subModal:{
                visible:false,
                isModify:false,
                value:'',
                parentId:'',
                value:"",
              },
            })
          }
        }))
      }
    }))
  }
  addHandleCancel(){
    let {subModal} = this.state;
    subModal.visible=false;
    subModal.isModify=false;
    subModal.value="";
    this.setState({
      subModal
    })
  }
  onLoadData(treeNode) {
    if(treeNode.props.myLoadLeaf){
      const [a,b,first,second] = treeNode.props.pos.split("-");
      let {tree} = this.state;
      // 加载对应的处方详情
      const data = {
        page_size:20,
        page_no:1,
        staff_id:getUser().doctor_id,
        parent_id:tree[first].tree[second].templet_id+'',
      }

      return new Promise((resolve) => {
        this.props.dispatch(getQueryRecipeTempletTree(data,json =>{
          tree[first].tree[second].tree = json.data.list;
          this.setState({
            tree
          })
          resolve();
        }))
      });
    }
    return new Promise((resolve) => {resolve();});
  }


  render(){
  	const loop = (data,isLeaf) => data.map((item) => {
      if(item.tree&&item.tree.length>0){
        return <TreeNode key={item.templet_id} name={item.templet_name} myLoadLeaf={!isLeaf} title={item.templet_name} isLeaf={isLeaf}>
                {loop(item.tree?item.tree:[],true)}
              </TreeNode>;
      }else{
        return <TreeNode key={item.templet_id} name={item.templet_name} myLoadLeaf={!isLeaf} title={item.templet_name} isLeaf={isLeaf}></TreeNode>;
      }
    });
    const loopParent = data => data.map((item) => {
      return <TreeNode title={item.templet_name} key={item.templet_id} name={item.templet_name}>
              {loop(item.tree?item.tree:[],false)}
            </TreeNode>;
    });
    return(
      <div className="">
      	<Modal
      		title={this.props.title}
      		maskClosable={false}
      		visible={this.props.isVisible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          width={"80%"}
          style={{minWidth:"900px"}}
          footer={false}
          wrapClassName="citeManageModel"
        >
          <Row type="flex" justify="space-around" align="top"  className="content">
          	<Col span={5} className="model-left">
          		<div className="tree-left">
                <Tree
                  loadData={this.onLoadData.bind(this)}
                  onSelect={this.onSelect.bind(this)}
                  defaultExpandedKeys={['1','5','6','7']}
                >
                  <TreeNode title={'个人模板'} key={'-0'} name={'个人模板'}>
                    {loopParent(this.state.tree.filter((item)=>item.common=='0'))}
                  </TreeNode>
                  <TreeNode title={'通用模板'} key={'-1'} name={'通用模板'}>
                    {loopParent(this.state.tree.filter((item)=>item.common=='1'))}
                  </TreeNode>

                </Tree>
          		</div>
          	</Col>
            <Col span={19} className="model-right">
              {this.props.children}
            </Col>
          </Row>
        </Modal>
        <Modal
        	title={this.state.subModal.isModify?"修改模板名称":"新增模板名称"}
      		maskClosable={false}
      		visible={this.state.subModal.visible}
          footer={false}
          wrapClassName="citeAddtemplate"
          onCancel={this.addHandleCancel.bind(this)}
        >
        	<div className="mulu">
        		<span>目录名称:</span>
        		<span><Input onChange={this.onChangeUserName.bind(this)} value={this.state.subModal.value}/></span>
        	</div>
        	<div className="button-oper">
          	<Button className="button-green" onClick={this.addHandleOk.bind(this)}>{this.state.subModal.isModify?"修改":"确定"}</Button>
            <Button className="button-red" onClick={this.addHandleCancel.bind(this)}>取消</Button>
          </div>
        </Modal>
      </div>
    );
  }
}

UsePreAllTemplate.contextTypes={
  router: React.PropTypes.object.isRequired
};
UsePreAllTemplate.defaultProps={
  title:"引用【处方】模板",
  selectItem:()=>{},
  isVisible:false,
  cancelClick:()=>{},
};
UsePreAllTemplate.propTypes = {
  title:PropTypes.string,
  selectItem:PropTypes.func,
  isVisible:PropTypes.bool,
  cancelClick:PropTypes.func,
};

function mapStateToProps(state){
  return {
  }
}

export default connect(mapStateToProps)(UsePreAllTemplate)
