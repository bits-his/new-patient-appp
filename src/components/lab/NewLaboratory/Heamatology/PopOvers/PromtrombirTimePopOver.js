import React, { useState } from 'react';
import { Popover, PopoverHeader, PopoverBody, Label, FormGroup } from 'reactstrap';
import PromtrombirTimeUnit from '../HeamatologyUnit/PromtrombirTimeUnit';

const PromtrombirTimePopOver = (props) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const toggle = () => setPopoverOpen(!popoverOpen);

  return (
    <>
      <FormGroup check>
          <input
            type="checkbox"
            name="fullBloodCount"
            onChange={props.handleCheck}
            checked={props.promtrombirTime}
            id = "popover6"
          />{' '}
          <Label>Full Blood Count</Label>
        </FormGroup>

      {/* <Button id={props.id} type="button">
        Launch Popover
      </Button> */}

      <Popover placement="right" isOpen={popoverOpen} target="popover6" toggle={toggle}>
        <PopoverHeader>Full Blood Count</PopoverHeader>
        <PopoverBody>
          <PromtrombirTimeUnit {...props} />
        </PopoverBody>
      </Popover>
    </>
  );
}

export default PromtrombirTimePopOver;