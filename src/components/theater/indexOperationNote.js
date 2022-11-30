import React from 'react';
import { Route, Redirect, Switch } from 'react-router';
import VerticalTheaterMenu from './VerticalTheaterMenu';
import OperationNoteDashboard from './OperationNoteDashboard';
import AddNewDoc from './AddNewDoc';

export default function IndexOperationNote () {
    return (
        <>
         <div className="row" style={{ margin: 0, padding: 0 }}>
      <div className="col-md-3 col-lg-3">
        <VerticalTheaterMenu />
      </div>
      <div className='col-md-9 col-lg-9'>
        <Switch>
          <Redirect exact from="/me/theater" to="/me/theater/operation-table" />
          <Route path="/me/theater/operation-table" component={OperationNoteDashboard} />
          {/* <Route path="/me/theater/add-new-operation-note" /> */}
          <Route path="/me/theater/process/add-new-doc" component={AddNewDoc} />
        </Switch>
      </div>
      </div>
        </>
    )
}