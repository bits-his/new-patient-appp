import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table } from "reactstrap";
import { apiURL } from "../../../redux/actions";
import { convertSignedMoney, formatNumber } from "../../utils/helpers";

export default function ProfitLoss({ start, end }) {
  const facilityId = useSelector((state) => state.auth.user.facilityId);
  const facilityInfo = useSelector((state) => state.facility.info);

  const [grandTotal, setGrandTotal] = useState([]);
// const [totalCre, setTotalCre] = useState('')
// const [totalDeb, setTotalDeb] = useState('')

  const [
    formattedFinancialStatement,
    setFormattedFinancialStatement,
  ] = useState([]);

  const getProfitLossStatement = useCallback(
    () => {
      fetch(
        `${apiURL()}/account/report/by-type/profitloss/${start}/${end}/${facilityId}`
      )
        .then((raw) => raw.json())
        .then((data) => {
          if (data.success) {
            // setFinancialStatement(data.results)
            let results = data.results;
            // console.log(results)

            // create an empty object
            let final = {};

            // destructure the data into its subhead
            results.forEach((item) => {
              if (Object.keys(final).includes(item.description)) {
                final[item.description] = [...final[item.description], item];
              } else {
                final[item.description] = [item];
              }
            });
            console.log(final)

            Object.keys(final).forEach((head) => {
              final[head] = [
                ...final[head],
                {
                  des: `Total ${head}`,
                  subhead: final[head][0].subhead,
                  debit: final[head].reduce(
                    (a, b) => a + Math.abs(parseInt(b.debit)),
                    0
                  ),
                  credit: final[head].reduce(
                    (a, b) => a + Math.abs(parseInt(b.credit)),
                    0
                  ),
                },
              ];
            });

            // console.log(final);
            setFormattedFinancialStatement(final);

            let _signedDivision = [];
            results.forEach((i) => {
              _signedDivision.push({
                ...i,
                debit: parseInt(i.debit) > 0 ? i.debit : 0,
                credit: parseInt(i.credit) < 0 ? i.credit : 0,
              });
            });
            // setSignedDivision(_signedDivision)
            let _total = {
              description: "Total",
              debit: _signedDivision.reduce((a, b) => a + parseInt(b.debit), 0),
              credit: _signedDivision.reduce(
                (a, b) => a + parseInt(b.credit),
                0
              ),
            };
            setGrandTotal(_total);
            // setTotalCre(results.reduce((a,b) => a + parseFloat(b.credit)))
            // setTotalDeb(results.reduce((a,b) => a + parseFloat(b.debit)))
            // console.log(_total);
          }
        })
        .catch((err) => console.log(err));
    },
    [start, end, facilityId]
  );

  useEffect(
    () => {
      getProfitLossStatement();
    },
    [getProfitLossStatement]
  );

  const netProfit =
    Math.abs(parseInt(grandTotal.credit)) -
    Math.abs(parseInt(grandTotal.debit));



  // const _totalRev = ''
  return (
    <div className="print-start">
      <div className="print-only">
        <h3 className="text-center">{facilityInfo.facility_name}</h3>
        <h5 className="text-center">
          STATEMENT OF PROFIT OR LOSS AS AT {moment(end).format("DD-MM-YYYY")}
        </h5>
      </div>

      <Table striped size="sm">
        <thead>
          <tr>
            <th className="text-center">Description</th>
            <th className="text-center" />
            <th className="text-center" />
          </tr>
        </thead>
        <tbody>
          {Object.keys(formattedFinancialStatement)
            .filter(
              (i) =>
                !i.toLowerCase().includes("equity") &&
                !i.toLowerCase().includes("liability") &&
                !i.toLowerCase().includes("asset")
            )
            .map((head) => (
              <>
                <tr>
                  <td className="font-weight-bold" colSpan={3}>
                    <u>{head}</u>
                  </td>
                </tr>
                {formattedFinancialStatement[head].map((item, index) => (
                  <tr key={index}>
                    <td className=''>{item.des}</td>
                    <td className="text-right">
                      {item.subhead &&
                      (item.subhead.toString().substr(0, 4) === "5000" ||
                        item.subhead.toString().substr(0, 4) === "2000")
                        ? "-"
                        : formatNumber(Math.abs(item.debit))}
                    </td>
                    <td className="text-right">
                      {item.subhead &&
                      (item.subhead.toString().substr(0, 4) === "4000" ||
                        item.subhead.toString().substr(0, 4) === "3000")
                        ? "-"
                        : formatNumber(Math.abs(item.credit))}
                    </td>
                  </tr>
                ))}
              </>
            ))}

          <tr>
            <th>{grandTotal.description}</th>
            <th className="text-right">
              {grandTotal.debit && `₦${formatNumber(grandTotal.debit)}`}
            </th>
            <th className="text-right">
              {/* {grandTotal.credit &&
                `₦${formatNumber(Math.abs(grandTotal.credit))}`} */}
            </th>
          </tr>
          <tr>
            <th colSpan={2}>Net Profit</th>
            <th className="text-right">
              {netProfit && `₦${convertSignedMoney(netProfit)}`}
            </th>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
