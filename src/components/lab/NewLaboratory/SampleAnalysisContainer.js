import React from "react";
import { Row, Col } from "reactstrap";
import LabRequisition from "./LabRequisitions";
import { Route, Switch } from "react-router";
import SampleAnalysis from "./SampleAnalysis";
import PastLabRequisition from "./PastLabRequisition";
import { useSelector } from "react-redux";
import Scrollbars from "react-custom-scrollbars";
import AnalysisTopBar from "./analysis/top-bar";

function SampleAnalysisContainer() {
  // const department = useSelector(state => state.auth.user.department)
  // let department = 'Hematology';
  // let department = 'Chemical Pathology';
  const user = useSelector((state) => state.auth.user);
  const facilityInfo = useSelector((state) => state.facility.info);
  let isHospital = facilityInfo.type === "hospital";

  let showPast = user.functionality.length === 1;
  return (
    <>
    <AnalysisTopBar />
    <Row>
      {showPast ? (
        <Col md={3}>
          <PastLabRequisition
            type={isHospital ? "CHEMICAL_PATHOLOGY_ANALYSIS" : "ALL_DEPARTMENT"}
            department={isHospital ? "Chemical Pathology" : "All"}
          />
        </Col>
      ) : null}
      <Col md={showPast ? 6 : 8}>
        {/* {JSON.stringify(department)} */}
        <Scrollbars style={{ height: 650 }}>
          <Switch>
            <Route exact path="/me/lab/chemical-pathology-analysis">
              <img
                alt="placeholder"
                src={require("../../../images/analysis.jpg")}
                className="img-fluid mt-4"
                style={{ opacity: 0.5, width: "100%", height: "82%" }}
              />
            </Route>
            <Route exact path="/me/lab/sample-analysis">
              <img
                alt="placeholder"
                src={require("../../../images/analysis.jpg")}
                className="img-fluid mt-4"
                style={{ opacity: 0.5, width: "100%", height: "82%" }}
              />
            </Route>
            <Route exact path="/me/lab/sample-analysis/:patientId/:labno/:head">
              <SampleAnalysis department="All" />
            </Route>
            <Route
              exact
              path="/me/lab/chemical-pathology-analysis/:patientId/:labno"
            >
              <SampleAnalysis department="Chemical Pathology" />
            </Route>
            <Route
              exact
              path="/me/lab/chemical-pathology-analysis/history/:patientId/:labno"
            >
              <SampleAnalysis department="Chemical Pathology" />
            </Route>
          </Switch>
        </Scrollbars>
      </Col>
      <Col md={showPast ? 3 : 4}>
        <LabRequisition
          // type={"CHEMICAL_PATHOLOGY_ANALYSIS"}
          type={isHospital ? "ALL_DEPARTMENT" : "CHEMICAL_PATHOLOGY_ANALYSIS"}
          department={isHospital ? "All" : "Chemical Pathology"}
        />
      </Col>
    </Row>
    </>
  );
}

export default SampleAnalysisContainer;
