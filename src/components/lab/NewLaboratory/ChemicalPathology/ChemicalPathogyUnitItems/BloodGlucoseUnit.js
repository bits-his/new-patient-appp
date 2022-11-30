import React, { useState } from 'react';

import {
  FormGroup,
} from 'reactstrap';
import CheckBoxItem from '../../../../theater/operation-notes/CheckBoxItem';
export default function BloodGlucoseUnit (handleChangeLipid, bloodGlucose) {
  const bloodGlucoseData = ['Fasting', 'Random']

  const [check, setCheck] = useState(false)
  const handleCheckboxChange = () => {
      setCheck(!check);
  }

    return (
      <>
        {bloodGlucoseData.map(item => (<FormGroup check>
               <CheckBoxItem
                  label={item}
                  name={item}
                  value={item}
                  handleCheck={handleCheckboxChange}
                />
        </FormGroup>
        ))}
      </>
    );
  
}
