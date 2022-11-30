import React, { Component } from 'react'
import { FormGroup, Card, CardHeader, CardBody, Form } from 'reactstrap'
import { connect } from 'react-redux'
import ServicesList from './ServicesList'
import {
  today,
  url,
  _warningNotify,
  generateReceiptNo,
  // _convertArrOfObjToArr,
  // _postData,
  // _customNotify,
  checkEmpty,
} from '../utils/helpers'
import { FaCartPlus } from 'react-icons/fa'
// import ServicesPreview from './ServicesPreview';
import Loading from '../loading'
import { getRevAccHeads } from '../../redux/actions/transactions'
import { _fetchApi, _postApi } from '../../redux/actions/api'
import { apiURL } from '../../redux/actions'
import ServiceForm from './Forms/ServiceForm'
import Discount from './Forms/Discount'
import ServiceFooter from './Forms/ServiceFooter'
import AccountForm from './Forms/AccountForm'
import ServiceCardHeader from './Forms/ServiceCardHeader'
import PdfView from './Forms/PdfView'
import { dispenseDrugs } from '../../redux/actions/pharmacy-old'
import PaymentStatus from '../pharmacy/components/PaymentStatus'
import { Route, withRouter } from 'react-router'
import { compose } from 'redux'
import Scrollbars from 'react-custom-scrollbars'
import PendingPharmacyTable from '../pharmacy/PendingPharmacyTable'
// import { getPatient } from '../doc_dash/actions/patientsActions';

