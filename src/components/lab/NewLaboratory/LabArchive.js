import moment from 'moment'
import React, { useRef, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars'
// import { useHistory } from "react-router";
import { Card, CardHeader, Table } from 'reactstrap'
// import { apiURL } from "../../../redux/actions";
// import { _fetchApi } from "../../../redux/actions/api";
import SearchBar from '../../record/SearchBar'
import { printResult } from './analysis/helpers'
import PrintRadiologyReport from './Radiology/PrintReport'
import { useHistory } from 'react-router'
import { useDispatch } from 'react-redux'
import { SET_PRINTOUT } from '../../../redux/actions/actionTypes'
import Loading from '../../comp/components/Loading'
import DaterangeSelector from '../../comp/components/DaterangeSelector'

export default function LabArchive({
  list = [],
  range = {},
  handleRangeChange,
}) {
  const history = useHistory()
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState('')
  const [printOut, setPrintOut] = useState({})
  const [loading, setLoading] = useState(false)

  //   const [list, setList] = useState([]);
  // const history = useHistory();

  //   const handleClick = (item) => {
  //     if (mode === "lab") {
  //       history.push(`/me/lab/patients/new/${item.patient_id}`);
  //     } else {
  //       history.push(`/me/pharmacy/sale/${item.accountNo}`);
  //     }
  //   };

  const reprint = (item) => {
    setLoading(true)
    // console.log(item)
    printResult(
      item.patient_id,
      item.booking_no,
      (data) => {
        setLoading(false)
        console.log(data)
        setPrintOut(data)
        // if (data.results[0].department === "5000") {
        if (
          data.comments &&
          data.comments.length &&
          data.comments[0].useTemplate === 'yes'
        ) {
          window.frames[
            'template_print_frame'
          ].document.body.innerHTML = document.getElementById(
            'template_print',
          ).innerHTML
          window.frames['template_print_frame'].window.focus()
          window.frames['template_print_frame'].window.print()
        } else {
          dispatch({ type: SET_PRINTOUT, payload: data })
          history.push('/me/lab/patients/result-view')

          // setPrint(true);
        }
      },
      (err) => {
        console.log('err', err)
        setLoading(false)
      },
      item.request_id,
    )
  }

  //   useEffect(() => {
  //     getArchivedLabs();
  //   }, []);

  const patientSearchRef = useRef()
  let rows = []

  if (list.length) {
    list.forEach((item, index) => {
      if (
        item.name &&
        item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1 &&
        item.booking_no &&
        item.booking_no.toLowerCase().indexOf(searchTerm.toLowerCase()) ===
          -1 &&
        // (item.printed_at &&
        //   item.printed_at.toLowerCase().indexOf(searchTerm.toLowerCase()) ===
        //     -1) &&
        item.patient_id &&
        item.patient_id.toString().indexOf(searchTerm.toString()) === -1
      )
        return

      rows.push(
        <tr
        // style={{ cursor: "pointer" }}
        // className="bg-success text-white"
        //   onClick={() => handleClick(item)}
        >
          <td>{moment(item.printed_at).format('DD/MM/YYYY')}</td>
          <td>{item.name}</td>
          <td>
            <button
              className="btn btn-sm btn-info"
              onClick={() => reprint(item)}
            >
              Reprint
            </button>
          </td>
        </tr>,
      )
    })
  }
  //   const location = useLocation();
  return (
    <>
      {/* {JSON.stringify(list)} */}
      <Card outline color="primary">
        <CardHeader outline color="success" className="text-center" tag="h6">
          Printed Results
        </CardHeader>
        <div className="m-1">
          <DaterangeSelector
            from={range.from}
            to={range.to}
            handleChange={({ target: { name, value } }) =>
              handleRangeChange(name, value) 
            }
            gap={false}
            size="sm"
            showLabel={false}
          />
          <SearchBar
            filterText={searchTerm}
            placeholder="Search by Patient Name"
            onFilterTextChange={(searchTerm) => setSearchTerm(searchTerm)}
            _ref={patientSearchRef}
          />
        </div>
        {loading && <Loading />}
        <Scrollbars style={{ height: '65vh' }}>
          <Table bordered responsive hover size="sm">
            <thead>
              <th className="text-center">Printed</th>
              <th className="text-center">Patient</th>
              <th className="text-center">Action</th>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </Scrollbars>
        <PrintRadiologyReport data={printOut} />
      </Card>
    </>
  )
}
