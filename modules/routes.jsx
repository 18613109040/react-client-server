import React from 'react';
import { render } from 'react-dom';
import {Router,Route,browserHistory,IndexRoute} from "react-router";
// browserHistory  hashHistory
// import {Router, Route, IndexRedirect, useRouterHistory, Redirect,IndexRoute} from 'react-router';
// import {createHistory} from 'history';
// const history = useRouterHistory(createHistory)({basename: ''});



const routes = [
  {
    path:"/",
    getComponents(location, callback) {
      require.ensure([], function (require) {
        callback(null, require('./App').default)
      })
    },
    indexRoute:{
      getComponents(location, callback) {
        require.ensure([], function (require) {
          callback(null, require('./Abort').default)
        })
      },
    },
    childRoutes:[
      {
        path:"abort",
        getComponents(location, callback) {
          require.ensure([], function (require) {
            callback(null, require('./Abort').default)
          })
        },
      },{
        path:"repo/:id",
        getComponents(location, callback) {
          require.ensure([], function (require) {
            callback(null, require('./Repo').default)
          })
        }
      }
    ]
  },
  {
    path:"*",
    getComponents(location, callback) {
      require.ensure([], function (require) {
        callback(null, require('./NotFound').default)
      })
    }
  }
]

module.exports = routes;

// import App from './App';
// import Abort from './Abort';
// import NotFound from './NotFound';
// import Repo from './Repo';
//
//
// function autoCertification(nextState, replaceState) {
//   console.log(nextState.location.pathname);
// }
// module.exports = (
//   <Router history={browserHistory}>
//   <Route path="/" component={App}>
//     <IndexRoute component={Abort} />
//     <Route path="/abort" component={Abort}/>
//     <Route path="/repo/:id" component={Repo}/>
//   </Route>
//     <Route path="*" component={NotFound}/>
//   </Router>
// )

// module.exports = (
//   <Router history={browserHistory}>
//   <Route path="/" component={App} onEnter={autoCertification}>
//     <IndexRoute component={Abort} />
//     <Route path="/abort" component={Abort} onEnter={autoCertification}/>
//     <Route path="/repo" component={Repo} onEnter={autoCertification}/>
//   </Route>
//     <Route path="*" component={NotFound} onEnter={autoCertification}/>
//   </Router>
// )
