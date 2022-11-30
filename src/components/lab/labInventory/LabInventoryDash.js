import React from 'react'
import VerticalMenu from '../../comp/components/vertical-menu/VerticalMenu'
import ListMenuItem from '../../comp/components/vertical-menu/ListMenuItem'
import { GoIssueOpened } from 'react-icons/go'
import { FiFileText, FiSettings } from 'react-icons/fi'
import { Route, Redirect, Switch } from 'react-router'
import { Row, Col } from 'reactstrap'

import LabInventaryTabe from '../LabInventaryTable'
import RequisitionDashboard from '../RequisitionDashboard'
import SuppliersForm from '../../pharmacy/supplier/SupplierForm'
export function VerticalLabMenu() {
  return (
    <VerticalMenu title="What would you like to do?">
      <ListMenuItem route="/me/inventory/store-management">
        <GoIssueOpened size={26} style={{ marginRight: 10 }} /> Setup Lab Store
        Management
      </ListMenuItem>
      <ListMenuItem route="/me/inventory/point-of-sale">
        <FiFileText size={26} style={{ marginRight: 10 }} />
        Requisition
      </ListMenuItem>
      {/*  {user.accessTo
        ? canUseThis(user, ['Manage Suppliers']) && ( */}
      <ListMenuItem route="/me/inventory/suppliers">
        <FiSettings size={26} style={{ marginRight: 10 }} />
        Manage Suppliers
      </ListMenuItem>
      {/* )
        : null} */}
    </VerticalMenu>
  )
}
export default function LabInventoryDash() {
  return (
    <Row className="m-0 p-0">
      <Col md={3}>
        <VerticalLabMenu />
      </Col>
      <Col md={9}>
        <Switch>
          <Redirect
            exact
            from="/me/inventory"
            to="/me/inventory/store-management"
          />
          <Route
            path="/me/inventory/store-management"
            component={LabInventaryTabe}
          />
          <Route
            path="/me/inventory/point-of-sale"
            component={RequisitionDashboard}
          />
          <Route
            path="/me/inventory/suppliers"
            component={SuppliersForm}
            exact
          />
        </Switch>
      </Col>
    </Row>
  )
}
