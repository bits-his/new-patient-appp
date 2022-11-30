import React from 'react'
import { Row, Col } from 'reactstrap'
import { Route, Switch, Redirect } from 'react-router'
import { MdAssignmentTurnedIn, MdExitToApp } from 'react-icons/md'
import { AiOutlineAppstoreAdd } from 'react-icons/ai'
import { GrStakeholder } from 'react-icons/gr'
import { FcApproval } from 'react-icons/fc'
import VerticalMenu from '../comp/components/vertical-menu/VerticalMenu'
import ListMenuItem from '../comp/components/vertical-menu/ListMenuItem'
import { FaChartBar, FaMoneyBill } from 'react-icons/fa'

import StaffSalary from './StaffSalary'
import Staff from './Staff'
import AssignPosition from './AssignPosition'
import ApplicationApproval from './ApplicationApproval'
import ApplicationApproval1 from './ApplicationApproval1'
import Application from './Application'
import SWESApplication from './SWES'

let currentPath = '/me/hr'

function Tab() {
  return (
    <>
      <VerticalMenu>
        <ListMenuItem route={`${currentPath}/application`}>
          <AiOutlineAppstoreAdd size={26} style={{ marginRight: 5 }} />
          Application
        </ListMenuItem>

        <ListMenuItem route={`${currentPath}/salary/staff`}>
          <FaMoneyBill size={26} style={{ marginRight: 5 }} />
          Staff Salary
        </ListMenuItem>

        <ListMenuItem route={`${currentPath}/staff`}>
          <GrStakeholder size={26} style={{ marginRight: 5 }} />
          Staff
        </ListMenuItem>

        <ListMenuItem route={`${currentPath}/assignposition`}>
          <MdAssignmentTurnedIn size={26} style={{ marginRight: 5 }} />
          Assign Position
        </ListMenuItem>

        <ListMenuItem route={`${currentPath}/approval/application`}>
          <FcApproval size={26} style={{ marginRight: 5 }} />
          Application Approval
        </ListMenuItem>

        <ListMenuItem route={`${currentPath}/form-application-approval`}>
          <FaChartBar size={26} style={{ marginRight: 5 }} />
          Application Approval Form
        </ListMenuItem>
        <ListMenuItem route={`${currentPath}/swes-application`}>
          <MdExitToApp size={26} style={{ marginRight: 5 }} />
          SWES Application
        </ListMenuItem>
      </VerticalMenu>
    </>
  )
}

function HumanResources() {
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
              to={`${currentPath}/application`}
            />
            <Route
              exact
              path={`${currentPath}/salary/staff`}
              component={StaffSalary}
            />
            <Route path={`${currentPath}/staff`} component={Staff} />
            <Route
              path={`${currentPath}/assignposition`}
              component={AssignPosition}
            />
            <Route
              path={`${currentPath}/approval/application`}
              component={ApplicationApproval}
            />
            <Route
              path={`${currentPath}/form-application-approval`}
              component={ApplicationApproval1}
            />
            <Route
              path={`${currentPath}/application`}
              component={Application}
            />
            <Route
              path={`${currentPath}/swes-application`}
              component={SWESApplication}
            />
          </Switch>
        </Col>
      </Row>
    </>
  )
}

export default HumanResources
