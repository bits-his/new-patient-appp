import React, { useState } from 'react';
import { connect, useSelector } from 'react-redux';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Table,
  InputGroup,
  InputGroupAddon,
} from 'reactstrap';
import {
  today,
  // formatNumber,
  // toCamelCase,
  // appendNameToTxnData,
  // _warningNotify,
} from '../utils/helpers';
import { Scrollbars } from 'react-custom-scrollbars';
import { PDFViewer } from '@react-pdf/renderer';
import { AccountReportDoc } from '../comp/pdf-templates/general-account-report';
import { FaTimes } from 'react-icons/fa';
import Loading from '../loading';
import { IoMdDownload } from 'react-icons/io';
import {
  getAccHeads,
  getGeneralReportByDate,
  getGeneralReportByAccHead,
  getRevenueReport,
  getRevenueReportByAccHead,
  getExpenditureReport,
  getExpenditureReportByAccHead,
} from '../../redux/actions/transactions';
import RevenueReport from './reports/Revenue';
import RevenueReportTemplate from '../comp/pdf-templates/revenue-report';
import ExpenditureReport from './reports/Expenditure';
import ExpenditureReportTemplate from '../comp/pdf-templates/expenditure-report';
import Report from './Report';
import { getTxnSummaryReport } from '../../redux/actions/account';
import { Typeahead } from 'react-bootstrap-typeahead';
// import { apiURL } from '../../redux/actions';

