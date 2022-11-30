import React from "react";
// import { useSelector } from "react-redux";
import { Table } from "reactstrap";
import { formatNumber } from "../../utils/helpers";

const ViewAdditionalExpenses = ({ list = [] }) => {
    let totalExpenses = list.reduce((a, b) =>  a + parseFloat(b.amount), 0);

  if(!list.length) return <p className='py-2'><i>No Additional Expenses</i></p>
  return (
    <>
      <div className="d-flex flex-row justify-content-between">
        <h6>Additional Expenses</h6>
        <h6 className='text-right'>Total Additional Expenses: {formatNumber(totalExpenses)}</h6>
      </div>
      <Table bordered size='sm'>
        <thead>
          <tr>
            <th className="text-center">Description</th>
            <th className="text-center">Amount</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item, key) => (
            <tr key={key}>
              <td>{item.description}</td>
              <td className="text-right">{formatNumber(item.amount)}</td>
            </tr>
          ))}
          <tr>
            <th className="text-right">Total Expenses</th>
            <th className="text-right">{formatNumber(totalExpenses)}</th>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default ViewAdditionalExpenses;
