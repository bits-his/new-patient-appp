import React from 'react'
import {Col, Row, FormGroup,CardHeader, Label, Input, Card, 
    CardBody, Table, Button, InputGroup, InputGroupText, InputGroupAddon} from 'reactstrap'
import { FaPrint } from 'react-icons/fa'

export default function OrganizationReport () {
    return (
        <>
       <Card>
           <CardHeader> Donor/Creditor/Organization</CardHeader>
            <CardBody>
    <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="fromDate">Begin Date</Label>
            <Input type="date" name="FromDate"  />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="toDate">End Date</Label>
            <Input type="date" name="toDate" />
          </FormGroup>
        </Col>
        <Col md={12} className="mb-3">
        <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>Search Organization</InputGroupText>
        </InputGroupAddon>
        <Input type="text" name="search"/>
      </InputGroup>
        </Col>
    </Row>
    <Table hover striped>
      <thead>
        <tr>
            <th>S/N</th>
          <th>Date</th>
          <th>Patient</th>
          <th>Test</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>2020/03/23</td>
          <td>Pam John</td>
          <td>987656789</td>
          <td>20032</td>
        </tr>
        <tr>
          <td>2</td>
          <td>2020/12/12</td>
          <td>Issa Mustapha</td>
          <td>34567890</td>
          <td>904594</td>
        </tr>
        <tr>
          <td>3</td>
          <td>2020/06/56</td>
          <td>Ibrahim Isa</td>
          <td>456789045</td>
          <td>2345</td>
        </tr>
      </tbody>
    </Table>
    <center> 
      <Button outline color="success" className="pl-4 pr-4 mr-3 mt-3"> Download </Button>
      <Button outline color="danger" className="pl-4 pr-4 mr-3 mt-3"> <FaPrint size="20" /> Print </Button>
    </center>
    </CardBody>
        </Card>
        </>
    )
}