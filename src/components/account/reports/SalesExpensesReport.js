import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import { useHistory } from "react-router";
import { Col, Row } from "reactstrap";
import { apiURL } from "../../../redux/actions";
// import { formatNumber } from "../../utils/helpers";
import ExpensesBreakdown from "./ExpensesBreakdown";
import RevenueBreakdown from "./RevenueBreakdown";

export default function ProfitLoss({ start, end }) {
  const facilityId = useSelector((state) => state.auth.user.facilityId);
  const facilityInfo = useSelector((state) => state.facility.info);

  const [, setRevenueList] = useState([]);
  //   const [newRevenueList, setNewRevenueList] = useState({});
  const [, setExpensesList] = useState([]);

  const getRevenue = useCallback(
    () => {
      fetch(
        `${apiURL()}/account/report/by-type/revenue/${start}/${end}/${facilityId}`
      )
        .then((raw) => raw.json())
        .then((data) => {
          if (data.success) {
            setRevenueList(data.results);
            // data.results.forEach(item => {
            //     if(Object.keys(newRevenueList).includes(item.modeOfPayment)){
            //         newRevenueList[item.modeOfPayment] = [...newRevenueList[item.modeOfPayment], item]
            //     } else {

            //     }

            // })
          }
        })
        .catch((err) => console.log(err));
    },
    [start, end, facilityId]
  );
  // const history = useHistory()
  const getExpenses = useCallback(
    () => {
      fetch(
        `${apiURL()}/account/report/by-type/expenses/${start}/${end}/${facilityId}`
      )
        .then((raw) => raw.json())
        .then((data) => {
          if (data.success) {
            setExpensesList(data.results);
          }
        })
        .catch((err) => console.log(err));
    },
    [start, end, facilityId]
  );

  useEffect(
    () => {
      // getRevenue();
      getExpenses();
    },
    [getRevenue, getExpenses]
  );

  // const _totalRevenue = revenueList.reduce(
  //   (a, b) => a + parseFloat(b.credit),
  //   0
  // );
  // const _totalExpenses = expensesList.reduce(
  //   (a, b) => a + parseFloat(b.debit),
  //   0
  // );
  return (
    <div className="print-start">
      <div className="print-only">
        <h3 className="text-center">{facilityInfo.facility_name}</h3>
        <h5 className="text-center">
          SUMMARY OF SALES AND EXPENSES {moment(end).format("DD-MM-YYYY")}
        </h5>
      </div>

      <Row>
        <Col>
          <RevenueBreakdown noClient={true} start={start} end={end} />
          {/* <Table striped size="sm">
            <thead>
              <tr>
                <th className="text-center">Revenue</th>
                <th className="text-center" />
              </tr>
            </thead>
            <tbody>
              {revenueList.map((item, index) => (
                <tr key={index}>
                  <td className="">{item.description}</td>

                  <td className="text-right">{formatNumber(item.credit)}</td>
                </tr>
              ))}

              <tr>
                <th>Total Revenue</th>
                <th className="text-right">{formatNumber(_totalRevenue)}</th>
              </tr>
            </tbody>
          </Table> */}
        </Col>
        <Col>
        <ExpensesBreakdown noClient={true} start={start} end={end} />
          {/* <Table striped size="sm">
            <thead>
              <tr>
                <th className="text-center">Expenses</th>
                <th className="text-center" />
              </tr>
            </thead>
            <tbody>
              {expensesList.map((item, index) => (
                <tr key={index} style={{cursor:"pointer"}}
                onClick={() => history.push(`/me/account/details-expenses?receiptNo=${item.receiptDateSN}&description=${item.description}`)}>
                  <td className="">{item.description}</td>
                  <td className="text-right">{formatNumber(item.debit)}</td>
                </tr>
              ))}
              <tr>
                <th>Total Expenses</th>
                <th className="text-right">{formatNumber(_totalExpenses)}</th>
              </tr>
            </tbody>
          </Table> */}
        </Col>
      </Row>
    </div>
  );
}
