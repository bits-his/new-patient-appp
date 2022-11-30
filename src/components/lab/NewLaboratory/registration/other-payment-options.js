import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Input } from 'reactstrap'
import { apiURL } from '../../../../redux/actions'
import { _fetchApi2 } from '../../../../redux/actions/api'
import Checkbox from '../../../comp/components/Checkbox'
import RadioGroup from '../../../comp/components/RadioGroup'
import SelectInput from '../../../comp/components/SelectInput'

const discountOptions = [
  { name: 'Fixed', label: 'Fixed' },
  { name: 'Percentage', label: 'Percentage (%)' },
]

function OtherPaymentOptions({
  setPartPayment = (f) => f,
  setDiscount = (f) => f,
  partPayment = {},
  discount = {},
  totalAmount = 0,
}) {
  const facilityId = useSelector((state) => state.auth.user.facilityId)
  const [discountList, setDiscountList] = useState([])
  const handleCheckboxChange = (item) => {
    if (item === 'Part Payment') {
      setPartPayment((p) => ({ ...p, enabled: !p.enabled }))
    } else {
      setDiscount((p) => ({
        ...p,
        enabled: !p.enabled,
        discountType: 'Fixed',
      }))
    }
  }

  const handleDiscountTypeChange = (name, val) => {
    setDiscount((p) => ({ ...p, [name]: val }))
  }

  const handleDiscountChange = ({ target: { value } }) => {
    let amt =
      discount.discountType === 'Fixed'
        ? value
        : totalAmount * (parseFloat(value) / 100)
    setDiscount((p) => ({ ...p, discountAmount: value, amount: amt }))
  }

  const getDiscount = useCallback(() => {
    _fetchApi2(
      `${apiURL()}/discounts/all?query_type=select&facilityId=${facilityId}`,
      (d) => {
        // alert('here')
        if (d && d.results) {
          setDiscountList(d.results)
        }
      },
    )
  }, [facilityId])

  useEffect(() => {
    getDiscount()
  }, [getDiscount])

  return (
    <div className="m-1 border border-secondary p-1 rounded">
      <div>
        {/* <span className="font-weight-bold">Other Options:</span> */}
        {/* {JSON.stringify(discount)} */}
        {/* <SelectInput
          container="col-md-12"
          label="Select Discount"
          value={discount.discountName}
          options={discountList.map((item) => `${item.discountName}`)}
          onChange={({ target: { value } }) => {
            let totalDiscountAmount = 0
            let actualDiscount = discountList.find(
              (a) => a.discountName === value,
            )
            if (actualDiscount.discountType === 'Fixed') {
              totalDiscountAmount = actualDiscount.discountAmount
            } else {
              totalDiscountAmount =
                totalAmount * (actualDiscount.discountAmount / 100)
            }
            setDiscount({ ...actualDiscount, totalDiscountAmount })
            // alert(actualDiscount)
          }}
        /> */}

        {/* <div className="row m-0 p-0">
          {/* {["Discount", "Part Payment"].map((item, i) => ( *
          {["Discount"].map((item, i) => (
            <Checkbox
              key={i}
              name="otherPayment"
              label={item}
              container="col-6"
              checked={
                item === "Discount" ? discount.enabled : partPayment.enabled
              }
              onChange={() => handleCheckboxChange(item)}
            />
          ))}
        </div> */}
      </div>

      {partPayment.enabled && (
        <div className="my-1">
          <label htmlFor="amount" className="font-weight-bold">
            Amount Paid:{" "}
          </label>
          <Input
            type="number"
            name="amount"
            // size="sm"
            value={partPayment.amount}
            onFocus={() => {
              if (partPayment.amount === 0) {
                setPartPayment((p) => ({ ...p, amount: "" }));
              }
            }}
            onBlur={() => {
              if (partPayment.amount === "") {
                setPartPayment((p) => ({ ...p, amount: 0 }));
              }
            }}
            onChange={({ target: { value } }) =>
              setPartPayment((p) => ({ ...p, amount: value }))
            }
          />
        </div>
      )}

      {/* {discount.enabled && (
        <div className="my-1">
          <RadioGroup
            label="Discount Type:"
            options={discountOptions}
            value={discount.discountType}
            onChange={handleDiscountTypeChange}
            name="discountType"
          />
          <div className="row mx-0 px-0">
            <label htmlFor="discountAmount" className="col-4 text-right">
              Amount:
            </label>
            <Input
              type="number"
              className="col-7"
              name="discountAmount"
              onChange={handleDiscountChange}
              //   size="sm"
              value={discount.discountAmount}
              onFocus={() => {
                if (discount.discountAmount === 0) {
                  setDiscount((p) => ({ ...p, discountAmount: "", amount: 0 }));
                }
              }}
              onBlur={() => {
                if (discount.discountAmount === "") {
                  setDiscount((p) => ({ ...p, discountAmount: 0, amount: 0 }));
                }
              }}
            />
          </div>
        </div>
      )} */}
      {/* {JSON.stringify(partPayment)} */}
    </div>
  )
}

export default OtherPaymentOptions
