/* eslint-disable no-unused-vars */
import React, { useState, useCallback } from "react";
import {
  CardHeader,
  CardBody,
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
// import { _fetchData } from '../utils/helpers';
import { Card } from "reactstrap";
// import SearchBar from "../record/SearchBar";
import { useHistory, useRouteMatch } from "react-router";
import { _fetchApi, _fetchApi2, _updateApi } from "../../redux/actions/api";
import { apiURL } from "../../redux/actions";
import { useEffect } from "react";
import moment from "moment";
import { FaTimes, FaSearch } from "react-icons/fa";
import { PDFViewer } from "@react-pdf/renderer";
import { MdRefresh } from "react-icons/md";
// import DaterangeSelector from "../comp/components/DaterangeSelector";
import CustomButton from "../comp/components/Button";
import { useDispatch, useSelector } from "react-redux";
import LabResult from "../comp/pdf-templates/lab-result";
import MicrobiologyReport from "../comp/pdf-templates/microbiology-report";
import Loading from "../comp/components/Loading";
import {
  printResult,
  splitTestsByView,
} from "./NewLaboratory/analysis/helpers";
import CompletedLabTestsTable from "./CompletedLabTestsTable";
import PrintRadiologyReport from "./NewLaboratory/Radiology/PrintReport";
import QuickSearch from "./NewLaboratory/registration/quick-search";
import { SET_PRINTOUT } from "../../redux/actions/actionTypes";
import Hematology from "./NewLaboratory/LabsTracking/Hematology";
import RadiologyTest from "./NewLaboratory/LabsTracking/RadiologyTest";
import AllTest from "./NewLaboratory/LabsTracking/AllTest";
import ColorDetails from "../utils/ColorDetails";
import { setLabDateRange } from "../../redux/actions/lab";
import IncompletePaymentAlert from "./NewLaboratory/reports/IncompletePaymentAlert";
// import Loading from '../Loading'

export default function CompletedLabTests(props) {
  const [searchTerm, setSearchTerm] = useState("");
  // const [error, setError] = useState('');
  const [inCompleteAlertIsOpen, setIncompleteAlertIsOpen] = useState(false);
  const [alertData, setAlertData] = useState({});
  const [completedLabTests, setCompletedTests] = useState([]);
  const [loadingPrintout, setLoadingPrintout] = useState(false);
  const [comment, setComments] = useState("");
  const [labsTracking, setLabsTracking] = useState("Sample Tracking");
  // const [printTemplate, setPrintTemplate] = useState('')
  const [print, setPrint] = useState(false);
  const [work, setWork] = useState("Sample Tracking");
  const [printOut, setPrintOut] = useState({
    patientInfo: {},
    results: [],
    printType: "",
  });
  const [quickSearchOpen, setQuickSearchModal] = useState(false);

  const match = useRouteMatch();
  const dispatch = useDispatch();
  const labNo = match.params.labNo;
  const [labInfo, setLabInfo] = useState([]);
  const facility = useSelector((state) => state.facility.info);
  const isHospital = facility.type === "hospital";

  const range = useSelector((state) => state.lab.labDateRange);
  // let today = moment().format("YYYY-MM-DD");
  // let tomorrow = moment(today)
  //   .add(1, "day")
  //   .format("YYYY-MM-DD");
  // const facilityId = useSelector(state => state.auth.user.facilityId)
  // const [range, setRange] = useState({
  //   from: today,
  //   to: tomorrow,
  // });

  const handleRangeChange = ({ target: { name, value } }) => {
    dispatch(setLabDateRange(name, value));
    // setRange((p) => ({ ...p, [name]: value }));
  };

  const getTestInfo = useCallback(() => {
    _fetchApi(
      `${apiURL()}/lab/lab-results/${labNo}`,
      (data) => {
        if (data.success) {
          setLabInfo(data.results);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }, [labNo]);

  useEffect(() => {
    getTestInfo();
  }, [getTestInfo]);
  // fetchCompletedTest = () => {
  //   let route = 'lab/testCompleted';
  //   let success_callback = data => this.setState({ completedLabTests: data });
  //   let error_callback = error => this.setState({ error });
  //   _fetchData({ route, success_callback, error_callback });
  // };

  // componentDidMount() {
  //   this.fetchCompletedTest();
  // }
  const history = useHistory();

  // const onFilterTextChange = (e) => setFilterText(e.target.value);

  const getCompletedLabTests = useCallback(() => {
    _fetchApi2(
      `${apiURL()}/lab/completed-lab-tests/${facility.facility_id}?from=${
        range.from
      }&to=${range.to}`,
      (data) => {
        if (data.success) {
          setCompletedTests(data.results);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }, [facility.facility_id, range.from, range.to]);

  useEffect(() => {
    getCompletedLabTests();

    const refreshInterval = setInterval(() => {
      getCompletedLabTests();
    }, 50000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [getCompletedLabTests]);

  const gotoTest = (p_id, booking_no, request_id, code = "") => {
    history.push(
      `/me/lab/completed/view/${p_id}/${booking_no}?request_id=${request_id}&code=${code}`
    );
  };

  const gotoUncompletedTest = (p_id, booking_no, request_id, code = "") => {
    history.push(
      `/me/lab/uncompleted/view/${p_id}/${booking_no}?request_id=${request_id}&code=${code}`
    );
  };

  const onEditClick = (p_id, booking_no, receiptNo, request_id) => {
    history.push(
      `/me/lab/request/edit/${p_id}/${booking_no}?receiptNo=${receiptNo}&request_id=${request_id}`
    );
  };

  const refresh = () => {
    getCompletedLabTests();
  };

  const onPrintClick = (test) => {
    // console.log(test)
    setLoadingPrintout(true);
    printResult(
      test.patient_id,
      test.booking_no,
      (data) => {
        setLoadingPrintout(false);
        // console.log(data.comments[0].useTemplate === 'yes');
        setPrintOut(data);
        // alert(JSON.stringify(data))
        // if (data.results[0].department === '5000') {
        if (
          data.comments &&
          data.comments.length &&
          data.comments[0].useTemplate === "yes"
        ) {
          window.frames[
            "template_print_frame"
          ].document.body.innerHTML = document.getElementById(
            "template_print_main"
          ).innerHTML;
          window.frames["template_print_frame"].window.focus();
          window.frames["template_print_frame"].window.print();
          updatePrintStatus(test.booking_no, () => {});
        } else {
          // dispatch({ type: SET_PRINTOUT, payload: data });
          // history.push("/me/lab/patients/result-view");
          setPrint(true);
          setPrintOut(data);
        }
      },
      (err) => {
        console.log("err", err);
        setLoadingPrintout(false);
      },
      test.request_id
      // (info) => {
      //   setIncompleteAlertIsOpen(true)
      //   setAlertData(info)
      //   setLoadingPrintout(false)
      // },
    );

    // _fetchApi(
    //   `${apiURL()}/lab/request/history/${test.patient_id}/${test.booking_no}`,
    //   (data) => {
    //     if (data.success) {
    //       // setPatientInfo(data.results[0])
    //       setPrintOut((prev) => ({ ...prev, patientInfo: data.results[0] }));

    //       _fetchApi(
    //         `${apiURL()}/lab/lab-results/${test.booking_no}`,
    //         (data2) => {
    //           // alert(JSON.stringify(data2));
    //           if (data2.success) {
    //             _fetchApi(
    //               `${apiURL()}/lab/comment/${test.booking_no}`,
    //               (data3) => {
    //                 let splitted = splitTestsByView(data2.results);
    //                 // console.log(data2.results)
    //                 // console.log(splitted);

    //                 _fetchApi(
    //                   `${apiURL()}/lab/sample/history/${test.booking_no}`,
    //                   (data4) => {
    //                     setLoadingPrintout(false);
    //                     // console.log(data);
    //                     let history = data4.results;
    //                     // console.log(history)
    //                     if (data.results) {
    //                       // console.log(data2.results[0], data3.results)
    //                       // setComments(data.results);
    //                       // alert(JSON.stringify(data2))
    //                       // if (data2.results[0].test_group === "4000") {
    //                       //   setPrintOut((prev) => ({
    //                       //     ...prev,
    //                       //     results: data2.results,
    //                       //     comments: data3.results,
    //                       //     printType: data2.results[0].test_group,
    //                       //   }));

    //                       //   setTimeout(() => {
    //                       //     setPrint(true);
    //                       //   }, 1000);
    //                       // } else
    //                       setPrintOut((prev) => ({
    //                         ...prev,
    //                         results: data2.results,
    //                         comments: data3.results,
    //                         printType: data2.results[0].test_group,
    //                         history,
    //                       }));

    //                       console.log({
    //                         results: data2.results,
    //                         comments: data3.results,
    //                         printType: data2.results[0].test_group,
    //                         history,
    //                       });
    //                       if (data2.results[0].department === "5000") {
    //                         // console.log(data2.results[0], data3.results)
    //                         // console.log('radio--------------------------')
    //                         if (data3.results.length) {
    //                           window.frames[
    //                             "template_print_frame"
    //                           ].document.body.innerHTML = document.getElementById(
    //                             "template_print"
    //                           ).innerHTML;
    //                           window.frames[
    //                             "template_print_frame"
    //                           ].window.focus();
    //                           window.frames[
    //                             "template_print_frame"
    //                           ].window.print();
    //                         }

    //                         let booking_no = data2.results[0].booking_no;
    //                         updatePrintStatus(booking_no, () => {});
    //                         // window.frames['print_frame'].document.body.style.display = "inline"
    //                       } else {
    //                         // let nn = {};
    //                         // if (data2.results && data2.results.length) {
    //                         //   // console.log(data2.results);
    //                         //   data2.results.forEach((i) => {
    //                         //     if (Object.keys(nn).includes(i.test_group)) {
    //                         //       nn[i.test_group] = [...nn[i.test_group], i];
    //                         //     } else {
    //                         //       nn[i.test_group] = [i];
    //                         //     }
    //                         //   });
    //                         // }

    //                         setPrintOut((prev) => ({
    //                           ...prev,
    //                           results: data2.results,
    //                           disp_results: splitted,
    //                           comments: data3.results,
    //                           printType: data2.results[0].test_group,
    //                           history,
    //                         }));

    //                         setTimeout(() => {
    //                           setPrint(true);
    //                         }, 1000);
    //                       }
    //                     }
    //                   },
    //                   (err) => {
    //                     console.log(err);
    //                   }
    //                 );
    //               },
    //               (err) => console.log(err)
    //             );
    //           }
    //         },
    //         (err) => {
    //           console.log(err);
    //         }
    //       );
    //     }
    //   },
    //   (err) => console.log(err)
    // );

    // console.log(test);
    // window.frames[
    //   'result_frame'
    // ].document.body.innerHTML = document.getElementById(
    //   'resultsContainer',
    // ).innerHTML;
    // window.frames['result_frame'].window.focus();
    // window.frames['result_frame'].window.print();
    // handleFormSubmit()
  };

  const onUncompletedTestPrintClick = (test) => {
    setLoadingPrintout(true);

    printResult(
      test.patient_id,
      test.booking_no,
      (data) => {
        setLoadingPrintout(false);
        // console.log(data);
        setPrintOut(data);
        if (data.results[0].department === "5000") {
          window.frames[
            "template_print_frame"
          ].document.body.innerHTML = document.getElementById(
            "template_print_main"
          ).innerHTML;
          window.frames["template_print_frame"].window.focus();
          window.frames["template_print_frame"].window.print();
        } else {
          setPrint(true);
        }
      },
      (err) => {
        console.log("err", err);
        setLoadingPrintout(false);
      },
      test.request_id
    );
  };

  const _closePrint = (printOut) => {
    console.log(printOut);
    let booking_no = printOut.results[0].booking_no;
    setPrint(false);
    setLoadingPrintout(false);
    updatePrintStatus(booking_no, () => {
      props.getArchivedLabs();
    });
  };

  const updatePrintStatus = (labno, cb = (f) => f) => {
    _updateApi(
      `${apiURL()}/lab/lab-results/printed`,
      { labno },
      (data) => {
        console.log(`Lab ${labno} printed!`);
        cb();
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const openQuickSearch = () => setQuickSearchModal((p) => !p);

  const raiseRefund = () => {
    history.push("/me/lab/patients/pending-refund-request");
  };

  return (
    <div>
      <Card>
        {/* {JSON.stringify(res)} */}
        <CardHeader className="d-flex flex-row justify-content-between align-items-center">
          <CustomButton onClick={openQuickSearch} size="sm" color="info">
            <FaSearch />
            Quick Search
          </CustomButton>
          <h6>
            {work}
            {/* {JSON.stringify(printOut)} */}
          </h6>
          <div className="">
            <UncontrolledButtonDropdown>
              <DropdownToggle caret color="info" size="sm">
                <FaSearch />
                Sample Tracking
              </DropdownToggle>
              <DropdownMenu>
                {/* <DropdownItem onClick={() => setWork("department_head")}>All Test</DropdownItem> */}
                <DropdownItem onClick={() => setWork("Hematology")}>
                  Hematology
                </DropdownItem>
                <DropdownItem onClick={() => setWork("Chemical Pathology")}>
                  Chemical Pathology
                </DropdownItem>
                <DropdownItem onClick={() => setWork("Microbiology")}>
                  Microbiology
                </DropdownItem>
                <DropdownItem onClick={() => setWork("Radiology")}>
                  Radiology
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>
          </div>
        </CardHeader>
        <CardBody className="px-0 py-0">
          <QuickSearch
            toggle={openQuickSearch}
            quickSearchOpen={quickSearchOpen}
          />
          <PrintRadiologyReport
            data={printOut}
            frame_id="template_print_main"
          />
          {loadingPrintout && <Loading />}
          {/* {JSON.stringify(printOut)} */}

          {print ? (
            <ResultViewer
              close={() => _closePrint(printOut)}
              printOut={printOut}
              isHospital={isHospital}
            />
          ) : (
            <div>
              {work === "Sample Tracking" ? (
                <>
                  <CompletedLabTestsTable
                    labResultSearchRef={props.labResultSearchRef}
                    gotoTest={gotoTest}
                    gotoUncompletedTest={gotoUncompletedTest}
                    setSearchTerm={(term) => setSearchTerm(term)}
                    completedLabTests={completedLabTests}
                    onPrintClick={onPrintClick}
                    onUncompletedTestPrintClick={onUncompletedTestPrintClick}
                    onEditClick={onEditClick}
                    searchTerm={searchTerm}
                    getCompletedLabTests={getCompletedLabTests}
                    handleRangeChange={handleRangeChange}
                    range={range}
                  />
                </>
              ) : work !== "Sample Tracking" ? (
                <Hematology department={work} />
              ) : null}
            </div>
          )}

          <IncompletePaymentAlert
            info={alertData}
            isOpen={inCompleteAlertIsOpen}
            toggle={() => setIncompleteAlertIsOpen((p) => !p)}
          />
          <ColorDetails />
        </CardBody>
      </Card>
    </div>
  );
}

export const ResultViewer = ({
  printOut,
  close = (f) => f,
  setToggle,
  isHospital,
}) => {
  const today = moment().format("DD-MM-YYYY");
  const facilityInfo = useSelector((state) => state.facility.info);

  const patientInfo = printOut.patientInfo || {};

  return (
    <div>
      <button className="btn btn-danger offset-md-10 my-2" onClick={close}>
        <FaTimes />
        Close
      </button>
      {/* {JSON.stringify(printOut.results)} */}
      <div>
        <PDFViewer height="900" width="600">
          {/* {printOut.printType === "Microbiology" ||
          printOut.printType === "Serology" ? (
            <MicrobiologyReport
              data={printOut.results}
              comments={printOut.comments}
              date={today}
              name={patientInfo.name}
              patientId={patientInfo.id}
              dob={patientInfo.dob}
              gender={patientInfo.gender}
              facilityInfo={facilityInfo}
              isHospital={isHospital}
              history={printOut.history}
            />
          ) : ( */}
          <LabResult
            rawList={printOut.results}
            data={printOut.disp_results}
            comments={printOut.comments}
            date={today}
            name={patientInfo.name}
            patientId={patientInfo.id}
            dob={patientInfo.dob}
            gender={patientInfo.gender}
            facilityInfo={facilityInfo}
            history={printOut.history}
          />
          {/* )} */}
        </PDFViewer>
      </div>
    </div>
  );
};
