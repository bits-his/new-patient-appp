import React, { lazy, Suspense } from "react";
import { useLocation, useRouteMatch } from "react-router";
import { useState } from "react";
import { useEffect } from "react";
import {  _fetchApi2 } from "../../redux/actions/api";
import { apiURL } from "../../redux/actions";
import { useCallback } from "react";
import { Card, Row, Col } from "reactstrap";
// import PatientForm from '../PatientForm';
import BackButton from "../comp/components/BackButton";
import { useSelector } from "react-redux";
import Loading from "../comp/components/Loading";
import LabView from "./NewLaboratory/analysis/LabView";
import {
//   getCompletedTests,
//   getUncompletedTests,
splitTestsByView
} from "./NewLaboratory/analysis/helpers";
// import moment from "moment";

import Preview from "./completed-labs-view/Preview";
import MenuBar from "./completed-labs-view/MenuBar";
import { useQuery } from "../../hooks";
const SampleForm = lazy(() => import("./NewLaboratory/SampleForm"));
// const LabComments = lazy(() => import("./components/LabComments"));

export const RECEIPT_PREVIEW = "RECEIPT_PREVIEW";
export const SAMPLE_DETAILS_PREVIEW = "SAMPLE_DETAILS_PREVIEW";
export const BARCODE_PREVIEW = "BARCODE_PREVIEW";

