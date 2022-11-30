import React, { Component } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import {
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
  Table,
  FormGroup,
  Label,
  // Input,
} from "reactstrap";

export default class ApplicationApproval extends Component {
  render() {
    return (
      <>
        <Card>
          <CardHeader>Application Approval</CardHeader>
          <CardBody>
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label>Search</Label>
                  <Typeahead
                    onChange={(selected) => {
                      // Handle selections...
                    }}
                    options={["Staff1", "Staff2", "Staff3"]}
                    placeholder="Search"
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Table striped>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Sex</th>
                      <th>Postion</th>
                      <th>View</th>
                    </tr>
                  </thead>
                </Table>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </>
    );
  }
}
