import React, { useEffect, useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import { Card, CardBody, CardHeader } from 'reactstrap'
import { apiURL } from '../../../redux/Api'
import AutoComplete from './AutoComplete'

export default function ViewAppointments() {
    const [result,setResults] = useState([])
    const [loading,setLoading] = useState()
      const getDoctorList = ()=>{
        fetch(`${apiURL}/doctors/all/list`)
        .then((raw) => raw.json())
        .then(({ results }) => {
          setResults(results)
        }) .catch((err) => setLoading(false));
      }
    useEffect(() => {
      // dispatch(getApprovedDoctors());
      getDoctorList()
    }, []);
    const [singleSelections, setSingleSelections] = useState([]);
    // const [multiSelections, setMultiSelections] = useState([]);
  return (
    <div>
        <Card>
            <CardHeader>New Appointements</CardHeader>
            <CardBody>
            <Typeahead
          id="basic-typeahead-single"
          labelKey="name"
          onChange={setSingleSelections}
          options={result&&result.firstname}
          placeholder="Choose a state..."
          selected={singleSelections}
        />

            </CardBody>
        </Card>
    </div>
  )
}