function PatientViewCompletedLabResults() {
  const match = useRouteMatch();
  const location = useLocation();
  const labNo = match.params.labNo;
  const query = useQuery();
  const request_id = query.get("request_id");
  const facilityId = query.get("facilityId");
  const isCompleted = !location.pathname.includes("uncompleted");
  const isDoctorInterface = location.pathname.includes("doctor-comment");
  const isPatientInterface = location.pathname.includes("result-index");
  const patientId = match.params.patientId;
  const facilityInfo = useSelector((state) => state.facility.info);

  const [listLoading, setListLoading] = useState(false);
  // const [labInfo, setLabInfo] = useState([]);
  const [rawList, setRawList] = useState([]);
  const [requestList, setRequestList] = useState([]);
  const [sampleDetails, setSampleDetials] = useState([]);
  const [patientInfo, setPatientInfo] = useState({});
  const [departmentHead, setDepartmentHead] = useState("");
  const [comments, setComments] = useState([]);

//   const [labs, setLabs] = useState([]);
  const [tabledLabs, setTabledLabs] = useState([]);
  const [tabledLabsList, setTabledLabsList] = useState([]);
  const [inputLabs, setInputLabs] = useState([]);
  const [microbiology, setMicrobiologyLabs] = useState([]);
  const [hoWidalLabs, setHOWidalLabs] = useState({});
  const [hoWidalLabsList, setHOWidalLabsList] = useState([]);
  const [tabledWithResultLabs, setTabledWithResultLabs] = useState([]);
  const [tabledWithResultLabsList, setTabledWithResultLabsList] = useState([]);
  const [macroscopy, setMacroscopyLabs] = useState([]);

//   const [printers, setPrinters] = useState([]);
//   const [selectedPrinter, setSelectedPrinter] = useState("");

  // const [preview, setPreview] = useState(false);
  const [labReceipt, setLabReceipt] = useState([]);
  // const [previewCode, setPreviewCode] = useState(false);
  // const [previewSample, setPreviewSample] = useState(false);
  const [previewMode, setPreviewMode] = useState(null);

  let previewIsReceipt = previewMode === RECEIPT_PREVIEW;
  let previewIsSampleDetails = previewMode === SAMPLE_DETAILS_PREVIEW;
  let previewIsBarcode = previewMode === BARCODE_PREVIEW;

  const getPatientLabInfo = useCallback(
    () => {
      _fetchApi2(
        `${apiURL()}/lab/request/history/${patientId}/${labNo}/${request_id}/${facilityId}`,
        (data) => {
          if (data.success) {
            setPatientInfo(data.results[0]);
          }
        },
        (err) => console.log(err)
      );
    },
    [patientId, request_id, labNo, facilityId]
  );

  function _getCompletedTests(
    labNo,
    callback = (f) => f,
    error = (f) => f
  ) {
    _fetchApi2(
      `${apiURL()}/lab/lab-results/${labNo}/${facilityId}`,
      (data) => {
        if (data.success) {
          let _data = splitTestsByView(data.results);
          callback(_data, data.results);
        }
      },
      (err) => {
        error(err);
        console.log(err);
      }
    );
  }

  const getTestInfo = useCallback(
    () => {
      setListLoading(true);
      _getCompletedTests(
        labNo,
        (resp, raw) => {
          // console.log(resp, "========><========><========")
          setListLoading(false);
          setTabledLabs(resp._tabledLab);
          setTabledLabsList(resp._tabledLabList);
          setInputLabs(resp.inputList);
          setMicrobiologyLabs(resp.microbiology);
          setHOWidalLabs(resp._hoWidalLabs);
          setHOWidalLabsList(resp._hoWidalLabsList);
          setMacroscopyLabs(resp.macroscopyList);
          setTabledWithResultLabs(resp._tabledWithResultLab);
          setTabledWithResultLabsList(resp._tabledWithResultLabList);

        //   setLabs(resp.otherList);
          setRawList(raw);
          setDepartmentHead(raw[0] && raw[0].test_group);
        },
        (err) => {
          setListLoading(false);
          console.log(err);
        }
      );
    },
    [labNo]
  );

  function getUncompletedTests(
    labNo,
    callback = (f) => f,
    error = (f) => f
  ) {
    _fetchApi2(
      `${apiURL()}/lab/lab-results/uncompleted/${labNo}/${facilityId}`,
      (data) => {
        if (data.success) {
          let _data = splitTestsByView(data.results);
          callback(_data, data.results);
        }
      },
      (err) => {
        error(err);
        console.log(err);
      }
    );
  }

  const getUncompletedTestsInfo = useCallback(
    () => {
      setListLoading(true);

      getUncompletedTests(
        labNo,
        (resp, raw) => {
          // console.log(resp, "========><========><========")
          setListLoading(false);
          setTabledLabs(resp._tabledLab);
          setTabledLabsList(resp._tabledLabList);
          setInputLabs(resp.inputList);
          setMicrobiologyLabs(resp.microbiology);
          setHOWidalLabs(resp._hoWidalLabs);
          setHOWidalLabsList(resp._hoWidalLabsList);
          setMacroscopyLabs(resp.macroscopyList);
          setTabledWithResultLabs(resp._tabledWithResultLab);
          setTabledWithResultLabsList(resp._tabledWithResultLabList);

        //   setLabs(resp.otherList);
          // console.log(raw)
          setRawList(raw);
          setDepartmentHead(raw[0] && raw[0].test_group);
        },
        (err) => {
          console.log(err);
          setListLoading(false);
        }
      );
    },
    [labNo]
  );

  const getRequestList = () => {
    _fetchApi2(
      `${apiURL()}/lab/get-labs-by-condition?query_type=by_req_id&condition=${request_id}&facilityId=${facilityId}`,
      (data) => {
        if (data && data.results) {
          // let tt = getTestsToConsider(data.results)
          setRequestList(data.results);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const getComments = useCallback(
    () => {
      _fetchApi2(
        `${apiURL()}/lab/comment/${labNo}/${facilityId}`,
        (data) => {
          if (data.success) {
            setComments(data.results);
          }
        },
        (err) => console.log(err)
      );
    },
    [labNo]
  );

  let receiptNo = rawList && rawList[0] && rawList[0].receiptNo;
  const _getLabReceipt = useCallback(
    () => {
      _fetchApi2(
        `${apiURL()}/lab/get-lab-receipt/${receiptNo}/${facilityId}`,
        (data) => {
          if (data.success) {
            setLabReceipt(data.results);
          }
        },
        (err) => console.log(err)
      );
    },
    [receiptNo]
  );

  useEffect(
    () => {
      getPatientLabInfo();
      _getLabReceipt();
      if (isCompleted) {
        getTestInfo();
      } else {
        getUncompletedTestsInfo();
      }
      if (request_id) {
        getRequestList();
      }
      getComments();
    },
    [getPatientLabInfo, getTestInfo, getComments, _getLabReceipt]
  );

//   const errorCallback = (errorMessage) => {
//     console.log("Error: " + errorMessage);
//   };

//   const writeToSelectedPrinter = (dataToWrite) => {
//     if (selectedPrinter) {
//       selectedPrinter.send(dataToWrite, undefined, errorCallback);
//     }
//   };

//   const printCode = ({
//     timestamp = "",
//     tests = "",
//     dept = "",
//     sample = "",
//     accNo = "",
//     patientName = "",
//     code = "",
//   }) => {
//     writeToSelectedPrinter(
//       `^XA 
//       ^FO100,12
//       ^A0R,18
//       ^FB180,15,0,L
//       ^FD${tests}^FS
//       ^FO20,10^A0N,20,20^FD${timestamp}^FS
//       ^FO20,35^A0N,20,20^FD${dept} - ${sample}^FS
//       ^FO20,65^A0N,20,20^FD${accNo} /${patientName}^FS
//       ^FO20,95^BY3^BCN,70,,,,A^FD${code}^FS
//       ^XZ`
//     );
//   };

  const getTestsToConsider = () => {
    let testsToConsider = [];
    labReceipt.forEach((item) => {
      let testInRawList = requestList.findIndex(
        (i) => i.description === item.description
      );
      let testInReceipt = requestList.findIndex(
        (j) => j.test_group === item.description
      );

      if (testInRawList !== -1) {
        testsToConsider.push(requestList[testInRawList]);
      } else if (testInReceipt !== -1) {
        let curr = requestList[testInReceipt];
        testsToConsider.push({ ...curr, description: curr.group_head });
      } else {
        console.log("not found");
        // let test = rawList[testInRawList]
        // let head = test.group_head;
        // if(testsToConsider.indexOf(j => j.description === head) === -1) {
        //   testsToConsider.push({...test, description: head })
        // }
      }
    });

    return testsToConsider;
  };

  const onSampleDetailsClick = () => {
    let list = getTestsToConsider();
    setSampleDetials(list);
  };

//   const printBarcode = () => {
//     // console.log(labReceipt)
//     // group_head

//     let testList = getTestsToConsider();

//     // let newL = [];
//     let labelList = [];
//     // rawList.forEach((j) => {
//     //   if (j.group_head.toLowerCase() === "others") {
//     //     if (!newL.includes(j.test)) {
//     //       newL.push(j.test);
//     //     }
//     //   } else {
//     //     if (!newL.includes(j.group_head)) {
//     //       newL.push(j.group_head);
//     //     }
//     //   }
//     // });
//     // let i = rawList[0];

//     testList.forEach((i) => {
//       if (i.noOfLabels > 0) {
//         // console.log('no of labels > 0')
//         if (i.label_type === "single") {
//           // console.log('label_type is single')
//           for (let m = 0; m < i.noOfLabels; m++) {
//             labelList.push({
//               timestamp: `${moment(i.created_at).format("DD")}-${moment(
//                 i.created_at
//               ).format("MM")} (${moment(i.created_at).format("hh:mm")}) - ${
//                 i.booking_no
//               }`,
//               type: "test",
//               tests: i.description,
//               sample: i.specimen,
//               noOfLabels: 1,
//               code: i.code,
//               patientName: patientInfo.name,
//               accNo: patientInfo.id,
//               dept:
//                 i.department.toLowerCase() === "2000"
//                   ? "Hematology"
//                   : i.department.toLowerCase() === "3000"
//                   ? "ChemPath"
//                   : i.department.toLowerCase() === "4000"
//                   ? "Microbiology"
//                   : "Radiology",
//             });
//           }
//         } else {
//           // console.log('label_type is grouped', testList)
//           if (labelList.findIndex((k) => k.group === i.group_head) !== -1) {
//             // console.log("already contains a label from the same group (dept)");
//             let newLabelList = [];
//             labelList.forEach((j) => {
//               if (j.group && j.group === i.group_head) {
//                 // console.log(j, 'jay jay')
//                 // console.log(j.tests.concat(", ", i.description));
//                 newLabelList.push({
//                   ...j,
//                   tests: j.tests.concat(", ", i.description),
//                 });
//               } else {
//                 newLabelList.push(j);
//               }
//             });
//             labelList = newLabelList;
//           } else {
//             // console.log("first time adding label from this group");
//             labelList.push({
//               timestamp: `${moment(i.created_at).format("DD")}-${moment(
//                 i.created_at
//               ).format("MM")} (${moment(i.created_at).format("hh:mm")}) - ${
//                 i.booking_no
//               }`,
//               type: "test",
//               tests: i.description,
//               sample: i.specimen,
//               noOfLabels: 1,
//               code: i.code,
//               patientName: patientInfo.name,
//               accNo: patientInfo.id,
//               dept:
//                 i.department.toLowerCase() === "2000"
//                   ? "Hematology"
//                   : i.department.toLowerCase() === "3000"
//                   ? "ChemPath"
//                   : i.department.toLowerCase() === "4000"
//                   ? "Microbiology"
//                   : "Radiology",
//               group: i.group_head,
//             });
//           }
//         }
//       }
//     });

//     labelList.forEach((label) => {
//       console.log(label);
//       printCode(label);
//     });
//     // console.log(labelList, testList);
//   };

//   const initBrowserPrint = () => {
//     window.BrowserPrint.getDefaultDevice(
//       "printer",
//       (device) => {
//         // console.log(device)
//         // let selected = device;
//         setSelectedPrinter(device);
//         setPrinters((p) => [...p, device]);

//         window.BrowserPrint.getLocalDevices(
//           (device_list) => {
//             for (var i = 0; i < device_list.length; i++) {
//               //Add device to list of devices and to html select element
//               var device = device_list[i];
//               if (!selectedPrinter || device.uid !== selectedPrinter.uid) {
//                 printers.push(device);
//               }
//             }
//           },
//           () => {
//             console.log("Error getting local devices");
//           },
//           "printer"
//         );
//       },
//       (err) => {
//         console.log("Cannot get default printer", err);
//       }
//     );
//   };

//   useEffect(() => {
//     initBrowserPrint();
//   }, []);

  return (
    <>
      <BackButton />
      <Row>
        <Col md={previewMode ? 6 : 12}>
          <Card body className="bg-white">
            {/* Results for {labNo} */}
            {/* <div>{JSON.stringify(patientInfo)}</div> */}
            {/* <CardBody className="bg-white p-5"> */}
            <Suspense fallback={<Loading />}>
              <SampleForm
                labno={labNo}
                patientInfo={patientInfo}
                historyMode="hide"
              />
            </Suspense>

            {isDoctorInterface || isPatientInterface ? null : (
              <MenuBar
                departmentHead={departmentHead}
                previewIsReceipt={previewIsReceipt}
                setPreviewMode={setPreviewMode}
                previewMode={previewMode}
                listLoading={listLoading}
                previewIsSampleDetails={previewIsSampleDetails}
                previewIsBarcode={previewIsBarcode}
                printBarcode={()=>{}}
                onSampleDetailsClick={onSampleDetailsClick}
              />
            )}

            {listLoading ? <Loading /> : null}
            {/* <p className="font-weight-bold">Department: {departmentHead}</p> */}
            {/* {JSON.stringify({ inputLabs, hoWidalLabs, tabledLabs, microbiology})} */}
            <LabView
              inputLabs={inputLabs}
              microbiology={microbiology}
              macroscopy={macroscopy}
              // isEditting={isEditting}
              // handleResultChange={handleResultChange}
              // handleOthersChange={handleOthersChange}
              // handleSensitivityTableChange={handleSensitivityTableChange}
              // sensitivities={sensitivities}
              tabledLabs={tabledLabs}
              tabledLabsList={tabledLabsList}
              tabledWithResultLabs={tabledWithResultLabs}
              tabledWithResultLabsList={tabledWithResultLabsList}
              hoWidalLabs={hoWidalLabs}
              hoWidalLabsList={hoWidalLabsList}
              // isHistory={isHistory}
              // isHospital={isHospital}
              // handleTableChange={handleTableChange}
              // handleWidalTableChange={handleWidalTableChange}
              getComments={getComments}
              comments={comments}
            />

            {/* {departmentHead === "Microbiology" ? (
                <MicrobiologyView labInfo={labInfo} />
              ) : (
                <OtherLabView labInfo={labInfo} />
              )} */}

            {/* <Suspense fallback={<Loading />}>
              <LabComments getComment={getComments} comments={comments} />
            </Suspense> */}

            {/* </CardBody> */}
            <center>
              <button className="my-2 btn btn-success px-3" disabled>
                Print now
              </button>
            </center>
          </Card>
          {/* {JSON.stringify(requestList)} */}
        </Col>

        {(isDoctorInterface||isPatientInterface) ? null : previewMode ? (
          <Preview
            setPreviewMode={setPreviewMode}
            previewIsReceipt={previewIsReceipt}
            labReceipt={labReceipt}
            receiptNo={receiptNo}
            patientInfo={patientInfo}
            facilityInfo={facilityInfo}
            previewIsBarcode={previewIsBarcode}
            rawList={rawList}
            previewIsSampleDetails={previewIsSampleDetails}
            requestList={requestList}
            sampleDetails={sampleDetails}
          />
        ) : null}
      </Row>
      {/*{JSON.stringify(rawList)}*/}
    </>
  );
}

export default PatientViewCompletedLabResults;
