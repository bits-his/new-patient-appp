import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import { useHistory } from "react-router";
import { Table } from "reactstrap";
import { apiURL } from "../../../../redux/actions";
import { formatNumber } from "../../../utils/helpers";

export default function DailyTotal({
  reportType = "",
  start = "",
  end = "",
  reportBy = "All Records",
}) {
  const user = useSelector((state) => state.auth.user);
  const facilityInfo = useSelector((state) => state.facility.info);

  //   const [grandTotal, setGrandTotal] = useState([]);
  const [dailyTotal, setDailyIncome] = useState([]);

  const getDailyTotal = useCallback(
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
            setDailyIncome(data.results);
          }
        })
        .catch((err) => console.log(err));
    },
    [start, end, user, reportType, reportBy]
  );

  useEffect(
    () => {
      getDailyTotal();
    },
    [getDailyTotal]
  );
  //   const history = useHistory();

  const total = dailyTotal.reduce((a, b) => a + parseFloat(b.amount), 0);
  return (
    <div className="print-start">
      <div className="print-only">
        <h3 className="text-center">{facilityInfo.facility_name}</h3>
        <h5 className="text-center">
          Daily Total ({moment(start).format("DD-MM-YYYY")} -{" "}
          {moment(end).format("DD-MM-YYYY")})
        </h5>
      </div>

      <Table striped size="sm" bordered>
        <thead>
          <tr>
            <th className="text-center" rowSpan={2}>
              Date
            </th>
            <th className="text-center" rowSpan={2}>
              Description
            </th>
            <th className="text-center" colSpan={2}>
              Paid (₦)
            </th>
          </tr>
          {/* <tr>
            <th className="text-center">Cash</th>
            <th className="text-center">Bank</th>
          </tr> */}
        </thead>
        <tbody>
          {dailyTotal.map((item, index) => (
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
              <td>{item.createdAt}</td>
              <td className="">{item.Acct_source}</td>
              <td className="text-right">{formatNumber(item.amount)}</td>
            </tr>
          ))}

          <tr>
            <th className="text-right" colSpan={2}>
              Total
            </th>
            <th className="text-right">{total && `₦${formatNumber(total)}`}</th>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
