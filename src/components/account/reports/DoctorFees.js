import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { CardBody, CardHeader } from 'reactstrap'
import Card from 'reactstrap/lib/Card'
import { apiURL } from '../../../redux/actions'
import { _fetchApi, _fetchApi2 } from '../../../redux/actions/api'
import AutoComplete from '../../comp/components/AutoComplete'
import CustomButton from '../../comp/components/Button'
import CustomTable from '../../comp/components/CustomTable'
import DaterangeSelector from '../../comp/components/DaterangeSelector'
import Loading from '../../comp/components/Loading'
import PrintWrapper from '../../comp/components/print/PrintWrapper'
import { checkEmpty, formatNumber } from '../../utils/helpers'

function DoctorFees() {
  const history = useHistory()
  const today = moment().format('YYYY-MM-DD')
  const monthStart = moment().startOf('month').format('YYYY-MM-DD')
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(false)
  const [docList, setDocList] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState({})
  const [txList, setTxList] = useState([])
  const [range, setRange] = useState({
    from: monthStart,
    to: today,
  })

  const getDocList = () => {
    setLoading(true)
    _fetchApi(
      `${apiURL()}/doctors`,
      (data) => {
        setLoading(false)
        if (data && data.results) {
          setDocList(data.results)
        }
      },
      (err) => {
        setLoading(false)
        console.log(err)
      },
    )
  }

  const getDoctorReportFees = useCallback(() => {
    setSearching(true)
    _fetchApi2(
      `${apiURL()}/transactions/doctors/report-fees/all?from=${range.from}&to=${
        range.to
      }&query_type=summary`,
      (data) => {
        setSearching(false)
        if (data && data.results) {
          let totalDebit = data.results.reduce((a, b) => a + parseInt(b.dr), 0)
          let totalCredit = data.results.reduce((a, b) => a + parseInt(b.cr), 0)
          let total = {
            createdAt: '',
            description: 'Total',
            dr: totalDebit,
            cr: totalCredit,
            reference_no: '',
          }
          setTxList([...data.results, total])
        }
      },
      (err) => {
        setSearching(false)
        console.log(err)
      },
    )
  }, [range.from, range.to])

  const printReport = () => {
    window.frames[
      'print_frame'
    ].document.body.innerHTML = document.getElementById(
      'doctor-reporting-fees',
    ).innerHTML
    window.frames['print_frame'].window.focus()
    window.frames['print_frame'].window.print()
  }

  useEffect(() => {
    getDoctorReportFees()
    // getDocList();
  }, [])

  const fields = [
    // {
    //   title: 'Date',
    //   custom: true,
    //   // value: "createdAt",
    //   component: (d) => (
    //     <div>
    //       {d.createdAt === '' ? '' : moment(d.createdAt).format('DD-MM-YYYY')}
    //     </div>
    //   ),
    // },
    {
      title: 'S/N',
      component: (item, i) => <div className="text-center">{i + 1}</div>,
    },
    {
      title: "Doctor's Name",
      value: 'description',
    },
    // {
    //   title: "Debit",
    //   custom: true,
    //   component: (d) => <div className="text-right">{formatNumber(d.cr)}</div>,
    // },
    {
      title: 'Doctor Fees',
      custom: true,
      component: (d) => <div className="text-right">{formatNumber(d.dr)}</div>,
    },
    {
      title: 'Action',

      component: (d) => (
        <div className="text-center">
          <CustomButton
            size="sm"
            color="primary"
            onClick={() =>
              history.push(
                `/me/account/generate-doctors-report-fees-details/${d.doc_acct}?doctor_name=${d.description}&date_from=${range.from}&date_to=${range.to}`,
              )
            }
          >
            View Details
          </CustomButton>
        </div>
      ),
    },
    // {
    //   title: 'Reference',
    //   value: 'reference_no',
    // },
  ]

  return (
    <Card>
      <CardHeader tag="h6">Doctors Report Fees</CardHeader>
      <CardBody>
        <div>
          <DaterangeSelector
            from={range.from}
            to={range.to}
            handleChange={({ target: { name, value } }) =>
              setRange((p) => ({ ...p, [name]: value }))
            }
          />
          {/* {JSON.stringify(txList)} */}
          <div className="row">
            <div className="col-md-6">
              {/* <AutoComplete
                label="Select Doctor"
                options={docList}
                labelKey={(d) => `${d.firstname} ${d.lastname}`}
                onChange={(d) => {
                  if (d.length) {
                    setSelectedDoctor(d[0]);
                  }
                }}
              /> */}
            </div>
            <div className="col-md-6 d-flex flex-direction-row justify-content-end align-items-center mb-1">
              {/* <CustomButton
                className="mr-2"
                onClick={getDoctorReportFees}
                loading={searching}
                disabled={checkEmpty(selectedDoctor)}
              >
                Get Report
              </CustomButton> */}

              <CustomButton
                color="success"
                disabled={!txList.length}
                onClick={printReport}
              >
                Print
              </CustomButton>
            </div>
          </div>
        </div>
        {loading && <Loading />}
        {/* <div>
          <h6>
            Doctor's Name: {selectedDoctor.firstname} {selectedDoctor.lastname}
          </h6>
        </div> */}
        <div
          id="doctor-reporting-fees"
          style={{ height: '68vh', overflow: 'scroll' }}
        >
          <PrintWrapper
            title={`Doctor's Reporting Fees (${selectedDoctor.firstname} ${selectedDoctor.lastname})`}
          >
            <CustomTable size="sm" bordered fields={fields} data={txList} />
          </PrintWrapper>
        </div>
      </CardBody>
      <iframe
        title="doctor-reporting-fees"
        name="print_frame"
        width="0"
        height="0"
        src="about:blank"
        // style={styles}
      />
    </Card>
  )
}

export default DoctorFees
