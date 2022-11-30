import React from 'react';
import { FormGroup, Input, Row, Col } from 'reactstrap';
import { Label } from 'evergreen-ui/commonjs/typography';

export default function RadiologyUnit({ data, handleRadiology, radiology }) {
  return (
    <Row className="m-2">
      {data.test.map((item, i) => (
        <Col md={4} key={i}>
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                name="hb"
                checked={radiology.includes(item)}
                onChange={() => handleRadiology(item)}
                value={item}
              />
              {item}
            </Label>
          </FormGroup>
        </Col>
      ))}
    </Row>
  );
}
