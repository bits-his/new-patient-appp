import React, { useState, useCallback, useEffect } from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router";
import { Card, CardBody } from "reactstrap";
import { apiURL } from "../../../../redux/actions";
import {
  _fetchApi,
  _postApi,
  _postApiAsync,
  _updateApi,
} from "../../../../redux/actions/api";
import { useQuery } from "../../../../hooks";
// import NewMicroBiology from "../MicroBiology/NewMicroBiology";
// import RadiologyAnalysis from "../Radiology/Radiology";
// import SampleAnalysis from "../SampleAnalysis";

// import Loading from "../../../loading";
import CustomButton from "../../../comp/components/Button";
import { FaEdit } from "react-icons/fa";
// import Loading from "../../../loading";
import { useSelector } from "react-redux";
import { MdSave, MdSend } from "react-icons/md";
import { _customNotify } from "../../../utils/helpers";
import SpeechInput from "../../../comp/speech-to-text/SpeechInput";
import LabView from "./LabView";
// import Loading from "../../../loading";
import SampleForm from "../SampleForm";

export default function AllDepartment() {
  const match = useRouteMatch();
  let query = useQuery();
  const location = useLocation();
  const history = useHistory();

  // const head = match.params.test.toString();
  const labno = match.params.labno;
  const patientId = match.params.patientId;
  const view = query.get("view");
  const request_id = query.get("request_id");

  const isHistory = location.pathname.includes("history");
  const userRole = useSelector((state) => state.auth.user.role);
  const { username, facilityId } = useSelector((state) => state.auth.user);
  const isDoctor = userRole === "Doctor";
  const facility = useSelector((state) => state.facility.info);
  const isHospital = facility.type === "hospital";
  const isHema = location.pathname.includes("hematology-analysis");
  const isChemPath = location.pathname.includes("chemical-pathology-analysis");
  const isMicro = location.pathname.includes("microbiology-analysis");
  const isRad = location.pathname.includes("radiology-analysis");

  const goHome = () => {
    if (isHema) {
      history.push("/me/lab/hematology-analysis");
    } else if (isChemPath) {
      history.push("/me/lab/chemical-pathology-analysis");
    } else if (isMicro) {
      history.push("/me/lab/microbiology-analysis");
    } else if (isRad) {
      history.push("/me/lab/radiology-analysis");
    } else {
      history.push("/me/lab/sample-analysis");
    }
  };

  const [patientInfo, setPatientInfo] = useState({});
  const [labs, setLabs] = useState([]);
  const [tabledLabs, setTabledLabs] = useState([]);
  const [tabledLabsList, setTabledLabsList] = useState([]);
  const [tabledWithResultLabs, setTabledWithResultLabs] = useState([]);
  const [tabledWithResultLabsList, setTabledWithResultLabsList] = useState([]);
  const [inputLabs, setInputLabs] = useState([]);
  const [microbiology, setMicrobiologyLabs] = useState([]);
  const [macroscopy, setMacroscopyLabs] = useState([]);
  const [hoWidalLabs, setHOWidalLabs] = useState({});
  const [hoWidalLabsList, setHOWidalLabsList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isEditting, setEditting] = useState(false);
  const [sensitivities, setSensitivities] = useState([]);
  const [comments, setComments] = useState([]);
  const [remark, setRemark] = useState("");

  const toggleEdit = () => setEditting((p) => !p);

  const getPendingAnalysis = useCallback(() => {
    _fetchApi(
      `${apiURL()}/lab/collected/${labno}/All`,
      (data) => {
        console.log(data);
        if (data.success && data.results && data.results.length) {
          let _tabledLab = {};
          let _tabledLabList = [];
          let _tabledWithResultLab = {};
          let _tabledWithResultLabList = [];
          let inputList = [];
          let _microbiology = [];
          let _macroscopy = [];
          let _hoWidalLabs = [];
          let _hoWidalLabsList = [];
          // let customList = []
          let otherList = [];
          data.results.forEach((item) => {
            if (item.report_type === "table") {
              _tabledLabList.push({
                ...item,
                // n_unit: item.unit,
                // n_range_from: item.range_from,
                // n_range_to: item.range_to,
              });

              if (Object.keys(_tabledLab).includes(item.group_head)) {
                _tabledLab[item.group_head] = [
                  ..._tabledLab[item.group_head],
                  {
                    ...item,
                    // n_unit: item.unit,
                    // n_range_from: item.range_from,
                    // n_range_to: item.range_to,
                  },
                ];
              } else {
                _tabledLab[item.group_head] = [item];
              }
            } else if (item.report_type === "table_result") {
              _tabledWithResultLabList.push({
                ...item,
                // n_unit: item.unit,
                // n_range_from: item.range_from,
                // n_range_to: item.range_to,
              });

              if (Object.keys(_tabledWithResultLab).includes(item.group_head)) {
                _tabledWithResultLab[item.group_head] = [
                  ..._tabledWithResultLab[item.group_head],
                  {
                    ...item,
                    // n_unit: item.unit,
                    // n_range_from: item.range_from,
                    // n_range_to: item.range_to,
                  },
                ];
              } else {
                _tabledWithResultLab[item.group_head] = [item];
              }
            } else if (item.report_type === "input") {
              inputList.push(item);
            } else if (item.report_type === "microbiology_form") {
              _microbiology.push(item);
            } else if (item.report_type === "ho_widal") {
              // hoWidalList.push(item);
              _hoWidalLabsList.push(item);

              if (Object.keys(_hoWidalLabs).includes(item.group_head)) {
                _hoWidalLabs[item.group_head] = [
                  ..._hoWidalLabs[item.group_head],
                  item,
                ];
              } else {
                _hoWidalLabs[item.group_head] = [item];
              }
            } else if (item.report_type === "macroscopy") {
              _macroscopy.push(item);
            } else {
              otherList.push(item);
            }
          });
          setTabledLabs(_tabledLab);
          setTabledLabsList(_tabledLabList);
          setTabledWithResultLabs(_tabledWithResultLab);
          setTabledWithResultLabsList(_tabledWithResultLabList);
          setInputLabs(inputList);
          setMicrobiologyLabs(_microbiology);
          setMacroscopyLabs(_macroscopy);
          setHOWidalLabs(_hoWidalLabs);
          setHOWidalLabsList(_hoWidalLabsList);
          // console.log(_hoWidalLabsList);
          setLabs(otherList);
          // let res = data.results.find((i) => i.test === test);
          // if (res) {
          // console.log(res)
          // setCurrTest(res);
          // setSensitiveTo(res.sensitivity.split(", "));
          // setResistantTo(res.resistivity.split(", "));
          // setIntermediaryTo(res.intermediaryTo.split(", "));
          // }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }, [labno]);

  const getAntibiotics = () => {
    _fetchApi(`${apiURL()}/lab/sensitivities`, (data) => {
      if (data.success) {
        setSensitivities(data.results);
      }
    });
  };

  const getPatientLabInfo = useCallback(() => {
    _fetchApi(
      `${apiURL()}/lab/request/history/${patientId}/${labno}/${request_id}`,
      (data) => {
        if (data.success) {
          setPatientInfo(data.results[0]);
        }
      },
      (err) => console.log(err)
    );
  }, [patientId, request_id, labno]);

  const getComments = useCallback(() => {
    _fetchApi(
      `${apiURL()}/lab/comment/${labno}`,
      (data) => {
        // _fetchApi(`${apiURL()}/lab/comment/${labno}/${department}`, (data) => {
        if (data.success) {
          setComments(data.results);
        }
      },
      (err) => console.log(err)
    );
  }, [labno]);

  useEffect(() => {
    if (patientId && labno) {
      getPatientLabInfo();
      getPendingAnalysis();
      getAntibiotics();
    }
    if (isHospital) {
      getComments();
    }

    if (isHistory) {
      setEditting(false);
    } else {
      setEditting(true);
    }
  }, [getPendingAnalysis, patientId, labno, isHistory, isHospital]);

  const handleResultChange = (item, value) => {
    console.log(item, value);
    setInputLabs(
      inputLabs.map((i) =>
        i.description === item.description ? { ...i, result: value } : i
      )
    );
  };

  const handleSensitivityTableChange = (name, val, item) => {
    // console.log(name, val, item);
    let _item = microbiology.find((i) => i.description === item.description);
    let newItem =
      _item[name] && _item[name].includes(val)
        ? {
            ..._item,
            [name]: _item[name]
              .split(",")
              .filter((i) => i !== val)
              .join(","),
          }
        : { ..._item, [name]: _item[name].concat(val, ",") };
    setMicrobiologyLabs((p) =>
      p.map((i) => (i.description === _item.description ? newItem : i))
    );
  };

  const handleOthersChange = (val) => {
    setMicrobiologyLabs(
      microbiology.map((item) =>
        item.description === val.description ? val : item
      )
    );
  };

  const handleMacroResultChange = (item, value) => {
    setMacroscopyLabs(
      macroscopy.map((i) =>
        i.description === item.description ? { ...i, result: value } : i
      )
    );
  };

  const handleMacroOthersChange = (val) => {
    setMacroscopyLabs(
      macroscopy.map((item) =>
        item.description === val.description ? val : item
      )
    );
  };

  // const handleTableChange = (...args) => {
  //   const [key, value, idx] = args;
  //   // console.log(args)

  //   let newArr = [];
  //   tabledLabs.forEach((item, i) => {
  //     if (i === idx) {
  //       newArr.push({ ...item, [key]: value });
  //     } else {
  //       newArr.push(item);
  //     }
  //   });

  //   setTabledLabs(newArr);
  // };

  const handleTableChange = (key, val, idx, main, test) => {
    console.log(key, val, idx, main);
    let newList = [];
    let newObj = {};

    Object.keys(tabledLabs).forEach((_main) => {
      if (_main === main) {
        let _newList = [];
        tabledLabs[_main].forEach((_item, _idx) => {
          if (_idx === idx) {
            console.log("here");
            _newList.push({ ..._item, [key]: val, editted: true });
          } else {
            _newList.push(_item);
          }
        });
        newObj[_main] = _newList;
      } else {
        newObj[_main] = tabledLabs[_main];
      }
    });

    setTabledLabs(newObj);

    tabledLabsList.forEach((item, i) => {
      // console.log(i, idx, '===============================')
      if (test.description === item.description) {
        newList.push({ ...item, [key]: val, editted: true });
      } else {
        newList.push(item);
      }
    });

    setTabledLabsList(newList);
  };

  const handleTableWithResultChange = (key, val, idx, main, test) => {
    console.log(key, val, idx, main);
    let newList = [];
    let newObj = {};

    Object.keys(tabledWithResultLabs).forEach((_main) => {
      if (_main === main) {
        let _newList = [];
        tabledWithResultLabs[_main].forEach((_item, _idx) => {
          if (_idx === idx) {
            _newList.push({ ..._item, [key]: val, editted: true });
          } else {
            _newList.push(_item);
          }
        });
        newObj[_main] = _newList;
      } else {
        newObj[_main] = tabledWithResultLabs[_main];
      }
    });

    setTabledWithResultLabs(newObj);

    tabledWithResultLabsList.forEach((item, i) => {
      // console.log(i, idx, '===============================')
      if (test.description === item.description) {
        newList.push({ ...item, [key]: val, editted: true });
      } else {
        newList.push(item);
      }
    });

    setTabledWithResultLabsList(newList);
  };

  const handleWidalTableChange = (key, val, idx, main, test) => {
    console.log(key, val, idx, main);
    let newList = [];
    let newObj = {};

    Object.keys(hoWidalLabs).forEach((_main) => {
      if (_main === main) {
        let _newList = [];
        hoWidalLabs[_main].forEach((_item, _idx) => {
          if (_idx === idx) {
            _newList.push({ ..._item, [key]: val, editted: true });
          } else {
            _newList.push(_item);
          }
        });
        newObj[_main] = _newList;
      } else {
        newObj[_main] = hoWidalLabs[_main];
      }
    });

    setHOWidalLabs(newObj);

    hoWidalLabsList.forEach((item, i) => {
      // console.log(i, idx, '===============================')
      if (test.description === item.description) {
        newList.push({ ...item, [key]: val, editted: true });
      } else {
        newList.push(item);
      }
    });

    setHOWidalLabsList(newList);
  };

  const handleUpdateLab = () => {
    console.log("update test");
    // let edittedList = [];
    // let edittedWithResult = [];
    // tabledLabsList.forEach((item) => {
    //   // console.log(item);
    //   if (item.editted) {
    //     console.log("editted");
    //     edittedList.push(item);
    //   }
    // });
    // tabledWithResultLabsList.forEach((item) => {
    //   // console.log(item);
    //   if (item.editted) {
    //     console.log("editted");
    //     edittedWithResult.push(item);
    //   }
    // });
    // console.log(edittedList);

    let allList = [
      ...tabledLabsList,
      ...tabledWithResultLabsList,
      ...inputLabs,
      ...microbiology,
      ...macroscopy,
      ...hoWidalLabsList,
      facilityId,
    ];

    for (let m = 0; m < allList.length; m++) {
      let curr = allList[m];
      _updateApi(`${apiURL()}/lab/result/update`, curr);

      if (m === allList.length - 1) {
        toggleEdit();
        _customNotify("Results Updated!");
        // getPendingAnalysis();
        // submitCb();
        goHome();
      }
    }
  };

  const handleSave = () => {
    const success = () => {
      _customNotify("Result Saved");
      // submitCb();
    };

    let allList = [
      ...tabledLabsList,
      ...tabledWithResultLabsList,
      ...inputLabs,
      ...microbiology,
      ...macroscopy,
      ...hoWidalLabsList,
    ].map((i) => ({ ...i, status: "saved", facilityId, patientId, username }));

    // let list = [];
    // Object.keys(tabledLabs).forEach((item) => {
    //   tabledLabs[item].forEach((_item) => {
    //     list.push({ ..._item, status: "saved" });
    //   });
    // });

    // console.log(allList);
    for (let i = 0; i < allList.length; i++) {
      _updateApi(`${apiURL()}/lab/result/new`, allList[i]);

      if (i === allList.length - 1) {
        success();
        getPendingAnalysis();
        goHome();
      }
    }
  };

  const handleSubmit = () => {
    setLoading(true);

    const success = () => {
      _customNotify("Result submitted");
      // submitCb();
    };

    // let list = [];
    // Object.keys(tabledLabs).forEach((item) => {
    //   tabledLabs[item].forEach((_item) => {
    //     list.push({ ..._item });
    //   });
    // });

    // console.log(list);

    // for (let i = 0; i < list.length; i++) {
    //   _updateApi(`${apiURL()}/lab/result/bulk`, list[i]);

    //   if (i === list.length - 1) {
    //     success();
    //     getPendingAnalysis();
    //   }
    // }

    let tabledListIsValid = tabledLabsList.findIndex((j) => j.result === "");

    let allList = [
      ...tabledLabsList,
      ...tabledWithResultLabsList,
      ...inputLabs,
      ...microbiology,
      ...macroscopy,
      ...hoWidalLabsList,
    ].map((i) => ({
      ...i,
      status: "analyzed",
      facilityId,
      patientId,
      username,
    }));

    _postApi(
      `${apiURL()}/post-charges-lab`,
      allList,
      (res) => {
        // _customNotify("Comment Saved!");
        // history.push("/me/lab/sample-analysis");
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
    _updateApi(
      `${apiURL()}/lab/result/bulk`,
      {
        labs: allList,
      },
      (data) => {
        // saveComment(() => setLoading(false));
        console.log(data);
        // if (data.success) {
        _customNotify("Analysis Submitted");
        // resetPage();
        // }
        goHome();
      },
      (err) => {
        console.log(err);
        setLoading(false);
      }
    );
    // }
    if (isHospital) {
      let _head = allList[0].department.padEnd(4, "0") || "";
      let newList = [];
      tabledLabsList.forEach((item) => newList.push(item.test));
      let data = {
        labno,
        comment: remark,
        department: _head,
        tests: newList,
        amount: 0,
      };

      // _postApi(
      //   `${apiURL()}/lab/comment/doctors/new`,
      //   data,
      //   () => {
      //     _customNotify("Comment Saved!");
      //     history.push("/me/lab/sample-analysis");
      //   },
      //   (err) => {
      //     console.log(err);
      //   }
      // );

      _postApiAsync(`${apiURL()}/lab/comment/doctors/new`, data)
        .then(() => {
          _customNotify("Comment Saved!");
          history.push("/me/lab/sample-analysis");
        })
        .catch((err) => {
          console.log(err);
        });

      // _postApi(`${apiURL()}/lab/comment/doctors/new`, {
      //   comment: remark,
      //   labName: _head,
      //   labno: labno,
      // });
    }

    setLoading(false);
  };

  // const dept =
  //   (labs &&
  //     labs.length &&
  //     labs[0].department_head &&
  //     labs[0].department_head.toUpperCase()) ||
  //   "";

  const showUpdate = isHistory && isEditting;
  // const showUpdate = (isDoctor && isEditting) || (isHistory && isEditting);
  const showSave = !isHistory && !isDoctor && isEditting;
  const showSubmit = !isHistory && isEditting;

  const tabledLabsListIsValid = false;
  const tabledWithResultLabsListIsValid = false;
  const inputLabsIsValid = false;
  const microbiologyIsValid = false;
  const macroscopyIsValid = false;
  const hoWidalLabsListIsValid = false;

  const submitBtnIsValid =
    tabledLabsListIsValid &&
    tabledWithResultLabsListIsValid &&
    inputLabsIsValid &&
    microbiologyIsValid &&
    macroscopyIsValid &&
    hoWidalLabsListIsValid;

  return (
    <Card>
      {/* {JSON.stringify({ facilityId, patientId, username })} */}
      <CardBody>
        <SampleForm
          labno={labno}
          patientInfo={patientInfo}
          historyMode="read"
          otherInfo={{
            label: "Sample Collected",
            value: labs && labs.length && labs[0].sample_collected_at,
          }}
        />
        <div className="d-flex flex-row justify-content-between mb-1">
          <h6> </h6>
          {view ? null : !isEditting ? (
            <CustomButton size="sm" onClick={() => setEditting(true)}>
              <FaEdit className="mr-1" /> Edit
            </CustomButton>
          ) : null}
        </div>
        {/* {JSON.stringify(patientInfo)} */}

        {/* {JSON.stringify({
          isEditting,
          isHistory,
          isDoctor,
        })} */}

        {/* {JSON.stringify({
          // tabledLabsList,
          // tabledLabs,
          // inputLabs,
          // microbiology,
          // hoWidalLabs,
          // hoWidalLabsList,
          // labs
        })} */}

        {/* {head[0] === '4' ? (
        <NewMicroBiology test={department} />
      ) : head[0] === '5' ? (
        <RadiologyAnalysis />
      ) : (
        <SampleAnalysis department={department} />
      )} */}
        <LabView
          inputLabs={inputLabs}
          microbiology={microbiology}
          macroscopy={macroscopy}
          isEditting={isEditting}
          handleResultChange={handleResultChange}
          handleOthersChange={handleOthersChange}
          handleSensitivityTableChange={handleSensitivityTableChange}
          sensitivities={sensitivities}
          tabledLabs={tabledLabs}
          tabledLabsList={tabledLabsList}
          tabledWithResultLabs={tabledWithResultLabs}
          tabledWithResultLabsList={tabledWithResultLabsList}
          hoWidalLabs={hoWidalLabs}
          hoWidalLabsList={hoWidalLabsList}
          isHistory={isHistory}
          isHospital={isHospital}
          handleTableChange={handleTableChange}
          handleTableWithResultChange={handleTableWithResultChange}
          handleWidalTableChange={handleWidalTableChange}
          getComments={getComments}
          comments={comments}
          handleMacroOthersChange={handleMacroOthersChange}
          handleMacroResultChange={handleMacroResultChange}
        />

        {isHospital && !isHistory ? (
          <div className="my-2">
            <label className="font-weight-bold">Pathologist Comment</label>
            <SpeechInput
              type="textarea"
              value={remark}
              onInputChange={(val) => setRemark(val)}
            />
          </div>
        ) : null}
      </CardBody>

      <center className="mb-2">
        {showUpdate ? (
          <CustomButton
            size={isDoctor ? "sm" : "md"}
            color="warning"
            onClick={handleUpdateLab}
            className={isDoctor ? "" : "px-4"}
          >
            Update
          </CustomButton>
        ) : null}
        {showSave ? (
          <CustomButton
            color="primary"
            onClick={handleSave}
            className="px-5 mr-2"
          >
            <MdSave /> Save
          </CustomButton>
        ) : null}
        {/* {JSON.stringify({ submitBtnIsValid })} */}
        {showSubmit ? (
          <CustomButton
            color="success"
            loading={loading}
            onClick={handleSubmit}
            // disabled={!submitBtnIsValid}
            className="px-5"
          >
            <MdSend /> Submit
          </CustomButton>
        ) : null}
      </center>
    </Card>
  );
}
