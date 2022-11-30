import React, { Component } from "react";
import { Form, FormGroup, Card, CardHeader, CardBody } from "reactstrap";
import { connect } from "react-redux";
// import ServicesList from "./ServicesList";
import {
  today,
  url,
  _warningNotify,
  generateReceiptNo,
  _convertArrOfObjToArr,
  _customNotify,
  formatNumber,
} from "../utils/helpers";
import { FaPlus, FaSave, FaTimes } from "react-icons/fa";
import { Typeahead } from "react-bootstrap-typeahead";
import ServicesPreview from "./ServicesPreview";
import { PDFViewer } from "@react-pdf/renderer";
import { ServicesReceipt } from "../comp/pdf-templates/services";
import Loading from "../loading";
import { getRevAccHeads } from "../../redux/actions/transactions";
import { _fetchApi, _postApi } from "../../redux/actions/api";
import { apiURL } from "../../redux/actions";
import { withRouter } from "react-router";
import { compose } from "redux";
import moment from "moment";
import CustomButton from "../comp/components/Button";
import ServicesList1 from "./ServicesList1";
// import ServicesTxnSetup from './transactions-setup/Services';

class Services extends Component {
  state = {
    patient: {},
    user: "",
    serviceDetails: {
      accHead: "",
      mode: "deposit",
      date: today,
      accountNo: "",
      balance: 0,
      patientId: "",
      amountPaid: "",
      type: "Single",
    },
    total: "0",
    servicesForm: { type: "New", amount: 0 },
    names: [],
    accountNos: [],
    patients: [],
    servicesList: [],
    servicesFlat: [],
    services: [],
    modal: false,
    loading: false,
    isPreviewModal: false,
    saveCostingLoading: false,
    serviceFormAlertText: "",
    preview: false,
    paymentMedium: "deposit",
    receivedData: {},
    uncheckedList: [],
    billing: false,
    loadingPendingBill: false,
    preparingBilling: false,
    bill: {},
    amountStatus: true,
    setupIsOpen: false,
    groupList: [],
    groupData: [],
  };

  getGroupList = () => {
    _postApi(
      `${url}/group-services/select`,
      { query_type: "select", facilityId: this.props.facilityId },
      ({ results }) => {
        console.log(results);
        this.setState((p) => ({ ...p, groupList: results }));
      },
      (error) => _warningNotify(error.toString())
    );
  };

  handleServicesGroup = (name, value, index) => {
    const { servicesList } = this.state;
    let newArr = [];
    servicesList.forEach((item, i) => {
      if (index === i) {
        newArr.push({ ...item, [name]: value, amount: item.cost * value });
      } else {
        newArr.push(item);
      }
    });
    this.setState((p) => ({ ...p, servicesList: newArr }));
  };

  getGroupListData = (val) => {
    let { serviceDetails } = this.state;
    _postApi(
      `${url}/group-services/select`,
      {
        query_type: "group_list",
        facilityId: this.props.facilityId,
        description: val ? val : this.state.servicesForm.service,
      },
      ({ results }) => {
        // console.log(results, "dddddddddddddddddddd");
        // alert(results);
        let newArr = [];

        // this.setState((p) => ({
        //   ...p,
        //   groupData: results,
        // }));
        results.forEach((item) =>
          newArr.push({
            ...item,
            total: parseInt(this.state.total) + parseInt(1 * item.price),
            service: item.description,
            cost: item.price,
            qtty: item.quantity,
            amount: item.quantity * item.price,
            accHead: item.head,
            type: "New",
            date: serviceDetails.date,
            amountPaid: serviceDetails.amountPaid
              ? serviceDetails.amountPaid
              : 0,
          })
        );
        console.log(newArr, "LLLLLLLL");
        this.setState(
          (prevState) => ({
            servicesList: [...prevState.servicesList, ...newArr],
            servicesForm: {
              ...prevState.servicesForm,
              qtty: "",
              amount: "",
              cost: "",
            },
            modal: false,
          }),
          () => this._services_typeahead.clear()
        );
      },
      (error) => _warningNotify(error.toString())
    );
    // console.log(servicesList);
  };

  componentDidMount() {
    this.props.getRevAccHeads();
    this.getUser();
    this.getPatients();
    this.getServices();
    this.getGroupList();
    generateReceiptNo((rec, recId) =>
      this.setState((prevState) => ({
        serviceDetails: Object.assign({}, prevState.serviceDetails, {
          receiptNo: rec,
          receiptId: recId,
        }),
      }))
    );
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    const { servicesForm, serviceDetails } = this.state;

    if (
      serviceDetails.accHead === "" ||
      serviceDetails.accountNo === "" ||
      servicesForm.service === "" ||
      servicesForm.qtty === 0 ||
      servicesForm.qtty === "" ||
      servicesForm.amount === 0 ||
      // servicesForm.amountPaid === "" ||
      servicesForm.amount === ""
    ) {
      this.setState({ serviceFormAlertText: "Please complete the form" });
    } else {
      // if (
      //   (parseInt(servicesForm.amount) > 20000 ||
      //     parseInt(this.state.total) > 20000) &&
      //   this.state.paymentMedium !== "deposit"
      // ) {
      //   _warningNotify("Please deposit the money first!");
      // } else {
      this.setState(
        (prevState) => ({
          total: parseInt(prevState.total) + parseInt(servicesForm.amount),
          servicesList: prevState.servicesList.concat({
            ...servicesForm,
            accHead: serviceDetails.accHead,
            type: "New",
            date: serviceDetails.date,
            amountPaid: serviceDetails.amountPaid
              ? serviceDetails.amountPaid
              : 0,
          }),
          servicesForm: {
            ...prevState.servicesForm,
            qtty: "",
            amount: "",
            cost: "",
          },
          modal: false,
        }),
        () => this._services_typeahead.clear()
      );
      // }
    }
  };

