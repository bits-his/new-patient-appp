import React, { Component } from "react";
import { connect } from "react-redux";
import { Typeahead } from "react-bootstrap-typeahead";
import {
  FormGroup,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Label,
  Input,
  Col,
  Table,
} from "reactstrap";
import {
  today,
  generateReceiptNo,
  _warningNotify,
  _customNotify,
  formatNumber,
} from "../utils/helpers";
import { LoadingSM } from "../loading";
import { getExpensesAccHeads } from "../../redux/actions/transactions";
import { _fetchApi, _postApi, _updateApi } from "../../redux/actions/api";
import { apiURL } from "../../redux/actions";
import SelectInput from "../comp/components/SelectInput";
import ExpenditureList from "./ExpenditureList";
import { getAllSuppliers } from "../../redux/actions/pharmacy";
import { withRouter } from "react-router";
import { compose } from "redux";
import BackButton from "../comp/components/BackButton";
import ViewAdditionalExpenses from "../inventory/purchase-order/ViewAdditionalExpenses";
import AutoComplete from "../comp/components/AutoComplete";

class Expenditure extends Component {
  vendor = new URLSearchParams(this.props.location.search).get("vendor");
  state = {
    expenditureList: [],
    expenditureForm: {
      date: today,
      accHead: "",
      accHeadDescription: "",
      showSubAccHead: false,
      mode: "Cash",
      expenditureType: "Normal Expenditure",
      description: "",
      sourceAcct: "400025",
      supplier_info: "",
      subAccHeadList: [],
      collectedBy: "",
    },
    expModalOpen: false,
    expFormDetails: { date: today },
    formErr: "",
    submitting: false,
    total: "0",
    supplier: "",
    supplierId: "",
    supplierInfo: {},
    tableData: [],
  };

  requestNo = this.props.match.params.requestNo;

  getExpensesByID = () => {
    const _requestNo = this.requestNo;
    _fetchApi(
      `${apiURL()}/account/get/expenses/by-request/${_requestNo}`,
      (data) => {
        this.setState({ tableData: data.results });
      },
      (err) => {
        console.log(err);
      }
    );
  };
  componentDidMount() {
    this.props.getExpensesAccHeads();
    this.getReceiptNo();
    this.props.getAllSuppliers();
    this.getExpensesByID();
    this.getExpensesByID();

    if (this.vendor) {
      this.setState((prev) => ({
        ...prev,
        expenditureForm: {
          ...prev.expenditureForm,
          expenditureType: "Supplier Payment",
        },
      }));
    }
  }

  // componentDidUpdate(prev, newS) {
  //   // console.log(prev, newS)

  // }

  UNSAFE_componentWillReceiveProps(nextProps, nextState) {
    // console.log(nextProps, nextState)
    if (nextProps.suppliers.length) {
      // alert("here");
      let sup = this.props.suppliers.find(
        (i) => i.supplier_name === this.vendor
      );
      // address: "Kano"
      // balance: null
      // date: "2021-02-11T10:11:29.000Z"
      // email: ""
      // facilityId: "d8d7a732-1832-4e25-9a98-e68ddc3f0b26"
      // id: 28
      // other_info: ""
      // phone: "0"
      // status: null
      // supplier_code: "28"
      // supplier_name: "Fittrust Nig. l.t.d"
      // supplier_type: "Local"
      // tinnumber: "0"
      // vat: "0"
      // website: ""
      // console.log(sup, this.props.suppliers);
      this.setState((prev) => ({
        ...prev,
        supplierInfo: sup ? sup : {},
        supplierId: sup ? sup.supplier_code : "",
        supplier: sup ? sup.supplier_name : "",
      }));
    }
  }

  getReceiptNo = () => {
    generateReceiptNo((rec, recId) =>
      this.setState((prevState) => ({
        expFormDetails: Object.assign({}, prevState.expFormDetails, {
          receiptNo: rec,
          receiptId: recId,
        }),
      }))
    );
  };

  toggle = () => {
    this.setState((prevState) => ({
      expModalOpen: !prevState.expModalOpen,
    }));
  };

