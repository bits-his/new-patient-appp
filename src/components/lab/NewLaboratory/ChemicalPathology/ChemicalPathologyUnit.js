import React, { useState } from 'react';
import { Row, Col, Input, FormGroup } from 'reactstrap';
import { Label } from 'evergreen-ui/commonjs/typography';

const ChemicalPathologyUnit = ({
  data,
  handlePathologyChange,
  pathologyDefaultCheck,
  pathology,
}) => {
  const [sub, setSub] = useState({ display: false, name: '' });

  const handleMainChange = (item) => {
    setSub({ display: true, name: item.name });
    pathologyDefaultCheck(item.name);
  };

  return (
    <Row className="mt-1 ml-1">
      {/* {JSON.stringify(pathology)} */}
      <Col md={4}>
        {data.map((item, i) => (
          <FormGroup key={i}>
            <Label className="m-0 p-0">
              <Input
                type="checkbox"
                checked={sub.name === item.name}
                onChange={() => handleMainChange(item)}
              />
              {item.name}
            </Label>
          </FormGroup>
        ))}
      </Col>
      <Col md={8}>
        <Row>
          {sub.display
            ? data
                .find((item) => item.name === sub.name)
                .test.map((item, j) => (
                  <Col md={4}>
                    <FormGroup key={j}>
                      <Label check>
                        <Input
                          type="checkbox"
                          checked={pathology[sub.name].includes(item)}
                          // checked={ChemicalPathologyType === "uecCheck"}
                          // onChange={() => handleMainChange(item)}
                          onChange={() => handlePathologyChange(sub.name, item)}
                          value="uecCheck"
                        />
                        {item}
                      </Label>
                    </FormGroup>
                  </Col>
                ))
            : null}
        </Row>
      </Col>
    </Row>
  );
};

export default ChemicalPathologyUnit;
