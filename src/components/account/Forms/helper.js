import { apiURL } from '../../../redux/actions'
import { _fetchApi2, _postApi } from '../../../redux/actions/api'
import store from '../../../redux/store'
import { _customNotify } from '../../utils/helpers'

export const newDeposit = (data, callback = (f) => f, error = (f) => f) => {
  _postApi(
    `${apiURL()}/txn/new-deposit`,
    {
      acct: data.clientAccount,
      totalAmount: data.depositAmount,
      receiptNo: data.receiptno,
      modeOfPaymen: data.modeOfPayment,
      patientId: data.clientAccount,
      patientName: data.accName,
      txnType: 'deposit',
      createdAt: '',
      payablesHead: data.payable_head,
      payablesHeadName: data.payable_head_name,
      receivablesHead: data.receivable_head,
      bankName: '',
      txn_date: '',
      txn_status: 'pending',
      amountPaid: data.depositAmount,
      query_type: 'deposit',
      revenueHead: '',
      revenueHeadName: '',
      receivablesHeadName: data.receivable_head_name,
      totalReceivable: 0,
      revenueAmount: 0,
    },
    (resp) => {
      callback(resp)
    },
    (err) => {
      error(err)
    },
  )
}

export const getDiscountApi = (
  query,
  callback = (f) => f,
  error = (f) => f,
) => {
  const facilityId = store.getState().auth.user.facilityId
  _fetchApi2(
    `${apiURL()}/discounts/all?query_type=${query}&facilityId=${facilityId}`,
    (d) => {
      callback(d)
    },
    (err) => error(err),
  )
}

export const postDiscountApi = (
  data,
  callback = (f) => f,
  error = (f) => f,
) => {
  _postApi(
    `${apiURL()}/discounts/new`,
    data,
    (d) => {
      callback(d)
    },
    (err) => error(err),
  )
}
