import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardBody, CardHeader, Table } from 'reactstrap'
import { useRouteMatch } from 'react-router'
import Scrollbars from 'react-custom-scrollbars'
import BackButton from '../../comp/components/BackButton'
import { _fetchApi } from '../../../redux/actions/api'
import { apiURL } from '../../../redux/actions'
import moment from 'moment'
import Loading from '../../comp/components/Loading'
import SampleForm from './SampleForm'

export default function ViewPatientDetails() {
  const [loading, setLoading] = useState(false)
  const match = useRouteMatch()
  const labno = match.params.labno
  const patientId = match.params.patientId
  const [patientInfo, setPatientInfo] = useState({})
  const [patientLabs, setPatientLabs] = useState([])

  const getPatientLabInfo = useCallback(() => {
    setLoading(true)
    _fetchApi(
      `${apiURL()}/lab/request/${patientId}`,
      (data) => {
        setLoading(false)
        if (data.success) {
          setPatientInfo(data.patientInfo)
          setPatientLabs(data.labs)
        }
      },
      (err) => {
        console.log(err)
        setLoading(false)
      },
    )
  }, [patientId])

  useEffect(() => {
    getPatientLabInfo()
  }, [getPatientLabInfo])

  return (
    <>
      <BackButton />
      <Card>
        <CardHeader className="text-center font-weight-bold">
          Patient Details
        </CardHeader>
        <CardBody>
          <SampleForm
            labno={labno}
            patientInfo={patientInfo}
            historyMode="hide"
            labNoMode="hide"
          />
          {loading && <Loading />}
          <Scrollbars autoHide style={{ height: 200 }}>
            <Table striped>
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Date</th>
                  <th>Booking Id</th>
                  <th>Test</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {patientLabs.map((item, i) => (
                  <tr>
                    <td>{i + 1}</td>
                    <td>{moment(item.created_at).format('DD-MM-YYYY')}</td>
                    <td>{item.booking_no}</td>
                    {/* <td>{item.booking_no.split('-').join('')}</td> */}
                    <td>{item.department}</td>
                    <td>{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Scrollbars>
        </CardBody>
      </Card>
    </>
  )
}
