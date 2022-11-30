import React, { useState, useCallback, useEffect } from "react";
import { CardBody, Card } from "reactstrap";
// import SpeechInput from "../../../comp/speech-to-text/SpeechInput";
import BackButton from "../../../comp/components/BackButton";
import Loading from "../../../comp/components/Loading";
import SampleForm from "../SampleForm";
import { useRouteMatch, useLocation } from "react-router";
import { useQuery } from "../../../../hooks";
import { _fetchApi } from "../../../../redux/actions/api";
import { apiURL, DICOM_CLIENT_WEB_URL } from "../../../../redux/actions";
// import CustomButton from "../../../comp/components/Button";
// import LabComments from "../../components/LabComments";
import RadiologyReport from "./RadiologyReport";


export default function RadiologyAnalysis() {
  let query = useQuery();
  const match = useRouteMatch();
  const location = useLocation();
  // const history = useHistory();
  const view = query.get("view");
  const request_id = query.get('request_id')
  const pageIsCardiology = location.pathname.includes('cardiology')
  const pageType = pageIsCardiology ? 'cardiology':'radiology'

  const labno = match.params.labno;
  const patientId = match.params.patientId;
  // const isHistory = location.pathname.includes("history");
  // const userRole = useSelector((state) => state.auth.user.role);
  // const isDoctor = userRole === "Doctor";

  const [patientInfo, setPatientInfo] = useState({});
  const [labs, setLabs] = useState([]);
  const [comments, setComments] = useState([]);
  const [loadingAnalysis,setLoadingAnalysis] = useState(false)
  // const [newComment, setNewComment] = useState("");
  // const [images, setImages] = useState([]);

  const getComments = useCallback(
    () => {
      _fetchApi(`${apiURL()}/lab/comment/${labno}`, (data) => {
        // _fetchApi(`${apiURL()}/lab/comment/${labno}/radiology`, (data) => {
        if (data.success) {
          setComments(data.results);
        }
      });
    },
    [labno]
  );

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
    [patientId, request_id, labno]
  );

  const getPendingAnalysis = useCallback(
    () => {
      setLoadingAnalysis(true)
      _fetchApi(
        `${apiURL()}/lab/collected/${labno}/${pageType}`,
        (data) => {
          setLoadingAnalysis(false)
          if (data.success) {
            setLabs(data.results);
          }
        },
        (err) => {
          setLoadingAnalysis(false)
          console.log(err);
        }
      );
    },
    [labno]
  );

  useEffect(
    () => {
      getPatientLabInfo();
      getPendingAnalysis();
      getComments();
    },
    [getPatientLabInfo, getPendingAnalysis, getComments]
  );

  const description = labs.length && labs[0].description;
  const sop_uid = labs.length && labs[0].sop_instance_id;

  const openViewer = () => {
    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=1000,height=1000,left=-500,top=350`;
    window.open(
      `${DICOM_CLIENT_WEB_URL}/viewer/${sop_uid}`,
      "DICOM Viewer",
      params
    );
  };

  
  return (
    <>
      <BackButton />
      <Card>
        <CardBody>
          <SampleForm
            labno={labno}
            patientInfo={patientInfo}
            historyMode="read"
            // history={patientInfo.history}
          />
          {/* {JSON.stringify(request_id)} */}
        {loadingAnalysis && <Loading />}
          <div 
            className="text-left d-flex flex-direction-row justify-content-between mt-1"
          >
            <h6 className="font-weight-bold">{description}</h6>
            <button
              className="btn btn-dark"
              onClick={openViewer}
              disabled={!(sop_uid && sop_uid !== "")}
            >
              {/* <BsImage className="mr-2 text-white" />  */}
              Open DICOM Viewer
            </button>
          </div>

          <RadiologyReport 
            lab={labs.length && labs[0]}
            request_id={request_id} 
            viewOnly={view}
            comments={comments}
            getComments={getComments}
          />
        </CardBody>
      </Card>
    </>
  );
}
