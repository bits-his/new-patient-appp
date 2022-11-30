import { PDFViewer } from '@react-pdf/renderer'
import { Table, TableBody, TableHead } from 'evergreen-ui'
import moment from 'moment'
import React, { useEffect, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { Col, Row } from 'reactstrap'
import useQuery from '../../../hooks/useQuery'
import { apiURL } from '../../../redux/actions'
import { _fetchApi } from '../../../redux/actions/api'
import {
  getSupplier,
  getSupplierStatement,
  supplierPayment,
} from '../../../redux/actions/pharmacy'
import { CustomButton, CustomTable } from '../../comp/components'
import CustomAlert from '../../comp/components/CustomAlert'
import CustomCard from '../../comp/components/CustomCard'
import CustomScrollbar from '../../comp/components/CustomScrollbar'
import DaterangeSelector from '../../comp/components/DaterangeSelector'
import { formatNumber } from '../../utils/helpers'
import SupplierRecieptPDF from './SupplierRecieptPDF'

export default function SupplierReport() {
  const today = moment().format('YYYY-MM-DD')
  const aMonthAgo = moment().subtract(1, 'month').format('YYYY-MM-DD')
  const query = useQuery()
  const supplier_code = query.get('supplier_code')
  const supplier_name = query.get('supplier_name')
  const { user } = useSelector((s) => s.auth)
  const supplierStatement = useSelector(
    (state) => state.pharmacy.supplierStatement,
  )
  const [print, setPrint] = useState()
  const [supplier,setSupplier] = useState({})

  const dispatch = useDispatch()
  const [form, setForm] = useState({
    from: aMonthAgo,
    to: today,
    searchTxt: '',
  })

  const { from, to } = form
  const handleChange = ({ target: { name, value } }) => {
    setForm((p) => ({ ...p, [name]: value }))
  }

  const _getSupplierStatement = useCallback(() => {
    dispatch(getSupplierStatement(form.from, form.to, supplier_code))
  }, [dispatch, form.from, form.to, supplier_code])
  const fields = [
    {
      title: 'S/N',
      custom: true,
      component: (item, index) => index + 1,
      className: 'text-center',
    },
    {
      title: 'Date',
      custom: true,
      component: (item) => moment(item.created_at).format('DD-MM-YYYY'),
      className: 'text-right',
    },
    {
      title: 'Description',
      value: 'description',
    },
    {
      title: 'Quantity',
      custom: true,
      component: (item) =>
        item.quantity === 0 || item.quantity === null
          ? '-'
          : formatNumber(item.quantity),
      className: 'text-center',
    },
    {
      title: 'Cost Of Items(₦)',
      custom: true,
      component: (item) =>
        item.quantity === null || item.quantity === 0
          ? '-'
          : formatNumber(item.quantity * item.cost_price),
      className: 'text-right',
    },
    {
      title: 'Amount Paid(₦)',
      custom: true,
      component: (item) =>
        item.cr === 0 || item.cr === null ? '-' : formatNumber(item.cr),
      className: 'text-right',
    },
    // {
    //   title: "Total(₦)",
    //   custom: true,
    //   component: (item) => formatNumber(item.total),
    //   className: "text-right",
    // },
  ]


  useEffect(() => {
    _getSupplierStatement()
  }, [_getSupplierStatement])

  const _getSupplier = useCallback(() =>{
    if(supplier_code){
      getSupplier({supplier_code},(resp=>{setSupplier(resp[0])}))
    }
  },[supplier_code])
  

  useEffect(()=>{
    _getSupplier()
  },[0])

  return (
    <CustomCard
      back
      header="Supplier Report"
      headerRight={
        print ? (
          ''
        ) : (
          <CustomButton onClick={() => setPrint(true)} className="text-right">
            Print Report
          </CustomButton>
        )
      }
    >
      {print ? (
        <PDFViewer height="700" width="900">
          <SupplierRecieptPDF
            name={supplier_name}
            data={supplierStatement}
            // total={'totalAmount'}
            grandTotal={'grandTotal'}
            balance={'balance'}
            info={''}
            page={''}
            modeOfPayment={''}
            receiptNo={''}
            busName={''}
            address={''}
            phone={''}
            business={{
              name: user.busName,
              account: user.image,
              address: user.address,
              phone: user.phone,
              image: user.image,
            }}
            client={{ from: form.from, to: form.to }}
          />
        </PDFViewer>
      ) : (
        <>
       
          <DaterangeSelector
            handleChange={(e) => handleChange(e)}
            from={from}
            to={to}
          />
           <Row>
          {supplier?<Col md={6}>
            <Table>
              <TableBody>
                <tr><b>Supplier name:</b> {supplier.supplier_name}</tr>
                <tr><b>Address:</b> {supplier.address}</tr>
                <tr><b>Phone:</b> {supplier.phone}</tr>
                <tr><b>Balance:</b> {supplier.balance}</tr>
              </TableBody>
            </Table>
          </Col>:""}
        </Row>

        {/* {JSON.stringify({supplier})} */}
          {/* <div className="m-0 p-0">
        <SearchBar
          name="supplier"
          placeholder="Select supplier..."
          value={form.supplier}
        />
      </div> */}
          <div style={{ height: '64vh' }}>
            <CustomScrollbar>
              {supplier? supplier.supplier_name : ''}
              <CustomTable size="sm" bordered fields={fields} data={supplierStatement} />
            </CustomScrollbar>
          </div>
          <div>
            {!supplierPayment.length && (
              <CustomAlert
                text="No report found at this time, please check back later."
                color="warning"
                className="text-center"
              />
            )}
          </div>
        </>
      )}
    </CustomCard>
  )
}
