import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardBody, Table, Alert, Button } from 'reactstrap'
import { Scrollbars } from 'react-custom-scrollbars'
// import { useSelector } from "react-redux";
import SearchBar from '../record/SearchBar'
// import { getFacilityPendingLabListByPatient } from "./actions/labActions";
// import { useCallback } from "react";
// import { getPatientList } from "../record/actions/patientsActions";
import Loading from '../comp/components/Loading'
import moment from 'moment'
// import { apiURL } from "../../redux/actions";
// import { _fetchApi2 } from "../../redux/actions/api";
import { getPendingLabRequests } from '../doc_dash/actions/labActions'
import { useHistory } from 'react-router'
// import { useHistory } from 'react-router';
import DaterangeSelector from '../comp/components/DaterangeSelector'

function PendingLabRequest(props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const today = moment().format('YYYY-MM-DD')
  const [range, setRange] = useState({ from: today, to: today })
  // const [pending, setPending] = useState([]);
  const history = useHistory()

  const [pendingRequests, setPendingRequests] = useState([])
  // const facilityId = useSelector((state) => state.auth.user.facilityId);

  // const _getPendingLabList = () => {
  //   toggle(true);

  //   dispatch(getFacilityPendingLabListByPatient(savePending));
  // };

  const getOrderedLabList = () => {
    setLoading(true)
    getPendingLabRequests(
      (data) => {
        setLoading(false)
        setPendingRequests(data)
      },
      (err) => {
        setLoading(false)
        console.log(err)
      },
      range,
    )
    // alert("hello");

    // _fetchApi2(
    //   `${apiURL()}/lab/get-by-status?query_type=list&status=ordered&facilityId=${facilityId}`,
    //   (data) => {
    //     if (data && data.results) {
    //       setPending(data.results);
    //     }
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // );
  }

  const onPatientClick = (currentReq) => {
    props.onPatientClick(currentReq)
  }

  useEffect(() => {
    getOrderedLabList()

    const refreshList = setInterval(() => {
      getOrderedLabList()
    }, 300000)
    // dispatch(getPatientList());
    // _getPendingLabList();

    return () => {
      clearInterval(refreshList)
    }
  }, [])

  return (
    <Card>
      <CardHeader className="div d-flex flex-row justify-content-between py-2">
        <h6>Pending Request </h6>
        <Button color="success" size="sm" onClick={getOrderedLabList}>
          Refresh
        </Button>
      </CardHeader>
      <CardBody className="p-2">
        <DaterangeSelector
          from={range.from}
          to={range.to}
          handleChange={({ target: { name, value } }) =>
            setRange((p) => ({ ...p, [name]: value }))
          }
          showLabel={false}
          size="sm"
          gap={false}
        />

        <SearchBar
          placeholder="Search by patient "
          filterText={searchTerm}
          onFilterTextChange={(searchTerm) => setSearchTerm(searchTerm)}
        />
        {/* {JSON.stringify(pendingRequests)} */}
        <Scrollbars style={{ height: '70vh' }}>
          <LabList
            setToggle={props.setToggle}
            onRequestClick={onPatientClick}
            history={history}
            loading={loading}
            pendingRequests={pendingRequests}
          />
        </Scrollbars>
      </CardBody>
    </Card>
  )
}

export default PendingLabRequest

function LabList({ pendingRequests, loading, setToggle, history }) {
  return (
    <>
      {loading && <Loading />}
      <Table bordered hover striped size="sm">
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {pendingRequests.map((record) => (
            <tr
              style={{ cursor: 'pointer' }}
              key={record.id}
              onClick={() => {
                history.push(
                  `/me/lab/patients/process-pending/${record.patient_id}/${record.request_id}`,
                )
              }}
            >
              <td>{moment(record.created_at).format('DD-MM-YYYY')}</td>
              <td>
                {record.name} ({record.patient_id})
              </td>
              <td>{record.patient_status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* 
      {list.length
        ? list.map((item, idx) => (
            <Card
              outline
              // color="secondary"
              key={idx}
              onClick={() => {
                history.push(`/me/lab/process/${item.patient_id}`);
              }}
              style={{ cursor: 'pointer' }}
              className="p-2 mt-1"
            >
              <span>{item.patient}</span>
              <span>
                <strong>Test:</strong> {item.test}
              </span>
              <CardText className="text-sm text-muted text-right">
                requested {moment(item.createdAt).fromNow()}
              </CardText>
            </Card>
          ))
        : null} */}

      {!pendingRequests.length && (
        <Alert className="text-center">List is empty.</Alert>
      )}
    </>
  )
}
