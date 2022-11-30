import moment, { isMoment } from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { FaHistory } from 'react-icons/fa'
import {
  FormGroup,
  Label,
  Popover,
  // PopoverBody,
  PopoverHeader,
  Table,
} from 'reactstrap'
import { apiURL } from '../../../redux/actions'
import { _fetchApi } from '../../../redux/actions/api'
import CustomButton from '../../comp/components/Button'

function SampleLog({
  patient_id = '',
  labno = '',
  label = 'Sample Collected',
  _key = 'sample_collected_at',
}) {
  const [sampleHistory, setSampleHistory] = useState([])
  const [popIspen, setPopIsOpen] = useState(false)

  const getSampleHistory = useCallback(() => {
    _fetchApi(
      `${apiURL()}/lab/sample/history/${labno}`,
      (data) => {
        // console.log(data);
        if (data.results.length) {
          setSampleHistory(data.results[0])
        }
      },
      (err) => {
        console.log(err)
      },
    )
  }, [patient_id, labno])

  useEffect(() => {
    getSampleHistory()
  }, [])

  const toggle = () => setPopIsOpen((d) => !d)

  let labelValue = sampleHistory[_key]
  // const labelValueDisplayed = isMoment(labelValue)
  //   ? labelValue
  //   : moment().calendar();
  return (
    <div className="d-flex">
      {label && label !== '' ? (
        <FormGroup>
          <Label className="mr-2 font-weight-bold">{label}:</Label>
          {/* <Label>{moment(otherInfo.value).fromNow()}</Label> */}
          <Label>{moment.utc(labelValue).format('DD/MM/YYYY hh:mm a')}</Label>
          {/* {JSON.stringify({ label, _key, labelValue })} */}
        </FormGroup>
      ) : null}
      <div>
        <CustomButton
          color="info"
          className="ml-1"
          id="PopoverFocus"
          size="sm"
          onClick={toggle}
        >
          {popIspen ? 'Close' : 'View Log'}
        </CustomButton>
      </div>
      <Popover
        placement="left"
        target="PopoverFocus"
        isOpen={popIspen}
        toggle={toggle}
        // color='secondary'
        // outline
      >
        <PopoverHeader>Status Log</PopoverHeader>
        {/* <PopoverBody> */}
        <Table size="sm">
          <thead>
            <tr className="">
              <th className="text-center">Status</th>
              <th className="text-center">User</th>
              <th className="text-center">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ordered</td>
              <td>
                {sampleHistory['created_by']
                  ? sampleHistory['created_by']
                  : '-'}
              </td>
              <td>
                {sampleHistory['created_at']
                  ? moment
                      .utc(sampleHistory['created_at'])
                      .format('DD/MM/YYYY hh:mm A')
                  : '-'}
              </td>
            </tr>
            <tr>
              <td>Collected</td>{' '}
              <td>
                {sampleHistory['sample_collected_by']
                  ? sampleHistory['sample_collected_by']
                  : '-'}
              </td>
              <td>
                {sampleHistory['sample_collected_at']
                  ? moment
                      .utc(sampleHistory['sample_collected_at'])
                      .format('DD/MM/YYYY hh:mm A')
                  : '-'}
              </td>
            </tr>
            <tr>
              <td>Analyzed</td>{' '}
              <td>
                {sampleHistory['analyzed_by']
                  ? sampleHistory['analyzed_by']
                  : '-'}
              </td>
              <td>
                {sampleHistory['analyzed_at']
                  ? moment
                      .utc(sampleHistory['analyzed_at'])
                      .format('DD/MM/YYYY hh:mm A')
                  : '-'}
              </td>
            </tr>
            <tr>
              <td>Reported</td>
              <td>
                {sampleHistory['result_by'] ? sampleHistory['result_by'] : '-'}
              </td>
              <td>
                {sampleHistory['result_at']
                  ? moment
                      .utc(sampleHistory['result_at'])
                      .format('DD/MM/YYYY hh:mm A')
                  : '-'}
              </td>
            </tr>
            <tr>
              <td>Reviewed</td>
              <td>
                {sampleHistory['reviewed_by']
                  ? sampleHistory['reviewed_by']
                  : '-'}
              </td>
              <td>
                {sampleHistory['reviewed_at']
                  ? moment
                      .utc(sampleHistory['reviewed_at'])
                      .format('DD/MM/YYYY hh:mm A')
                  : '-'}
              </td>
            </tr>
            <tr>
              <td>Printed</td>

              <td>
                {sampleHistory['printed_by']
                  ? sampleHistory['printed_by']
                  : '-'}
              </td>
              <td>
                {sampleHistory['printed_at']
                  ? moment
                      .utc(sampleHistory['printed_at'])
                      .format('DD/MM/YYYY hh:mm A')
                  : '-'}
              </td>
            </tr>
          </tbody>
        </Table>
        {/* </PopoverBody> */}
      </Popover>
    </div>
  )
}

export default SampleLog
