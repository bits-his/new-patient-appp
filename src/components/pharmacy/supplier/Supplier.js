import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Scrollbars from 'react-custom-scrollbars'
import {
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
} from 'reactstrap'
import { useHistory } from 'react-router'
import { formatNumber } from '../../utils/helpers'
import { CustomButton, CustomTable } from '../../comp/components'
import CustomCard from '../../comp/components/CustomCard'
import SearchBar from '../../record/SearchBar'
import Loading from '../../comp/components/Loading'
import {
  getSupplierCount,
  getSupplierInfo,
} from '../../../redux/actions/pharmacy'
import Scrollbar from '../../comp/components/Scrollbar'
import { apiURL } from '../../../redux/actions'
import { _fetchApi } from '../../../redux/actions/api'

export default function Supplier() {
  const supplierInfo = useSelector((state) => state.pharmacy.supplierInfo)
  const supplierCount = useSelector((state) => state.pharmacy.supplierCount)
  const loading = useSelector((state) => state.pharmacy.loading)
  const [search,setSearch] =  useState('')
  const navigate = useHistory()
  const fields = [
    {
      title: 'S/N',
      custom: true,
      component: (item, idx) => idx + 1,
      className: 'text-center',
    },
    {
      title: 'Supplier Name',
      value: 'supplier_name',
    },
    {
      title: 'Phone',
      value: 'phone',
    },
    {
      title: 'Email',
      value: 'email',
    },
    {
      title: 'Address',
      value: 'address',
    },
    {
      title: 'Current Balance (₦)',
      custom: true,
      component: (item) => formatNumber(item.balance),
      className: 'text-right',
    },
    {
      title: 'Action',
      custom: true,
      component: (item) =>(
        <CustomButton
          size="sm"
          onClick={() =>
            navigate.push(
              `/me/pharmacy/manage-suppliers/supplier-report?supplier_code=${item.supplier_code}&supplier_name=${item.supplier_name}`,
            )
          }
        >
          {' '}
          View
        </CustomButton>
      ),
      className: 'text-center',
    },
  ]
  const dispatch = useDispatch()
  const _getSupplierInfo = useCallback(() => {
    dispatch(getSupplierInfo())
    dispatch(getSupplierCount())
  }, [dispatch])
  useEffect(() => {
    _getSupplierInfo()
  }, [_getSupplierInfo])
  const data = search.length>3? supplierInfo.filter(row=>
    row.supplier_name.toLowerCase().includes(search.toLowerCase())
    || row.phone.includes(search.toLowerCase())
    || row.email.toLowerCase().includes(search.toLowerCase()
    )):supplierInfo

 
  return (
    <div className='m-2'>
      <CustomCard header="Suppliers">
        {/* {JSON.stringify({data})} */}
        <div className="mb-1">
          <Row>
            <Col col={5}>
              <CustomButton
                size="sm"
                className="m-1"
                onClick={() =>
                  navigate.push('/me/pharmacy/manage-suppliers/supplier_form')
                }
              >
                Add New Supplier
              </CustomButton>
              <CustomButton
                size="sm"
                outline
                onClick={() =>
                  navigate.push(
                    '/me/pharmacy/manage-suppliers/supplier_payment',
                  )
                }
              >
                Add Supplier Payment
              </CustomButton>
            </Col>
            {/* <Col md={7} className="">
              <div style={{ display: "flex", justifyContent: "right" }}>
                <div className="m-1">Showing 1 to 57 of 57 entries</div>
                <Pages supplierCount={supplierCount} />
              </div>
            </Col> */}
          </Row>
        </div>
        <div className="mt-2 mb-2">
          <SearchBar 
            placeholder="Search supplier by name or phone number " 
            filterText={search} 
            onFilterTextChange={(v) => setSearch(v)}
          />
        </div>
        <div >
          {loading && <Loading size="sm" />}
          <Scrollbar style={{ height: '55vh' }}>
            <CustomTable size="sm" bordered fields={fields} data={data} />
          </Scrollbar>
        </div>
      </CustomCard>
    </div>
  )
}

const Pages = ({ supplierCount }) => {
  const [count, setCount] = useState(0)
  const arr = []
  // while (count < parseInt(supplierCount)) {
  //   arr.push(
  //     <PaginationItem>
  //       <PaginationLink href="#">{count + 1}</PaginationLink>
  //     </PaginationItem>
  //   );
  //   setCount(count + +1);
  // }
  // useEffect(() => {}, [arr, supplierCount]);
  // for (let i = 0; i < parseInt(supplierCount); i++) {
  //   arr.push(
  //     <PaginationItem>
  //       <PaginationLink href="#">{i+1}</PaginationLink>
  //     </PaginationItem>
  //   );
  // }
  return (
    <>
      {/* {JSON.stringify(arr)} */}
      <Pagination
        aria-label="Page navigation example"
        className="m-0 p-0"
        size="sm"
      >
        <PaginationItem>
          <PaginationLink previous href="#" />
        </PaginationItem>
        {arr}
        <PaginationItem>
          <PaginationLink next href="#" />
        </PaginationItem>
      </Pagination>
    </>
  )
}
