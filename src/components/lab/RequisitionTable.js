import React from 'react'
import { Table, Card, CardBody, CardHeader,FormGroup, Input,
    UncontrolledPopover, PopoverHeader, PopoverBody, Button } from 'reactstrap';
import BackButton from '../comp/components/BackButton';
import { IoMdCheckmark } from 'react-icons/io';

export default function RequisitionTable () {
    return (
        <>
        <BackButton />
        <Card>
            <CardHeader>
                Requisition Table
            </CardHeader>
            <CardBody>
                 <Table hover striped>
                <thead>
                    <tr>
                    <th>Item</th>
                    <th>Date</th>
                    <th>Lab Name</th>
                    <th>Qty Requested</th>
                    <th>Requested By</th>
                    <th>Qty Issue</th>
                    </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Rice</td>
                    <td>02/2/2020</td>
                    <td>Microbiology</td>
                    <td>20</td>
                    <td>Abdullahi</td>
                 <td className="d-flex">
                    <FormGroup className="mr-1">
                        <Input type="text" id="PopoverClick" placeholder="Qty to be given" />
                    </FormGroup>
                    <Button size="sm" color="success" className="mb-3"><IoMdCheckmark /></Button>
                </td>
                    </tr>
                </tbody>
                </Table>
                <UncontrolledPopover trigger="click" placement="top" target="PopoverClick">
        <PopoverHeader>Remaining In Store</PopoverHeader>
        <PopoverBody>200 Pack</PopoverBody>
      </UncontrolledPopover>
            </CardBody>
        </Card>
        
        </>
    )
}