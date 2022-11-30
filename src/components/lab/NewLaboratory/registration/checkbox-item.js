import React from 'react'
import Checkbox from "../../../comp/components/Checkbox";

const CheckItem = ({
    containerClass = "",
    checked = false,
    onChange = (f) => f,
    label,
    disabled=false
  }) => {
    return (
      <Checkbox
        container={containerClass}
        checked={checked}
        onChange={onChange}
        label={label}
        disabled={disabled}
      />
      // <Label className={containerClass}>
      //   <Input
      //     type="checkbox"
      //     checked={checked}
      //     // onChange={() =>
      //     //   handleTestAdd(
      //     //     test,
      //     //     labType,
      //     //     expandView.header
      //     //   )
      //     // }
      //     onChange={onChange}
      //   />
      //   {label}
      // </Label>
    );
  };

  export default CheckItem