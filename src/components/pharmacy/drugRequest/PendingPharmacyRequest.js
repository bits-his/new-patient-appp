import React, { useCallback, useEffect, useState } from "react";
import { Card, Button, CardBody, Input, Table, CardHeader } from "reactstrap";
import { Scrollbars } from "react-custom-scrollbars";
import Notifications from "react-notify-toast";
import moment from "moment";
// import { _fetchData } from '../utils/helpers'
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getPendingPharmacyRequests } from "../../../redux/actions/pharmacy";
import Loading from "../../comp/components/Loading";
import DaterangeSelector from "../../comp/components/DaterangeSelector";
// import { SET_PENDING_PHARMACY_REQUEST } from '../../redux/actions/actionTypes'

export default function PendingPharmacyRequest() {
  // const [modal, setModal] = useState(false);
  const today = moment().format("YYYY-MM-DD");
  // const last_week = moment(today, "YYYY-MM-DD")
  //   .add(-7, "days")
  //   .format("YYYY-MM-DD");
  const [dateInfo, setDateInfo] = useState({ from: today, to: today });

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  // const [pendingPatientRequests, setPendingPatientRequests] = useState([]);
  // const [currentDrug, setCurrentDrug] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [error] = useState("");

  const list = useSelector((state) => state.pharmacy.pendingPharmRequest);
  const handleChange = ({ target: { name, value } }) => {
    setDateInfo((p) => ({ ...p, [name]: value }));
  };
  const chageData = useCallback(() => {
    setLoading(true);
    dispatch(
      getPendingPharmacyRequests(
        { status: "request", from: dateInfo.from, to: dateInfo.to },
        () => setLoading(false),
        () => setLoading(false),
        getPendingPharmacyRequests
      )
    );
  }, [getPendingPharmacyRequests, dateInfo]);
  useEffect(() => {
    chageData();
  }, [chageData]);

  // const toggle = () => {
  //   setModal(!modal);
  // };

  // const onPrescriptionClick = (patient) => {
  //   this.props.getDetails(currentDrug, patient);
  //   setCurrentDrug(currentDrug);
  // };

  //  const dispenseDrugs = drugs => {
  //     _customNotify('Drug(s) dispensed successfully!');
  //     toggle();
  //     console.log(drugs);
  //   };

  const onSearchTermChange = (searchTerm) => {
    setSearchTerm(searchTerm);
  };
  const history = useHistory();

  return (
    <>
      {/* {JSON.stringify(list)} */}
      <div className=" ">
        <Notifications options={{ zIndex: 200, top: "50px" }} />
        <Card className="border-secondary">
          <CardHeader className="h6 text-center py-2">
            Pending Pharmacy Requests
          </CardHeader>

          <CardBody className="p-1">
            <DaterangeSelector
              from={dateInfo.from}
              to={dateInfo.to}
              handleChange={handleChange}
              gap={false}
            />
            <Input
              placeholder="Search request by patient's name"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
            />
            <div style={{ height: "65vh" }} className="my-1">
              <Scrollbars>
                {loading && <Loading />}
                {!list.length && (
                  <p className="alert alert-primary text-center">
                    <em>No record found</em>
                  </p>
                )}
                {list.length ? (
                  <Table bordered striped hover responsive size="sm">
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Requests</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((patient, i) => (
                        <tr
                          key={i}
                          onClick={() =>
                            history.push(
                              `/me/pharmacy/drug-sales/view/${patient.patient_id}?request_id=${patient.request_id}`
                            )
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <td>
                            {patient.name} ({patient.patient_id})
                          </td>
                          <td>
                            <Button>{patient.count}</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : null}
              </Scrollbars>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
