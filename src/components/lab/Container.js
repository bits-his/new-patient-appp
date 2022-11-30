import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import LaboratorySetupForms from './LabSetupForm';
// import { Button } from 'reactstrap';
import LabProcesses from './LabProcesses';
import SampleTracking from './SampleTracking';
// import PrintResult from './PrintResult';
import Verify from './Verify';

function Container({ requestsList, onPatientClick, error, history }) {
  return (
    <div>
      {/* pohikjhygfd */}
      {/* <div>
        <Button
        color='primary'
        outline
        onClick={()=>{history.push('/me/lab/pending')}}
        >Pending Lab Request</Button>
      </div> */}
      <Switch>
        <Route path="/me/lab/setup" exact>
          <LaboratorySetupForms />
        </Route>
        <Route path="/me/lab/process/:id">
          <LabProcesses />
        </Route>
        <Route path="/me/lab/track">
          <SampleTracking />
        </Route>
        <Route path="/me/lab/result">
          {/* <PrintResult /> */}
        </Route>
        <Route path="/me/lab/verify">
          <Verify />
        </Route>
      </Switch>
    </div>
  );
}
export default withRouter(Container);
