import React, { useState } from "react";
import NewUserForm from "./NewUser";
import { useDispatch, useSelector } from "react-redux";
import useQuery from "../../../hooks/useQuery";
import CustomCard from "../../../components/UI/CustomCard";
import { CustomButton } from "../../../components/UI";
import { createUser } from "../../../redux/action/pharmacy";
import { uuid } from "uuidv4";
import { useHistory } from "react-router";

const CreateUser = () => {
  const query = useQuery();
  const loading = useSelector((state) => state.pharmacy.loading);
  const navigate = useHistory();
  const userType = query.get("type") || "new_admin";
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    busName: "",
    address: "",
    store: "",
    accessTo: [],
    facilityId: uuid(),
    branch_name:""
  });
  const dispatch = useDispatch();
  const resetForm = () => {
    setForm({
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      busName: "",
      address: "",
      businessType: "PRODUCTS",
      default_store: "",
      assign_store: "",
    });
  };

  const goHome = () => {
    resetForm();
    navigate(-1);
    alert("Successfully Saved")
  };

  const handleSubmit = () => {
    if (form.username === "" || form.phone === "") {
      if (form.store === "") {
        alert("please select store");
      } else {
        alert("Incomplete form");
      }
    } else {
      dispatch(
        createUser(
          form,
          () => {
            goHome();
          },
          () => {
            alert("error Occured");
          }
        )
      );
    }
  };

  const handleChange = ({ target }) => {
    setForm((p) => ({
      ...p,
      error: "",
      [target.name]: target.value,
    }));
  };
  const handleTypeaheadChange = (val, name) => {
    console.log(val)
    if (val) {
      setForm((p) => ({
        ...p,
        [name]: val.store_name,
      }));
    }
  };

  const handleCheckboxChange = ({ target: { name } }) => {
    console.log(form.accessTo.includes(name));
    if (!form.accessTo.includes(name)) {
      setForm((prev) => ({ ...prev, accessTo: [...prev.accessTo, name] }));
    } else {
      setForm((prev) => ({
        ...prev,
        accessTo: prev.accessTo.filter((item) => item !== name),
      }));
    }
  };

  return (
    <CustomCard back header={"Create User Account"}>
      <NewUserForm
        username={form.username}
        form={form}
        phone={form.phone}
        handleTypeaheadChange={handleTypeaheadChange}
        password={form.password}
        role={form.role}
        accessTo={form.accessTo}
        handleChange={handleChange}
        handleCheckboxChange={handleCheckboxChange}
        userType={userType}
      />
      <CustomButton
        // disabled={!formIsValid}
        loading={loading}
        type="submit"
        className="offset-md-5 col-md-2 offset-lg-5 col-lg-2"
        onClick={handleSubmit}
      >
        Create User
      </CustomButton>
    </CustomCard>
  );
};

export default CreateUser;
