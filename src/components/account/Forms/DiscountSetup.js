import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Card, CardBody, CardHeader } from 'reactstrap'
import { apiURL } from '../../../redux/actions'
import { _fetchApi2, _postApi } from '../../../redux/actions/api'
import CustomButton from '../../comp/components/Button'
import CustomForm from '../../comp/components/CustomForm'
import CustomTable from '../../comp/components/CustomTable'
import { _customNotify, _warningNotify } from '../../utils/helpers'

function DiscountSetup() {
  const [form, setForm] = useState({
    discount_head: '30030',
    discount_head_name: 'Discount',
  })

  const [loading, setLoading] = useState(false)
  const [discountList, setDiscountList] = useState([])
  const facilityId = useSelector((state) => state.auth.user.facilityId)

  const tableFields = [
    { title: 'Discount Name', value: 'discountName' },
    { title: 'Discount Type', value: 'discountType' },
    {
      title: 'Discount Amount',
      component: (item) => <span>{item.discountAmount}</span>,
    },
  ]
  const fields = [
    {
      label: 'Discount Name',
      value: form.discount_name,
      name: 'discount_name',
      col: 6,
    },
    {
      label: 'Discount Type',
      type: 'radio',
      options: [
        { label: 'Fixed', name: 'Fixed' },
        { label: 'Percentage', name: 'Percentage' },
      ],
      value: form.discount_type,
      name: 'discount_type',
      col: 6,
    },
    {
      label: 'Discount Amount',
      value: form.discount_amount,
      name: 'discount_amount',
      col: 6,
    },
  ]

  const handleChange = ({ target: { name, value } }) =>
    setForm((p) => ({ ...p, [name]: value }))

  const handleSubmit = () => {
    setLoading(true)
    _postApi(
      `${apiURL()}/discounts/new`,
      {
        query_type: 'new',
        ...form,
      },
      () => {
        setLoading(false)
        _customNotify('New Discount Created')
        setForm({
          discount_head: '30030',
          discount_head_name: 'Discount',
        })
        getDiscount()
      },
      (err) => {
        _warningNotify('An error occured')
        console.log(err)
      },
    )
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
    <Card>
      <CardHeader>Setup Discount</CardHeader>
      <CardBody>
        {/* {JSON.stringify(discountList)} */}
        <CustomForm
          fields={fields}
          handleChange={handleChange}
          handleRadioChange={(k, v) => setForm((p) => ({ ...p, [k]: v }))}
        />

        <center className="my-3">
          <CustomButton loading={loading} onClick={handleSubmit}>
            Submit
          </CustomButton>
        </center>

        <CustomTable
          size="sm"
          bordered
          data={discountList}
          fields={tableFields}
        />
      </CardBody>
    </Card>
  )
}

export default DiscountSetup
