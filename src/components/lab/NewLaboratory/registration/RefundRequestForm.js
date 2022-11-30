import moment from "moment";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardBody, CardHeader } from "reactstrap";
import { apiURL } from "../../../../redux/actions";
import { _fetchApi2, _postApi } from "../../../../redux/actions/api";
import AutoComplete from "../../../comp/components/AutoComplete";
// import AutoCompleteWithMultipleSelection from "../../../comp/components/AutoCompleteWithMultipleSelection";
import BackButton from "../../../comp/components/BackButton";
import CustomButton from "../../../comp/components/Button";
import Checkbox from "../../../comp/components/Checkbox";
import CustomForm from "../../../comp/components/CustomForm";
import CustomTable from "../../../comp/components/CustomTable";
import {
  formatNumber,
  _customNotify,
  _warningNotify,
} from "../../../utils/helpers";

function RefundRequestForm() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [patientTests, setPatientTests] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);

  const patientList = useSelector((state) => state.lab.patientList);
  const facilityId = useSelector((state) => state.auth.user.facilityId);

  const getPatientTests = (pid) => {
    _fetchApi2(
      `${apiURL()}/lab/get-patient-lab-txn?query_type=all&patientId=${pid}&facilityId=${facilityId}`,
      // `${apiURL()}/lab/get-patient-lab-txn?query_type=summary&patientId=${pid}&facilityId=${facilityId}`,
      (data) => {
        if (data.success) {
          setPatientTests(data.results);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  // {"facilityId":"966a89f6-05d8-4564-b319-2f8863821e75","createdAt":"2021-06-11T12:06:07.000Z",
  //         "transaction_id":1241,"transaction_date":"2021-06-11","id":0,"description":"Reticulocyte",
  //         "acct":"400021","debit":7000,"credit":0,"enteredBy":"admin","receiptDateSN":"11062181240",
  //         "receiptNo":8,"modeOfPayment":"Cash","bank_name":"","status":"pending","approvedBy":null,
  //         "paymentStatus":"","client_acct":"1","patient_id":"1-294"}

  const fields = [
    // {
    //   //   label: "Select Client",
    //   type: "custom",
    //   component: () => (
    //     <AutoComplete
    //       label="Select Client"
    //       labelClass="font-weight-normal"
    //       options={patientList}
    //       labelKey={(i) => `${i.name} (${i.id})`}
    //       onChange={(e) => {
    //         if (e.length) {
    //           setForm((p) => ({ ...p, client_id: e[0].id }));
    //           getPatientTests(e[0].id);
    //         }
    //       }}
    //     />
    //   ),
    //   col: 6,
    // },
    // {
    //   type: "custom",
    //   component: () => (
    //     <AutoCompleteWithMultipleSelection
    //       label="Select Test"
    //       labelClass="font-weight-normal"
    //       options={patientTests}
    //       labelKey={(i) => `${i.description} (${formatNumber(i.debit)})`}
    //       onChange={(e) => {
    //         // console.log(e)
    //         if (e.length) {
    //           // console.log(e[0])
    //           // let selected = e[0];
    //           // setForm((p) => ({
    //           //   ...p,
    //           //   // amount_paid: p.amount_paid || 0 + parseFloat(selected.debit),
    //           //   // transaction_id: selected.transaction_id,
    //           //   // receiptno: selected.receiptDateSN
    //           // }));
    //           setSelectedTests(e);
    //         }
    //       }}
    //     />
    //   ),
    //   col: 6,
    // },
    {
      label: "Total Amount Paid",
      name: "amount_paid",
      disabled: true,
      value: selectedTests.reduce((a, b) => a + parseFloat(b.dr), 0),
      col: 6,
    },
    {
      label: "Total Amount to be Refunded",
      name: "refund_amount",
      value: form.refund_amount,
      col: 6,
    },
    {
      label: "Reasons for Refund",
      name: "reason",
      value: form.reason,
      col: 6,
    },
  ];

  const tableFields = [
    {
      title: "Date",
      custom: true,
      component: (item) => (
        <div>{moment(item.createdAt).format("DD-MM-YYYY")}</div>
      ),
    },
    { title: "Description", value: "description" },
    { title: "Receipt", value: "reference_no", className: "text-center" },
    {
      title: "Amount",
      custom: true,
      component: (item) => (
        <div className="text-right">{formatNumber(item.dr)}</div>
      ),
    },
    {
      title: "Action",
      custom: true,
      component: (item) => {
        let checked =
          selectedTests.findIndex((i) => i.description === item.description) !==
          -1;
        return (
          <div className="text-center">
            <button
              className="btn btn-warning btn-sm"
              style={checked ? { backgroundColor: "#7FFF00" } : {}}
              onClick={() => {
                if (checked) {
                  setSelectedTests((p) =>
                    p.filter((j) => j.description !== item.description)
                  );
                } else {
                  setSelectedTests((p) => [...p, item]);
                }
              }}
            >
              {checked ? "Remove" : "Select"}
            </button>
            {/* <Checkbox
              label='sel'
              name='selected'
              // checked={checked}
              onChange={(e) => {
                console.log(item.description)
                
              }}
            /> */}
          </div>
        );
      },
    },
  ];

  const handleChange = ({ target: { name, value } }) =>
    setForm((p) => ({ ...p, [name]: value }));

  const handleRadioChange = () => {};

  const formIsValid =
    form.client !== "" &&
    form.test !== "" &&
    form.refund_amount !== "" &&
    form.reason !== "";

  const submitRequest = () => {
    setLoading(true);
    if (formIsValid) {
      _postApi(
        `${apiURL()}/lab/refunds`,
        { ...form, selectedTests },
        () => {
          setLoading(false);
          _customNotify("Refund request has been raised, pending approval.");
        },
        () => {
          setLoading(false);
          _warningNotify("An error occured");
        }
      );
    } else {
      _warningNotify("Please complete form!");
    }
  };

  return (
    <>
      <BackButton />
      <Card>
        <CardHeader>Raise New Refund Request</CardHeader>
        <CardBody className="p-0 py-1">
          {/* {JSON.stringify(selectedTests)} */}

          <AutoComplete
            label="Select Client"
            labelClass="font-weight-normal"
            options={patientList}
            labelKey={(i) => `${i.name} (${i.id})`}
            onChange={(e) => {
              if (e.length) {
                setForm((p) => ({ ...p, client_id: e[0].id }));
                getPatientTests(e[0].id);
              }
            }}
            containerClass="mx-2"
          />

          <CustomTable
            size="sm"
            className="mt-2"
            data={patientTests}
            fields={tableFields}
          />

          <CustomForm
            fields={fields}
            handleChange={handleChange}
            handleRadioChange={handleRadioChange}
          />

          <center className="my-2">
            <CustomButton
              loading={loading}
              disabled={!formIsValid}
              onClick={submitRequest}
            >
              Submit Request
            </CustomButton>
          </center>
        </CardBody>
      </Card>
    </>
  );
}

export default RefundRequestForm;
