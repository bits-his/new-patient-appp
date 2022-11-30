import { PDFViewer } from "@react-pdf/renderer";
import moment from "moment";
import React from "react";
import { FaTimes } from "react-icons/fa";
import { Col } from "reactstrap";
import LabReceipt from "../../comp/pdf-templates/lab-receipt-large";
import LabSamplingDetails from "../../comp/pdf-templates/lab-sampling-details";
import PrintBarcode from "../PrintBarcode";

function Preview({
  setPreviewMode,
  previewIsReceipt,
  labReceipt,
  receiptNo,
  patientInfo,
  facilityInfo,
  previewIsBarcode,
  rawList,
  previewIsSampleDetails,
  requestList,
  sampleDetails,
  // onSampleDetailsClick
}) {
  return (
    <Col md={"6"} className="">
      <div className="d-flex flex-direction-row justify-content-between mb-1">
        <h5>Preview</h5>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => setPreviewMode(null)}
        >
          <FaTimes /> Close
        </button>
      </div>

      {previewIsReceipt ? (
        <PDFViewer height="450" width="600">
          <LabReceipt
            // transactionInfo={transactionInfo}
            data={labReceipt}
            receiptNo={receiptNo}
            modeOfPayment={
              labReceipt && labReceipt[0] && labReceipt[0].modeOfPayment
            }
            cashier={labReceipt && labReceipt[0] && labReceipt[0].enteredBy}
            patientInfo={patientInfo}
            type="Later"
            facilityInfo={facilityInfo}
            // user={user}
          />
        </PDFViewer>
      ) : previewIsBarcode ? (
        <PrintBarcode
          labels={rawList.map((i) => ({
            timestamp: `${moment(i.created_at).format("DD")}-${moment(
              i.created_at
            ).format("MM")} (${moment(i.created_at).format("hh:mm")}) - ${
              i.booking_no
            }`,
            type: "test",
            tests: i.test,
            sample: i.specimen,
            noOfLabels: 1,
            code: i.code,
            department: i.department,
          }))}
          type="Later"
          patientInfo={patientInfo}
        />
      ) : previewIsSampleDetails ? (
        <PDFViewer height="450" width="600">
          <LabSamplingDetails
            data={sampleDetails}
            receiptNo={receiptNo}
            modeOfPayment={
              labReceipt && labReceipt[0] && labReceipt[0].modeOfPayment
            }
            cashier={labReceipt && labReceipt[0] && labReceipt[0].enteredBy}
            patientInfo={patientInfo}
            // type="Later"
            facilityInfo={facilityInfo}
            // facilityInfo={facilityInfo}
          />
        </PDFViewer>
      ) : null}
    </Col>
  );
}

export default Preview;
