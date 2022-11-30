import React from 'react';
import { Col, Row, FormGroup, Input } from 'reactstrap';

const Discount = ({
  handleRadio,
  discount,
  handlePercentage,
  discountValue,
}) => {
  return (
    <>
      <Row>
        <Col md={4}>
          <div>
            <label className="mr-1">Discount:</label>
            <label className="mr-1" htmlFor="percentage">
              <input
                name="discount"
                id="percentage"
                type="radio"
                // checked={discount === 'Percentage'}
                onChange={handleRadio}
                value="Percentage"
              />{' '}
              Percentage
            </label>
            <label className="mr-1" htmlFor="fixed">
              <input
                name="discount"
                id="fixed"
                type="radio"
                value="Fixed"
                // checked={discount === 'Fixed'}
                onClick={handleRadio}
              />{' '}
              Fixed
            </label>
          </div>
        </Col>

        {discount === 'Percentage' ? (
          <Col md={6}>
            <FormGroup>
              <Input
                placeholder="Enter Percentage"
                type="number"
                checked={discount === 'Percentage'}
                onChange={(e) => {
                  let { value } = e.target;
                  handlePercentage(value);
                  discountValue(value);
                }}
              />
            </FormGroup>
          </Col>
        ) : discount === 'Fixed' ? (
          <Col md={6}>
            <FormGroup>
              {/* <FormGroup /> */}
              <Input
                checked={discount === 'Fixed'}
                type="number"
                placeholder="Enter Amount"
                onChange={(e) => {
                  let { value } = e.target;
                  handlePercentage(value);
                  discountValue(value);
                }}
              />
            </FormGroup>
          </Col>
        ) : null}
      </Row>
    </>
  );
};
export default Discount;
