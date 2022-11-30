import React, { useEffect, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { Badge, Card, CardBody, CardHeader } from "reactstrap";
import moment from "moment";
import { apiURL } from "../../../../redux/actions";
import { _fetchApi2 } from "../../../../redux/actions/api";
import CustomTable from "../../../comp/components/CustomTable";
import Loading from "../../../comp/components/Loading";
import CustomButton from "../../../comp/components/Button";
import BackButton from "../../../comp/components/BackButton";

const VisitList = () => {
  //   const query = useQuery();
  //   const patientId = query.get("patientId");
  const { patientId } = useParams();
  const history = useHistory();
  const user = useSelector((state) => state.auth.user);
  const facilityId = user.facilityId;

  const [loading, setLoading] = useState(false);
  const [patientLabs, setPatientLabs] = useState([]);

  const getAllLabTests = useCallback(
    () => {
      setLoading(true);
      _fetchApi2(
        `${apiURL()}/lab/completed-lab-tests/${facilityId}?query_type=select&patient_id=${patientId}`,
        (data) => {
          setLoading(false);
          if (data.results) {
            setPatientLabs(data.results);
          }
        },
        (err) => {
          setLoading(false);
          console.log(err);
        }
      );
      // if (patientId) {
      //   setLoading(true);

      //   dispatch(getPatientLabTests(patientId, () => setLoading(false)));
      // }
    },
    [patientId, facilityId]
  );

  useEffect(
    () => {
      getAllLabTests();
    },
    [getAllLabTests]
  );

  const fields = [
    {
      title: "Visit Date",
      custom: true,
      component: (i) => (
        <span>{moment.utc(i.created_at).format("DD/MM/YYYY")}</span>
      ),
    },
    { title: "Lab No.", value: "booking_no" },
    { title: "Department", value: "department_head" },
    // {
    //   title: "Status",
    //   custom: true,
    //   component: (item) => {
    //     let isCompleted = item.tests === item.completed;
    //     return (
    //       <div className="text-center">
    //         <Badge color={isCompleted ? "success" : "warning"}>
    //           {isCompleted ? "Completed" : "Pending"}
    //         </Badge>
    //         {item.tests}/{item.completed}
    //       </div>
    //     );
    //   },
    // },
    {
      title: "Action",
      custom: true,
      component: (item) => (
        <div className="text-center">
          <CustomButton
            size="sm"
            onClick={() => {
            //   if (item.tests === item.completed) {
            //     history.push(
            //       `/me/lab/doctor-comment/past-patient-visit/completed/${
            //         item.patient_id
            //       }/${item.booking_no}`
            //     );
            //   } else {
                history.push(
                  `/me/lab/doctor-comment/past-patient-visit/uncompleted/${
                    item.patient_id
                  }/${item.booking_no}`
                );
            //   }
            }}
          >
            View Visit Details
          </CustomButton>
        </div>
      ),
    },
  ];

  return (
    <>
      <BackButton />
      <Card>
        <CardHeader className="h5">Past Patient Visits</CardHeader>
        <CardBody className="px-0">
          {loading && <Loading />}
          {/* {"booking_no":"0521845","receiptNo":"1705219458",
        "patient_id":"1-117","created_at":"2021-05-17T08:55:39.000Z",
        "department":"3000","tests":1,"completed":16 */}
          {/* {JSON.stringify()} */}
          {/* {JSON.stringify(patientLabs)} */}
          <CustomTable bordered size="sm" fields={fields} data={patientLabs} />
        </CardBody>
      </Card>
    </>
  );
};

export default VisitList;
