import React, { Component } from "react";
import { Form, FormGroup, Card, CardHeader, CardBody } from "reactstrap";
import moment from "moment";
import { Typeahead } from "react-bootstrap-typeahead";
import { connect } from "react-redux";
import { url, _warningNotify, _customNotify, today } from "../utils/helpers";
// import DepositPreview from './DepositPreview';
import { DepositReceipt } from "../comp/pdf-templates/deposit-receipt";
import { PDFViewer } from "@react-pdf/renderer";
import { FaTimes } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import { _fetchApi, _fetchApi2, _postApi } from "../../redux/actions/api";
import { apiURL } from "../../redux/actions";
import CustomButton from "../comp/components/Button";

class PatientDeposit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      depositForm: {
        date: today,
        accHead: "Deposit",
        mode: "cash",
        description: "Deposit",
      },
      patients: [],
      names: [],
      accountNos: [],
      receiptNo: "",
      isModalOpen: false,
      savingDeposit: false,
      user: "",
      preview: false,
      accounts: [],
      selectedAccount: {},
    };
  }

  logChange = ({ target: { name, value } }) => {
    this.setState((prevState) => ({
      depositForm: Object.assign({}, prevState.depositForm, { [name]: value }),
    }));
  };

  toggle = () =>
    this.setState((prevState) => ({
      isModalOpen: !prevState.isModalOpen,
    }));

  generateReceiptNo() {
    // console.log()
    const today = moment().format("DDMMYY");
    _fetchApi(
      `${url}/transactions/getNextTransactionID`,
      ({ transactionId }) => {
        _fetchApi(
          `${url}/transactions/getReceiptNo`,
          ({ receiptNo }) => {
            receiptNo = receiptNo ? receiptNo : 1;
            transactionId = transactionId ? transactionId : 1;
            // console.log(receiptNo)
            // let rcptNo = pad(receiptNo, 4, 0)
            let rec = `${today}${receiptNo}${transactionId}`;
            // const newBalance = this.state.depositForm.balance + this.state.depositForm.amount
            this.setState((prevState) => ({
              depositForm: Object.assign({}, prevState.depositForm, {
                receiptNo: rec,
                receiptId: receiptNo,
              }),
            }));
          },
          (err) => console.log(err)
        );
      },
      (err) => console.log(err)
    );
  }

  getUser = () => {
    let user = localStorage.getItem("user") || "";
    if (user.length) {
      this.setState((prevState) => ({
        user,
        depositForm: Object.assign({}, prevState.depositForm, { user }),
      }));
    }
  };

  getAccounts = () => {
    _fetchApi(`${apiURL}`);
  };

  componentDidMount() {
    this.getUser();
    this.getPatients();
    this.generateReceiptNo();
  }

  // setPatients(list) {
  //   let patients = [];
  //   let names = [];
  //   let accountNos = [];
  //   list.forEach(({ accountNo, firstname, surname }) => {
  //     patients.push({ accountNo, firstname, surname });
  //     names.push(`${surname} ${firstname} (${accountNo})`);
  //     accountNos.push(accountNo);
  //   });
  //   this.setState({ patients, names, accountNos });
  // }

  // setNumber(surname, firstname) {
  //   let patient = this.state.patients.filter(
  //     (p) => p.surname === surname && p.firstname === firstname,
  //   );
  //   // console.log(patient.length ? patient[0].balance : null)
  //   this.setState(
  //     (prevState) => ({
  //       depositForm: Object.assign({}, prevState.depositForm, {
  //         accountNo: patient.length ? patient[0].accountNo : null,
  //         // balance: patient.length ? `${patient[0].balance}` : null
  //       }),
  //     }),
  //     () => (patient.length ? this.getBalance(patient[0].accountNo) : null),
  //   );
  // }

  // setName(accountNo) {
  //   let patient = this.state.patients.filter((p) => p.accountNo === accountNo);
  //   this.setState(
  //     (prevState) => ({
  //       depositForm: Object.assign({}, prevState.depositForm, {
  //         name: patient.length
  //           ? `${patient[0].surname} ${patient[0].firstname}`
  //           : null,
  //         // balance: patient.length ? `${patient[0].balance}` : null
  //       }),
  //     }),
  //     () => this.getBalance(accountNo),
  //   );
  // }

  getBalance = (accountNo) => {
    _fetchApi(
      `${url}/transactions/balance/${accountNo}`,
      ({ results }) =>
        this.setState((prevState) => ({
          depositForm: Object.assign({}, prevState.depositForm, {
            balance: results.length ? `${results[0].balance}` : "0",
            name: results.length ? `${results[0].name}` : "",
          }),
        })),
      (err) => console.log(err)
    );
  };

  setAccHead = (accHead) =>
    this.setState((prev) => ({
      depositForm: { ...prev.depositForm, accHead },
    }));

  getPatients = () => {
    // alert('test')
    // const cachedPatientsList =
    //   JSON.parse(localStorage.getItem('allpatients')) || [];
    // if (cachedPatientsList.length) {
    //   this.setPatients(cachedPatientsList);
    // }

    _fetchApi2(
      // `${apiURL()}/patientrecords/patientlist`,
      `${apiURL()}/client/get-list?facilityId=${
        this.props.facilityInfo.facility_id
      }`,
      ({ results }) => {
        if (results) {
          this.setState({ accounts: results });
        }
        // this.setPatients(results);
        // if (results) {
        //   localStorage.setItem('allpatients', JSON.stringify(results));
        // }
      },
      (error) => _warningNotify(error.toString())
    );
  };

  // getDate() {
  //   let today = moment().format('YYYY-MM-DD');
  //   this.setState(prevState => ({ depositForm: Object.assign({}, prevState.depositForm, { date: today })}))
  //   // console.log(today)
  // }

  resetDepositForm = () => {
    this.setState({
      depositForm: { accHead: "Deposit", mode: "cash", date: today },
      isModalOpen: false,
    });
    this._services.clear();
    this.generateReceiptNo();
  };

  handleDeposit = (e) => {
    // /txn/new-deposit
    e.preventDefault();
    const { depositForm, selectedAccount } = this.state;
    let dep = depositForm;
    dep.userId = this.props.user_id;
    dep.depositAmount = depositForm.amount;
    dep.receiptsn = depositForm.receiptNo;
    dep.receiptno = depositForm.receiptId;
    dep.source = "Deposit";
    dep.destination = depositForm.mode;
    dep.modeOfPayment = depositForm.mode;
    dep.clientAccount = depositForm.accountNo;
    dep.accName = selectedAccount.accName;
    dep.description = `Deposit from account ${depositForm.accountNo}`;
    dep.payable_head = selectedAccount.payable_head;
    dep.payable_head_name = selectedAccount.payable_head_name;
    dep.receivable_head = selectedAccount.receivable_head;
    dep.receivable_head_name = selectedAccount.receivable_head_name;

    if (dep.description === "") dep.description = "Deposit";

    if (depositForm.accountNo && depositForm.amount) {
      // dep.debit = depositForm.accountNo;
      // deb.amount = depositForm.amount;
      // debug.credit = 'Deposit';
      this.setState({ savingDeposit: true });
      _postApi(
        `${url}/transactions/deposit`,
        dep,
        () => {
          _customNotify("Transaction Successful");
          this.setState({ preview: true });
        },
        (err) => {
          // console.log(err);
          _warningNotify(err.toString());
          this.setState({ savingDeposit: false });
        }
      );

      // newDeposit(dep, (r) => {
      //   console.log(r)
      //   _customNotify('Deposit Successful')
      // })

      // newDeposit({
      //   payable_head: selectedAccount.payable_head,
      //   payable_head_name: selectedAccount.payable_head_name,
      //   receivable_head: selectedAccount.receivable_head,
      //   receivable_head_name: selectedAccount.receivable_head_name,
      // })
    } else if (depositForm.name) {
      this.setState({ savingDeposit: true });
      _fetchApi(`${apiURL()}/client/nextId`, (data) => {
        if (data.success) {
          let newAcc = data.results.accountNo;
          let newDepositObj = {
            ...dep,
            accountNo: newAcc,
            clientAccount: newAcc,
            description: `Deposit from account ${newAcc}`,
          };

          this.setState((prev) => ({
            depositForm: {
              ...prev.depositForm,
              clientAccount: newAcc,
              accountNo: newAcc,
            },
          }));

          _postApi(
            `${url}/transactions/deposit`,
            newDepositObj,
            () => {
              _customNotify("Transaction Successful");
              this.setState({ preview: true });
            },
            (err) => {
              // console.log(err);
              _warningNotify(err.toString());
              this.setState({ savingDeposit: false });
            }
          );
        }
      });
    } else {
      _warningNotify("Please complete the form");
    }
  };

  // handleAccChange = (val) => {
  //   let surname = val.split(' ')[0];
  //   let firstname = val.split(' ')[1];
  //   this.setState(
  //     (prevState) => ({
  //       depositForm: Object.assign({}, prevState.depositForm, { name: val }),
  //     }),
  //     () => this.setNumber(surname, firstname),
  //   );
  // };

  render() {
    const {
      // handleAccChange,
      // toggle,
      // resetDepositForm,
      state: {
        depositForm,
        // names,
        // isModalOpen,
        savingDeposit,
      },
      props: { facilityInfo },
    } = this;
    return (
      <Card>
        <CardHeader
          tag="div"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <h5>{this.state.preview ? "Preview & Print" : "Deposit Form"}</h5>
          <div>
            <span style={{ marginRight: 5, fontWeight: "bold" }}>
              Receipt No:
            </span>
            <span>{depositForm.receiptNo ? depositForm.receiptNo : ""}</span>
          </div>
        </CardHeader>
        <CardBody>
          {/* {JSON.stringify(this.state.depositForm)} */}
          {this.state.preview ? (
            <div>
              <button
                className="btn btn-danger offset-md-11"
                onClick={() =>
                  this.setState({ preview: false, savingDeposit: false }, () =>
                    this.resetDepositForm()
                  )
                }
              >
                <FaTimes />
                <>Close</>
              </button>

              <center>
                <PDFViewer height="900" width="600">
                  <DepositReceipt
                    depositDetails={depositForm}
                    logo={facilityInfo.logo}
                    facilityInfo={facilityInfo}
                    // amount={depositForm.amount}
                  />
                </PDFViewer>
              </center>
            </div>
          ) : (
            <Form className="">
              <FormGroup row>
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                  <label>Date</label>
                  <input
                    type="date"
                    className="form-control "
                    name="date"
                    onChange={this.logChange}
                    value={depositForm.date ? depositForm.date : ""}
                  />
                </div>
                <div className="col-xs-12 col-sm-12 col-md-6 offset-lg-4 col-lg-4">
                  <label>Balance</label>
                  <input
                    type="text"
                    className="form-control "
                    disabled
                    value={depositForm.balance ? depositForm.balance : ""}
                  />
                </div>
              </FormGroup>

              <FormGroup row>
                <div className="col-xs-12 col-sm-12 offset-md-8 offset-lg-8 col-md-4 col-lg-4">
                  <label>Account Head</label>
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.depositForm.accHead}
                    disabled
                  />
                  {/* <Typeahead
                    align="justify"
                    labelKey="head"
                    options={revAccHeads}
                    onChange={(val) => {
                      if(val.length) this.setAccHead(val[0]['head'])}
                    }
                    onInputChange={head => this.setAccHead(head)}
                  /> */}
                  {/* <label className="">Select Account</label>
                  <select
                    className="form-control"  
                    name="accHead"
                    value={depositForm.accHead ? depositForm.accHead : ''}
                    onChange={this.logChange}
                  >
                    <option value=""></option>
                    <option value="clinic">Clinic Payment</option>
                    <option value="lab">Lab Payment</option>
                  </select> */}
                </div>
              </FormGroup>

              <FormGroup row>
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                  <label className="">Select Patient Account</label>
                  <Typeahead
                    allowNew
                    align="justify"
                    labelKey={(acc) => `${acc.accName} (${acc.accountNo})`}
                    id="accounts"
                    ref={(ref) => (this._services = ref)}
                    options={this.state.accounts}
                    onChange={(val) => {
                      if (val.length) {
                        let account = val[0];
                        let accountNo = account.accountNo;
                        // let name = `${account.surname} ${account.firstname}`
                        this.setState((prev) => ({
                          ...prev,
                          depositForm: {
                            ...prev.depositForm,
                            name: account.accName,
                            accountNo,
                            // payable_head: account.payable_head,
                            // payable_head_name: account.payable_head_name,
                            // receivable_head: account.receivable_head,
                            // receivable_head_name: account.receivable_head_name,
                          },
                          selectedAccount: account,
                        }));
                        this.getBalance(accountNo);
                        // handleAccChange(val[0].account_no);
                      }
                    }}
                    onInputChange={(name) =>
                      this.setState((prev) => ({
                        ...prev,
                        depositForm: { ...prev.depositForm, name },
                      }))
                    }
                  />
                </div>
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                  <label className="">Description (optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={this.logChange}
                    name="description"
                    value={
                      depositForm.description ? depositForm.description : ""
                    }
                  />
                </div>
              </FormGroup>

              <FormGroup row>
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                  <label className="">Amount</label>
                  <input
                    type="number"
                    className="form-control spcnm"
                    onChange={this.logChange}
                    value={depositForm.amount ? depositForm.amount : ""}
                    name="amount"
                  />
                </div>
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                  <label className="">Mode Of Payment</label>
                  <select
                    className="form-control"
                    name="mode"
                    value={depositForm.mode ? depositForm.mode : ""}
                    onChange={this.logChange}
                  >
                    <option value="" />
                    <option value="cash">Cash</option>
                    <option value="POS">POS</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </FormGroup>

              <FormGroup row>
                {/* <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                  <label className="">Reciept No</label>
                  <input 
                    type="text" 
                    disabled
                    className="form-control" 
                    onChange={this.logChange} 
                    name='receiptNo'
                    value={depositForm.receiptNo ? depositForm.receiptNo : ''} 
                  />
                </div> */}
              </FormGroup>

              <FormGroup>
                {/* <PDFLink depositDetails={depositForm} downloadButtonText="Save" name={`PatientDeposit_${depositForm.accountNo}`} className="btn btn-primary col-md-3" /> */}
                <CustomButton
                  loading={savingDeposit}
                  className="btn btn-primary offset-md-4 col-md-4 offset-lg-4 col-lg-4"
                  onClick={this.handleDeposit}
                >
                  <FiSave size={18} style={{ margin: "0 5px" }} />
                  Save & Preview
                </CustomButton>
              </FormGroup>
            </Form>
          )}
        </CardBody>
      </Card>
    );
  }
}

function mapStateToProps(state) {
  return {
    revAccHeads: state.transactions.revAccHeads,
    facilityInfo: state.facility.info,
    user_id: state.auth.user.id,
  };
}

export default connect(mapStateToProps)(PatientDeposit);
