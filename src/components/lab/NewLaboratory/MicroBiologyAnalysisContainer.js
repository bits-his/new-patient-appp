import React from "react";
import { Row, Col } from "reactstrap";
import LabRequisition from "./LabRequisitions";
import { Route, Switch } from "react-router";
// import MicroBiologyAnalysis from './MicroBiologyAnalysis';
import NewMicroBiology from "./MicroBiology/NewMicroBiology";
import { useSelector } from "react-redux";
import PastLabRequisition from "./PastLabRequisition";
import Scrollbars from "react-custom-scrollbars";
import AnalysisTopBar from "./analysis/top-bar";

function MicrobiologyAnalysisContainer() {
  const user = useSelector((state) => state.auth.user);
  let showPast = user.functionality.length === 1;
  return (
    <>
      <AnalysisTopBar />
      <Row>
        {showPast ? (
          <Col md={3}>
            <PastLabRequisition type="MICRO_SAMPLE_ANALYSIS" />
          </Col>
        ) : null}
        <Col md={showPast ? 6 : 8}>
          <Scrollbars style={{ height: 650 }}>
            <Switch>
              <Route exact path="/me/lab/microbiology-analysis">
                <img
                  src={require("../../../images/microbiology.jpg")}
                  className="img-fluid mt-4"
                  alt="microbiology-pic"
                  style={{ opacity: 0.5, width: "100%", height: "82%" }}
                />
              </Route>
              {/* <Route
            path="/me/lab/microbiology-analysis/:patientId/:labno"
            component={MicroBiologyAnalysis}
          /> */}
              <Route
                exact
                path="/me/lab/microbiology-analysis/:patientId/:labno/:test"
                component={NewMicroBiology}
              />
              <Route
                exact
                path="/me/lab/microbiology-analysis/history/:patientId/:labno/:test"
                component={NewMicroBiology}
              />
            </Switch>
          </Scrollbars>
        </Col>
        <Col md={showPast ? 3 : 4}>
          <LabRequisition type="MICRO_SAMPLE_ANALYSIS" />
        </Col>
      </Row>
    </>
  );
}

export default MicrobiologyAnalysisContainer;
