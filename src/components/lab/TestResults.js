import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Col,
  FormGroup,
  Label,
  Card,
  Button,
  CardTitle,
} from 'reactstrap';
import { useRouteMatch } from 'react-router';
import { getLabTestsByServiceId } from './actions/labActions';
import LabImages from './LabImages';



export default function TestResults({ handleSubmit = (f) => f }) {
  let match = useRouteMatch();
  const serviceId = match.params.labServiceId;
  // const patientId = match.params.patientId;
  const [tests, setTests] = useState([]);
  const [observation, setObservation] = useState('')
  const [files, setFiles] = useState([])

      const handleChangeStatus = ({ meta }, status) => {
        // console.log(status, meta)
        if(status==='done') {
            setFiles(prev => ([...prev, meta]))
        }
      }

  useEffect(
    () => {
      // console.log("trfvygbuhnjimtgyun")
      getLabTestsByServiceId(serviceId)
        .then((t) => setTests(t))
        .catch((err) => console.log(err));
    },
    [serviceId],
  );


  const handleChange = (key, value, index) => {
    let newArr = [];
    let oldArr = tests;
    oldArr.forEach((item, i) => {
      if (i === index) {
        newArr.push({ ...oldArr[index], [key]: value });
      } else {
        newArr.push(item);
      }
    });
    setTests(newArr);
  };

  const _handleSubmit = () => {
    handleSubmit(tests, files, observation);
  };

  return (
    <Card className="p-3">
        {/* {JSON.stringify(files)} */}
      <CardTitle className="">Enter Results</CardTitle>
     
      <Form>
        {tests &&
          tests.map((item, index) => (
            <FormGroup row key={index}>
              <Label md={3} className="text-right">
                {item.test_name}
              </Label>
              <Col md={5}>
                <Input
                  type="text"
                  name="value"
                  placeholder="Enter value here"
                  value={item.value || ''}
                  onChange={(e) => handleChange('value', e.target.value, index)}
                />
              </Col>
              <Col className="d-flex justify-content-between">
                {item.test_unit}
                {item.range_from ? (
                  <div>
                     {/* {JSON.stringify(item)} */}
                    Range: {`${item.range_from} - ${item.range_to}`}({item.test_unit})
                  </div>
                ) : null}
              </Col>
            </FormGroup>
          ))}
          <div className="row">
            <div className="col-md-12">
            <label>Observations (optional)</label>
            <textarea 
            name="observation"
            value={observation}
            className="form-control" 
            onChange={(e) => setObservation(e.target.value)}
            placeholder="Additional notes (Observations)"/>
        </div>
        <div>
            <LabImages handleChangeStatus={handleChangeStatus} />
        </div>
        </div>
        <center>
          <Button
            color="primary"
            className="mt-3 pl-4 pr-4"
            onClick={_handleSubmit}
          >
            Submit
          </Button>
        </center>
      </Form>
    </Card>
  );
}
