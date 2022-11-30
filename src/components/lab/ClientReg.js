import React, { useState } from 'react';
import {
  Col,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
  CardHeader,
} from 'reactstrap';
import moment from 'moment';

export default function ClientReg() {
  const [collect, setCollect] = useState('self');
  const [donor, setDonor] = useState({
    date: moment().format('YYYY-MM-DD'),
    donorNo: '',
    donorName: '',
    address: '',
    otherName: '',
    phone: '',
    email: '',
    website: '',
    deposite: '',
    otherAddress: '',
  });
  const [regType, setRegType] = useState('Donor');
  const handleRegType = (e) => {
    setRegType(e.target.value);
  };
  const handleChange = ({ target: { name, value } }) => {
    setDonor((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setDonor({
      date: '',
      donorNo: '',
      donorName: '',
      address: '',
      otherName: '',
      phone: '',
      email: '',
      website: '',
      deposite: '',
      otherAddress: '',
    });
  };
  const handleRadio = (e) => {
    setCollect(e.target.value);
  };
  const handleSubmit = () => {
    const obj = {
      donor: donor,
      collect: collect,
    };
    console.log(obj);
    handleReset();
  };
  return (
    <>
      <Card>
        <CardHeader className="d-flex justify-content-between">
          <div>Donor Form</div>
          <Row className="bg-light m-0 p-0">
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="Donor"
                  checked={regType === 'Donor'}
                  value="Donor"
                  onChange={handleRegType}
                />
                Donor
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="Organization"
                  checked={regType === 'Organization'}
                  value="Organization"
                  onChange={handleRegType}
                />
                Organization
              </Label>
            </FormGroup>

            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="Credit"
                  checked={regType === 'Credit'}
                  value="Credit"
                  onChange={handleRegType}
                />
                Credit Organization
              </Label>
            </FormGroup>
          </Row>
        </CardHeader>
        <CardBody>
          <Form row>
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label for="date">Date</Label>
                  <Input
                    type="date"
                    name="date"
                    value={donor.date}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="donor">Donor No:</Label>
                  <Input
                    type="text"
                    name="donorNo"
                    value={donor.donorNo}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            {/* {JSON.stringify(donor.otherName)} */}
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="name"
                name="donorName"
                value={donor.donorName}
                onChange={handleChange}
                placeholder="Full name"
              />
            </FormGroup>
            <FormGroup>
              <Label for="exampleAddress2">Address </Label>
              <Input
                type="address"
                name="address"
                value={donor.address}
                onChange={handleChange}
                placeholder="Apartment, studio, or floor"
              />
            </FormGroup>
            <Row className="bg-light m-0 p-1">
              <Col md={5}>
                <h4>
                  {' '}
                  <kbd>Who to Contact: </kbd>{' '}
                </h4>
              </Col>
              <Col md={2}>
                <FormGroup check>
                  <Label check>
                    <Input
                      type="radio"
                      checked={collect === 'self'}
                      name="self"
                      value="self"
                      onChange={handleRadio}
                    />
                    Self
                  </Label>
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup check>
                  <Label check>
                    <Input
                      type="radio"
                      checked={collect === 'other'}
                      name="other"
                      value="other"
                      onChange={handleRadio}
                    />
                    Other
                  </Label>
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label for="phone">Phone Number</Label>
                  <Input
                    type="tel"
                    name="phone"
                    value={donor.phone}
                    onChange={handleChange}
                    placeholder="Telephone Number"
                  />
                </FormGroup>
              </Col>
              {collect === 'self' ? (
                ''
              ) : (
                <>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="name">Name</Label>
                      <Input
                        type="name"
                        name="otherName"
                        value={donor.otherName}
                        onChange={handleChange}
                        placeholder="Other Name"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="name">Address To</Label>
                      <Input
                        type="otherAddress"
                        name="otherAddress"
                        value={donor.otherAddress}
                        onChange={handleChange}
                        placeholder="Other Address"
                      />
                    </FormGroup>
                  </Col>
                </>
              )}

              <Col md={6}>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={donor.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com"
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="website">Website (Optional)</Label>
                  <Input
                    type="text"
                    name="website"
                    value={donor.website}
                    onChange={handleChange}
                    placeholder="Other Name"
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="name">Deposite</Label>
                  <Input
                    type="number"
                    name="deposite"
                    value={donor.deposite}
                    onChange={handleChange}
                    placeholder="Amount deposit"
                  />
                </FormGroup>
              </Col>
            </Row>
          </Form>
          <center>
            <Button outline color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </center>
        </CardBody>
      </Card>
    </>
  );
}
