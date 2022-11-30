import React, { useState } from "react";
import { Card, CardBody, Col, Row,FormGroup,Label,Input, } from "reactstrap";


export default function SWESApplication () {
const [form, setForm]= useState({
    firstName: "",
    LastName: "",
    DOB: "",
    phoneNo: "",
    email: "",
    address: "",
    date: "",
    otherName: "",
    nextOfKing: "",
    school: "",
    gender: "",
    startDate: '',
    endDate: ''
})
    
    
      const handleChange = (e) => {
        setForm({
          [e.target.name]: e.target.value,
        });
      };
    
    //  const handleReset = () => {
    //     setForm({
    //         firstName: "",
    //         LastName: "",
    //         phoneNo: "",
    //         email: "",
    //         address: "",
    //         date: "",
    //         otherName: "",
    //         nextOfKing: "",
    //         school: "",
    //         Year: "",
    //         gender: "",
    //     });
    //   };
    
    //  const handleSubmit = () => {
    //     let data = form.data.concat({
    //       firstName: form.firstName,
    //       LastName: form.LastName,
    //       phoneNo: form.phoneNo,
    //       email: form.email,
    //       address: form.address,
    //       date: form.date,
    //       otherName: form.otherName,
    //       nextOfKing: form.nextOfKing,
    //       school: form.school,
    //       gender: form.gender,
    //     });
    //     setForm({ data });
    //     console.log(data);
    //     handleReset();
    //   };

      return (
        <>
          <div>
            <Card>
              <div className="card card-header">Application</div>
              <CardBody>
                 <Row className="m-0">
            <Col md={3} className="offset-md-6">
                     <FormGroup>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    name="startDate"    
                    value={form.firstName}
                      onChange={handleChange}
                  />
                </FormGroup>
            </Col>
         <Col md={3} >
                     <FormGroup>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    name="startDate"    
                    value={form.firstName}
                      onChange={handleChange}
                  />
                </FormGroup>
                     </Col>
                 </Row>
              <Row>
              <Col md={4}>
                <FormGroup>
                  <Label>First Name</Label>
                  <Input
                    type="text"
                    name="firstName"    
                    value={form.firstName}
                      onChange={handleChange}
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
                    value={form.LastName}
                      onChange={handleChange}
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label> Other Name </Label>
                  <Input
                    type="text"
                    name="otherName"          
                    value={form.otherName}
                      onChange={handleChange}       
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>Gender</Label>
                  <Input
                    type="text"
                    name="gender"           
                    value={form.gender}
                      onChange={handleChange}
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>DOB</Label>
                  <Input
                    type="date"
                    name="DOB"           
                    value={form.DOB}
                      onChange={handleChange}
                  />
                </FormGroup>
              </Col>

              <Col md={4}>
                <FormGroup>
                  <Label>Phone No</Label>
                  <Input
                    type="number"
                    name="phoneNo"  
                    value={form.phoneNo}
                      onChange={handleChange}      
                  />
                </FormGroup>
              </Col>


              <Col md={4}>
                <FormGroup>
                  <Label> Email </Label>
                  <Input
                    type="email"
                    name="email"    
                    value={form.email}
                      onChange={handleChange}             
                  />
                </FormGroup>
              </Col>

              <Col md={4}>
                <FormGroup>
                  <Label>Address</Label>
                  <Input
                    type="address"
                    name="address"     
                    value={form.address}
                      onChange={handleChange}     
                  />
                </FormGroup>
              </Col>

              <Col md={4}>
                <FormGroup>
                  <Label>Institution Name </Label>
                  <Input
                    type="text"
                    name="school"  
                    value={form.school}
                      onChange={handleChange}               
                  />
                </FormGroup>
              </Col>
            </Row>
        
            <table class="table table-bordered">
    <thead>
      <tr>
            <th>Full Name</th>
          <th>Start Date</th>
          <th>End Date</th>
        <th>Institution Name</th>
      </tr>
    </thead>
    <tbody>
    <tr>
            <td>Hamad Aliyu Ibrahim </td>
          <td>02/03/2017</td>
          <td>03/03/2018</td>
        <td>Bayero University Kano</td>
      </tr>
    </tbody>
  </table>
              </CardBody>
            </Card>
          </div>
        </>
      );
    
  }