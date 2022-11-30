import React from 'react'
import { useState } from 'react'
import { Card, Col, Modal, Row } from 'reactstrap'
import Button from '../AdminDashboard/Button'
import profile from '../Images/profile.jpg'
export default function OperatorProfile() {
    const [open, setOpen] = useState(false)
    const openModal = () => {
        setOpen(!open)
    }
    return (
        <div className='mt-4'>
            <Card className='admin-card p-3'>
                <Row>
                    <Col md={6}>
                        <p className='card-title mb-5'>Operator Profile</p>
                    </Col>
                    <Col md={6}>
                        {/* <Button btnText='Add PM' icon={<FaPlus />} style={{ float: 'right' }} onClick={() => navigate('/admin/create-pm')} /> */}
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <div className='profile-div'>
                            <img src={profile} alt='profilepicture' className='profile-image shadow' />
                        </div>
                        <div className='profile-data-div p-4'>
                            <Row className='pt-5'>
                                <p style={{ fontWeight: 'bold', fontSize: '30px', margin: 0 }}>
                                    Habu Yakasai
                                </p>
                                <p style={{ fontWeight: 'bold', fontSize: '20px', margin: 0 }}>
                                    PM 12
                                </p>
                                <p style={{ margin: 0 }}>
                                    habuyakasai@gmail.com
                                </p>
                                <p style={{ margin: 0 }}>
                                    07032906691
                                </p>
                            </Row>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className='profile-data p-4'>
                            <Row className=''>
                                <p style={{ fontWeight: 'bold', fontSize: '20px', margin: 0 }}>
                                    Updte your password
                                </p>
                                <div>
                                    <input type='password' className='inputs' placeholder='Old Password' />
                                </div>
                                <div>
                                    <input type='password' className='inputs' placeholder='New Password' />
                                </div>

                                <Button btnText={'Save'} onClick={openModal} />
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Card>
            <Modal size='sm' isOpen={open}  className=''>
                <div className='p-4 text-center'>
                    <p>Password changed</p>
                    <Button btnText={'Close'} onClick={openModal}/>
                </div>
            </Modal>
        </div>
    )
}
