import React, { useState } from 'react';
import Dropzone from 'react-dropzone-uploader';
import { Button } from 'reactstrap';

const LabImages = ({ handleChangeStatus }) => {
  const [visible, setVisible] = useState(false);

  const handleVisible = () => {
    setVisible((d) => !d);
  };
  return (
    <>
      {!visible ? (
        <Button className="mt-3 ml-3" onClick={() => handleVisible()}>
          Upload a file
        </Button>
      ) : (
        <Dropzone
          onChangeStatus={handleChangeStatus}
          styles={{
            dropzone: {
              minHeight: 150,
              maxHeight: 200,
              width: '53vw',
              margin: '22px',
            },
          }}
        />
      )}
    </>
  );
};
export default LabImages;
