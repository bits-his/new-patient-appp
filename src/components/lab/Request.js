import React from 'react';
import { Card, CardHeader, Table, Button } from 'reactstrap';
import BackButton from '../comp/components/BackButton';
import { IoMdCheckmark, IoMdClose } from 'react-icons/io';

export default function Request (){
    return(
        <>
        <BackButton />
            <Card>
                <CardHeader>Item Issued</CardHeader>
                <Table bordered>
      <thead>
        <tr>
          <th>S/N</th>
          <th> Date</th>
          <th> Item</th>
          <th>Qty Issued</th>
          <th>Qty Requested</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">1</th>
          <td>22/02/2020</td>
          <td>Touch</td>
          <td>2</td>
          <td>6</td>
          <td className="d-flex">
              <Button size="sm" color="danger" className="mr-1"><IoMdClose /></Button>
              <Button size="sm" color="success"><IoMdCheckmark /></Button>
          </td>
        </tr>
      </tbody>
    </Table>
            </Card>
        </>
        )
    
}