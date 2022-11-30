import React from 'react'
import { Route } from 'react-router'
import { Col, Row } from 'reactstrap'
// import PointOfSales from '../../account/PointOfSales'
import PendingPharmacyRequest from '../drugRequest/PendingPharmacyRequest'
import DrugSale from './DrugSales'
import PendingDrugSale from './PendingDrugSale'

function DrugSalesPage() {
  return (
    <Row className='m-0'>
      <Col md={3} className=''>
        <PendingPharmacyRequest />
      </Col>
      <Col className=''>
          <Route path={`/me/pharmacy/drug-sales`} component={DrugSale} exact />
        <Route
          path={`/me/pharmacy/drug-sales/view/:patientId`}
          component={PendingDrugSale}
        /> 
      </Col>
    </Row>
  )
}

export default DrugSalesPage
