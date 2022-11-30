import React, { Component } from 'react';
import { connect } from 'react-redux';
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
  formatNumber,
  toCamelCase,
  appendNameToTxnData,
  _warningNotify,
} from '../utils/helpers';
// import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import { PDFViewer } from '@react-pdf/renderer';
import { AccountReportDoc } from '../comp/pdf-templates/general-account-report';
import { FaTimes } from 'react-icons/fa';
import Loading from '../loading';
import { IoMdDownload } from 'react-icons/io';
// import { GiSandsOfTime } from 'react-icons/gi';
// import ReportModal from './ReportModal';
import {
  // getGeneralReport,
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
import { apiURL } from '../../redux/actions';

class AccountReport extends Component {
  state = {
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
  };

  componentDidMount() {
    // const from = moment(this.state.queryForm.from).format('YYYY-MM-DD');
    // const to = moment(this.state.queryForm.to).format('YYYY-MM-DD');
    const { from, to } = this.state.queryForm;
    this.props.getAccHeads();
    this.props.getGeneralReportByDate(from, to);
    this.props.getRevenueReport(from, to);
    this.props.getExpenditureReport(from, to);
  }

  getAllTransactions = () => {
    this.setState({ transactionsLoading: true });
    let cachedTransactionList =
      JSON.parse(localStorage.getItem('transactions')) || [];
    this.setState({
      alltransactions: cachedTransactionList,
      transactionsLoading: false,
    });

    fetch(`${apiURL()}/transactions/all`)
      .then((raw) => raw.json())
      .then(({ results }) => {
        if (results.length) {
          appendNameToTxnData(results, (data) => {
            localStorage.setItem('transactions', JSON.stringify(data));
            this.setState({ alltransactions: data, loading: false });
          });
        }
      })
      .catch((err) => {
        _warningNotify(err.toString());
        this.setState({ transactionsLoading: false });
      });
  };

  toggle = () => {
    this.setState((prevState) => ({
      modalIsOpen: !prevState.modalIsOpen,
    }));
  };

  handleReportKindChange = (reportKind) => {
    // let reportKind = e.target.value;
    console.log(reportKind);
    const { from, to } = this.state.queryForm;
    switch (reportKind) {
      case 'Revenue': {
        this.props.getRevenueReport(from, to);
        this.setState({ table: 'Revenue' });
        break;
      }

      case 'Expenditure': {
        this.props.getExpenditureReport(from, to);
        this.setState({ table: 'Expenditure' });
        break;
      }

      default: {
        this.setState({ filterText: reportKind });
        break;
      }
    }
  };

  onFromDateChange = ({ target: { name, value } }) => {
    const {
      queryForm: { to },
    } = this.state;
    this.props.getGeneralReportByDate(value, to);
    this.setState((prevState) => ({
      queryForm: Object.assign({}, prevState.queryForm, { [name]: value }),
    }));
    // console.log(value, to)
    // this.fetchReportData(value, to);
  };

  onToDateChange = ({ target: { name, value } }) => {
    const {
      queryForm: { from },
    } = this.state;
    this.props.getGeneralReportByDate(from, value);
    this.setState((prevState) => ({
      queryForm: Object.assign({}, prevState.queryForm, { [name]: value }),
    }));
    // console.log(from, value)
    // this.fetchReportData(from, value);
  };

  handlePrint = (data) =>
    this.setState({ requestedData: data }, () =>
      this.setState({ modalIsOpen: false, preview: true }),
    );

  renderTitle = () => {
    const { table } = this.state;
    switch (table.toLowerCase()) {
      case 'Expenditure':
        return 'Expenditure Report';
      case 'Revenue':
        return 'Revenue Report';
      default:
        return 'General Account Report';
    }
  };

  renderTableContent = () => {
    const { filterText } = this.state;
    const { generalAccReport } = this.props;
    const rows = [];
    generalAccReport.length &&
      generalAccReport.forEach((transaction, i) => {
        if (
          transaction.transaction_source
            .toLowerCase()
            .indexOf(filterText.toLowerCase()) === -1 &&
          transaction.description
            .toLowerCase()
            .indexOf(filterText.toLowerCase()) === -1
        ) {
          return;
        }

        rows.push(
          <tr key={i}>
            <td className="text-right">{transaction.day}</td>
            <td>{transaction.mode ? toCamelCase(transaction.mode) : ''}</td>
            <td>{transaction.description}</td>
            <td className="text-right">{formatNumber(transaction.credit)}</td>
            <td className="text-right">{formatNumber(transaction.debit)}</td>
            {/* <td className='text-right'>{formatNumber(transaction.bal)}</td> */}
          </tr>,
        );
      });
    // switch(table.toLowerCase()) {
    //   case 'expenditure': return (

    //   );
    //   case 'revenue': return 'Revenue Report';
    //   default : return 'General Account Report';
    // }
  };

  renderTable = () => {
    const { table } = this.state;
    switch (table.toLowerCase()) {
      case 'expenditure':
        return this.renderExpenditureTable();
      case 'revenue':
        return this.renderRevenueTable();
      default:
        return this.renderGeneralReport();
    }
  };

  render() {
    const {
      // toggle,
      handleReportKindChange,
      onFromDateChange,
      onToDateChange,
      props: {
        // generalAccReport,
        generalAccReportLoading,
        revenueReport,
        expenditureReport,
        facilityInfo,
        // accHeads,
      },
      state: {
        // alltransactions,
        // modalIsOpen,
        // transactionsLoading,
        filterText,
        preview,
        // requestedData,
        queryForm,
        table,
      },
    } = this;

    const rows = [];
    const prv = [];
    // const total = generalAccReport.reduce((a,b) => a.debit + b.debit, 0)
    // const openingBalance = generalAccReport[0].bal - (generalAccReport[0].credit +  generalAccReport[0].debit)

    //generalAccReport.length &&
    //   generalAccReport.forEach((transaction, i) => {
    //     if (
    //       transaction.description
    //         .toLowerCase()
    //         .indexOf(filterText.toLowerCase()) === -1
    //     ) {
    //       return;
    //     }
    //     prv.push(transaction);
    //     rows.push(
    //       <tr key={i}>
    //         <td>{transaction.day}</td>
    //         <td>{transaction.mode ? toCamelCase(transaction.mode) : ''}</td>
    //         <td>{transaction.Account_Head}</td>
    //         <td>{transaction.description}</td>
    //         <td className="text-right">{formatNumber(transaction.credit)}</td>
    //         <td className="text-right">{formatNumber(transaction.debit)}</td>
    //         {/* <td className='text-right'>{formatNumber(transaction.bal)}</td> */}
    //       </tr>,
    //     );
    //   });

    return (
      <div>
        <Card>
          <CardHeader>
            <h5>{this.renderTitle()}</h5>
            {/* Opening Balance: {openingBalance} */}
          </CardHeader>
          <CardBody>
            <Report />
            {preview ? (
              <div>
                <button
                  className="btn btn-danger offset-md-11"
                  onClick={() => this.setState({ preview: false })}
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
                    {/* {table ==='General' &&
                    <AccountReportDoc 
                      data={prv} 
                      fromDate={queryForm.from} 
                      toDate={queryForm.to} 
                    />
                  } */}
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
                {/* <div className="d-flex flex-direction-row align-items-center justify-content-between">
                  <div className="d-flex align-items-center justify-content-start m-0">
                    <label className="mr-2 font-weight-bold">Report Type</label>
                    <select className="form-control">
                      <option value="">Select a report type</option>
                      <option value="income">Income and Expenses</option>
                      <option value="suppliers">Suppliers</option>
                      <option value="sales">Sales and Expenses</option>
                    </select>
                  </div>
                  <Button
                    outline
                    color="primary"
                    style={{ marginLeft: 10 }}
                    disabled={!prv.length}
                    onClick={() => this.setState({ preview: true })}>
                    <IoMdDownload style={{ marginRight: 5 }} />
                    Download Report
                  </Button>
                </div> */}
                <div className="row" style={{ marginTop: 15 }}>
                  <InputGroup className="col-md-7">
                    <Typeahead
                      onInputChange={(filterText) =>
                        this.setState({ filterText })
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
                          this.setState({ table: val[0] });
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
                      onClick={() => this.setState({ preview: true })}
                    >
                      <IoMdDownload style={{ marginRight: 5 }} />
                      Download Report
                    </Button>
                  </div>
                </div>
                {/* <Button 
                  outline 
                  primary 
                  className="col-md-2"
                  color="primary"
                  onClick={toggle}
                >
                  <GiSandsOfTime style={{margin: '0 2px'}} />
                  Pending Txn
                </Button>
                <Button 
                  outline 
                  color="primary" 
                  className="col-md-2" 
                  style={{marginLeft: 10}} 
                  onClick={toggle}
                >
                  <IoMdDownload style={{margin: '0 2px'}} />
                  Report
                </Button> */}

                {/* <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                <label>Report for</label>
                <Typeahead
                  align="justify"
                  labelKey="head"
                  id="services"
                  placeholder="General Report"
                  options={accHeads.length ? accHeads : [{head: ""}]}
                  onChange={(val) => {
                      if(val.length) handleReportKindChange(val[0]['head'])
                  }}
                />
              </div>

              <Button 
                outline 
                color="primary" 
                className="offset-md-6 offset-lg-6 col-md-2 col-lg-2" 
                style={{marginLeft: 10}} 
                // onClick={toggle}
              >
                <IoMdDownload style={{margin: '0 2px'}} />
                Report
              </Button> 
            </div> */}

                <div style={{ marginTop: 15 }}>
                  <Scrollbars asi>
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
        {/* <ReportModal 
          toggle={toggle}
          modal={modalIsOpen}
          data={alltransactions}
          handlePrint={this.handlePrint}
        /> */}
      </div>
    );
  }
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
