import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Col,
  Row,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import moment from 'moment';
import AutoComplete from '../comp/components/AutoComplete';
import { useHistory, Route } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getTestListFromServices } from './actions/labActions';
import NewTest from './TestResults';
import { _customNotify } from '../utils/helpers';
import SelectInput from '../comp/components/SelectInput';

export default function NewLabTest() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [selectedTest, setSelectedTest] = useState({});
  const history = useHistory();
  const dispatch = useDispatch();
  const labTest = useSelector((state) => state.lab.validLabTests);

  useEffect(() => {
    dispatch(getTestListFromServices());
  }, []);

  const handleSubmit = (tests, files, observation) => {
    const obj = {
      patient: name,
      patientAge: age,
      patientGender: gender,
      ...selectedTest,
    };
    if (age === '' || name === '' || gender === '') {
      _customNotify('Some form need to be fill');
    } else {
      let data = {
        ...obj,
        results: { tests, files, observation },
      };
      console.log(data);
    }
  };
  return (
    <>
      <Card>
        <CardHeader className="d-flex justify-content-between">
          <h6> New Lab Test </h6>
          <h6>{moment().format('MMMM Do, YYYY')}</h6>
        </CardHeader>
        <CardBody>
          <Form>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
              />
            </FormGroup>
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label for="dob">Age</Label>
                  <Input
                    type="text"
                    name="age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </FormGroup>
              </Col>

              <SelectInput
                label="Gender"
                required
                options={['Male', 'Female']}
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              />
            </Row>

            <FormGroup>
              <AutoComplete
                options={labTest}
                labelKey="labSub"
                name="test"
                label="Select Test"
                required
                onChange={(data) => {
                  if (data.length) {
                    history.push(`/me/lab/newlab/${data[0]._id}`);
                    setSelectedTest({
                      test: data[0].labSub,
                      testId: data[0]._id,
                    });
                  }
                }}
              />
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
      <Route path="/me/lab/newlab/:labServiceId">
        <NewTest handleSubmit={handleSubmit} />
      </Route>
    </>
  );
}
