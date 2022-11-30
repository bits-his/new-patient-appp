import React, { useEffect, useState } from "react";
import { Container, Table } from "reactstrap";
// import { AiOutlineShareAlt } from "react-icons/ai";
// import CustomButton from "../../../app/components/Button";
import { useSelector } from "react-redux";
// import { formatNumber } from "../../../app/utilities";
import moment from "moment";
import useQuery from "../../../hooks/useQuery";
import { PDFViewer } from "@react-pdf/renderer";
import SalesReceipt from "./SalesReceipt";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { formatNumber } from "../../utils/helpers";
import Loading from "../../comp/components/Loading";
import CustomTable from "../../comp/components/CustomTable";
import CustomButton from "../../comp/components/Button";
import CustomCard from "../../comp/components/CustomCard";
import { getReceiptData } from "../../../redux/actions/pharmacy";

function PostSalePage() {
  const query = useQuery();
  const receiptList = useSelector((state) => state.pharmacy.receiptData);
  const loading = useSelector((state) => state.pharmacy.loading);
  const facilityInfo = useSelector((state) => state.facility.info);
  const { busName, address, phone, username } = useSelector(
    (state) => state.auth.user
  );
  const receiptNo = query.get("transaction_id");
  let total = query.get("total");
  const buyer = query.get("buyer");
  const page = query.get("page");
  // const quantities = query.get('qtys')
  //   const [txnList, setTxnList] = useState([]);
  const [preview, setPreview] = useState(false);
  const dispatch = useDispatch();
  const _getReceiptData = useCallback(() => {
    // setGettingReceipt(true)
    dispatch(getReceiptData(receiptNo));
  }, [dispatch, receiptNo]);
  useEffect(() => {
    setTimeout(() => {
      _getReceiptData();
    }, 2000);
  }, [_getReceiptData]);

  let info = receiptList.length ? receiptList[receiptList.length - 1] : {};
  const operator = useSelector((s) => s.auth.user);

  let totalAmount = receiptList
    .filter((state) => state.acct !== "60000")
    .reduce((a, b) => a + parseFloat(b.amount), 0);
  total = receiptList
    .filter((itm) => itm.acct !== "60000")
    .reduce((a, b) => a + parseInt(b.qty) * parseFloat(b.unitPrice), 0);

  let amountPaid = parseFloat(query.get("amount"));
  let discount = parseFloat(query.get("discount"));
  const modeOfPayment = query.get("payment");
  let grandTotal = parseFloat(totalAmount) - parseFloat(discount);
  let balance = parseFloat(grandTotal - discount) - parseFloat(amountPaid);
  const style = {
    borderRightStyle: "hidden",
    borderLeftStyle: "hidden",
    borderBottomStyle: "hidden",
  };

  const printBtn = () => {
    setPreview((p) => !p);
  };
  console.error({ info });
  const fields = [
    {
      title: "S/N",
      custom: true,
      component: (item, index) => index + 1,
      className: "text-center",
    },
    {
      title: "Drug Name",
      custom: true,
      component: (item) => item.item_name,
      className: "text-left",
    },
    {
      title: "Quantity",
      custom: true,
      component: (item) => (
        <div className="text-center">
          {item.quantity === "0" ? "-" : formatNumber(item.qty)}
        </div>
      ),
    },
    {
      title: "Unit Price (NGN)",
      custom: true,
      component: (item) => (
        <div className="text-right">
          {item.quantity === "0" ? "-" : formatNumber(item.unit_price)}
        </div>
      ),
      className: "text-right",
    },
    {
      title: "Amount (NGN)",
      custom: true,
      component: (item) => (
        <div className="text-right">
          {formatNumber(parseInt(item.qty) * parseInt(item.unit_price))}
        </div>
      ),
      className: "text-right",
    },
  ];

  return (
    <Container className="">
      <CustomCard back header="Transaction Reciept">
        {/* {JSON.stringify(receiptList)} */}
        {!preview ? (
          <>
            <center>
              <h4>{facilityInfo.printTitle}</h4>
              <h5>{facilityInfo.printSubtitle1}</h5>
              <h5>{facilityInfo.printSubtitle2}</h5>
            </center>
            <div>Date: {moment(info.createdAt).format("DD/MM/YYYY HH:mm")}</div>
            <div>Invoice No: {receiptNo}</div>
            <div>Account Name: {buyer === "undefined" ? "Walk-In" : buyer}</div>
            <div>
              Payment Method: {info.modeOfPayment || modeOfPayment || "CASH"}
            </div>
            <div>
              Operator: {operator.username} ({operator.role})
            </div>
            {loading && <Loading size="sm" />}
            <CustomTable fields={fields} data={receiptList} size="sm" />
            <Table bordered size="sm">
              <tr>
                <th colSpan={4} className="text-right" style={style}>
                  Total
                </th>
                <th className="text-right" style={style}>
                  {formatNumber(totalAmount)}
                </th>
              </tr>
              <tr>
                <th colSpan={4} className="text-right" style={style}>
                  Discount
                </th>
                <th className="text-right" style={style}>
                  {formatNumber(discount)}
                </th>
              </tr>

              <tr>
                <th colSpan={4} className="text-right" style={style}>
                  Amount Paid
                </th>
                <th className="text-right" style={style}>
                  {formatNumber(amountPaid)}
                </th>
              </tr>
              <tr>
                <th colSpan={4} className="text-right" style={style}>
                  Grand Total
                </th>
                <th className="text-right" style={style}>
                  {formatNumber(grandTotal)}
                </th>
              </tr>
              {/* <tr>
                <th colSpan={4} className="text-right" style={style}>
                  Balance
                </th>
                <th className="text-right" style={style}>
                  {formatNumber(balance)}
                </th>
              </tr> */}
            </Table>
            <center>
              <CustomButton
                color="primary"
                className="m-2 col-md-2"
                onClick={() => {
                  //   onClick();
                }}
              >
                Pair bluetooth
              </CustomButton>
              <CustomButton
                color="primary"
                className="m-2 col-md-2"
                onClick={() => {
                  printBtn();
                }}
              >
                Print Now
              </CustomButton>
              <CustomButton color="primary" className="col-md-2">
                Share
              </CustomButton>
            </center>
          </>
        ) : (
          <div className="d-flex">
            <PDFViewer height="700" width="1100">
              <SalesReceipt
                data={receiptList}
                total={totalAmount}
                grandTotal={grandTotal}
                balance={balance}
                info={info}
                page={page}
                modeOfPayment={modeOfPayment}
                receiptNo={receiptNo}
                busName={busName}
                cashier={username}
                address={address}
                amountPaid={amountPaid}
                phone={phone}
                facilityInfo={facilityInfo}
                buyer={buyer}
              />
            </PDFViewer>
          </div>
        )}
      </CustomCard>
    </Container>
  );
}
export default PostSalePage;
