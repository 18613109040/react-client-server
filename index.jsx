import React from 'react';
import { render } from 'react-dom';
// import {match,Router,Route,createMemoryHistory,IndexRoute} from "react-router";
// const history = createMemoryHistory(location);
// browserHistory  hashHistory createMemoryHistory
import {match,Router, Route, IndexRedirect, useRouterHistory, Redirect,IndexRoute} from 'react-router';
import {createHistory} from 'history';
const history = useRouterHistory(createHistory)({basename: ''});

import routes from './modules/routes'

// render(
//   <Router routes={routes} history={browserHistory}/>,
//   // <Router routes={routes} history={history}/>,
//   document.getElementById('app')
// )

match({ history, routes }, (error, redirectLocation, renderProps) => {
  const { location } = renderProps;
  render(
    <Router history={history} {...renderProps}/>,
    // <Router routes={routes} history={history}/>,
    document.getElementById('app')
  )
})
