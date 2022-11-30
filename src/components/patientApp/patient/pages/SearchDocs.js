import React, { useState, useEffect } from 'react';
// import {
//   Row,
//   Input,
//   InputGroup,
//   InputGroupAddon,
//   InputGroupText,
//   Card,
// } from 'reactstrap';
import { FaSearch } from 'react-icons/fa';
// import BackButton from '../../comp/components/BackButton';

import { useSelector, useDispatch } from 'react-redux';
// import Loading from '../../loading';
// import { getApprovedDoctors } from '../../../redux/actions/auth';
import DoctorList from './DoctorList';
// import { apiURL } from '../../redux/Api';
import { Card, Col, Input, InputGroup, InputGroupText, Row } from 'reactstrap';
import { useParams } from 'react-router';
import Loading from '../../../comp/components/Loading';
import { apiURL } from '../../../../redux/actions';

export default function SearchDocs() {
  const [docFilter, setDocFilter] = useState('');
  const dispatch = useDispatch();

  // const doctorList = useSelector((state) => state.auth.approvedDoctors);
  // const loading = useSelector((state) => state.auth.loadingApprovedDoc);

  const [result,setResults] = useState()
  const [loading,setLoading] = useState()
    const getDoctorList = ()=>{
      fetch(`${apiURL()}/doctors/all/list`)
      .then((raw) => raw.json())
      .then(({ results }) => {
        setResults(results)
      }) .catch((err) => setLoading(false));
    }
  useEffect(() => {
    // dispatch(getApprovedDoctors());
    getDoctorList()
  }, []);
  const params =useParams()
  const id  = params.date;

  return (
    <div>
      {/* <BackButton text="Go Back" /> */}

      <Card body className="m-2 mt-lg-2">
        <div>
          <InputGroup>
            {/* <InputGroupAddon addonType="prepend"> */}
              <InputGroupText className="bg-primary text-light">
                <FaSearch size={23} />
              </InputGroupText>
            {/* </InputGroupAddon> */}

            <Input
              type="text"
              name="docFilter"
              placeholder="Search for a Doctor by Speciality, Location, etc"
              value={docFilter}
              onChange={(e) => setDocFilter(e.target.value)}
            />
          </InputGroup>
        </div>
        {loading && <Loading />}
          {JSON.stringify(id)}
        <Row className="mt-4">
          <DoctorList list={result} filterTerm={docFilter} date={id} />
        </Row>
      </Card>
    </div>
  );
}
