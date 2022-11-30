
import React, { Component } from 'react';
import { Table } from 'reactstrap';

class Staff extends Component {
  state = {};
  render() {
    return (
      <div>
        
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>S/N</th>
              <th>Name</th>
              <th>Amount Earned</th>
              <th>Bank Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}

export default Staff;