  handleInputChange = ({ target: { name, value } }) => {
    this.setState((prevState) => ({
      formErr: "",
      expenditureForm: Object.assign({}, prevState.expenditureForm, {
        [name]: value,
      }),
    }));
  };

  resetPage = () => {
    this.setState((prev) => ({
      expFormDetails: {
        date: today,
        accHead: "",
        mode: "Cash",
        expenditureType: "Normal Expenditure",
        description: "",
        sourceAcct: "400025",
      },
      expenditureList: [],
    }));

    this._accHead.clear();

    generateReceiptNo((rec, recId) =>
      this.setState((prevState) => ({
        expFormDetails: Object.assign({}, prevState.expFormDetails, {
          receiptNo: rec,
          receiptId: recId,
        }),
      }))
    );
  };

  _updateStatusDisburse = (requestNo) => {
    const _status = "Disburse Money";
    _updateApi(
      `${apiURL()}/account/update/expenses/status/${requestNo}`,
      { status: _status },
      (success) => {
        _customNotify("Expenses Disburse Successfully");
      },
      (err) => {
        console.log(err);
      }
    );
  };

  handleSubmit = () => {
    this.setState({ submitting: true });
    // const user = localStorage.getItem('user') || ''
    const user = this.props.user.username;
    const facilityId = this.props.user.facilityId;
    const {
      expFormDetails: { receiptId, receiptNo },
      expenditureForm: { expenditureType, amount, mode, sourceAcct },
      expenditureList,
      // total,
      supplierId,
      // getPettyCash,
    } = this.state;
    if (expenditureType === "Supplier Payment") {
      if (supplierId === "") {
        _warningNotify("Please select a supplier");
      } else {
        let txnDetails = {
          supplierId: supplierId,
          amount,
          receiptsn: receiptNo,
          receiptno: receiptId,
          modeOfPayment: mode,
          sourceAcct,
          description: "Supplier Payment",
        };

        _postApi(
          `${apiURL()}/transactions/supplier-payment`,
          txnDetails,
          (data) => {
            _customNotify("Transaction recorded!");
            this.setState({
              expenditureForm: {
                date: today,
                accHead: "",
                mode: "Cash",
                submitting: false,
                expenditureType: "Normal Expenditure",
              },
            });
            this._supplierAcc.clear();
          },
          (err) => {
            console.log(err);
            this.setState({ submitting: false });
          }
        );
      }
    } else {
      if (!expenditureList.length) {
        _warningNotify("Please provide expenditure description");
      } else {
        const rawData = [];
        expenditureList.forEach(
          ({
            description,
            amount,
            accHead,
            collectedBy,
            mode,
            sourceAcct,
            date,
          }) =>
            rawData.push({
              amount,
              description,
              source: sourceAcct,
              userId: this.props.user.id,
              receiptsn: receiptNo,
              receiptno: receiptId,
              modeOfPayment: mode,
              destination: accHead,
              facilityId,
              collectedBy,
              batchNarration: "No Branch",
              transaction_type: "Expenses",
              transaction_source: accHead,
              debit: accHead,
              credit: collectedBy,
              debited: amount,
              credited: 0,
              enteredBy: user,
              transaction_date: date,
            })
        );
        // let data = {
        //   data: _convertArrOfObjToArr(rawData),
        //   total,
        // };

        // let route = 'transactions/expenditure';
        // let callback = (results) => {
        //   _customNotify('Saved!');
        //   this.setState({ submitting: false });
        //   this.resetPage();
        // };

        // let error_cb = (err) => {
        //   _warningNotify('There was an error from the server');
        //   this.setState({ submitting: false });
        // };

        // console.log(data)

        for (let i = 0; i < rawData.length; i++) {
          // _postData({ route, rawData[0] })
          _postApi(`${apiURL()}/transactions/expenditure`, rawData[i]);
        }
        // rawData.forEach(item => )
        _customNotify("Saved!");
        this.setState({ submitting: false });
        this.resetPage();
      }
    }
  };
  handleDisburse = () => {
    // alert("Disbursing...");
    this.setState({ submitting: true });
    const user = this.props.user.username;
    const facilityId = this.props.user.facilityId;
    const {
      expFormDetails: { receiptId, receiptNo },
      expenditureForm: { expenditureType, mode, sourceAcct, supplier_info },
      supplierId,
    } = this.state;
    const totalAmount = this.props.tableData.reduce(
      (a, b) => a + parseInt(b.propose_amount),
      0
    );
    const totalAdditionalExp =
      this.props.additionalExpenses &&
      this.props.additionalExpenses.reduce(
        (a, b) => a + parseFloat(b.amount),
        0
      );
    const grandTotal = parseFloat(totalAmount) + parseFloat(totalAdditionalExp);
    // const {tableData}=this.props
    if (expenditureType === "Supplier Payment" && !this.vendor) {
      if (supplierId === "") {
        _warningNotify("Please select a supplier");
      } else {
        let txnDetails = {
          supplierId: supplierId,
          amount: grandTotal,
          receiptsn: receiptNo,
          receiptno: receiptId,
          modeOfPayment: mode,
          sourceAcct,
          description: "Supplier Payment",
        };

        _postApi(
          `${apiURL()}/transactions/supplier-payment`,
          txnDetails,
          (data) => {
            _customNotify("Transaction recorded!");
            this.setState({
              expenditureForm: {
                date: today,
                accHead: "",
                mode: "Cash",
                submitting: false,
                // expenditureType: "Normal Expenditure",
              },
            });
            this._supplierAcc.clear();
            this.props.history.push("/me/account/purchase/record/table");
          },
          (err) => {
            console.log(err);
            this.setState({ submitting: false });
          }
        );
      }
    } else {
      if (!this.props.tableData.length) {
        _warningNotify("Please provide expenditure description");
      } else {
        const rawData = [];
        // {
        //   transaction_source: this.state.expenditureForm.accHead,
        //     source: this.state.expenditureForm.sourceAcct,
        //     debit: this.state.expenditureForm.accHead,
        //     destination: this.state.expenditureForm.accHead,
        //     collectedBy: "",
        //     userId: this.props.user.username,
        //     credit: "",
        //     amount: grandTotal,
        //     debited: grandTotal,
        //     credited: 0,
        //     enteredBy: user,
        //     receiptsn: this.state.expFormDetails.receiptNo,
        //     receiptno: this.state.expFormDetails.receiptId,
        //     description: this.state.expenditureForm.narration,
        //     facilityId,
        //     modeOfPayment: this.state.expenditureForm.mode,
        // }
        this.props.tableData.forEach((item) =>
          rawData.push({
            transaction_source: this.state.expenditureForm.accHead,
            source: this.state.expenditureForm.sourceAcct,
            debit: this.state.expenditureForm.accHead,
            destination: this.state.expenditureForm.accHead,
            collectedBy: "",
            userId: this.props.user.username,
            credit: "",
            amount: item.propose_amount,
            debited: item.propose_amount,
            credited: 0,
            enteredBy: user,
            receiptsn: this.state.expFormDetails.receiptNo,
            receiptno: this.state.expFormDetails.receiptId,
            description: item.item_name,
            facilityId,
            modeOfPayment: this.state.expenditureForm.mode,
            batchNarration: this.state.expenditureForm.narration,
          })
        );
        this.props.additionalExpenses.forEach((item) =>
          rawData.push({
            transaction_source: this.state.expenditureForm.accHead,
            source: this.state.expenditureForm.sourceAcct,
            debit: this.state.expenditureForm.accHead,
            destination: this.state.expenditureForm.accHead,
            collectedBy: "",
            userId: this.props.user.username,
            credit: "",
            amount: item.amount,
            debited: item.amount,
            credited: 0,
            enteredBy: user,
            receiptsn: this.state.expFormDetails.receiptNo,
            receiptno: this.state.expFormDetails.receiptId,
            description: item.description,
            facilityId,
            modeOfPayment: this.state.expenditureForm.mode,
            batchNarration: this.state.expenditureForm.narration,
          })
        );
        console.log(rawData);

        const data = {
          rawData,
          formTitle: this.props.formTitle,
          supplier_info,
        };

        console.log(data);
        const callBack = () => {
          _customNotify("Saved!");
          this.setState({ submitting: false });
          this.getExpensesByID();
          this.props.history.push("/me/account/purchase/record/table");
        };
        const error = () => {
          this.setState({ submitting: false });
          _warningNotify("error occured");
        };
        _postApi(
          `${apiURL()}/update/purchase/transaction/status`,
          data,
          callBack,
          error
        );
      }
    }
  };
  handleAddClick = (e) => {
    e.preventDefault();
    const { expenditureForm } = this.state;
    // console.log(this.state.expenditureForm)
    if (
      expenditureForm.description &&
      expenditureForm.description !== "" &&
      expenditureForm.amount &&
      expenditureForm.amount !== "" &&
      expenditureForm.collectedBy &&
      expenditureForm.collectedBy !== "" &&
      expenditureForm.accHead !== ""
    ) {
      this.setState((prevState) => ({
        total: parseInt(prevState.total) + parseInt(expenditureForm.amount),
        expenditureList: [
          ...prevState.expenditureList,
          { ...expenditureForm, date: expenditureForm.date },
        ],
      }));

      this.setState((prev) => ({
        expenditureForm: {
          // date: today,
          ...prev.expenditureForm,
          accHead: "",
          mode: "Cash",
          expenditureType: "Normal Expenditure",
          description: "",
          sourceAcct: "400025",
          amount: "",
          collectedBy: "",
        },
      }));
      this._accHead.clear();
    } else {
      this.setState({ formErr: "Please enter all fields" });
    }
  };

