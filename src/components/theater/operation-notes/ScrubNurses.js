import React, { useState, useEffect } from "react";
import CheckBoxItem from "./CheckBoxItem";
import { _postApi } from "../../../redux/actions/api";
import { apiURL } from "../../../redux/actions";
import { useSelector } from "react-redux";

export default function Surgeons({
  formdata,
  handleCheck,
  handleAdd,
  handleRemove,
}) {
  const facId = useSelector((state) => state.auth.user.facilityId);
  const [scrubNursesList, setScrubNursesList] = useState([]);

  const fetchSugeonsList = () => {
    const id = null;
    const query_type = "by_type";
    _postApi(
      `${apiURL()}/operationnotes/surgeons/all/${id}/${facId}/${query_type}`,
      { type: "Scrub Nurse" },
      ({ results }) => {
        setScrubNursesList(results);
        // console.log(data.J)
      },
      (err) => console.log(err)
    );
  };
  useEffect(() => {
    fetchSugeonsList();
  }, []);

  return (
    <div className="col-md-6">
      <label htmlFor="">Srub Nurses</label>
      {scrubNursesList&&scrubNursesList.map((item, i) => (
        <CheckBoxItem
          key={i}
          value={formdata.scrubNurse ? formdata.scrubNurse : []}
          handleCheck={handleCheck}
          name="scrubNurse"
          label={item.name}
        />
      ))}
    </div>
  );
}