  getUser = () => {
    let user = localStorage.getItem("user") || "";
    // console.log(user)
    if (user.length) {
      this.setState({ user });
    }
  };

  handleInputChange = ({ target: { name, value } }) => {
    // console.log(name, value)
    this.setState((prevState) => ({
      servicesForm: Object.assign({}, prevState.servicesForm, {
        [name]: value,
      }),
    }));
  };

  handleServiceDetailsInputChange = ({ target: { name, value } }) => {
    // console.log(name, value)
    this.setState((prevState) => ({
      serviceDetails: Object.assign({}, prevState.serviceDetails, {
        [name]: value,
      }),
    }));
  };

  setAccHead = (accHead) =>
    this.setState((prev) => ({
      serviceDetails: { ...prev.serviceDetails, accHead },
    }));

  getPatients = () => {
    // const cachedPatientsList =
    //   JSON.parse(localStorage.getItem("allpatients")) || [];
    // if (cachedPatientsList.length) {
    //   this.setPatients(cachedPatientsList);
    // }
    _fetchApi(
      `${apiURL()}/patientrecords/patientlist`,
      ({ results }) => {
        this.setPatients(results);
      },
      (error) => _warningNotify(error.toString())
    );
  };

  getBalance = (accountNo) => {
    // console.log('Getting balance for', accountNo)
    if (accountNo) {
      _fetchApi(
        `${url}/transactions/balance/${accountNo}`,
        ({ results }) => {
          // console.log('balance: ',results)
          this.setState((prevState) => ({
            serviceDetails: Object.assign({}, prevState.serviceDetails, {
              balance: results.length ? `${results[0].balance}` : "0",
              name: results.length ? `${results[0].name}` : "",
            }),
          }));
        },
        (err) => console.log(err)
      );
    }
  };

  setPatients(list) {
    let patients = [];
    let names = [];
    let accountNos = [];

    list.forEach(({ accountNo, firstname, surname, id }) => {
      patients.push({ accountNo, firstname, surname, id });
      names.push(`${surname} ${firstname} (${accountNo})`);
      accountNos.push(accountNo);
    });
    this.setState({ patients, names, accountNos });
  }

  setName(accNo) {
    let patient = this.state.patients.filter(
      (p) => p.accountNo === parseInt(accNo)
    );
    // console.log(patient)
    this.setState(
      (prevState) => ({
        serviceDetails: Object.assign({}, prevState.serviceDetails, {
          name: patient.length
            ? `${patient[0].surname} ${patient[0].firstname}`
            : "",
        }),
      }),
      () =>
        setTimeout(() => {
          if (patient.length) {
            this.getBillForPatient({
              accountNo: this.state.patient.accountNo,
              facilityId: this.props.facilityId,
            });
          }
        }, 1000)
    );
  }

  // setNumber(surname, firstname) {
  //   let patient = this.state.patients.filter(p => p.surname === surname && p.firstname === firstname)

  //   this.setState(prevState => ({
  //     serviceDetails: Object.assign(
  //       {},
  //       prevState.serviceDetails,
  //       {
  //         accountNo: patient.length ? patient[0].accountNo : null,
  //       }
  //     )
  //   }), () => setTimeout(() => {
  //     if(patient.length) {
  //       this.getBalance(patient[0].accountNo)
  //       this.getBillForPatient(patient[0].accountNo)
  //     }
  //   }, 1000))
  // }

  getServices = () => {
    let newList = [];
    let cachedServicesList = JSON.parse(localStorage.getItem("services")) || [];
    cachedServicesList.forEach((res) => newList.push(res.title));
    this.setState({ servicesFlat: newList, services: cachedServicesList });

    _fetchApi(
      `${url}/services/all`,
      ({ results }) => {
        let newList1 = [];
        if (results) {
          localStorage.setItem("services", JSON.stringify(results));
          results.forEach((res) => newList1.push(res.title));
          this.setState({ servicesFlat: newList1, services: results });
        }
      },
      (err) => {
        console.log(err);
        _warningNotify(err.toString());
      }
    );
  };

  onDelete = (service, index) =>
    this.setState((prevState) => ({
      total: parseInt(prevState.total) - parseInt(service.amount),
      servicesList: prevState.servicesList.filter(
        (serv, i) => serv.service !== service.service
      ),
      uncheckedList: prevState.uncheckedList.filter((i) => i),
    }));

