import React ,{Component} from "react";


export default class Repo extends Component{
  constructor (props) {
    super(props);
    this.goBack = this._goBack.bind(this);
  }
  _goBack(){
    this.context.router.push("/");
  }
  componentWillMount(){
    console.log('--componentWillMount--');
  }
  render(){
    const {id} = this.props.params;
    console.log('---------Repo-------');
    return (
      <div>
        repo:{id}
        <button onClick={this.goBack}>go back</button>
      </div>
    )
  }
}

Repo.contextTypes={
  router: React.PropTypes.object
}

// module.exports = Repo;
