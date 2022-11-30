import React, { Component } from "react";
import { Form, FormGroup, Card, CardHeader, CardBody, Table } from "reactstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { Scrollbars } from "react-custom-scrollbars";
import { connect } from "react-redux";

import { today, _warningNotify, url, formatNumber } from "../utils/helpers";
import { AccountStatement } from "../comp/pdf-templates/acc-stmt";
import { PDFViewer } from "@react-pdf/renderer";
import { FaPrint, FaTimes } from "react-icons/fa";
import { getPatients } from "../../redux/actions/records";
import Loading from "../loading";
import { _fetchApi } from "../../redux/actions/api";
import { apiURL } from "../../redux/actions";
import moment from "moment";

class ClientStatementAccount extends Component {
  state = {
    queryForm: { from: today, to: today, balance: 0, accountNo: "", name: "" },
    reportData: [],
    patients: [],
    names: [],
    accountNos: [],
    patientAccStmt: [],
    loading: false,
    modalIsOpen: false,
    fetchingErr: "",
    statementDetails: {},
    preview: false,
    report: false,
    newB: "newB",
  };

  componentDidMount() {
    this.props.getPatients();
  }

  onFromDateChange = ({ target: { name, value } }) => {
    const {
      queryForm: { to, accountNo },
    } = this.state;
    if (accountNo !== "") {
      this._getPatientAccStmt(accountNo, value, to, (stmt) =>
        this.getBal(stmt)
      );
    }
    this.setState((prevState) => ({
      fetchingErr: "",
      queryForm: Object.assign({}, prevState.queryForm, { [name]: value }),
    }));
    // console.log(value, to)
    // this.fetchReportData(value, to)
  };

  getBalance = (accountNo) => {
    _fetchApi(
      `${url}/transactions/balance/${accountNo}`,
      ({ results }) => {
        let acc_bal = results.length ? `${results[0].balance}` : "0";
        this.setState((prev) => ({
          newB: acc_bal,
          queryForm: {
            ...prev.queryForm,
            balance: acc_bal,
          },
        }));
        // alert(acc_bal)
      },
      (err) => console.log(err)
    );
  };

  onToDateChange = ({ target: { name, value } }) => {
    const {
      queryForm: { from, accountNo },
    } = this.state;
    if (accountNo !== "") {
      this._getPatientAccStmt(accountNo, from, value, (stmt) =>
        this.getBal(stmt)
      );
    }
    this.setState((prevState) => ({
      fetchingErr: "",
      queryForm: Object.assign({}, prevState.queryForm, { [name]: value }),
    }));
    // console.log(from, value)
    // this.fetchReportData(from, value)
  };

  resetForm = () => this.setState({ queryForm: { from: today, to: today } });

  // getBal = (stmt) => {
    // let bal = stmt[stmt.length - 1].bal;
    // this.setState((prev) => ({
    //   queryForm: { ...prev.queryForm, balance: bal },
    // }));
    // alert(bal)
  // };

  _getPatientAccStmt = (accNo, from, to, cb) => {
    this.setState({ loading: true });
    _fetchApi(
      `${apiURL()}/transactions/reports/stmt/${accNo}/${from}/${to}`,
      ({ results }) => {
        if (results.length) {
          this.setState({ patientAccStmt: results, loading: false });
          cb(results);
        }
      },
      (err) => {
        this.setState({ loading: false });
        _warningNotify("An error occurred");
        console.log(err);
      }
    );
  };

  handleAccChange = ({ surname='' , firstname='', accountNo='' }) => {
    // console.log(val)
    const { from, to } = this.state.queryForm;
    // let newVal = val.split(" ");
    // let surname = newVal[0];
    // let firstname = newVal[1];
    // let bracedAcc = newVal[2];
    // let accNo = bracedAcc.substr(1, bracedAcc.length - 2);
    this.setState((prev) => ({
      queryForm: {
        ...prev.queryForm,
        accountNo,
        name: `${surname} ${firstname}`,
      },
    }));
    this.getBalance(accountNo);
    // let patient = this.props.patients.filter(p => p.firstname===firstname && p.surname===surname && p.accountNo===parseInt(accountNo));
    // if(patient.length){
    // let patientId = (patient[0].id)
    this._getPatientAccStmt(accountNo, from, to, (stmt) => this.getBal(stmt));
    // }
  };

