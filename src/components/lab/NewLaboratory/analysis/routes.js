import SampleCollection from "../SampleCollection"
import AllDepartment from "./AllDepartment"
// import NewMicroBiology from "../MicroBiology/NewMicroBiology"
import DoctorComment from "../DoctorComment"
import RadiologyAnalysis from "../Radiology/Radiology"
import RadiologyScan from "../Radiology/RadiologyScan"
import VisitList from "../past-visit/VisitList"
import ViewCompletedLabResults from "../../ViewCompletedLabResult"

export default [
  { path: "/me/lab/sample-collection/:patientId", component: SampleCollection },
  {
    path: "/me/lab/sample-collection/history/:patientId",
    component: SampleCollection,
  },
  {
    path: "/me/lab/microbiology-analysis/:patientId/:labno",
    component: AllDepartment,
  },
  {
    path: "/me/lab/microbiology-analysis/history/:patientId/:labno",
    component: AllDepartment,
  },
  {
    path: "/me/lab/radiology-analysis-scan/:patientId/:labno/:test",
    component: RadiologyScan,
  },
  {
    path: "/me/lab/radiology-analysis-scan/history/:patientId/:labno/:test",
    component: RadiologyAnalysis,
  },
  {
    path: "/me/lab/radiology-analysis/:patientId/:labno/:test",
    component: RadiologyAnalysis,
  },
  {
    path: "/me/lab/cardiology-analysis/new/:patientId/:labno/:test",
    component: RadiologyAnalysis,
  },
  {
    path: "/me/lab/cardiology-analysis/history/:patientId/:labno/:test",
    component: RadiologyAnalysis,
  },
  {
    path: "/me/lab/radiology-analysis/history/:patientId/:labno/:test",
    component: RadiologyAnalysis,
  },
  {
    path: "/me/lab/doctor-comment/reporting/:patientId/:labno/:department",
    component: DoctorComment,
  },
  {
    path: "/me/lab/doctor-comment/reporting/history/:patientId/:labno/:department",
    component: DoctorComment,
  },
  {
    path: "/me/lab/doctor-comment/past-patient-visit/:patientId",
    component: VisitList,
  },
  {
    path: "/me/lab/doctor-comment/past-patient-visit/completed/:patientId/:labNo",
    component: ViewCompletedLabResults,
  },
  {
    path: "/me/lab/doctor-comment/past-patient-visit/uncompleted/:patientId/:labNo",
    component: ViewCompletedLabResults,
  },
];
