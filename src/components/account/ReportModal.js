import React, { PureComponent } from 'react';
import { Table, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {
  url,
  _warningNotify,
  today,
  appendNameToTxnData,
} from '../utils/helpers';
import { connect } from 'react-redux';
import { Typeahead } from 'react-bootstrap-typeahead';
// import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
// import Loading from '../loading';
import BreakDown from './reports/BreakDown';
import Companies from './reports/Companies';
import DailyIncome from './reports/DailyIncome';
import Staff from './reports/Staff';
import Supplier from './reports/Suppliers';
import Loading from '../loading';
import { getAccHeads } from '../../redux/actions/transactions';
import { _fetchApi } from '../../redux/actions/api';
import { apiURL } from '../../redux/actions';

class ReportModal extends PureComponent {
  state = {
    reportType: '',
    reportData: [],
    queryForm: {
      from: today,
      to: today,
    },
    loading: false,
  };

  componentDidMount() {
    this.props.getAccHeads();
    const {
      queryForm: { from, to },
    } = this.state;
    this.fetchReportData(from, to);
  }

  onReportChange = ({ target }) => {
    this.setState({
      reportType: target.value,
    });
  };

  onFromDateChange = ({ target: { name, value } }) => {
    const {
      queryForm: { to },
    } = this.state;
    this.setState((prevState) => ({
      queryForm: Object.assign({}, prevState.queryForm, { [name]: value }),
    }));
    // console.log(value, to)
    this.fetchReportData(value, to);
  };

  onToDateChange = ({ target: { name, value } }) => {
    const {
      queryForm: { from },
    } = this.state;
    this.setState((prevState) => ({
      queryForm: Object.assign({}, prevState.queryForm, { [name]: value }),
    }));
    // console.log(from, value)
    this.fetchReportData(from, value);
  };

  fetchReportData(from, to) {
    this.setState({ loading: true });
    _fetchApi(
      `${url}/transactions/reports/${from}/${to}`,
      ({ results }) => {
        // console.log(results)
        if (results.length) {
          appendNameToTxnData(results, (data) =>
            this.setState({ reportData: data, loading: false }),
          );
        }
      },
      (err) => {
        _warningNotify(err.toString());
        this.setState({ loading: false });
      },
    );
  }

  handlePrint = () => {
    this.props.handlePrint(this.state.reportData);
  };

  renderReport = () => {
    switch (this.state.reportType) {
      case 'BreakDown':
        return <BreakDown />;
      case 'Companies':
        return <Companies />;
      case 'DailyIncome':
        return (
          <DailyIncome
            from={this.state.queryForm.from}
            to={this.state.queryForm.to}
          />
        );
      case 'Staff':
        return <Staff />;
      case 'Supplier':
        return <Supplier />;
      default:
        return (
          <center>
            <h4>Select a Report to get started</h4>
          </center>
        );
    }
  };

  getGeneralReport = () => {
    _fetchApi(
      `${apiURL()}/transactions/reports/general`,
      ({ results }) => {
        this.setState({ reportData: results });
        console.log(results);
      },
      (err) => {
        _warningNotify('An error occured');
        console.log(err);
      },
    );
  };

  handleReportKindChange = (reportKind) => {};

  render() {
    const {
      state: { reportData, queryForm, loading },
      props: { modal, toggle, className, accHeads },
      onFromDateChange,
      // onReportChange,
      onToDateChange,
      handlePrint,
      handleReportKindChange,
    } = this;

    return (
      <Modal isOpen={modal} toggle={toggle} className={className} size="lg">
        <ModalHeader toggle={toggle}>Print Report</ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
              <label>Report for</label>
              <Typeahead
                align="justify"
                labelKey="head"
                id="services"
                options={accHeads.length ? accHeads : [{ head: '' }]}
                onChange={(val) => {
                  if (val.length) handleReportKindChange(val[0]['head']);
                }}
              />

              {/* <select
                name="reportType"
                className="form-control form-control-sm"
                onChange={onReportChange}>
                <option value="">Select Report</option>
                <option value="DailyIncome">Daily Income</option>
                <option value="Staff">Staff</option>
                <option value="Supplier">Supplier</option>
                <option value="BreakDown">Breakdown</option>
                <option vaue="Companies">Companies</option>
              </select> */}
            </div>

            {/* {this.state.reportType === 'Supplier' ? (
              <div className="col-xs-12 col-sm-12 offset-md-4 col-md-4 offset-lg-4 col-lg-4">
                <label>Supplier</label>
                <input
                  className="form-control"
                  name=""
                  type="text"
                  placeholder="supplier"
                />
              </div>
            ) : null} */}
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
              <label>From</label>
              <input
                className="form-control"
                name="from"
                value={queryForm.from}
                onChange={onFromDateChange}
                type="date"
              />
            </div>

            <div className="col-xs-12 col-sm-12 offset-md-4 col-md-4 offset-lg-4 col-lg-4">
              <label>To</label>
              <input
                className="form-control"
                name="to"
                value={queryForm.to}
                onChange={onToDateChange}
                type="date"
              />
            </div>
          </div>
          <Scrollbars style={{ height: 500, marginTop: 20 }}>
            {loading ? (
              <Loading />
            ) : (
              <div>
                <Table responsive bordered>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Source</th>
                      <th>Description</th>
                      <th>Debited</th>
                      <th>Credited</th>
                      <th>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData
                      ? reportData.map((transaction, i) => (
                          <tr key={i}>
                            <td>{transaction.day}</td>
                            <td>{transaction.source}</td>
                            <td>{transaction.description}</td>
                            <td>₦ {transaction.debited}</td>
                            <td>₦ {transaction.credited}</td>
                            <td>{transaction.bal}</td>
                          </tr>
                        ))
                      : null}
                  </tbody>
                </Table>
              </div>
            )}
            {!loading && !reportData.length ? (
              <div className="text-center">
                <h5>No data found for that date range</h5>
              </div>
            ) : null}
            {/* {this.renderReport()} */}
          </Scrollbars>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={handlePrint}>
            Preview & Print
          </button>
          {/* <PDFLink data={reportData} name={`AccountReport_${today}`} className="btn btn-primary col-md-3" /> */}
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = ({ transactions: { accHeads, loadingAccHead } }) => ({
  accHeads,
  loadingAccHead,
});

const mapDispatchToProps = (dispatch) => ({
  getAccHeads: () => dispatch(getAccHeads()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReportModal);
