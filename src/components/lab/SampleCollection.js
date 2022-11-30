import React, { Component, Fragment } from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Table,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from 'reactstrap';
// import ProcessReq from './ProcessReq';
import PendingRequestProcess from './PendingRequestProcess';
import { _fetchData } from '../utils/helpers';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import Loading from '../comp/components/Loading';

export default class SampleCollection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      labrequests: [],
      processModalIsOpen: false,
      currentPatient: [],
      patients: [],
      requestByPatient: [],
      error: '',
    };
  }

  getPendingReq() {
    let route = 'lab/pending';
    let success_callback = (data) => this.setState({ labrequests: data });
    let error_callback = (error) => this.setState({ error });
    _fetchData({ route, success_callback, error_callback });
  }

  componentDidMount() {
    // this.getPendingReq();
  }

  toggleProcessModal = () =>
    this.setState((prevState) => ({
      processModalIsOpen: !prevState.processModalIsOpen,
    }));

  onRequestClick = (req) => {
    console.log(req);
    // this.setState({ currentPatient: req });
    // this.toggleProcessModal();
    // this.getLabRequest(req.id);
  };

  getLabRequest(id) {
    let route = 'lab/getReqById?id=' + id;
    let success_callback = (data) => this.setState({ requestByPatient: data });

    _fetchData({ route, success_callback });
  }

  render() {
    let {
      labrequests,
      // patients,
      processModalIsOpen,
      currentPatient,
    } = this.state;
    let { toggleProcessModal } = this;
    return (
      <Fragment>
        <Card>
          <CardHeader color="primary" tag="h6">
            Pending Lab Requests
          </CardHeader>
          <CardBody>
            <RequestTable
              labrequests={labrequests}
              onRequestClick={this.onRequestClick}
            />
            <Modal
              size="lg"
              isOpen={processModalIsOpen}
              toggle={toggleProcessModal}
            >
              <ModalHeader toggle={toggleProcessModal}>
                <p className="text-center">Request List</p>
              </ModalHeader>
              <ModalBody>
                {/* <ProcessReq
              patient={this.state.currentPatient}
              toggleProcessModal={this.toggleProcessModal}
              processModalIsOpen={this.state.processModalIsOpen}
              updatePendingRequestTable={this.props.updatePendingRequestTable}
              requests={this.state.requestByPatient}
            /> */}
                <PendingRequestProcess
                  // requests={requestForThisPatient}
                  // resultModalOpen={resultModalOpen}
                  // previewModalOpen={previewModalOpen}
                  // toggleResultModal={toggleResultModal}
                  // togglePreviewModal={togglePreviewModal}
                  // saveLabResults={saveLabResults}
                  // onStatusChange={onStatusChange}
                  // onStatusUnchanged={onStatusUnchanged}
                  currentReq={currentPatient}
                  // req={req}
                />
              </ModalBody>
              <ModalFooter>
                {/* <button className="btn btn-primary" onClick={this.onSaveClick}>
            Save
          </button> */}
              </ModalFooter>
            </Modal>
          </CardBody>
          <CardFooter />
        </Card>
      </Fragment>
    );
  }
}

export const RequestTable = withRouter(
  ({
    labrequests = [],
    getPendingLabList = [],
    list = [],
    onRequestClick = (f) => f,
    history,
    loading,
  }) => {
    return (
      <>
        {loading && <Loading />}

        {list.length ? (
          <Table bordered striped hover responsive>
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Test</th>
                <th>Last Updated</th>

              </tr>
            </thead>
            <tbody>
              {list.map((req, i) => (
                <tr
                  key={i}
                  onClick={() => {
                    history.push(`/me/lab/process/${req.id}`);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{req._id}</td>
                    <td>{req.test}</td>
                    <td>{moment(req.createdAt).fromNow()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : null}

        {!list.length && <p className="text-center">List is empty.</p>}
      </>
    );
  },
);
