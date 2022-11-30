import React, { Component } from 'react';
import { Table, CardBody, Card, CardHeader } from 'reactstrap';
import SearchBar from '../../../record/SearchBar';

export default class MicroBiologyTable extends Component {
  render() {
    return (
      <>
        <Card>
        <CardHeader className="h6 text-center" >Completed Lab Analysis</CardHeader>
          <CardBody style={{ height: '600px' }}>
          <SearchBar placeholder="Search by Name"/>
            <Table striped>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Lab Group</th>
                </tr>
              </thead>

              <tbody>
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </>
    );
  }
}
