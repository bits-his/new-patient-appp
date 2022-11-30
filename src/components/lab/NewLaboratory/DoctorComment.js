import React, { useEffect, useCallback, useState } from "react";
import { Form, FormGroup, Label, Card, CardBody, CardHeader } from "reactstrap";
import SpeechInput from "../../comp/speech-to-text/SpeechInput";
import { _fetchApi, _postApi } from "../../../redux/actions/api";
import { apiURL } from "../../../redux/actions";
import { useHistory, useLocation, useRouteMatch } from "react-router";
import Loading from "../../comp/components/Loading";
import CustomButton from "../../comp/components/Button";
import { _customNotify } from "../../utils/helpers";
import {
  DOCTOR_COMMENT,
  refreshHistoryList,
  refreshPendingList,
} from "../labRedux/actions";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaTimes } from "react-icons/fa";
// import MicrobiologyLabTestResult from "./MicroBiology/MicrobiologyTestResult";
import { getDocLabCommission } from "../../../redux/actions/lab";

import SampleForm from "./SampleForm";
import LabComments from "../components/LabComments";
import LabTestAnalysisResultTable from "./LabTestAnalysisResultTable";
import MicrobiologyAnalysisResult from "./analysis/MicrobilogyAnalysisResult";
import { useQuery } from "../../../hooks";
import moment from "moment";

