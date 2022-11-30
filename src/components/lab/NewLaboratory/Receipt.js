import React, { Component } from 'react';
import { Row, Col, Card, CardBody, Table } from 'reactstrap';
import SampleCollection from './SampleCollection';

export default class LapReceipt extends Component {
  render() {
    return (
      <>
        <Card>
          <CardBody>
            <Row>
              <Col md={9}>
                <h4>Optimum Radiolos and Labouratory Center </h4>
              </Col>
            </Row>
            <br />

            <Row>
              <Col md={3}>
                <p>Date:</p>
              </Col>

              <Col md={3}>
                <p>Time:</p>
              </Col>

              <Col md={3}>
                <p>Tel:</p>
              </Col>

              <Col md={3}>
                <p>Receptionist:</p>
              </Col>
            </Row>
            <br />

            <Row>
              <Col md={3}>
                <p>Amount Due:</p>
              </Col>

              <Col md={3}>
                <p>Amount Paid:</p>
              </Col>

              <Col md={3}>
                <p>Balance:</p>
              </Col>
            </Row>

            <Table striped>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Test</th>
                  <th>Price</th>
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
            <SampleCollection />
          </CardBody>
        </Card>
      </>
    );
  }
}
