import React, { useState } from 'react';

import {
  FormGroup,
} from 'reactstrap';
import CheckBoxItem from '../../../../theater/operation-notes/CheckBoxItem';

export default function LipidProfileUnit (handleChangeLipid, lipidProfile) {
  const [check, setCheck] = useState(false)
  const handleCheckboxChange = () => {
      setCheck(!check);
  }

  const lipidData = ["TCHOL", "HDL","HRIG", "IDL"]
    return (
      <>
            {lipidData.map(item => (<FormGroup check>
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