export default function DoctorComment() {
  const history = useHistory();
  const location = useLocation();
  const query = useQuery();
  const isReadOnly = query.get("view");
  const isHistory = location.pathname.includes("history");
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const labno = match.params.labno;
  const patientId = match.params.patientId;
  const request_id = query.get('request_id')
  const department = match.params.department;
  const user = useSelector((state) => state.auth.user);
  const today = moment().format("YYYY-MM-DD");
  // const user_department = useSelector((state) => state.auth.user.department);

  const [patientInfo, setPatientInfo] = useState({});
  const [labs, setLabs] = useState([]);
  const [labReceipt, setLabReceipt] = useState()
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [departmentHead, setDepartmentHead] = useState("");
  const [comments, setComments] = useState([]);
  const [doctorComment, setDoctorComment] = useState("");
  const [editting, setEditting] = useState(false);
  const [commission, setCommission] = useState(0);
  const [showCommission, setShowCommission] = useState(false);

  const _getLabReceipt =(receiptNo) => {
    _fetchApi(
      `${apiURL()}/lab/get-lab-receipt/${receiptNo}`,
      (data) => {
        if (data.success) {
          setLabReceipt(data.results)
        }
      },
      (err) => console.log(err),
    )
  }

  const getPatientLabInfo = useCallback(
    () => {
      _fetchApi(
        `${apiURL()}/lab/request/history/${patientId}/${labno}/${request_id}`,
        (data) => {
          if (data.success) {
            setPatientInfo(data.results[0]);
          }
        },
        (err) => console.log(err)
      );
    },
    [patientId, request_id,labno]
  );

  const getAnalyzedTest = useCallback(
    () => {
      setLoading(true);
      _fetchApi(
        `${apiURL()}/lab/request/analyzed/${labno}/${department}`,
        (data) => {
          // console.log(data);
          setLoading(false);
          if (data.success) {
            let _data = data.results;
            setLabs(_data);
            if (_data.length) {
              setDepartmentHead(_data[0].department_head);
            }
            if (_data.length) {
              let commissionList = [];
              _data.forEach((item) => {
                if (item.commission_type === "fixed") {
                  commissionList.push(item.percentage);
                } else if (item.commission_type === "percentage") {
                  commissionList.push(
                    parseFloat(item.old_price) *
                      (parseFloat(item.percentage) / 100)
                  );
                }
              });
              // console.log(commissionList)
              let totalCommission = commissionList.reduce(
                (a, b) => parseFloat(a) + parseFloat(b),
                0
              );
              setCommission(totalCommission);
            }

            // console.log(data.results)
            // if (data.results.length) {
            // setDepartment(data.results[0].department);
            // console.log(data.results[0])
            // }
          }
        },
        (err) => {
          setLoading(false);
          console.log(err);
        }
      );
    },
    [labno, department]
  );

  const getComments = useCallback(
    () => {
      _fetchApi(
        `${apiURL()}/lab/comment/${labno}`,
        (data) => {
          if (data.success) {
            setComments(data.results);
          }
        },
        (err) => console.log(err)
      );
    },
    [labno]
  );

  const submitDoctorComment = () => {
    setSubmitting(true);
    let newList = [];
    let commissionData = [];
    labs.forEach((item) => {
      let item_commission = 0;
      
      // if(item.selectable ==="not allowed"){

      // }
      // else 
      if (item.commission_type === "fixed") {
        item_commission = item.percentage;
      } else if (item.commission_type === "percentage") {
        item_commission =
          parseFloat(item.old_price) * (parseFloat(item.percentage) / 100);
      }
      newList.push(item.test);
      commissionData.push([
        user.username,
        item.description,
        item_commission,
        0,
        item.booking_no,
        "",
        user.facilityId,
        today,
      ]);
    });
    let data = {
      labno,
      patientId,
      comment: doctorComment,
      department,
      tests: newList,
      amount: isHistory ? 0 : commission,
      commissionData,
    };

    _postApi(
      `${apiURL()}/lab/comment/doctors/new`,
      data,
      () => {
        setSubmitting(false);
        dispatch(getDocLabCommission());
        _customNotify("Comment Saved!");
        history.push("/me/lab/doctor-comment");
        dispatch(refreshPendingList(DOCTOR_COMMENT, department));
        dispatch(refreshHistoryList(DOCTOR_COMMENT, department, null, null));
      },
      (err) => {
        setSubmitting(false);
        console.log(err);
      }
    );
  };

  // const getDocFee = () => {

  // }

  useEffect(
    () => {
      console.log("seeing them now", patientId, labno);
      if (patientId && labno) {
        getPatientLabInfo();
        getAnalyzedTest();
        getComments();


      }
    },
    [getPatientLabInfo, getComments, getAnalyzedTest, patientId, labno]
  );

  const editResult = () => {
    setEditting(true);
  };

  const toggleCommission = () => setShowCommission((p) => !p);

  return (
    <Card>
      <CardHeader className="d-flex flex-row justify-content-between align-items-center">
        <h6>Lab No.: {labno}</h6>
        <div>
          {showCommission ? (
            <span className="h6">Doctor's Fee: ₦{commission}</span>
          ) : null}
          {showCommission ? (
            <span className="btn btn-link" onClick={toggleCommission}>
              Hide
            </span>
          ) : (
            <span className="btn btn-link" onClick={toggleCommission}>
              Show commission
            </span>
          )}
        </div>
        <CustomButton color="danger" size="sm" onClick={() => history.goBack()}>
          <FaTimes color="#fff" size="16" className="mr-1" />
          Close
        </CustomButton>
      </CardHeader>
      <CardBody>
        <SampleForm
          labNoMode={false}
          labno={labno}
          patientInfo={patientInfo}
          historyMode="read"
          // showConsultant
          otherInfo={{ label: "Sample Analyzed", key: "analyzed_at" }}
          showPast={true}
        />
        {loading && <Loading />}
        {/* {JSON.stringify(labs)} */}
        <div className="d-flex flex-direction-row justify-content-between my-2">
          <h5>Department: {departmentHead}</h5>
          {isReadOnly ? null : !editting ? (
            <button className="btn btn-sm btn-success" onClick={editResult}>
              <FaEdit size="16" className="mr-1" />
              Edit Result
            </button>
          ) : (
            <button
              className="btn btn-sm btn-danger"
              onClick={() => setEditting(false)}
            >
              <FaTimes size="16" className="mr-1" />
              Cancel edit
            </button>
          )}
        </div>

        {/* {labno} */}

        {departmentHead === "Chemical Pathology" ||
        departmentHead === "Hematology" ? (
          <LabTestAnalysisResultTable
            patientId={patientId}
            labno={labno}
            department={department}
            // getResults={getAnalyzedTest}
            editting={editting}
            toggleEdit={() => setEditting((p) => !p)}
            // labs={labs}
            isHistory={isHistory}
            isDoctor={true}
          />
        ) : departmentHead === "Microbiology" ? (
          // <MicrobiologyLabTestResult
          // edit={editting}
          // labs={labs}
          // toggleEdit={() => setEditting((p) => !p)}
          // />
          <MicrobiologyAnalysisResult
            isEditting={editting}
            labno={labno}
            test={labs[0].test}
            isDoctor={true}
            isHistory={isHistory}
            // labs={labs}
            toggleEdit={() => setEditting((p) => !p)}
          />
        ) : departmentHead === "Radiology" ? (
          <LabTestAnalysisResultTable
            patientId={patientId}
            labno={labno}
            department={department}
            // submitCb={submitCb}
            // getResults={getAnalyzedTest}
            editting={editting}
            labs={labs}
            toggleEdit={() => setEditting((p) => !p)}
          />
        ) : null}

        <LabComments
          editable={!isReadOnly}
          getComment={getComments}
          comments={comments}
        />

        {comments.length ? null : (
          <Form>
            {/* {JSON.stringify({patientInfo,labs})} */}
            <FormGroup>
              <Label className="font-weight-bold">
                {departmentHead === "Chemical Pathology" ||
                departmentHead === "Hematology"
                  ? "Pathologist Comment"
                  : departmentHead === "Microbiology"
                  ? "Microbiologist Comment"
                  : departmentHead === "Radiology"
                  ? "Radiologist Comment"
                  : "Doctor's Comment"}
              </Label>

              <SpeechInput
                type="textarea"
                onInputChange={(text) => setDoctorComment(text)}
                value={doctorComment}
              />
            </FormGroup>
          </Form>
        )}
        {isReadOnly ? null : (
          <center>
            <CustomButton
              loading={submitting}
              // onClick={isHistory ? submitDoctorComment : updateComment}
              onClick={submitDoctorComment}
            >
              {isHistory ? "Update Report" : "Submit Report"}
            </CustomButton>
          </center>
        )}
      </CardBody>
    </Card>
  );
}
