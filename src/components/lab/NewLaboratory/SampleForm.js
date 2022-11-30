import React from "react";
import SpeechInput from "../../comp/speech-to-text/SpeechInput";
// import { useLocation } from 'react-router';
import { Row, Label, FormGroup, Col } from "reactstrap";
import { useSelector } from "react-redux";
import { getAgeFromDOB } from "../../utils/helpers";
// import { _fetchApi } from "../../../redux/actions/api";
// import { apiURL } from "../../../redux/actions";
// import { FaHistory } from "react-icons/fa";
// import CustomButton from "../../comp/components/Button";
import SampleLog from "./SampleLog";
import CustomButton from "../../comp/components/Button";
import { useHistory } from "react-router";
import { useQuery } from "../../../hooks";
import BackButton from "../../comp/components/BackButton";

export default function SampleForm({
  labno = "",
  patientInfo = {},
  handleHistoryChange = (f) => f,
  historyMode = "read",
  labNoMode = "read",
  history,
  showConsultant = false,
  otherInfo = null,
  showPast = false,
  // showLabNo=true
  // parameter = 'sample_collected_at'
}) {
  const query = useQuery();
  let user = useSelector((state) => state.auth.user);
  const hist = useHistory();
  const code = query.get("code");
  // const [sampleHistory, setSampleHistory] = useState([]);
  // const [popIspen, setPopIsOpen] = useState(false);

  // const getSampleHistory = useCallback(
  //   () => {
  //     _fetchApi(
  //       `${apiURL()}/lab/sample/history/${labno}`,
  //       (data) => {
  //         // console.log(data);
  //         if (data.results.length) {
  //           setSampleHistory(data.results[0]);
  //         }
  //       },
  //       (err) => {
  //         console.log(err);
  //       }
  //     );
  //   },
  //   [patientInfo.patient_id, labno]
  // );

  // useEffect(() => {
  //   getSampleHistory();
  // }, []);

  // const toggle = () => setPopIsOpen((d) => !d);

  const hideHistory = historyMode === "hide";

  const viewPatientHistory = () => {
    hist.push(`/me/lab/doctor-comment/past-patient-visit/${patientInfo.id}`);
  };

  return (
    <>
    {/* <BackButton/> */}
      {/* {JSON.stringify(history)} */}
      {/* {JSON.stringify(patientInfo)} */}
      <Row>
        {labNoMode === "read" ? (
          <Col md={4}>
            <div>
              <Label className="mr-2 font-weight-bold">Barcode:</Label>
              <Label>{code}</Label>
            </div>
            <div>
              <Label className="mr-2 font-weight-bold">Lab No:</Label>
              <Label>{labno}</Label>
            </div>
            {/* <Label>{labno.split('-').join('')}</Label> */}
          </Col>
        ) : null}

        <Col md={4}>
          <FormGroup>
            <Label className="mr-2 font-weight-bold">Name:</Label>
            <Label>{patientInfo.name}</Label>
          </FormGroup>
        </Col>

        <Col md={4}>
          <FormGroup>
            <Label className="mr-2 font-weight-bold">Age:</Label>
            <Label>{getAgeFromDOB(patientInfo.dob, "YM")}</Label>
            {/* <Label>{moment().diff(patientInfo.dob, "years")}</Label> */}
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label className="mr-2 font-weight-bold">Gender:</Label>
            <Label>{patientInfo.gender}</Label>
          </FormGroup>
        </Col>
        {showConsultant ? (
          <Col md={4}>
            <FormGroup>
              <Label className="mr-2 font-weight-bold">Consultant:</Label>
              <Label>{`${user.firstname} ${user.lastname}`}</Label>
            </FormGroup>
          </Col>
        ) : null}

        {hideHistory ? null : (
          <Col md={4}>
            <Label className="mr-2 font-weight-bold">Clinical History:</Label>
            {historyMode === "read" ? (
              <Label> {patientInfo.history}</Label>
            ) : (
              <SpeechInput
                value={patientInfo.history}
                onInputChange={(text) => handleHistoryChange(text)}
                tag="textarea"
              />
            )}
          </Col>
        )}

        {otherInfo ? (
          <Col md={hideHistory ? 12 : 4}>
            {/* <Button id="PopoverFocus" type="button" onClick={toggle}>
                    Check Sample History
                  </Button> */}
            {/* {JSON.stringify(patientInfo)} */}
            <SampleLog
              label={otherInfo.label}
              _key={otherInfo.key}
              labno={labno}
              patient_id={patientInfo.id}
            />
          </Col>
        ) : null}
        {showPast && (
          <Col>
            <CustomButton size="sm" onClick={viewPatientHistory}>
              View Patient Previous Visits
            </CustomButton>
          </Col>
        )}
      </Row>
      <hr />
    </>
  );
}