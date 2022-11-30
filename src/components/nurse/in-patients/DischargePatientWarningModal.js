import moment from "moment";
import React, { useState } from "react";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { Card, CardHeader, CardBody, CardFooter, Button } from "reactstrap";
import { CustomTable } from "../../comp/components";
import CustomButton from "../../comp/components/Button";
import PrintWrapper from "../../comp/components/print/PrintWrapper";
import { formatNumber } from "../../utils/helpers";

function DischargeWarningCard({
  toggle = (f) => f,
  selectedAllocation = {},
  completeDischarge = (f) => f,
  bill = [],
  loading = false,
  transData = [],
}) {
  const fields = [
    { title: "Description", value: "description" },
    { title: "Reference no.", value: "reference_no" },
    {
      title: "Amount",
      custom: true,
      component: (item) => (
        <div className="text-right">{formatNumber(item.cr || 0)}</div>
      ),
    },
  ];
  // const _fields = [
  //   { title: "Test Name", value: "date" },
  //   { title: "Quantity", value: "description" },
  //   { title: "Price", value: "description" },
  //   {
  //     title: "Amount",
  //     custom: true,
  //     component: (item) => (
  //       <div className="text-right">{formatNumber(item.amount || 0)}</div>
  //     ),
  //   },
  // ];
  const printBill = () => {
    window.frames[
      "print_frame"
    ].document.body.innerHTML = document.getElementById(
      "bill_container"
    ).innerHTML;
    window.frames["print_frame"].window.focus();
    window.frames["print_frame"].window.print();
  };
  const [drop, setDrop] = useState(false);
  // const [drops, setDrops] = useState(false);
  const dropDown = () => {
    setDrop(!drop);
  };
  // const dropDowns = () => {
  //   setDrops(!drops);
  // };
  const total = transData.reduce((item, idx) => item + parseFloat(idx.cr), 0);
  const lastTotal = parseFloat(bill.totalAmount) + parseFloat(total);
  
  return (
    <Card>
      <CardHeader className="d-flex justify-content-between">
        <Button onClick={toggle} size="sm" color="primary">
          {"<- Go Back"}
        </Button>
        <div>Discharge Confirmation</div>
      </CardHeader>
      <CardBody>
        <div id="bill_container">
          <style>
            {`@media print {
                .row {
                  display: flex;
                  flex-direction: row;
                }
                .col-md-4 {
                  width: 40%;
                }
                .col-md-6 {
                  width: 60%;
                }
                .text-right {
                    text-align: right;
                }
                .text-center {
                    text-align: center;
                }
                .font-weight-bold {
                    font-weight: bold;
                }
                .print-start{
                    margin: 2em;
                    margin-top: 4em;
                }
                .print-only{
                  display: block;
                }
            }

            @media screen {
              .print-only{
                display: none;
              } 
           }   
          `}
          </style>

          <PrintWrapper title="Patient Admission Bill">
            <div className="row">
              <div className="col-md-4">
                <div className="my-1">Patient:</div>
                <div className="my-1">Room description:</div>
                <div className="my-1">Room Cost (per day):</div>
                <div className="my-1">Total Number of days:</div>
                <div className="my-1">Total Cost of Admission:</div>
                <div className="my-1">Date Admitted:</div>
                <div className="my-1">Date Discharged:</div>
              </div>
              <div className="col-md-8">
                <div className="my-1">
                  {selectedAllocation.patient_name} (
                  {selectedAllocation.patient_id})
                </div>
                <div className="my-1">
                  {selectedAllocation.name} ({selectedAllocation.class_type})
                </div>
                <div className="my-1">
                  ₦{formatNumber(selectedAllocation.price) || 0}
                </div>
                <div className="my-1">
                  {bill.noOfDays} {parseInt(bill.noOfDays) > 1 ? "days" : "day"}
                </div>
                <div className="my-1">
                  ₦{formatNumber(bill.totalAmount) || "0"}
                </div>
                <div className="my-1">
                  {moment
                    .utc(selectedAllocation.allocated)
                    .format("DD/MM/YYYY hh:mm")}
                </div>
                <div className="my-1">
                  {moment.utc().format("DD/MM/YYYY hh:mm")}
                </div>
              </div>
            </div>

            <div
              className="d-flex justify-content-between"
              onClick={dropDown}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                fontWeight: "bold",
                marginTop: "8px",
              }}
            >
              <div style={{ cursor: "pointer" }}>
                {!drop ? (
                  <MdArrowDropDown className="text-primary font-weight-bold" />
                ) : (
                  <MdArrowDropUp className="text-primary font-weight-bold" />
                )}
                Services Consumed
              </div>
              <div>Sub Total: {formatNumber(total || 0)}</div>
            </div>
            {transData.length && drop && (
              <CustomTable
                bordered
                size="sm"
                hover
                fields={fields}
                data={transData}
              />
            )}
            {/* <div
              // className="d-flex justify-content-between"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                fontWeight: "bold",
                marginTop: "8px",
              }}
              onClick={dropDowns}
            >
              <div style={{ cursor: "pointer" }}>
                {!drops ? (
                  <MdArrowDropDown className="text-primary" />
                ) : (
                  <MdArrowDropUp className="text-primary" />
                )}
                Lab Tests
              </div>
              <div>Total: 900,000</div>
            </div>
            {drops && (
              <CustomTable
                bordered
                size="sm"
                hover
                fields={_fields}
                data={[]}
              />
            )} */}
            <div
              className="d-flex justify-content-between"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                fontWeight: "bold",
                marginTop: "8px",
              }}
            >
              <div>Total</div>
              <div>{formatNumber(lastTotal || 0)}</div>
            </div>
          </PrintWrapper>
        </div>

        <iframe
          title="print_admission_bill"
          name="print_frame"
          width="0"
          height="0"
          src="about:blank"
        />

        {/* <div className="my-1">
          <h6>Billing Information</h6>
          <CustomTable fields={fields} data={bill} size="sm" bordered />
        </div> */}
        {/* {JSON.stringify(bill)} */}
      </CardBody>
      <CardFooter>
        <CustomButton color="success" onClick={printBill}>
          Print Bill
        </CustomButton>
        <CustomButton loading={loading} onClick={completeDischarge}>
          Proceed
        </CustomButton>
      </CardFooter>
    </Card>
  );
}

export default DischargeWarningCard;
