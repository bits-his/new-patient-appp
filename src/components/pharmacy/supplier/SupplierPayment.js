import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useCallback } from "react";
import { useHistory } from "react-router";
import { generateReceiptNo, _customNotify, _warningNotify } from "../../utils/helpers";
import CustomTypeahead from "../../comp/components/CustomTypeahead";
import CustomCard from "../../comp/components/CustomCard";
import { CustomButton, CustomForm } from "../../comp/components";
import { getSupplierInfo, supplierPayment } from "../../../redux/actions/pharmacy";
import { PDFViewer } from "@react-pdf/renderer";
import { DepositReceipt } from "./PaymentReceipt";

export default function SupplierPayment() {
  const supplierList = useSelector((state) => state.pharmacy.supplierInfo);
  const facilityId = useSelector((state) => state.auth.user.facilityId);
  const user = useSelector((state) => state.auth.user);
  const facilityDetails = useSelector((state) => state.facility.info);
  const receiptNo = moment().format("YYMDhms");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [receiptSN, setReceiptSN] = useState(false);
  const initForm = {
    narration: "",
    supplier_name: "",
    supplier_code: "",
    modeOfPayment: "",
    amount: 0,
    facilityId,
  };
  const [form, setForm] = useState(initForm);
  const _getSupplierInfo = useCallback(() => {
    dispatch(getSupplierInfo());
  }, [dispatch]);
  useEffect(() => {
    _getSupplierInfo();
  }, [_getSupplierInfo]);

  const fields = [
    {
      label: "Select Supplier",
      name: "selectedSupplier",
      value: form.selectedSupplier,
      type: "custom",
      col: 4,
      component: () => (
        <CustomTypeahead
          label="Select Supplier"
          labelKey="supplier_name"
          options={supplierList}
          onChange={(s) => {
            if (s.length) {
              console.log(s);
              setForm((p) => ({
                ...p,
                name: s[0].supplier_name,
                supplier_code: s[0].supplier_code,
              }));
            }
          }}
          onInputChange={(v) => {
            if (v.length) {
              console.log(v, "KDDDDDDDK");
            }
          }}
        />
      ),
    },
    {
      label: "Mode Of Payment",
      type: "select",
      options: ["Cash", "POS", "Transfer", "Credit", "Cheque"],
      name: "modeOfPayment",
      value: form.modeOfPayment,
      col: 4,
    },
    {
      label: "Amount",
      name: "amount",
      type: "number",
      value: form.amount,
      col: 4,
    },
    {
      label: "Narration",
      name: "narration",
      type: "text",
      value: form.narration,
      col: 4,
    },
  ];

  const handleSubmit = () => {
    setLoading(true);
    generateReceiptNo((receiptDateSN, receiptSN) => {
      console.log({ receiptDateSN, receiptSN });
      supplierPayment(
        { ...form, receiptDateSN, receiptSN },
        (res) => {
          //   con
          if (res) {
            setLoading(false);
            _customNotify("Successfully", "success");
            setPreview(true);
            setReceiptSN(receiptDateSN);
          }
        },
        () => {
          setLoading(false);
          _warningNotify("Successfully Saved", "error");
        }
      );
    });
  };

  const handleChange = ({ target: { name, value } }) => {
    setForm((p) => ({
      ...p,
      [name]: value,
    }));
  };

  return (
    <div className="m-2">
    <CustomCard
      back
      header={"Supplier Payment"}
      headerRight={<h6>Receipt No.: {receiptNo}</h6>}
    >
      {preview ? (
        <PDFViewer height="700" width="1100">
          <DepositReceipt facilityDetails={facilityDetails} depositDetails={form} receiptSN={receiptSN} user={user.username}/>
        </PDFViewer>
      ) : (
        <>
        {/* {JSON.stringify(facilityDetails)} */}
          <CustomForm fields={fields} handleChange={handleChange} />
          <center>
            <CustomButton onClick={handleSubmit} loading={loading}>
              Submit
            </CustomButton>
          </center>
        </>
      )}
    </CustomCard>
    </div>
  );
}
