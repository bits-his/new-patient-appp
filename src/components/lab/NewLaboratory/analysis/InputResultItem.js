import React from "react";
import { FormGroup, Input, Card } from "reactstrap";

const InputResultItem = ({
  isEditting = true,
  item = {},
  handleResultChange = (f) => f,
}) => {
  if (isEditting) {
    return (
      <FormGroup>
        <div>
          <span className="d-block font-weight-bold">
            Investigation: {item.description}
          </span>
          <span className="d-block">Specimen: {item.specimen}</span>
        </div>
        {/* <Label className="font-weight-bold">
          
          (Specimen: {item.specimen})
        </Label> */}
        {/* <Label></Label> */}
        <Input
          type="textarea"
          value={item.result}
          name="result"
          onChange={(e) => handleResultChange(item, e.target.value)}
        />
      </FormGroup>
    );
  } else {
    return (
      <Card className="border border-dark my-1 p-2">
        <div>
          <span className="d-block font-weight-bold">
            Investigation: {item.description}
          </span>
          <small className="d-block">Specimen: {item.specimen}</small>
        </div>
        <span className="d-block font-weight-bold mt-1">Result:</span>
        <p>{item.result}</p>
      </Card>
    );
  }
};

export default InputResultItem;
