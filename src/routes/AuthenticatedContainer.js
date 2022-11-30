import React from "react";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import { hasAccess } from "../components/auth";

import InventoryNew from "../components/inventory/InventoryNew";
import AuthWrapper from "./AuthWrapper";
import Account from "../components/account/Account";
// import Patientlist from '../components/record/Patientlist'
import RecordsDashboard from "../components/record/RecordsDashboard";

import IndexOperationNote from "../components/theater/indexOperationNote";
import Doctor from "../components/doc_dash";
// import Doctor from "../components/doc_dash";
import Nurse from "../components/nurse/Nurse";
import Lab from "../components/lab/Lab";
import Admin from "../components/admin/Admin";
import Maintenance from "../components/maintainace/Maintenance";
import ReportIssues from "../components/user/ReportIssues";
import Profile from "../components/user/Profile";
import Report from "../components/report/Report";
import LabInventoryDash from "../components/lab/labInventory/LabInventoryDash";
import HumanResources from "../components/hr/Index";
import { NURSING_ROUTE_ROOT } from "../components/nurse/routes";
import AppointmentsIndex from "../components/appointments";
import PharmacyIndex from "../components/pharmacy/PharmacyIndex";
// import useWindowDimensions from "../components/comp/getWindowDimension";
import CustomScrollbar from "../components/comp/components/CustomScrollbar";
import PatientMain from "../components/patientApp/main";

const AuthenticatedContainer = ({ user = {} }) => {
  return (
    <AuthWrapper>
      <CustomScrollbar height="95vh">
        <Switch>
          {/* <Redirect from='/me' to='/me/records' exact /> */}
          {user.accessTo
            ? hasAccess(user, ["Records"]) && (
                <Route
                  path="/me/records"
                  render={(props) => <RecordsDashboard {...props} />}
                />
              )
            : null}

          {user.accessTo
            ? hasAccess(user, ["Doctors"]) && (
                <Route
                  path="/me/doctor"
                  render={(props) => <Doctor {...props} />}
                />
              )
            : null}
            <Route 
            path="/me/patient"
            render={()=><PatientMain />} />

          {user.accessTo
            ? hasAccess(user, ["Pharmacy"]) && (
                <Route
                  path="/me/pharmacy"
                  render={(props) => <PharmacyIndex {...props} />}
                />
              )
            : null}

          {user.accessTo
            ? hasAccess(user, ["Nurse"]) && (
                // <Route path="/me/nurse" component={Nurse} />
                <Route
                  path={NURSING_ROUTE_ROOT}
                  render={(props) => <Nurse {...props} />}
                />
              )
            : null}

          {user.accessTo
            ? hasAccess(user, ["Laboratory"]) && (
                <Route path="/me/lab" render={(props) => <Lab {...props} />} />
              )
            : null}

          {user.accessTo
            ? hasAccess(user, ["Inventory"]) && (
                <Route
                  path="/me/inventory"
                  render={(props) => <LabInventoryDash {...props} />}
                />
              )
            : null}

          {user.accessTo
            ? hasAccess(user, ["Accounts"]) && (
                <Route
                  path="/me/account"
                  render={(props) => <Account {...props} />}
                />
              )
            : null}

          {user.accessTo
            ? hasAccess(user, ["Theater"]) && (
                <Route
                  // exact
                  path="/me/theater"
                  render={(props) => <IndexOperationNote {...props} />}
                />
              )
            : null}
          {user.accessTo
            ? hasAccess(user, ["Admin"]) && (
                <Route
                  path="/me/admin"
                  render={(props) => <Admin {...props} />}
                />
              )
            : null}
          {user.accessTo
            ? hasAccess(user, ["Maintenance"]) && (
                <Route
                  exact
                  path="/me/maintenance"
                  render={(props) => <Maintenance {...props} />}
                />
              )
            : null}
          <Route path="/me/report" render={(props) => <Report {...props} />} />
          <Route
            path="/me/hr"
            render={(props) => <HumanResources {...props} />}
          />
          <Route
            exact
            path="/me/report_issues"
            render={(props) => <ReportIssues {...props} />}
          />
          <Route
            exact
            path="/me/profile"
            render={(props) => <Profile {...props} />}
          />

          <Route
            path="/me/new_inventory"
            render={(props) => <InventoryNew {...props} />}
          />

          <Route
            path="/me/appointments"
            render={(props) => <AppointmentsIndex {...props} />}
          />
        </Switch>
      </CustomScrollbar>
    </AuthWrapper>
  );
};

const mapStateToProps = ({ auth }) => ({
  user: auth.user,
});

export default connect(mapStateToProps)(AuthenticatedContainer);
