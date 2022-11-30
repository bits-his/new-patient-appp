import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  CardBody,
  FormGroup,
  Label,
  Input,
  CardHeader,
} from "reactstrap";
import SearchBar from "../record/SearchBar";
import { _fetchApi, _postApi } from "../../redux/actions/api";
import { apiURL } from "../../redux/actions";
import moment from "moment";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { _customNotify } from "../utils/helpers";
import CustomButton from "../comp/components/Button";

export default function CustomerApproval() {
  const [nextAccNo, setNextAccNo] = useState("");
  const [loadingApproval, setLoadingApproval] = useState(false);
  const [loadingRejection, setLoadingRejection] = useState(false);
  const [selectedClient, setSelectedClient] = useState({
    open: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingApprovalList, setPendingApprovalList] = useState([]);

  const facilityId = useSelector((state) => state.facility.info.facility_id);

  const getClientPendingApproval = () => {
    _fetchApi(
      `${apiURL()}/lab/client/approval/pending`,
      (data) => {
        if (data.success) {
          setPendingApprovalList(data.results);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const getNextClientID = useCallback(
    async () => {
      try {
        const response = await fetch(`${apiURL()}/client/nextId/${facilityId}`);
        return await response.json();
      } catch (error) {
        return error;
      }
    },
    [facilityId]
  );

  useEffect(
    () => {
      getClientPendingApproval();
      getNextClientID()
        .then((resp) => setNextAccNo(resp.results.accountNo))
        .catch((err) => console.log(err));
    },
    [getNextClientID]
  );

  const approveClient = () => {
    setLoadingApproval(true);
    _postApi(
      `${apiURL()}/lab/client/approval/approve`,
      { applicationId: selectedClient.id, nextAccNo, status: "approved" },
      (resp) => {
        setLoadingApproval(false);

        // if (resp.success) {
        _customNotify("Client Account Approved Successfully");
        getNextClientID()
          .then((resp) => setNextAccNo(resp.results.accountNo))
          .catch((err) => console.log(err));
        getClientPendingApproval();
        setSelectedClient({ open: false });
        // }
      },
      (err) => {
        console.log(err);
        setLoadingApproval(false);
      }
    );
  };

  const rejectClient = () => {
    setLoadingRejection(true);
    _postApi(
      `${apiURL()}/lab/client/approval/change-status`,
      { applicationId: selectedClient.id, status: "rejected" },
      (resp) => {
        setLoadingRejection(false);
        if (resp.success) {
          _customNotify("Client Account Approved Successfully");
          getClientPendingApproval();
        }
      },
      (err) => {
        console.log(err);
        setLoadingRejection(false);
      }
    );
  };

  const rows = [];
  pendingApprovalList.forEach((item, i) => {
    if (item.accName.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1) {
      return;
    }
    rows.push(item);
  });

  return (
    <>
      <Card>
        <Row>
          <Col md={selectedClient.open ? 4 : 12}>
            <Card className="m-2">
              <CardHeader className="text-center" tag="h6">
                Credit Customer Approval
              </CardHeader>
              {/* <CardBody> */}
              {/* {JSON.stringify(pendingApprovalList)} */}
              <FormGroup className="m-3">
                <SearchBar
                  filterText={searchTerm}
                  onFilterTextChange={(value) => setSearchTerm(value)}
                  placeholder="Search clients"
                />
              </FormGroup>

              <Table hover striped responsive>
                <thead>
                  <tr>
                    <th>Date</th>
                    {/* <th>Account Type</th> */}
                    <th>Name</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((item, i) => (
                    <tr
                      key={i}
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedClient({ open: true, ...item })}
                    >
                      <td>{moment(item.createdAt).format("DD-MM-YYYY")}</td>
                      {/* <td>{item.accountType}</td> */}
                      <td>{item.accName}</td>
                      <td>{item.description}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {!rows.length && (
                <p className="alert alert-primary text-center mx-2">
                  No pending client approval at this time, please check back
                  later.
                </p>
              )}
              {/* </CardBody> */}
            </Card>
          </Col>
          {selectedClient.open ? (
            <Col md={8}>
              <CardBody>
                <Row className="mt-3">
                  <Col md={6} className="my-2">
                    <label className="mr-2">Name: </label>
                    <label>{selectedClient.accName}</label>
                  </Col>
                  <Col md={6} className="my-2">
                    <FormGroup className="mr-sm-2 mb-sm-0">
                      <Label className="mr-sm-2">Application No.</Label>
                      <Label>{selectedClient.id}</Label>
                    </FormGroup>
                    {/* <FormGroup className="mr-sm-2 mb-sm-0">
                      <Label className="mr-sm-2">Available Account No.</Label>
                      <Label>{nextAccNo}</Label>
                    </FormGroup> */}
                  </Col>
                  <Col md={6} className="my-2">
                    <label className="mr-2">Address: </label>
                    <label>{selectedClient.contactAddress}</label>
                  </Col>
                  <Col md={6} className="my-2">
                    <label className="mr-2">Phone: </label>
                    <label>{selectedClient.contactPhone}</label>
                  </Col>
                  <Col md={6} className="my-2">
                    <label>Contact: </label>
                    <label>{selectedClient.contactPhone}</label>
                  </Col>
                  <Col md={6} className="my-2">
                    <label className="mr-2">Email: </label>
                    <label>{selectedClient.contactEmail}</label>
                  </Col>
                  <Col md={6} className="my-2">
                    <label className="mr-2">Website: </label>
                    <label>{selectedClient.contactWebsite}</label>
                  </Col>
                  {/* <Col md={6} className="my-2">
                    <label>Other Details: </label>
                  </Col> */}
                </Row>
                <center>
                  <CustomButton
                    outline
                    color="success"
                    className="pl-4 pr-4 mr-3 mt-3"
                    onClick={approveClient}
                    loading={loadingApproval}
                  >
                    <FaCheck className="mr-2" />
                    Approve
                  </CustomButton>
                  <CustomButton
                    outline
                    color="danger"
                    className="pl-4 pr-4 mt-3"
                    onClick={rejectClient}
                    loading={loadingRejection}
                  >
                    <FaTimes className="mr-2" /> Reject
                  </CustomButton>
                </center>
                <FormGroup row className="mt-3">
                  <Label for="exampleEmail" sm={2}>
                    Remarks
                  </Label>
                  <Col sm={10}>
                    <Input type="textarea" name="remark" />
                  </Col>
                </FormGroup>
              </CardBody>
            </Col>
          ) : null}
        </Row>
      </Card>
    </>
  );
}
