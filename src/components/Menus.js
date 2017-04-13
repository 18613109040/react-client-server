/*
 *左侧导航详细
 *
 */
import React, {Component, PropTypes} from "react";
import { Row,Col,Icon,Card,Spin,Badge,Button,Tooltip} from 'antd';
import {getUser} from "../utils/User";
class MenuItem extends Component {
	constructor(props){
    super(props);
    this.state = {
			currentMenu:this.props.selectkey,
			title:"收缩",
			type:"menu-fold",
			menufold:true,
			placement:"left"
		}
	}
	onClickMenu(e){
		
		this.setState({
			currentMenu:e.currentTarget.attributes.name['value']
		})
		
		//if(e.currentTarget.attributes.name['value'] == "patientCounsel" ||e.currentTarget.attributes.name['value'] == "consultsSquare"){
			//window.location.href=`/${e.currentTarget.attributes.name['value']}`;
		//}else{
			this.props.Router.push(`/${e.currentTarget.attributes.name['value']}`)
		//}
	}
	menFold(e){
		
		if(this.state.menufold==false){
			this.setState({
				menufold:true,
				title:"展开",
				type:"menu-unfold",
				placement:"right"
				
			})
		}else{
			this.setState({
				menufold:false,
				title:"收缩",
				type:"menu-fold",
				placement:"left"
			})
		}
	}
	render(){
		
		return (
			<div>
			{ 
				this.state.menufold==false?(
				<div className="menu-left">
					<div className="menu-fold-un">
						<Tooltip placement={this.state.placement} title={this.state.title}>
	        		<Icon type={this.state.type} onClick={this.menFold.bind(this)}/>
	      		</Tooltip>
	      	</div> 
	      	{this.props.menus.map((menus,id)=>(
						<div className="set-block"  key={`${menus.router}-${id}`}>
						<Button  disabled={!menus.disable} type="dashed" className={this.state.currentMenu==menus.router?"menus-style change-menu-select":"menus-style"}   onClick={this.onClickMenu.bind(this)}  name={menus.router} >
							<div className={`icon-${menus.icon} iconfont`  }>{menus.newMessage?(<Badge count={menus.num}></Badge>):""}</div>
							<div>{menus.name}</div>
						</Button>
						{/*(id==4||id==5||id==8||id==9)?(<hr style={{"width": "118px","height": "10px"}}/>):""*/}
						</div>
					))}
      	</div>):(
      	<div className="menu-left-shrink">
					{/*<div className="menu-fold-un">
						<Tooltip placement={this.state.placement} title={this.state.title}>
	        		<Icon type={this.state.type} onClick={this.menFold.bind(this)}/>
	      		</Tooltip>
	      	</div>*/} 
					{this.props.menus.map((menus,id)=>(
						<div key={id} className="item-menu">
							
							<div  className={this.state.currentMenu==menus.router?`change-menu-select icon-${menus.icon} iconfont`:`icon-${menus.icon} iconfont`}   onClick={this.onClickMenu.bind(this)}  name={menus.router}  >
								{menus.newMessage?(<Badge count={menus.num}></Badge>):""}
							</div>
							
							<div className="name-size">{menus.name}</div>
							<div className="iconfont icon-three-point point"></div>
						</div>
					))}
					</div>
				)

			}
			</div>
			
		)

	}

}
MenuItem.contextTypes={
  router: React.PropTypes.object.isRequired
};

class Menus extends Component{
	constructor(props){
	    super(props);
	    this.state={

	    };
	}
  render() {
	
		
		const  {pathname } = this.props.pathname;
	  return (

	    	<div>

	    		<Row type="flex" justify="center" align="middle">
	    			<MenuItem menus={this.props.menus} selectkey={pathname.split('/')[1]} Router={this.context.router}/>
	    		</Row>

	    	</div>

	   )
	}

}


Menus.contextTypes={
  router: React.PropTypes.object.isRequired
};



export default Menus
