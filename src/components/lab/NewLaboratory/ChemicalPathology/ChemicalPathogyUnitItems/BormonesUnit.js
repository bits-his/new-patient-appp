import React, { useState } from 'react';

import {
  Col,
  Row,
  FormGroup,
} from 'reactstrap';
import CheckBoxItem from '../../../../theater/operation-notes/CheckBoxItem';

export default function  BormonesUnit () {
    // const [bormones, setBormones] = useState({
    //   t3: "",
    //   t4: '',
    //   tsh: '',
    //   oestrogen: '',
    //   progesterone: '',
    //   prolactin: '',
    //   fsh: '',
    //   lh: '',
    //   testosterone: ''
    // })
    const [check, setCheck] = useState(false)

    const handleCheckboxChange = () => {
        setCheck(!check);
    }
  
  const bormonesData = ['T3', 'Testosterone', 'LH', 'Progesterone', 'FSH', 'Prolactin','Oestrogen', "TSH", "T4"]
    return (
      <Row>
        {bormonesData.map(item => (
        <Col md={6} className="m-0">
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
    );
  }

