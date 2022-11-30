import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
// import { Navigate } from 'react-router-dom'
// import { IoChatbubbleEllipsesSharp } from 'react-icons/io'
import { AiOutlineMenu } from 'react-icons/ai'
import { Card, Col, Modal, ModalBody, Row, Table } from 'reactstrap'
import Button from './Button'
import { useHistory } from 'react-router-dom'
export default function Operators() {
  const [open1, setOpen1] = useState(false);
  const toggle1 = () => {
    setOpen1(!open1);
  };
  const navigate = useHistory()

  const operatorsData = [
    {
      firstName: 'Habu',
      lastName: 'Yakasai',
      email: 'habu@homes.com',
      phone: '+234 9018661696',
      portfolio: "H"
    }
  ]
  return (
    <div className='mt-4'>
      <Card className='admin-card p-3'>
        <Row>
          <Col md={6}>
            <p className='card-title'>Operators</p>
          </Col>
          <Col md={6}>
            <Button btnText='Add Operator' icon={<FaPlus />} style={{float:'right'}} onClick={() => navigate('/admin/create-portfolio')} />
          </Col>
        </Row>

        <Table className='mt-3' striped borderless size='sm'>
          <thead>
            <tr>
              <th>
                S/N
              </th>
              <th>
                Porfolio
              </th>
              <th>
                First Name
              </th>
              <th>
                Last Name
              </th>
              <th>
                Email
              </th>
              <th>
                Phone
              </th>
              <th>

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
                  {item.portfolio}
                </td>
                <td>
                  {item.firstName}
                </td>
                <td>
                  {item.lastName}
                </td>
                <td>
                  {item.email}
                </td>
                <td>
                  {item.phone}
                </td>
                <td>
                  <AiOutlineMenu className='menu' size='1.5em' onClick={toggle1} />
                  {/* <AiOutlineMenu className='menu' size='1.5em' onClick={() => navigate('/admin/view-operator')} /> */}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal size="sm" isOpen={open1} toggle={toggle1} className="avail-cars" style={{padding:0}}>
          <ModalBody className="modal-body">
            <div className='menu-div'>
              {/* <p className='p-menu'>View</p> */}
              {/* <hr style={{width:'100%'}}/> */}
              <p className='p-menu' onClick={()=>navigate('/admin/edit-operator')}>Edit</p>
              <hr style={{width:'100%'}}/>
              {/* <p className='p-menu'>Edit</p> */}
              <p className='p-menu' style={{color:'red'}}>Delete</p>
            </div>
          </ModalBody>
        </Modal>
      </Card>
    </div>
  )
}
