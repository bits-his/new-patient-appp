import React, { useState } from 'react';
import { Popover, PopoverHeader, PopoverBody, Label, FormGroup } from 'reactstrap';
import PTTKUnit from '../HeamatologyUnit/PTTKUnit';

const PTTKPopOver = (props) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const toggle = () => setPopoverOpen(!popoverOpen);

  return (
    <>
      <FormGroup check>
          <input
            type="checkbox"
            name="pttk"
            onChange={props.handleCheck}
            checked={props.pttk}
            id = "popover5"
          />{' '}
          <Label>PTTK/APTT</Label>
        </FormGroup>

      {/* <Button id={props.id} type="button">
        Launch Popover
      </Button> */}

      <Popover placement="right" isOpen={popoverOpen} target="popover5" toggle={toggle}>
        <PopoverHeader>PTTK/APTT</PopoverHeader>
        <PopoverBody>
          <PTTKUnit {...props} />
        </PopoverBody>
      </Popover>
    </>
  );
}

export default PTTKPopOver;