import React, { useState, useEffect } from "react";
import CheckBoxItem from "./CheckBoxItem";
import { _postApi } from "../../../redux/actions/api";
import { apiURL } from "../../../redux/actions";
import { useSelector } from "react-redux";

export default function ScrubNurses({
  formdata,
  handleCheck,
  handleAdd,
  handleRemove,
}) {
  const facId = useSelector((state) => state.auth.user.facilityId);
  const [surgeonsList, setSurgeonsList] = useState([]);

  const fetchSugeonsList = () => {
    const id = null;
    const query_type = "by_type";
    _postApi(
      `${apiURL()}/operationnotes/surgeons/all/${id}/${facId}/${query_type}`,
      { type: "Surgeon" },
      ({ results }) => {
        setSurgeonsList(results);
        // console.log(data.J)
      },
      (err) => console.log(err)
    );
  };
  useEffect(() => {
    fetchSugeonsList();
  }, []);

  return (
    <div className="row">
      {/* {JSON.stringify(surgeonsList)} */}

      {surgeonsList&&surgeonsList.map((item, i) => (
        <div className="col-md-3">
          <CheckBoxItem
            key={i}
            value={formdata.surgeons ? formdata.surgeons : []}
            handleCheck={handleCheck}
            name="surgeons"
            label={item.name}
          />
        </div>
      ))}
    </div>
  );
}
