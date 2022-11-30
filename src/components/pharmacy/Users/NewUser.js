import React, { useCallback, useEffect } from "react";
import { FormGroup } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomTypeahead from "../../../components/UI/CustomTypeahead";
import { Checkbox, CustomForm } from "../../../components/UI";
import { getPharmStore } from "../../../redux/action/pharmacy";

function NewUserForm({
  handleChange,
  handleCheckboxChange,
  username,
  handleTypeaheadChange,
  form,
  phone,
  password,
  role,
  accessTo,
}) {
  const dispatch = useDispatch();
  const _getPharmStore = useCallback(
    () => dispatch(getPharmStore()),
    [dispatch]
  );

  const pharmStore = useSelector((state) => state.pharmacy.pharmStore);
  useEffect(() => {
    _getPharmStore();
  }, [_getPharmStore]);
  const fields = [
    {
      className: "form-control",
      type: "text",
      name: "username",
      value: username,
      label: "User Name",
    },
    {
      className: "form-control",
      type: "text",
      name: "phone",
      value: phone,
      label: "Phone No.",
    },
    {
      className: "form-control",
      type: "password",
      name: "password",
      value: password,
      label: "Password",
    },
    {
      className: "form-control",
      type: "select",
      name: "role",
      value: role,
      label: "Role",
      autoComplete: "disabled",
      options: ["Store Owner", "Receptionist", "Sales Agent"],
    },
    {
      type: "custom",
      component: () => (
        <CustomTypeahead
          label="Default Store"
          options={pharmStore}
          labelKey="store_name"
          onChange={(val) => {
            if (val) {
              handleTypeaheadChange(val[0], "default_store");
            }
          }}
          onInputChange={(val) => {
            console.log(val);
          }}
        />
      ),
    },
    {
      type: "custom",
      component: () => (
        <CustomTypeahead
          label="Assign store"
          options={pharmStore}
          labelKey="store_name"
          onChange={(val) => {
            if (val) {
              handleTypeaheadChange(val[0], "branch_name");
            }
          }}
          onInputChange={(val) => {
            console.log(val);
          }}
        />
      ),
    },
  ];
  return (
    <>
      <CustomForm fields={fields} handleChange={handleChange} />
      <FormGroup>
        <label className="mb-2">Access (User's Privilege)</label>
        <div className="row">
          {[
            "Dashboard",
            "Manage Store",
            "Manage Suppliers",
            "Drug Purchase",
            "Client Registration",
            "Drug Sales",
            "Returned Drugs",
            "My Sales",
            "Manage Users",
            "discription",
          ].map((item, i) => (
            <div className="col-md-2" key={i}>
              <Checkbox
                label={item}
                name="accessTo"
                onChange={handleCheckboxChange}
                value={accessTo}
                checked={accessTo && accessTo.includes(item)}
              />
            </div>
          ))}
        </div>
      </FormGroup>
    </>
  );
}

export default NewUserForm;