  handleDelete = (exp) =>
    this.setState((prevState) => ({
      total: parseInt(prevState.total) - parseInt(exp.amount),
      expenditureList: prevState.expenditureList.filter(
        (i) => i.description !== exp.description
      ),
    }));

  handleExpenseHeadSelected = (val) => {
    if (val.length) {
      let head = val[0].head;
      this.setState((prev) => ({
        expenditureForm: {
          ...prev.expenditureForm,
          accHead: head,
          accHeadDescription: val[0].description,
        },
      }));

      _fetchApi(`${apiURL()}/account/get-children/${head}`, (data) => {
        if (data.success) {
          if (data.results.length) {
            this.setState((prev) => ({
              expenditureForm: {
                ...prev.expenditureForm,
                showSubAccHead: true,
                subAccHeadList: data.results,
              },
            }));

            // handleAddBatchTest(
            //   data.results,
            //   `${lab.title.substr(0, 1)}000`,
            //   lab.title,
            //   lab
            // );
            // console.log("has children", data.results);
          } else {
            console.log("no children");
            // handleTestAdd(lab, `${lab.title.substr(0, 1)}000`, "");
          }
        }
      });
    }
  };

  render() {
    const {
      props: { expensesHeads },
      state: {
        tableData,
        expenditureForm: {
          subAccHeadList,
          expenditureType,
          collectedBy,
          amount,
          sourceAcct,
          description,
          accHead,
          accHeadDescription,
          showSubAccHead,
        },
        expFormDetails,
        formErr,
        submitting,
        expenditureList,
        total,
      },
      // toggle,
      handleInputChange,
      handleSubmit,
      handleDisburse,
      handleAddClick,
      handleDelete,
    } = this;
    const formIsSupplierPayment = expenditureType === "Supplier Payment";
    let totals =
      tableData && tableData.reduce((a, b) => a + parseFloat(b.amount), 0);
    const totalAmount =
      this.props.tableData &&
      this.props.tableData.reduce((a, b) => a + parseInt(b.propose_amount), 0);
    const totalAdditionalExp =
      this.props.additionalExpenses &&
      this.props.additionalExpenses.reduce(
        (a, b) => a + parseFloat(b.amount),
        0
      );
    const grandTotal = parseFloat(totalAmount) + parseFloat(totalAdditionalExp);
    return (
      <div>
        <Card>
          <CardHeader
            tag="div"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <BackButton />
            <h5 className="text-center">
              {this.props.location.pathname.includes(
                "/me/account/purchase/record/form"
              )
                ? "Purchase Order Payment "
                : "Expenditure Form"}
            </h5>
            <div>
              <span style={{ marginRight: 5, fontWeight: "bold" }}>
                Receipt No:
              </span>
              {this.props.location.pathname.includes(
                "/me/account/purchase/record/form"
              ) ? (
                <span>{this.state.expFormDetails.receiptNo}</span>
              ) : (
                <span>{this.state.expFormDetails.receiptNo}</span>
              )}
            </div>
          </CardHeader>
          <CardBody>
            {/* {JSON.stringify(tableData)} */}
            <div className="row">
              <SelectInput
                labelClass="font-weight-normal"
                label="Expenditure Type"
                container="col-md-4"
                name="expenditureType"
                options={["Normal Expenditure", "Supplier Payment"]}
                value={expenditureType}
                onChange={handleInputChange}
              />
              {formIsSupplierPayment ? (
                <>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="name">Supplier Name</Label>
                      <Input
                        disabled
                        type="name"
                        name="name"
                        value={this.state.supplierInfo.supplier_name}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label>Balance</Label>
                      <Input
                        disabled
                        // type="number"
                        value={this.state.supplierInfo.balance}
                      />
                    </FormGroup>
                  </Col>
                </>
              ) : null}
            </div>
            {/* {JSON.stringify(this.state.supplierInfo)} */}
            <FormGroup row>
              <div className="col-md-4 col-lg-4">
                <label>Date:</label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  onChange={({ target }) =>
                    this.setState((prev) => ({
                      expFormDetails: {
                        ...prev.expFormDetails,
                        date: target.value,
                      },
                    }))
                  }
                  value={expFormDetails.date ? expFormDetails.date : ""}
                />
              </div>
              {/* {this.} */}
              {formIsSupplierPayment ? (
                <>
                  <AutoComplete
                    label="Select Supplier"
                    labelClass="font-weight-normal"
                    options={this.props.suppliers}
                    labelKey="supplier_name"
                    containerClass="col-md-4"
                    onInputChange={(val) => console.log(val)}
                    onChange={(item) => {
                      console.log(item);
                      if (item.length) {
                        this.setState({
                          supplierId: item[0].id,
                          supplier: item[0].supplier_name,
                          supplierInfo: item[0],
                        });
                      }
                    }}
                    _ref={(ref) => (this._supplierAcc = ref)}
                  />
                  <div className="col-md-4 col-lg-4">
                    <label>Payment Source:</label>
                    <Typeahead
                      align="justify"
                      labelKey="description"
                      id="accHead"
                      ref={(ref) => (this._accHead = ref)}
                      options={expensesHeads.length ? expensesHeads : [""]}
                      onChange={(val) => {
                        if (val.length)
                          this.setState((prev) => ({
                            expenditureForm: {
                              ...prev.expenditureForm,
                              accHead: val[0].head,
                            },
                          }));
                      }}
                      onInputChange={(name) =>
                        this.setState((prev) => ({
                          expenditureForm: {
                            ...prev.expenditureForm,
                            accHead: name,
                          },
                        }))
                      }
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="col-md-4 col-lg-4">
                    <label>Select Source Account:</label>
                    <Typeahead
                      align="justify"
                      labelKey="description"
                      id="accHead"
                      ref={(ref) => (this._accHead = ref)}
                      options={expensesHeads.length ? expensesHeads : [""]}
                      onChange={this.handleExpenseHeadSelected}
                    />
                  </div>
                  {showSubAccHead ? (
                    <div className="col-md-4 col-lg-4">
                      <label>Select {accHeadDescription}:</label>
                      <Typeahead
                        align="justify"
                        labelKey="description"
                        id="accHead"
                        // ref={(ref) => (this._accHead = ref)}
                        options={subAccHeadList.length ? subAccHeadList : [""]}
                        onChange={(val) => {
                          if (val.length)
                            this.setState((prev) => ({
                              expenditureForm: {
                                ...prev.expenditureForm,
                                accHead: val[0].head,
                              },
                            }));
                        }}
                        onInputChange={(name) =>
                          this.setState((prev) => ({
                            expenditureForm: {
                              ...prev.expenditureForm,
                              accHead: name,
                            },
                          }))
                        }
                      />
                    </div>
                  ) : null}
                  <div className="col-md-4 col-lg-4">
                    <label>Collected By</label>
                    <input
                      type="text"
                      className="form-control"
                      name="collectedBy"
                      onChange={handleInputChange}
                      value={collectedBy ? collectedBy : ""}
                    />
                  </div>
                  {this.props.location.pathname.includes(
                    "/me/account/purchase/record/form"
                  ) ? (
                    <div className="col-md-4 col-lg-4">
                      <FormGroup>
                        <Label for="name">Supplier Account</Label>
                        <Input
                          type="select"
                          name="supplier_info"
                          value={this.state.expenditureForm.supplier_info}
                          onChange={({ target: { name, value } }) => {
                            this.setState((prev) => ({
                              expenditureForm: {
                                ...prev.expenditureForm,
                                [name]: value,
                              },
                            }));
                          }}
                        >
                          <option>--Select--</option>
                          {this.props.supplierAccountInfo.map((item) => (
                            <option
                              value={`${item.bank_name}(${
                                item.account_number
                              })`}
                            >{`${item.bank_name}(${
                              item.account_number
                            })`}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </div>
                  ) : (
                    ""
                  )}
                </>
              )}
            </FormGroup>

            <FormGroup row>
              <div className="col-md-4 col-lg-4">
                <label>Total Amount:</label>
                <input
                  type="number"
                  className="form-control"
                  name="amount"
                  onChange={handleInputChange}
                  value={
                    this.props.location.pathname.includes(
                      "/me/account/purchase/record/form"
                    )
                      ? formatNumber(grandTotal)
                      : amount
                  }
                />
              </div>
              <div className="col-md-4 col-lg-4">
                <Label for="source-acct">Mode of Payment:</Label>
                <select
                  value={sourceAcct}
                  onChange={({ target: { value } }) => {
                    // console.log(value)
                    this.setState((prev) => ({
                      expenditureForm: {
                        ...prev.expenditureForm,
                        sourceAcct: value,
                      },
                    }));
                  }}
                  className="form-control"
                >
                  {!formIsSupplierPayment && (
                    <option value="400025">Petty Cash</option>
                  )}
                  {/* {user.role === "Admin" && ( */}
                  {/* <option value="400021">Cash</option> */}
                  {/* // )} */}
                  {/* {user.role === "Admin" && ( */}
                  <option value="400022">Bank</option>
                  {/* // )} */}
                </select>
              </div>
              <div className="col-md-4 col-lg-4">
                <label>Narration</label>
                <input
                  type="text"
                  className="form-control"
                  name="description"
                  onChange={handleInputChange}
                  value={description ? description : ""}
                />
              </div>
            </FormGroup>
            <p className="text-center" style={{ color: "red" }}>
              {formErr}
            </p>
            <FormGroup row>
              <button
                className="btn btn-secondary col-xs-12 col-sm-12 offset-md-4 offset-lg-4 col-md-6 col-lg-4"
                onClick={formIsSupplierPayment ? handleSubmit : handleAddClick}
              >
                {/* <FaPlus style={{ marginRight: 5 }} /> */}
                {formIsSupplierPayment ? "Submit now" : "Add Expenditure"}
              </button>
            </FormGroup>
            <div>
              {this.props.location.pathname.includes(
                "/me/account/purchase/record/form"
              ) ? (
                <ExpenditureTable
                  tableData={this.props.tableData}
                  totalAmount={totalAmount}
                  additionalExpenses={this.props.additionalExpenses}
                />
              ) : (
                <ExpenditureList
                  list={expenditureList}
                  total={total}
                  onDelete={handleDelete}
                />
              )}
            </div>
          </CardBody>
          <CardFooter>
            <button
              disabled={
                this.props.location.pathname.includes(
                  "/me/account/purchase/record/form"
                )
                  ? accHead === ""
                  : null
              }
              className="btn btn-primary offset-md-4 offset-lg-4 col-md-4 col-lg-4"
              onClick={
                this.props.location.pathname.includes(
                  "/me/account/purchase/record/form"
                )
                  ? handleDisburse
                  : handleSubmit
              }
            >
              {submitting ? (
                <LoadingSM />
              ) : this.props.location.pathname.includes(
                  "/me/account/purchase/record/form"
                ) ? (
                "Disburse Money"
              ) : (
                "Submit"
              )}
            </button>
          </CardFooter>
          {/* )} */}
        </Card>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  getExpensesAccHeads: () => dispatch(getExpensesAccHeads()),
  getAllSuppliers: () => dispatch(getAllSuppliers()),
});

const mapStateToProps = ({
  transactions: { expensesHeads },
  auth: { user },
  pharmacy: { suppliers },
}) => ({ expensesHeads, user, suppliers });

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Expenditure);

const ExpenditureTable = ({
  tableData = [],
  totalAmount = 0,
  additionalExpenses = [],
}) => {
  return (
    <>
      <Table bordered>
        <thead>
          <tr>
            <th className="text-center">S/N</th>
            <th className="text-center">Item Name</th>
            <th className="text-center">P. Qty</th>
            <th className="text-center">Price</th>
            <th className="text-center">Amt</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, i) => (
            <tr>
              <td key={i}>{i + 1}</td>
              <td>
                <Input
                  type="text"
                  value={item.item_name}
                  name="item_name"
                  disabled
                  // onChange={(e) => {
                  //   let name = e.target.name;
                  //   let value = e.target.value;
                  //   handleTableInputChange(name, value, i);
                  // }}
                />
              </td>
              <td className="text-center">
                <Input
                  className="text-center"
                  // type="number"
                  value={formatNumber(item.propose_quantity)}
                  disabled
                  name="propose_quantity"
                />
              </td>
              <td className="text-right">
                <Input
                  className="text-right"
                  name="price"
                  value={formatNumber(item.price)}
                  // type="number"
                  disabled
                />
              </td>
              <td className="text-right">
                <Input
                  className="text-right"
                  // type="number"
                  name="propose_amount"
                  value={formatNumber(item.propose_amount)}
                  disabled
                />
              </td>
            </tr>
          ))}
          <tr>
            <th colSpan={4} className="text-right">
              Total
            </th>
            <th className="text-right">{formatNumber(totalAmount)}</th>
          </tr>
        </tbody>
      </Table>
      <ViewAdditionalExpenses list={additionalExpenses} />
    </>
  );
};

