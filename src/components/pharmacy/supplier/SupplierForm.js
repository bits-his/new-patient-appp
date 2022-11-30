import React, { useState } from "react";
import { Form, Row, FormGroup, Col } from "reactstrap";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import { useHistory } from "react-router";
import { _customNotify, _warningNotify } from "../../utils/helpers";
import CustomCard from "../../comp/components/CustomCard";
import {
  CustomButton,
  CustomForm,
  SelectInput,
  TextInput,
} from "../../comp/components";
import { addSupplierInfo } from "../../../redux/actions/pharmacy";

export default function SupplierForm() {
  const [bank, addBank] = useState(false);
  const navigate = useHistory();
  const bankList = useSelector((state) => state.pharmacy.bankList);
  const [bankDetails, addBankDetails] = useState([
    { acctName: "", acctNo: "", bank_name: "" },
  ]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    balance: null,
    supplierCode: uuid(),
  });
  const [loading, setLoading] = useState(false);
  const handleAdd = () => {
    if (bank) {
      addBankDetails((p) => [
        ...p,
        {
          acctName: "",
          acctNo: "",
          bank_name: "",
        },
      ]);
    }
    addBank(true);
  };
  const handleChange = ({ target: { name, value } }) => {
    setForm((p) => ({
      ...p,
      [name]: value,
    }));
  };

  const fields = [
    {
      label: "Supplier Name",
      name: "name",
      required: true,
      value: form.name,
    },
    {
      label: "Supplier Address",
      name: "address",
      required: false,
      value: form.address,
    },
    {
      label: "Phone Number",
      name: "phone",
      required: false,
      type: "phone",
      value: form.phone,
    },
    {
      label: "Email",
      name: "email",
      required: false,
      value: form.email,
    },
    {
      label: "Website",
      name: "website",
      required: false,
      value: form.website,
    },
    {
      label: "Opening Balance",
      name: "balance",
      required: false,
      value: form.balance,
      type: "number",
    },
  ];

  const handleBankDetails = (key, value, index) => {
    let newList = [];
    bankDetails.forEach((item, i) => {
      if (index === i) {
        newList.push({ ...item, [key]: value });
      } else {
        newList.push(item);
      }
    });
    addBankDetails(newList);
  };

  const handleSubmit = () => {
    setLoading(true);
    let obj = {
      ...form,
      bankDetails,
    };
    addSupplierInfo(
      obj,
      (res) => {
        if (res) {
          console.log(res);
          setLoading(false);
          _customNotify("Successfully Saved", "success");
          navigate.goBack();
        }
      },
      (err) => {
        if (err) {
          setLoading(false);
          _warningNotify("Error Occured", "error");
        }
      }
    );
  };
  return (
    <div className="m-2">
      <CustomCard back header={"Supplier Form"}>
        <Row>
          <CustomForm fields={fields} handleChange={handleChange} />
        </Row>
        <Row>
          <Col>
            <CustomButton
              onClick={() => handleAdd()}
              size="sm"
              className="offset-md-10"
            >
              Add Bank Details
            </CustomButton>
          </Col>
        </Row>
        <Row>
          {bank && (
            <Form>
              <div className="row">
                <p className="col-md-4 font-weight-bold">Account Name</p>
                <p className="col-md-4 font-weight-bold">Account No</p>
                <p className="col-md-4 font-weight-bold">Bank Name</p>
              </div>
              {bankDetails.map((item, index) => (
                <FormGroup row className="p-0 m-0 mb-1" key={index}>
                  <TextInput
                    container="col-md-4"
                    className="mb-2"
                    value={item.acctName}
                    onChange={(e) => {
                      handleBankDetails("acctName", e.target.value, index);
                    }}
                  />
                  <TextInput
                    container="col-md-4"
                    className="mb-2"
                    value={item.acctNo}
                    type="number"
                    onChange={(e) => {
                      handleBankDetails("acctNo", e.target.value, index);
                    }}
                  />
                  <SelectInput
                    container="col-md-4"
                    className="mt-4"
                    options={bankList}
                    value={item.bank_name}
                    onChange={(e) =>
                      handleBankDetails("bank_name", e.target.value, index)
                    }
                  />
                </FormGroup>
              ))}
            </Form>
          )}
        </Row>

        <center>
          <CustomButton
            className="px-5"
            loading={loading}
            onClick={() => handleSubmit()}
          >
            Save
          </CustomButton>
        </center>
      </CustomCard>
    </div>
  );
}
