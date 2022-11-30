import React from 'react';
import Purchase from './RecordPurchase';
import { useLocation, useHistory } from 'react-router';
import {
  Row,
  Col,
  Table,
  Card,
  CardHeader,
  CardBody,
  Button,
} from 'reactstrap';
import LabInventory from './LabInventory';
import SearchBar from '../record/SearchBar';
import Scrollbars from 'react-custom-scrollbars';
import { IoIosGitPullRequest } from 'react-icons/io';
import Request from './Request';
import { Route } from 'react-router';

export default function RequisitionDashboard() {
  const location = useLocation();
  const history = useHistory();

  const handleClick = () => {
    history.push('/me/inventory/point-of-sale/requested-items');
  };
  return (
    <>
    {location.pathname === '/me/inventory/point-of-sale' ? (
            <Button
              color="primary"
              className="mb-1"
              outline
              onClick={() => {
                history.push('/me/inventory/point-of-sale/requisition');
              }}
            >
              <IoIosGitPullRequest size={26} style={{ marginRight: 10 }} />
              New Request
            </Button>
          ) : null}
      <Row>
        <Col md={8}>
        <Route exact path="/me/inventory/point-of-sale/requisition" component={Purchase} />
        <Route exact path="/me/inventory/point-of-sale/requested-items" component={Request} />
        <Route exact path="/me/inventory/point-of-sale" component={LabInventory} />
        </Col>
        <Col md={4}>
          <Card>
            <CardHeader>Issued Items</CardHeader>
            <CardBody>
              <SearchBar
              // filterText={searchTerm}
              // onFilterTextChange={(searchTerm) => setSearchTerm(searchTerm)}
              />
              <Scrollbars style={{ height: 500 }}>
                <Table bordered responsive hover>
                  <thead>
                    {/* <th>S/N</th> */}
                    <th>Date</th>
                    <th>Item Name</th>
                  </thead>
                  <tbody style={{ cursor: 'pointer' }} onClick={handleClick}>
                    <td>02/03/2020</td>
                    <td>Nothing here</td>
                  </tbody>
                </Table>
              </Scrollbars>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
