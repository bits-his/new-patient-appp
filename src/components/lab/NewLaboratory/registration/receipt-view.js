import React from "react";
import { useSelector } from "react-redux";
import { Row, Col, CardBody } from "reactstrap";
import { FaTimes } from "react-icons/fa";
import { PDFViewer } from "@react-pdf/renderer";
// import Loading from "../../../comp/components/Loading";

// import SamplingDetails from "../../../comp/pdf-templates/lab-sampling-details";
import LabReceipt from "../../../comp/pdf-templates/lab/receipts/combined-receipt-sample";

// import PrintBarcode from "../../PrintBarcode";

function ReceiptView({
  name = "",
  close = (f) => f,
  data = [],
  totalDiscount = 0,
  transactionInfo = {},
  patientInfo = {},
  labels = [],
  receiptDisplayed,
}) {
  const user = useSelector((state) => state.auth.user);
  const facilityInfo = useSelector((state) => state.facility.info);

  return (
    <CardBody>
      <div style={{ float: "right" }}>
        <button className="btn btn-danger" onClick={close}>
          <FaTimes />
          Close
        </button>
      </div>
      <Row>
        <Col md={12}>
          {/* {JSON.stringify({ transactionInfo })} */}
          <center>
            <PDFViewer height="600" width="500">
              <LabReceipt
                transactionInfo={transactionInfo}
                name={transactionInfo.name}
                data={receiptDisplayed}
                // total={transactionInfo.totalAmount}
                discount={totalDiscount}
                receiptNo={transactionInfo.receiptno}
                modeOfPayment={transactionInfo.modeOfPayment}
                cashier={`${user.firstname} ${user.lastname}`}
                patientInfo={patientInfo}
                labels={labels}
                facilityInfo={facilityInfo}
                user={user}
                type="Now"
              />
            </PDFViewer>
          </center>
        </Col>
        {/*   <Col>

         <PrintBarcode patientInfo={""} labels={labels} type="Now" />
        </Col>*/}
      </Row>
    </CardBody>
  );
}

export default ReceiptView;
