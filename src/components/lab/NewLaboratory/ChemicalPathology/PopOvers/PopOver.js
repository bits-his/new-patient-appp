import React from 'react';
import {
  Label,
  FormGroup,
} from 'reactstrap';
// import UECUnit from '../ChemicalPathogyUnitItems/UECUnit';
// import UCEPopOver from './UCEPopOver';

const PopOver = (props) => {
  // const [popoverOpen, setPopoverOpen] = useState(false);

  // const toggle = () => setPopoverOpen(!popoverOpen);

  return (
    <>
      <FormGroup check>
        <input
          type="checkbox"
          name="uecCheck"
          onChange={props.handleCheck}
          checked={props.uecCheck}
          id="Popover10"
        />{' '}
        <Label>UEC</Label>
      </FormGroup>

      {/* <Button id="Popover1" type="button">
        Launch Popover
      </Button> */}


    </>
  );
};

export default PopOver;
