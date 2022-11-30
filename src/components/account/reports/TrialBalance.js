import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table } from "reactstrap";
import { apiURL } from "../../../redux/actions";
import { convertSignedMoney, formatNumber } from "../../utils/helpers";

export default function TrialBalance({ start, end }) {
  const facilityId = useSelector((state) => state.auth.user.facilityId);
  const facilityInfo = useSelector((state) => state.facility.info);
  const [grandTotal, setGrandTotal] = useState([]);
  const [
    formattedFinancialStatement,
    setFormattedFinancialStatement,
  ] = useState([]);
  // const [signedDivision, setSignedDivision] = useState([])

  const getTrialBalance = useCallback(
    () => {
      fetch(
        `${apiURL()}/account/report/by-type/trialbalance/${start}/${end}/${facilityId}`
      )
        .then((raw) => raw.json())
        .then((data) => {
          if (data.success) {
            // setFinancialStatement(data.results)
            let results = data.results;
            let final = {};
            results.forEach((item) => {
              if (parseInt(item.credit)===0 && parseInt(item.debit) === 0) {
                console.log('.')
              } else if (Object.keys(final).includes(item.description)) {
                final[item.description] = [...final[item.description], item];
              } else {
                final[item.description] = [item];
              }
            });

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
            setGrandTotal({
              description: "Total",
              debit: _signedDivision.reduce((a, b) => a + parseInt(b.debit), 0),
              credit: _signedDivision.reduce(
                (a, b) => a + parseInt(b.credit),
                0
              ),
            });
          }
        })
        .catch((err) => console.log(err));
    },
    [start, end, facilityId]
  );

  useEffect(
    () => {
      getTrialBalance();
    },
    [getTrialBalance]
  );

  return (
    <div className="print-start">
      <div className="print-only">
        <h3 className="text-center">{facilityInfo.facility_name}</h3>
        <h5 className="text-center">
          TRIAL BALANCE AS AT {moment(end).format("DD-MM-YYYY")}
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
          {
            <>
              <tr>
                <td className="font-weight-bold" colSpan={3}>
                  <u>ASSETS</u>
                </td>
              </tr>
              {Object.keys(formattedFinancialStatement)
                .filter((i) => i.toLowerCase().includes("asset"))
                .map((head) => (
                  <>
                    <tr>
                      <td className="font-weight-bold" colSpan={3}>
                        <u>{head}</u>
                      </td>
                    </tr>
                    {formattedFinancialStatement[head].map((item, index) => (
                      <tr key={index}>
                        <td>{item.des}</td>
                        <td className="text-right">
                          {item.subhead &&
                          (item.subhead.toString().substr(0, 4) === "5000" ||
                            item.subhead.toString().substr(0, 4) === "2000")
                            ? "-"
                            : convertSignedMoney(item.debit)}
                        </td>
                        <td className="text-right">
                          {item.subhead &&
                          (item.subhead.toString().substr(0, 4) === "4000" ||
                            item.subhead.toString().substr(0, 4) === "3000")
                            ? "-"
                            : convertSignedMoney(Math.abs(item.credit))}
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
            </>
          }
          {
            <>
              <tr>
                <td className="font-weight-bold" colSpan={3}>
                  <u>EQUITY & LIABILITIES</u>
                </td>
              </tr>
              {Object.keys(formattedFinancialStatement)
                .filter(
                  (i) =>
                    i.toLowerCase().includes("equity") ||
                    i.toLowerCase().includes("liability")
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
                        <td>{item.des}</td>
                        <td className="text-right">
                          {item.subhead &&
                          (item.subhead.toString().substr(0, 4) === "5000" ||
                            item.subhead.toString().substr(0, 4) === "2000")
                            ? "-"
                            : convertSignedMoney(item.debit)}
                        </td>
                        <td className="text-right">
                          {item.subhead &&
                          (item.subhead.toString().substr(0, 4) === "4000" ||
                            item.subhead.toString().substr(0, 4) === "3000")
                            ? "-"
                            : convertSignedMoney(Math.abs(item.credit))}
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
            </>
          }
          {
            <>
              <tr>
                <td />
                <td />
              </tr>
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
                        <td>{item.des}</td>
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
            </>
          }

          <tr>
            <td className="font-weight-bold">{grandTotal.description}</td>
            <td className="text-right font-weight-bold">
              {grandTotal.debit && `₦${formatNumber(grandTotal.debit)}`}
            </td>
            <td className="text-right font-weight-bold">
              {grandTotal.credit &&
                `₦${formatNumber(Math.abs(grandTotal.credit))}`}
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
