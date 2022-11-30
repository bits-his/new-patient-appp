import React from "react";
import { useSelector } from "react-redux";
import { Table } from "reactstrap";

const OtherExpensesTable = () => {
  const otherExpenses = useSelector((state) => state.pharmacy.otherExpenses);
  let totalExpenses = otherExpenses.reduce((a, b) => a+ parseFloat(b.amount), 0);
  return (
    <Table bordered>
      <thead>
        <tr>
          <th>Description</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {otherExpenses.map((item, key) => (
          <tr key={key}>
            <td>{item.description}</td>
            <td>{item.amount}</td>
          </tr>
        ))}
        <tr>
          <th>Total Expenses</th>
          <th>{totalExpenses}</th>
        </tr>
      </tbody>
    </Table>
  );
};

export default OtherExpensesTable;
