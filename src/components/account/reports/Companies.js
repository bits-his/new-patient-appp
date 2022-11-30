import React, { Component } from 'react';
import { Table } from 'reactstrap';

class Companies extends Component {
  state = {};

  render() {
    return (
      <div>
        <Table bordered>
          <thead>
            <tr>
              {/* <th>SN</th> */}
              <th>Date</th>
              <th>Name</th>
              <th>Admission</th>
              <th>Drugs</th>
              <th>Lab</th>
              <th>ProMGT</th>
              <th>Total</th>
              <th>Customer</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {/* <td></td> */}
              <td></td>
              <td></td>
              <td></td>
              <td></td>
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
export default Companies;
