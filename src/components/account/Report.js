import React from 'react';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';

const Report = ({ reports }) => {
  return (
    <div>
      <h2>Report</h2>
      {/* <p>{JSON.stringify(reports.summary)}</p> */}
      {reports.summary.income.length ? (
        <SummaryReport data={reports.summary} />
      ) : null}
    </div>
  );
};

// function SuppliersReport({ data = [] }) {
//   return (
//     <div>
//       <Table size="sm">
//         <thead>
//           <tr>
//             <th>S/N</th>
//             <th>Qty</th>
//             <th>Description</th>
//             <th>Rate</th>
//             <th>Amount</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item, index) => (
//             <tr>
//               <td>1</td>
//               <td>10</td>
//               <td>LATEX GLOVE</td>
//               <td>920</td>
//               <td>9200</td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </div>
//   );
// }

function SummaryReport({ data }) {
  const grossProfit =
    parseInt(data.income[data.income.length - 1].amount) -
    parseInt(
      data.expenses['Direct Expenses'][
        data.expenses['Direct Expenses'].length - 1
      ].amount,
    );
  const netProfit =
    grossProfit -
    parseInt(
      data.expenses['Other Expenses'][
        data.expenses['Other Expenses'].length - 1
      ].amount,
    );

  //   let expList = Object.keys(data.expenses);
  return (
    <>
      <Table size="sm">
        <thead>
          <tr>
            <th>Income</th>
            <th>Amount</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.income.map((item, index) => (
            <tr key={index}>
              <td>{index === data.income.length - 1 ? '' : item.income}</td>
              <td className="text-right">
                {index === data.income.length - 1 ? '' : item.amount}
              </td>
              <th className="text-right">
                {index === data.income.length - 1 ? item.amount : ''}
              </th>
            </tr>
          ))}

          <tr>
            <th>Direct Expenses</th>
            <th />
            <th />
          </tr>
          {data.expenses['Direct Expenses'].map((item, index) => (
            <tr key={index}>
              <td>
                {index === data.expenses['Direct Expenses'].length - 1
                  ? ''
                  : item.expenses}
              </td>
              <td className="text-right">
                {index === data.expenses['Direct Expenses'].length - 1
                  ? ''
                  : item.amount}
              </td>
              <th className="text-right">
                {index === data.expenses['Direct Expenses'].length - 1
                  ? item.amount
                  : ''}
              </th>
            </tr>
          ))}
          <tr>
            <th>Gross Profit</th>
            <th />
            <th className="text-right">{grossProfit}</th>
          </tr>

          <tr>
            <th>Other Expenses</th>
            <th />
            <th />
          </tr>
          {data.expenses['Other Expenses'].map((item, index) => (
            <tr key={index}>
              <td>
                {index === data.expenses['Other Expenses'].length - 1
                  ? ''
                  : item.expenses}
              </td>
              <td className="text-right">
                {index === data.expenses['Other Expenses'].length - 1
                  ? ''
                  : item.amount}
              </td>
              <th className="text-right">
                {index === data.expenses['Other Expenses'].length - 1
                  ? item.amount
                  : ''}
              </th>
            </tr>
          ))}
          <tr>
            <th>Net Profit</th>
            <th />
            <th className="text-right">{netProfit}</th>
          </tr>
        </tbody>
      </Table>
    </>
  );
}

function mapStateToProps(state) {
  return {
    reports: state.account.reports,
  };
}

export default connect(mapStateToProps)(Report);
