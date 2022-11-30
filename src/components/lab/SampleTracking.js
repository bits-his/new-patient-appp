import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Table } from 'reactstrap';
import { connect } from 'react-redux';
import { getFacilityPendingLabList } from './actions/labActions';
import moment from 'moment';
import SearchBar from '../record/SearchBar';

class SampleTracking extends Component {
  constructor() {
    super();

    this.state = {
      searchTerm: '',
      test: {},
      facilityLabList: [],
    };
  }
  componentDidMount() {
    const facility = (data) => {
      this.setState({
        facilityLabList: data,
      });
    };
    this.props.getFacilityPendingLabList(facility);
  }
  onSearchTermChange = (e) => this.setState({ searchTerm: e.target.value });

  render() {
    const { searchTerm } = this.state;
    let filteredElements = [];
    this.state.facilityLabList.forEach((item, index) => {
      if (
        item.test &&
        item.test.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1
      )
        return;
      filteredElements.push(
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{item.patient || 'Unknown'}</td>
          <td>{item.createdBy}</td>
          <td>{item.test}</td>
          <td>{item.status}</td>
          <td>{moment(item.createdAt).fromNow()}</td>
        </tr>,
      );
    });

    return (
      <div>
        <Card>
          <CardHeader tag="h6">Check the Status of a Test</CardHeader>
          <CardBody>
            <div className="mb-3">
              <SearchBar
                value={searchTerm}
                onFilterTextChange={this.onSearchTermChange}
                placeholder="Search for test by test name, status, patient name"
              />
            </div>
            <Table bordered hover striped responsive>
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Patient</th>
                  <th>Requested by</th>
                  <th>Test</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>{filteredElements}</tbody>
            </Table>
          </CardBody>
        </Card>
      </div>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    getFacilityPendingLabList: (cd) => dispatch(getFacilityPendingLabList(cd)),
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(SampleTracking);
