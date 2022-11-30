import React from "react";
import { Switch, Route, Redirect } from "react-router";
// import BookAnAppointment from "../appointments/BookAnAppointment";
import NewAppointment from "../doc_dash/appointments/NewAppointment";
import SearchDocse from "../patient/pages/SearchDocs";
// import SearchDocs from "../patient/pages/SearchDocs";
import UserNewAppointment from "../patient/pages/UserNewAppointment";
import Home from "./dashboard/AdminDashboard/Home";
import BookAppointments from "./patient/pages/BookAppointment";
// import SearchDocs from "./patient/pages/SearchDocs";
// import BookAppointment from "./patient/pages/BookAppointment";

function PatientMain() {
  return (
    <Switch>
      <Redirect
        exact
        from="/me/patient"
        to="/me/patient"
      />
      <Route
        exact
        path="/me/patient/home"
        component={()=><Home />}
      />
       <Route
        exact
        path="/me/patient/appointments/new/:patientId"
        component={(props) => <NewAppointment {...props} />}
      />
      <Route
      exact 
      path="/me/patient/appointment"
      component={()=><SearchDocse />} />
      <Route
      exact
      path="/me/patient/appointment/new/:docId"
      component={()=><UserNewAppointment />} />
      
    </Switch>
  );
}

export default PatientMain;
