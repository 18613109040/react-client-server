//import "babel-polyfill";
import  React from "react";
import {render} from 'react-dom';
import {Router, browserHistory} from 'react-router';
import {Provider} from "react-redux";
import routes from './routes';
import configureStore from "./store/configureStore";
import  "./components/gst-printInit.js"
import "./assets/base.scss";
import "./assets/css/index.scss";

const initialState = window.__INITIAL_STATE__;

const store = configureStore({}, browserHistory);

if(typeof document !== 'undefined' && window) {
  window.onload = ()=>{
    render(
      <Provider store={store}>
        <Router history={browserHistory} routes={routes} />
      </Provider>,
      document.getElementById("app")
    );
  }
}
