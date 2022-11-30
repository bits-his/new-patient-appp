import React, { Component } from "react";
import {
  Card,
  CardBody,
  Label,
  FormGroup,
  Col,
  Row,
  Input,
  Button,
  CardHeader,
} from "reactstrap";

export default class StaffSalary extends Component {
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
        <div>
          <Card>
            <CardHeader>Staff Salary</CardHeader>
            <CardBody>
              <Row>
                <Col md={4}>
                  <FormGroup>
                    <Label>Name</Label>
                    <Input
                      type="text"
                      name="name"
                      value={this.state.name}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                </Col>

                <Col md={4}>
                  <FormGroup>
                    <Label>Position</Label>
                    <Input
                      type="text"
                      name="position"
                      value={this.state.position}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                </Col>

                <Col md={4}>
                  <FormGroup>
                    <Label>Basic Salary</Label>
                    <Input
                      type="text"
                      name="basicSalary"
                      value={this.state.basicSalary}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <center>
                <Button color="success">Add Allowance</Button>
              </center>

              <Row>
                <Col md="4">
                  <FormGroup>
                    <Label>Name</Label>
                    <Input
                      type="text"
                      name="name1"
                      value={this.state.name1}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <center>
                <Button color="primary" onClick={this.handleSubmit}>
                  Save
                </Button>
              </center>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }
}
