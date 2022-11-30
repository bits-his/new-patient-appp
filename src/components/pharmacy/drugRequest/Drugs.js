/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from 'react'
import { Button, Card, CardBody, CardFooter, Row, Col } from 'reactstrap'
import paracetamol from './images/Paracetamol.png'
export default function Drugs({itemList=[]}) {
    const [count, setCount] = useState(1)
    function increment() {
        setCount(prevCount => prevCount + 1)
    }
    function decrement() {
        setCount(prevCount => prevCount - 1)
    }
    return (
        <div>
            <Row style={{ marginTop: 5 }}>
                {itemList.map((item, idx) => (
                    <Col md="4">
                        <Card style={{ textAlign: '' }}>
                            <CardBody>
                                <img src={paracetamol}
                                    style={{
                                        width: 100, height: 100,
                                        marginLeft: 'auto', marginRight: 'auto',
                                        display: 'block'
                                    }} />
                                <h6>{item.drugName}</h6>
                                <p style={{ marginTop: 5 }}>Price: ₦:<span>{item.price}</span></p>
                            </CardBody>
                            <CardFooter>
                                <h6 style={{ display: 'inline', marginRight: 1 }}>Qnty: </h6>
                                <Button className='bg-primary' style={{ marginRight: 5 }} onClick={() => increment(idx)}>+</Button>
                                <h5 style={{ display: 'inline-block' }}>{item.quantity}</h5>
                                <Button className='bg-primary' style={{ marginLeft: 5 }} onClick={() => decrement(idx)}>-</Button>
                            </CardFooter>
                        </Card>
                    </Col>))}
            </Row>
        </div>
    )
}
