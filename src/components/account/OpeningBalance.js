import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Typeahead } from 'react-bootstrap-typeahead'
import { Form, FormGroup, Card, CardHeader, CardBody } from 'reactstrap'
import {
  generateReceiptNo,
  today,
  _customNotify,
  _warningNotify,
} from '../utils/helpers'
import { getAccHeads } from '../../redux/actions/transactions'
import { _postApi } from '../../redux/actions/api'
import { apiURL } from '../../redux/actions'
import CustomButton from '../comp/components/Button'
import { IoMdMove } from 'react-icons/io'

const OpeningBalance = () => {
  const _from = useRef()
  const _to = useRef()
  const dispatch = useDispatch()
  //   const users = useSelector((state) => state.auth.users)
  const { accHeads } = useSelector((state) => state.transactions)

  const transfer = (data, callback) => dispatch(transfer(data, callback))

  const [state, setState] = useState({
    from: '',
    from_name:'',
    to: '',
    amount: '',
    comment: '',
    date: today,
    transfersErrorAert: '',
    loading: false,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setState((p) => ({ ...p, loading: true }))
    const { from, amount, date } = state
    if (from === '' || amount === '') {
      setState((p) => ({
        ...p,
        transfersErrorAert: 'Please fill all textboxes',
      }))
    } else {
      generateReceiptNo((receiptno, receiptsn) => {
        const data = {
          amount,
          transaction_date: date,
          descr: 'Opening Balance',
          receiptno,
          receiptsn,
          from,
          to: '',
          query_type: 'opening-balance',
        }

        _postApi(
          `${apiURL()}/account/move-money`,
          data,
          (resp) => {
            // console.log(resp);
            _customNotify('Success')
            setState((p) => ({
              ...p,
              from: '',
              from_name: '',
              to: '',
              amount: '',
              comment: '',
              date: today,
            }))
            _from.current.clear()
            _to.current.clear()
            setState((p) => ({ ...p, loading: false }))
            resetForm()
          },
          (err) => {
            console.log(err)
            _warningNotify('Failed!')
            setState((p) => ({ ...p, loading: false }))
          },
        )
      })
    }
  }

  useEffect(() => {
    dispatch(getAccHeads())
  }, [dispatch])

  const resetForm = () =>
    setState((p) => ({ from: '', to: '', amount: '', comment: '' }))

  return (
    <Card>
      <CardHeader>
        <h5>Opening Balance</h5>
      </CardHeader>
      <CardBody>
        <Form>
          <FormGroup row>
            <div className="offset-md-6 offset-lg-6 col-md-6 col-lg-6">
              <label>Date</label>
              <input
                type="date"
                className="form-control"
                name="date"
                // disabled
                onChange={({ target: { value } }) =>
                  setState((p) => ({ ...p, date: value }))
                }
                value={state.date}
              />
            </div>
          </FormGroup>
          <FormGroup row>
            <div className="col-md-6 col-lg-6">
              <label>Select Account</label>
              <Typeahead
                align="justify"
                labelKey={(item) => `${item.head} - ${item.description}`}
                id="description-1"
                ref={_from}
                options={accHeads.length ? accHeads : [{ head: '' }]}
                onChange={(val) => {
                  if (val.length)
                    setState((p) => ({
                      ...p,
                      from: val[0]['head'],
                      from_name: val[0]['description'],
                    }))
                }}
              />
            </div>
            <div className="col-md-6 col-lg-6">
              <label>Amount</label>
              <input
                type="number"
                className="form-control"
                name="amount"
                onChange={({ target: { value } }) =>
                  setState((p) => ({ ...p, amount: value }))
                }
                value={state.amount}
              />
            </div>
            {/* <div className="col-md-6 col-lg-6">
              <label>To</label>
              <Typeahead
                align="justify"
                labelKey={(item) => `${item.head} - ${item.description}`}
                id="description-2"
                ref={_to}
                options={accHeads.length ? accHeads : [{ head: '' }]}
                onChange={(val) => {
                  if (val.length)
                    setState((p) => ({ ...p, to: val[0]['head'] }))
                }}
              />
            </div> */}
          </FormGroup>

          <FormGroup row>
            {/* <div className="col-md-6 col-lg-6">
              <label>Comment (Optional)</label>
              <input
                type="text"
                className="form-control"
                name="comment"
                onChange={({ target: { value } }) =>
                  setState((p) => ({ ...p, comment: value }))
                }
                value={state.comment}
              />
            </div> */}
          </FormGroup>
          <center>
            <span style={{ color: 'red' }}>
              {state.transfersErrorAert.length
                ? state.transfersErrorAert
                : null}
            </span>
          </center>
        </Form>
        <center>
          <CustomButton
            loading={state.loading}
            className="btn btn-primary px-3"
            onClick={handleSubmit}
          >
            <IoMdMove /> Submit
          </CustomButton>
        </center>
      </CardBody>
    </Card>
  )
  //   }
}

// const mapStateToProps = ({
//   auth,
//   transactions: { accHeads, loadingAccHead },
// }) => ({
//   accHeads,
//   loadingAccHead,
//   users: auth.users,
// })

// const mapDispatchToProps = (dispatch) => ({
//   getAccHeads: () => dispatch(getAccHeads()),
//   getUsers: () => dispatch(getUsers()),
//   transfer: (data, callback) => dispatch(transfer(data, callback)),
// })

export default OpeningBalance
