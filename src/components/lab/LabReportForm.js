import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Form,
  FormGroup,
  // Button,
} from "reactstrap";

class LabReportForm extends Component {
  constructor() {
    super();
    this.state = {
      range: "",
      unit: "",
      addvalue: "",
      error: "",
      addrange: [],
    };
  }
  logChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      error: "",
    });
  };

  handleResetForm = () => {
    this.setState({
      range: "",
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { range } = this.state;
    if (range === "") {
      this.setState({ error: "please complete the form" });
    } else {
      this.setState(
        (prev) => ({
          addrange: prev.addrange.concat({
            range,
          }),
        }),
        () => this.handleResetForm()
      );
    }
  };

  render() {
    return (
      <div>
        <Card>
          <CardHeader tag="h6">Lab Report Form</CardHeader>
          <CardBody>
            <div className="">
              <Form>
                <FormGroup row>
                  <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    <label>Unit</label>
                    <input
                      className="form-control"
                      name="unit"
                      value={this.state.unit}
                      onChange={this.logChange}
                    />
                  </div>
                  <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    <label>Value</label>
                    <input
                      className="form-control"
                      name="labvalue"
                      value={this.state.labvalue}
                      onChange={this.logChange}
                    />
                  </div>
                </FormGroup>
                <Form>
                  <div className="">
                    <label>Range</label>
                    <input
                      className="form-control"
                      name="range"
                      value={this.state.range}
                      onChange={this.logChange}
                    />
                  </div>
                </Form>
              </Form>
              <br />
              <div className="" style={{ textAlign: "center" }}>
                <div>
                  {this.state.error !== "" ? (
                    <center>
                      <p style={{ color: "red" }}>{this.state.error}</p>
                    </center>
                  ) : null}
                </div>
                <button
                  className="btn btn-default btn-secondary"
                  onClick={this.handleSubmit}
                >
                  Create
                </button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}
export default LabReportForm;
