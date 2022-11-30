import React, { useState } from 'react';
import SpeechInput from '../../comp/speech-to-text/SpeechInput';
import {
  Row,
  Label,
  Input,
  FormGroup,
  Col,
  Card,
  CardBody,
  Table,
  Button,
  CardHeader,
} from 'reactstrap';
import { useRouteMatch } from 'react-router';
import { _fetchApi } from '../../../redux/actions/api';
import { apiURL } from '../../../redux/actions';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useQuery } from '../../../hooks';

export default function MicroBiologyAnalysis() {
  const match = useRouteMatch();
  const labno = match.params.labno;
  const patientId = match.params.patientId;
  const query = useQuery()
  const request_id = query.get('request_id')

  const [, setPatientInfo] = useState({});
  // const [labs, setLabs] = useState([]);
  // const [remark, setRemark] = useState('');
  // const [loading, setLoading] = useState(false);
  // const [comments, setComments] = useState([]);

  const getPatientLabInfo = useCallback(() => {
    _fetchApi(
      `${apiURL()}/lab/request/history/${patientId}/${labno}/${request_id}`,
      (data) => {
        if (data.success) {
          setPatientInfo(data.results[0]);
        }
      },
      (err) => console.log(err),
    );
  }, [patientId, request_id, labno]);

  useEffect(
    () => {
      getPatientLabInfo();
    },
    [getPatientLabInfo],
  );

  return (
    <>
      <Card>
        <CardHeader className="text-center font-weight-bold">
          Microbiology Analysis
        </CardHeader>
        <CardBody>
          {/* <SampleForm
            labno={labno}
            patientInfo={patientInfo}
            historyMode="read"
            history={patientInfo.history}
          /> */}
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label>Lab No:</Label>
                <Input type="text" />
              </FormGroup>
            </Col>

            <Col md={4} />

            <Col md={4}>
              <FormGroup>
                <Label>Date:</Label>
                <Input type="date" />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <FormGroup>
                <Label>Name:</Label>
              </FormGroup>
            </Col>

            <Col md={4}>
              <FormGroup>
                <Label>Age:</Label>
              </FormGroup>
            </Col>

            <Col md={4}>
              <FormGroup>
                <Label>History</Label>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={3}>
              <FormGroup>
                <Label>Test:</Label>
              </FormGroup>
            </Col>

            <Col md={3}>
              <FormGroup check>
                <input
                  type="checkbox"
                  name="bloodGlucoseCheck"
                  // onChange={this.props.handleCheck}
                  // checked={this.props.bloodGlucoseCheck}
                />{' '}
                <Label>ADL</Label>
              </FormGroup>
            </Col>

            <Col md={3}>
              <FormGroup check>
                <input
                  type="checkbox"
                  name="bloodGlucoseCheck"
                  // onChange={this.props.handleCheck}
                  // checked={this.props.bloodGlucoseCheck}
                />{' '}
                <Label>DEF</Label>
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup check>
                <input
                  type="checkbox"
                  name="bloodGlucoseCheck"
                  // onChange={this.props.handleCheck}
                  // checked={this.props.bloodGlucoseCheck}
                />{' '}
                <Label>GHF</Label>
              </FormGroup>
            </Col>
          </Row>

          <Table striped>
            <thead>
              <tr>
                <th>#</th>
                <th>Test Name</th>
                <th>Unit</th>
                <th>Range</th>
                <th>Unit</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Urea</td>
                <td>3000.00</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>GL</td>
                <td>40000.oo</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Na</td>
                <td>1000.00</td>
              </tr>

              <tr>
                <th scope="row">4</th>
                <td>Discount</td>
                <td>1000.00</td>
              </tr>

              <tr>
                <th scope="row">3</th>
                <td>Total</td>
                <td>1000.00</td>
              </tr>
            </tbody>
          </Table>

          <Row>
            <Col md={12}>
              <div className="">
                <label>Remark</label>
                <SpeechInput
                  // onInputChange={(text) => this.setState({ setNote: text })}
                  tag="textarea"
                  // value={setNote}
                />
              </div>
            </Col>
          </Row>

          <br />
          <center>
            <Button>Save</Button>
          </center>
        </CardBody>
      </Card>
    </>
  );
}
