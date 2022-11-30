import React, { useEffect, useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import { FaSave } from 'react-icons/fa'
import { useHistory, useParams } from 'react-router'
import { Button, FormGroup, Input, Table } from 'reactstrap'
import { apiURL } from '../../redux/actions'
import { _fetchApi, _postApi, _updateApi } from '../../redux/actions/api'
// import Discount from "../account/Forms/Discount";
// import ServiceForm from "../account/Forms/ServiceForm";
import {
  formatNumber,
  generateReceiptNo,
  _customNotify,
  _warningNotify,
} from '../utils/helpers'

export default function PendingPharmacyTable({
  price,
  serviceDetails,
  names,
  handleNamesChange,
  servicesForm,
  handleQttyChange,
  accountNo,
  drugs,
  // handleChange,
  handleDrugTypeAhead,
  handleServiceDetailsInputChange,
  handlePaymentMediumChange,
  _services_typeahead,
  _names_typeahead,
  drug_code,
  handleDrugCodeChange,
  drugInfo = {},
  quantityRef = null,
  drugCodeRef = null,
  paymentStatus,
  getBalance = (f) => f,
  handleRadio,
  discount,
  handlePercentage,
  discountValue,
  balance,
  total,
  discount_value,
  paymentMedium,
}) {
  const { patient_id } = useParams()
  const [drugList, setDrugList] = useState([])
  const history = useHistory()
  // const [display, setDisplay] = useState(true);

  // const _setDisplay = (index) => {
  //   setDisplay(!display, index);
  // };
  const _getPriscription = () => {
    _fetchApi(
      `${apiURL()}/prescriptions/all/${patient_id}`,
      ({ results }) => {
        if (results && results.length) {
          let final = results.map((item) => ({
            ...item,
            total: parseFloat(item.price) * parseFloat(item.qtyDispense),
          }))
          setDrugList(final)
        }
      },
      (error) => _warningNotify(error.toString()),
    )
  }
  // const handleDel = (index) => {
  //   const newList = [...drugList];
  //   newList.splice(index, 1);
  //   setDrugList(newList);
  // };

  const totalAmt = drugList.reduce((a, b) => a + parseFloat(b.total), 0)
  useEffect(() => {
    getBalance(patient_id)
    _getPriscription()
  }, [patient_id])

  const handleTableChange = (key, value, index) => {
    let newArr = []
    drugList.forEach((item, i) => {
      if (i === index) {
        newArr.push({
          ...drugList[index],
          [key]: value,
          total: parseFloat(item.price) * value,
        })
      } else {
        newArr.push(item)
      }
    })
    setDrugList(newArr)
  }
  const processPaymentNow = () => {
    // const { serviceDetails, total, servicesList } = this.state;
    generateReceiptNo((rec, recno) => {
      // this.setState(
      //   {
      //     saveCostingLoading: false,
      //     receivedData,
      //   },
      //   () => this.setState({ preview: true }),
      // );

      // console.log(receivedData)
      // console.log(servicesList)
      // this.processPayment(callback);
      // let _card = this.state.cart;

      let finalList = []
      // let total_new = 0;
      drugList.forEach((item, i) => {
        let patientAcc = item.patient_id.split('-')[0]
        // console.log(item);
        finalList.push({
          drug_code: item.drug_code,
          drug: item.drug,
          cost: item.cost_price,
          expiry: item.expiry_date,
          generic: item.generic_name,
          unit_of_issue: item.unit_of_issue,
          quantity: item.qtyDispense,
          userId: patient_id,
          supplierId: item.supplier,
          description: item.drug,
          source: 'Deposit',
          amount: totalAmt,
          receiptsn: rec,
          receiptno: recno,
          modeOfPayment: 'Deposit',
          destination: 'Drug Sales',
          selling_price: item.price,
          quantityAvailable: '',
          mark_up: item.markUp,
          accNo: accountNo,
          transactionType: 'Deposit',
          sourceAcct: 'Deposit',
          paymentStatus: 'Deposit',
          id: item.id,
          request_id: item.request_id,
          patientAcc: patientAcc,
          patient_id: item.patient_id,
        })
        // total_new = parseInt(total_new) + parseInt(servicesList[i].amount1);
      })

      // console.log('finallist', finalList);

      for (let i = 0; i < finalList.length; i++) {
        const element = finalList[i]
        _postApi(
          `${apiURL()}/drugs/sales/new`,
          element,
          () => {
            history.push('/me/pharmacy/sale')
          },
          (error) => {
            console.log(error)
          },
        )
        _updateApi(`${apiURL()}/prescriptions/update/dispense`, {
          id: element.request_id,
        })
      }
      // const drugID = [];
      // drugList.forEach((item, i) => {
      //   drugID.push({ id: item.id });
      // });
      // for (let i = 0; i < drugID.length; i++) {
      //   const element = drugID[i];

      // }
      _customNotify('successfully transaction!')
    })
  }

  return (
    <>
      {/* {JSON.stringify(patientID)} */}

      <FormGroup row>
        <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
          <label className="">Select Patient Account</label>
          <Typeahead
            align="justify"
            labelKey="names"
            id="names"
            disabled
            ref={_services_typeahead}
            options={names.length ? names : ['']}
            onChange={(val) => {
              if (val.length) {
                handleNamesChange(val[0])
              }
            }}
          />
        </div>

        <div className=" col-md-4 col-lg-4 mt-4">
          <label style={{ fontWeight: 'bold' }}>Account No: </label>
          <span> {accountNo}</span>
        </div>

        <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
          <div>
            <label>Balance</label>
            <input
              className="form-control"
              disabled
              value={serviceDetails.balance}
            />
          </div>
        </div>
      </FormGroup>
      {/* {JSON.stringify(drugList)} */}
      <Table bordered size='sm'>
        <thead>
          <tr>
            {/* <th /> */}
            <th className="text-center">Drug</th>
            <th className="text-center">Price(₦)</th>
            {/* <th className='text-center'> Qty request</th> */}
            <th className="text-center">Prescription Detail</th>
            <th className="text-center">Qty Dispensed</th>
            <th className="text-center">Amount (₦)</th>
          </tr>
        </thead>
        <tbody>
          {drugList.map((item, i) => (
            <tr key={i}>
              {/* <td className="d-flex">
                <Button
                  size="sm"
                  color="danger"
                  disabled={!display}
                  onClick={(i) => _setDisplay(i)}
                >
                  Not Available
                </Button>
                {item.id}
                <Button size="sm" color="primary" className="ml-1">
                  Replace
                </Button>
              </td> */}
              <td>{item.drug}</td>
              <td className="text-right">{item.price}</td>
              {/* <td /> */}
              <td>
                {`${item.route} ${item.drug} ${item.dosage} every ${
                  item.frequency
                } for ${item.duration} ${item.period}(s) ${
                  item.additionalInfo ? item.additionalInfo : ''
                }`}
              </td>
              <td className="text-center">
                <Input
                  type="number"
                  name="qtyDispense"
                  className="text-right"
                  style={{width: 100}}
                  value={item.qtyDispense}
                  onChange={({ target: { value } }) => {
                    handleTableChange('qtyDispense', value, i)
                  }}
                />
              </td>
              <td className="text-right">{formatNumber(item.total)}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={3} />
            <td colSpan={2} className="text-right font-weight-bold">
              Total: {formatNumber(totalAmt)}
            </td>
          </tr>
        </tbody>
      </Table>
      {/* <Discount
        handleRadio={handleRadio}
        discount={discount}
        handlePercentage={handlePercentage}
        discountValue={discountValue}
      />
      <ServiceForm
        balance={balance}
        total={total}
        discount_value={discount_value}
        paymentMedium={paymentMedium}
        discountValue={discount_value}
      /> */}
      <center>
        <Button className="px-4" color="primary" onClick={processPaymentNow}>
          <FaSave size={18} style={{ marginRight: 5 }} />
          Pay Now
        </Button>
      </center>
    </>
  )
}