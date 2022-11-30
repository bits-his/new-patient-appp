import React, { useEffect, useCallback, useState } from 'react'
import { CardBody, CardHeader, Alert } from 'reactstrap'
import CustomTable from '../../../comp/components/CustomTable'
import Card from 'reactstrap/lib/Card'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { apiURL } from '../../../../redux/actions'
import {
  formatNumber,
  _customNotify,
  _warningNotify,
} from '../../../utils/helpers'
import { useHistory } from 'react-router'
import { _fetchApi2, _postApi } from '../../../../redux/actions/api'
import { getPendingPartPayments } from '../../../../redux/actions/account'
// import BackButton from "../../../comp/components/BackButton";

function PendingPayments() {
  const dispatch = useDispatch()
  const list = useSelector((state) => state.account.pendingPartPayment)
  // const [form, setForm] = useState()

  const handleAmountPaidChange = (item, value) => {
    // setForm({...item, amountPaid: value })
    let newList = []
    list.forEach((i) => {
      if (i.fullname === item.fullname) {
        newList.push({ ...item, amountPaid: value })
      } else {
        newList.push(item)
      }
    })
  }

  const onProcess = (item) => {
    let acct = item.client_id.split('-')[0]

    // acct: "384-1"
    // balance: 4000
    // client_id: "384-1"
    // createdAt: "2021-10-08"
    // fullname: "Rosario4 Nina"
    // paid: 15000
    // receivable_head: "4000236"
    // receivable_head_name: "General Patient Receivables"
    // reference_no: "081021591"
    // total: 19000

    // _fetchApi2(
    //   `${apiURL()}/lab/lab-summary?type=pending approval detail&report_by=${
    //     item.client_id
    //   }&from=&to=&facilityId=${user.facilityId}`,
    //   (data) => {
    //     if (data.results) {
    //       // console.log(data.results)
    //       for (let i = 0; i < data.results.length; i++) {
    //         let curr = data.results[i]
    console.log(item)
    _postApi(
      `${apiURL()}/txn/cashier-approval`,
      {
        acct,
        totalAmount: item.total,
        totalReceivable: item.balance,
        receiptNo: item.reference_no,
        modeOfPayment: 'Cash',
        patientId: item.client_id,
        patientName: item.fullname,
        txnType: '',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        payablesHead: item.payable_head,
        payablesHeadName: item.payable_head_name,
        receivablesHead: item.receivable_head,
        receivablesHeadName: item.receivable_head_name,
        // cashHead : '',
        bankName: '',
        txn_date: moment().format('YYYY-MM-DD'),
        discount: '0',
        // discountHead : '',
        txn_status: 'pending',
        amountPaid: item.amountPaid,
        query_type: 'complete part payment',
        revenueHead: item.account,
        revenueHeadName: item.account_name,
      },
      () => {
        _customNotify('Transaction completed')
        getList()
      },
      (err) => {
        console.log(err)
        _warningNotify('An error occured!')
      },
    )
    //   }
    // }
    //   },
    //   (err) => {
    //     console.log(err)
    //   },
    // )
  }

  const fields = [
    {
      title: 'Date',
      // value: "createdAt",
      custom: true,
      component: (item) => (
        <div>{moment(item.createdAt).format('DD/MM/YYYY')}</div>
      ),
    },
    {
      title: 'Name',
      value: 'fullname',
    },
    {
      title: 'Total',
      // value: "total",
      custom: true,
      component: (item) => (
        <div className="text-right">{formatNumber(item.total)}</div>
      ),
    },
    {
      title: 'Paid',
      // value: "paid",
      custom: true,
      component: (item) => (
        <div className="text-right">{formatNumber(item.paid)}</div>
      ),
    },
    {
      title: 'Balance',
      custom: true,
      component: (item) => (
        <div className="text-right">{formatNumber(item.balance)}</div>
      ),
    },
    {
      title: 'Amount Paid',
      custom: true,
      component: (item) => (
        <div className="text-right">
          <input
            disabled
            onChange={(e) => handleAmountPaidChange(item, e.target.value)}
            className="form-control text-right"
            value={item.balance}
          />
        </div>
      ),
    },
    {
      title: 'Action',
      custom: true,
      component: (item) => (
        <div className="text-center">
          <button
            className="btn btn-warning btn-sm"
            onClick={() => onProcess(item)}
            // history.push(
            //   `/me/account/pending-payments-details?reference=${item.reference_no}&account=${item.acct}&patient_id=${item.client_id}&name=${item.fullname}`,
            // )
          >
            Process
          </button>
        </div>
      ),
    },
  ]

  const getList = useCallback(() => {
    dispatch(getPendingPartPayments())
    // fetch(
    //   `${apiURL()}/lab/lab-summary?type=pending income&from=${today}&to=${today}&facilityId=${
    //     user.facilityId
    //   }`,
    // )
    //   .then((raw) => raw.json())
    //   .then((data) => {
    //     if (data.success && data.results) {
    //       setList(data.results)
    //     }
    //   })
    //   .catch((err) => console.log(err))
  }, [dispatch])

  useEffect(() => {
    getList()
  }, [getList])

  return (
    <Card>
      <CardHeader className="h6">
        {/* <BackButton size="sm" className="mr-1" /> */}
        <span className="text-center">Pending Payments</span>
      </CardHeader>
      <CardBody>
        <CustomTable data={list} fields={fields} size="sm" bordered />
        {/* {JSON.stringify(list)} */}
        {list.length ? null : (
          <Alert color="success" className="text-center">
            Nothing to display at this time, check back later.
          </Alert>
        )}
      </CardBody>
    </Card>
  )
}

export default PendingPayments