function AccountReport(props) {
  const [state, setState] = useState({
    alltransactions: [],
    transactionsLoading: false,
    modalIsOpen: false,
    filterText: '',
    preview: false,
    requestedData: [],
    queryForm: {
      from: today,
      to: today,
    },
    table: 'General',
  });
  const [revenueReport, ] = useState([])
  const [expenditureReport, ] = useState([])
  const [generalAccReportLoading, ] = useState(false)
  const facilityInfo = useSelector(state => state.facility)

  // componentDidMount() {
  //   // const from = moment(state.queryForm.from).format('YYYY-MM-DD');
  //   // const to = moment(state.queryForm.to).format('YYYY-MM-DD');
  //   const { from, to } = state.queryForm;
  //   props.getAccHeads();
  //   props.getGeneralReportByDate(from, to);
  //   props.getRevenueReport(from, to);
  //   props.getExpenditureReport(from, to);
  // }

  // const getAllTransactions = () => {
  //   setState((p) => ({ ...p, transactionsLoading: true }));
  //   let cachedTransactionList =
  //     JSON.parse(localStorage.getItem('transactions')) || [];
  //   setState((p) => ({
  //     ...p,
  //     alltransactions: cachedTransactionList,
  //     transactionsLoading: false,
  //   }));

  //   fetch(`${apiURL()}/transactions/all`)
  //     .then((raw) => raw.json())
  //     .then(({ results }) => {
  //       if (results.length) {
  //         appendNameToTxnData(results, (data) => {
  //           localStorage.setItem('transactions', JSON.stringify(data));
  //           setState((p) => ({ ...p, alltransactions: data, loading: false }));
  //         });
  //       }
  //     })
  //     .catch((err) => {
  //       _warningNotify(err.toString());
  //       setState((p) => ({ ...p, transactionsLoading: false }));
  //     });
  // };

  // const toggle = () => {
  //   setState((prevState) => ({
  //     ...prevState,
  //     modalIsOpen: !prevState.modalIsOpen,
  //   }));
  // };

  const handleReportKindChange = (reportKind) => {
    // let reportKind = e.target.value;
    console.log(reportKind);
    const { from, to } = state.queryForm;
    switch (reportKind) {
      case 'Revenue': {
        props.getRevenueReport(from, to);
        setState(p=>({...p, table: 'Revenue' }));
        break;
      }

      case 'Expenditure': {
        props.getExpenditureReport(from, to);
        setState(p=>({...p, table: 'Expenditure' }));
        break;
      }

      default: {
        setState(p=>({...p, filterText: reportKind }));
        break;
      }
    }
  };

  const onFromDateChange = ({ target: { name, value } }) => {
    const {
      queryForm: { to },
    } = state;
    props.getGeneralReportByDate(value, to);
    setState((prevState) => ({
      ...prevState,
      queryForm: Object.assign({}, prevState.queryForm, { [name]: value }),
    }));
    // console.log(value, to)
    // fetchReportData(value, to);
  };

  const onToDateChange = ({ target: { name, value } }) => {
    const {
      queryForm: { from },
    } = state;
    props.getGeneralReportByDate(from, value);
    setState((prevState) => ({
      ...prevState,
      queryForm: Object.assign({}, prevState.queryForm, { [name]: value }),
    }));
    // console.log(from, value)
    // fetchReportData(from, value);
  };

  // const handlePrint = (data) => {
  //   setState((p) => ({ ...p, requestedData: data }));
  //   setState((p) => ({ ...p, modalIsOpen: false, preview: true }));
  // };

  const renderTitle = () => {
    const { table } = state;
    switch (table.toLowerCase()) {
      case 'Expenditure':
        return 'Expenditure Report';
      case 'Revenue':
        return 'Revenue Report';
      default:
        return 'General Account Report';
    }
  };

  // const renderTableContent = () => {
  //   const { table, filterText } = state;
  //   const { generalAccReport } = props;
  //   const rows = [];
  //   generalAccReport.length &&
  //     generalAccReport.forEach((transaction, i) => {
  //       if (
  //         transaction.transaction_source
  //           .toLowerCase()
  //           .indexOf(filterText.toLowerCase()) === -1 &&
  //         transaction.description
  //           .toLowerCase()
  //           .indexOf(filterText.toLowerCase()) === -1
  //       ) {
  //         return;
  //       }

  //       rows.push(
  //         <tr key={i}>
  //           <td className="text-right">{transaction.day}</td>
  //           <td>{transaction.mode ? toCamelCase(transaction.mode) : ''}</td>
  //           <td>{transaction.description}</td>
  //           <td className="text-right">{formatNumber(transaction.credit)}</td>
  //           <td className="text-right">{formatNumber(transaction.debit)}</td>
  //           {/* <td className='text-right'>{formatNumber(transaction.bal)}</td> */}
  //         </tr>,
  //       );
  //     });
  //   // switch(table.toLowerCase()) {
  //   //   case 'expenditure': return (

  //   //   );
  //   //   case 'revenue': return 'Revenue Report';
  //   //   default : return 'General Account Report';
  //   // }
  // };

  // const renderTable = () => {
  //   const { table } = state;
  //   // switch (table.toLowerCase()) {
  //   //   case 'expenditure':
  //   //     return renderExpenditureTable();
  //   //   case 'revenue':
  //   //     return renderRevenueTable();
  //   //   default:
  //   //     return renderGeneralReport();
  //   // }
  // };

  const  {
      // alltransactions,
      // modalIsOpen,
      // transactionsLoading,
      filterText,
      preview,
      // requestedData,
      queryForm,
      table,
    } = state;

  const rows = [];
  const prv = [];

  return (
    <div>
      <Card>
        <CardHeader>
          <h5>{renderTitle()}</h5>
          {/* Opening Balance: {openingBalance} */}
        </CardHeader>
        <CardBody>
          <Report />
          {preview ? (
            <div>
              <button
                className="btn btn-danger offset-md-11"
                onClick={() => setState(p=>({...p, preview: false }))}
              >
                <FaTimes />
                <>Close</>
              </button>
              <center>
                <PDFViewer height="900" width="600">
                  <AccountReportDoc
                    data={prv}
                    fromDate={queryForm.from}
                    toDate={queryForm.to}
                    logo={facilityInfo.logo}
                    facilityInfo={facilityInfo}
                  />

                  {table === 'Revenue' && (
                    <RevenueReportTemplate
                      data={revenueReport}
                      fromDate={queryForm.from}
                      toDate={queryForm.to}
                      logo={facilityInfo.logo}
                      facilityInfo={facilityInfo}
                    />
                  )}
                  {table === 'Expenditure' && (
                    <ExpenditureReportTemplate
                      data={expenditureReport}
                      fromDate={queryForm.from}
                      toDate={queryForm.to}
                      logo={facilityInfo.logo}
                      facilityInfo={facilityInfo}
                    />
                  )}
                </PDFViewer>
              </center>
            </div>
          ) : (
            <>
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 d-flex align-items-center">
                  <label className="mr-2 font-weight-bold">From</label>
                  <input
                    className="form-control"
                    name="from"
                    value={queryForm.from}
                    onChange={onFromDateChange}
                    type="date"
                  />
                </div>

                <div className="col-xs-12 col-sm-12 offset-md-4 col-md-4 offset-lg-4 col-lg-4 d-flex align-items-center">
                  <label className="mr-2 font-weight-bold">To</label>
                  <input
                    className="form-control"
                    name="to"
                    value={queryForm.to}
                    onChange={onToDateChange}
                    type="date"
                  />
                </div>
              </div>

              <div className="row" style={{ marginTop: 15 }}>
                <InputGroup className="col-md-7">
                  <Typeahead
                    onInputChange={(filterText) =>
                      setState(p=>({...p, filterText }))
                    }
                    align="justify"
                    labelKey="head"
                    id="services"
                    ref={(ref) => (this.services = ref)}
                    placeholder="General Report"
                    options={['Revenue', 'Expenditure']}
                    onChange={(val) => {
                      if (val.length) {
                        console.log(val[0]);
                        setState(p=>({...p, table: val[0] }));
                        handleReportKindChange(val[0]);
                      }
                    }}
                  />
                  <InputGroupAddon addonType="append">
                    <Button color="primary">Search</Button>
                  </InputGroupAddon>
                </InputGroup>

                <div
                  className="col-md-5"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Button
                    outline
                    color="primary"
                    style={{ marginLeft: 10 }}
                    disabled={!prv.length}
                    onClick={() => setState(p=>({...p, preview: true }))}
                  >
                    <IoMdDownload style={{ marginRight: 5 }} />
                    Download Report
                  </Button>
                </div>
              </div>

              <div style={{ marginTop: 15 }}>
                <Scrollbars>
                  {generalAccReportLoading ? (
                    <Loading />
                  ) : (
                    <>
                      {table === 'General' ? (
                        <Table responsive bordered>
                          <thead>
                            <tr>
                              <th className="text-center">Date</th>
                              <th>Mode of payment</th>
                              <th>Account</th>
                              <th>Description</th>
                              <th className="text-center">Credited (₦)</th>
                              <th className="text-center">Debited (₦)</th>
                              {/* <th className='text-center'>Balance (₦)</th> */}
                            </tr>
                          </thead>
                          <tbody>{rows}</tbody>
                        </Table>
                      ) : null}
                      {table === 'Expenditure' ? (
                        <ExpenditureReport
                          filterText={filterText}
                          expenditureReport={expenditureReport}
                        />
                      ) : null}
                      {table === 'Revenue' ? (
                        <RevenueReport
                          filterText={filterText}
                          revenueReport={revenueReport}
                        />
                      ) : null}
                    </>
                  )}
                </Scrollbars>
                {/* <p>total: {total}</p> */}
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

const mapStateToProps = ({
  transactions: {
    generalAccReport,
    generalAccReportLoading,
    accHeads,
    loadingAccHead,
    revenueReport,
    expenditureReport,
  },
  facility: { info },
}) => ({
  accHeads,
  loadingAccHead,
  generalAccReport,
  generalAccReportLoading,
  revenueReport,
  expenditureReport,
  facilityInfo: info,
});

const mapDispatchToProps = (dispatch) => ({
  getAccHeads: () => dispatch(getAccHeads()),
  getAccSummary: (x, y) => dispatch(getTxnSummaryReport(x, y)),
  getGeneralReportByDate: (x, y) => dispatch(getGeneralReportByDate(x, y)),
  getGeneralReportByAccHead: () => dispatch(getGeneralReportByAccHead()),
  getRevenueReport: (x, y) => dispatch(getRevenueReport(x, y)),
  getRevenueReportByAccHead: (x, y, z) =>
    dispatch(getRevenueReportByAccHead(x, y, z)),
  getExpenditureReport: (x, y) => dispatch(getExpenditureReport(x, y)),
  getExpenditureReportByAccHead: (x, y, z) =>
    dispatch(getExpenditureReportByAccHead(x, y, z)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountReport);
