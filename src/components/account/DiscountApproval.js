import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { Alert, Card, CardBody, CardHeader } from 'reactstrap'
import CustomButton from '../comp/components/Button'
import CustomTable from '../comp/components/CustomTable'
import { formatNumber, _customNotify, _warningNotify } from '../utils/helpers'
import { getDiscountApi, postDiscountApi } from './Forms/helper'
import { getPendingDiscount } from '../../redux/actions/account'

function DiscountApproval() {
  //   const [pendingList, setPendingList] = useState([])
  const pendingList = useSelector(
    (state) => state.account.pendingDiscountRequests,
  )
  const dispatch = useDispatch()

  //   const getDiscount = () => {
  //     getDiscountApi('pending', (d) => {
  //       if (d && d.results) {
  //         setPendingList(d.results)
  //       }
  //     })
  //   }

  useEffect(() => {
    dispatch(getPendingDiscount())
  }, [dispatch])

  const approveDiscount = (item) => {
    let data = {
      query_type: 'approval',
      receiptNo: item.receiptNo,
    }
    postDiscountApi(
      data,
      () => {
        _customNotify('Discount approved successfully')
        dispatch(getPendingDiscount())
      },
      () => {
        _warningNotify('An error occured, try again later.')
      },
    )
  }

  const fields = [
    {
      title: 'Date',
      component: (item) => (
        <span>{moment(item.created_at).format('DD/MM/YYYY HH:mm')}</span>
      ),
    },
    { title: 'Patient Name', value: 'patient_name' },
    { title: 'Proposed Discount', value: 'discount' },
    {
      title: 'Total Amount',
      component: (item) => (
        <div className="text-right">{formatNumber(item.total_amount)}</div>
      ),
    },
    {
      title: 'Total Discount',
      component: (item) => (
        <div className="text-right">{formatNumber(item.discount_amount)}</div>
      ),
    },
    // {
    //   title: 'Discount Amount',
    //   value: (item) => {
    //     let discountedAmount =
    //       item.discountType === 'fixed'
    //         ? item.discountAmount
    //         : item.total_amount * (item.discountAmount / 100)
    //     return <span>{discountedAmount}</span>
    //   },
    // },
    {
      title: 'Action',
      component: (item) => (
        <div className="text-center">
          <CustomButton
            size="sm"
            className="mr-1"
            color="success"
            onClick={() => approveDiscount(item)}
          >
            <FaCheck className="mr-2" />
            Approve
          </CustomButton>
          {/* <CustomButton
              size="sm"
            color="danger"
          >
            <FaTimes className="mr-2" />
            Reject
          </CustomButton> */}
        </div>
      ),
    },
  ]

  return (
    <Card>
      <CardHeader className="text-center h6">
        Pending Discount Requests
      </CardHeader>
      <CardBody>
        {/* {JSON.stringify(pendingList)} */}
        <CustomTable
          // size="sm"
          bordered
          fields={fields}
          data={pendingList}
        />
        {!pendingList.length ? (
          <Alert className="text-center" color="primary">
            No pending discount request at this time, check back later.
          </Alert>
        ) : (
          ''
        )}
      </CardBody>
    </Card>
  )
}

export default DiscountApproval
