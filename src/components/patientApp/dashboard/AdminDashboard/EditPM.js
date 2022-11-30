import React from 'react'
import { FaSave } from 'react-icons/fa'
import { useHistory } from 'react-router-dom'
import { Card, Col, Row } from 'reactstrap'
import Button from './Button'

export default function EditPM() {
    const navigate = useHistory()

    return (
        <div className='mt-4'>
            <Card className='admin-card p-3'>
                <p className='card-title'>Edit PM</p>
                <Row>
                    <Col md={6}>
                        <div>
                            <input type='address' className='inputs' placeholder='PM Adress' />
                        </div>
                        <div>
                            <input type='text' className='inputs' placeholder='Last Name' />
                        </div>
                    </Col>
                    <Col md={6}>
                        <div>
                            <input type='text' className='inputs' placeholder='First Name' />
                        </div>
                        <div>
                            <input type='text' className='inputs' placeholder='Phone' />
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className='select'>
                            <select>
                                <option>-change operator-</option>
                                <option>operator 1</option>
                            </select>
                        </div>
                    </Col>
                </Row>
                <Button btnText={'Save'} icon={<FaSave />} onClick={() => navigate('/admin/PM')} />
            </Card>
        </div>
    )
}
