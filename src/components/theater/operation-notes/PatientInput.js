import React, { useRef } from "react";
import AutoComplete from "../../comp/components/AutoComplete";

function PatientInput({ patientlist, setFormData }) {
  const patientInputRef = useRef();

  const setInputValue = val => patientInputRef.current.setState({ text: val })

  return (
    <div>
      {/* {JSON.stringify({patientInptRef: patientInputRef.current})} */}
      <label className="">Patient Name</label>
      <AutoComplete
        options={patientlist}
        labelKey={(i) => `${i.firstname} ${i.surname} ${i.other}`}
        onChange={(item) => {
          if (item.length) {
            let val = item[0];
            setFormData({
              name: `${val.firstname} ${val.surname} ${val.other}`,
              patientId: val.id,
            });
          }
        }}
        _ref={patientInputRef}
      />
    </div>
  );
}

export default PatientInput;
