import React, { useCallback, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { apiURL } from "../../../../redux/actions";
import { _fetchApi, _postApi, _updateApi } from "../../../../redux/actions/api";
import CustomButton from "../../../comp/components/Button";
import SpeechInput from "../../../comp/speech-to-text/SpeechInput";
import { _customNotify, _warningNotify } from "../../../utils/helpers";
// import LabComments from "../../components/LabComments";
import {
  MICRO_SAMPLE_ANALYSIS,
  refreshHistoryList,
  refreshPendingList,
} from "../../labRedux/actions";
// import { Textarea } from "evergreen-ui";
// import InputResultItem from "./InputResultItem";
// import MicrobiologyResultForm from "./MicrobiologyResultForm";
// import TableWithRange from "./TableWithRange";
import MacroscopyResultForm from "./MacroscopyResultForm";
import { splitTestsByView } from "./helpers";
import LabView from "./LabView";
import Loading from "../../../comp/components/Loading";

// import { useQuery } from "../../../../hooks";

const MicrobiologyAnalysisResult = ({
  isEditting = false,
  labno = "",
  // test = "",
  isDoctor = false,
  isHistory = false,
  toggleEdit = (f) => f,
  resultsNew = [],
}) => {
  // const query = useQuery();
  // const isReadOnly = query.get("view");
  const dispatch = useDispatch();
  const history = useHistory();
  // const [currTest, setCurrTest] = useState({
  //   sensitiveTo: "",
  //   resistantTo: "",
  //   intermediaryTo: "",
  // });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [sensitivities, setSensitivities] = useState([]);
  const [comments, setComments] = useState([]);
  // const [result, setResult] = useState("");
  const [labs, setLabs] = useState([]);
  const [tabledLabs, setTabledLabs] = useState([]);
  const [tabledLabsList, setTabledLabsList] = useState([]);
  const [macroscopyLabs, setMacroscopyLabs] = useState([]);
  const [hoWidalLabs, setHOWidalLabs] = useState({});
  const [hoWidalLabsList, setHOWidalLabsList] = useState([]);
  const [inputLabs, setInputLabs] = useState([]);
  const [microbiology, setMicrobiologyLabs] = useState([]);

  // const [sensitiveTo, setSensitiveTo] = useState("");
  // const [resistantTo, setResistantTo] = useState("");
  // const [intermediaryTo, setIntermediaryTo] = useState("");

  const facility = useSelector((state) => state.facility.info);
  const isHospital = facility.type === "hospital";

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
  // const handleSensitivityInputChange = ({ target: { name, value } }) => {
  //   // setSensitiveTo(value);
  //   setCurrTest((prev) => ({ ...prev, [name]: value }));
  // };

  // const handleResistantToChange = ({ target: { value } }) => {
  //   setResistantTo(value);
  // };
  // const handleIntermediaryToChange = ({ target: { value } }) => {
  //   setIntermediaryTo(value);
  // };
  // const handleSensitiveToChange = (val) => {
  //   if (sensitiveTo.includes(val)) {
  //     setSensitiveTo((prev) =>
  //       prev
  //         .split(",")
  //         .filter((item) => item !== val)
  //         .join(",")
  //     );
  //   } else {
  //     setSensitiveTo((prev) => prev.concat(val, ","));
  //   }
  // };

  const handleSensitivityTableChange = (name, val, item) => {
    console.log(name, val, item);
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

  // const handleIntermediaryTo = (val) => {
  //   if (intermediaryTo.includes(val)) {
  //     setIntermediaryTo((prev) =>
  //       prev
  //         .split(",")
  //         .filter((item) => item !== val)
  //         .join(",")
  //     );
  //   } else {
  //     setIntermediaryTo((prev) => prev.concat(val, ","));
  //   }
  // };

  const [form, setForm] = useState({
    appearanceM: "",
    microscopyS: "",
    cultureY: "",
    comment: "",
  });

  const getAntibiotics = () => {
    _fetchApi(`${apiURL()}/lab/sensitivities`, (data) => {
      if (data.success) {
        setSensitivities(data.results);
      }
    });
  };

  // deg =>

  const resetPage = () => {
    // setSensitivities([]);
    setForm({});
    dispatch(refreshPendingList(MICRO_SAMPLE_ANALYSIS));
    dispatch(refreshHistoryList(MICRO_SAMPLE_ANALYSIS));
    history.push("/me/lab/microbiology-analysis");
  };

  const getPendingAnalysis = useCallback(
    () => {
      setFetching(true);
      _fetchApi(
        `${apiURL()}/lab/collected/${labno}/microbiology`,
        (data) => {
          setFetching(false);
          if (data.success && data.results && data.results.length) {
            let {
              _tabledLab,
              _tabledLabList,
              inputList,
              microbiology,
              _hoWidalLabs,
              _hoWidalLabsList,
              macroscopyList,
              otherList,
            } = splitTestsByView(data.results);

            setTabledLabs(_tabledLab);
            setTabledLabsList(_tabledLabList);
            setInputLabs(inputList);
            setMicrobiologyLabs(microbiology);
            setHOWidalLabs(_hoWidalLabs);
            setHOWidalLabsList(_hoWidalLabsList);
            setLabs(otherList);
            setMacroscopyLabs(macroscopyList);

            // let tabledList = [];
            // // let inputList = [];
            // let microbiology = [];
            // // let hoWidalList = [];
            // // let customList = []
            // let otherList = [];
            // let macroscopyList = []
            //  let _hoWidalLabs = [];
            // let _hoWidalLabsList = [];
            // data.results.forEach((item) => {
            //   if (item.report_type === "table") {
            //     tabledList.push(item);
            //     } else if (item.report_type === "input") {
            //       inputList.push(item);
            //     } else if (item.report_type === "microbiology_form") {
            //       microbiology.push(item);
            //     } else if (item.report_type === "ho_widal") {
            //       hoWidalList.push(item);
            //   } else if (item.report_type === 'macroscopy') {
            //     macroscopyList.push(item)
            //   } else {
            //     otherList.push(item);
            //   }
            // });

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
          setFetching(false);
          console.log(err);
        }
      );
    },
    [labno]
  );

  const saveComment = (cb = (f) => f) => {
    if (isHospital) {
      let _head = labs.length ? labs[0].department : tabledLabs[0].department;
      let data = {
        labno,
        comment: form.comment,
        department: _head,
        tests: labs.map((i) => i.test),
        amount: 0,
      };

      _postApi(
        `${apiURL()}/lab/comment/doctors/new`,
        data,
        (data) => {
          _customNotify("Comment Saved!");
          cb();
          history.push("/me/lab/sample-analysis");
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      setLoading(false);
    }
  };

  // const handleSubmitMalaria = () => {
  //   setLoading(true);
  //   const success = () => {
  //     _customNotify("Result submitted");
  //   };

  //   const list = { ...currTest, result: result, status: "analyzed" };

  //   _updateApi(
  //     `${apiURL()}/lab/result/new`,
  //     list,
  //     (data) => {
  //       // if (data.success) {
  //       _customNotify("Analysis Submitted");
  //       resetPage();
  //       // }
  //     },
  //     () => {
  //       setLoading(false);
  //     }
  //   );

  //   if (list === list.length - 1) {
  //     success();
  //     getPendingAnalysis();
  //   }

  //   let _head = test[0].padEnd(4, "0");
  //   if (isHospital) {
  //     let data = {
  //       labno,
  //       comment: form.comment,
  //       department: _head,
  //       tests: [currTest.test],
  //       amount: 0,
  //     };

  //     _postApi(
  //       `${apiURL()}/lab/comment/doctors/new`,
  //       data,
  //       (data) => {
  //         _customNotify("Comment Saved!");
  //         history.push("/me/lab/sample-analysis");
  //       },
  //       (err) => {
  //         console.log(err);
  //       }
  //     );
  //   }
  //   setLoading(false);
  // };

  const handleSubmit = () => {
    setLoading(true);
    // let selectedSensitivity = [];
    // sensitivities.forEach((sen) =>
    //   selectedSensitivity.push([
    //     sen.antibiotic,
    //     sen.isolates,
    //     labno,
    //     user.username,
    //   ])
    // );
    // const {
    //   appearance,
    //   serology,
    //   culture_yielded,
    //   sensitiveTo,
    //   resistantTo,
    //   intermediaryTo,
    // } = currTest;
    // console.log(sensitiveTo)
    _postApi(
      `${apiURL()}/lab/microbiology/new`,
      {
        labs: [
          ...labs,
          ...tabledLabsList,
          ...macroscopyLabs,
          ...hoWidalLabsList,
          ...microbiology,
          ...inputLabs,
        ],
      },
      (data) => {
        saveComment(() => setLoading(false));
        console.log(data);
        // if (data.success) {
        _customNotify("Analysis Submitted");
        resetPage();
        // }
      },
      (err) => {
        console.log(err);
        setLoading(false);
      }
    );
  };

  // const submitTabledLabs = () => {

  // }

  const handleUpdateLab = () => {
    setLoading(true);
    let fullList = [
      ...labs,
      ...tabledLabsList,
      ...macroscopyLabs,
      ...hoWidalLabsList,
      ...microbiology,
      ...inputLabs,
    ];
    fullList.forEach((i, idx) => {
      _updateApi(
        `${apiURL()}/lab/result/update`,
        {
          ...i,
        },
        () => {
          console.log("success");
        },
        (err) => {
          console.log(err);
          _warningNotify("An error occured");
        }
      );

      if (idx === fullList.length - 1) {
        setTimeout(() => {
          _customNotify("Update Successfull!");
          getPendingAnalysis();
          saveComment(() => setLoading(false));
          toggleEdit();
        }, 1000);
      }
    });
  };

  useEffect(
    () => {
      getPendingAnalysis();
      getAntibiotics();
    },
    [getPendingAnalysis]
  );

  // const isBlood =
  //   currTest && currTest.specimen && currTest.specimen === "Blood";
  // const isSerum =
  //   currTest && currTest.specimen && currTest.specimen === "Serum";
  // const isSputum =
  //   currTest && currTest.specimen && currTest.specimen === "Sputum";
  // const isSwab = currTest && currTest.specimen && currTest.specimen === "Swab";
  // const isStool =
  //   currTest && currTest.specimen && currTest.specimen === "Stool";
  // const isUrine =
  //   currTest && currTest.specimen && currTest.specimen === "Urine";

  const handleResultChange = (item, value) => {
    setInputLabs(
      inputLabs.map((i) =>
        i.description === item.description ? { ...i, result: value } : i
      )
    );
  };

  const handleMacroResultChange = (item, value) => {
    setMacroscopyLabs(
      macroscopyLabs.map((i) =>
        i.description === item.description ? { ...i, result: value } : i
      )
    );
  };

  const handleMacroOthersChange = (val) => {
    setMacroscopyLabs(
      macroscopyLabs.map((item) =>
        item.description === val.description ? val : item
      )
    );
  };

  // const handleOthersInputChange = (val) => {
  //   setInputLabs(
  //     inputLabs.map((item) => (item.description === val.description ? val : item))
  //   );
  // };

  const handleOthersChange = (val) => {
    setMicrobiologyLabs(
      microbiology.map((item) => (item.description === val.description ? val : item))
    );
  };

  const handleTableChange = (...args) => {
    const [key, value, idx] = args;
    // console.log(args)

    let newArr = [];
    tabledLabs.forEach((item, i) => {
      if (i === idx) {
        newArr.push({ ...item, [key]: value });
      } else {
        newArr.push(item);
      }
    });

    setTabledLabs(newArr);
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

  // const showUpdate = true;
  // const showSubmit = true;

  return (
    <div>
      {/* {JSON.stringify(labs)} */}
      {/* {JSON.stringify({
        labs,
        tabledLabs,
        macroscopyLabs,
        hoWidalLabs,
        inputLabs,
        microbiology,
      })} */}
      {fetching && <Loading />}
      <LabView
        inputLabs={inputLabs}
        microbiology={microbiology}
        isEditting={isEditting}
        handleResultChange={handleResultChange}
        handleOthersChange={handleOthersChange}
        handleSensitivityTableChange={handleSensitivityTableChange}
        sensitivities={sensitivities}
        tabledLabs={tabledLabs}
        tabledLabsList={tabledLabsList}
        hoWidalLabs={hoWidalLabs}
        hoWidalLabsList={hoWidalLabsList}
        isHistory={isHistory}
        isHospital={isHospital}
        handleTableChange={handleTableChange}
        handleWidalTableChange={handleWidalTableChange}
        getComments={getComments}
        comments={comments}
      />
      {/* ========================================================
      {JSON.stringify(resultsNew)} */}
      {/* {labs && labs.length
        ? labs.map((item, index) => (
            <Results
              key={index}
              item={item}
              handleResultChange={handleResultChange}
              isEditting={isEditting}
              sensitivities={sensitivities}
              handleSensitivityTableChange={handleSensitivityTableChange}
              handleOthersChange={handleOthersChange}
            />
          ))
        : null}

      {tabledLabs && tabledLabs.length ? (
        <TableWithRange
          list={{ [tabledLabs[0].group_head]: tabledLabs }}
          editting={isEditting}
          handleInputChange={handleTableChange}
        />
      ) : null}
      <br />
      {(isHistory || isHospital) && (
        <LabComments getComment={getComments} comments={comments} />
      )} */}
      {macroscopyLabs && macroscopyLabs.length
        ? macroscopyLabs.map((item, idx) => (
            <MacroscopyResultForm
              key={idx}
              item={item}
              isEditting={isEditting}
              handleResultChange={handleMacroResultChange}
              handleOthersChange={handleMacroOthersChange}
            />
          ))
        : null}
      {isHospital ? (
        <div className="my-2">
          <label className="font-weight-bold">Microbiologist Comment</label>
          <SpeechInput
            type="textarea"
            value={form.comment}
            onInputChange={(val) =>
              setForm((prev) => ({ ...prev, comment: val }))
            }
            style={{ height: "100px" }}
          />
        </div>
      ) : null}
      <center>
        {isHistory || isDoctor ? (
          isEditting ? (
            <CustomButton
              size={isDoctor ? "sm" : "md"}
              loading={loading}
              color="warning"
              onClick={handleUpdateLab}
            >
              Update Result
            </CustomButton>
          ) : null
        ) : (
          <>
          <CustomButton loading={loading} onClick={handleSubmit}>
            Save Result
          </CustomButton>
          <CustomButton loading={loading} onClick={handleSubmit}>
            Submit Result
          </CustomButton>
          </>
        )}
      </center>
    </div>
  );
};

export default MicrobiologyAnalysisResult;

// const Results = ({
//   item = {},
//   handleResultChange = (f) => f,
//   isEditting = false,
//   sensitivities,
//   handleSensitivityTableChange,
//   // handleSensitivityInputChange,
//   handleOthersChange,
// }) => {
//   // const handleResultChange = (key, value, index) => {
//   //   let newArr = [];
//   //   result.forEach((item, i) => {
//   //     if (i === index) {
//   //       newArr.push({
//   //         ...result[index],
//   //         [key]: value,
//   //       });
//   //     } else {
//   //       newArr.push(item);
//   //     }
//   //   });
//   //   setResult(newArr);
//   // };

//   // let serology = ''
//   // resultsNew[0].head === "4045" || resultsNew[0].head === "4082"

//   if (item.print_type === "grouped") {
//     return (
//       <InputResultItem
//         isEditting={isEditting}
//         item={item}
//         handleResultChange={handleResultChange}
//       />
//     );
//   } else {
//     return (
//       <MicrobiologyResultForm
//         item={item}
//         isEditting={isEditting}
//         handleOthersChange={handleOthersChange}
//         handleSensitivityTableChange={handleSensitivityTableChange}
//         sensitivities={sensitivities}
//       />
//     );
//   }
// };
