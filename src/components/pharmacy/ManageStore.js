import React, { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  addNewPharmStore,
  getPharmStore,
  getPharmUser,
} from "../../redux/actions/pharmacy";
import CustomTypeahead from "../comp/components/CustomTypeahead";
import Loading from "../comp/components/Loading";
import { _customNotify, _warningNotify } from "../utils/helpers";
import { CustomButton, CustomForm, CustomTable } from "../comp/components";
import CustomCard from "../comp/components/CustomCard";
import Scrollbar from "../comp/components/Scrollbar";
import { FaEdit } from "react-icons/fa";

export default function ManageStore() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const initialState = {
    store_name: "",
    phone: "",
    address: "",
    location: "",
    storeType: "",
    manage_by: "",
    store_code: uuidV4(),
    status: "insert",
  };
  const [form, setForm] = useState(initialState);
  const pharmStore = useSelector((state) => state.pharmacy.pharmStore);
  const _loading = useSelector((state) => state.pharmacy.loading);
  const pharmUsers = useSelector((state) => state.pharmacy.pharmUsers);
  const fields = [
    {
      label: "Store Name",
      name: "store_name",
      required: true,
      value: form.store_name,
    },

    {
      label: "Phone Number (optional)",
      name: "phone",
      value: form.phone,
    },
    {
      label: "Store Location",
      name: "location",
      required: true,
      value: form.location,
    },
    {
      label: "Address",
      type: "text",
      name: "address",
      value: form.address,
    },
    {
      label: "Store Type",
      type: "select",
      name: "storeType",
      options: ["Point Of Sales", "Store"],
      value: form.storeType,
    },
    {
      label: "Managed by",
      type: "custom",
      name: "manage_by",
      value: form.manage_by,
      component: () => (
        <CustomTypeahead
          label="Managed by"
          labelKey="username"
          options={pharmUsers}
          onChange={(s) => {
            if (s.length) {
              console.log(s);
              setForm((p) => ({
                ...p,
                manage_by: s[0].id,
              }));
            }
          }}
        />
      ),
    },
  ];
  const handleChange = ({ target: { name, value } }) => {
    setForm((p) => ({
      ...p,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setForm(initialState);
  };

  const handleSubmit = () => {
    setLoading(true);
    if (form.branch_name === "" || form.storeType === "") {
      alert("Error", "Please complete the form");
    } else {
      addNewPharmStore(
        form,
        (res) => {
          if (res) {
            setLoading(false);
            _customNotify("Successfully Saved", "success");
            handleReset();
            _getPharmStore();
          }
        },
        (err) => {
          _warningNotify("Errored Occurred", "error");
          setLoading(false);
          console.log(err);
        }
      );
    }
  };
  const _getPharmStore = useCallback(() => {
    dispatch(getPharmStore());
    dispatch(getPharmUser());
  }, [dispatch]);

  useEffect(() => {
    _getPharmStore();
  }, [_getPharmStore]);

  const handleEdit = (store) => {
    setForm((p) => ({ ...p, ...store, status: "update" }));
  };
  const tblfields = [
    {
      title: "S/N",
      custom: true,
      component: (item, idx) => idx + 1,
      className: "text-center",
    },
    { title: "Store", value: "store_name" },
    { title: "Location", value: "location" },
    { title: "Phone Number", value: "phone" },
    { title: "Store Type", value: "storeType" },
    {
      title: "Action",
      custom: true,
      component: (item) => (
        <CustomButton
          size="sm"
          outline
          onClick={() => {
            handleEdit(item);
          }}
        >
          <FaEdit />
          Edit
        </CustomButton>
      ),
      className: "text-center",
    },
  ];
  return (
    <div className="m-2">
      {/* <div className="col-md-1"></div> */}
      <CustomCard header="Manage your stores">
        <CustomForm fields={fields} handleChange={handleChange} />
        <center className="my-2">
          <CustomButton
            className="col-md-3"
            onClick={handleSubmit}
            loading={loading}
          >
            {form.status === "update" ? "Update" : "Submit"}
          </CustomButton>
        </center>
        <div style={{ height: "35vh" }}>
          {_loading && <Loading size="sm" />}
          <Scrollbar>
            <CustomTable
              size="sm"
              bordered
              fields={tblfields}
              data={pharmStore}
            />
          </Scrollbar>
        </div>
      </CustomCard>
    </div>
  );
}
