import React from "react";
import { Row, Col } from "reactstrap";
import LabRequisition from "./LabRequisitions";
import { Route, Switch } from "react-router";
// import SampleCollection from './SampleCollection';
import { DOCTOR_COMMENT } from "../labRedux/actions";
import DoctorComment from "./DoctorComment";
import { useSelector } from "react-redux";
import PastLabRequisition from "./PastLabRequisition";
import AnalysisTopBar from "./analysis/top-bar";
import VisitList from "./past-visit/VisitList";
import ViewCompletedLabResults from "../ViewCompletedLabResult";

function DocumentCommentContainer() {
  const user = useSelector((state) => state.auth.user);
  let showPast = user.functionality.length === 1;
  return (
    <>
      <AnalysisTopBar />
      <Row>
        {showPast ? (
          <Col md={3}>
            <PastLabRequisition type={DOCTOR_COMMENT} />
          </Col>
        ) : null}
        <Col md={showPast ? 6 : 8}>
          <Switch>
            <Route exact path="/me/lab/doctor-comment">
              <img
                alt="placeholder"
                src={require("../../../images/simpleCollection.jpg")}
                className="img-fluid mt-4"
                style={{ opacity: 0.5, width: "100%", height: "82%" }}
              />
            </Route>
            <Route
              exact
              path="/me/lab/doctor-comment/reporting/:patientId/:labno/:department"
              component={DoctorComment}
            />
            <Route
              exact
              path="/me/lab/doctor-comment/reporting/history/:patientId/:labno/:department"
              component={DoctorComment}
            />
            <Route
              exact
              path="/me/lab/doctor-comment/past-patient-visit/:patientId"
              component={VisitList}
            />
            <Route
              exact
              path="/me/lab/doctor-comment/past-patient-visit/completed/:patientId/:labNo"
              component={ViewCompletedLabResults}
            />
          </Switch>
        </Col>
        <Col md={showPast ? 3 : 4}>
          <LabRequisition type={DOCTOR_COMMENT} />
        </Col>
      </Row>
    </>
  );
}

export default DocumentCommentContainer;
