import React, { useState } from 'react';

import {
  Col,
  Row,
  FormGroup,
} from 'reactstrap';
import CheckBoxItem from '../../../../theater/operation-notes/CheckBoxItem';

export default function UECUnit () {
  // const [checkedItems, setCheckedItems] = useState([]); //plain object as state
    const [check, setCheck] = useState(false)
    const handleCheckboxChange = () => {
        setCheck(!check);
    }

  const  uceData = ['Urea', 'Na', 'K', 'HCO3', 'Creatinine']
    return (
      <>
      {/* {JSON.stringify(checkedItems)} */}
            <Row>
        {uceData.map((item, index) => (
              <Col md={6}>
                <FormGroup check>
               <CheckBoxItem
                  label={item}
                  name={item}
                  value={item}
                  handleCheck={handleCheckboxChange}
                />
            </FormGroup>
              </Col>
            
    ))}
            </Row>
            
      </>
    );
  }

