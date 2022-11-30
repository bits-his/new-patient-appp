import React from 'react'
import { useHistory } from 'react-router'
import { CardBody } from 'reactstrap'
import Card from 'reactstrap/lib/Card'
import CardHeader from 'reactstrap/lib/CardHeader'
import { useQuery } from '../../../hooks'
import CodeSetup from './CodeSetup'
import LabPricing from './LabAccountPricing'
import LabDepartment from './LabDepartment'
import LabGroup from './LabGroup'
import './test.css'
import TestUnit from './TestUnit'

const LabSetup = () => {
  const history = useHistory()
  const query = useQuery()
  const lab = query.get('lab-type')
  const tabs = [
    'Department',
    'Lab Group',
    'Test Unit',
    'Barcode Setup',
    'Print Setup',
    'Account',
  ]
  const renderLabItem = (type) => {
    switch (type) {
      case tabs[0]:
        return <LabDepartment />
      case tabs[2]:
        return <TestUnit />
      case tabs[1]:
        return <LabGroup />
      case tabs[3]:
        return <CodeSetup />
      case tabs[4]:
        return <CodeSetup />
      case tabs[5]:
        return <LabPricing />
      default:
        break
    }
  }
  return (
    <Card>
      <CardHeader className="p-1">
        <Tab tabs={tabs} history={history} lab={lab} />
      </CardHeader>
      <CardBody>{renderLabItem(lab)}</CardBody>
    </Card>
  )
}

const Tab = ({ tabs = [], history, lab }) => (
  <div className="mother">
    <div className="motherwrapper">
      <div className="arrow-steps clfix">
        {tabs.map((item) => (
          <div
            className={`step ${item === lab ? 'current' : ''}`}
            onClick={() => {
              history.push(`/me/lab/setup?lab-type=${item}`)
            }}
          >
            <span style={{fontSize:16}}> {item}</span>{' '}
          </div>
        ))}
      </div>
    </div>
  </div>
)
export default LabSetup
