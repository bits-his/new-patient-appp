import React from 'react';
import { useBarcode } from 'react-barcodes';
// import { useState } from 'react';
import { Card, CardHeader, CardBody, 
    // FormGroup, Label 
} from 'reactstrap';
// import Input from '../auth/registration/component/Input';
 
function GenerteBarCodeImg() {
    // const [text, setText] = useState('')

  const { inputRef } = useBarcode({
    value: 'BarCode Image',
    
  });
  
  return (
    <Card>
        <CardHeader tag="h5">BarCode Image</CardHeader>
        <CardBody>
        {/* <FormGroup>
        <Label>Generate</Label>
        <Input type="text" name="text" value={text} onChange={(e) => setText(e.target.value)}/>
      </FormGroup> */}
      
        <img ref={inputRef} alt="default"/>;
        </CardBody>
    </Card>
)};
 
export default GenerteBarCodeImg;