import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CardBody, Table } from "reactstrap";
import { apiURL } from "../../../redux/actions";
import { formatNumber } from "../../utils/helpers";
// import { PDFViewer } from "@react-pdf/renderer";
// import FinancialPositionPDF from "../../comp/pdf-templates/accounts/financial-stmt";
import moment from "moment";

export default function FinancialPosition({ start, end }) {
  const facilityId = useSelector((state) => state.auth.user.facilityId);
  const facilityInfo = useSelector((state) => state.facility.info);

  const [grandTotal, setGrandTotal] = useState([]);
  const [
    formattedFinancialStatement,
    setFormattedFinancialStatement,
  ] = useState([]);

  const getFinancialPosition = useCallback(
    () => {
      fetch(
        `${apiURL()}/account/report/financial-position/${start}/${end}/${facilityId}`
      )
        .then((raw) => raw.json())
        .then((data) => {
          if (data.success) {
            // setFinancialStatement(data.results)
            let results = data.results;
            let final = {};
            results.forEach((item) => {
              if (Object.keys(final).includes(item.description)) {
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

  // const getRetainedEarnings = useCallback(
  //   () => {
  //     fetch(
  //       `${apiURL()}/account/report/profit-loss-statement/${start}/${end}/${facilityId}`
  //     )
  //       .then((raw) => raw.json())
  //       .then((data) => {
  //         if (data.success) {
  //           // setFinancialStatement(data.results)
  //           let results = data.results;
  //           let final = {};
  //           results.forEach((item) => {
  //             if (Object.keys(final).includes(item.description)) {
  //               final[item.description] = [...final[item.description], item];
  //             } else {
  //               final[item.description] = [item];
  //             }
  //           });

  //           Object.keys(final).forEach((head) => {
  //             final[head] = [
  //               ...final[head],
  //               {
  //                 des: `Total ${head}`,
  //                 subhead: final[head][0].subhead,
  //                 debit: final[head].reduce(
  //                   (a, b) => a + Math.abs(parseInt(b.debit)),
  //                   0
  //                 ),
  //                 credit: final[head].reduce(
  //                   (a, b) => a + Math.abs(parseInt(b.credit)),
  //                   0
  //                 ),
  //               },
  //             ];
  //           });

  //           // console.log(final)
  //           setFormattedFinancialStatement(final);

  //           let _signedDivision = [];
  //           results.forEach((i) => {
  //             _signedDivision.push({
  //               ...i,
  //               debit: parseInt(i.debit) > 0 ? i.debit : 0,
  //               credit: parseInt(i.credit) < 0 ? i.credit : 0,
  //             });
  //           });
  //           // setSignedDivision(_signedDivision)
  //           let _total = {
  //             description: "Total",
  //             debit: _signedDivision.reduce((a, b) => a + parseInt(b.debit), 0),
  //             credit: _signedDivision.reduce(
  //               (a, b) => a + parseInt(b.credit),
  //               0
  //             ),
  //           };
  //           setGrandTotal(_total);
  //           console.log(_total);
  //         }
  //       })
  //       .catch((err) => console.log(err));
  //   },
  //   [start, end, facilityId]
  // );

  useEffect(
    () => {
      getFinancialPosition();
    },
    [getFinancialPosition]
  );

  const showPosition = (amt) => {
    if (parseInt(amt) < 0) return `(${formatNumber(Math.abs(amt))})`;
    else if (parseInt(amt) > 0) return `${formatNumber(amt)}`;
  };

  return (
    <CardBody className="print-start">
      <div className="print-only">
        <h3 className="text-center">{facilityInfo.facility_name}</h3>
        <h5 className="text-center">
          STATEMENT OF FINANCIAL POSITION AS AT{" "}
          {moment(end).format("DD-MM-YYYY")}
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
                            : showPosition(item.debit)}
                        </td>
                        <td className="text-right">
                          {item.subhead &&
                          (item.subhead.toString().substr(0, 4) === "4000" ||
                            item.subhead.toString().substr(0, 4) === "3000")
                            ? "-"
                            : showPosition(Math.abs(item.credit))}
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
                            : showPosition(item.debit)}
                        </td>
                        <td className="text-right">
                          {item.subhead &&
                          (item.subhead.toString().substr(0, 4) === "4000" ||
                            item.subhead.toString().substr(0, 4) === "3000")
                            ? "-"
                            : showPosition(Math.abs(item.credit))}
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
    </CardBody>
  );
}
