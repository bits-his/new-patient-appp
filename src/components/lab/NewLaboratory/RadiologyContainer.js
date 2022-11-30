import React from 'react';
import { Row, Col } from 'reactstrap';
import LabRequisition from './LabRequisitions';
import { Route, Switch } from 'react-router';
import Radiology from './Radiology/Radiology';

function RadiologyAnalysisContainer() {
  return (
    <Row>
      <Col md={8}>
        <Switch>
          <Route exact path="/me/lab/radiology-analysis">
            <img
              alt="radiology-placeholder"
              src={require('../../../images/Radiology.jpg')}
              className="img-fluid mt-4"
              style={{ opacity: 0.5, width: '100%', height: '82%' }}
            />
          </Route>
          {/* <Route
            path="/me/lab/radiology-analysis/:patientId/:labno"
            component={radiologyAnalysis}
          /> */}
          <Route
            path="/me/lab/radiology-analysis/:patientId/:labno"
            component={Radiology}
          />
        </Switch>
      </Col>
      <Col md={4}>
        <LabRequisition type="RADIOLOGY_SAMPLE_ANALYSIS" />
      </Col>
    </Row>
  );
}

export default RadiologyAnalysisContainer;
