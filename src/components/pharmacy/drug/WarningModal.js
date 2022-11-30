import React from "react";
import { CustomButton } from "../../comp/components";
import CustomModal from "../../comp/components/CustomModal";
import CustomDrugSaleForm from "./CustomDrugSaleForm";

function NewCustomerModal({
  isOpen = false,
  toggle = (f) => f,
  onSkipClicked = (f) => f,
  onSubmit = (f) => f,
  form,
}) {
  // const [form, setForm] = useState({});
  const handleFormChange = ({ target: { name, value } }) =>
    form((p) => ({ ...p, [name]: value }));

  return (
    <CustomModal
      isOpen={isOpen}
      toggle={toggle}
      header="Customer Details"
      footer={
        <>
          <CustomButton color="success" onClick={onSkipClicked}>
            Skip
          </CustomButton>
          <CustomButton onClick={() => onSubmit(form)}>Submit</CustomButton>
        </>
      }
    >
      <CustomDrugSaleForm
        form={form}
        handleFormChange={handleFormChange}
        showDeposit={false}
      />
    </CustomModal>
  );
}
export default NewCustomerModal;