  setCost = (val) => {
    let serviceObj = this.state.services.filter((s) => s.title === val)[0];
    if (serviceObj) {
      this.setState((prevState) => ({
        servicesForm: {
          ...prevState.servicesForm,
          cost: serviceObj.cost,
          qtty: 1,
          amount: 1 * serviceObj.cost,
        },
        serviceDetails: {
          ...prevState.serviceDetails,
          accHead: serviceObj.accHead,
        },
      }));
      if (serviceObj.cost === "0" || serviceObj.cost === 0) {
        this.setState({ amountStatus: false });
      } else {
        this.setState({ amountStatus: true });
      }
    }
  };

  toggle = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  togglePreview = () => {
    this.setState((prevState) => ({
      isPreviewModal: !prevState.isPreviewModal,
    }));
  };

  handleAccNoChange = (val) => {
    this.setState(
      (prevState) => ({
        serviceDetails: Object.assign({}, prevState.serviceDetails, {
          accountNo: val,
        }),
      }),
      () => {
        // this.getBalance(val)
        // this.getBillForPatient(val)
      }
    );
  };

  getPatientId(firstname, surname, accNo) {
    let patient = this.state.patients.filter(
      (p) =>
        p.firstname === firstname &&
        p.surname === surname &&
        p.accountNo === parseInt(accNo)
    );
    if (patient.length) {
      return patient[0].id;
    } else {
      return null;
    }
  }

  handleNamesChange = (val) => {
    // console.log(val);
    // accountNo: 4700
    // firstname: "Ahmad"
    // id: "4700-1"
    // surname: "Ali "
    const { firstname, surname, accountNo, id } = val;
    // let newVal = val.split(" ");
    // let surname = newVal[0];
    // let firstname = newVal[1];
    // let bracedAcc = newVal[2];
    // let accNo = bracedAcc.substr(1, bracedAcc.length - 2);
    // let patientId = this.getPatientId(firstname, surname, accountNo);
    console.error(val);
    this.setState(
      (prevState) => ({
        serviceDetails: {
          ...prevState.serviceDetails,
          name: `${surname} ${firstname}`,
          patientId: id,
          accountNo,
        },
        servicesForm: {
          ...prevState.servicesForm,
          id,
          patientId: id,
        },
        serviceFormAlertText: "",
      }),
      () =>
        setTimeout(() => {
          this.getBalance(accountNo);
          this.getBillForPatient({
            accountNo: val.accountNo,
            facilityId: this.props.facilityId,
          });
        }, 1000)
    );
  };

  handleServicesFlatListChange = (val) => {
    this.setState(
      (prevState) => ({
        servicesForm: Object.assign({}, prevState.servicesForm, {
          service: val,
        }),
        serviceFormAlertText: "",
      }),
      () => {
        this.setCost(val);
      }
    );
  };

  handleServiceSelect = (service) => {
    console.log(service);
    this.setState((prevState) => ({
      servicesForm: Object.assign({}, prevState.servicesForm, {
        service: service.description,
        cost: service.price,
        qtty: 1,
        amount: 1 * service.price,
        accHead: service.accHead,
      }),
      serviceDetails: {
        ...prevState.serviceDetails,
        accHead: service.title,
        serviceHead: service.title,
      },
      serviceFormAlertText: "",
      amountStatus: !(service.price === "0" || service.price === 0),
    }));
  };

  handleQttyChange = (target) => {
    this.setState((prevState) => ({
      servicesForm: Object.assign({}, prevState.servicesForm, {
        qtty: target.value,
        amount: parseInt(this.state.servicesForm.cost) * parseInt(target.value),
      }),
      serviceFormAlertText: "",
    }));
  };

  resetPage = () => {
    this.setState({
      serviceDetails: { accHead: "", mode: "cash", date: today, balance: "" },
      servicesForm: {},
      total: 0,
      servicesList: [],
    });
    generateReceiptNo((rec, recId) =>
      this.setState((prevState) => ({
        serviceDetails: Object.assign({}, prevState.serviceDetails, {
          receiptNo: rec,
          receiptId: recId,
        }),
      }))
    );
  };

  stopSaving = (msg) => {
    _warningNotify(msg);
    this.setState({ saveCostingLoading: false });
  };

  saveCosting = () => {
    this.setState({ billing: false, saveCostingLoading: true, loading: true });
    // this.togglePreview();
    const { serviceDetails, servicesList, total } = this.state;
    // if(!serviceDetails.accountNo) {
    //   return this.stopSaving('Please provide an account number!')
    // }

    if (!servicesList.length) {
      return this.stopSaving("Service list cannot be empty!");
    }

    const receivedData = {
      date: serviceDetails.date,
      accountNo: this.state.accountNo,
      name: serviceDetails.name,
      receiptNo: serviceDetails.receiptNo,
      amount: total,
      user: this.state.user,
      servicesList,
    };

    // this.setState(
    //   {
    //     saveCostingLoading: false,
    //     receivedData,
    //   },
    //   () => this.setState({ preview: true })
    // );

    const callback = () => {
      this.setState({
        saveCostingLoading: false,
        receivedData,
      });
      servicesList.forEach((item) => {
        if (item.transaction_id && item.transaction_id > 0) {
          _fetchApi(
            `${url}/transactions/update-bills?facilityId=${item.facilityId}&item_id=${item.transaction_id}&accountNo=${item.accountNo}&status='processed'`,
            (done) => {
              console.log({ done });
            },
            (error) => {
              console.error({ error });
            }
          );
        }
      });
      this.getBalance(this.state.accountNo);
      setTimeout(() => {
        this.setState({ preview: true });
      }, 1000);
    };

    // console.log(receivedData)
    // console.log(servicesList)
    this.processPayment(callback);
    this.setState({ loading: true });
  };

