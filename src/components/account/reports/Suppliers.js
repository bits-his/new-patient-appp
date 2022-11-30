import React, { Component } from "react";
import { Table } from "reactstrap";

export default class Suppliers extends Component {
  render() {
    return (
      <div>
        
        <div className=" tableData" align="center">
          <Table striped bordered>
            <tr>
              <th>S/N</th>
              <th>Date</th>
              <th>Description</th>
              <th>Rate</th>
              <th>Amount</th>
              <th>Qty</th>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </Table>
        </div>
      </div>
    );
  }
}
