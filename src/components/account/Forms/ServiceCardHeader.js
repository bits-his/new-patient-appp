import React from "react";
import { CardHeader } from "reactstrap";
// import { ShortcutGuide } from '../../pharmacy/ItemsList';
const ServiceCardHeader = ({ serviceDetails }) => {
  return (
    <CardHeader tag="div">
      {/* <h5>Drug Sale1</h5> */}

      <div>
        <ShortcutGuide />
        <span style={{ marginRight: 5, fontWeight: "bold" }}>Receipt No:</span>
        <span>{serviceDetails.receiptNo ? serviceDetails.receiptNo : ""}</span>
      </div>
    </CardHeader>
  );
};
export default ServiceCardHeader;
export function ShortcutGuide({ edit = true }) {
  return (
    <div className="d-flex">
      <h6 className="my-0 mr-2">
        <u>Shortcut Keys</u>:
      </h6>
      <h6 className="my-0 text-success mr-2">"Press Enter Key"= Add to Cart</h6>
      {edit ? (
        <h6 className="my-0 text-danger mr-2">"Press E Key"= Edit</h6>
      ) : null}
      <h6 className="my-0 text-info">"Press F2 Key"= Checkout</h6>
    </div>
  );
}

export function LabRegShortcuts({ edit = true }) {
  return (
    <div className="d-flex flex-direction-row justify-content-center">
      <span className="font-weight-bold my-0 mr-2">
        <u>Shortcut Keys</u>:
      </span>
      <span className="font-weight-bold my-0 text-success mr-4">
        "Press F10 Key"= Save & Checkout
      </span>
      <span className="font-weight-bold my-0 text-info mr-4">
        "Press F8 Key"= Search
      </span>
      {edit ? (
        <span className="font-weight-bold my-0 text-danger mr-2">
          "Press esc Key"= Close
        </span>
      ) : null}
    </div>
  );
}

export function LabReceptionDashShortcuts() {
  return (
    <div className="d-flex flex-direction-row justify-content-center">
      <span className="font-weight-bold my-0 mr-2">
        <u>Shortcut Keys</u>:
      </span>

      <span className="font-weight-bold my-0 text-info mr-4">
        "F8 Key"= Search Sample List
      </span>

      <span className="font-weight-bold my-0 text-success mr-4">
        "F9 Key"= Search Patients List
      </span>

      <span className="font-weight-bold my-0 text-danger mr-2">
        "F10 Key"= Refresh
      </span>
    </div>
  );
}

export function LabAnalysisDashShortcuts() {
  return (
    <div className="d-flex flex-direction-row justify-content-center">
      <span className="font-weight-bold my-0 mr-2">
        <u>Shortcut Keys</u>:
      </span>

      <span className="font-weight-bold my-0 text-primary mr-4">
        "F2 Key"= degrees (<sup>o</sup>)
      </span>

      <span className="font-weight-bold my-0 text-warning mr-4">
        "F8 Key"= Search History
      </span>

      <span className="font-weight-bold my-0 text-info mr-4">
        "F9 Key"= Search Pending Requests
      </span>

      <span className="font-weight-bold my-0 text-success mr-4">
        "F10 Key"= Save & Submit
      </span>
      <span className="font-weight-bold my-0 text-danger mr-2">
        "esc Key"= Close
      </span>
    </div>
  );
}
