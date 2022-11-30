import React from 'react'
import { Row, Col, Card, CardHeader, CardBody } from 'reactstrap'
import { BsClockHistory, BsClock } from 'react-icons/bs'
import { MdMapsHomeWork } from 'react-icons/md'
import { Circle, PieChart, Users } from 'react-feather'
import { ImUsers } from 'react-icons/im'
import './Chart.css'
import Chart from './Chart'
import DoughnutChart from './Doughnut'
import BarChart from './BarChart'
import TenantsByAccommodation from './TenantsByAccommodation'
import { FaCalendar, FaUser } from 'react-icons/fa'
import Marquee from "react-fast-marquee";

export default function OperatorDashboard() {
  return (
    <div className='mt-4'>
      <Row>
        <Col lg={3}>
          <Card className='dashboard_card p-3 shadow-sm'>
            <Row>
              <Col md={3}>
                <div className='dashboard_icon_div1'>
                  <div>
                    <BsClockHistory size='2.5em' className='icon_div1' />
                  </div>
                </div>
              </Col>
              <Col md={9}>
                <div className='dashboard_card_details'>
                  <div>
                    <p className='d_count'>12</p>
                    <p className='d_text'> Rent expiry alert</p>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col lg={3}>
          <Card className='dashboard_card p-3 shadow-sm'>
            <Row>
              <Col md={3}>
                <div className='dashboard_icon_div2'>
                  <div>
                    <BsClock size='2.5em' className='icon_div2' />
                  </div>
                </div>
              </Col>
              <Col md={9}>
                <div className='dashboard_card_details'>
                  <div>
                    <p className='d_count'>12</p>
                    <p className='d_text'> Rents Due</p>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col lg={3}>
          <Card className='dashboard_card p-3 shadow-sm'>
            <Row>
              <Col md={3}>
                <div className='dashboard_icon_div3'>
                  <div>
                    <MdMapsHomeWork size='2.5em' className='icon_div3' />
                  </div>
                </div>
              </Col>
              <Col md={9}>
                <div className='dashboard_card_details'>
                  <div>
                    <p className='d_count'>122</p>
                    <p className='d_text'>PM</p>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col lg={3}>
          <Card className='dashboard_card p-3 shadow-sm'>
            <Row>
              <Col md={3}>
                <div className='dashboard_icon_div4'>
                  <div>
                    <ImUsers size='2.5em' className='icon_div4' />
                  </div>
                </div>
              </Col>
              <Col md={9}>
                <p className='d_count'>412</p>
                <p className='d_text'>Tentants</p>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Card className='dashboard_card p-3 mt-4 shadow-sm' style={{ height: "20vh" }}>
            <p className='d_count'>Rent expiry alert</p>


            <marquee behavior="scroll" direction="up" onmouseover="stop();" onmouseout="start();" scrolldelay="200" height="200">
              <div style={{ marginBottom: 30 }} className="">
                <p style={{ margin: 0, marginRight: 10, display: 'inline' }}><MdMapsHomeWork className='not_icon' size='1em' color='grey' />{' '}PM phase 1</p>
                <p style={{ margin: 0, marginRight: 10, display: 'inline' }}><FaUser className='not_icon' size='1em' color='grey' />{' '}Tenant: Habu Yakasai</p>
                <p style={{ margin: 0, marginRight: 10, display: 'inline' }}><FaCalendar className='not_icon' size='1em' color='grey' />{' '}Date: 12/12/2022</p>
              </div>
              <div style={{ marginBottom: 30 }} className="">
                <p style={{ margin: 0, marginRight: 10, display: 'inline' }}><MdMapsHomeWork className='not_icon' size='1em' color='grey' />{' '}NB phase 3</p>
                <p style={{ margin: 0, marginRight: 10, display: 'inline' }}><FaUser className='not_icon' size='1em' color='grey' />{' '}Tenant: Abdullahi Musa</p>
                <p style={{ margin: 0, marginRight: 10, display: 'inline' }}><FaCalendar className='not_icon' size='1em' color='grey' />{' '}Date: 12/12/2022</p>
              </div>
            </marquee>


          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Card style={{ height: '30vh' }}>
            <BarChart />
          </Card>
        </Col>
        <Col md={3}><Card className='dashboard_card ch p-3 mt-4 shadow-sm'>
          <TenantsByAccommodation />
        </Card></Col>
        <Col md={3}><Card className=' p-3 mt-4 shadow-sm'>
          <p className='d_text text-center'>Recent payments</p>
          <hr></hr>
          <Row>
            <Col md={2}></Col>
            <Col md={8}>
              {/* <Chart /> */}
              <DoughnutChart />
            </Col>
            <Col md={2}></Col>
          </Row>
          <Row className='mt-2 text-center'>
            <Col md={2}></Col>
            <Col md={4}>
              <p className='d_text_m' style={{ color: 'white', backgroundColor: 'rgba(34, 64, 41, 0.5)', padding: 5, borderRadius: 5, fontSize: 13 }}>Male</p>
            </Col>
            <Col md={5}>
              <p className='d_text_m' style={{ color: 'white', backgroundColor: 'rgba(186, 207, 68, 0.5)', padding: 5, borderRadius: 5, fontSize: 13 }}>Female</p>
            </Col>
            <Col md={1}></Col>
          </Row>
        </Card>
        </Col>
      </Row>
    </div>
  )
}
