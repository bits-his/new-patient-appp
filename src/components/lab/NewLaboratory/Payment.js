import React, { Component } from 'react';
import {
  Form,
  Row,
  Col,
  FormGroup,
  Label,
  // CustomInput,
  Input,
  Card,
  CardBody,
} from 'reactstrap';

export default class Payment extends Component {
  render() {
    return (
      <>
        <Card>
          <CardBody>
            <Form>
              <Row>
                <Col md={3}>
                  <Label>Payment Method:</Label>
                </Col>
                <Col md={2}>
                  <FormGroup>
                    <Label>
                      <Input
                        type="radio"
                        value="partialPayment"
                        name="paymentOption"
                        checked={this.props.paymentOption === 'partialPayment'}
                        onChange={this.props.handleChange}
                      />
                      Partial Payment
                    </Label>
                  </FormGroup>
                </Col>

                <Col md={2} style={{ marginRight: '70px' }}>
                  <span>
                    {this.props.paymentOption === 'partialPayment' ? (
                      <Input type="text" placeholder="amount" />
                    ) : null}
                  </span>
                </Col>

                <Col md={2}>
                  <FormGroup>
                    <Label>
                      <Input
                        type="radio"
                        value="fullPayment"
                        name="paymentOption"
                        checked={this.props.paymentOption === 'fullPayment'}
                        onChange={this.props.handleChange}
                      />
                      Full Payment
                    </Label>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md={3}>
                  <Label>Discount:</Label>
                </Col>
                <Col md={3}>
                  <FormGroup>
                    <Label>
                      <Input
                        type="radio"
                        value="yes"
                        name="discountOption"
                        checked={this.props.discountOption === 'yes'}
                        onChange={this.props.handleChange}
                      />
                      Yes
                    </Label>
                  </FormGroup>
                </Col>

                <Col md={3}>
                  <FormGroup>
                    <Label>
                      <Input
                        type="radio"
                        value="no"
                        name="discountOption"
                        checked={this.props.discountOption === 'no'}
                        onChange={this.props.handleChange}
                      />
                      No
                    </Label>
                  </FormGroup>
                </Col>
              </Row>
              {this.props.discountOption === 'yes' ? (
                <Row>
                  <Col md={3} />
                  <Col md={3}>
                    <FormGroup>
                      <Label>
                        <Input
                          type="radio"
                          value="fixed"
                          name="yesDiscount"
                          checked={this.props.yesDiscount === 'fixed'}
                          onChange={this.props.handleChange}
                        />
                        Fixed
                        {this.props.yesDiscount === 'fixed' ? (
                          <Input type="text" placeholder="Fixed Amount" />
                        ) : null}
                      </Label>
                    </FormGroup>
                  </Col>

                  <Col md={3}>
                    <FormGroup>
                      <Label>
                        <Input
                          type="radio"
                          value="percent"
                          name="yesDiscount"
                          checked={this.props.yesDiscount === 'percent'}
                          onChange={this.props.handleChange}
                        />
                        Percent
                      </Label>
                      {this.props.yesDiscount === 'percent' ? (
                        <Input type="text" placeholder="% percent" />
                      ) : null}
                    </FormGroup>
                  </Col>
                </Row>
              ) : null}

              {/* <input
              type="radio"
              value="Male"
              checked={this.state.selectedOption === "Male"}
              onChange={this.onValueChange}
            /> */}
            </Form>
          </CardBody>
        </Card>
      </>
    );
  }
}
