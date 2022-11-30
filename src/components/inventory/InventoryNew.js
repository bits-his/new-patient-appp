import React from 'react'
import { Row, Col } from 'reactstrap'
import { Route, Switch, Redirect } from 'react-router'
import {
  MdAssignmentTurnedIn,
  MdExitToApp,
  MdRemoveFromQueue,
} from 'react-icons/md'
import { AiOutlineAppstoreAdd } from 'react-icons/ai'
import { GrStakeholder } from 'react-icons/gr'
import VerticalMenu from '../comp/components/vertical-menu/VerticalMenu'
import ListMenuItem from '../comp/components/vertical-menu/ListMenuItem'
import { FaChartBar, FaMoneyBill } from 'react-icons/fa'
// import FullscreenLoading from "../comp/components/FullscreenLoading";
import SupplierForm from '../pharmacy/supplier/SupplierForm'
import { useSelector } from 'react-redux'
import { canUseThis } from '../auth'

import ItemsList from './ItemsList'
import ItemDescription from './ItemDescription'
import InventoryItemTab from './InventoryItemTab'
import GRN from './GRN'
import PurchaseOrder from './PurchaseOrder'

let currentPath = '/me/new_inventory'

function Tab() {
  const user = useSelector((state) => state.auth.user)
  return (
    <>
      <VerticalMenu title="What would you like to do?">
        {user.accessTo
          ? canUseThis(user, ['Purchase Other']) && (
              <ListMenuItem route={`${currentPath}/purchase_order`}>
                <AiOutlineAppstoreAdd size={26} style={{ marginRight: 5 }} />
                Purchase Order
              </ListMenuItem>
            )
          : null}
        {user.accessTo
          ? canUseThis(user, ['Inventory Table']) && (
              <ListMenuItem route={`${currentPath}/inventory/table`}>
                <FaMoneyBill size={26} style={{ marginRight: 5 }} />
                Inventory Table
              </ListMenuItem>
            )
          : null}
        {user.accessTo
          ? canUseThis(user, ['GRN']) && (
              <ListMenuItem route={`${currentPath}/grn`}>
                <GrStakeholder size={26} style={{ marginRight: 5 }} />
                Goods Recieve Note
              </ListMenuItem>
            )
          : null}
        {user.accessTo
          ? canUseThis(user, ['Goods Transfer Form']) && (
              <ListMenuItem route={`${currentPath}/goods_transfer_form`}>
                <MdAssignmentTurnedIn size={26} style={{ marginRight: 5 }} />
                Goods Transfer Form
              </ListMenuItem>
            )
          : null}
        {user.accessTo
          ? canUseThis(user, ['Item Description']) && (
              <ListMenuItem route={`${currentPath}/item/description`}>
                <FaChartBar size={26} style={{ marginRight: 5 }} />
                Item Description
              </ListMenuItem>
            )
          : null}
        {/* 
        <ListMenuItem route={`${currentPath}/form-application-approval`}>
          <FaChartBar size={26} style={{ marginRight: 5 }} />
          Application Approval Form
        </ListMenuItem>*/}
        {user.accessTo
          ? canUseThis(user, ['Manage Suppliers']) && (
              <ListMenuItem route={`${currentPath}/manage-suppliers`}>
                <MdExitToApp size={26} style={{ marginRight: 5 }} />
                Manage Suppliers
              </ListMenuItem>
            )
          : null}

        <ListMenuItem route={`${currentPath}/requisition-list`}>
          <MdRemoveFromQueue size={26} style={{ marginRight: 5 }} />
          Requisition List
        </ListMenuItem>
      </VerticalMenu>
    </>
  )
}

function InventoryNew() {
  return (
    <>
      <Row className="m-0">
        <Col md={3}>
          <Tab />
        </Col>
        <Col md={9}>
          <Switch>
            <Redirect
              exact
              from={`${currentPath}`}
              to={`${currentPath}/purchase_order`}
            />
            <Route
              path={`${currentPath}/purchase_order`}
              component={PurchaseOrder}
            />
            <Route path={`${currentPath}/grn`} component={GRN} />
            <Route
              exact
              path={`${currentPath}/inventory/table`}
              component={InventoryItemTab}
            />
            <Route
              exact
              path={`${currentPath}/goods_transfer_form`}
              component={ItemsList}
            />

            <Route
              exact
              path={`${currentPath}/item/description`}
              component={ItemDescription}
            />
            <Route
              path={`${currentPath}/manage-suppliers`}
              component={SupplierForm}
              exact
            />
          </Switch>
        </Col>
      </Row>
    </>
  )
}

export default InventoryNew
