import React, { useEffect, useState } from 'react'
import { BsBack } from 'react-icons/bs'
import { FaCalendar, FaMoneyBill, FaPhone, FaTrash, FaUser } from 'react-icons/fa'
import { MdMapsHomeWork } from 'react-icons/md'
import { useHistory } from 'react-router'
// import Button from '../AdminDashboard/Button'
import { Card, Col, Row,Button } from 'reactstrap'
import { apiURL } from '../../redux/Api'
// import Button from '../AdminDashboard/Button'

export default function OperatorNotification() {
    const notificationData = [{
        name: 'Habu Yakasai',
        expiryDate: '12/12/2012',
        pm: 'PM1',
        rent: '100,000',
        phone: '+234 09018661696',
    },
    {
        name: 'Habu Yakasai',
        expiryDate: '12/12/2012',
        pm: 'PM1',
        rent: '100,000',
        phone: '+234 09018661696',
    }
    ]
    const navigate = useHistory()
    const user = JSON.parse(localStorage.getItem("@@__token"))
    const [results,setResults]=useState([])
    const getDoctorList = ()=>{
      fetch(`${apiURL}/auth/patient/notification-all?query_type=select&userId=${user&&user[0].userId}`)
      .then((raw) => raw.json())
      .then(({ results }) => {
        setResults(results)
      }) .catch((err) => console.log(err));
    }
  useEffect(() => {
    // dispatch(getApprovedDoctors());
    getDoctorList()
  }, []);
    return (
        <div className='mt-4'>
             <Button color="primary" onClick={()=>{navigate(-1)}}><BsBack /> Back</Button>
            <Card className='admin-card p-3'>
                <Row>
                    <Col md={6}>
                        <p className='card-title m-0'>Notifications</p>
                        <p className='' style={{ fontSize: 20 }}>Due Rents</p>
                    </Col>
                    <Col md={6}>
                        {/* <Button btnText='Edit PM' icon={<FaPen />} style={{ float: 'right' }} onClick={() => navigate('/admin/edit-pm')} /> */}
                    </Col>
                    <Col md={2}>
                    </Col>
                </Row>
                
                {results&&results.map((item) =>
                (
                    <div className='' style={{ fontSize: 12 }}>
                        <Card className='not_card shadow-sm p-2 m-1'>
                            <Row>
                                <Col md={2} className=''>
                                    <MdMapsHomeWork className='not_icon' size='1em' color='grey' />
                                    {' '}
                                    {"now"}
                                    <div className='not_data'>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className='not_data'>
                                        <FaUser className='not_icon' size='1em' color='grey' />
                                        {' '}
                                        {item.dr_name}
                                    </div>
                                </Col>
                                <Col md={2}>
                                    <div className='not_data'>
                                        <FaPhone className='not_icon' size='1em' color='grey' />
                                        {' '}
                                        <a href={item.message} target_blank>{item.message}</a>
                                    </div>
                                </Col>
                                
                                 
                            </Row>
                        </Card>
                    </div>
                )
                )}
            </Card>
        </div>
    )
}
