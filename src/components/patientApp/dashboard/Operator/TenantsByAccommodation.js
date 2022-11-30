import React, { useEffect, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { BsChat } from 'react-icons/bs'
import { FaCalendar, FaUser, FaVideo } from 'react-icons/fa'
import { FcOk, FcVideoCall } from 'react-icons/fc'
import { MdMapsHomeWork } from 'react-icons/md'
import { useHistory } from 'react-router'
import { Button, Col, Row, Table } from 'reactstrap'
import { apiURL } from '../../../../redux/actions'
// import { apiURL } from '../../redux/Api'
import '../Styles/Styles.css'
export default function TenantsByAccommodation() {
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
    const navigate= useHistory()
    return (
        <div>
            <p className='d_text'>Recent Appointments</p>
            <hr />
            <Scrollbars style={{ height: 250 }}>
            <Table border>
                <thead>
                    <tr>
                        <th style={{ marginBottom: 30 }}>id</th>
                        <th style={{ marginBottom: 30 }}>Doctor</th>
                        <th style={{ marginBottom: 30 }}>Status</th>
                        <th style={{ marginBottom: 30 }}>Action</th>


                    </tr>
                </thead>
                <tbody>
                    {
                        result&&result.map((item,index)=>
                        <tr style={{ marginBottom: 30 }} className="">
                        <td style={{ margin: 0, marginRight: 10 }}><MdMapsHomeWork className='not_icon' size='1em' color='grey' />{' '}{index+1} </td>
                        <td style={{ margin: 0, marginRight: 10 }}><MdMapsHomeWork className='not_icon' size='1em' color='grey' />{' '}{item.firstname} {item.lastname}</td>
                        <td style={{ margin: 0, marginRight: 10 }} className="mr-4">{' '}<FcOk /></td>
                        <td style={{ margin: 0, marginRight: 10 }}>{' '}<Button color="primary" onClick={()=>alert("coming soon!!")} size="sm"outline><BsChat color="black" size="20" /></Button>{' '}<Button onClick={()=>navigate.push(`/app/new-appointments/${item.id}`)} color="primary" size="sm"  outline><FaVideo color="black" size="20" /></Button></td>
                    </tr>
                        )
                    }
                    
                   
                </tbody>
            </Table>
                </Scrollbars>
        </div>
    )
}