  printBill = () => {
    // this.setState({ billing: false, saveCostingLoading: true, loading: true });
    // this.togglePreview();
    const { serviceDetails, servicesList, total } = this.state;
    // if(!serviceDetails.accountNo) {
    //   return this.stopSaving('Please provide an account number!')
    // }

    if (!servicesList.length) {
      return this.stopSaving("Service list cannot be empty!");
    }

    const receivedData = {
      date: serviceDetails.date,
      accountNo: servicesList.length
        ? servicesList[0].patientId
        : serviceDetails.accountNo,
      name: serviceDetails.name,
      receiptNo: serviceDetails.receiptNo,
      amount: total,
      user: this.state.user,
      servicesList,
    };

    // this.setState(
    //   {
    //     saveCostingLoading: false,
    //     receivedData,
    //   },
    //   () => this.setState({ preview: true })
    // );

    const callback = () => {
      this.setState({
        saveCostingLoading: false,
        receivedData,
      });

      setTimeout(() => {
        this.setState({ preview: true });
      }, 1000);
    };

    // console.log(receivedData)
    // console.log(servicesList)
    // this.processPayment(callback);
    callback();
    this.setState({ loading: true });
  };

  getBillForPatient(accountNo) {
    this.setState({ loadingPendingBill: true });
    // const { name } = this.state.serviceDetails
    if (accountNo) {
      _fetchApi(
        `${url}/transactions/get-bills?facilityId=${this.props.facilityId}&accountNo=${accountNo}`,
        ({ results }) => {
          this.setState({ loadingPendingBill: false });
          if (results) {
            let temp = [];
            let newItemList = [];
            results.forEach((item) => {
              temp.push(item.amount);
              newItemList.push(
                Object.assign({}, item, { type: "Outstanding" })
              );
            });

            let total = temp.reduce((a, b) => parseInt(a) + parseInt(b), 0);
            // console.log(newItemList)
            this.setState({ servicesList: newItemList, total });
            // this.setState(prev => ({ servicesList: {...prev.servicesList, ...newItemList}, total }))
          }
        },
        (err) => {
          this.setState({ loadingPendingBill: false });
          _warningNotify("Error fetching bill for patient");
        }
      );
    }
  }

  onUnchecked = (index) => {
    this.setState((prevState) => ({
      uncheckedList: prevState.uncheckedList.concat(index),
    }));
  };

  onChecked = (index) => {
    this.setState((prevState) => ({
      uncheckedList: prevState.uncheckedList.filter((i) => i !== index),
    }));
  };

  processPayment(action_callback) {
    const {
      serviceDetails,
      servicesList,
      uncheckedList,
      paymentMedium,
    } = this.state;
    const { facilityId } = this.props;

    const newServices = [];
    let totalNew = 0;
    const outstandingServices = [];
    let totalOutstanding = 0;

    servicesList.forEach((service, index) => {
      if (service.type === "New" || service.transaction_id > 0) {
        newServices.push({
          description: service.service,
          debited: service.amount,
          credited: index === 0 ? serviceDetails.amountPaid : 0,
          debit: serviceDetails.accountNo,
          amount: service.amount,
          amountPaid: service.amountPaid,
          credit: service.accHead,
          transaction_source: serviceDetails.accountNo,
          source: service.accHead,
          userId: this.props.userId,
          user: this.state.user,
          receiptsn: serviceDetails.receiptNo,
          receiptno: serviceDetails.receiptId,
          clientAccount: serviceDetails.accountNo,
          patientId: serviceDetails.patientId,
          modeOfPayment: serviceDetails.mode,
          status: uncheckedList.includes(index) ? "pending" : "paid",
          facilityId,
          transaction_date: service.date,
          accHead: service.accHead,
        });
        totalNew = parseInt(totalNew) + parseInt(service.amount);
      } else if (service.type === "Outstanding") {
        outstandingServices.push(service.transaction_id);
        totalOutstanding =
          parseInt(totalOutstanding) + parseInt(service.amount);
      }
    });

    let data = {
      mode: serviceDetails.mode,
      amount: totalNew,
      accountNo: serviceDetails.accountNo,
      // user: this.state.user,
      // receiptDateSN: serviceDetails.receiptNo,
      // receiptNo: serviceDetails.receiptId,
      data: _convertArrOfObjToArr(newServices),
    };

    // let route = 'services/recordservices';
    // let callback = (results) => {
    //   _customNotify('Services Submitted!');
    //   action_callback(data);
    //   this.getBalance(serviceDetails.accountNo);
    // };
    // let error_cb = (err) => {
    //   _warningNotify('There was an error from the server');
    //   this.setState({ saveCostingLoading: false });
    // };

    if (newServices.length) {
      if (paymentMedium === "deposit") {
        let instaList = [];
        newServices.forEach((item, idx) =>
          instaList.push({
            ...item,
            clientAccount: serviceDetails.accountNo,
            patientId: serviceDetails.patientId,
            transactionType: paymentMedium,
            receiptsn: serviceDetails.receiptId,
            serviceHead: item.accHead,
            receiptno: serviceDetails.receiptNo,
            source: item.accHead,
            amountPaid: idx === 0 ? serviceDetails.amountPaid : 0,
            credit: idx === 0 ? serviceDetails.amountPaid : 0,
            destination:
              this.state.serviceDetails.mode.toLowerCase() === "cash"
                ? "Cash"
                : "Bank",
          })
        );

        for (let i = 0; i < instaList.length; i++) {
          _postApi(
            `${apiURL()}/transactions/new-service/instant-payment`,
            instaList[i]
          );
        }

        servicesList.forEach((item) => {
          if (item.transaction_id && item.transaction_id > 0) {
            _fetchApi(
              `${url}/transactions/update-bills?facilityId=${item.facilityId}&item_id=${item.transaction_id}&accountNo=${item.accountNo}&status='processed'`,
              (done) => {
                console.log({ done });
              },
              (error) => {
                console.error({ error });
              }
            );
          }
        });

        _customNotify("Services Submitted!");
        action_callback(data);
        this.getBalance(serviceDetails.accountNo);
      } else {
        let depServicesList = [];
        console.log(depServicesList);
        newServices.forEach((item) =>
          depServicesList.push({
            ...item,
            clientAccount: serviceDetails.accountNo,
            patientId: serviceDetails.patientId,
            source: item.accHead,
            destination: "Deposit",
          })
        );

        _customNotify("Services Submitted!");
        action_callback(data);
        this.getBalance(serviceDetails.accountNo);
      }

      // _postData({ route, data, callback, error_cb });
    }

    if (outstandingServices.length) {
      let data = {
        outstandingServices,
        accountNo: serviceDetails.accountNo,
        mode: serviceDetails.mode,
        receiptDateSN: serviceDetails.receiptId,
        receiptNo: serviceDetails.receiptNo,
        amount: totalOutstanding,
        amountPaid: serviceDetails.amountPaid,
        patientId: serviceDetails.patientId,
        facilityId,
      };
      _postApi(
        `${url}/services/outstanding`,
        data,
        () => this.setState({ preparingBilling: false, preview: true }),
        () => _warningNotify("Error processing payment")
      );
    }
  }

