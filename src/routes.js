import React from "react";
import {Route, IndexRoute,IndexRedirect} from "react-router";
import createBrowserHistory from 'history/lib/createBrowserHistory'
import Application from "./containers/Application";
import NotFound from "./containers/NotFound";
/*import Login from "./containers/Login";
import ConsultsSquare from "./containers/ConsultsSquare";
import ConsultsList from "./containers/ConsultsList";
import Consulting from "./containers/Consulting";
import ConsultsEnd from "./containers/ConsultsEnd";*/
//import AdvisoryDetails from './containers/AdvisoryDetails';



/*门诊*/
import OutpatientDepartment from "./containers/OutPatientDepartment";
/*看医生 叫诊*/
import SeeDoctor from "./containers/SeeDoctor";
import ChatCenter from "./containers/ChatCenter";
import Chat from "./containers/Chat";
import QuickReply from "./containers/QuickReply";
//import RestPassword from "./containers/RestPassword";
import PatientFile from "./containers/PatientFile"; //患者档案
import PatientInformation from "./containers/PatientInformation"; //患者信息
import PatientInfo from "./containers/PatientInfo"; //患者信息
import MedicalRecord from "./containers/MedicalRecord"; //诊疗记录
import PatientConsultHistory from "./containers/file/PatientConsultHistory"; //患者咨询记录
import Statistics from "./containers/Statistics"; //统计
//import Setting from "./containers/Setting"; //个人设置
import Tickling from "./containers/Tickling"; //反馈


import PatientInfoItem from './components/PatientInfoItem';
import Yinpian from "./components/seeDoctor/Yinpian";
import ZxMedicine from "./components/seeDoctor/ZxMedicine";
import CheckMedicine from "./components/seeDoctor/CheckMedicine";
import Treatment from "./components/seeDoctor/Treatment";
import Summary from "./components/seeDoctor/Summary";
import ClinicalContent from "./components/seeDoctor/ClinicalContent";


export default(

	 <Route component={Application} path="/" >
	    <IndexRoute component={OutpatientDepartment} />
	    <IndexRedirect to="outPatient"/>
	    {/*<Route path="patientCounsel" component={ConsultsList} >
	    	 <IndexRedirect to="consulting"/>
	    	 <Route path="consulting" component={Consulting} />
	    	 <Route path="end" component={ConsultsEnd} />
	    </Route>
	    <Route path="consultsSquare" component={ConsultsSquare}/>
	    <Route path="consultsSquare/advisoryDetails" component={AdvisoryDetails}/>*/
	    }
	    <Route component={ChatCenter} path="chatcenter" />
	    <Route component={PatientFile} path="patientFile" />
	    <Route component={PatientInformation} path="patient">
	    	<IndexRedirect to="patientinfo"/>
	    	<Route path="patientinfo" component={PatientInfo} />
	    	<Route path="medicalrecord" component={MedicalRecord} />
	    	<Route path="patientconsulthistory" component={PatientConsultHistory} />

	    </Route>

	   { /* <Route path="user/login" component={Login} />
	      <Route path="user/rest" component={RestPassword} />*/
	   }

      <Route path="outPatient" component={OutpatientDepartment} />
      <Route path="outPatient/seeDoctor" component={SeeDoctor}>
      	<IndexRedirect to="binli"/>
      	<Route path="binli" component={ClinicalContent} />
      	<Route path="yipian" component={Yinpian} />
      	<Route path="chenyao" component={ZxMedicine} />
      	<Route path="jiancha" component={CheckMedicine} />
      	<Route path="liliao" component={Treatment} />
      	<Route path="huizong" component={Summary} />
      </Route>
			<Route path="outPatient/SimpleOutPatient" component={SeeDoctor}>
      	<IndexRedirect to="binli"/>
      	<Route path="binli" component={ClinicalContent} />
      	<Route path="yipian" component={Yinpian} />
      	<Route path="chenyao" component={ZxMedicine} />
      	<Route path="jiancha" component={CheckMedicine} />
      	<Route path="liliao" component={Treatment} />
      	<Route path="huizong" component={Summary} />
      </Route>
			<Route path="statistics" component={Statistics} />
			<Route path="setting"  getComponent={
           (nextState, cb)=>{
             require.ensure([], (require) => {
               cb(null, require('./containers/Setting'))
             }, 'setting')
          }
         } />
			<Route path="tickling" component={Tickling} />

	    <Route component={NotFound} path="*" />

	  </Route>

)
