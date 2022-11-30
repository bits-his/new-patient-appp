import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Row, Col } from 'reactstrap'
import { useQuery } from '../../../hooks'
import { getPharmStore } from '../../../redux/actions/pharmacy'
import PurchaseOrderTable from '../../inventory/PurchaseOrderTable'
import { TransferTabs } from './TranferTabs'
import TransferForm from './TransferForm'

export default function Transfer() {
  const query = useQuery()
  const store = query.get('store')
  const dispatch = useDispatch()
  const users = useSelector((state) => state.auth)
  const options = useSelector((state) => state.pharmacy.pharmStore)
  const ref_from = useRef()
  const onGetStore = useCallback((item) => {
    console.log(item)
  }, [])
  useEffect(() => {
    // dispatch(getStoresList());
    dispatch(getPharmStore())
    onGetStore()
  }, [dispatch, onGetStore, store])

  // const _users = useSelector((state) => state.auth.user);
  // const stores = _users.store || [];
  // let nerStore = stores.split(",");
  let nerStore = []
  // const buz_id = useSelector(
  //   (state) => state.auth.activeBusiness.business_admin
  // );
  // const user_id = useSelector((state) => state.auth.user);
  // const check = parseInt(buz_id) === parseInt(user_id.id);
  return (
    <Row className="m-0">
      {/* {JSON.stringify(options)} */}
      <Col md={3}>
        <TransferTabs
          // options={check ? options : nerStore}
          options={options}
          ref_from={ref_from}
        />
      </Col>

      <Col md={8}>
        {store ? (
          <TransferForm
            ref_from={ref_from}
            store={store}
            defaultStore={users.user.store || 'Main Store'}
          />
        ) : (
          <PurchaseOrderTable type="display" />
        )}
      </Col>
      <Col md={1}></Col>
    </Row>
  )
}
