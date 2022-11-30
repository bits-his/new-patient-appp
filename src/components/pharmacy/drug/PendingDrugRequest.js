import { Card, CardBody, CardHeader, Input, Table } from "reactstrap"
import React from 'react'
function PendingDrugRequest() {
    return (
        <Card style={{ border: '2px solid #666666' }}>
            <CardHeader>Pending pharmacy Request</CardHeader>
            <CardBody>
              <Input
                type="search"
                placeholder="Search request by patient name"
                className="mb-2"
              />
              <Table bordered striped>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>No.Of Request</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>yakaka lawan waziri (6220-1)</td>
                    <td>4</td>
                  </tr>
                </tbody>
                <tbody></tbody>
              </Table>
            </CardBody>
          </Card>
    )
}

export default PendingDrugRequest
