import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Row,
  Col,
  Table,
  Button,
} from "reactstrap"
import CustomCard from "../../comp/components/CustomCard";
import CustomHelper from "../../comp/components/CustomHelper";
import SearchBar from "../../record/SearchBar";

function Drug() {
  return (
    <>
      {" "}
      <CustomCard header={<CustomHelper />}>
       
      </CustomCard>
      <Card>
        <CardHeader></CardHeader>
        <CardBody>
          {/* <p style={{float:"right"}} className="mb-5">15th Nov,2021</p><br />  */}
          <Row>
            <Col md={4}>
              <p>
                {" "}
                <Input type="radio"></Input>Walk-in patient
              </p>
              <p>
                {" "}
                <Input type="radio"></Input>Registered patient
              </p>
            </Col>
            <Col md={3}> </Col>
            <Col md={5}>
              <label>Mode Of Payment</label>
              <Input type="select">
                <option className="text-center">----select-----</option>
              </Input>{" "}
            </Col>
            <Col md={6}>
              <label className="font-weight-bold">Select Patient</label>
              <Input type="text" />
            </Col>
            <Col md={3}>
              <h5>Account No:</h5>
            </Col>
            <Col md={3}>
              <label>Balace</label>
              <Input type="readOnly" value="0" readOnly />
            </Col>
            <Col md={6}>
              <SearchBar />
            </Col>
            <Col md={3}>
              <label>Quantity</label>
              <Input type="text" />
            </Col>
            <Col md={3}>
              <label>price</label>
              <Input type="text" readOnly />
            </Col>
          </Row>
          <Table striped>
            <thead
              style={{
                borderLeft: "3px blue solid",
                borderRight: "3px  blue solid",
              }}
            >
              <th className="text-center">Name:</th>
              <th className="text-center">Quantity Available</th>
              <th className="text-center">Expiry</th>
            </thead>
          </Table>
          <center>
            {" "}
            <Button className="align-item-center">
              {/* <ShoppingCart /> */}
              Add to cart
            </Button>
          </center>
        </CardBody>
        <CardHeader></CardHeader>
      </Card>
    </>
  );
}

export default Drug;
