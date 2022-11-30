import React, { useState } from "react";
import { CardBody, Card, CardHeader } from "reactstrap";
// import BackButton from "../../../comp/components/BackButton";
import SampleForm from "../SampleForm";
import { useRouteMatch, useHistory, useLocation } from "react-router";
import { _fetchApi } from "../../../../redux/actions/api";
import { apiURL } from "../../../../redux/actions";
import { useEffect } from "react";
import { useCallback } from "react";
// import { _customNotify } from "../../../utils/helpers";
import CustomButton from "../../../comp/components/Button";
// import {
//   refreshPendingList,
//   MICRO_SAMPLE_ANALYSIS,
//   refreshHistoryList,
// } from "../../labRedux/actions";
// import { useDispatch, useSelector } from "react-redux";
// import SusceptibilityTest from "./SusceptibilityTest";
import { FaEdit, FaTimes } from "react-icons/fa";
import MicrobiologyAnalysisResult from "../analysis/MicrobilogyAnalysisResult";
import { useQuery } from "../../../../hooks";
import BackButton from "../../../comp/components/BackButton";

// import LabComments from '../../components/LabComments';

export default function NewMicroBiology() {
  const match = useRouteMatch();
  const location = useLocation();
  const isHistory = location.pathname.includes("history");
  const labno = match.params.labno;
  const patientId = match.params.patientId;
  const test = match.params.test;
  const history = useHistory();
  let query = useQuery();
  const view = query.get("view");
  const request_id = query.get('request_id')

  // const [sensitivityList, setSensitivityList] = useState([]);
  // const [sensitivities, setSensitivities] = useState([]);
  const [patientInfo, setPatientInfo] = useState({});
  // const [labs, setLabs] = useState([]);
  const [currTest, setCurrTest] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [isEditting, setEditting] = useState(false);
  // const [comments, setComments] = useState([]);

  useEffect(
    () => {
      if (isHistory) {
        setEditting(false);
      } else {
        setEditting(true);
      }
    },
    [isHistory]
  );

  // const getComments = useCallback(
  //   () => {
  //     _fetchApi(`${apiURL()}/lab/comment/${labno}`, (data) => {
  //       // _fetchApi(`${apiURL()}/lab/comment/${labno}`, (data) => {
  //       if (data.success) {
  //         setComments(data.results);
  //       }
  //     });
  //   },
  //   [labno]
  // );

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
    [patientId, labno, request_id]
  );

  const getPendingAnalysis = useCallback(
    () => {
      _fetchApi(
        `${apiURL()}/lab/collected/${labno}/microbiology`,
        (data) => {
          if (data.success) {
            // setLabs(data.results);
            // let res = data.results.find((i) => i.test === test);
            // alert(JSON.stringify(data.results, test))
            // if (res) {
            setCurrTest(data.results);
            // }
          }
        },
        (err) => {
          console.log(err);
        }
      );
    },
    [labno]
  );

  // const handleSensitivityChange = (key, item) => {
  //   if (
  //     sensitivities.findIndex((i) => i.antibiotic === item.antibiotic) !== -1
  //   ) {
  //     let newList = [];
  //     sensitivities.forEach((s) => {
  //       if (s.antibiotic === item.antibiotic) {
  //         newList.push({ ...s, isolates: key });
  //       } else {
  //         newList.push(s);
  //       }
  //     });
  //     setSensitivities(newList);
  //   } else {
  //     // let sss = sensitivities.find((i) => i.antibiotic === item.antibiotic)
  //     // if (sss.isolates === key) {
  //     //   console.log('same value, invert?')
  //     //   setSensitivities((p) =>
  //     //     p.filter((j) => j.antibiotic !== item.antibiotic)
  //     //   );
  //     // } else {
  //     let newSensitivity = { ...item, isolates: key };
  //     setSensitivities((p) => [...p, newSensitivity]);
  //     // }
  //   }
  // };

  useEffect(
    () => {
      getPatientLabInfo();
      getPendingAnalysis();
      // getComments();
    },
    [getPatientLabInfo, getPendingAnalysis, test]
  );

  // data: [],

  // const resetTextArea = () => {
  //   this.setState({
  //     appearanceM: '',
  //     microscopyS: '',
  //     cultureY: '',
  //     others: '',
  //   });
  // };

  // const checkChecked = (type, item) => {
  //   // let result = null;
  //   // sensitivities.forEach((i) => {
  //   //   // if (i.antibiotic === item.antibiotic) {
  //   //   //   if (i[type] === '1') {
  //   //   //     result = true;
  //   //   //   } else {
  //   //   //     result = false;
  //   //   //   }
  //   //   // } else {
  //   //   //   result = false;
  //   //   // }
  //   // });
  //   // return result;
  //   // console.log(type, item)
  //   let rItem = sensitivities.find((i) => i.antibiotic === item.antibiotic);
  //   if (rItem) {
  //     if (rItem[type] === "1") {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } else {
  //     return false;
  //   }
  // };

  let selected = currTest && currTest.length ? currTest[0] : {};

  return (
    <>
    {/* <BackButton/> */}
      <Card>
        <CardHeader className="d-flex flex-row justify-content-between align-items-center">
          <h5>Microbiology Analysis</h5>
          <CustomButton
            color="danger"
            size="sm"
            onClick={() => history.goBack()}
          >
            <FaTimes color="#fff" size="16" className="mr-1" />
            Close
          </CustomButton>
        </CardHeader>
        <CardBody>
          <SampleForm
            labno={labno}
            patientInfo={patientInfo}
            historyMode="read"
            history={patientInfo.history}
            otherInfo={{
              label: "Sample Collected",
              value: selected && selected.sample_collected_at,
            }}
          />
          {/* {JSON.stringify(currTest)} */}
          <div className="d-flex flex-row justify-content-between mb-2">
            {/*<div>
              <h5>Investigation: {selected.description}</h5>
              {selected && selected.specimen ? (
                <h6>Specimen: {selected.specimen}</h6>
              ) : null}
            </div>*/}
          {/* <AllDepartment /> */}
            {view
              ? null
              : isHistory &&
                !isEditting && (
                  <div>
                    {isEditting ? (
                      <CustomButton
                        color="danger"
                        size="sm"
                        onClick={() => setEditting(false)}
                      >
                        <FaTimes className="mr-1" /> Close
                      </CustomButton>
                    ) : (
                      <CustomButton size="sm" onClick={() => setEditting(true)}>
                        <FaEdit className="mr-1" /> Edit
                      </CustomButton>
                    )}
                  </div>
                )}
          </div>
          {/* {currTest.description === "MALARIA PARASITES" ? 
                <Form>
                  <FormGroup>
                    <Label>Result</Label>
                    <Textarea />

                  </FormGroup>
                </Form>  */}
{/* ======================================= */}
          <MicrobiologyAnalysisResult
            isEditting={isEditting}
            labno={labno}
            test={test}
            isHistory={isHistory}
            toggleEdit={() => setEditting((p) => !p)}
            resultsNew={currTest}
          />
        </CardBody>
      </Card>
    </>
  );
}