function ExpenseDetails({ tableData = [], totals }) {
  return (
    <>
      <Table hover striped bordered>
        <thead>
          <tr>
            <th>Date</th>
            <th>Month</th>
            <th>Request No</th>
            <th>Branch</th>
            <th className="text-center">Amount (₦)</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, i) => (
            <tr key={i}>
              <td>{item.date}</td>
              <td>{item.month}</td>
              <td>{item.request_no}</td>
              <td>{item.branch_name}</td>
              <td className="text-right">{formatNumber(item.amount)}</td>
            </tr>
          ))}
          <tr>
            <th colSpan={3} />
            <th className="text-right">Total:</th>
            <th className="text-right">{formatNumber(totals)}</th>
          </tr>
        </tbody>
      </Table>
    </>
  );
}

// function ExpenditureModal({
//   toggle,
//   expForm,
//   modal,
//   className,
//   handleInputChange,
//   handleAddClick,
//   formErr
// }) {
//   return (
//     <Modal isOpen={modal} toggle={toggle} className={className} size="lg">
//       <ModalHeader toggle={toggle}>Add Expenditure</ModalHeader>
//       <ModalBody>
//         <Form>
//           <div className="col-md-12 col-lg-12" style={{margin:5}}>
//             <label>
//               Description
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               name="description"
//               onChange={handleInputChange}
//               value={expForm.description ? expForm.description : ''}
//             />
//           </div>
//           <div className="col-md-12 col-lg-12" style={{margin:5}}>
//             <label>
//               Amount:
//             </label>
//             <input
//               type="number"
//               className="form-control"
//               name="amount"
//               onChange={handleInputChange}
//               value={expForm.amount ? expForm.amount : ''}
//             />
//           </div>
//           <p className="text-center" style={{color:'red'}}>{formErr}</p>
//         </Form>
//       </ModalBody>
//       <ModalFooter>
//         <button className="btn btn-primary col-md-3" onClick={handleAddClick}>
//           Add
//         </button>
//       </ModalFooter>
//     </Modal>
//   )
// }
