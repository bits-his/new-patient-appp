import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Table } from "reactstrap";
import { apiURL } from "../../../redux/actions";
import { formatNumber, toCamelCase } from "../../utils/helpers";

export default function RevenueBreakdown({ noClient = false, start, end }) {
  const facilityId = useSelector((state) => state.auth.user.facilityId);
  const facilityInfo = useSelector((state) => state.facility.info);

  //   const [grandTotal, setGrandTotal] = useState([]);
  const [revenueBreakdown, setRevenueBreakdown] = useState([]);

  const [final, setFinal] = useState({});

  const getRevenueBreakdown = useCallback(
    () => {
      fetch(
        `${apiURL()}/account/report/by-type/revenue/${start}/${end}/${facilityId}`
      )
        .then((raw) => raw.json())
        .then((data) => {
          if (data.success) {
            
            setRevenueBreakdown(data.results);
            // setFinancialStatement(data.results)
            let results = data.results;

            results.map(a=>{ setFinal({[toCamelCase(a.modeOfPayment)]:[]})}) 

            // let final = { Cash: [], Bank: [] };
            results.forEach((item) => {
              if (item.modeOfPayment) {
                setFinal((p)=>({...p, [toCamelCase(item.modeOfPayment)] : p[toCamelCase(item.modeOfPayment)]?[...p[toCamelCase(item.modeOfPayment)],item]:[]}));
              }
            });

            // results.forEach((item) => {
            //   if (Object.keys(final).includes(item.modeOfPayment)) {
            //     final[item.modeOfPayment] = [
            //       ...final[item.modeOfPayment],
            //       item,
            //     ];
            //   } else {
            //     final[item.modeOfPayment] = [item];
            //   }
            // });

            Object.keys(final).forEach((head) => {
              final[head] = [
                ...final[head],
                {
                  description: `Total ${head}`,
                  subhead: "",
                  debit: 0,
                  credit: final[head].reduce(
                    (a, b) => a + Math.abs(parseInt(b.credit)),
                    0
                  ),
                },
              ];
            });

            // console.log(final);

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
    },
    [start, end, facilityId]
  );

  useEffect(
    () => {
      getRevenueBreakdown();
    },
    [getRevenueBreakdown]
  );

  const totalRevenue = revenueBreakdown.reduce((a, b) => a + b.credit, 0);
  const history = useHistory();

  return (
    <div className="print-start">
      {noClient ? null : (
        <div className="print-only">
          <h3 className="text-center">{facilityInfo.facility_name}</h3>
          <h5 className="text-center">
            REVENUE ({moment(start).format("DD-MM-YYYY")} -{" "}
            {moment(end).format("DD-MM-YYYY")})
          </h5>
        </div>
      )}
      <Table striped size="sm">
        <thead>
          <tr>
            {noClient ? null : <th className="text-center">Date</th>}
            <th className="text-center">Description</th>
            {noClient ? null : <th className="text-center">Client</th>}
            <th className="text-center">Amount</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(final).length?Object.keys(final).map((head) => (
            <>
              <tr>
                <td className="font-weight-bold" colSpan={noClient ? 2 : 4}>
                  <u>{head.toUpperCase()}</u>
                </td>
              </tr>
              {final[head].map((item, index) => (
                <tr
                  key={index}
                  style={{ cursor: "pointer" }}
                  onClick={() =>  history.push(`/me/account/details?receiptNo=${item.receiptDateSN}&description=${item.description}`) }
                >
                  {noClient ? null : (
                    <td className="text-left">{item.transaction_date}</td>
                  )}
                  <td className="text-left">{item.description}</td>
                  {noClient ? null : (
                    <td className="text-left">{item.patient_id}</td>
                  )}
                  <td className="text-right">{formatNumber(item.credit)}</td>
                </tr>
              ))}
            </>
          )):<h5>N/A</h5>}
          <tr>
            <th colSpan={noClient ? "" : 3} className="text-right">
              Total
            </th>
            <th className="text-right">
              {totalRevenue && `₦${formatNumber(totalRevenue)}`}
            </th>
          </tr>
        </tbody>
      </Table>

      {/* <Table striped size="sm" bordered>
        <thead>
          <tr>
            <th className="text-center">Date</th>
            <th className="text-center">Description</th>
            <th className="text-center">Client</th>
            <th className="text-center">Amount</th>
          </tr>
        </thead>
        <tbody>
          {revenueBreakdown.map((item, index) => (
            <tr key={index}>
              <td>{item.transaction_date}</td>
              <td>{item.description}</td>
              <td className="">{item.patient_id}</td>
              <td className="text-right">{formatNumber(item.credit)}</td>
            </tr>
          ))}

          <tr>
            <th colSpan={3} className="text-right">
              Total
            </th>
            <th className="text-right">
              {totalRevenue && `₦${formatNumber(totalRevenue)}`}
            </th>
          </tr>
        </tbody>
      </Table>
     */}
    </div>
  );
}
