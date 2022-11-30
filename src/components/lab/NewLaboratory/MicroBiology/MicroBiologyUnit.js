import React from 'react';

import {
  Col,
  Row,
  FormGroup,
  Input,
} from 'reactstrap';
import { Label } from 'evergreen-ui/commonjs/typography';
export default function MicroBiologyUnit({
  data,
  microBiology,
  handleMicrobiology,
}) {
  return (
    <Row className="m-1">
      {/* {JSON.stringify(data.test)} */}
      {data.test.map((item, i) => (
        <Col md={6} key={i}>
          <FormGroup check>
            <Label check>
              <Input
                checked={microBiology.includes(item)}
                onChange={() => handleMicrobiology(item)}
                type="checkbox"
                name="analysis"
                // onChange={this.props.handleCheck}
                // checked={this.props.analysis}
              />{' '}
              {item}
            </Label>
          </FormGroup>
        </Col>
      ))}

      {/* <Col md={6}>
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              type="checkbox"
              name="microscopyGeneral"
              // onChange={this.props.handleCheck}
              // checked={this.props.microscopyGeneral}
            />{' '}
            MicroScopy (General)
          </Label>
        </FormGroup>
        </Col>
        <Col md={6}>
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              name="microscopySpecial"
              // onChange={this.props.handleCheck}
              // checked={this.props.microscopySpecial}
            />{' '}
            MicroScopy (Special)
          </Label>
        </FormGroup>
        </Col>
        <Col md={6}>
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              name="cultureSensitivity"
              // onChange={this.props.handleCheck}
              // checked={this.props.cultureSensitivity}
            />{' '}
            Culture & Sensitivity
          </Label>
        </FormGroup>
        </Col>
        <Col md={4}>
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              name="serology"
              // onChange={this.props.handleCheck}
              // checked={this.props.serology}
            />{' '}
            Serology
          </Label>
        </FormGroup>
        </Col> */}
    </Row>
  );
}
