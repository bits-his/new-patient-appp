import React, { useCallback, useEffect, useState } from 'react'
import { Row, Col, Card, Table } from 'reactstrap'
import { BsClockHistory, BsClock } from 'react-icons/bs'
import { MdMapsHomeWork } from 'react-icons/md'
import { ImCreditCard, ImUsers, ImVideoCamera } from 'react-icons/im'
import '../Operator/Chart.css'
import DoughnutChart from '../Operator/Doughnut'
import BarChart from '../Operator/BarChart'
import TenantsByAccommodation from '../Operator/TenantsByAccommodation'
import { FaCalendar, FaUser } from 'react-icons/fa'
import { useHistory } from 'react-router'
// import DemoApp from '../../patient/pages/calenda/Demo'
import Scrollbars from 'react-custom-scrollbars'
import DemoApp from '../../patient/pages/calenda/Demo'
import Calender from '../../../doc_dash/appointments/Calender'
import { useDispatch, useSelector } from 'react-redux'
import { appointmentFunc, setSelectedAppointment } from '../../../doc_dash/actions/appointmentsAction'
import CalenderView from '../../../doc_dash/appointments/CalenderView'
import moment from "moment";
export default function Home() {
  const navigate =useHistory()
  const dispatch = useDispatch()
  const [appointment, setAppointments] = useState([]);
  const { facilityId, id } = useSelector((state) => state.auth.user);

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

  const appointments = useSelector((state) => state.individualDoc.appointments)

  const setAppointment = (it) => dispatch(setSelectedAppointment(it))
  return (
    <div className='mt-4'>
      <Row>
        <Col lg={3}>
          <Card className='dashboard_card p-3 shadow-sm' style={{cursor:"pointer"}} onClick={()=>navigate.push("/rent-expiry")}>
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
                    <p className='d_text'>Drug Schedule</p>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col lg={3}>
          <Card className='dashboard_card p-3 shadow-sm' style={{cursor:"pointer"}} onClick={()=>navigate.push("/me/patient/appointment")}>
            <Row>
              <Col md={3}>
                <div className='dashboard_icon_div2'>
                  <div>
                    <BsClock size='2.5em' className='icon_div2' />
                  </div>
                </div>
              </Col>
              <Col md={9}>
                <div className='dashboard_card_details' >
                  <div>
                    <p className='d_count'>12</p>
                    <p className='d_text'>Appointments</p>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col lg={3}>
          <Card className='dashboard_card p-3 shadow-sm' style={{cursor:"pointer"}} onClick={()=>navigate.push("/rent-expiry")}>
            <Row>
              <Col md={3}>
                <div className='dashboard_icon_div3'>
                  <div>
                    <ImCreditCard size='2.5em' className='icon_div3' />
                  </div>
                </div>
              </Col>
              <Col md={9}>
                <div className='dashboard_card_details'>
                  <div>
                    <p className='d_count'>122</p>
                    <p className='d_text'>Balance</p>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col lg={3}>
          <Card className='dashboard_card p-3 shadow-sm' style={{cursor:"pointer"}} onClick={()=>navigate.push("/rent-expiry")}>
            <Row>
              <Col md={3}>
                <div className='dashboard_icon_div4'>
                  <div>
                    <ImVideoCamera size='2.5em' className='icon_div4' />
                  </div>
                </div>
              </Col>
              <Col md={9}>
                <p className='d_count'>412</p>
                <p className='d_text'>Chat / Video Call</p>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Card className='dashboard_card p-3 mt-4 shadow-sm' style={{ height: "30vh" }}>
           <p className='text-block mb-0'>Drug Schedule</p>
           <hr className='mt-0' />
           <Scrollbars style={{ height: 250 }}>
           {/* <marquee behavior="scroll" direction="up" onmouseover="stop();" onmouseout="start();" scrolldelay="200" height="200">
<Table border>
  <tbody>
    <tr style={{ marginBottom: 30 }} className="">
      <td style={{ margin: 0, marginRight: 10 }}><MdMapsHomeWork className='not_icon' size='1em' color='grey' />{' '}PM </td>
      <td style={{ margin: 0, marginRight: 10 }}><MdMapsHomeWork className='not_icon' size='1em' color='grey' />{' '}Phase A</td>
      <td style={{ margin: 0, marginRight: 10 }}><FaUser className='not_icon' size='1em' color='grey' />{' '}<a href="/open"> Habu Yakasai</a></td>
      <td style={{ margin: 0, marginRight: 10 }}><FaCalendar className='not_icon' size='1em' color='grey' />{' '}Date: 12/12/2022</td>
    </tr>
    <tr style={{ marginBottom: 30 }} className="">
      <td style={{ margin: 0, marginRight: 10 }}><MdMapsHomeWork className='not_icon' size='1em' color='grey' />{' '}BS </td>
      <td style={{ margin: 0, marginRight: 10 }}><MdMapsHomeWork className='not_icon' size='1em' color='grey' />{' '}Phase C </td>
      <td style={{ margin: 0, marginRight: 10 }}><FaUser className='not_icon' size='1em' color='grey' />{' '}<a href="/open"> Musa Isah</a></td>
      <td style={{ margin: 0, marginRight: 10 }}><FaCalendar className='not_icon' size='1em' color='grey' />{' '}Date: 12/12/2022</td>
    </tr>
  </tbody>
</Table>
</marquee> */}
           </Scrollbars>
          </Card>
        </Col>
        <Col md={4}>
          <Card className='dashboard_card p-3 mt-4 shadow-sm' style={{ height: "30vh" }}>
           <p className='text-block mb-0'>Incoming Events</p>
           <hr className='mt-0' />
           <Scrollbars style={{ height: 250 }}>
           {/* <marquee behavior="scroll" direction="up" onmouseover="stop();" onmouseout="start();" scrolldelay="200" height="200">
<Table border>
  <tbody>
    <tr style={{ marginBottom: 30 }} className="">
      <td style={{ margin: 0, marginRight: 10 }}><MdMapsHomeWork className='not_icon' size='1em' color='grey' />{' '}PM </td>
      <td style={{ margin: 0, marginRight: 10 }}><MdMapsHomeWork className='not_icon' size='1em' color='grey' />{' '}Phase A</td>
      <td style={{ margin: 0, marginRight: 10 }}><FaUser className='not_icon' size='1em' color='grey' />{' '}<a href="/open"> Habu Yakasai</a></td>
      <td style={{ margin: 0, marginRight: 10 }}><FaCalendar className='not_icon' size='1em' color='grey' />{' '}Date: 12/12/2022</td>
    </tr>
    <tr style={{ marginBottom: 30 }} className="">
      <td style={{ margin: 0, marginRight: 10 }}><MdMapsHomeWork className='not_icon' size='1em' color='grey' />{' '}BS </td>
      <td style={{ margin: 0, marginRight: 10 }}><MdMapsHomeWork className='not_icon' size='1em' color='grey' />{' '}Phase C </td>
      <td style={{ margin: 0, marginRight: 10 }}><FaUser className='not_icon' size='1em' color='grey' />{' '}<a href="/open"> Musa Isah</a></td>
      <td style={{ margin: 0, marginRight: 10 }}><FaCalendar className='not_icon' size='1em' color='grey' />{' '}Date: 12/12/2022</td>
    </tr>
  </tbody>
</Table>
</marquee> */}
           </Scrollbars>
          </Card>
        </Col>
        <Col md={4}>
          <Card className='dashboard_card p-3 mt-4 shadow-sm' style={{ height: "30vh" }}>
           <p className='text-block mb-0'>Health News</p>
           <hr className='mt-0' />
           <Scrollbars style={{ height: 290 }}>
            
           {/* <marquee behavior="scroll" direction="up" onmouseover="stop();" onmouseout="start();" scrolldelay="200" height="200">
<Table border>
  <tbody>
    <tr style={{ marginBottom: 30 }} className="">
      <td style={{ margin: 0, marginRight: 10 }}><MdMapsHomeWork className='not_icon' size='1em' color='grey' />{' '}PM </td>
      <td style={{ margin: 0, marginRight: 10 }}><MdMapsHomeWork className='not_icon' size='1em' color='grey' />{' '}Phase A</td>
      <td style={{ margin: 0, marginRight: 10 }}><FaUser className='not_icon' size='1em' color='grey' />{' '}<a href="/open"> Habu Yakasai</a></td>
      <td style={{ margin: 0, marginRight: 10 }}><FaCalendar className='not_icon' size='1em' color='grey' />{' '}Date: 12/12/2022</td>
    </tr>
    <tr style={{ marginBottom: 30 }} className="">
      <td style={{ margin: 0, marginRight: 10 }}><MdMapsHomeWork className='not_icon' size='1em' color='grey' />{' '}BS </td>
      <td style={{ margin: 0, marginRight: 10 }}><MdMapsHomeWork className='not_icon' size='1em' color='grey' />{' '}Phase C </td>
      <td style={{ margin: 0, marginRight: 10 }}><FaUser className='not_icon' size='1em' color='grey' />{' '}<a href="/open"> Musa Isah</a></td>
      <td style={{ margin: 0, marginRight: 10 }}><FaCalendar className='not_icon' size='1em' color='grey' />{' '}Date: 12/12/2022</td>
    </tr>
  </tbody>
</Table>
</marquee> */}
           </Scrollbars>
          </Card>
        </Col>

      </Row>
      {/* <Row>
        <Col md={12}>
          <Card className='p-3 mt-4 shadow-sm'>
            <BarChart />
          </Card>
        </Col>
      </Row> */}
      <br />
      <Row>
        <Col md={6}><Card   style={{ height: "30vh" }}className='dashboard_card ch p-3 mt-4 shadow-sm'>
          <TenantsByAccommodation />
        </Card></Col>
        <Col md={6}><Card  style={{ height: "50vh" }} className='dp-3 mt-4 shadow-sm'>
          <p className='d_text text-center'>Book Appointements</p>
          <hr></hr>
          {/* <Row> */}
            {/* <Col md={2}></Col> */}
            {/* <Col md={8}> */}
            <Scrollbars style={{ height: 250 }}>
              {/* <Chart /> */}
              {/* <DoughnutChart /> */}
              <CalenderView events={appointment} display={false} />
              </Scrollbars>
            {/* </Col> */}
            {/* <Col md={2}></Col> */}
          
        </Card>
        </Col>
      </Row>
    </div>
  )
}
