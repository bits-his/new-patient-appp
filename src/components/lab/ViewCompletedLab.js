import React from 'react';
import { Card, Table, CardTitle } from 'reactstrap';
import moment from 'moment';
import { AiFillPrinter } from 'react-icons/ai';

export default function ViewCompletedLab() {
  const date = new Date().toISOString();
  return (
    <Card className="p-3">
      <CardTitle className="h5 text-center">Pathology</CardTitle>

      <h6>Patient's Information</h6>

      <table>
        <tr>
          <td>Name: </td>
          <td> Adewale Muritala</td>
        </tr>
        <tr>
          <td>Sex: </td>
          <td> Male</td>
        </tr>
        <tr>
          <td>Age: </td>
          <td> 12 years</td>
        </tr>
        <tr>
          <td>Date: </td>
          <td> {moment(date).format('DD-MM-YYYY')}</td>
        </tr>
      </table>

      <hr />
      <h6>Results</h6>
      <Table bordered size="sm">
        <thead>
          <tr>
            <th>Test</th>
            <th>Value</th>
            <th>Range</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Blood for Parasite F</td>
            <td>25 ml</td>
            <td>20-30 (ml)</td>
          </tr>
          <tr>
            <td>Complete Blood Picture</td>
            <td>good</td>
            <td />
          </tr>
          <tr>
            <td>Band Cell Count</td>
            <td>20 millio/sec</td>
            <td>2 - 5 (millio/sec)</td>
          </tr>
        </tbody>
      </Table>

      <center>
        <button className="btn btn-primary mt-3 pr-5 pl-5">
          <AiFillPrinter size="20" /> Print
        </button>
      </center>
    </Card>
  );
}
