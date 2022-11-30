import React from 'react'
// import { ShoppingCart } from 'react-feather'
import paracetamol from './images/Paracetamol.png'
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Row } from 'reactstrap'

export default function DrugsCart({ itemList = [] }) {
    return (
        <div>
            <Card>
                <CardHeader>
                    <Row>
                        <Col md='6'><h5>Your Cart</h5></Col>
                        {/* <Col md='6'><ShoppingCart style={{ float: 'right' }} /></Col> */}
                    </Row>
                </CardHeader>
                <CardBody>
                    {itemList.map((item, idx) => (
                        item.status && item.quantity >= 1 ?
    
                            <Card style={{ marginBottom: 5 }}>
                                <CardBody style={{ margin: -1, padding: -1 }}>
                                    <Row >
                                        <Col md='4'>
                                            <img src={paracetamol}
                                                style={{
                                                    width: 70, height: 60,
                                                    display: 'block',
                                                    margin: 'auto ',
                                                    padding: 'auto'
                                                }} alt=""/>
                                        </Col>
                                        <Col md='4'>
                                            <h5>{item.drugName}</h5>
                                            <h5 style={{ marginTop: 5 }}>Price: ₦:<span>{item.price}</span></h5>
                                        </Col>
                                        <Col md='4'>
                                            <h5 style={{ display: 'inline', marginRight: 10 }}>Qnty: {item.quantity}</h5>
                                            <h5 style={{ display:'block', marginRight: 10 }}>Total Price: {item.quantity * item.price}</h5>

                                        </Col>
                                    </Row>

                                </CardBody>
                            </Card> : null))}
                </CardBody>
                <CardFooter><Button className='bg-primary'>Checkout</Button></CardFooter>
            </Card >
        </div >
    )
}
