import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import { useHistory } from "react-router";
import { Table } from "reactstrap";
import { apiURL } from "../../../../redux/actions";
import { formatNumber } from "../../../utils/helpers";

export default function PendingIncome({
  reportType = "",
  start = "",
  end = "",
  reportBy = "All Records",
}) {
  const user = useSelector((state) => state.auth.user);
  const facilityInfo = useSelector((state) => state.facility.info);

  //   const [grandTotal, setGrandTotal] = useState([]);
  const [patientIncome, setPatientIncome] = useState([]);

  const getPatientIncome = useCallback(
    () => {
      let _report_by = reportBy === "All Records" ? "all" : user.username;
      fetch(
        `${apiURL()}/lab/lab-summary?type=${reportType}&report_by=${_report_by}&from=${start}&to=${end}&facilityId=${
          user.facilityId
        }`
      )
        .then((raw) => raw.json())
        .then((data) => {
          if (data.success && data.results) {
            setPatientIncome(data.results);
          }
        })
        .catch((err) => console.log(err));
    },
    [start, end, user, reportType, reportBy]
  );

  useEffect(
    () => {
      getPatientIncome();
    },
    [getPatientIncome]
  );
  //   const history = useHistory();

//   const total = patientIncome.reduce((a, b) => a + parseFloat(b.debit), 0);
  const totalAmount = patientIncome.reduce((a, b) => a + parseFloat(b.total), 0);
  const totalPaid = patientIncome.reduce((a, b) => a + parseFloat(b.paid), 0);
  const totalBalance = patientIncome.reduce((a, b) => a + parseFloat(b.balance), 0);
  return (
    <div className="print-start">
      <div className="print-only">
        <h3 className="text-center">{facilityInfo.facility_name}</h3>
        <h5 className="text-center">
          Patient Income ({moment(start).format("DD-MM-YYYY")} -{" "}
          {moment(end).format("DD-MM-YYYY")})
        </h5>
      </div>
      {/* <span>Record Count: {patientIncome.length}</span> */}
      <Table striped size="sm" bordered>
        <thead>
          <tr>
            <th className="text-center">S/N</th>
            <th className="text-center">Date</th>
            <th className="text-center">Patient Name</th>
            {/* <th className="text-center">Collected By</th> */}
            <th className="text-center">Total Amount (₦)</th>
            <th className="text-center">Amount Paid (₦)</th>
            <th className="text-center">Balance (₦)</th>
            {/* <th className="text-center">Discount (₦)</th> */}
          </tr>
        </thead>
        <tbody>
          {patientIncome.map((item, index) => (
            <tr
              key={index}
              //   style={{ cursor: "pointer" }}
              //   onClick={() =>
              //     history.push(
              //       `/me/account/details/expenses/${item.receiptDateSN}/${
              //         item.description
              //       }`
              //     )
              //   }
            >
              <td className="text-center">{index + 1}</td>
              <td>{item.createdAt.substr(0, 19)}</td>
              <td>{item.fullname}</td>
              {/* <td className="">{item.client_acct}</td> */}
              <td className="text-right">{formatNumber(item.total)}</td>
              <td className="text-right">{formatNumber(item.paid)}</td>
              <td className="text-right">{formatNumber(item.balance)}</td>
            </tr>
          ))}

          <tr>
            <th colSpan={3} className="text-right">
              Total
            </th>
            <th className="text-right">{totalAmount && `₦${formatNumber(totalAmount)}`}</th>
            <th className="text-right">{totalPaid && `₦${formatNumber(totalPaid)}`}</th>
            <th className="text-right">{totalBalance && `₦${formatNumber(totalBalance)}`}</th>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
