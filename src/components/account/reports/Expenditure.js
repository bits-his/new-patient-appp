import React from 'react';
import { Table } from 'reactstrap';
import { connect } from 'react-redux';
import {
  getExpenditureReport,
  getExpenditureReportByAccHead,
} from '../../../redux/actions/transactions';
import { formatNumber } from '../../utils/helpers';

function ExpenditureReport({ expenditureReport=[], filterText='' }) {
  // const rows=[]
  // const prv = [];
  // expenditureReport.length && expenditureReport.forEach((transaction, i) => {
  //     if(transaction.services.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
  //       return
  //     }
  //     prv.push(transaction)
  //     rows.push(
  //         <tr key={i}>
  //         <td  className='text-right'>
  //         {transaction.date}
  //         </td>
  //         <td>{transaction.services}</td>
  //         <td className='text-right'>{formatNumber(transaction.amount)}</td>
  //         <td className='text-right'>{formatNumber(transaction.bal)}</td>
  //     </tr>
  //     )
  // })

  return (
    <Table responsive bordered>
      <thead>
        <tr>
          <th className="text-center">Date</th>
          <th className="text-center">Account</th>
          <th className="text-center">Description</th>
          <th className="text-center">Credited (₦)</th>
          <th className="text-center">Debited (₦)</th>
        </tr>
      </thead>
      <tbody>
        {expenditureReport &&
          expenditureReport.map((transaction, i) => (
            <tr key={i}>
              <td>{transaction.date}</td>
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
    expenditureReport,
    generalAccReportLoading,
    accHeads,
    loadingAccHead,
  },
}) => ({
  accHeads,
  loadingAccHead,
  expenditureReport,
});

const mapDispatchToProps = (dispatch) => ({
  getExpenditureReport: (x, y) => dispatch(getExpenditureReport(x, y)),
  getExpenditureReportByAccHead: (x, y, z) =>
    dispatch(getExpenditureReportByAccHead(x, y, z)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExpenditureReport);
