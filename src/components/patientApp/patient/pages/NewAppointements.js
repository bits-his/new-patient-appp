import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { BsBack, BsChat } from 'react-icons/bs'
import { FaCalendarPlus, FaRegCalendarCheck, FaRegCalendarTimes, FaVideo } from 'react-icons/fa'
import { FcVideoCall } from 'react-icons/fc'
import { ImLocation } from 'react-icons/im'
import { MdCall } from 'react-icons/md'
import { useHistory, useParams } from 'react-router'
import { Button, Card, CardHeader, Col, Row } from 'reactstrap'
import { apiURL } from '../../redux/Api'
import { appointmentFunc } from './helper'
import CalenderView from "../pages/calenda/calendaView"

export default function NewAppointements() {
   const navigate = useHistory()
   const params = useParams()
   const [results,setResults] = useState([])
   const handleNewAppointmentClick = () => {
      navigate("/me/doctor/appointments/new");
      // clearPatient();
    };
   let id = params.id;
   const getDoctorList = ()=>{
      fetch(`${apiURL}/doctor/all/id?id=${id}`)
      .then((raw) => raw.json())
      .then(({ results }) => {
        setResults(results[0])
      }) .catch((err) => console.log(err));
    }
  useEffect(() => {
    // dispatch(getApprovedDoctors());
    getDoctorList()
  }, []);
const facilityId = results.facilityId;
const ids = results.id;
    const [appointment, setAppointments] = useState([]);
  const getAppointmentByDoc = useCallback(() => {
    const formData = {
      facilityId,
      user_id: id,
      query_type: "select",
    };
    let err = () => {
      console.log("error occur");
    };
    appointmentFunc(
      formData,
      (d) => {
        let newArr = [];
        d &&
          d.results.forEach((i) => {
            newArr.push({
              ...i,
              xid: i.id,
              title: i.patient_name,
              date: moment(i.start_at).format("YYYY-MM-DD"),
            });
          });
        setAppointments(newArr);
        // console.log(d, "LDLLD");
      },
      err
    );
  }, [facilityId, id]);

  useEffect(() => {
    getAppointmentByDoc();
  }, [getAppointmentByDoc]);
  return (
    <div>
        <Button color="primary" onClick={()=>{navigate(-1)}}><BsBack /> Back</Button>
        <Card className="m-4">
        {/* {JSON.stringify(results)} */}
        <CardHeader tag="h5">Schedule an Appointment</CardHeader>
        <Row>

     <Col md={3} className="mt-2">
        <Card>
     <img
            src={require("../../images/docAvater.png")}
            alt="doc-avatar"
            // height={12}
            className="img-fluid"
            // style={{ maxWidth: '150px' }}
          /></Card>
     </Col>

     <Col md={4} className="mt-5">
        <h3>{results&&results.firstname} {results&&results.lastname}</h3>
        <h3>{results&&results.speciality}</h3>
        <h3><ImLocation />{results&&results.address}</h3>
     </Col>
     <Col md={5} className="mt-4">
        <div className='d-flex'>
            <Button color='primary' size='sm' className='m-3' onClick={()=>navigate(`/app/video-call/${id}`)}><FaVideo size="23" color='white' /> Video Call</Button>
            <Button color='primary' size='sm' className='m-3'> <MdCall size="23" color='white' />  Audio Call</Button>
            <Button color='primary' size='sm' className='m-3'><BsChat size="23" color='white' /> Chat</Button>
        </div>
     </Col>
        </Row>
        <div>
      <div className="d-flex justify-content-between mb-1 mt-1">
        <span>
          <Button>back</Button>
        </span>
        <span>
          <button className="btn btn-outline-primary mr-1" disabled>
            <FaRegCalendarCheck className="mr-1" size={20} /> View All
          </button>
          <button
            className="btn btn-outline-info mr-1"
            onClick={() => navigate(-1)}
          >
            <FaRegCalendarTimes className="mr-1" size={20} /> All Unapproved
          </button>
          <button
            className="btn btn-outline-warning"
            // onClick={() => history.push(UNAPPROVED_APPOINTMENTS)}
            disabled
          >
            <FaRegCalendarTimes className="mr-1" size={20} /> All Cancelled
          </button>
        </span>
        <button
          className="btn btn-outline-dark"
          onClick={handleNewAppointmentClick}
        >
          <FaCalendarPlus /> New Appointment
        </button>
        {/* {JSON.stringify(appointment)} */}
      </div>
      <div>
        <CalenderView events={appointment} display={true} />
      </div>
    </div>
        </Card>

    </div>
  )
}
