import {combineReducers} from "redux";
import {messageList, errorMessageList, myMsgList} from "./Message";
import {getConsulting,getConsultsEnd,getAllConsul,getAllConsulEnd} from "./willConsult";
import {getConsultsList,getContentById,answer} from "./ConsultsSquare";
import {getUserInfo} from './getUserInfo';
import {userInfo,patientInfo} from './User';
import {verificationCode,smsCode,restPassword} from './restPassWord';
import {prescriptionInfo,drugList,drugListTwo,usageDescList,zfList,yfList,yfListTwo,zhufuList,recipelist,frequencyList,queryDoctorsthList,queryRareList} from "./Medicine";
import {zXPrescriptionInfo} from "./ZxMedicine";
import {callPatientsList,temporaryList,temporaryFinishList} from "./OutPatientDepartment";
import {medicrecordList,chineDiagnose,westernDiagnose,dealList,getclientdata,tongueNature,tongueCoat,pulse} from './CiteManage'
import {checkMedicineList, checkRecipeList} from "./CheckMedicine"
import {treatmentList,treatmentTemData} from "./Treatment"
import {queryRecipeTempletTree} from "./UsePreTemplate";
import {consultList} from "./Consult";
import {commentList} from "./Comments";
import {fileList,fileInfo,medicalRecordInfo} from "./Files";
import {feedbackList} from "./Tickling";
import {loadType,zxDiagnose} from './Comon';
import {setting} from './Setting';
const rootReducer = combineReducers({
  messageList,
  errorMessageList,
  myMsgList,
  consultList,
  patientInfo,
  getConsultsList,
  getContentById,
  answer,
  getConsulting,
  getConsultsEnd,
  getAllConsul,
  getAllConsulEnd,
  getUserInfo,
  userInfo,
  verificationCode,
  smsCode,
  restPassword,
  prescriptionInfo,
  callPatientsList,
  temporaryList,
  temporaryFinishList,
  medicrecordList,
  chineDiagnose,
  westernDiagnose,
  drugList,
  drugListTwo,
  usageDescList,
  zfList,
  yfList,
  yfListTwo,
  zhufuList,
  frequencyList,
  zXPrescriptionInfo,
  recipelist,
  checkMedicineList,
  checkRecipeList,
  treatmentList,
  treatmentTemData,
  fileList,
  fileInfo,
  commentList,
  medicalRecordInfo,
  dealList,
  queryRecipeTempletTree,
  loadType,
  zxDiagnose,
  feedbackList,
  setting,
  queryDoctorsthList,
  queryRareList,
  getclientdata,
  tongueNature,
  tongueCoat,
  pulse,
});

export default rootReducer;
