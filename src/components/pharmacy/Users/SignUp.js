import React, { useState } from 'react'
import { useHistory } from "react-router";
import { Checkbox, CustomButton } from "../../../components/UI";
import Logo from "../../../assets/images/logo.png";
import { Form, FormGroup, Input, Label, Row, Col } from "reactstrap";
import "./Login.css";
import { useDispatch } from "react-redux";
import moment from 'moment'
import { _postApi } from '../../../redux/action/api';

function SignUp() {
  const navigate = useHistory();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    firstName:'',
    lastName:'',
    pharmName:'',
    pharmAddress:'',
    pharmPrefix:'',
    email: "",
    phone:'',
    username:'',
    password: "",
    date: moment().format('YYYY-MM-DD')
  });
  // const { addToast } = useToasts();
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();

    let obj = {
      ...form,
      "busName": form.pharmName,
      "businessType": "Pharmacy",
      "address": form.pharmAddress,
      "status": "",
      "role": "Pharmacy Owner",
      "date": form.date,
      "store": form.pharmName,
      "accessTo": "Dashboard,Returned Drugs,My Sales,Manage Store,Manage Suppliers,Manage Users,Drug Purchase,Client Registration,Drug Sales",
      "functionality": "",
      "firstname": form.firstName,
      "lastname": form.lastName,
      "branch_name": form.pharmName,
      "query_type": "new_admin",
      "business_includes_logistics": false
    }

    _postApi(
      '/users/create',
      obj,
      (d) => {
        console.log(d)
        if(d.success) {
          alert('User created')
          navigate.push('/login')
        } else {
          alert(d.msg)
        }
      },
      () => {
        alert('An error occurred')
      }
    )

    
  };
  return (
    <div className="m-0 row" style={{ fontFamily: "sans-serif" }}>
      <div className="bubbles">
        <div className="bubble" />
        <div className="bubble1" />
        <div className="bubble2" />
        <div className="bubble3" />
      </div>
      <div className="col-md-2 m-0 p-0">
    
      </div>
      <div className="d-flex flex-column justify-content-x  border-0 col-md-8  ">
        <div
          style={{
            height: "40vh",
          }}
          className="ml-2"
        >
          <div className="text-center">
            <img
              src={Logo}
              alt="logo"
              className="text-center"
              style={{ width: "30vh", height: "6vh", marginTop: "13vh" }}
            />
          </div>
          <div
            className="card mt-4 shadow-sm  p-4 bg-transparent rounded "
            style={{ backgroundColor: "red" }}
          >
            <span
              className="text-center"
              style={{ fontWeight: "bold", fontSize: "20px", marginBottom: 20 }}
            >
              Pharmacy Registration
            </span>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <h5>Pharmacy Information</h5>
                  <FormGroup>
                    <Input
                      className="p-2 py-2 shadow-sm form-control border-primary"
                      style={{
                        fontSize: "15px",
                        borderWidth: "2px",
                      }}
                      type="text"
                      name="pharmName"
                      placeholder='Pharmacy Name'
                      value={form.pharmName}
                      onChange={({ target: { name, value } }) => {
                        setForm((p) => ({ ...p, [name]: value }));
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <div
                      style={{ display: "flex", justifyContent: "space-between" }}
                    >
                    </div>
                    <Input
                      className="p-2 py-2 shadow-sm form-control border-primary"
                      style={{
                        fontSize: "15px",
                        borderWidth: "2px",
                      }}
                      type="text"
                      name="pharmPrefix"
                      placeholder='Prefix (Pharmacy File Format)'
                      value={form.pharmPrefix}
                      onChange={({ target: { name, value } }) => {
                        setForm((p) => ({ ...p, [name]: value }));
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <div
                      style={{ display: "flex", justifyContent: "space-between" }}
                    >
                    </div>
                    <Input
                      className="p-2 py-2 shadow-sm form-control border-primary"
                      style={{
                        fontSize: "15px",
                        borderWidth: "2px",
                      }}
                      type="text"
                      name="pharmAddress"
                      placeholder='Pharmacy Address'
                      value={form.pharmAddress}
                      onChange={({ target: { name, value } }) => {
                        setForm((p) => ({ ...p, [name]: value }));
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <h5>User Information</h5>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Input
                          className="p-2 py-2 shadow-sm form-control border-primary"
                          style={{
                            fontSize: "15px",
                            borderWidth: "2px",
                          }}
                          type="text"
                          name="firstName"
                          placeholder='First Name'
                          value={form.firstName}
                          onChange={({ target: { name, value } }) => {
                            setForm((p) => ({ ...p, [name]: value }));
                          }}
                        />
                      </FormGroup>
                      <FormGroup>
                        <div
                          style={{ display: "flex", justifyContent: "space-between" }}
                        >

                        </div>
                        <Input
                          className="p-2 py-2 shadow-sm form-control border-primary"
                          style={{
                            fontSize: "15px",
                            borderWidth: "2px",
                          }}
                          type="email"
                          name="email"
                          placeholder='Email'
                          value={form.email}
                          onChange={({ target: { name, value } }) => {
                            setForm((p) => ({ ...p, [name]: value }));
                          }}
                        />
                      </FormGroup>
                      <FormGroup>
                        <div
                          style={{ display: "flex", justifyContent: "space-between" }}
                        >
                        </div>
                        <Input
                          className="p-2 py-2 shadow-sm form-control border-primary"
                          style={{
                            fontSize: "15px",
                            borderWidth: "2px",
                          }}
                          type="text"
                          name="username"
                          placeholder='username'
                          value={form.username}
                          onChange={({ target: { name, value } }) => {
                            setForm((p) => ({ ...p, [name]: value }));
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Input
                          className="p-2 py-2 shadow-sm form-control border-primary"
                          style={{
                            fontSize: "15px",
                            borderWidth: "2px",
                          }}
                          type="text"
                          name="lastName"
                          placeholder='Last Name'
                          value={form.lastName}
                          onChange={({ target: { name, value } }) => {
                            setForm((p) => ({ ...p, [name]: value }));
                          }}
                        />
                      </FormGroup>
                      <FormGroup>
                        <div
                          style={{ display: "flex", justifyContent: "space-between" }}
                        >
                        </div>
                        <Input
                          className="p-2 py-2 shadow-sm form-control border-primary"
                          style={{
                            fontSize: "15px",
                            borderWidth: "2px",
                          }}
                          type="text"
                          name="phone"
                          placeholder='Phone Number'
                          value={form.phone}
                          onChange={({ target: { name, value } }) => {
                            setForm((p) => ({ ...p, [name]: value }));
                          }}
                        />
                      </FormGroup>
                      <FormGroup>
                        <div
                          style={{ display: "flex", justifyContent: "space-between" }}
                        >
                        </div>
                        <Input
                          className="p-2 py-2 shadow-sm form-control border-primary"
                          style={{
                            fontSize: "15px",
                            borderWidth: "2px",
                          }}
                          type="password"
                          name="password"
                          value={form.password}
                          onChange={({ target: { name, value } }) => {
                            setForm((p) => ({ ...p, [name]: value }));
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                </Col>

              </Row>
              <Row>

              </Row>
              <Row style={{ margin: "2px" }} className="mt-1 mb-2">
                <CustomButton
                  loading={loading}
                  className="shadow-sm"
                  type="submit"
                  onClick={handleSubmit}
                >
                  <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Sign Up
                  </span>
                </CustomButton>
              </Row>
              <Row>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Checkbox
                    label={
                      <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                        Remember me
                      </span>
                    }
                  />
                  <Label
                    style={{ fontWeight: "bold", fontSize: "16px" }}
                    className="text-primary"
                  >
                    Need Help?
                  </Label>
                </div>
              </Row>
            </Form>
          </div>

          <div className="card shadow-sm p-3  bg-white rounded mt-2">
            <div
              className="text-center"
              style={{ fontWeight: "bold", fontSize: "16px" }}
            >
              Or{" "}
              <Label
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => navigate.push("/login")}
              >
                click here
              </Label>{" "}
              to sign in.
            </div>
          </div>
        </div>
      </div>
      <div className='col-md-2'></div>
    </div>
  )
}

export default SignUp