import React from "react";
import { Row, Col } from "reactstrap";
import LabRequisition from "./LabRequisitions";
import { Route, Switch } from "react-router";
import SampleAnalysis from "./SampleAnalysis";
import { useSelector } from "react-redux";
import PastLabRequisition from "./PastLabRequisition";
import { HEMATOLOGY_ANALYSIS } from "../labRedux/actions";
import AnalysisTopBar from "./analysis/top-bar";

function HematologyAnalysisContainer() {
  // const department = useSelector(state => state.auth.user.department)
  // let department = 'Hematology';
  // let department = 'Chemical Pathology';
  const user = useSelector((state) => state.auth.user);
  let showPast = user.functionality.length === 1;

  return (
    <>
     <AnalysisTopBar />
      <Row>
        {showPast ? (
          <Col md={3}>
            <PastLabRequisition
              type={HEMATOLOGY_ANALYSIS}
              department="Hematology"
            />
          </Col>
        ) : null}
        <Col md={showPast ? 6 : 8}>
          {/* {JSON.stringify(department)} */}
          <Switch>
            <Route exact path="/me/lab/hematology-analysis">
              <img
                alt="placeholder"
                src={require("../../../images/analysis.jpg")}
                className="img-fluid mt-4"
                style={{ opacity: 0.5, width: "100%", height: "82%" }}
              />
            </Route>
            <Route exact path="/me/lab/hematology-analysis/:patientId/:labno">
              <SampleAnalysis department="Hematology" />
            </Route>
            <Route
              exact
              path="/me/lab/hematology-analysis/history/:patientId/:labno"
            >
              <SampleAnalysis department="Hematology" />
            </Route>
          </Switch>
        </Col>
        <Col md={showPast ? 3 : 4}>
          <LabRequisition type="HEMATOLOGY_ANALYSIS" department="Hematology" />
        </Col>
      </Row>
    </>
  );
}

export default HematologyAnalysisContainer;
