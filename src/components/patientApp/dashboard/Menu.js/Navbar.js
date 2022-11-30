import React from 'react'
import { FaBell } from 'react-icons/fa'
import { useHistory } from 'react-router-dom'
import { Col, Row } from 'reactstrap'
import logo from './logo.png'
import user from '../Images/profile.jpg'
import { useLocation } from 'react-router-dom'
export default function Navbarb() {
  const location = useLocation()
  const navigate = useHistory()
  return (
    <div className='navb'>
      <Row className='m-0 p-0'>
        <Col md={1}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50px' }}>
            <div>
              <img src={logo}  style={{
          height: 40,
          width: 150
        }} className=' pl-3' alt='homes logo' />
            </div>
          </div>
        </Col>
        <Col md={1}></Col>
        <Col md={1}></Col>
        <Col md={1}></Col>
        <Col md={1}></Col>
        <Col md={1}></Col>
        <Col md={1}></Col>
        <Col md={1}></Col>
        {/* <Col md={1}></Col> */}
        <Col md={2}>
          {/* <p className='username'>Habu Yakasai</p> */}
        </Col>
        <Col md={2} className=''>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50px' }} >
            <div className='relative' style={{ cursor: 'pointer' }} onClick={() => navigate('/operator/notifications')}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div>
                  <span className='absolute'>1</span>
                </div>
              </div>
              <FaBell size='1.6em' style={{ color: 'rgb(34, 64, 41)', zIndex: 1 }} />
            </div>
            <div className='bell_user_icon_div' onClick={() => { location.pathname.includes('operator') ? navigate('/operator/profile') : navigate('admin/profile') }}>
              <p className='username' style={{color: "white"}}>Habu Yakasai{' '}<img src={user} className='userimage' alt='' /></p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}
