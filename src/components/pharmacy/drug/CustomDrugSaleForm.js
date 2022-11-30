import React from "react";
import { Row } from "reactstrap";
import { CustomForm } from "../../comp/components";
// import SimpleInput from "../../components/SimpleInput";

function  CustomDrugSaleForm({
  form = {},
  handleFormChange = (f) => f,
  showDeposit = true,
}) {
  const fields = [
    {
      label: "Customer Name",
      name: "customerName",
      type: "text",
      value: form.customerName,
      required: true,
    },
    {
      label: "Customer Category",
      name: "customerCategory",
      type: "text",
      value: form.customerCategory,
      hide: true,
      // required: true,
    },
    {
      label: "Address",
      name: "address",
      type: "text",
      value: form.address,
      // required: true,
    },
    {
      label: "Phone",
      name: "phone",
      type: "text",
      value: form.phone,
      // required: true,
    },
    {
      label: "Email",
      name: "email",
      type: "text",
      value: form.email,
      // required: true,
    },
    {
      label: "Deposit Amount",
      name: "amount",
      type: "text",
      value: form.amount,
      hide: !showDeposit,
    },
  ];

  return (
    <Row>
      <CustomForm fields={fields} handleChange={handleFormChange}/>
    </Row>
  );
}

export default CustomDrugSaleForm;
