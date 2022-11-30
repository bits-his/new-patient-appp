import React, { useEffect, useRef, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { Card, CardHeader, Table } from 'reactstrap'
import Button from 'reactstrap/lib/Button'
import { apiURL } from '../../../redux/actions'
import { SET_LAB_PATIENT_LIST } from '../../../redux/actions/actionTypes'
import { _fetchApi } from '../../../redux/actions/api'
import SearchBar from '../../record/SearchBar'

export default function PatientList({ mode = 'pharm' }) {
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState('')
  const [list, setList] = useState([])
  const history = useHistory()

  const handleClick = (item) => {
    // alert(JSON.stringify(item))
    if (mode === 'lab') {
      history.push(`/me/lab/patients/new/${item.id}`)
    } else {
      history.push(`/me/pharmacy/sale/${item.id}`)
    }
  }

  const getPendingLab = () => {
    let condition = 'Instant'
    let type = null
    _fetchApi(
      `${apiURL()}/lab/patients/${condition}/${type}`,
      (data) => {
        if (data.success) {
          setList(data.results)
          dispatch({ type: SET_LAB_PATIENT_LIST, payload: data.results })
        }
      },
      (err) => {
        console.log(err)
      },
    )
  }
  useEffect(() => {
    getPendingLab()
  }, [])
  const patientSearchRef = useRef()
  let rows = []

  if (list.length) {
    list.forEach((item, index) => {
      if (
        item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1 &&
        item.phoneNo.toString().indexOf(searchTerm.toString()) === -1
      )
        return

      rows.push(
        <tr style={{ cursor: 'pointer' }} key={index}>
          <td>
            <Button
              size="sm"
              color="primary"
              onClick={() => history.push(`/me/lab/patients/edit/${item.id}`)}
            >
              Edit
            </Button>
          </td>
          <td onClick={() => handleClick(item)}>{item.name}</td>
          <td onClick={() => handleClick(item)}>{item.phoneNo}</td>
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
          Patients Record
        </CardHeader>
        <div className="m-2">
          <SearchBar
            filterText={searchTerm}
            onFilterTextChange={(searchTerm) => setSearchTerm(searchTerm)}
            _ref={patientSearchRef}
          />
        </div>
        <Scrollbars style={{ height: '65vh' }}>
          <Table bordered responsive hover size="sm">
            <thead>
              <th>Action</th>
              <th className="text-center">Name</th>
              <th className="text-center">Phone</th>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </Scrollbars>
      </Card>
    </>
  )
}
