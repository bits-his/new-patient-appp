import React, { useEffect, useState } from "react";
import CheckBoxItem from "./CheckBoxItem";
import AdditionalTextBox from "./AdditionalTextBox";
import { useSelector } from "react-redux";
import { _postApi } from "../../../redux/actions/api";
import { apiURL } from "../../../redux/actions";

export default function Anesthetists({
  formdata,
  handleCheck,
  handleAdd,
  handleRemove,
}) {
  const facId = useSelector((state) => state.auth.user.facilityId);
  const [anesthetistsList, setAnesthetistsList] = useState([]);

  const getAllAnesthetists = () => {
    const id = null;
    const query_type = "by_type";
    _postApi(
      `${apiURL()}/operationnotes/surgeons/all/${id}/${facId}/${query_type}`,
      { type: "Anesthetists" },
      ({ results }) => {
        // let dd = results.map((i) => i.name);
        setAnesthetistsList(results);
        // console.log(data.J)
      },
      (err) => console.log(err)
    );
  };
  useEffect(() => {
    getAllAnesthetists();
  }, []);

  return (
    <div className="row">
      {/* {JSON.stringify(anesthetistsList)} */}
      {anesthetistsList&&anesthetistsList.map((item, i) => (
        <div className="col-md-3">
          <CheckBoxItem
            key={i}
            value={formdata.anesthetist ? formdata.anesthetist : []}
            handleCheck={handleCheck}
            name="anesthetist"
            label={item.name}
          />
        </div>
      ))}
    </div>
  );
}
