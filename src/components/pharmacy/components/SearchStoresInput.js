import React, { useEffect,useCallback } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { useDispatch, useSelector } from "react-redux";
import { getClientInfo, getPharmStore } from "../../../redux/actions/pharmacy";

function SearchStoresInput(props) {
  const dispatch = useDispatch() 
  const pharmStore = useSelector((state) => state.pharmacy.pharmStore)
  // const options = pharmStore && pharmStore.map((item) => item.store_name)

  const _getPharmStore = useCallback(() => {
    if (!pharmStore.length) {
      dispatch(getClientInfo());
      dispatch(getPharmStore());
    }
  }, [dispatch])

  useEffect(() => {
    _getPharmStore()
  },[_getPharmStore])

  return (
    <>
      {/* {JSON.stringify(pharmStore)} */}
      <Typeahead
        {...props}
        id={"store_name"}
        _ref={props.ref_from}
        options={pharmStore}
        placeholder="Search stores by name"
        labelKey="store_name"
        onInputChange={(v) => {
          if (v && v.length) {
            props.onInputChange(v);
          }
          // console.error({IIIIIIIIIIIIISSSSSSS:v});
        }}
        // inline={true}
        clearButton
        onChange={(v) => {
          if (v.length) {
            props.onChange(v[0]);
          }
        }}
      />
    </>
  );
}

export default SearchStoresInput;