  prepareBilling = () => {
    this.setState({ billing: true, preparingBilling: true });
    const { serviceDetails, servicesList, total } = this.state;
    const { facilityId } = this.props;
    if (!serviceDetails.accountNo) {
      return this.stopSaving("Please provide an account number!");
    }

    if (!servicesList.length) {
      return this.stopSaving("Service list is empty!");
    }

    const billToPrint = {
      date: serviceDetails.date,
      accountNo: serviceDetails.accountNo,
      name: serviceDetails.name,
      receiptNo: serviceDetails.receiptNo,
      amount: total,
      user: this.state.user,
      servicesList,
      facilityId,
    };

    let data = [];
    servicesList.forEach((service, index) => {
      if (service.type === "New") {
        data.push({
          description: service.service,
          debited: service.amount,
          credited: 0,
          transaction_source: serviceDetails.accountNo,
          destination: serviceDetails.accHead,
          user: this.state.user,
          modeOfPayment: serviceDetails.mode,
          status: "pending",
          patientId: service.patientId,
          facilityId: facilityId,
          createdAt: moment().format("YYYY-MM-DD hh:mm:ss"),
        });
      }
    });

    if (data.length) {
      _postApi(
        `${url}/account/bills`,
        {
          data: servicesList.map((n) => ({
            ...n,
            name: serviceDetails.name,
            accountNo: serviceDetails.accountNo,
            patientId: serviceDetails.patientId,
          })),
        },
        () =>
          this.setState({
            preparingBilling: false,
            bill: billToPrint,
            preview: true,
          }),
        () => _warningNotify("Error processing the bill")
      );
    }
  };

  gotoAccSetup = () => {
    // this.props.history.push('/me/account/services/txnsetup');
    this.setState({ setupIsOpen: true });
  };

