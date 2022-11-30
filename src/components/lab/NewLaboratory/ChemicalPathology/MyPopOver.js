import React from 'react';
import {
  Popover,
  PopoverHeader,
  PopoverBody,
} from 'reactstrap';

const MyPopOver = (props) => {
  // const [popoverOpen, setPopoverOpen] = useState(false);

  // const toggle = () => setPopoverOpen(!popoverOpen);

  return (
    <>
      {/* <FormGroup check>
        <input
          type="checkbox"
          name="uecCheck"
          onChange={props.handleCheck}
          checked={props.uecCheck}
          id="Popover1"
        />{' '}
        <Label>UEC</Label>
      </FormGroup> */}

      {/* <Button id="Popover1" type="button">
        Launch Popover
      </Button> */}

      <Popover
        placement="right"
        isOpen={props.isOpen}
        target={props.target}
        toggle={props.toggle}
      >
        <PopoverHeader>UEC unit</PopoverHeader>
        <PopoverBody>
          <h1>Hwelllo</h1>
          <br />
        </PopoverBody>
      </Popover>
    </>
  );
};

export default MyPopOver;
