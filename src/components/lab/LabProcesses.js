import React, { useEffect, useState } from 'react';
import { useRouteMatch, Route, useHistory } from 'react-router';
import {
  getPatientLabTests,
  // getTestListFromServices,
  // getLabTestsByServiceId,
} from './actions/labActions';
import { Card, Table, CardTitle } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
// import { useCallback } from 'react';
import Loading from '../comp/components/Loading';
import { getAgeFromDOB } from '../utils/helpers';
import moment from 'moment';
import TestResults from './TestResults';

const LabProcesses = () => {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const [loading, toggle] = useState(false);
  let patientLab = useSelector((state) => state.lab.selectedPatientLabInfo);
  // let labTests = useSelector((state) => state.lab.validLabTests);

  const { patientId } = match.params;

  const _getPatientLab = () => {
    toggle(true);
    // console.log(patientId);
    dispatch(getPatientLabTests(patientId, () => toggle(false)));
  };

  useEffect(
    () => {
      _getPatientLab();
      // dispatch(getTestListFromServices());
      // getLabTestsByServiceId('ckc3yzt1s00033r5u0z2gjh3z')
    },
    [patientId],
  );

  return (
    <div>
      <PatientInfo patientLab={patientLab} loading={loading} />
      {/* {JSON.stringify(patientLab)} */}

      <Route exact path="/me/lab/process/:patientId">
        <PatientTestsList list={patientLab.labs} patientId={patientId} />
      </Route>
      <Route exact path="/me/lab/process/:patientId/:labServiceId">
        <TestResults />
      </Route>

      {/* <TestResults /> */}
    </div>
  );
};

export default LabProcesses;

function PatientTestsList({ list = [], loading = false, patientId }) {
  const history = useHistory();
  if (list.length) {
    return (
      <Card className="p-2 mt-2">
        {loading && <Loading />}
        <Table hover bordered>
          <thead>
            <tr>
              <th>S/N</th>
              <th>Test</th>
              <th>Status</th>
              <th>Requested by</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, idx) => (
              <tr
                key={idx}
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  history.push(
                    `/me/lab/process/${patientId}/${item.serviceId ||
                      'ckc55c32300003r5wvcr09ewe'}`,
                  )
                }
              >
                <td>{idx + 1}</td>
                <td>{item.test}</td>
                <td>{item.status}</td>
                <td>
                  {item.createdBy}
                  <span className="float-right text-muted small">
                    {moment(item.createdAt).fromNow()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    );
  } else {
    return null;
  }
}

function PatientInfo({ patientLab, loading }) {
  const date = new Date().toISOString();
  return (
    <Card className="p-3">
      <CardTitle className="h6 text-center">Patient's Information</CardTitle>
      {loading && <Loading />}
      {patientLab.patientInfo ? (
        <div
          style={{ justifyContent: 'space-around' }}
          className="d-flex flex-row font-weight-bold"
        >
          <div>
            <span className="mr-3">Name: </span>
            <span>
              {patientLab.patientInfo.firstname}{' '}
              {patientLab.patientInfo.surname}
            </span>
          </div>

          <div>
            <span className="mr-3">Sex:</span>
            <span>{patientLab.patientInfo.gender}</span>
          </div>
          <div>
            <span className="mr-3"> Age:</span>
            <span>{getAgeFromDOB(patientLab.patientInfo.dob)} years</span>
          </div>
        </div>
      ) : null}

      <div className="text-muted text-right">
        Date: {moment(date).format('DD-MM-YYYY')}
      </div>
    </Card>
  );
}
