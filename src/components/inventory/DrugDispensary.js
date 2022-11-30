import React from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  ModalHeader,
  Modal,
  ModalBody,
  ModalFooter,
  InputGroup,
  InputGroupAddon,
  Row,
  Col,
  Table,
} from "reactstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import {
  today,
  _customNotify,
  formatNumber,
  _warningNotify,
} from "../utils/helpers";
import { connect } from "react-redux";
import { LoadingSM } from "../loading";
// import { IoMdArrowBack } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { _fetchApi, _postApi, _updateApi } from "../../redux/actions/api";
import { apiURL } from "../../redux/actions";
import TextInput from "../comp/components/InputGroup";
import BranchName from "../utils/GlobalHelper";
// import PurchaseTableStore from "./PurchaseTableStore";
import ModalExample from "./Modal";
import { withRouter } from "react-router";
import { compose } from "redux";
import BackButton from "../comp/components/BackButton";
import Scrollbars from "react-custom-scrollbars";
import CustomButton from "../comp/components/Button";
import { batchAddDrugs, getAllSuppliers, getDrugList } from "../../redux/actions/pharmacy";
import { getReqBranches,getRequisitionList } from "../../redux/actions/account";
import SearchItem from "./SearchItem";
class DrugDispensary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: today,
      error: "",
      purchasedBy: `${props.firstname} ${props.lastname}`,
      purchase: [],
      item_name: "",
      item_code: "",
      quantity: 0,
      receiptNo: "",
      supplier: "",
      supplierId: "",
      branch_location: this.branch_name,
      unit_of_issue: "",
      mark_up: 0,
      reorder_level: "",
      cost: 0,
      amount: 0,
      other_expenses: 0,
      // paymentStatus: 'paid',
      recieptPicture: "",
      expiryDate: "",
      modalIsOpen: false,
      warningAlertOpen: false,
      radioInput: "fixed",
      cost_price: 0,
      markUp: 0,
      selling_price: 0,
      quantity_avail: 0,
      totalAmount: 0,
      itemSource: "store",
      p_mark_up: 0,
      grace: 0,
      paymentStatus: "Full Payment",
      modeOfPayment: "Cash",
      amountPaid: "",
      sourceAcct: "400021",
      trn: 0,
      store_type: "",
      po_no: "",
      grm_no: "",
      modal: false,
      request: this.requisitionNo,
      loading: false,
      itemModal: false,
      newItem: [],
      // setIndex: 0,
    };

    this.qttyRef = React.createRef();
    this.dispensaryDrugCodeRef1 = React.createRef();
    this.dispensaryDrugCodeRef2 = React.createRef();
    this.markupRef = React.createRef();
  }

  toggle = () => {
    this.setState((prev) => ({ modal: !prev.modal }));
  };

  itemToggle = () => {
    this.setState((prev) => ({ itemModal: !prev.itemModal }));
  };

  item_name = new URLSearchParams(this.props.location.search).get("item_name");
  branch_name = new URLSearchParams(this.props.location.search).get("branch");
  requisitionNo = new URLSearchParams(this.props.location.search).get(
    "requisitionNo"
  );

  getBranchesName = () => {
    _fetchApi(
      `${apiURL()}/account/get-all/branches`,
      (data) => {
        if (data.success) {
          this.setState({ branch_name: data.results });
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  approveStatus = (requisition_no, item_name, approved_qty) => {
    const status = "Approve";
    _updateApi(
      `${apiURL()}/account/update/req_branch/${status}/${requisition_no}?item_name=${item_name}&approved_qty=${approved_qty}`,
      {},
      (success) => {
        this.props.getRequisitionList();
      },
      (err) => {
        console.log(err);
      }
    );
  };

  closeWarning = () => this.setState({ warningAlertOpen: false });

  confirmWarning = () => this.props.hidePurchaseRecord();

  hidePurchaseRecord = () => {
    if (this.state.purchase.length) {
      this.setState({ warningAlertOpen: true });
      // let confirmation = window.confirm(
      //   'Any data entered would be lost, Sure to go back?'
      // );
      // if (confirmation) {
      //   this.props.hidePurchaseRecord();
      // }
    } else {
      this.props.hidePurchaseRecord();
    }
  };
  getTrn = () => {
    let grn = "trn";
    _fetchApi(
      `${apiURL()}/get/number/generator/${grn}`,
      (data) => {
        if (data.success) {
          this.setState({
            trn: data.results.trn,
          });
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };
  toggleModal = () =>
    this.setState((prev) => ({
      modalIsOpen: !prev.modalIsOpen,
    }));

  handleChange = ({ target: { name, value } }) => {
    this.setState((prevState) => ({
      error: "",
      [name]: value,
    }));
  };

  resetFormData = () =>
    this.setState({
      item_name: "",
      item_code: "",
      quantity: 0,
      receiptNo: "",
      other_expenses: 0,
      unit_of_issue: "",
      reorder_level: "",
      cost_price: 0,
      markUp: 0,
      mark_up: 0,
      selling_price: 0,
      cost: 0,
      amount: 0,
      grace: 0,
      expiryDate: "",
      recieptPicture: "",
      p_mark_up: 0,
      quantity_avail: 0,
      // grace: 0,
    });
  componentWillMount() {
    document.addEventListener("keydown", this.handleKeyPress);
    this.getTrn();
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  }

  handleKeyPress = (e) => {
    switch (e.key) {
      // f2
      case "F2":
        return this.handleSubmit();

      // f6
      case "F6":
        return console.log("Presssed ", e.key);
      // f7
      case "F7":
        return console.log("Presssed f2", e.key);
      case "F10":
        return this.handleSubmit();
      // e
      case "e":
        this.setState({ editMode: true });
        break;

      default:
        return null;
    }
  };

  addItemToList = () => {
    const {
      item_name,
      receiptNo,
      supplier,
      supplierId,
      branch_location,
      unit_of_issue,
      reorder_level,
      cost,
      amount,
      paymentStatus,
      expiryDate,
      po_no,
      grm_no,
      date,
      store_type,trn
    } = this.state;
    const { quantity } = this.props.goodTranfer;
    if (
      item_name === "" ||
      quantity === "" ||
      cost === "" ||
      // ||expiryDate === ''
      branch_location === ""
    ) {
      _warningNotify("Quantity is not filled");
    } else {
      if (
        (this.props.goodTranfer.markUp === 0 ||
          this.props.goodTranfer.markUp === "") &&
        this.state.grace === 0
      ) {
        this.setState({ grace: 1 });
        this.markupRef.current.focus();
      } else {
        if (
          this.props.pharmHasStore &&
          parseFloat(quantity) > parseFloat(this.state.quantity_avail)
        ) {
          _warningNotify("Insufficient quantity in Store");
        } else {
          let _qtty = 0;
          let list = this.state.purchase;
          for (let i = 0; i < list.length; i++) {
            let currentDrug = list[i];
            if (
              currentDrug.item_name === item_name &&
              currentDrug.branch_location === branch_location
            ) {
              _qtty = _qtty + parseFloat(currentDrug.quantity);
            }
          }
          // if (
          //   this.props.pharmHasStore &&
          //   _qtty + parseFloat(quantity) > parseFloat(this.state.quantity_avail)
          // ) {
          //   _warningNotify("Insufficient quantity in Store");
          // } else {
          const newEntries = {
            item_name,
            item_code: this.state.item_code,
            quantity: this.props.goodTranfer.quantity,
            receiptNo,
            supplier,
            branch_location,
            unit_of_issue,
            reorder_level,
            cost_price: cost,
            supplierId,
            markUp: this.props.goodTranfer.markUp,
            selling_price: this.props.goodTranfer.sellingPrice,
            cost: this.props.goodTranfer.unitCost,
            amount:
              this.props.goodTranfer.sellingPrice *
              this.props.goodTranfer.quantity,
            paymentStatus,
            expiryDate,
            requisitionNo: this.requisitionNo,
            po_no,
            grm_no,
            receive_date: date,
            store_type,trn
          };
          this.setState(
            (prevState) => ({
              purchase: [...prevState.purchase, newEntries],
              modalIsOpen: false,
              totalAmount:
                parseFloat(prevState.totalAmount) + parseFloat(amount),
            }),

            () => {
              this.dispensaryDrugCodeRef1.current.clear();
              this.dispensaryDrugCodeRef1.current.focus();
              this.resetFormData();
              this.props.resetGrnForm();
            }
          );
        }
      }
      // }
    }
  };

  handleAdd = (e) => {
    e.preventDefault();
    this.addItemToList();
  };

  handleSubmit = () => {
    const newArray = [];
    const { purchase } = this.state;
    this.setState({ loading: true });

    purchase.forEach((item) => {
      newArray.push({
        receive_date: item.receive_date,
        item_name: item.item_name,
        po_no: item.po_no,
        qty_in: 0,
        qty_out: item.quantity,
        store_type: item.store_type,
        grm_no: item.grm_no,
        expiring_date: item.expiryDate,
        mark_up: item.markUp,
        selling_price: item.selling_price,
        transfer_from: item.store_type,
        transfer_to: item.branch_location,
        query_type: "transfer",
        branch_name: item.branch_location,
        unit_price: item.cost,
        status: "",
        trn: item.trn,
      });
      this.approveStatus(item.requisitionNo, item.item_name, item.quantity);
    });
    const callBack = (success) => {
      console.log(success);
      _customNotify("Submitted Successfully");
      this.props.back();
      this.props.getReqBranches(this.requisitionNo);
      this.props.getRequisitionList();
    };
    const error = (err) => {
      console.log(err);
      // _warningNotify("Error Occurred");Ambu bag Adult Silicon  
      this.props.back();
    };
    let data = {
      newArray,
      trn: this.state.trn,
    };

    _postApi(`${apiURL()}/account/add-new/tranfer`, data, callBack, error);
    this.setState({ loading: false });
  };

  handleRemove = (i) => {
    let newList = this.state.purchase.filter((item, idx) => idx !== i);
    this.setState({ purchase: newList });
    if (newList.length) {
      this.setState((prev) => ({
        purchase: newList,
      }));
    }
  };

  handleMarkUp = (percent) => {
    if (this.state.radioInput === "percentage") {
      let percentage =
        (parseFloat(this.state.cost) * parseFloat(percent)) / 100;
      this.setState({
        mark_up: percentage,
      });
    } else if (this.state.radioInput === "fixed") {
      let fixed = parseFloat(percent);
      this.setState({
        mark_up: fixed,
      });
    } else {
      this.setState({
        mark_up: 0,
      });
    }
  };

  formatNumber = (num) => {
    if (num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    } else {
      return "";
    }
  };

  handleDrugCodeChange = (value, drugInfo) => {
    console.log(drugInfo);
    this.setState({ item_code: value });
    if (drugInfo) {
      this.setState({
        item_name: drugInfo.item_name,
        quantity_avail: drugInfo.balance,
        cost: drugInfo.unit_price,
        expiryDate: drugInfo.expiring_date,
        store_type: drugInfo.store_type,
        po_no: drugInfo.po_no,
        grm_no: drugInfo.grm_no,
      });
      this.props.dispatchUnitCost(parseFloat(drugInfo.unit_price));
    }
    // this.qttyRef.current && this.qttyRef.current.focus();
  };

  _fetch = (item) => {
    fetch(
      `${apiURL()}/account/get/item_name/${
        this.props.facilityId
      }?item_name=${item}`
    )
      .then((resp) => resp.json())
      .then(({ itemInfo }) => {
        console.log(item, itemInfo, "JDJDJDJDJD");
        if (!itemInfo.length) {
          console.log("empty list");
          this.toggle();
        } else if (item && itemInfo.length === 1) {
          console.log("Only one item");
          this.handleDrugCodeChange(item, itemInfo[0]);
          this.dispensaryDrugCodeRef1.current.setState({
            text: item,
          });

          this.dispensaryDrugCodeRef1.current.blur();
        } else {
          this.handleDrugCodeChange(item, this.state.newItem);
          console.log("More than one item", itemInfo);
          this.setState({ itemModal: true, newItem: itemInfo });
          this.dispensaryDrugCodeRef1.current.setState({
            text: item,
          });
          // this.dispensaryDrugCodeRef1.current.focus();
          // alert(
          //   itemInfo.map(
          //     (item, i) => `Name: ${item.item_name} Quantity: ${item.balance}`
          //   )
          // );

          // setIsLoading(false);
        }
      });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    //
    // console.log();
    if (this.props.location !== nextProps.location) {
      let dd = new URLSearchParams(nextProps.location.search).get("item_name");
      let branch = new URLSearchParams(nextProps.location.search).get("branch");
      let req = new URLSearchParams(nextProps.location.search).get(
        "requisitionNo"
      );
      this._fetch(dd);
      this.setState((p) => ({ ...p, branch_location: branch, request: req }));
      this.props.getRequisitionList();
    }
  }

  componentDidMount() {
    this.props.getAllSuppliers();
    this.props.getRequisitionList();
    this.props.getReqBranches(this.requisitionNo);
    this.props.getDrugsList();
    this.getBranchesName();
    if (this.item_name) {
      this._fetch(this.item_name);
      // this.props.getBranchReq()
    }
  }

  render() {
    const {
      handleAdd,
      handleChange,
      handleDrugCodeChange,
      qttyRef,
      dispensaryDrugCodeRef1,
      dispensaryDrugCodeRef2,
      state: {
        other_expenses,
        error,
        purchase,
        item_code,
        quantity,
        cost,
        expiryDate,
        item_name,
        sourceAcct,
        loading,
        newItem,
      },
      props: { drugs, suppliers, pharmHasStore },
    } = this;
    return (
      <div>
        <BackButton />
        <Modal isOpen={this.state.itemModal} toggle={this.itemToggle}>
          <ModalHeader>Select Item</ModalHeader>
          <ModalBody>
            <Table>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              {newItem.map((item, index) => (
                <tbody>
                  <tr key={index}>
                    <td>{item.item_name}</td>
                    <td>{item.balance}</td>
                    <td>{item.unit_price}</td>
                    <td>
                      <Button
                        color="success"
                        size="sm"
                        onClick={() => {
                          this.itemToggle();
                          handleDrugCodeChange("", item);
                        }}
                      >
                        Select
                      </Button>
                    </td>
                  </tr>
                </tbody>
              ))}
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.itemToggle} color="danger">
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        <Scrollbars style={{ height: 600 }}>
          <Card style={{ margin: "5px 0" }}>
            <CardHeader tag="h5" style={{ margin: 0 }}>
              <ShortcutGuide />
            </CardHeader>
            {/* {JSON.stringify(purchase)} */}
            <CardBody>
              <ModalExample
                toggle={this.toggle}
                modal={this.state.modal}
                title="Item Status"
                submitText="Okay"
                text={`This item is not available in the store now`}
                // handleSubmit={alert("Coming soon")}
              />
              <Form onSubmit={handleAdd}>
                {!this.props.pharmHasStore && (
                  <Row>
                    <div className="col-md-4 col-lg-4">
                      <Label for="wupplier">Supplier Name:</Label>
                      <Typeahead
                        allowNew
                        autoFocus={!pharmHasStore}
                        align="justify"
                        id="supplier"
                        labelKey="supplier_name"
                        options={
                          suppliers.length ? suppliers : [{ supplier_name: "" }]
                        }
                        onInputChange={(val) => console.log(val)}
                        onChange={(item) => {
                          if (item.length) {
                            this.setState({
                              supplierId: item[0].id,
                              supplier: item[0].supplier_name,
                            });
                          }
                        }}
                      />
                    </div>

                    <div className="col-md-3 col-lg-3">
                      <Label for="source-acct">Select Source Account:</Label>
                      <select
                        value={sourceAcct}
                        onChange={(e) =>
                          this.setState({ sourceAcct: e.target.value })
                        }
                        className="form-control"
                      >
                        <option value="400021">Cash</option>
                        <option value="400025">Petty Cash</option>
                        <option value="400022">Bank</option>
                      </select>
                    </div>
                  </Row>
                )}
                <Row>
                  <Col md={4}>
                    <b>Good Transfer No.:</b> {this.state.trn}
                    {/* <Label>{JSON.stringify(this.branch_name)}</Label> */}
                  </Col>
                </Row>
                <hr className="my-1" />
                <FormGroup row>
                  <div className="col-md-4 col-lg-4">
                    {pharmHasStore ? (
                      <>
                        <Label for="exampleFile">Item</Label>
                        <SearchItem
                          autoFocus={pharmHasStore}
                          _ref={dispensaryDrugCodeRef1}
                          handleResult={handleDrugCodeChange}
                        />
                      </>
                    ) : (
                      <TextInput
                        autoFocus={pharmHasStore}
                        _ref={dispensaryDrugCodeRef2}
                        label="Drug Code"
                        container="col-md-12 col-lg-12 p-0 m-0"
                        value={item_code}
                        name="item_code"
                        onChange={(e) =>
                          this.setState({ item_code: e.target.value })
                        }
                      />
                    )}
                  </div>

                  <div className="col-md-5 col-lg-4">
                    <Label for="item_name">Item Name </Label>
                    {pharmHasStore ? (
                      <label className="form-control">
                        {this.state.item_name}
                      </label>
                    ) : (
                      <Typeahead
                        allowNew
                        align="justify"
                        id="drugs"
                        labelKey="drug"
                        options={drugs.length ? drugs : [{ drug: "" }]}
                        onInputChange={(val) =>
                          this.setState({ item_name: val })
                        }
                        onChange={(item) => {
                          if (item.length) {
                            const { drug, branch_location } = item[0];
                            this.setState({
                              item_name: drug,
                              branch_location: branch_location,
                            });
                          }
                        }}
                        ref={(ref) => (this.__drug_list = ref)}
                      />
                    )}
                  </div>
                  <BranchName
                    editable={false}
                    value={this.state.branch_location}
                    handleChange={(e) =>
                      this.setState({ branch_location: e.target.value })
                    }
                    name="branch_location"
                  />
                </FormGroup>
                <FormGroup row>
                  <div className="col-md-4 col-lg-4">
                    <Label for="qantity">Quantity</Label>
                    <input
                      onChange={({ target: { value } }) => {
                        this.setState((prev) => ({
                          error: "",
                          quantity: value,
                          amount: parseFloat(value) * parseFloat(prev.cost),
                          selling_price:
                            parseFloat(prev.cost) +
                            parseFloat(this.state.other_expenses) +
                            parseFloat(this.state.mark_up),
                        }));
                        this.props.dispatchQty(parseFloat(value));
                        this.props.dispatchCalculation();
                      }}
                      className="form-control"
                      type="number"
                      name="quantity"
                      id="quantity"
                      onFocus={() => this.setState({ quantity: "" })}
                      value={quantity}
                      ref={qttyRef}
                    />
                  </div>
                  <div className="col-md-4 col-lg-4">
                    <Label for="cost">Unit Cost</Label>
                    {pharmHasStore ? (
                      <label className="form-control">{cost}</label>
                    ) : (
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">₦</InputGroupAddon>
                        <Input
                          // disabled
                          onChange={({ target: { value } }) => {
                            this.setState((prev) => ({
                              cost: value,
                              amount:
                                parseFloat(value) * parseFloat(prev.quantity),
                              cost_price: parseFloat(value),

                              markUp:
                                (parseFloat(value) * parseFloat(prev.mark_up)) /
                                100,
                            }));
                          }}
                          onFocus={() => this.setState({ cost: "" })}
                          type="number"
                          name="cost"
                          id="cost"
                          value={cost}
                        />
                      </InputGroup>
                    )}
                  </div>
                  <div className="col-md-4 col-lg-4">
                    <Label for="exampleFile">Expiry Date</Label>
                    {pharmHasStore ? (
                      <label className="form-control">{expiryDate}</label>
                    ) : (
                      <Input
                        onChange={handleChange}
                        type="date"
                        // disabled
                        name="expiryDate"
                        id="expiryDate"
                        value={expiryDate}
                      />
                    )}
                  </div>
                </FormGroup>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label>
                        <em>Other Expenses</em>(<b>if any</b>)
                      </Label>
                      <Input
                        type="number"
                        name="other_expenses"
                        value={other_expenses}
                        onFocus={() => {
                          this.setState({
                            other_expenses: "",
                          });
                        }}
                        onChange={(e) => {
                          this.setState({
                            other_expenses: e.target.value,
                            amount:
                              parseFloat(
                                parseFloat(quantity) *
                                  parseFloat(this.state.cost)
                              ) + parseFloat(e.target.value),
                          });
                          this.props.dispatchExpenses(
                            parseFloat(e.target.value)
                          );
                          this.props.dispatchCalculation();
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={8} lg={8}>
                    <div className="row">
                      <Label for="cost" className="col-md-4 col-lg-4 mr-4">
                        <b>Mark up</b>
                      </Label>
                      <FormGroup className="m-0 p-0">
                        <Label className="mr-4 mx-0" htmlFor="percentage">
                          <Input
                            id="percentage"
                            type="radio"
                            name="radio1"
                            checked={
                              this.props.goodTranfer.markUpType === "percentage"
                            }
                            value="percentage"
                            onChange={(e) => {
                              this.props.dispatchMarkUpType(e.target.value);
                              this.props.dispatchCalculation();
                            }}
                            className="mr-2"
                          />
                          Percentage
                        </Label>
                        <Label className="mr-4" htmlFor="fixed">
                          <Input
                            id="fixed"
                            type="radio"
                            name="radio1"
                            checked={
                              this.props.goodTranfer.markUpType === "fixed"
                            }
                            value="fixed"
                            onChange={(e) => {
                              this.setState({});
                              this.props.dispatchMarkUpType(e.target.value);
                              this.props.dispatchCalculation();
                            }}
                            className="mr-2"
                          />
                          Fixed
                        </Label>
                      </FormGroup>
                    </div>
                    {this.props.goodTranfer.markUpType === "percentage" ? (
                      <FormGroup>
                        <Input
                          type="text"
                          placeholder="percentage"
                          className="ml-2 col-6"
                          name="mark_up"
                          onFocus={() => this.setState({ mark_up: "" })}
                          value={this.state.mark_up || ""}
                          onChange={(e) => {
                            this.setState({
                              mark_up: e.target.value,
                            });
                            this.props.dispatchMarkUpValue(
                              parseFloat(e.target.value)
                            );
                            this.props.dispatchCalculation();
                          }}
                        />
                      </FormGroup>
                    ) : this.props.goodTranfer.markUpType === "fixed" ? (
                      <FormGroup>
                        <input
                          ref={this.markupRef}
                          type="text"
                          placeholder="fixed amount"
                          // onFocus={() => this.setState({ p_mark_up: '' })}
                          className={`form-control ml-2 col-6 ${
                            this.state.grace > 0
                              ? "border border-success shadow"
                              : ""
                          }`}
                          name="mark_up"
                          onFocus={() => this.setState({ mark_up: "" })}
                          value={this.state.mark_up || ""}
                          onChange={(e) => {
                            this.setState({
                              mark_up: e.target.value,
                            });
                            this.props.dispatchMarkUpValue(
                              parseFloat(e.target.value)
                            );
                            this.props.dispatchCalculation();
                          }}
                        />
                      </FormGroup>
                    ) : null}
                  </Col>

                  <Col />
                </Row>
                <br />
                <FormGroup row>
                  <div className="col-md-4 col-lg-4">
                    <b>Quantity Available:</b>{" "}
                    {this.formatNumber(this.state.quantity_avail) || 0}
                    <br />
                    <b>Amount:</b>{" "}
                    {this.formatNumber(this.props.goodTranfer.amount) || 0}
                    <br />
                    <b>Cost price:</b>{" "}
                    {this.formatNumber(this.props.goodTranfer.unitCost) || 0}
                    <br />
                    <b>Mark up:</b>{" "}
                    {this.formatNumber(this.props.goodTranfer.markUp) || 0}
                    <br />
                    <b>Selling price:</b> {this.props.goodTranfer.sellingPrice}
                  </div>
                </FormGroup>
                <Button
                  outline
                  size="sm"
                  className="offset-md-5 offset-lg-5 col-md-2 col-lg-2 d-flex align-items-center justify-content-center mb-1"
                  type="submit"
                  color="primary"
                  disabled={
                    this.state.quantity_avail === 0 ||
                    item_name === "" ||
                    quantity === "" ||
                    cost === ""
                    // ||expiryDate === ''
                  }
                >
                  <FaPlus className="mr-2" />
                  Add to list
                </Button>
              </Form>

              {error !== "" ? (
                <span className="text-danger text-center">{error}</span>
              ) : (
                ""
              )}
            </CardBody>
            {purchase.length ? (
              <>
                <CardHeader>
                  <h6 align="center">Items List</h6>
                </CardHeader>
                <CardBody>
                  <p className="font-weight-bold text-right">
                    Total:{" "}
                    {formatNumber(
                      this.state.purchase.reduce((a, b) => a + b.amount, 0)
                    ) || 0}
                  </p>
                  {/* <PurchaseTableStore
                    purchase={purchase}
                    handleRemove={this.handleRemove}
                  /> */}
                  <p className="font-weight-bold text-right">
                    Total:{" "}
                    {formatNumber(
                      this.state.purchase.reduce((a, b) => a + b.amount, 0)
                    ) || 0}
                  </p>
                </CardBody>
                <CardFooter>
                  <CustomButton
                    onClick={this.handleSubmit}
                    className="offset-md-5 offset-lg-5 col-md-2 col-lg-2"
                    color="primary"
                    loading={loading}
                  >
                    {this.props.loading ? <LoadingSM /> : "Submit"}
                  </CustomButton>
                </CardFooter>
              </>
            ) : null}
          </Card>
        </Scrollbars>
        <WarningAlert
          isOpen={this.state.warningAlertOpen}
          close={this.closeWarning}
          confirm={this.confirmWarning}
          content="All data entered on this page will be lost, are you sure you want to exit?"
        />
      </div>
    );
  }
}

export function WarningAlert({
  isOpen = false,
  confirm = (f) => f,
  close = (f) => f,
  content = "",
}) {
  return (
    <Modal isOpen={isOpen} toggle={close}>
      <ModalHeader>Warning</ModalHeader>
      <ModalBody>
        <h6>{content}</h6>
      </ModalBody>
      <ModalFooter>
        <Button onClick={confirm} color="danger">
          Okay
        </Button>
        <Button onClick={close} color="primary">
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export function ShortcutGuide({ edit = true }) {
  return (
    <div className="d-flex">
      <h6 className="my-0 mr-2">
        <u>Shortcut Keys</u>:
      </h6>
      <h6 className="my-0 text-success mr-2">"Press Enter Key"= Add to Cart</h6>
      {edit ? (
        <h6 className="my-0 text-danger mr-2">"Press E Key"= Edit</h6>
      ) : null}
      <h6 className="my-0 text-info">"Press F2 Key"= Checkout</h6>
    </div>
  );
}

function mapStateToProps({ pharmacy, auth, account }) {
  return {
    loading: pharmacy.drugSubmitLoading,
    userId: auth.user.id,
    firstname: auth.user.firstname,
    lastname: auth.user.lastname,
    facilityId: auth.user.facilityId,
    suppliers: pharmacy.suppliers,
    drugs: pharmacy.drugs,
    pharmHasStore: pharmacy.pharmHasStore,
    goodTranfer: pharmacy.goodTranfer,
    branchRegItem: pharmacy.branchRegItem,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAllSuppliers: () => dispatch(getAllSuppliers()),
    submitDrugList: (data, cb) => dispatch(batchAddDrugs(data, cb)),
    getDrugsList: () => dispatch(getDrugList()),
    dispatchMarkUpType: (x) => dispatch({ type: "MARKUPTYPE", payload: x }),
    dispatchMarkUpValue: (x) => dispatch({ type: "MARKUPVALUE", payload: x }),
    dispatchUnitCost: (x) => dispatch({ type: "UNITCOST", payload: x }),
    dispatchQty: (x) => dispatch({ type: "QUANTITY", payload: x }),
    dispatchExpenses: (x) => dispatch({ type: "OTHEREXPENSES", payload: x }),
    dispatchCalculation: () => dispatch({ type: "GOOD_TRANFER_CALCULATION" }),
    resetGrnForm: () =>
      dispatch({
        type: "RESETGRNFORM",
        payload: {
          unitCost: 0,
          quantity: 0,
          otherExpenses: 0,
          markUpType: "fixed",
          markUpValue: 0,
          sellingPrice: 0,
          amount: 0,
          markUp: 0,
        },
      }),
    getReqBranches: (requisition_no) =>
      dispatch(getReqBranches(requisition_no)),
    getRequisitionList: () => dispatch(getRequisitionList()),
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(DrugDispensary);
