import React, { useState } from 'react'
import { Card, CardTitle, Col, Row } from 'reactstrap'

import RadioGroup from '../../comp/components/RadioGroup'
import LabAccountSetup from './LabAccountSetup'
import LabPricingSetup from './LabPricingSetup'

function LabPricing() {
  const tabs = ['Lab Price', 'Lab Account Head']
  const [activeTab, setActiveTabe] = useState(tabs[0])

  return (
    <div>
      <h6>Lab Account Head Setup</h6>
      <Row>
        <Col>
          <RadioGroup
            options={tabs.map((a) => ({
              name: a,
              label: a,
            }))}
            onChange={(n, v) => setActiveTabe(v)}
            value={activeTab}
          />

          <div className="p-2">
            {activeTab === tabs[0] && <LabPricingSetup />}
            {activeTab === tabs[1] && <LabAccountSetup />}
          </div>
        </Col>
        <Col></Col>
      </Row>
    </div>
  )
}

export default LabPricing
