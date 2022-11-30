import React, { useState, useCallback, useEffect } from "react";
import { Card, Progress } from "reactstrap";
// import { AiOutlineCloudUpload } from "react-icons/ai";
import CustomButton from "../../../comp/components/Button";
import { apiURL, DICOM_SERVER } from "../../../../redux/actions";
import axios from "axios";
import { _customNotify, _warningNotify } from "../../../utils/helpers";
import "./upload.css";
import DICOMContainer from "./dicom/DICOMContainer";
import SampleForm from "../SampleForm";
import { useHistory, useRouteMatch } from "react-router";
import { _fetchApi, _postApi } from "../../../../redux/actions/api";
import { useDispatch } from "react-redux";
import { RADIOLOGY_SAMPLE_SCAN, refreshHistoryList, refreshPendingList } from "../../labRedux/actions";
import { useQuery } from "../../../../hooks";

function RadiologyFiles() {
  const match = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch()
  const labno = match.params.labno;
  const patientId = match.params.patientId;
  const query = useQuery()
  const request_id = query.get('request_id')


  const [patientInfo, setPatientInfo] = useState({});
  const [, setLabs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loaded, setLoaded] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [, setComments] = useState([]);
  const [sopInstanceUid, setSopInstanceUid] = useState("");
  const [skipping, setSkipping] = useState(false)

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
      _fetchApi(
        `${apiURL()}/lab/collected/${labno}/radiology`,
        (data) => {
          if (data.success) {
            setLabs(data.results);
          }
        },
        (err) => {
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

  // const exceedMax = (e) => {
  //   let files = e.target.files;
  //   if (files.length > 3) {
  //     // const msg = "Only 3 images are allowed at a time";
  //     e.target.value = null;
  //     return true;
  //   }
  //   return false;
  // };

  // const isDicomFile = (e) => {
  //   let files = e.target.files;
  //   let err = "";
  //   let allowedTypes = ["image/png", "image/jpeg", "image/gif"];
  //   for (let m = 0; m < files.length; m++) {
  //     if (
  //       allowedTypes.every((t) => files[m].type !== t) ||
  //       (files[m].filename && files[m].filename.includes(".dcm"))
  //     ) {
  //       err += files[m].type + " is not supported";
  //     }
  //   }
  //   if (err !== "") {
  //     e.target.value = null;
  //     alert(err);
  //     return false;
  //   }
  //   return true;
  // };

  const handleInputChange = (files) => {
    // console.log(files);
    // if (isDicomFile(event)) {
    setSelectedFiles(files);
    // }
    // setLoaded(0);
  };

  // const progressivelyDownload = async () => {
  //   let uri =
  //     "http://pscprime.com/server/operationnotes/all/1be0a9da-bff9-4ab6-a36c-edfd8ca88f1a";
  //   // let uri = `${apiURL()}/dicom/upload/multiple`
  //   const response = await fetch(uri);
  //   const total = Number(response.headers.get("content-length"));

  //   const reader = response.body.getReader();
  //   let bytesReceived = 0;
  //   while (true) {
  //     const result = await reader.read();
  //     if (result.done) {
  //       console.log("Fetch complete");
  //       break;
  //     }
  //     bytesReceived += result.value.length;
  //     console.log("Received", bytesReceived, "/", total);
  //   }
  // };

  // useEffect(() => {
  //   progressivelyDownload();
  // }, []);

  const updateTestWithDicom = (cb) => {
    _postApi(
      `${apiURL()}/dicom/update-test?query_type=update`,
      {
        sopInstanceUid,
        labno,
      },
      (data) => {
        cb(data);
        // _customNotify('Update successful')
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const progressivelyUpload = () => {
    setUploading(true);

    const data = new FormData();
    // data.append("files", selectedFiles);
    for (let v = 0; v < selectedFiles.length; v++) {
      data.append("files", selectedFiles[v]);
    }
    axios
      .post(`${DICOM_SERVER}/studies`, data, {
        onUploadProgress: (ProgressEvent) => {
          setLoaded((ProgressEvent.loaded / ProgressEvent.total) * 100);
        },
      })
      .then((resp) => {
        updateTestWithDicom(() => {
          setIsComplete(true);
          setUploading(false);
          _customNotify("Upload Success!");
          // console.log(resp);
          history.push("/me/lab/radiology-analysis-scan");
          dispatch(refreshPendingList(RADIOLOGY_SAMPLE_SCAN));
        dispatch(refreshHistoryList(RADIOLOGY_SAMPLE_SCAN));
        });
      })
      .catch((err) => {
        setUploading(false);
        console.log(err);
        _warningNotify("Upload failed!");
      });
  };

  // const handleUpload = () => {
  //   setUploading(true);

  //   const data = new FormData();
  //   // data.append("files", selectedFiles);
  //   for (let v = 0; v < selectedFiles.length; v++) {
  //     data.append("files", selectedFiles[v]);
  //   }

  //   fetch(`${apiURL()}/dicom/upload/multiple`, {
  //     method: "POST",
  //     body: data,
  //   })
  //     .then((raw) => raw.json())
  //     .then((data) => {
  //       console.log(data);
  //       setUploading(false);
  //       // setLoaded(data.file);
  //     })
  //     .catch((err) => {
  //       setUploading(false);
  //       console.log(err);
  //     });
  // };

  const skipTest = () => {
    setSkipping(true)
    _postApi(`${apiURL()}/lab/update-lab-status`, {
      newStatus: 'uploaded', labno
    }, () => {
      setSkipping(false)
      _customNotify('Test has been moved to report')
      history.push("/me/lab/radiology-analysis-scan");
          dispatch(refreshPendingList(RADIOLOGY_SAMPLE_SCAN));
        dispatch(refreshHistoryList(RADIOLOGY_SAMPLE_SCAN));
    }, () => {
      setSkipping(false)
      _warningNotify("An error occured!")
    })
  }

  return (
    <Card className="p-2 m-0">
      <SampleForm
        labno={labno}
        patientInfo={patientInfo}
        historyMode="read"
        history={patientInfo.history}
      />
      <div className='d-flex flex-row justify-content-between align-items-center'>
      <h6 className="">Upload Scanned Test Results</h6>
      <CustomButton loading={skipping} size='sm' color='info' onClick={skipTest}>Skip Upload</CustomButton>
      </div>

      {/* <input
          id="upload-dicom"
          type="file"
          name="dicom-files"
          onChange={handleInputChange}
        />
         */}
      {/* <div className=" d-flex flex-column justify-content-center align-items-center">
        <div className="form-group files">
          <input
            id="upload-dicom"
            type="file"
            name="dicom-files"
            className="form-control"
            // style={{ padding: "120px 0px 85px 35%" }}
            multiple
            onChange={handleInputChange}
          />
        </div>
      </div> */}

      <DICOMContainer
        sopInstanceUid={sopInstanceUid}
        setSopInstanceUid={(val) => setSopInstanceUid(val)}
        handleInputChange={handleInputChange}
      />

      <div className="mb-1">
        <Progress
          max="100"
          color={loaded === 100 && isComplete ? "success" : "primary"}
          value={loaded}
        >
          {Math.round(loaded)}%
        </Progress>
      </div>
      <CustomButton loading={uploading} onClick={progressivelyUpload}>
        Upload now
      </CustomButton>
    </Card>
  );
}

export default RadiologyFiles;

// const progressivelyUpload = async () => {
//   setUploading(true);
//   const data = new FormData();
//   // data.append("files", selectedFiles);
//   for (let v = 0; v < selectedFiles.length; v++) {
//     data.append("files", selectedFiles[v]);
//   }
//   // let max = selectedFiles.reduce((a, b) => a + b.size, 0);
//   let status;
//   let uri = `${apiURL()}/dicom/upload/multiple`;
//   const request = new Request(uri, {
//     method: "POST",
//     body: data,
//     cache: "no-store",
//   });

//   const upload = (s) => fetch(s);

//   const uploadProgress = new ReadableStream({
//     start(controller) {
//       console.log("starting upload, request.bodyUsed:", request.bodyUsed);
//       controller.enqueue(request.bodyUsed);
//     },
//     pull(controller) {
//       if (request.bodyUsed) {
//         controller.close();
//       }
//       controller.enqueue(request.bodyUsed);
//       console.log("pull, request.bodyUsed:", request.bodyUsed);
//     },
//     cancel(reason) {
//       console.log(reason);
//     },
//   });

//   const [fileUpload, reader] = [
//     upload(request).catch((e) => {
//       reader.cancel();
//       throw e;
//     }),
//     uploadProgress.getReader(),
//   ];

//   const processUploadRequest = ({ value, done }) => {
//     if (value || done) {
//       console.log("upload complete, request.bodyUsed:", request.bodyUsed);
//       // set `progress.value` to `progress.max` here
//       // if not awaiting server response
//       // progress.value = progress.max;
//       return reader.closed.then(() => fileUpload);
//     }
//     console.log("upload progress:", value);
//     status = +status + 1;
//     return reader.read().then((result) => processUploadRequest(result));
//   };

//   reader
//     .read()
//     .then(({ value, done }) => processUploadRequest({ value, done }))
//     .then((response) => response.text())
//     .then((text) => {
//       console.log("response:", text);
//       // status = max;
//       // input.value = "";
//       setUploading(false);
//     })
//     .catch((err) => {
//       setUploading(false);
//       console.log("upload error:", err);
//     });
// };
