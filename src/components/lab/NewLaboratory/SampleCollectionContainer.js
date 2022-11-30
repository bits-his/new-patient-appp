import React from "react";
import { Row, Col } from "reactstrap";
import LabRequisition from "./LabRequisitions";
import { Route, Switch } from "react-router";
import SampleCollection from "./SampleCollection";
import PastLabRequisition from "./PastLabRequisition";
import { useSelector } from "react-redux";

function SampleCollectionContainer() {
  const user = useSelector((state) => state.auth.user);
  let showPast = user.functionality.length === 1;
  return (
    <Row>
      {showPast ? (
        <Col md={3}>
          <PastLabRequisition type="SAMPLE_COLLECTION" />
        </Col>
      ) : null}
      <Col md={showPast ? 6 : 8}>
        <Switch>
          <Route exact path="/me/lab/sample-collection">
            <img
              alt="placeholder"
              src={require("../../../images/simpleCollection.jpg")}
              className="img-fluid mt-4"
              style={{ opacity: 0.5, width: "100%", height: "82%" }}
            />
          </Route>
          <Route
            exact
            path="/me/lab/sample-collection/:patientId/:labno"
            component={SampleCollection}
          />
          <Route
            exact
            path="/me/lab/sample-collection/history/:patientId/:labno"
            component={SampleCollection}
          />
        </Switch>
      </Col>
      <Col md={showPast ? 3 : 4}>
        <LabRequisition type="SAMPLE_COLLECTION" />
      </Col>
    </Row>
  );
}

export default SampleCollectionContainer;