class Services extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: '',
      discount: '',
      drugs: [],
      price: 0,
      unit_of_issue: 0,
      drugsValue: '',
      generic_name: '',
      discount_value: 0,
      discountValue: 0,
      drug_code: '',
      grandTotal: 0,
      discount_sale: 0,
      newBalance: 0,
      serviceDetails: {
        accHead: '',
        mode: 'cash',
        date: today,
        accountNo: '',
        balance: 0,
        patientId: '',
      },
      total: 0,
      servicesForm: { type: 'New', amount: 0 },
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
      serviceFormAlertText: '',
      preview: false,
      paymentMedium: 'deposit',
      receivedData: {},
      uncheckedList: [],
      billing: false,
      loadingPendingBill: false,
      preparingBilling: false,
      bill: {},
      amountStatus: true,
      expiry_date: '',
      drugInfo: {},
      cart: [],
      paymentStatus: 'Full Payment',
      customerInfo: {
        name: '',
        accNo: '',
        phoneNo: '',
        amountPaid: 0,
      },
      customerType: 'Walk-In',
    }

    this._services_typeahead = React.createRef()
    this.quantityRef = React.createRef()
    this.drugCodeRef = React.createRef()
  }

  componentDidMount() {
    this.getDrugs(this.props.facilityId)
    this.props.getRevAccHeads()
    this.getUser()
    this.getPatients()
    this.getServices()
    generateReceiptNo((rec, recId) =>
      this.setState((prevState) => ({
        serviceDetails: Object.assign({}, prevState.serviceDetails, {
          receiptNo: rec,
          receiptId: recId,
        }),
      })),
    )
  }

  getUser = () => {
    let user = localStorage.getItem('user') || ''
    if (user.length) {
      this.setState({ user })
    }
  }

  handleInputChange = ({ target: { name, value } }) => {
    this.setState((prevState) => ({
      servicesForm: Object.assign({}, prevState.servicesForm, {
        [name]: value,
      }),
    }))
  }
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleCustomerInfoChange = (key, value) => {
    if (key === 'accNo') {
      this.setState((prev) => ({
        ...prev,
        customerInfo: { ...prev.customerInfo, [key]: value },
        serviceDetails: { ...prev.serviceDetails, accountNo: value },
      }))
    } else {
      this.setState((prev) => ({
        ...prev,
        customerInfo: { ...prev.customerInfo, [key]: value },
      }))
    }
  }

  handleServiceDetailsInputChange = ({ target: { name, value } }) => {
    this.setState((prevState) => ({
      serviceDetails: Object.assign({}, prevState.serviceDetails, {
        [name]: value,
      }),
    }))
  }

  setAccHead = (accHead) =>
    this.setState((prev) => ({
      serviceDetails: { ...prev.serviceDetails, accHead },
    }))

  getPatients = () => {
    const cachedPatientsList =
      JSON.parse(localStorage.getItem('allpatients')) || []
    if (cachedPatientsList.length) {
      this.setPatients(cachedPatientsList)
    }
    _fetchApi(
      `${apiURL()}/patientrecords/patientlist`,
      ({ results }) => {
        this.setPatients(results)
      },
      (error) => _warningNotify(error.toString()),
    )
  }

  getBalance = (accountNo) => {
    if (accountNo) {
      _fetchApi(
        `${url}/transactions/balance/${accountNo}`,
        ({ results }) => {
          // console.log(results)
          if (results && results.length) {
            const { balance, name } = results[0]
            this.setState((prevState) => ({
              serviceDetails: Object.assign({}, prevState.serviceDetails, {
                balance: balance || 0,
                name: name || '',
                accountNo,
              }),
            }))
            this._services_typeahead.current.setState({
              text: `${name} (${accountNo})`,
            })
          }
        },
        (err) => console.log(err),
      )
    }
  }

  setPatients(list) {
    let patients = []
    let names = []
    let accountNos = []
    list.forEach(({ accountNo, firstname, surname }) => {
      patients.push({ accountNo, firstname, surname })
      names.push(`${surname} ${firstname} (${accountNo})`)
      accountNos.push(accountNo)
    })
    this.setState({ patients, names, accountNos })
  }

  setName(accNo) {
    let patient = this.state.patients.filter(
      (p) => p.accountNo === parseInt(accNo),
    )
    // console.log(patient)
    this.setState(
      (prevState) => ({
        serviceDetails: Object.assign({}, prevState.serviceDetails, {
          name: patient.length
            ? `${patient[0].surname} ${patient[0].firstname}`
            : '',
        }),
      }),
      () =>
        setTimeout(() => {
          if (patient.length) {
            this.getBillForPatient(accNo)
          }
        }, 1000),
    )
  }
  getServices = () => {
    let newList = []
    let cachedServicesList = JSON.parse(localStorage.getItem('services')) || []
    cachedServicesList.forEach((res) => newList.push(res.title))
    this.setState({ servicesFlat: newList, services: cachedServicesList })

    _fetchApi(
      `${url}/services/all`,
      ({ results }) => {
        let newList1 = []
        if (results) {
          localStorage.setItem('services', JSON.stringify(results))
          results.forEach((res) => newList1.push(res.title))
          this.setState({ servicesFlat: newList1, services: results })
        }
      },
      (err) => {
        console.log(err)
        _warningNotify(err.toString())
      },
    )
  }

  handleFormSubmit = (e) => {
    e.preventDefault()
    const {
      servicesForm,
      serviceDetails,
      total,
      paymentMedium,
      // servicesList,
      drugsValue,
      generic_name,
    } = this.state

    if (paymentMedium === 'insta') {
      if (
        servicesForm.qtty === 0 ||
        servicesForm.qtty === ''
        // servicesForm.amount === 0 ||
        // servicesForm.amount === ''
      ) {
        this.setState({ serviceFormAlertText: 'Please complete the form' })
      } else {
        if (
          parseInt(servicesForm.qtty) >
          parseInt(this.state.drugInfo.quantityAvailable)
        ) {
          _warningNotify('Insufficient Drug Quantity in Disensary')
        } else {
          // console.log('continued');
          let _qtty = 0
          let list = this.state.servicesList
          for (let i = 0; i < list.length; i++) {
            let currentDrug = list[i]
            // console.log(currentDrug, drugsValue, generic_name);
            if (
              currentDrug.drugs === drugsValue &&
              currentDrug.generic_name === generic_name
            ) {
              _qtty = _qtty + parseInt(currentDrug.qtty)
              // console.log('see new _qtty =>' + _qtty);
            }
          }
          if (
            _qtty + parseInt(servicesForm.qtty) >
            parseInt(this.state.drugInfo.quantityAvailable)
          ) {
            _warningNotify('Insufficient quantity in Disensary')
          } else {
            let amount =
              parseInt(servicesForm.qtty) * parseInt(this.state.price)
            let finalTotal =
              parseInt(total) + parseInt(amount) - this.state.discountValue
            this.setState({
              total: finalTotal,
            })
            // console.log(finalTotal);
            this.setState((prevState) => ({
              total: finalTotal,
              servicesList: prevState.servicesList.concat({
                drugs: this.state.drugsValue,
                generic_name: this.state.generic_name,
                drug_id: this.state.drug_id,
                price: this.state.price,
                expiry_date: this.state.expiry_date,
                amount1: amount,
                ...servicesForm,
                type: 'New',
              }),
              servicesForm: {
                ...prevState.servicesForm,
                qtty: '',
                amount: '',
                cost: '',
              },
              modal: false,
              cart: [...prevState.cart, Object.assign({}, this.state.drugInfo)],
            }))
            // this._services_typeahead.current.setState({ text: '' });
            // console.log(this._services_typeahead);

            this.drugCodeRef.current.focus()
            this.drugCodeRef.current.clear()

            this.setState((prev) => ({
              newBalance: parseInt(
                this.state.serviceDetails.balance -
                  (this.state.total - this.state.discount_value),
              ),
              drug_code: '',
              drugInfo: {},
            }))
          }
        }
      }
    } else {
      if (
        serviceDetails.accountNo === '' ||
        servicesForm.qtty === 0 ||
        servicesForm.qtty === ''
      ) {
        this.setState({ serviceFormAlertText: 'Please complete the form' })
      } else {
        if (servicesForm.qtty > this.state.drugInfo.quantityAvailable) {
          _warningNotify('Insufficient Drug Quantity in Disensary')
        } else {
          console.log('continued')
          let _qtty = 0
          let list = this.state.servicesList
          for (let i = 0; i < list.length; i++) {
            let currentDrug = list[i]
            console.log(currentDrug, drugsValue, generic_name)
            if (
              currentDrug.drugs === drugsValue &&
              currentDrug.generic_name === generic_name
            ) {
              _qtty = _qtty + parseInt(currentDrug.qtty)
              // console.log('see new _qtty =>' + _qtty);
            }
          }
          if (
            _qtty + parseInt(servicesForm.qtty) >
            parseInt(this.state.drugInfo.quantityAvailable)
          ) {
            _warningNotify('Insufficient quantity in Disensary')
          } else {
            let amount =
              parseInt(servicesForm.qtty) * parseInt(this.state.price)
            let finalTotal =
              parseInt(total) + parseInt(amount) - this.state.discountValue
            this.setState({
              total: finalTotal,
            })
            // console.log(finalTotal);
            this.setState((prevState) => ({
              total: finalTotal,
              servicesList: prevState.servicesList.concat({
                drugs: this.state.drugsValue,
                price: this.state.price,
                expiry_date: this.state.expiry_date,
                amount1: amount,
                ...servicesForm,
                type: 'New',
              }),
              servicesForm: {
                ...prevState.servicesForm,
                qtty: '',
                amount: '',
                cost: '',
              },
              cart: [...prevState.cart, Object.assign({}, this.state.drugInfo)],
              modal: false,
            }))
            // this.drugCodeRef.current.focus();

            // this._services_typeahead.current.setState({ text: '' });
            // console.log(this._services_typeahead);
            // this.drugCodeRef.current.focus();

            // this.drugCodeRef.current.clear();

            this.setState({
              newBalance: parseInt(
                this.state.serviceDetails.balance -
                  (this.state.total - this.state.discount_value),
              ),
              drug_code: '',
              drugInfo: {},
            })
          }
        }
      }
    }
  }

  onDelete = (service, index) => {
    // let selectedItem = this.state.servicesList[index];
    let newList = this.state.servicesList.filter((item, i) => i !== index)
    this.setState({
      servicesList: newList,
      total: parseInt(this.state.total) - parseInt(service.amount1),
    })

    // if (newList.length) {
    //   let newTotal =
    //     parseInt(this.state.total) - parseInt(service.amount1);
    //     console.log(service)
    //   this.setState((prev) => ({
    //     servicesList: newList,
    //     total: newTotal,
    //   }));
    // }
  }

  setCost = (val) => {
    let serviceObj = this.state.services.filter((s) => s.title === val)[0]
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
      }))
      if (serviceObj.cost === '0' || serviceObj.cost === 0) {
        this.setState({ amountStatus: false })
      } else {
        this.setState({ amountStatus: true })
      }
    }
  }

  toggle = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }))
  }

  togglePreview = () => {
    this.setState((prevState) => ({
      isPreviewModal: !prevState.isPreviewModal,
    }))
  }

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
      },
    )
  }

  getPatientId(firstname, surname, accNo) {
    let patient = this.props.patients.filter(
      (p) =>
        p.firstname === firstname &&
        p.surname === surname &&
        p.accountNo === parseInt(accNo),
    )
    if (patient.length) {
      return patient[0].id
    } else {
      return null
    }
  }

  getPatientInfo = (val) => {
    if (val) {
      let newVal = val.split(' ')
      let surname = newVal[0]
      let firstname = newVal[1]
      let bracedAcc = newVal[2]
      let accNo = bracedAcc.substr(1, bracedAcc.length - 2)
      let patientId = this.getPatientId(firstname, surname, accNo)
      return {
        name: `${surname} ${firstname}`,
        accNo,
        patientId,
      }
    }
  }

  handleNamesChange = (val) => {
    // let newVal = val.split(' ');
    // let surname = newVal[0];
    // let firstname = newVal[1];
    // let bracedAcc = newVal[2];
    // let accNo = bracedAcc.substr(1, bracedAcc.length - 2);
    // let patientId = this.getPatientId(firstname, surname, accNo);
    const { accNo, patientId } = this.getPatientInfo(val)
    console.log(val, accNo, patientId)
    this.setState(
      (prevState) => ({
        serviceDetails: {
          ...prevState.serviceDetails,
          name: val,
          patientId,
          accountNo: accNo,
        },
        servicesForm: {
          ...prevState.servicesForm,
          patientId,
        },
        serviceFormAlertText: '',
      }),
      () =>
        setTimeout(() => {
          this.getBalance(accNo)
          this.getBillForPatient(accNo)
        }, 1000),
    )
  }

  handleServicesFlatListChange = (val) => {
    this.setState(
      (prevState) => ({
        servicesForm: Object.assign({}, prevState.servicesForm, {
          service: val,
        }),
        serviceFormAlertText: '',
      }),
      () => {
        this.setCost(val)
      },
    )
  }

  handleQttyChange = (target) => {
    this.setState((prevState) => ({
      servicesForm: Object.assign({}, prevState.servicesForm, {
        qtty: target.value,
        amount: parseInt(this.state.servicesForm.cost) * parseInt(target.value),
      }),
      drugInfo: { ...prevState.drugInfo, quantity: target.value },
      serviceFormAlertText: '',
    }))
  }

  resetPage = () => {
    this.setState({
      serviceDetails: { accHead: '', mode: 'cash', date: today, balance: '' },
      servicesForm: {},
      total: 0,
      servicesList: [],
      cart: [],
      drugInfo: '',
      drug_code: '',
      paymentStatus: 'Full Payment',
      customerInfo: {
        name: '',
        accNo: '',
        phoneNo: '',
        amountPaid: 0,
      },
      customerType: 'Walk-In',
    })

    generateReceiptNo((rec, recId) =>
      this.setState((prevState) => ({
        serviceDetails: Object.assign({}, prevState.serviceDetails, {
          receiptNo: rec,
          receiptId: recId,
        }),
      })),
    )
  }

  stopSaving = (msg) => {
    _warningNotify(msg)
    this.setState({ saveCostingLoading: false })
  }

  saveCosting = () => {
    this.setState({ billing: false, saveCostingLoading: true })
    const {
      // serviceDetails,
      servicesList,
      // total,
      paymentStatus,
      customerInfo,
      // grandTotal,
    } = this.state
    if (!servicesList.length) {
      return this.stopSaving('Service list cannot be empty!')
    }

    if (paymentStatus !== 'Full Payment') {
      generateReceiptNo((receiptsn, receiptno) => {
        if (customerInfo.accNo && customerInfo.accNo !== '') {
          let newDepositObj = {
            // ...dep,
            accountNo: customerInfo.accNo,
            clientAccount: customerInfo.accNo,
            description: `Deposit from account ${customerInfo.accNo}`,
            depositAmount:
              paymentStatus === 'Part Payment' ? customerInfo.amountPaid : 0,
            modeOfPayment: 'Deposit',
            // source,
            destination: this.state.serviceDetails.mode
              ? this.state.serviceDetails.mode.toLowerCase() === 'cash'
                ? 'Cash'
                : 'Bank'
              : 'Cash',
            receiptsn,
            receiptno,
            name: customerInfo.name,
            accountType: 'Family',
          }

          console.log(newDepositObj, 'Not full payment')

          _postApi(
            `${url}/transactions/deposit`,
            newDepositObj,
            () => {
              console.log('Customer Deposit Successfull')
            },
            (err) => {
              console.log(err)
            },
          )
        } else {
          _fetchApi(`${apiURL()}/client/nextId`, (data) => {
            if (data.success) {
              let newAcc = data.results.accountNo
              console.log('Got new account', newAcc)
              // this.state.serviceDetails.accountNo
              this.setState((prev) => ({
                serviceDetails: { ...prev.serviceDetails, accountNo: newAcc },
              }))
              let newDepositObj = {
                // ...dep,
                accountNo: newAcc,
                clientAccount: newAcc,
                description: `Deposit from account ${newAcc}`,
                depositAmount:
                  paymentStatus === 'Part Payment'
                    ? customerInfo.amountPaid
                    : 0,
                modeOfPayment: this.state.serviceDetails.mode,
                // source,
                destination: this.state.serviceDetails.mode
                  ? this.state.serviceDetails.mode.toLowerCase() === 'cash'
                    ? 'Cash'
                    : 'Bank'
                  : 'Cash',
                receiptsn,
                receiptno,
                name: customerInfo.name,
                accountType: 'Family',
              }

              // console.log(newDepositObj, 'Full payment');
              _postApi(
                `${url}/transactions/deposit`,
                newDepositObj,
                () => {
                  // _customNotify('Transaction Successful');
                  this.setState({ preview: true })
                },
                (err) => {
                  // console.log(err);
                  _warningNotify(err.toString())
                  this.setState({ savingDeposit: false })
                },
              )
            }
          })
        }
      })

      this.processPayment()
    } else {
      this.processPayment()
    }
  }

  processPayment = () => {
    const { serviceDetails, total, servicesList } = this.state
    generateReceiptNo((rec, recno) => {
      this.setState((prev) => ({
        serviceDetails: {
          ...prev.serviceDetails,
          receiptNo: rec,
          receiptId: recno,
        },
      }))

      const receivedData = {
        date: serviceDetails.date,
        accountNo: serviceDetails.accountNo,
        name: serviceDetails.name,
        receiptNo: serviceDetails.receiptNo,
        amount: total,
        user: this.state.user,
        servicesList,
      }

      // this.setState(
      //   {
      //     saveCostingLoading: false,
      //     receivedData,
      //   },
      //   () => this.setState({ preview: true }),
      // );

      const callback = () => {
        this.setState({
          saveCostingLoading: false,
          receivedData,
          preview: true,
        })
      }

      // console.log(receivedData)
      // console.log(servicesList)
      // this.processPayment(callback);
      // let _card = this.state.cart;

      let finalList = []
      // let total_new = 0;
      this.state.cart.forEach((item, i) => {
        // console.log(item);
        finalList.push({
          drug: item.drugName,
          description: item.drugName,
          generic: item.generic_name,
          unit_of_issue: item.unit_of_issue,
          drug_code: item.drug_code,
          quantity: item.quantity,
          cost: item.cost_price,
          expiry: item.expiryDate,
          mark_up: item.markup,
          supplierId: item.supplierId,
          // selling_price: parseInt(item.mark_up) + parseInt(item.cost),
          selling_price: item.selling_price,
          quantityAvailable: item.dispensary_balance,
          userId: this.props.user.id,
          amount: servicesList[i].amount1,
          source: serviceDetails.mode
            ? serviceDetails.mode.toLowerCase() === 'cash'
              ? 'Cash'
              : 'Bank'
            : 'Cash',
          receiptsn: rec,
          receiptno: recno,
          modeOfPayment: serviceDetails.mode,
          destination: 'Drug Sales',
          patientAcc: this.state.serviceDetails.accountNo,
          transactionType: this.state.paymentMedium,
          sourceAcct: serviceDetails.mode
            ? serviceDetails.mode.toLowerCase() === 'cash'
              ? 'Cash'
              : 'Bank'
            : 'Cash',
          paymentStatus: this.state.paymentStatus,
          cost_price: item.cost_price,
        })
        // total_new = parseInt(total_new) + parseInt(servicesList[i].amount1);
      })

      // console.log('finallist', finalList);

      for (let i = 0; i < finalList.length; i++) {
        _postApi(`${apiURL()}/drugs/sales/new`, finalList[i])
      }

      callback()
    })
  }

  getBillForPatient(accountNo) {
    this.setState({ loadingPendingBill: true })
    // const { name } = this.state.serviceDetails
    if (accountNo) {
      _fetchApi(
        `${url}/transactions/pending/${accountNo}`,
        ({ results }) => {
          this.setState({ loadingPendingBill: false })
          if (results) {
            let temp = []
            let newItemList = []
            results.forEach((item) => {
              temp.push(item.amount)
              newItemList.push(Object.assign({}, item, { type: 'Outstanding' }))
            })

            let total = temp.reduce((a, b) => parseInt(a) + parseInt(b), 0)
            // console.log(newItemList)
            this.setState({ servicesList: newItemList, total })
            // this.setState(prev => ({ servicesList: {...prev.servicesList, ...newItemList}, total }))
          }
        },
        (err) => {
          this.setState({ loadingPendingBill: false })
          _warningNotify('Error fetching bill for patient')
        },
      )
    }
  }

  handlePercentage = (input_percentage) => {
    if (this.state.discount === 'Percentage') {
      let percentage =
        parseInt(this.state.total) * (parseInt(input_percentage) / 100)
      console.log(percentage)
      this.setState({
        discount_value: percentage,
        discount_sale: percentage / this.state.servicesList.length,
        newBalance: this.state.serviceDetails.balance - this.state.grandTotal,
        grandTotal: this.state.total - percentage,
      })
    } else if (this.state.discount === 'Fixed') {
      let fixed = parseInt(input_percentage)
      this.setState({
        discount_value: fixed,
        discount_sale: fixed / this.state.servicesList.length,
        newBalance: this.state.serviceDetails.balance - this.state.grandTotal,
        grandTotal: this.state.total - fixed,
      })
      console.log(this.state.newBalance)
    } else {
      this.setState({
        discount_value: 0,
      })
    }
    // this.handlePriceSale()
  }

  onUnchecked = (index) => {
    this.setState((prevState) => ({
      uncheckedList: prevState.uncheckedList.concat(index),
    }))
  }

  onChecked = (index) => {
    this.setState((prevState) => ({
      uncheckedList: prevState.uncheckedList.filter((i) => i !== index),
    }))
  }

  handleRadio = (e) => {
    let { value } = e.target
    this.setState({
      discount: value,
    })
  }

  componentWillMount() {
    document.addEventListener('keydown', this.handleKeyPress)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress)
  }

  handleKeyPress = (e) => {
    switch (e.key) {
      // f2
      case 'F2':
        return this.saveCosting()

      // f6
      case 'F6':
        return console.log('Presssed ', e.key)
      // f7
      case 'F7':
        return console.log('Presssed f2', e.key)
      case 'F10':
        return this.saveCosting()
      // e
      case 'e':
        this.setState({ editMode: true })
        break

      default:
        return null
    }
  }

  discountValue = (value) => {
    this.setState({
      discountValue: value,
    })
  }

  handleDrugTypeAhead = (val) => {
    this.setState((prev) => ({
      drugsValue: val[0].drug,
      drug_code: val[0].drug_code,
      price: val[0].price,
      expiry_date: val[0].expiry_date,
      unit_of_issue: val[0].unit_of_issue,
      servicesForm: { ...prev.servicesForm, qtty: 1 },
    }))
  }

  getDrugs = (facId) => {
    fetch(`${apiURL()}/drugs/list/${facId}`)
      .then((response) => response.json())
      .then((data) => this.setState({ drugs: data.results }))
  }

  handleClose = () => {
    this.setState({ preview: false, drugInfo: {} }, () => this.resetPage())
  }

  handlePaymentMediumChange = (medium) => {
    if (medium === 'deposit') {
      this.setState((prevState) => ({
        paymentMedium: 'deposit',
        serviceDetails: Object.assign({}, prevState.serviceDetails, {
          mode: 'Deposit',
        }),
      }))
    } else {
      this.setState((prev) => ({
        paymentMedium: 'insta',
        serviceDetails: { ...prev.serviceDetails, mode: 'cash' },
      }))
    }
  }

  // componentWillUpdate(nextProps, nextState) {
  //   // if (nextProps.facilityId) {
  //   //   console.log(nextProps.facilityId);
  //   //   this.getDrugs(nextProps.facilityId);
  //   // }
  //   console.log(nextState)
  // }

  resetForm = () => {
    this.setState({})
  }

  handleDrugCodeChange = (value, drugInfo) => {
    this.setState({ drug_code: value })
    // console.log(drugInfo)

    if (drugInfo) {
      this.setState((prev) => ({
        drugInfo: {
          ...prev.drugInfo,
          drugName: drugInfo.drug,
          generic_name: drugInfo.genericName,
          unit_of_issue: drugInfo.unit_of_issue,
          drug_code: drugInfo.drug_code,
          quantity_avail: drugInfo.d_balance,
          cost: drugInfo.cost_price,
          cost_price: drugInfo.cost_price,
          expiryDate: drugInfo.expiry_date,
          mark_up: drugInfo.markup,
          supplierId: drugInfo.supplier,
          selling_price: drugInfo.price,
          quantityAvailable: drugInfo.d_balance,
          quantity: '',
        },
        drugsValue: drugInfo.drug,
        generic_name: drugInfo.genericName,
        drug_code: drugInfo.drug_code,
        price: drugInfo.price,
        expiry_date: drugInfo.expiry_date,
        unit_of_issue: drugInfo.unit_of_issue,
        servicesForm: { ...prev.servicesForm, qtty: '' },
      }))

      this.quantityRef.current.focus()
      fetch(
        `${apiURL()}/drugs/sales/quantity/${this.props.facilityId}?drugName=${
          drugInfo.drug
        }&drugCode=${drugInfo.genericName}&expiry_date=${drugInfo.expiry_date}`,
      )
        .then((raw) => raw.json())
        .then((data) => {
          if (data.success) {
            this.setState((prev) => ({
              price: data.results ? data.results.price : 0,
              drugInfo: {
                ...prev.drugInfo,
                quantityAvailable: data.results ? data.results.balance : 0,
                selling_price: data.results ? data.results.price : 0,
                cost_p: data.results ? data.results.cost_price : 0
              },
            }))
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
  // history = this.props

  render() {
    const location = this.props.location.pathname
    const isPatientCheckout = location.includes('view')
    const {
      props: { facilityInfo },
      state: {
        drugInfo,
        servicesForm,
        serviceDetails,
        names,
        servicesList,
        // isPreviewModal,
        saveCostingLoading,
        total,
        serviceFormAlertText,
        paymentMedium,
        receivedData,
        bill,
        price,
        billing,
        loadingPendingBill,
        discount_sale,
        drug_code,
        paymentStatus,
      },
      handleNamesChange,
      handleQttyChange,
      handleFormSubmit,
      // togglePreview,
      saveCosting,
      onChecked,
      onUnchecked,
      // prepareBilling,
      handlePaymentMediumChange,
      handleDrugCodeChange,
    } = this

    const bal = serviceDetails.balance - (total - discount_sale)
    const grandTotal = total - discount_sale
    const totalDiscount = discount_sale
    // console.log("tereset99990000000000000000000000000000000000000000",button);
    return (
      <div>
        {/* {JSON.stringify(this.history)} */}
        <Card>
          <ServiceCardHeader serviceDetails={serviceDetails} />

          {/* {JSON.stringify({
            serviceDetails,
            drugInfo,
            // paymentMedium,
            // // bal,
            // // grandTotal,
            // // totalDiscount,
            // // discount_sale,
            // // total,
            // // drugInfo,
            cart: this.state.cart,
          })} */}
          {this.state.preview ? (
            <>
              {/* {JSON.stringify(facilityInfo)} */}
              <PdfView
                name={serviceDetails.name}
                facilityInfo={facilityInfo}
                billing={billing}
                bill={bill}
                receivedData={receivedData}
                serviceDetails={serviceDetails}
                handleClose={this.handleClose}
                data={servicesList}
                balance={bal}
                grandTotal={grandTotal}
                totalDiscount={this.state.discount_value}
                paymentStatus={this.state.paymentStatus}
                customerInfo={this.state.customerInfo}
                // : {
                //   name: '',
                //   accNo: '',
                //   phoneNo: '',
                //   amountPaid: 0,
                // },

                customerType={this.state.customerType}
              />
            </>
          ) : (
            <>
              <Scrollbars style={{ height: '65vh' }}>
                <CardBody>
                  <Form onSubmit={handleFormSubmit}>
                    <Route exact path="/me/pharmacy/sale">
                      <AccountForm
                        drug_code={drug_code}
                        drugInfo={this.state.drugInfo}
                        quantityRef={this.quantityRef}
                        drugCodeRef={this.drugCodeRef}
                        handleDrugCodeChange={handleDrugCodeChange}
                        price={price}
                        serviceDetails={serviceDetails}
                        names={names}
                        paymentStatus={paymentStatus}
                        paymentMedium={paymentMedium}
                        handleNamesChange={handleNamesChange}
                        servicesForm={servicesForm}
                        handleQttyChange={handleQttyChange}
                        accountNo={this.state.serviceDetails.accountNo}
                        drugs={this.state.drugs}
                        handleChange={this.handleChange}
                        handleDrugTypeAhead={this.handleDrugTypeAhead}
                        handleServiceDetailsInputChange={
                          this.handleServiceDetailsInputChange
                        }
                        handlePaymentMediumChange={handlePaymentMediumChange}
                        // ref={(ref) => (this._names_typeahead = ref)}
                        _services_typeahead={this._services_typeahead}
                        display
                      />
                    </Route>

                    <Route exact path="/me/pharmacy/sale/:acctNo">
                      <AccountForm
                        getBalance={this.getBalance}
                        drug_code={drug_code}
                        drugInfo={this.state.drugInfo}
                        quantityRef={this.quantityRef}
                        drugCodeRef={this.drugCodeRef}
                        handleDrugCodeChange={handleDrugCodeChange}
                        price={price}
                        serviceDetails={serviceDetails}
                        names={names}
                        paymentStatus={paymentStatus}
                        paymentMedium={paymentMedium}
                        handleNamesChange={handleNamesChange}
                        servicesForm={servicesForm}
                        handleQttyChange={handleQttyChange}
                        accountNo={this.state.serviceDetails.accountNo}
                        drugs={this.state.drugs}
                        handleChange={this.handleChange}
                        handleDrugTypeAhead={this.handleDrugTypeAhead}
                        handleServiceDetailsInputChange={
                          this.handleServiceDetailsInputChange
                        }
                        handlePaymentMediumChange={handlePaymentMediumChange}
                        // ref={(ref) => (this._names_typeahead = ref)}
                        _services_typeahead={this._services_typeahead}
                      />
                    </Route>

                    <center>
                      <p style={{ color: 'red' }}>
                        {serviceFormAlertText.length
                          ? serviceFormAlertText
                          : null}
                      </p>
                    </center>
                    {!isPatientCheckout && (
                      <>
                        {/* <FormGroup row> */}
                        <button
                          className="btn btn-secondary col-xs-12 col-sm-12 offset-md-4 offset-lg-4 col-md-3 col-lg-3"
                          // onClick={}
                          type="submit"
                          disabled={
                            checkEmpty(drugInfo) ||
                            servicesForm.qtty === 0 ||
                            servicesForm.qtty === ''
                          }
                        >
                          <FaCartPlus style={{ marginRight: 5 }} />
                          Add to cart
                        </button>
                        {/* </FormGroup> */}
                      </>
                    )}
                  </Form>
                  {/* =============== */}
                  <>
                    {this.state.servicesList.length ? (
                      <CardBody>
                        <>
                          <CardHeader>
                            <h6 align="center">Dispensary Details </h6>
                          </CardHeader>
                          {loadingPendingBill ? (
                            <Loading />
                          ) : (
                            <ServicesList
                              servicesList={servicesList}
                              onDelete={this.onDelete}
                              total={total}
                              onChecked={onChecked}
                              onUnchecked={onUnchecked}
                            />
                          )}
                          <Discount
                            handleRadio={this.handleRadio}
                            discount={this.state.discount}
                            handlePercentage={this.handlePercentage}
                            discountValue={this.discountValue}
                          />
                          <ServiceForm
                            balance={bal}
                            total={grandTotal}
                            discount_value={totalDiscount}
                            paymentMedium={paymentMedium}
                            discountValue={this.state.discount_value}
                          />
                          {this.state.paymentMedium !== 'deposit' ||
                          this.state.paymentStatus === 'Pay Later' ||
                          this.state.paymentStatus === 'Part Payment' ? (
                            <PaymentStatus
                              paymentStatus={paymentStatus}
                              handleChange={this.handleChange}
                              handleCustomerInfoChange={
                                this.handleCustomerInfoChange
                              }
                              customerInfo={this.state.customerInfo}
                              handleServiceDetailsInputChange={
                                this.handleServiceDetailsInputChange
                              }
                              paymentMedium={paymentMedium}
                              serviceDetails={serviceDetails}
                              setServiceDetails={(key, val) =>
                                this.setState((p) => ({
                                  serviceDetails: {
                                    ...p.serviceDetails,
                                    [key]: val,
                                  },
                                }))
                              }
                              setPaymentMedium={(val) =>
                                this.setState({ paymentMedium: val })
                              }
                            />
                          ) : null}
                        </>
                      </CardBody>
                    ) : null}
                    {!isPatientCheckout && (
                    <ServiceFooter
                      servicesList={servicesList}
                      // prepareBilling={prepareBilling}
                      saveCosting={saveCosting}
                      saveCostingLoading={saveCostingLoading}
                    />)}
                  </>
                  <Route path="/me/pharmacy/sale/view/:patient_id">
                    <PendingPharmacyTable
                      getBalance={this.getBalance}
                      drug_code={drug_code}
                      drugInfo={this.state.drugInfo}
                      quantityRef={this.quantityRef}
                      drugCodeRef={this.drugCodeRef}
                      handleDrugCodeChange={handleDrugCodeChange}
                      price={price}
                      serviceDetails={serviceDetails}
                      names={names}
                      paymentStatus={paymentStatus}
                      paymentMedium={paymentMedium}
                      handleNamesChange={handleNamesChange}
                      servicesForm={servicesForm}
                      handleQttyChange={handleQttyChange}
                      accountNo={this.state.serviceDetails.accountNo}
                      drugs={this.state.drugs}
                      handleChange={this.handleChange}
                      handleDrugTypeAhead={this.handleDrugTypeAhead}
                      handleServiceDetailsInputChange={
                        this.handleServiceDetailsInputChange
                      }
                      handlePaymentMediumChange={handlePaymentMediumChange}
                      // ref={(ref) => (this._names_typeahead = ref)}
                      _services_typeahead={this._services_typeahead}
                      handleRadio={this.handleRadio}
                      discount={this.state.discount}
                      handlePercentage={this.handlePercentage}
                      discountValue={this.discountValue}
                      balance={bal}
                      total={grandTotal}
                      discount_value={totalDiscount}
                    />
                  </Route>
                </CardBody>
              </Scrollbars>
            </>
          )}
        </Card>
        {/* <ServicesPreview
          toggle={togglePreview}
          modal={isPreviewModal}
          loading={saveCostingLoading}
          serviceDetails={serviceDetails}
          servicesList={servicesList}
        /> */}
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getRevAccHeads: () => dispatch(getRevAccHeads()),
    dispenseDrugs: (x, y, z) => dispatch(dispenseDrugs(x, y, z)),
  }
}

function mapStateToProps(state) {
  return {
    revAccHeads: state.transactions.revAccHeads,
    patients: state.records.patients,
    facilityId: state.auth.user.facilityId,
    facilityInfo: state.facility.info,
    user: state.auth.user,
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(Services)
