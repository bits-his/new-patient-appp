import React, { useState } from 'react';
import { Popover, PopoverHeader, PopoverBody, Label, FormGroup } from 'reactstrap';
import FullBloodCountUnit from '../HeamatologyUnit/FullBloodCountUnit';

const FullBloodCPopOver = (props) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const toggle = () => setPopoverOpen(!popoverOpen);

  return (
    <>
      <FormGroup check>
          <input
            type="checkbox"
            name="fullBloodCount"
            onChange={props.handleCheck}
            checked={props.fullBloodCount}
            id = "popover7"
          />{' '}
          <Label>Full Blood Count</Label>
        </FormGroup>

      {/* <Button id={props.id} type="button">
        Launch Popover
      </Button> */}

      <Popover placement="right" isOpen={popoverOpen} target="popover7" toggle={toggle}>
        <PopoverHeader>Full Blood Count</PopoverHeader>
        <PopoverBody>
          <FullBloodCountUnit {...props}/>
        </PopoverBody>
      </Popover>
    </>
  );
}

export default FullBloodCPopOver;