// import Checkbox from 'evergreen-ui/commonjs/checkbox/src/Checkbox'
import moment from 'moment'
import React from 'react'
import { formatNumber } from '../../utils/helpers'
import AddBank from './AddBank'

function AccountReviewTableRow({
  i,
  item = {},
  handleAmountChange = (f) => f,
  processPayment = (f) => f,
  handleTable = (f) => f,
  modal,
  toggle = (f) => f,
  form = {},
  handleChange = (f) => f,
  setSelected = (f) => f,
  selected,
  onBankSelect = (f) => f,
  setSelectedItem = (f) => f,
  selectedItem = {},
  setModeOfPayment = (f) => f,
}) {
  let balance = parseFloat(item.total) - parseFloat(item.paid)
  let btnIsValid =
    // item.modeOfPayment &&
    // item.modeOfPayment !== '' &&
    // item.modeOfPayment !== '---Select---' &&
    item.paid !== ''
  // &&
  // item.paid !== 0 &&
  // item.paid !== '0'

  const rowIsDisabled = item.approval_status === 'pending_discount'
  return (
    <>
      <tr
        style={{ backgroundColor: rowIsDisabled ? '#e6aeaa' : '' }}
        //   onClick={() =>
        //     history.push(
        //       `/me/account/details/expenses/${item.reference_no}/${
        //         item.description
        //       }`
        //     )
        //   }
      >
        <td className="text-center">{i + 1}</td>
        <td>{moment(item.createdAt).format('DD/MM/YYYY')}</td>
        <td>{item.client_type || '-'}</td>
        <td>{item.fullname}</td>
        {/* <td className="">{item.client_acct}</td> */}
        <td className="text-right">{formatNumber(item.total)}</td>
        <td className="text-right">
          <input
            className="form-control text-right"
            value={item.paid}
            onFocus={(e) => e.target.select()}
            onChange={(e) =>
              handleAmountChange(e.target.value, item.reference_no)
            }
            // disabled
          />
          {/* {formatNumber(item.paid)} */}
        </td>
        <td className="text-right">{formatNumber(balance)}</td>
        {/* <td className="text-right">
          <select
            className="form-control text-right"
            value={item.modeOfPayment}
            onChange={
              (e) => {
                let v = e.target.value
                handleTable('modeOfPayment', v, item.reference_no)
                setSelected({ ...item, modeOfPayment: v })
                if (v.toLowerCase() === 'bank' || v.toLowerCase() === 'pos') {
                  toggle()
                }
              }
              //   handleTable('modeOfPayment', e.target.value, item.reference_no)
            }
          >
            <option>---Select---</option>
            <option value="Cash">Cash</option>
            <option value="POS">POS</option>
            <option value="Bank">Bank</option>
          </select>
        </td> */}
        <td className="text-center">
          <button
            disabled={!btnIsValid || rowIsDisabled}
            className="btn btn-success"
            onClick={() => {
              if (item.client_type === 'Family' || item.client_type === '') {
                toggle()
                setSelectedItem(item)
              } else {
                processPayment(item)
              }
            }}
            // onClick={() => processPayment(item)}
          >
            Process
          </button>
          {/* <Checkbox
              checked={!uncheckedList.includes(item.reference_no)}
              onChange={() => {
                // checked===true ? setChecked(false) : setChecked(true)
                if (!uncheckedList.includes(item.reference_no)) {
                  setChecked(false)
                  onUnchecked(item)
                } else {
                  setChecked(true)
                  onChecked(item)
                }
              }}
            /> */}

          <AddBank
            selectedItem={selectedItem}
            toggle={() => {
              toggle()
              //   setSelected(item)
            }}
            modal={modal}
            // onSelect={(bank) => onBankSelect(item, bank)}
            setSelectedItem={setSelectedItem}
            processPayment={processPayment}
          />
        </td>
      </tr>
    </>
  )
}

export default AccountReviewTableRow
