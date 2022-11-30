import React from 'react';
import { CardBody } from 'reactstrap';
import { FaTimes } from 'react-icons/fa';
import { PDFViewer } from '@react-pdf/renderer';
// import { ServicesReceipt } from '../../comp/pdf-templates/services';
import DrugPurchaseReceipt from '../../comp/pdf-templates/drug-purchase-receipt';

const PdfView = ({
  facilityInfo,
  // billing,
  // bill,
  serviceDetails,
  receivedData,
  name,
  handleClose,
  grandTotal,
  totalDiscount,
  data,
  customerType,
  paymentStatus,
  customerInfo,
}) => {
  return (
    <CardBody>
      <button className="btn btn-danger offset-md-11" onClick={handleClose}>
        <FaTimes />
        <>Close</>
      </button>

      <center>
        <PDFViewer height="900" width="600">
          <DrugPurchaseReceipt
            name={name}
            data={data}
            total={grandTotal}
            discount={totalDiscount}
            receiptNo={receivedData.receiptNo}
            modeOfPayment={serviceDetails.mode}
            cashier={receivedData.user}
            customerType={customerType}
            paymentStatus={paymentStatus}
            customerInfo={customerInfo}
            facilityInfo={facilityInfo}
          />
        </PDFViewer>
      </center>
    </CardBody>
  );
};
export default PdfView;
