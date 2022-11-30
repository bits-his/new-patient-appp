import React, { Component } from "react";
import { Card, CardBody, Col, Row,FormGroup,Label,Input, Button, } from "reactstrap";


export default class Application extends Component {

    state = {
        data: [],
        firstName: "",
        LastName: "",
        DOB: "",
        PhoneNo: "",
        email: "",
        Addres: "",
        Date: "",
        MidName: "",
        NextOfKing: "",
        school: "",
        Year: "",
        Certificate: "",
      };
    
      handleChange = (e) => {
        this.setState({
          [e.target.name]: e.target.value,
        });
      };
    
      handleReset = () => {
        this.setState({
            firstName: "",
            LastName: "",
            PhoneNo: "",
            email: "",
            Addres: "",
            Date: "",
            MidName: "",
            NextOfKing: "",
            school: "",
            Year: "",
            Certificate: "",
        });
      };
    
      handleSubmit = () => {
        let data = this.state.data.concat({
          firstName: this.state.firstName,
          LastName: this.state.LastName,
          PhoneNo: this.state.PhoneNo,
          email: this.state.email,
          Addres: this.state.Addres,
          Date: this.state.Date,
          MidName: this.state.MidName,
          NextOfKing: this.state.NextOfKing,
          school: this.state.school,
          Year: this.state.Year,
          Certificate: this.state.Certificate,
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
              <div className="card card-header">Application</div>
              <CardBody>
              <Row>
              <Col md={4}>
                <FormGroup>
                  <Label>First Name</Label>
                  <Input
                    type="text"
                    name="firstName"    
                    value={this.state.firstName}
                      onChange={this.handleChange}
                  />
                </FormGroup>
              </Col>

              {/* <Col md={4}></Col> */}

              <Col md={4}>
                <FormGroup>
                  <Label>Last Name</Label>
                  <Input
                    type="text"
                    name="LastName" 
                    value={this.state.LastName}
                      onChange={this.handleChange}
                  />
                </FormGroup>
              </Col>

              <Col md={4}>
                <FormGroup>
                  <Label>DOB</Label>
                  <Input
                    type="date"
                    name="DOB"           
                    value={this.state.DOB}
                      onChange={this.handleChange}
                  />
                </FormGroup>
              </Col>

              <Col md={4}>
                <FormGroup>
                  <Label>Phone No</Label>
                  <Input
                    type="number"
                    name="PhoneNo"  
                    value={this.state.PhoneNo}
                      onChange={this.handleChange}      
                  />
                </FormGroup>
              </Col>


              <Col md={4}>
                <FormGroup>
                  <Label> Email </Label>
                  <Input
                    type="email"
                    name="email"    
                    value={this.state.email}
                      onChange={this.handleChange}             
                  />
                </FormGroup>
              </Col>

              <Col md={4}>
                <FormGroup>
                  <Label>Addres</Label>
                  <Input
                    type="text"
                    name="Addres"     
                    value={this.state.Addres}
                      onChange={this.handleChange}     
                  />
                </FormGroup>
              </Col>
   
              <Col md={4}>
                <FormGroup>
                  <Label> Date </Label>
                  <Input
                    type="Date"
                    name="Date"    
                    value={this.state.Date}
                      onChange={this.handleChange}             
                  />
                </FormGroup>
              </Col>

              <Col md={4}>
                <FormGroup>
                  <Label> Mid Name </Label>
                  <Input
                    type="text"
                    name="MidName"          
                    value={this.state.MidName}
                      onChange={this.handleChange}       
                  />
                </FormGroup>
              </Col>

              <Col md={4}>
                <FormGroup>
                  <Label> Next Of King </Label>
                  <Input
                    type="text"
                    name="NextOfKing"        
                    value={this.state.NextOfKing}
                      onChange={this.handleChange}         
                  />
                </FormGroup>
              </Col>
              <center>
                <Button color="success">Add Allowance</Button>
              </center>

              <Col md={4}>
                <FormGroup>
                  <Label> School </Label>
                  <Input
                    type="text"
                    name="school"  
                    value={this.state.school}
                      onChange={this.handleChange}               
                  />
                </FormGroup>
              </Col>    

              <Col md={4}>
                <FormGroup>
                  <Label>Year </Label>
                  <Input
                    type="date"
                    name="Year"             
                    value={this.state.Year}
                      onChange={this.handleChange}    
                  />
                </FormGroup>
              </Col>

              <Col md={4}>
                <FormGroup>
                  <Label>Certificate </Label>
                  <Input
                    type="text"
                    name="Certificate"     
                    value={this.state.Certificate}
                      onChange={this.handleChange}            
                  />
                </FormGroup>
              </Col>
            </Row>
        
            <table class="table table-bordered">
    <thead>
      <tr>
        <th>School</th>
        <th>Year</th>
        <th>Certificate</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>
              </CardBody>
            </Card>
          </div>
        </>
      );
    }
  }