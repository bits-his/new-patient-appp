import React from 'react';
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
import StoreManagement from './StoreManagement';
import Scrollbars from 'react-custom-scrollbars';
import SearchBar from '../record/SearchBar';
import { AiFillFolderAdd } from 'react-icons/ai';
import { useLocation, useHistory } from 'react-router';
import RequisitionTable from './RequisitionTable';

export default function LabInventaryTabe() {
  const location = useLocation();
  const history = useHistory();

  const handleClick = () => {
    history.push('/me/inventory/store-management/requisitiontable');
  };
  return (
    <>
      <Row>
        <Col md={8}>
          {location.pathname === '/me/inventory/store-management' ? (
            <Button
              color="primary"
              className="mb-1"
              outline
              onClick={() => {
                history.push('/me/inventory/store-management/newitem');
              }}
            >
              <AiFillFolderAdd size={26} style={{ marginRight: 10 }} />
              Add New Item
            </Button>
          ) : null}
          {location.pathname ===
          '/me/inventory/store-management/requisitiontable' ? (
            <RequisitionTable />
          ) : location.pathname === '/me/inventory/store-management/newitem' ? (
            <StoreManagement />
          ) : (
            <LabInventory />
          )}
        </Col>
        <Col md={4}>
          <Card>
            <CardHeader>Incoming Requisition</CardHeader>
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
                    <th>Lab Name</th>
                  </thead>
                  <tbody style={{ cursor: 'pointer' }} onClick={handleClick}>
                    <td>02/03/2020</td>
                    <td>Microbiology</td>
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
