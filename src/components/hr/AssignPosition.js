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
import moment from "moment";

export default class AssignPostion extends Component {
  state = {
    date: moment().format("YYYY-MM-DD"),
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleReset = () => {
    this.setState({
      description: "",
      location1: "",
      unitName: "",
      location2: "",
      department: "",
    });
  };

  handleSubmit = () => {
    let data = this.state.data.concat({
      description: this.state.description,
      location1: this.state.location1,
      unitName: this.state.unitName,
      location2: this.state.location2,
      department: this.state.department,
    });
    this.setState({ data });
    console.log(data);
    this.handleReset();
  };

  handleAdd = () => {
    let data1 = this.state.data1.concat({
      unitName: "Unit Name",
      location: "Location",
    });

    this.setState({ data1 });
  };

  render() {
    return (
      <>
        <div>
          <Card>
            <CardHeader tag="h5" className="d-flex justify-content-between">
              <p>Assign Postion</p>
              <p> Date: {this.state.date}</p>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md={4}>
                  <FormGroup>
                    <Label>Select Deparment</Label>
                    <Input
                      type="select"
                      name="department"
                      onChange={this.handleChange}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                    </Input>
                  </FormGroup>
                </Col>

                <Col md={4}>
                  <FormGroup>
                    <Label>Unit</Label>
                    <Input type="text" />
                  </FormGroup>
                </Col>

                <Col md={4}>
                  <FormGroup>
                    <Label>Position</Label>
                    <Input
                      type="select"
                      name="department"
                      onChange={this.handleChange}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              <center>
                <Button color="primary">Save</Button>
              </center>
            </CardBody>
          </Card>
        </div>
      </>
    );
  }
}
