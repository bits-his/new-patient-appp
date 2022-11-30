import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  Label,
  Row,
  Table,
} from "reactstrap";

function ReturnDrug() {
  return (
    <div>
      <Card>
        <CardHeader>Return OutWard</CardHeader>
        <CardBody>
          <Row>
            <Col md={6}>
              <Label>Receipt Number</Label>
              <Input type="text" />
            </Col>
            <Col md={6}>
              <Label>Mode Of Payment</Label>
              <Input type="select">
                <option>--select--</option>
                <option>CASH</option>
                <option>POS</option>
                <option>BANK</option>
              </Input>
            </Col>
          </Row>

          <Table bordered className="mt-5">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Item Name</th>
                <th>Price</th>
                <th>Qty Sold</th>
                <th>Quantity Return</th>
              </tr>
            </thead>
          </Table>
          <h4 style={{ float: "right" }}>₦5</h4>
          <center>
            <Button color="primary">Submit</Button>
          </center>
        </CardBody>
      </Card>
    </div>
  );
}

export default ReturnDrug;