  render() {
    const {
      props: { patients, loading, facilityInfo },
      state: { queryForm, report, patientAccStmt },
      onFromDateChange,
      onToDateChange,
      // handleSubmit,
      handleAccChange,
      // toggle
    } = this;
    // const opening_bal = patientAccStmt.length
    //   ? parseInt(patientAccStmt[0].bal) +
    //     parseInt(patientAccStmt[0].debit) -
    //     parseInt(patientAccStmt[0].credit)
    //   : null;
    // console.log(patientAccStmt)
    return (
      <div>
        <Card>
          <CardHeader>
            <h5>Account Balance</h5>
          </CardHeader>
          {/* 
          {opening_bal} */}
          <CardBody>
            <Form className="">
              <FormGroup
                row
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                  <label>Start From:</label>
                  <input
                    type="date"
                    className="form-control"
                    name="from"
                    onChange={onFromDateChange}
                    value={queryForm.from ? queryForm.from : ""}
                  />
                </div>
                <div className="col-xs-12 col-sm-12 col-md-4 offset-lg-1 col-lg-4">
                  <label>End At:</label>
                  <input
                    type="date"
                    className="form-control"
                    name="to"
                    onChange={onToDateChange}
                    value={queryForm.to ?   Form.to : ""}
                  />
                </div>
              </FormGroup>
              {/* {JSON.stringify(queryForm)} */}

              <FormGroup
                row
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {/* <div > */}
                <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                  <label className="">Account Name</label>
                  <Typeahead
                    id="head"
                    align="justify"
                    labelKey={i => `${i.surname} ${i.firstname} (${i.accountNo})`}
                    options={patients.length ? patients : []}
                    onChange={(val) => {
                      if (val.length) handleAccChange(val[0]);
                    }}
                  />
                </div>
                <div className="col-md-4 col-lg-4">
                  <label>Balance</label>
                  <input
                    type="text"
                    className="form-control text-right"
                    disabled
                    value={queryForm.balance}
                  />
                </div>
                <div
                  className="col-md-4 col-lg-4"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                  }}
                >
                  <button
                    style={{ marginBottom: 20 }}
                    onClick={(e) => {
                      e.preventDefault();
                      this.setState({ report: true });
                    }}
                    className="btn btn-outline-primary"
                    disabled={!patientAccStmt.length}
                  >
                    <FaPrint style={{ marginRight: 5 }} />
                    Print Report
                  </button>
                </div>

                {/* </div> */}
              </FormGroup>
            </Form>

            {loading && <Loading />}
            {patientAccStmt.length ? (
              <div>
                {/* <button className="btn btn-danger offset-md-11" onClick={() => this.setState({ preview: false }, () => this.resetForm())}><FaTimes /><>Close</></button> */}
                {report ? (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        className="btn btn-outline-danger"
                        onClick={() =>
                          this.setState({ report: false }, () =>
                            this.resetForm()
                          )
                        }
                      >
                        <FaTimes />
                        <>Close</>
                      </button>
                    </div>
                    <center>
                      {/* {JSON.stringify(queryForm)} */}
                      <PDFViewer height="900" width="600">
                        <AccountStatement
                          data={patientAccStmt}
                          balance={queryForm.balance}
                          accDetails={{
                            from: queryForm.from,
                            to: queryForm.to,
                            accountNo: queryForm.accountNo,
                            name: queryForm.name,
                          }}
                          logo={facilityInfo.logo}
                          facilityInfo={facilityInfo}
                        />
                      </PDFViewer>
                    </center>
                  </div>
                ) : (
                  <Scrollbars style={{ height: 500 }}>
                    <AccountStatementTable list={patientAccStmt} />
                  </Scrollbars>
                )}
              </div>
            ) : (
              <div className="alert alert-primary">
                <h5 className="text-center">No data to view</h5>
              </div>
            )}
            {/* <QueryForm 
              modal={modalIsOpen}
              toggle={toggle}
              names={names}
              accountNos={accountNos}
              queryForm={queryForm} 
              onFromDateChange={onFromDateChange} 
              onToDateChange={onToDateChange} 
              setName={this.handleNameChange}
              setNumber={this.handleAccNoChange}
              handleSubmit={handleSubmit}
              error={fetchingErr}
              loading={loading}
            /> */}
          </CardBody>
        </Card>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getPatients: () => dispatch(getPatients()),
  };
}

function mapStateToProps(state) {
  return {
    patients: state.records.patients,
    names: state.records.names,
    facilityInfo: state.facility.info,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClientStatementAccount);

function AccountStatementTable({ list }) {
  return (
    <>
      {list.length ? (
        <Table responsive striped bordered size="sm">
          <thead>
            <th className="text-center">Date</th>
            <th className="text-center">Description</th>
            <th className="text-center">Debited</th>
            <th className="text-center">Credited</th>
            {/* <th>Balance</th> */}
          </thead>
          <tbody height={240}>
            {list.map((item) => (
              <tr key={item.id} isSelectable onSelect={() => alert(item.name)}>
                <td>{moment(item.createdAt).format("DD-MM-YYYY")}</td>
                <td>{item.description}</td>
                <td className="text-right">{formatNumber(item.debit)}</td>
                <td className="text-right">{formatNumber(item.credit)}</td>
                {/* <td className="text-right">{formatNumber(item.bal)}</td> */}
              </tr>
            ))}
          </tbody>
        </Table>
      ) : null}
    </>
  );
}

// function QueryForm({
//   modal,
//   toggle,
//   queryForm,
//   onFromDateChange,
//   onToDateChange,setName,setNumber,handleSubmit,
//   names,
//   className,
//   error,
//   loading
// }) {
//   return (
//     <Modal isOpen={modal} toggle={toggle} className={className} size="lg">
//       <ModalHeader toggle={toggle}>Print Account Statement</ModalHeader>
//       <ModalBody>

//     <p style={{color:'red',textAlign:'center'}}>{error}</p>
//     </ModalBody>
//     <ModalFooter>

//     </ModalFooter>
//     </Modal>
//   )
// }
