import React, { useEffect } from 'react'
import { Card, Col, Modal, ModalBody, Row } from 'reactstrap'
import Button from './Button'
import profile from '../Images/profile.jpg'
import { useState } from 'react'
import { AiOutlineMenu } from 'react-icons/ai'
import { useHistory } from 'react-router-dom'
export default function Profile() {
    const [open, setOpen] = useState(false)
    const openModal = () => {
        setOpen(!open)
    }
    const [form,setForm] = useState({
        email:"",
        firstname:"",
        lastname:"",
        phone:"0907676776",
        username:""

    })
    const handleChange = ({target:{name,value}})=>{
        setForm((p)=>({...p,[name]:value}))
    }
    const navigate = useHistory()
    const user = JSON.parse(localStorage.getItem("@@__token"))    
    useEffect(()=>{
        setForm(user[0])
    })
    return (
        <div className='mt-4'>

            <Card className='admin-card p-3'>
                <Row>
                    <Col md={6}>
                        <p className='card-title mb-3'>User Profile</p>
                    </Col>
                    <Col md={6}>
                        {/* <Button btnText='Add PM' icon={<FaPlus />} style={{ float: 'right' }} onClick={() => navigate('/admin/create-pm')} /> */}
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        {/* {JSON.stringify(user)} */}
                        <div className='profile-div' >
                            <img src={profile} alt='profilepicture' className='profile-image shadow' />
                        </div>
                        <div className='profile-data-div p-4' style={{ height: '60vh' }}>
                            <Row className='pt-5'>
                                <p style={{ fontWeight: 'bold', fontSize: '30px', margin: 0 }}>
                                    {user[0].fullName}
                                </p>
                                <p style={{ margin: 0 }}>
                                    {user[0].email}
                                </p>
                                <p style={{ margin: 0 }}>
                                    07032906691
                                </p>
                            </Row>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className='profile-data p-4' style={{ height: '60vh' }}>
                            <Row className=''>
                                <p style={{ fontWeight: 'bold', fontSize: '20px', margin: 0 }}>
                                   Update Profile
                                </p>
                                <div>
                                    <input type='text' value={form.fullName} className='inputs' placeholder='First Name' />
                                </div>
                                <div>
                                    <input type='text' value={form.lastname} className='inputs' placeholder='Last Name' />
                                </div>
                                <div>
                                    <input type='email'value={form.email} className='inputs' placeholder='Email' />
                                </div>
                                <div>
                                    <input type='number' className='inputs'value={form.phone} placeholder='Phone' />
                                </div>
                                <div>
                                    <input type='text' className='inputs' placeholder='Portfolio' />
                                </div>
                                <Button btnText={'Update'} onClick={openModal} />
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Card>
            <Modal size='sm' isOpen={open} className=''>
                <div className='p-4 text-center'>
                    <p>Successfully created an operator</p>
                    <Row>
                        <Col md={6}>
                            <Button btnText={'View'} onClick={() => navigate('/admin/operators')} />
                        </Col>
                        <Col md={6}>
                            <Button btnText={'Close'} onClick={openModal} />
                        </Col>
                    </Row>
                </div>
            </Modal>
        </div>
    )
}