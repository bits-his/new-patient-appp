import React, { Component } from "react";
// import { Typeahead } from "react-bootstrap-typeahead";
import {
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
  Table,
  // FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";

export default class ApplicationApproval1 extends Component {
  state = {
    data: [],
    name: "",
    position: "",
    basicSalary: "",
    name1: "",
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleReset = () => {
    this.setState({
      name: "",
      position: "",
      basicSalary: "",
      name1: "",
    });
  };

  handleSubmit = () => {
    let data = this.state.data.concat({
      name: this.state.name,
      position: this.state.position,
      basicSalary: this.state.basicSalary,
      name1: this.state.name1,
    });
    this.setState({ data });
    console.log(data);
    this.handleReset();
  };

  render() {
    return (
      <>
        <Card>
          <CardHeader>Application Approval</CardHeader>
          <CardBody>
            <Row>
              <Col md={4}>
                <Label>Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleChange}
                />
              </Col>

              <Col md={4}></Col>

              <Col md={4}>
                <Label>Date</Label>
                <Input
                  type="date"
                  name="date"
                  value={this.state.date}
                  onChange={this.handleChange}
                />
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Label>DOB</Label>
                <Input
                  type="date"
                  name="dob"
                  value={this.state.dob}
                  onChange={this.handleChange}
                />
              </Col>

              <Col md={4}>
                <Label>Cert</Label>
                <Input type="text" />
              </Col>

              <Col md={4}></Col>
            </Row>

            <Row>
              <Col md={12}>
                <Table striped>
                  <thead>
                    <tr>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                </Table>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Label>Remarks</Label>
                <Input type="textarea" />
              </Col>
            </Row>

            <br />

            <center>
              <Button color="success" style={{ marginRight: "10px" }}>
                Approved
              </Button>
              <Button color="danger" style={{ marginRight: "10px" }}>
                Reject
              </Button>
            </center>
          </CardBody>
        </Card>
      </>
    );
  }
}
