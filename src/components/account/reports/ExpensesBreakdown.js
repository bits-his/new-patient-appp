import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Table } from "reactstrap";
import { apiURL } from "../../../redux/actions";
import { formatNumber } from "../../utils/helpers";

export default function ExpensesBreakdown({ noClient, start, end }) {
  const facilityId = useSelector((state) => state.auth.user.facilityId);
  const facilityInfo = useSelector((state) => state.facility.info);

  //   const [grandTotal, setGrandTotal] = useState([]);
  const [expensesBreakdown, setExpensesBreakdown] = useState([]);

  const [head_list, setHead_list] = useState({});

  // const onlyUnique = (value, index, self) => {
  //   return self.modeOfPayment.indexOf(value) === index;
  // }
  const getExpensesBreakdown = useCallback(() => {
    fetch(
      `${apiURL()}/account/report/by-type/expenses/${start}/${end}/${facilityId}`
    )
      .then((raw) => raw.json())
      .then((data) => {
        if (data.success) {
          setExpensesBreakdown(data.results);
          data.results.map((a) => setHead_list({ [a.modeOfPayment]: [] }));

          // setFinancialStatement(data.results)
          // let results = data.results;
          // let final = {};
          // results.forEach((item) => {
          //   if (Object.keys(final).includes(item.description)) {
          //     final[item.description] = [...final[item.description], item];
          //   } else {
          //     final[item.description] = [item];
          //   }
          // });

          // Object.keys(final).forEach((head) => {
          //   final[head] = [
          //     ...final[head],
          //     {
          //       des: `Total ${head}`,
          //       subhead: final[head][0].subhead,
          //       debit: final[head].reduce(
          //         (a, b) => a + Math.abs(parseInt(b.debit)),
          //         0
          //       ),
          //       credit: final[head].reduce(
          //         (a, b) => a + Math.abs(parseInt(b.credit)),
          //         0
          //       ),
          //     },
          //   ];
          // });

          // console.log(final);
          // setFormattedFinancialStatement(final);

          // let _signedDivision = [];
          // results.forEach((i) => {
          //   _signedDivision.push({
          //     ...i,
          //     debit: parseInt(i.debit) > 0 ? i.debit : 0,
          //     credit: parseInt(i.credit) < 0 ? i.credit : 0,
          //   });
          // });
          // // setSignedDivision(_signedDivision)
          // let _total = {
          //   description: "Total",
          //   debit: _signedDivision.reduce((a, b) => a + parseInt(b.debit), 0),
          //   credit: _signedDivision.reduce(
          //     (a, b) => a + parseInt(b.credit),
          //     0
          //   ),
          // };
          // setGrandTotal(_total);
          // console.log(_total);
        }
      })
      .catch((err) => console.log(err));
  }, [start, end, facilityId]);

  useEffect(() => {
    getExpensesBreakdown();
  }, [getExpensesBreakdown]);
  const history = useHistory();

  const totalExpenses = expensesBreakdown.reduce((a, b) => a + b.debit, 0);
  return (
    <div className="print-start">
      <div className="print-only">
        <h3 className="text-center">{facilityInfo.facility_name}</h3>
        <h5 className="text-center">
          EXPENSES ({moment(start).format("DD-MM-YYYY")} -{" "}
          {moment(end).format("DD-MM-YYYY")})
        </h5>
      </div>
      {/* {JSON.stringify(head_list)} */}
      <Table striped size="sm" bordered={!noClient}>
        <thead>
          <tr>
            {noClient ? null : <th className="text-center">Date</th>}
            <th className="text-center">Description</th>
            {noClient ? null : <th className="text-center">Collected By</th>}
            <th className="text-center">Amount (₦)</th>
          </tr>
        </thead>
        <tbody>
          {expensesBreakdown.map((item, index) => (
            <tr
              key={index}
              style={{ cursor: "pointer" }}
              onClick={() =>
                history.push(
                  `/me/account/details-expenses?receiptNo=${item.receiptDateSN}&description=${item.description}`
                )
              }
            >
              {noClient ? null : <td>{item.transaction_date}</td>}
              <td>{item.description}</td>
              {noClient ? null : <td className="">{item.client_acct}</td>}
              <td className="text-right">{formatNumber(item.debit)}</td>
            </tr>
          ))}

          <tr>
            <th colSpan={noClient ? "" : 3} className="text-right">
              Total
            </th>
            <th className="text-right">
              {totalExpenses && `₦${formatNumber(totalExpenses)}`}
            </th>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
