import React, { useState } from 'react'
import { Eye, PlusSquare } from 'react-feather';
import { useHistory } from 'react-router-dom';
import { Card, Col, Modal, ModalBody, Row, Table } from 'reactstrap'
import Button from '../AdminDashboard/Button'

export default function OperatorViewPM() {
    const [open1, setOpen1] = useState(false);
    const toggle1 = () => {
        setOpen1(!open1);
    };
    const [open2, setOpen2] = useState(false);
    const toggle2 = () => {
        setOpen2(!open2);
    };
    const [open3, setOpen3] = useState(false);
    const toggle3 = () => {
        setOpen3(!open3);
    };
    const navigate = useHistory()

    const operatorsData = [
        {

            blockCode: 'Block A',
            noOfTentants: 10,

        },
        {

            blockCode: 'Block B',
            noOfTentants: 10,

        }, {

            blockCode: 'Block C',
            noOfTentants: 10,

        }
    ]
    return (
        <div className='mt-4'>
            <Card className='admin-card p-3'>
                <Row>
                    <Col md={6}>
                        <p className='card-title'>PM Details</p>
                    </Col>
                    <Col md={6}>
                        {/* <Button btnText='Edit PM' icon={<FaPen />} style={{ float: 'right' }} onClick={() => navigate('/admin/edit-pm')} /> */}
                    </Col>
                </Row>
                <Row>
                    <Col md={2}>
                        <div className='pm'>
                            <p className='pmsize'>PM 1</p>
                        </div>
                    </Col>
                    <Col md={5}>
                        <p className='pm-data'><span className='sp'>Address:</span> 10</p>
                        <p className='pm-data'><span className='sp'>No of Tentants:</span> 10</p>
                        <p className='pm-data'><span className='sp'>Landloard/Lady:</span> Habu Yakasai</p>
                        <p className='pm-data'><span className='sp'>Phone:</span> +234 090 18661696</p>
                        {/* <Button btnText='Add Block' icon={<FaPen />} onClick={() => navigate('')} /> */}
                        <button className='block-btn' onClick={toggle1}>Add Block</button>
                    </Col>
                    <Col md={5}></Col>
                </Row>

                <Table className='mt-3' striped borderless size='sm'>
                    <thead>
                        <tr>
                            <th>
                                S/N
                            </th>
                            <th>
                                Blocks
                            </th>
                            <th>
                                Tentants
                            </th>
                            <th>
                                <div style={{ float: 'right', marginRight: '' }}>
                                    Action
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {operatorsData.map((item, index) => (
                            <tr>
                                <th scope="row">
                                    {index + 1}
                                </th>
                                <td>
                                    {item.blockCode}
                                </td>
                                <td>
                                    {item.noOfTentants}
                                </td>
                                <td>
                                    <div style={{ float: 'right' }}>
                                        <PlusSquare className='menu' size='1.5em' onClick={toggle2} />
                                        <Eye className='menu' size='1.5em' onClick={() => { navigate('/operator/view-block') }} />
                                        {/* <Edit className='menu' size='1.5em' onClick={toggle3}/>
                    <Trash className='menu' size='1.5em' /> */}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>

            <Modal size="sm" isOpen={open1} toggle={toggle1} className="avail-cars" style={{ padding: 0 }}>
                <ModalBody className="modal-body">
                    <div className='menu-div'>
                        <h6>Add Block</h6>
                        <div>
                            <input type='text' className='inputs' placeholder='Block Name' />
                        </div>
                        <div>
                            <Button btnText={'Save'} onClick={toggle1} />
                        </div>
                    </div>
                </ModalBody>
            </Modal>
            <Modal size="" isOpen={open2} toggle={toggle2} className="avail-cars" style={{ padding: 0 }}>
                <ModalBody className="modal-body">
                    <div className='menu-div'>
                        <h6>Add Tentant</h6>
                        <div>
                            <input type='text' className='inputs' placeholder='Tenant Full Name' />
                            <input type='text' className='inputs' placeholder='Phone' />
                            <div className='select'>
                                <select>
                                    <option>-select sex-</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                            </div>
                            <div className='select'>
                                <select>
                                    <option>-select purpose-</option>
                                    <option>Commercial</option>
                                    <option>Residential</option>
                                </select>
                            </div>
                            <div className='select'>
                                <select>
                                    <option>-select accommodation-</option>
                                    <option>Duplex</option>
                                    <option>Bungalo</option>
                                    <option>Terrace</option>
                                    <option>Apartment</option>
                                    <option>Detached</option>
                                </select>
                            </div>
                            <div className='select'>
                                <select>
                                    <option>-select bedroom-</option>
                                    <option>1 Bedroom</option>
                                    <option>2 Bedrooms</option>
                                    <option>3 Bedrroms</option>
                                    <option>4 Bedrooms</option>
                                    <option>5 Bedrooms</option>
                                    <option>6 Bedrooms</option>
                                    <option>7 Bedrooms</option>
                                </select>
                            </div>
                            <div className='select'>
                                <select>
                                    <option>-select duration-</option>
                                    <option>1year</option>
                                    <option>2years</option>
                                    <option>3years</option>
                                    <option>4years</option>
                                    <option>5years</option>
                                </select>
                            </div>
                            <input type='number' className='inputs' placeholder='Rent' />
                            <input type='date' className='inputs' placeholder='' />
                        </div>
                        <div>
                            <Button btnText={'Save'} onClick={toggle2} />
                        </div>
                    </div>
                </ModalBody>
            </Modal>
            <Modal size="" isOpen={open3} toggle={toggle3} className="avail-cars" style={{ padding: 0 }}>
                <ModalBody className="modal-body">
                    <div className='menu-div'>
                        <h6>Edit Tentant</h6>
                        <div>
                            <input type='text' className='inputs' placeholder='Tenant Full Name' />
                            <input type='text' className='inputs' placeholder='Phone' />
                            <div className='select'>
                                <select>
                                    <option>-select sex-</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                            </div>
                            <div className='select'>
                                <select>
                                    <option>-select purpose-</option>
                                    <option>Commercial</option>
                                    <option>Residential</option>
                                </select>
                            </div>
                                
                            <div className='select'>
                                <select>
                                    <option>-select bedroom-</option>
                                    <option>1 Bedroom</option>
                                    <option>2 Bedrooms</option>
                                    <option>3 Bedrroms</option>
                                    <option>4 Bedrooms</option>
                                    <option>5 Bedrooms</option>
                                    <option>6 Bedrooms</option>
                                    <option>7 Bedrooms</option>
                                </select>
                            </div>
                            <div className='select'>
                                <select>
                                    <option>-select duration-</option>
                                    <option>1year</option>
                                    <option>2years</option>
                                    <option>3years</option>
                                    <option>4years</option>
                                    <option>5years</option>
                                </select>
                            </div>
                            <input type='number' className='inputs' placeholder='Rent' />
                            <input type='date' className='inputs' placeholder='' />
                        </div>
                        <div>
                            <Button btnText={'Save'} onClick={toggle2} />
                        </div>
                    </div>
                </ModalBody>
            </Modal>
            <Modal size="" isOpen={open3} toggle={toggle3} className="avail-cars" style={{ padding: 0 }}>
                <ModalBody className="modal-body">
                    <div className='menu-div'>
                        <h6>Edit Tentant</h6>
                        <div>
                            <input type='text' className='inputs' placeholder='Tenant Full Name' />
                            <input type='text' className='inputs' placeholder='Phone' />
                            <div className='select'>
                                <select>
                                    <option>-select sex-</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                            </div>
                            <div className='select'>
                                <select>
                                    <option>-select purpose-</option>
                                    <option>Commercial</option>
                                    <option>Residential</option>
                                </select>
                            </div>
                            <div className='select'>
                                <select>
                                    <option>-select bedroom-</option>
                                    <option>1 Bedroom</option>
                                    <option>2 Bedrooms</option>
                                    <option>3 Bedrroms</option>
                                    <option>4 Bedrooms</option>
                                    <option>5 Bedrooms</option>
                                    <option>6 Bedrooms</option>
                                    <option>7 Bedrooms</option>
                                </select>
                            </div>
                            <div className='select'>
                                <select>
                                    <option>-select duration-</option>
                                    <option>1year</option>
                                    <option>2years</option>
                                    <option>3years</option>
                                    <option>4years</option>
                                    <option>5years</option>
                                </select>
                            </div>
                            <input type='number' className='inputs' placeholder='Rent' />
                            <input type='date' className='inputs' placeholder='' />
                        </div>
                        <div>
                            <Button btnText={'Save'} onClick={toggle2} />
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    )
}
