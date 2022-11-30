import React from 'react';
import { FormGroup, Input, Row, Col } from 'reactstrap';
import { Label } from 'evergreen-ui/commonjs/typography';

export default function HeamatologyUnit({
  data,
  handleHematology,
  hematology,
}) {
  return (
    <Row className="m-2">
      {/* {JSON.stringify(data.test)} */}
      {data.test &&
        data.test.map((item, i) => (
          <Col md={4} key={i}>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  name="hb"
                  checked={hematology.includes(item)}
                  onChange={() => handleHematology(item)}
                  value={item}
                />{' '}
                {item}
              </Label>
            </FormGroup>
          </Col>
        ))}
    </Row>
  );
}
