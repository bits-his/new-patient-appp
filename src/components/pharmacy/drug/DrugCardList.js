import React, { useCallback, useEffect, useState } from 'react'
import { FaTrash } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { Row, Table } from 'reactstrap'
import { apiURL } from '../../../redux/actions'
import { _fetchApi, _fetchApi2 } from '../../../redux/actions/api'
import { CustomButton, CustomForm } from '../../comp/components'
import CustomCard from '../../comp/components/CustomCard'
import CustomTypeahead from '../../comp/components/CustomTypeahead'
import { formatNumber } from '../../utils/helpers'

function DrugCardList({
  list = [],
  setSelectedCustomer = {},
  otherInfo = {},
  handleOtherInfoChange = (f) => f,
  handleSubmit = (f) => f,
  amountPaidRef,
  handleDelete = (f) => f,
  clientInfo = [],
  submitting,
  setForm = (f) => f,
}) {
  let total = list.reduce((a, b) => a + parseFloat(b.amount), 0)
  let checkout = `Submit ₦ ${formatNumber(
    otherInfo.amountPaid > 0 ? otherInfo.amountPaid : total,
  )}`
  let change = parseFloat(otherInfo.amountPaid) - total
  if (
    otherInfo.amountPaid === null ||
    otherInfo.amountPaid === 0 ||
    (otherInfo.amountPaid > 0 && otherInfo.amountPaid !== total)
  ) {
    otherInfo.amountPaidDefault =
      otherInfo.amountPaid > 0 ? otherInfo.amountPaid : total
    otherInfo.total = total
  }

  const [patients,setPatients] = useState([])

  //useSelector((state) => state.individualDoc.patients)
  const getPatient = useCallback(() => {
    _fetchApi2(
      `${apiURL()}/get/patients?query_type=all`,
      (data) => {
        if (data.success) {
          setPatients(data.results)
        }
      },
      (err) => {
        console.log(err);
      }
    );
  },[]);

  useEffect(()=>{
    getPatient()
  },[getPatient])

  const fields = [
    {
      type: 'number',
      label: 'Amount Paid ',
      name: 'amountPaid',
      placeholder:otherInfo.amountPaid > 0 ? otherInfo.amountPaid : total,
      value:otherInfo.amountPaid !==null ? otherInfo.amountPaid : total,
      size: 'sm',
      col: 6,
    },
    {
      type: 'read-only',
      label: change <= 0 ? 'Balance' : 'Change',
      name: 'change',
      value: Math.abs(change) || 0,
      disabled: true,
      size: 'sm',
      col: 6,
    },
    {
      type: 'number',
      label: 'Discount',
      name: 'discount',
      value: otherInfo.discount,
      onFocus: (e) => e.target.select(),
      size: 'sm',
      col: 6,
    },
    {
      type: 'select',
      label: 'Mode of Payment',
      name: 'modeOfPayment',
      size: 'sm',
      options: Object.values({
        CASH: 'CASH',
        POST: 'POS',
        BANK_TRANSFER: 'BANK TRANSFER',
        CREDIT: 'CREDIT',
        CHEQUE: 'CHEQUE',
      }),
      col: 6,
      value: otherInfo.modeOfPayment,
    },
  ]
  return (
    <CustomCard container="p-0" header="Cart List">
      {/* {JSON.stringify(form)} */}
      <CustomTypeahead
        label="Select Patient"
        labelKey={a => `${a.name} (${a.id})`}
        options={patients}
        onChange={(s) => {
          if (s.length) {
            console.log(s)
            setSelectedCustomer(s[0])
            setForm((p) => ({
              ...p,
              acct: s[0].accountNo,
              name: s[0].name,
              balance: s[0].balance,
            }))
          }
        }}
      />{' '}
      <div className="text-right">Total Amount: {formatNumber(total)}</div>
      <div style={{ height: '45.0vh', overflow: 'scroll' }}>
        <Table size="sm">
          <thead>
            <tr>
              <th className="text-center">Drug Name</th>
              <th className="text-center">Qty</th>
              <th className="text-center">Price</th>
              <th className="text-center">Total</th>
              <th className="text-center">X</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={index}>
                <td>{item.item_name}</td>
                <td className="text-center">{formatNumber(item.quantity)}</td>
                <td className="text-right">{formatNumber(item.price)}</td>
                <td className="text-right">
                  {formatNumber(parseInt(item.price) * parseInt(item.quantity))}
                </td>
                <td
                  className="text-center"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    handleDelete(index)
                  }}
                >
                <FaTrash className="text-danger" size={16} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Row>
        <CustomForm fields={fields} handleChange={handleOtherInfoChange} />
      </Row>
      <center className="">
        <CustomButton
          loading={submitting}
          disabled={total <= 0}
          onClick={(e) => {
            handleSubmit(e)
          }}
          className="px-5"
        >
          {checkout}
        </CustomButton>
      </center>
    </CustomCard>
  )
}

export default DrugCardList
