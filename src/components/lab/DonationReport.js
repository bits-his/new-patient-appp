import React from 'react'
import {Col, Row, InputGroupAddon,InputGroup, FormGroup, Label, Input, Card, CardBody, Table,InputGroupText, Button} from 'reactstrap'
import { FaPrint } from 'react-icons/fa'
export default function DonationReport (){
    return (
        <>
        <Card>
            <CardBody>

            
     <Row>
       <Col md={3} className="mb-3">
         <Button color="danger" className="pl-3 pr-3"> <FaPrint size="20" /> Print </Button>
       </Col>
        <Col md={5}   className="offset-3">
        <InputGroup>
        <InputGroupAddon addonType="prepend">
          <InputGroupText>Search</InputGroupText>
        </InputGroupAddon>
        <Input type="text" name="search"/>
      </InputGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="fromDate">From Date</Label>
            <Input type="date" name="FromDate"  />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="toDate">To Date</Label>
            <Input type="date" name="toDate" />
          </FormGroup>
        </Col>
    </Row>
    <Table hover striped>
      <thead>
        <tr>
          <th>Date</th>
          <th>Patient</th>
          <th>Phone</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>2020/03/23</td>
          <td>Pam John</td>
          <td>987656789</td>
          <td>20032</td>
        </tr>
        <tr>
          <td>2020/12/12</td>
          <td>Issa Mustapha</td>
          <td>34567890</td>
          <td>904594</td>
        </tr>
        <tr>
          <td>2020/06/56</td>
          <td>Ibrahim Isa</td>
          <td>4567890-</td>
          <td>2345</td>
        </tr>
      </tbody>
    </Table>
    </CardBody>
        </Card>
        </>
    )
}