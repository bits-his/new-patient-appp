import React, { useState, useEffect, useRef } from 'react'
import { Col, Row } from 'reactstrap'
import { Switch, useLocation } from 'react-router'
// import Scrollbar from "../../comp/components/Scrollbar";
// import { AiOutlineFileDone } from "react-icons/ai";
import { _fetchApi, _fetchApi2 } from '../../../redux/actions/api'
import { apiURL } from '../../../redux/actions'
// import moment from 'moment';
import { Route } from 'react-router'
import { useSelector } from 'react-redux'
// import Loading from "../../comp/components/Loading";
import { FallbackComp } from '../../comp/components/FallbackSkeleton'
import CheckoutPending from './registration/checkout-pending'
import ReportMainView from './reports/ReportMainView'
import RefundRequestForm from './registration/RefundRequestForm'
import PendingRefundRequests from './registration/PendingRefundRequests'
import moment from 'moment'
import PendingPayments from './registration/PendingPayments'
import PendingPaymentsDetail from './registration/PendingPaymentsDetail'

// import DisplayDepartment from "./DisplayDepartment";

// import moment from "moment";
// import { FaCalendar, FaUser } from "react-icons/fa";
import PendingLabRequest from '../PendingLabRequest'
import CompletedLabTests from '../CompletedLabTests'
import LabArchive from './LabArchive'
import ViewPatientDetails from './ViewPatientDetails'
import RegistrationTopBar from './registration/top-bar'
// import DisplayDepartemnt from "./DisplayDepartment2"
import PatientList from './PatientList'

const PatientRegTable = () => {
  // const history = useHistory();
  const user = useSelector((state) => state.auth.user)
  const type = useSelector((state) => state.facility.info.type)
  // const [searchTerm, setSearchTerm] = useState("");
  // const [list, setList] = useState([]);
  const [count, setCount] = useState(0)
  const [archive, setArchive] = useState([])
  let today = moment().format('YYYY-MM-DD')
  let aWeekAgo = moment(today).subtract(1, 'week').format('YYYY-MM-DD')
  const [range, setRange] = useState({
    from: aWeekAgo,
    to: today,
  })

  const handleRangeChange = (key, val) =>
    setRange((p) => ({ ...p, [key]: val }))

  const patientSearchRef = useRef()
  const labResultSearchRef = useRef()
  const [, setToggle] = useState(false)

  // const handleClick = (id) => {
  //   history.push(`/me/lab/patients/new/${id}`);
  // };

  const getPatientCount = () => {
    const username = user.username

    _fetchApi(
      `${apiURL()}/lab/patient/daily-count/${username}`,
      (data) => {
        if (data.success) {
          setCount(data.count)
        }
      },
      (err) => {
        console.log(err)
      },
    )
  }

  const getArchivedLabs = (from, to, facId) => {
    //   console.log('======================================================================')
    _fetchApi2(
      `${apiURL()}/lab/status/archived/${facId}?from=${from}&to=${to}`,
      (data) => {
        if (data.success) {
          setArchive(data.results)
        }
      },
      (err) => {
        console.log(err)
      },
    )
  }

  // const getPendingLab = () => {
  //   let condition = "Instant";
  //   let type = null;
  //   _fetchApi(
  //     `${apiURL()}/lab/patients/${condition}/${type}`,
  //     (data) => {
  //       if (data.success) {
  //         setList(data.results);
  //       }
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // };

  const handleKeyPress = (e) => {
    switch (e.key) {
      case 'F8':
        return labResultSearchRef.current.focus()
      case 'F9':
        return patientSearchRef.current.focus()
      default:
        return null
    }
  }

  useEffect(() => {
    getArchivedLabs(range.from, range.to, user.facilityId)
  }, [range.from, range.to, user.facilityId])

  useEffect(() => {
    // getPendingLab();
    getPatientCount()

    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  // let rows = [];

  // if (list.length) {
  //   list.forEach((item, index) => {
  //     if (
  //       item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1 &&
  //       item.phoneNo.toString().indexOf(searchTerm.toString()) === -1
  //     )
  //       return;

  //     rows.push(
  //       <TableRow
  //         key={index}
  //         index={index}
  //         item={item}
  //         handleClick={handleClick}
  //       />
  //     );
  //   });
  // }
  const location = useLocation()
  const isDiagnotics = type === 'diagnosticCenter'
  const expanded =
    !location.pathname.includes('process-pending') &&
    !location.pathname === '/me/lab/patients'
  return (
    <div>
      {/* ====================={type}============= */}
      {!expanded ? <RegistrationTopBar count={count} /> : null}
      <Row>
        <Col md={3}>
          {isDiagnotics ? (
            <LabArchive
              list={archive}
              range={range}
              handleRangeChange={handleRangeChange}
            />
          ) : (
            <PendingLabRequest setToggle={setToggle} />
          )}
        </Col>
        <Col md={6}>
          <Switch>
            <Route
              path="/me/lab/patients/result-view"
              exact
              render={() => <ReportMainView />}
            />
            <Route
              exact
              path="/me/lab/patients/view-patient/:patientId"
              component={ViewPatientDetails}
            />

            <Route
              exact
              path="/me/lab/patients/process-pending/:patientId/:visitId"
              component={CheckoutPending}
            />
            <Route
              exact
              path="/me/lab/patients/pending-payments"
              component={PendingPayments}
            />
            <Route
              exact
              path="/me/lab/patients/pending-payments-details"
              component={PendingPaymentsDetail}
            />

            <Route
              exact
              path="/me/lab/patients/pending-refund-request"
              component={PendingRefundRequests}
            />

            <Route
              exact
              path="/me/lab/patients/raise-a-refund"
              component={RefundRequestForm}
            />

            <Route
              // exact
              path="/me/lab/patients"
              render={() => (
                <CompletedLabTests
                  getArchivedLabs={getArchivedLabs}
                  labResultSearchRef={labResultSearchRef}
                />
              )}
            />
          </Switch>
          {/* </>
          )} */}
        </Col>
        <Col md={3}>
          <PatientList mode="lab" />
        </Col>
      </Row>
    </div>
  )
}

// const TableRow = ({ item, handleClick }) => {
//   return (
//     <tr
//       style={{ cursor: "pointer" }}
//       onClick={() => handleClick(item.patient_id)}
//     >
//       <td>{item.name}</td>
//       <td>{item.phoneNo}</td>
//     </tr>
//   );
// };

export default PatientRegTable
