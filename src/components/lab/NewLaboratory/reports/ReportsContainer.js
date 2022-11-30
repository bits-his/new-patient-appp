import moment from 'moment'
import React, { useState } from 'react'
import { Button, Card, CardBody, CardHeader, Container, Row } from 'reactstrap'
import Loading from '../../../comp/components/Loading'
import RadioGroup from '../../../comp/components/RadioGroup'
import PendingIncome from './PendingIncome'
import WorkList from './WorkList'

import BackButton from '../../../comp/components/BackButton'
import DaterangeSelector from '../../../comp/components/DaterangeSelector'
import SelectInput from '../../../comp/components/SelectInput'
import DailyTotal from './DailyTotal'
import PatientIncome from './PatientIncome'

function ReportsContainer() {
  let today = moment().format('YYYY-MM-DD')

  const [range, setRange] = useState({ from: today, to: today })
  const [reportType, setReportType] = useState('Daily Total')
  const [reportBy, setReportBy] = useState('All Records')
  const [workList, setWorkList] = useState('Worklist')

  const handleRangeChange = ({ target: { name, value } }) => {
    setRange((p) => ({ ...p, [name]: value }))
  }

  const printReport = () => {
    window.frames[
      'print_frame'
    ].document.body.innerHTML = document.getElementById(
      'report_container',
    ).innerHTML
    window.frames['print_frame'].window.focus()
    window.frames['print_frame'].window.print()
  }

  return (
    <Container>
      <BackButton />
      <Card>
        <CardHeader className="h6 text-center">{reportType}</CardHeader>
        <CardBody>
          <DaterangeSelector
            from={range.from}
            to={range.to}
            handleChange={handleRangeChange}
          />

          <Row className="d-flex flex-direction-row justify-content-between align-items-center">
            <SelectInput
              label="Select Report Type"
              value={reportType}
              options={['Daily Total', 'Patient Income', 'Pending Income']}
              onChange={(e) => {
                setReportType(e.target.value)
              }}
            />
            <div>
              <RadioGroup
                name="reportBy"
                value={reportBy}
                options={[
                  { name: 'All Records', label: 'All Records' },
                  { name: 'My Records Only', label: 'My Records Only' },
                ]}
                onChange={(k, v) => setReportBy(v)}
              />
            </div>

            <Button color="primary" onClick={printReport}>
              Export/Download
            </Button>
          </Row>
          {/* <Rout exact path="">
          <RevenueDetails />
        </Route> */}

          <div id="report_container">
            <style>
              {`@media print {
              table {
                font-size: 75%;
                table-layout: fixed;
                width: 100%;
              }
              
              table {
                border-collapse: collapse;
                border-spacing: 2px;
              }
              
              th,
              td {
                border-width: 1px;
                padding: 0.5em;
                position: relative;
                text-align: left;
              }
              
              th,
                td {
                    border-radius: 0.25em;
                    border-style: solid;
                }
                
                th {
                    background: #EEE;
                    border-color: #BBB;
                }
                
                td {
                    border-color: #DDD;
                }
                .text-right {
                    text-align: right;
                }
                .text-center {
                    text-align: center;
                }
                .font-weight-bold {
                    font-weight: bold;
                }
                .print-start{
                    margin: 2em;
                    margin-top: 4em;
                }
                .print-only{
                  display: block;
                }
            }

            @media screen {
              .print-only{
                display: none;
              } 
           }   
          `}
            </style>

            {reportType === 'Patient Income' && (
              <PatientIncome
                reportType={reportType}
                reportBy={reportBy}
                start={range.from}
                end={range.to}
              />
            )}

            {reportType === 'Daily Total' && (
              <DailyTotal
                reportType={reportType}
                reportBy={reportBy}
                start={range.from}
                end={range.to}
              />
            )}

            {reportType === 'Pending Income' && (
              <PendingIncome
                reportType={reportType}
                reportBy={reportBy}
                start={range.from}
                end={range.to}
              />
            )}

            {reportType === 'Worklist' && (
              <WorkList
                reportType={reportType}
                reportBy={reportBy}
                start={range.from}
                end={range.to}
              />
            )}
          </div>
          <iframe
            title="print_financial"
            name="print_frame"
            width="0"
            height="0"
            src="about:blank"
            // style={styles}
          />
        </CardBody>
      </Card>
    </Container>
  )
}

export default ReportsContainer
