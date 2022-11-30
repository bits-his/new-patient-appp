import React from 'react';
import { Table } from 'reactstrap';
import { connect } from 'react-redux';
import {
  getRevenueReport,
  getRevenueReportByAccHead,
} from '../../../redux/actions/transactions';
import { formatNumber, toCamelCase } from '../../utils/helpers';

function RevenueReport({ filterText='', revenueReport=[] }) {
  // const rows=[]
  // const prv = [];
  // revenueReport.length && revenueReport.forEach((transaction, i) => {
  //     if(transaction.description.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
  //       return
  //     }
  //     prv.push(transaction)
  //     rows.push(
  //         <tr key={i}>
  //         <td  className='text-right'>
  //             {transaction.date}
  //         </td>
  //         <td>{transaction.mode ? toCamelCase(transaction.mode) : ''}</td>
  //         <td>{transaction.description}</td>
  //         <td className='text-right'>{formatNumber(transaction.amount)}</td>
  //         <td className='text-right'>{transaction.services}</td>
  //     </tr>
  //     )
  // })

  return (
    <Table responsive bordered>
      <thead>
        <tr>
          <th className="text-center">Date</th>
          <th>Mode of payment</th>
          <th>Account</th>
          <th>Description</th>
          <th className="text-center">Credited (₦)</th>
          <th className="text-center">Debited (₦)</th>
        </tr>
      </thead>
      <tbody>
        {revenueReport &&
          revenueReport.map((transaction, i) => (
            <tr key={i}>
              <td>{transaction.date}</td>
              <td>{transaction.mode ? toCamelCase(transaction.mode) : ''}</td>
              <td>{transaction.Account_Head}</td>
              <td>{transaction.description}</td>
              <td className="text-right">{formatNumber(transaction.debit)}</td>
              <td className="text-right">{formatNumber(transaction.credit)}</td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
}

const mapStateToProps = ({
  transactions: {
    revenueReport,
    generalAccReportLoading,
    accHeads,
    loadingAccHead,
  },
}) => ({
  accHeads,
  loadingAccHead,
  revenueReport,
});

const mapDispatchToProps = (dispatch) => ({
  getExpenditureReport: (x, y) => dispatch(getRevenueReport(x, y)),
  getExpenditureReportByAccHead: (x, y, z) =>
    dispatch(getRevenueReportByAccHead(x, y, z)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RevenueReport);
