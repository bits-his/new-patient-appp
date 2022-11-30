import React, { useState } from 'react';
import {
  Button,
} from 'reactstrap';
import MyPopOver from './MyPopOver';

const DisplayMyp = (props) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  // const [id, setId] = useState('Popover10');

  const toggle = () => setPopoverOpen(!popoverOpen);

  return (
    <>
      <Button id={props.target} type="button">
        Launch Popover
      </Button>

      <MyPopOver target={props.target} toggle={toggle} isOpen={popoverOpen} />
    </>
  );
};

export default DisplayMyp;
