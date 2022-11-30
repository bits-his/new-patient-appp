import React from 'react'
import { Button, Form, FormGroup, Label, Input, Card, Row, Col, CardBody, CardHeader } from 'reactstrap';

export default function CreateReport () {
    return (
        <>
        <Card>
            <CardHeader tag="h6">Create Report</CardHeader>
            <CardBody>
            <Form>
      <Row form>
        <Col md={6}>
          <FormGroup>
            <Label >Department</Label>
            <Input type="text" name="department" />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label >Report Name</Label>
            <Input type="name" name="report" />
          </FormGroup>
        </Col>
      </Row>
      <FormGroup>
        <Label >Header</Label>
        <Input type="text" name="header" />
      </FormGroup>
        
          <FormGroup>
            <Label for="exampleCity">Body</Label>
            <Input type="textarea" name="body" />
          </FormGroup>
    
      <center> <Button outline color="primary" className="pl-5 pr-5">Save</Button></center>
      <FormGroup>
            <Label for="exampleCity">Conclusion</Label>
            <Input type="textarea" name="body" />
          </FormGroup>
          <center> <Button outline color="primary" className="pl-5 pr-5">Submit</Button></center>
    </Form>
    </CardBody>
    </Card>
        </>
    )
}