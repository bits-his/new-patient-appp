import React from "react";
import { Row, Col, FormGroup, Label } from "reactstrap";

export const GRNReview = ({
  poNo,
  date,
  vendor,
  client,
  grn,
  supplierItems,
  status,
  unfinishe_grn,
}) => {
  return (
    <>
      <Row>
        <Col md={6}>
          <FormGroup>
            {status === "unfinished purchase" ? (
              <Label>GRN No: {unfinishe_grn}</Label>
            ) : (
              <Label>GRN No: {grn}</Label>
            )}
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label>PO No: {poNo}</Label>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label>Date: {date}</Label>
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label> Vendor: {vendor}</Label>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label>Client: {client}</Label>
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label>
              Total Amount(₦):{" "}
              {supplierItems.reduce(
                (a, b) => parseInt(a) + parseInt(b.amount),
                0
              )}
            </Label>
          </FormGroup>
        </Col>
      </Row>
    </>
  );
};

export default GRNReview;