  render() {
    const {
      props: { facilityInfo, revAccHeads },
      state: {
        servicesForm,
        serviceDetails,
        servicesList,
        // loading,
        // modal,
        isPreviewModal,
        saveCostingLoading,
        serviceFormAlertText,
        paymentMedium,
        receivedData,
        bill,
        billing,
        loadingPendingBill,
        amountStatus,
        patients,
        groupList,
      },
      handleInputChange,
      // handleServiceDetailsInputChange,
      // handleAccNoChange,
      handleNamesChange,
      handleQttyChange,
      handleFormSubmit,
      // toggle,
      togglePreview,
      saveCosting,
      onChecked,
      onUnchecked,
      prepareBilling,
    } = this;
    let totals = servicesList.reduce((a, b) => a + parseFloat(b.amount), 0);

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
            <h5>Service Form</h5>
            <div>
              <span style={{ marginRight: 5, fontWeight: "bold" }}>
                Receipt No:
              </span>
              <span>
                {serviceDetails.receiptNo ? serviceDetails.receiptNo : ""}
              </span>
            </div>
          </CardHeader>
          {/* {JSON.stringify({
            serviceDetails,
            // servicesForm,
            // groupData,
            servicesList,
          })} */}
          {/* {JSON.stringify(servicesForm)} */}
          {this.state.preview ? (
            <CardBody>
              <button
                className="btn btn-danger offset-md-11"
                onClick={() =>
                  this.setState({ preview: false }, () => this.resetPage())
                }
              >
                <FaTimes />
                <>Close</>
              </button>

              <center>
                <PDFViewer height="900" width="600">
                  <ServicesReceipt
                    logo={facilityInfo.logo}
                    facilityInfo={facilityInfo}
                    data={billing ? bill : receivedData}
                    type={billing ? "bill" : "service"}
                    cash_paid={serviceDetails.amountPaid}
                    balance={this.state.patient.balance}
                    mode={this.state.serviceDetails.mode}
                    outstanding={parseFloat(
                      parseFloat(serviceDetails.balance) - parseFloat(totals)
                    )}
                    totals={totals}
                    serviceDetails={serviceDetails}
                    groupName={this.state.groupName}
                  />
                </PDFViewer>
              </center>
            </CardBody>
          ) : (
            <>
              <CardBody>
                {/* <div className="mb-1">
                  <Button onClick={this.gotoAccSetup} color="primary">
                    Set up transactions for this form
                  </Button>
                </div>
                <Collapse isOpen={this.state.setupIsOpen}>
                  <ServicesTxnSetup />
                </Collapse> */}
                {/* {JSON.strisngify(this.state.serviceDetails)} */}

                <Form>
                  <FormGroup row>
                    <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                      <label>Account Head </label>
                      <input
                        type="text"
                        className="form-control"
                        disabled
                        name="accHead"
                        value={
                          serviceDetails.accHead ? serviceDetails.accHead : ""
                        }
                      />
                      {/* {JSON.stringify(serviceDetails)} */}
                      {/* <Typeahead
                        align="justify"
                        labelKey="head"
                        options={revAccHeads.length ? revAccHeads : [{head: ""}]}
                        onChange={(val) => {
                          if(val.length) this.setAccHead(val[0]['head'])}
                        }
                        onInputChange={head => this.setAccHead(head)}
                      /> */}

                      {/* <select
                        className="form-control"
                        name="accHead"
                        value={serviceDetails.accHead ? serviceDetails.accHead : ''}
                        // onChange={handleServiceDetailsInputChange}
                      >
                        <option value=""></option>
                        <option value="clinic">Clinic Payment</option>
                        <option value="lab">Lab Payment</option>
                      </select> */}
                    </div>

                    <div className="offset-md-4 offset-lg-4 col-md-2 col-lg-2">
                      <label style={{ fontWeight: "bold" }}>Account No: </label>
                      <span> {this.state.serviceDetails.accountNo}</span>
                    </div>

                    <div className="col-xs-12 col-sm-12  col-md-3 col-lg-3">
                      <label className="">Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="date"
                        onChange={({ target }) =>
                          this.setState((prev) => ({
                            serviceDetails: {
                              ...prev.serviceDetails,
                              date: target.value,
                            },
                          }))
                        }
                        value={serviceDetails.date ? serviceDetails.date : ""}
                      />
                    </div>
                  </FormGroup>

                  <FormGroup row>
                    <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                      <label className="">Select Patient Account</label>
                      <Typeahead
                        align="justify"
                        labelKey={(item) =>
                          `${item.surname} ${item.firstname} (${item.accountNo})`
                        }
                        id="names"
                        ref={(ref) => (this._names_typeahead = ref)}
                        options={patients.length ? patients : []}
                        onChange={(val) => {
                          if (val.length) {
                            handleNamesChange(val[0]);
                            this.setState((p) => ({ ...p, patient: val[0] }));
                            // let user = val[0].split(" ");
                            // let surname = user[0]
                            // let firstname = user[1]
                            // let patient = this.state.patients.filter(p => p.surname === surname && p.firstname === firstname)[0]
                            // let accNo = patient.accountNo
                            // this.getBalance(accNo)
                          }
                        }}
                        // onInputChange={name => handleNamesChange(name)}
                      />
                      {/* <Autocomplete
                        suggestions={names}
                        emptylisttext="There is not account with such name!"
                        className="form-control"
                        value={serviceDetails.name ? serviceDetails.name : ''}
                        onInputChange={val => handleNamesChange(val)}
                      /> */}
                    </div>

                    <div className="offset-md-1 offset-lg-1 col-md-3 col-lg-3">
                      <div>
                        <input
                          type="radio"
                          name="paymentMedium"
                          className="col-md-1"
                          value="deposit"
                          id="deposit"
                          checked={paymentMedium === "deposit"}
                          onChange={(e) => {
                            this.setState((prevState) => ({
                              paymentMedium: "deposit",
                              serviceDetails: Object.assign(
                                {},
                                prevState.serviceDetails,
                                { mode: "deposit" }
                              ),
                            }));
                          }}
                        />
                        <label htmlFor="deposit">Pay from Deposit</label>
                      </div>
                      {/* <div>
                        <input
                          type="radio"
                          name="paymentMedium"
                          className="col-md-1"
                          id="insta"
                          value="insta"
                          checked={paymentMedium === "insta"}
                          onChange={(e) =>
                            this.setState({ paymentMedium: "insta" })
                          }
                        />
                        <label htmlFor="insta">Instant Payment</label>
                      </div> */}
                    </div>

                    <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                      {paymentMedium === "deposit" ? (
                        <div>
                          <label>Balance</label>
                          <input
                            className="form-control"
                            disabled
                            value={serviceDetails.balance}
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="">Mode Of Payment</label>
                          <select
                            className="form-control"
                            name="mode"
                            value={
                              serviceDetails.mode ? serviceDetails.mode : ""
                            }
                            onChange={this.handleServiceDetailsInputChange}
                          >
                            <option value="" />
                            <option value="cash">Cash</option>
                            <option value="POS">POS</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </FormGroup>

                  <FormGroup row>
                    <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                      <span>
                        <label className="mr-3" htmlFor="type">
                          Single Service{" "}
                          <input
                            type="radio"
                            className="mr-2"
                            name="rate"
                            id="type"
                            onChange={() =>
                              this.setState((prevState) => ({
                                serviceDetails: Object.assign(
                                  {},
                                  prevState.serviceDetails,
                                  {
                                    type: "Single",
                                  }
                                ),
                              }))
                            }
                            checked={serviceDetails.type === "Single"}
                          />
                        </label>
                        <label className="mr-3" htmlFor="type">
                          Group Service{" "}
                          <input
                            type="radio"
                            className="mr-2"
                            name="type"
                            id="type"
                            onChange={() =>
                              this.setState((prevState) => ({
                                serviceDetails: Object.assign(
                                  {},
                                  prevState.serviceDetails,
                                  {
                                    type: "Group",
                                  }
                                ),
                              }))
                            }
                            checked={serviceDetails.type === "Group"}
                          />
                        </label>
                      </span>
                      <Typeahead
                        align="justify"
                        labelKey={(item) =>
                          `${item.description} (${item.price})`
                        }
                        id="services"
                        ref={(ref) => (this._services_typeahead = ref)}
                        options={
                          serviceDetails.type === "Single"
                            ? revAccHeads
                            : groupList
                        }
                        onChange={(val) => {
                          if (val.length) {
                            if (serviceDetails.type === "Group") {
                              this.getGroupListData(val[0].description);
                              this.setState((p) => ({
                                ...p,
                                groupName: val[0].description,
                              }));
                            } else {
                              this.handleServiceSelect(val[0]);
                            }
                            // console.log(val[0]);

                            // alert(JSON.stringify(val[0]))
                            // handleServicesFlatListChange(val[0])
                          }
                        }}
                        // onInputChange={name => handleServicesFlatListChange(name)}
                      />
                      {/* <Autocomplete
                        suggestions={servicesFlat}
                        emptylisttext="Service not found!"
                        className="form-control"
                        value={servicesForm.service ? servicesForm.service : ''}
                        onInputChange={val => handleServicesFlatListChange(val)}
                      /> */}
                    </div>

                    <div className="col-xs-12 col-sm-12 offset-md-1 offset-lg-1 col-md-6 col-lg-6">
                      <div className="row">
                        <div className="col-md-6 col-lg-6">
                          <label>Quantity/Days:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="qtty"
                            onChange={({ target }) => handleQttyChange(target)}
                            value={servicesForm.qtty ? servicesForm.qtty : ""}
                          />
                        </div>
                        <div className="col-md-6 col-lg-6">
                          <label>Amount</label>
                          <input
                            type="number"
                            className="form-control"
                            disabled={amountStatus}
                            name="amount"
                            onChange={handleInputChange}
                            value={
                              servicesForm.amount ? servicesForm.amount : ""
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </FormGroup>
                </Form>
                <center>
                  <p style={{ color: "red" }}>
                    {serviceFormAlertText.length ? serviceFormAlertText : null}
                  </p>
                </center>
                <FormGroup row>
                  <button
                    className="btn btn-secondary col-xs-12 col-sm-12 offset-md-4 offset-lg-4 col-md-3 col-lg-3"
                    onClick={handleFormSubmit}
                  >
                    <FaPlus style={{ marginRight: 5 }} />
                    Add Service
                  </button>
                  <div className="offset-md-2 offset-lg-2">
                    <span style={{ fontWeight: "bold" }}>Total: </span>
                    <span>{formatNumber(totals)}</span>
                  </div>
                </FormGroup>
                {loadingPendingBill ? (
                  <Loading />
                ) : (
                  <ServicesList1
                    servicesList={servicesList}
                    onDelete={this.onDelete}
                    total={totals}
                    onChecked={onChecked}
                    onUnchecked={onUnchecked}
                    newView={false}
                    handleServicesGroup={this.handleServicesGroup}
                  />
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {servicesList.length ? (
                    <>
                      <button
                        className="btn btn-warning"
                        onClick={prepareBilling}
                      >
                        Prepare bill
                      </button>
                      {/*<button className="btn btn-success" onClick={this.printBill}>
                        Generate Invoice
                  </button>*/}

                      {serviceDetails.balance <= 0 ||
                      totals > serviceDetails.balance ? (
                        <div>
                          <label>Amount Paid</label>
                          <input
                            className="form-control"
                            // disabled
                            type={"number"}
                            onChange={({ target }) =>
                              this.setState((prev) => ({
                                serviceDetails: {
                                  ...prev.serviceDetails,
                                  amountPaid: target.value,
                                },
                              }))
                            }
                            value={serviceDetails.amountPaid}
                          />
                        </div>
                      ) : (
                        ""
                      )}
                    </>
                  ) : null}
                  {servicesList.length ? (
                    <CustomButton
                      loading={saveCostingLoading}
                      color="primary"
                      onClick={saveCosting}
                    >
                      <FaSave size={18} style={{ marginRight: 5 }} />
                      Pay now
                    </CustomButton>
                  ) : // <button
                  //   className="btn btn-primary col-xs-12 col-sm-12 offset-md-4 offset-lg-4 col-md-4 col-lg-4"
                  //   onClick={saveCosting}
                  // >
                  //   {saveCostingLoading ? (
                  //     <LoadingSM />
                  //   ) : (
                  //     <>
                  //
                  //     </>
                  //   )}
                  // </button>
                  null}
                </div>
              </CardBody>
            </>
          )}
          {/* <div>
            <Modal
              isOpen={modal}
              modalTransition={{ timeout: 700 }}
              backdropTransition={{ timeout: 1300 }}
              toggle={toggle}>
              <ModalHeader toggle={toggle}>Services Details</ModalHeader>
              <ModalBody>
              <ServicesList
                    servicesList={servicesList}
                    onDelete={this.onDelete}
                    total={totals}
                    onChecked={onChecked}
                    onUnchecked={onUnchecked}
                    newView={true}
                    acctNo = {this.state.serviceDetails.accountNo}
                    name={this.state.serviceDetails.name}
                    patientId={this.state.serviceDetails.patientId}
                  />
              </ModalBody>
              <ModalFooter>
                <CustomButton
                loading={loading}
                  color="primary"
                  onClick={() => {
                    toggle();
                    saveCosting();
                  }}
                >
                  {" "}
                  <FaSave size={18} style={{ marginRight: 5 }} /> Pay Now
                </CustomButton>
                <Button color="secondary" onClick={toggle}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
          </div>
         */}
        </Card>
        <ServicesPreview
          toggle={togglePreview}
          modal={isPreviewModal}
          loading={saveCostingLoading}
          serviceDetails={serviceDetails}
          servicesList={servicesList}
        />
      </div>
    );
  }
}
// function FormModal({
//   servicesForm,
//   loading,
//   servicesFlat,
//   handleInputChange,
//   toggle,
//   modal,
//   className,
//   handleServicesFlatListChange,
//   handleQttyChange,
//   handleFormSubmit,
//   serviceFormAlertText
// }) {
//   return (
//     <Modal isOpen={modal} toggle={toggle} className={className} size="lg">
//       <ModalHeader toggle={toggle}>Add Service</ModalHeader>
//       <ModalBody>
//       <Form className="">
//         <FormGroup row >
//           <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
//             <label>Service</label>
//             <Autocomplete
//               suggestions={servicesFlat}
//               emptylisttext="Service not found!"
//               className="form-control"
//               value={servicesForm.service ? servicesForm.service : ''}
//               onInputChange={val => handleServicesFlatListChange(val)}
//             />
//           </div>
//           <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
//             <label>Cost</label>
//             <input
//               type="text"
//               className="form-control"
//               name="cost"
//               onChange={handleInputChange}
//               value={servicesForm.cost ? servicesForm.cost : ''}
//             />
//           </div>
//         </FormGroup>
//         <FormGroup row >
//           <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
//             <label >Quantity/Days:</label>
//             <input
//               type="text"
//               className="form-control"
//               name="qtty"
//               onChange={({ target }) => handleQttyChange(target)}
//               value={servicesForm.qtty ? servicesForm.qtty : ''}
//             />
//           </div>
//           <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
//             <label>Amount</label>
//             <input
//               type="text"
//               className="form-control"
//               name="amount"
//               onChange={handleInputChange}
//               value={servicesForm.amount ? servicesForm.amount : ''}
//             />
//           </div>
//         <center><span style={{color:'red'}}>{serviceFormAlertText.length ? serviceFormAlertText : null}</span></center>
//         </FormGroup>
//       </Form>
//       </ModalBody>
//       <ModalFooter>
//         <Button color="primary" onClick={handleFormSubmit}>
//           {loading ? <LoadingSM /> : <><FaPlus />Add</>}
//         </Button>{' '}
//         <Button color="danger" onClick={toggle}><FaTimes /> Cancel</Button>
//       </ModalFooter>
//     </Modal>
//   )
// }

function mapDispatchToProps(dispatch) {
  return {
    getRevAccHeads: () => dispatch(getRevAccHeads()),
  };
}

function mapStateToProps(state) {
  return {
    revAccHeads: state.transactions.revAccHeads,
    facilityId: state.auth.user.facilityId,
    userId: state.auth.user.id,
    facilityInfo: state.facility.info,
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Services);

// const PDF = () => {
//   return (
//     <>
//       <Document>
//         <Page>
//           <OptimumLabReceipt />
//         </Page>
//       </Document>
//     </>
//   );
// };
