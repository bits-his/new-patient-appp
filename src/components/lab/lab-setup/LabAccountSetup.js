import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAccountType, saveLabAccount } from "../../../redux/actions/account";
import { getDepartmentList } from "../../../redux/actions/lab";
import { getRevenueAccHeads } from "../../../redux/actions/transactions";
import AutoComplete from "../../comp/components/AutoComplete";
import CustomButton from "../../comp/components/Button";
import CustomForm from "../../comp/components/CustomForm";
import CustomTable from "../../comp/components/CustomTable";
import { _customNotify } from "../../utils/helpers";
import { accountFormFields } from "./components/labPricingForm";
import { processBatchSetup } from "./helper";

function LabAccountSetup() {
  const [form, setForm] = useState({});

  const departmentList = useSelector((state) => state.lab.departmentList);
  const revenueHead = useSelector(
    (state) => state.transactions.revenueAccHeads
  );
  const accountType = useSelector((state) => state.account.accountType);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [items, setItems] = useState({});
  const [arr, setArr] = useState([]);
  const handleChange = ({ target: { name, value } }) =>
    setForm((p) => ({ ...p, [name]: value }));
  useEffect(() => {
    dispatch(getDepartmentList());
    dispatch(getRevenueAccHeads());
    dispatch(getAccountType());
  }, []);
  const handleSubmit = () => {
    setLoading(true);
    saveLabAccount(items,setLoading,setArr)
  };
  const handleAutocompleteChange = (val, name) => {
    if (val.length) {
      setItems((p) => ({ ...p, [name]: val[0].description }));
    }
  };
  const handleAdd = () => {
    if (items.description === "") {
      _customNotify("Please Fill the form");
    } else {
      setArr((p) => [...p, items]);
      setItems({});
    }
  };

  return (
    <div>
      <div className="p-2">
        <CustomForm
          fields={accountFormFields({
            ...form,
            options: { departmentList, revenueHead, accountType },
          })}
          // handleChange={handleChange}
          handleAutocompleteChange={handleAutocompleteChange}
        />

        <center className="my-2">
          <CustomButton onClick={handleAdd}>Add</CustomButton>
        </center>
      </div>
      <CustomTable
        fields={[
          { title: "Department", value: "department" },
          { title: "Account Type", value: "account_type" },
          {
            title: "Account Head",
            value: "account_head",
          },
        ]}
        bordered
        size="sm"
        data={arr}
      />

      <center>
        <CustomButton onClick={handleSubmit} loading={loading}>
          Save
        </CustomButton>
      </center>
    </div>
  );
}

export default LabAccountSetup;
