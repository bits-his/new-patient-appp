
import React, { useEffect } from 'react'
import { Card, CardBody, CardHeader, Col, Input, Row, Table } from 'reactstrap'
import { useSelector } from 'react-redux'
import Scrollbars from 'react-custom-scrollbars'
import {
  // checkEmpty,
  formatNumber,
  generateReceiptNo,
  // _convertArrOfObjToArr,
  _customNotify,
  _warningNotify,
  // _customNotify,
} from "../../utils/helpers";
import { QUEUE_MGT_SYS } from "../../../redux/actions";
import { useState } from "react";
import moment from "moment";
import CustomButton from "../../comp/components/Button";
import { apiURL } from "../../../redux/actions";
import { FaPrint, FaTimes } from "react-icons/fa";
import Loading from "../../comp/components/Loading";
import { generateLabBookingNo } from "../../doc_dash/actions/helpers/saveLabRequest";
import {
  processLabTransaction,
  saveTransaction,
} from "../../doc_dash/actions/helpers/processLabTransaction";
import { useLocation, useParams } from "react-router";
import {
  // saveLabHistory,
  // saveClient,
  updateClientInfo,
  createClientAccount2,
  createPatientRecord,
} from "./registration/api";
import { _fetchApi } from "../../../redux/actions/api";
import OtherPaymentOptions from "./registration/other-payment-options";
import { useQuery } from "../../../hooks";
import PrintLabReq from "./PrintLabReq";

// const today = moment().format('DD-MM-YYYY');

export default function DisplayDepartemnt({
  setToggle,
  reset = (f) => f,
  selectedLabs = [],
  receiptDisplayed = [],
  totalAmount = 0,
  patientInfo = {},
  formIsValid = true,
  existingPatientId = null,
  openReceipt = (f) => f,
  // labels = [],
  history = "",
  mainTxnList = [],
  setMainTxnList = (f) => f,
  closeForm = (f) => f,
  removeTest = (f) => f,
  canRemoveTest = true,
  loadingList = false,
  cb = (f) => f,
  isRequest = false,
  oldLabList = [],
  setPatientInfo = (f) => f,
}) {
  let _totalAmount = receiptDisplayed.reduce(
    (a, b) => a + parseInt(b.price),
    0
  );
  const query = useQuery();
  const request_id = query.get("request_id");
  const requestPatientid = useParams().patientId;
  const [requestPatientInfo, setRequestPatientInfo] = useState({});
  const [discount, setDiscount] = useState({});

  // const lab = useSelector((state) => state.labServices);
  const location = useLocation();
  const facilityId = useSelector((state) => state.auth.user.facilityId);
  // const facility = useSelector((state) => state.facility.info);
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [amountPaid, setAmountPaid] = useState(totalAmount);
  // const isHospital = facility.type === "hospital";
  const isEdit = location.pathname.includes("/request/edit");
  const isPendingRequest = location.pathname.includes("/process-pending");
  const oldReceiptNo = query.get("receiptNo");

  const [printers, setPrinters] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState("");

  const [partPayment, setPartPayment] = useState({ enabled: true, amount: 0 });

  const handleKeyPress = (e) => {
    if (e.key === "F10") {
      if (formIsValid) {
        submit();
        // alert("Save");
      } else {
        alert("Please complete the form!");
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    if (_totalAmount && amountPaid === _totalAmount) {
      setAmountPaid(_totalAmount);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [_totalAmount]);

  // patient-nav
  // TotalSummaryPDF
  // PublicNav
  //..
  // lab-sampling-details
  // microbiology-report
  // lab-result
  // lab-result-large

  // const saveClient = async (client) => {
  //   try {
  //     let response = await fetch(`${apiURL()}/lab/client/new`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(client),
  //     });
  //     return response.json();
  //   } catch (error) {
  //     return error;
  //   }
  // };

  const errorCallback = (errorMessage) => {
    console.log("Error: " + errorMessage);
  };

  const writeToSelectedPrinter = (dataToWrite) => {
    if (selectedPrinter) {
      selectedPrinter.send(dataToWrite, undefined, errorCallback);
    }
  };

  const initBrowserPrint = () => {
    window.BrowserPrint.getDefaultDevice(
      "printer",
      (device) => {
        // console.log(device)
        // let selected = device;
        setSelectedPrinter(device);
        setPrinters((p) => [...p, device]);

        window.BrowserPrint.getLocalDevices(
          (device_list) => {
            for (var i = 0; i < device_list.length; i++) {
              //Add device to list of devices and to html select element
              var device = device_list[i];
              if (!selectedPrinter || device.uid !== selectedPrinter.uid) {
                printers.push(device);
              }
            }
          },
          () => {
            console.log("Error getting local devices");
          },
          "printer"
        );
      },
      (err) => {
        console.log("Cannot get default printer", err);
      }
    );
  };

  const printLabels = (labels) => {
    console.log("labels", labels);
    labels
      .sort((a, b) => b.sort_index - a.sort_index)
      .forEach((label) => {
        // console.log(label);
        if (label.type === "info") {
          // console.log("calling patinet label");
          let _code = label.code && label.code.split("-").join("");
          printPatientBarcode(label.name, _code);
          // console.log(label.name,_code)
        } else {
          for (let i = 0; i < label.noOfLabels; i++) {
            let dept = label.department === "2000";
            label.dept = dept;
            // let lType = typeof label.tests
            // label.tests =  lType==='object' && label.tests.length ? label.tests.join(', ') :  label.tests
            printCode(label);
            console.log(label, "=====x=======x=====x=====x====");
          }
        }
      });
  };

  const printCode = ({
    timestamp = "",
    label_name = "",
    dept = "",
    specimen = "",
    patient_id = "",
    name = "",
    code = "",
  }) => {
    // booking_no: "21506"
    // code: "421186"
    // created_at: "2021-09-10T17:02:47.000Z"
    // department: "4000"
    // dept: "Microbiology"
    // label_name: "S. Paratyphi A (O, H), S. Paratyphi B (O, H), S. Typhi (O, H), S. Paratyphi C (O, H), HIV Viral Load, Hepatitis C Viral Load"
    // group_head: "WIDAL TEST Ab."
    // label_type: "grouped"
    // name: "Nina Rosarioz"
    // noOfLabels: 1
    // patient_id: "1-606"
    // specimen: "Blood"
    // timestamp: "10-09 (05:02) - 21506"
    writeToSelectedPrinter(
      `^XA 
      ^FO100,12
      ^A0R,18
      ^FB180,15,0,L
      ^FD${label_name}^FS
      ^FO20,10^A0N,20,20^FD${timestamp}^FS
      ^FO20,35^A0N,20,20^FD
      ${dept} - ${specimen}^FS
      ^FO20,65^A0N,20,20^FD${patient_id} / ${name}^FS
      ^FO20,95^BY3^BCN,70,,,,A^FD${code}^FS
      ^XZ`
    );
  };

  // lab code xxxx
  // `^XA
  //  ^FO130,12
  //  ^A0R,18
  //  ^FB180,15,0,L
  //  ^FD${tests}^FS
  //  ^FO230,10^A0N,20,20^FD${timestamp}^FS
  //  ^FO230,35^A0N,20,20^FD${dept} - ${sample}^FS
  //  ^FO230,65^A0N,20,20^FD${accNo} / ${patientName}^FS
  //  ^FO230,95^BY3^BCN,70,,,,A^FD${code}^FS
  //  ^XZ`

  // patient code`^XA
  // ^FO230,30^A0N,20,20^FDFAHAD ADO^FS
  // ^FO230,70^BY3^BCN,90,,,,A^FD387321^FS
  // ^XZ`

  const printPatientBarcode = (name = "", code = "") => {
    // console.log("called patient barcode generatr");
    writeToSelectedPrinter(
      `^XA
      ^FO20,30^A0N,20,20^FD${name}^FS
      ^FO20,70^BY3^BCN,90,,,,A^FD${code}^FS
      ^XZ`
    );
  };

  useEffect(() => {
    initBrowserPrint();
    // _printCode();
  }, []);

  useEffect(() => {
    // _fetchApi(`${apiURL()}/lab/patient/info/${requestPatientid}`, (data) => {
    //   if (data) {
    //     console.log(data)
    //     setRequestPatientInfo(data.results[0])
    //   }
    // })

    _fetchApi(
      `${apiURL()}/lab/patient/info/${requestPatientid}`,
      (data) => {
        if (data.success) {
          let info = data.results[0];
          let ageY = moment().diff(info.dob, "years");
          let ageM = ageY < 1 ? moment().diff(info.dob, "months") : "";
          setRequestPatientInfo((p) => ({
            ...p,
            ...info,
            clientAccount: info.accountNo,
            patientId: info.id,
            ageY,
            ageM,
          }));
        }
      },
      (err) => console.log(err)
    );
  }, [requestPatientid]);

  const submitToQMS = (list = []) => {
    // console.log("Submitting to QMS");
    // if (list.length) {
    //   list.forEach((item) => {
    //     // console.log(item, "===========to QMS============");
    //     // _postApi(, item);
    //     fetch(`${QUEUE_MGT_SYS}/api/patient/add`, {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         secret: '123f7f7c7d2358e15e90f532f3eca3c9',
    //       },
    //       body: JSON.stringify(item),
    //     })
    //       .then((raw) => raw.json())
    //       .then((resp) => {
    //         // console.log(resp);
    //         console.log('Queue number successfully generated')
    //       })
    //       .catch((err) => {
    //         // console.log(err);
    //         console.log('Error generating queue number', err)
    //       })
    //   })
    // }
  };

  // const _printCode = () => {
  //   generateBarcode(selectedLabs, patientInfo, (labels, newLabList) => {
  //     console.log(labels, "==========>");
  //     console.log(newLabList, "<========");
  //   });
  // };

  const getNextBeneficiaryId = async (acc) => {
    try {
      const response = await fetch(
        `${apiURL()}/client/nextBeneficiaryId/${acc}/${facilityId}`
      );
      return await response.json();
    } catch (error) {
      return error;
    }
  };

  /**
   * Properties to capture in lab setup
   * - Collect sample or not
   * - Single Result or Grouped
   * - Account head for the test
   *
   */

  const submit = () => {
    setLoading(true);

    let patientObj = patientInfo;
    if (isPendingRequest) {
      cb();
      // console.log('Submitting tests since it is a request')
      // submitLab(requestPatientInfo)
    } else {
      // let patientObj = patientInfo
      // if (partPayment.enabled) {
      //   if (patientObj.accountType === 'Walk-In') {
      //     _fetchApi(`${apiURL()}/client/nextId`, (data) => {
      //       if (data.success && !isEdit) {
      //         let acc = data.results.accountNo
      //         patientObj.clientAccount = acc
      //         patientObj.clientBeneficiaryAcc = 1
      //         patientObj.patientId = `${acc}-1`
      //         patientObj.accountType = 'Family'
      //       }

      //       submitLab(patientObj)
      //     })
      //   }
      // } else {
      _fetchApi(
        // `${apiURL()}/walkin/instant/acct`,
        `${apiURL()}/client/nextId`,
        (data) => {
          if (data.success) {
            let _walkin = data.results.accountNo;
            // setWalkinAcc(_walkin);
            // setPatientInfo((p) => ({
            //   ...p,
            //   clientAccount: _walkin,
            // }));

            if (patientInfo.accountType === "Family") {
              getNextBeneficiaryId(_walkin)
                .then((d) => {
                  // console.log(d);
                  if (d.success) {
                    let ben = d.results.beneficiaryNo;
                    // setPatientInfo((prev) => ({
                    //   ...prev,
                    //   clientBeneficiaryAcc: ben,
                    //   patientId: `${_walkin}-${ben}`,
                    // }));

                    let newClientObj = {};
                    let accIsCorporate =
                      patientInfo.accountType !== "Family" &&
                      patientInfo.receivable_head &&
                      patientInfo.receivable_head !== "";
                    // if (patientInfo.accountType === 'Walk-In' && !isEdit) {
                    if (!isEdit && !existingPatientId && !accIsCorporate) {
                      newClientObj = {
                        clientAccount: _walkin,
                        clientBeneficiaryAcc: ben,
                        patientId: `${_walkin}-${ben}`,
                      };
                      let cl = { ...patientInfo, ...newClientObj };
                      submitLab(cl);
                    }
                    let cl = { ...patientInfo, ...newClientObj };
                    submitLab(cl);
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              getNextBeneficiaryId(patientInfo.clientAccount)
                .then((d) => {
                  // console.log(d);
                  if (d.success) {
                    let ben = d.results.beneficiaryNo;
                    // setPatientInfo((prev) => ({
                    //   ...prev,
                    //   clientBeneficiaryAcc: ben,
                    //   patientId: `${_walkin}-${ben}`,
                    // }));

                    let newClientObj = {};
                    // let accIsCorporate =
                    //   patientInfo.accountType !== 'Family' &&
                    //   patientInfo.receivable_head &&
                    //   patientInfo.receivable_head !== ''
                    // if (patientInfo.accountType === 'Walk-In' && !isEdit) {
                    if (!isEdit && !existingPatientId) {
                      newClientObj = {
                        clientAccount: patientInfo.clientAccount,
                        clientBeneficiaryAcc: ben,
                        patientId: `${patientInfo.clientAccount}-${ben}`,
                      };
                      console.log(
                        patientInfo.clientAccount,
                        ben,
                        "beeeeeeeeeeeeeeeen"
                      );
                    }
                    let cl = { ...patientInfo, ...newClientObj };
                    console.log(cl, "ccccccccccccccccccccllllllllllllllllllll");
                    submitLab(cl);
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          }
        },
        (err) => console.log(err)
      );
    }
  };
  // };

  const submitLab = (patientInfo) => {
    // let client = { ...patientInfo, ...newClientObj };
    let client = patientInfo;
    console.log("================c==========v=============");

    // generateBarcode(selectedLabs, patientInfo, (newLabeList, newLabList) => {

    // console.log(client);
    // let requestStatus = [];
    // let patientId = `${client.clientAccount}-${client.clientBeneficiaryAcc}`;
    let patientId = client.patientId;
    // let labRequests = [];
    // let singular = [];
    // let sampleCollected = [];

    // let grouped = []
    // let singular = []
    // let singlular_groups = {}
    // let department_groups = {}

    // let allTest

    // let totalPerDept = {
    //   "2000": { dept: "Hematology", acct: "20026", amount: "0" },
    //   "4000": { dept: "Microbiology", acct: "20026", amount: "0" },
    //   "5000": { dept: "Radiology", acct: "20026", amount: "0" },
    //   "3000": { dept: "Chemical Pathology", acct: "20026", amount: "0" },
    // };

    // console.log('selected labs ++++++++++++++',selectedLabs)

    // let labsToConsider = selectedLabs
    let added = [];
    let toBeRemoved = oldLabList
      .filter((a) => a.removed)
      .map((a) => ({ ...a, request_id, patient_id: patientId }));
    // let toBeRemoved = []
    if (isEdit) {
      selectedLabs.forEach((item) => {
        let itemInTheInitialList = oldLabList.findIndex(
          (i) => i.test === item.test
        );
        let itemIsNew = !item.booking_no && itemInTheInitialList === -1;

        // console.log(toBeRemoved)
        // console.log(item)
        if (toBeRemoved.findIndex((a) => a.test === item.test) !== -1) {
          toBeRemoved = toBeRemoved.filter((a) => a.test !== item.test);
        } else if (itemIsNew) {
          added.push(item);
        }
      });
    }

    console.log({ added, toBeRemoved });
    // let labsToConsider = []
    let labsToConsider = isEdit ? added : selectedLabs;

    let qms_list = [];
    let newLabList = [];

    labsToConsider
      .sort((a, b) => a.print_type - b.print_type)
      .forEach((lab, i) => {
        // let noCollection =
        //   lab.department === "5000" || facility.type === "hospital";
        let sampleStatus =
          lab.collect_sample === 'yes'
            ? 'pending'
            : lab.to_be_analyzed === 'yes'
              ? 'Sample Collected'
              : lab.upload_doc === 'no'
                ? 'uploaded'
                : lab.to_be_reported === 'yes'
                  ? 'analyzed'
                  : 'pending'

        newLabList.push({
          ...lab,
          test: lab.test,
          patient_id: patientId,
          facilityId,
          // booking_no: [yr, code].join(""),
          price: lab.price,
          percentage: lab.percentage ? lab.percentage : "",
          department: lab.department,
          group: lab.group,
          // code: lab.code,
          // status: "pending",
          status: sampleStatus,
          userId: user.username,
          label_type: lab.label_type,
          noOfLabels: lab.noOfLabels,
          print_type: lab.print_type,
          request_id,
          // visit_id: "",
        });

        // || (!lab.specimen || lab.specimen === "");
        // console.log("doing this");
        // if (lab.print_type === "single") {
        //   // console.log("single");
        //   // console.log("calling booking split");
        //   singular.push({
        //     // ...lab,
        //     test: lab.test,
        //     patient_id: patientId,
        //     facilityId,
        //     // booking_no: [yr, code].join(""),
        //     price: lab.price,
        //     percentage: lab.percentage ? lab.percentage : "",
        //     department: lab.department,
        //     group: lab.group,
        //     code: lab.code,
        //     // status: "pending",
        //     status: sampleStatus,
        //     userId: user.username,
        //     label_type: lab.label_type,
        //     noOfLabels: lab.noOfLabels,
        //     print_type: lab.print_type
        //     // visit_id: "",
        //   });
        //   // _labId = parseInt(_labId) + 1
        //   // code = parseInt(code) + 1;
        //   // console.log(mCount)
        //   // mCount = mCount + 1
        //   // console.log(mCount)
        // } else if (lab.print_type === "singular_group") {
        //   // console.log("singular_group");
        //   if (Object.keys(singlular_groups).includes(lab.group)) {
        //     singlular_groups[lab.group] = [
        //       ...singlular_groups[lab.group],
        //       {
        //         test: lab.test,
        //         patient_id: patientId,
        //         facilityId,
        //         // booking_no: [yr, code].join(""),
        //         price: lab.price,
        //         percentage: lab.percentage ? lab.percentage : 0,
        //         department: lab.department,
        //         group: lab.group,
        //         code: lab.code,
        //         status: sampleStatus,
        //         userId: user.username,
        //         label_type: lab.label_type,
        //     noOfLabels: lab.noOfLabels,
        //     print_type: lab.print_type
        //       },
        //     ];
        //   } else {
        //     singlular_groups[lab.group] = [
        //       {
        //         test: lab.test,
        //         patient_id: patientId,
        //         facilityId,
        //         // booking_no: [yr, code].join(""),
        //         price: lab.price,
        //         percentage: lab.percentage ? lab.percentage : 0,
        //         department: lab.department,
        //         group: lab.group,
        //         code: lab.code,
        //         status: sampleStatus,
        //         userId: user.username,
        //         label_type: lab.label_type,
        //     noOfLabels: lab.noOfLabels,
        //     print_type: lab.print_type
        //       },
        //     ];
        //   }
        //   // code = parseInt(code) + 1;
        //   // let children = selectedLabs[]
        // } else if (lab.print_type === "grouped_by_dept") {
        //   // console.log("grouped_by_dept");
        //   if (Object.keys(department_groups).includes(lab.department)) {
        //     department_groups[lab.department] = [
        //       ...department_groups[lab.department],
        //       {
        //         test: lab.test,
        //         patient_id: patientId,
        //         facilityId,
        //         // booking_no: [yr, code].join(""),
        //         price: lab.price,
        //         percentage: lab.percentage ? lab.percentage : 0,
        //         department: lab.department,
        //         group: lab.group,
        //         code: lab.code,
        //         status: sampleStatus,
        //         userId: user.username,
        //         label_type: lab.label_type,
        //     noOfLabels: lab.noOfLabels,
        //     print_type: lab.print_type
        //       },
        //     ];
        //   } else {
        //     let dept_ = lab.department
        //       ? lab.department.toString()
        //       : lab.department;
        //     department_groups[dept_] = [
        //       {
        //         test: lab.test,
        //         patient_id: patientId,
        //         facilityId,
        //         // booking_no: [yr, code].join(""),
        //         price: lab.price,
        //         percentage: lab.percentage ? lab.percentage : 0,
        //         department: lab.department,
        //         group: lab.group,
        //         code: lab.code,
        //         status: sampleStatus,
        //         userId: user.username,
        //         label_type: lab.label_type,
        //     noOfLabels: lab.noOfLabels,
        //     print_type: lab.print_type
        //       },
        //     ];
        //   }
        //   // code = parseInt(code) + 1;
        // } else {
        //   // console.log("grouped");
        //   grouped.push({
        //     // ...lab,
        //     test: lab.test,
        //     patient_id: patientId,
        //     facilityId,
        //     // booking_no: [yr, code].join(""),
        //     price: lab.price,
        //     percentage: lab.percentage ? lab.percentage : 0,
        //     department: lab.department,
        //     group: lab.group,
        //     code: lab.code,
        //     status: sampleStatus,
        //     userId: user.username,
        //     label_type: lab.label_type,
        //     noOfLabels: lab.noOfLabels,
        //     print_type: lab.print_type
        //     // visit_id: "",
        //   });
        // }

        let testInQmsList =
          qms_list.findIndex((i) => i.department_id === lab.qms_dept_id) !== -1;
        if (!testInQmsList) {
          qms_list.push({
            fullname: client.name,
            phone: client.phone,
            department_id: lab.qms_dept_id,
          });
        }
      });

    // generateLabBookingNo((yr, code) => {
    //   // console.log("===========inside here", yr, code);
    //   // let [_monthCode, _yearCode, _idForMonth] = booking.split("-");
    //   // let initialId = _labId
    //   // console.log()
    //   let s_code = code;
    //   let _s = [];
    //   // let _g = [];
    //   let _s_g = {};
    //   let _d_g = [];

    //   singular.forEach((lab) => {
    //     _s.push({ ...lab, booking_no: [yr, s_code].join("") });
    //     s_code = s_code + 1;
    //   });
    //   // console.log("===========AFTER SINGULAR", s_code, _s);

    //   // console.log("____________ analyzing department_group", department_groups);
    //   Object.keys(department_groups).forEach((gc) => {
    //     // console.log(gc, "gc =<>=<>=");
    //     let __grouped = department_groups[gc].map((i) => ({
    //       ...i,
    //       booking_no: [yr, s_code].join(""),
    //     }));
    //     // console.log(__grouped, "============grouped");
    //     // grouped.push(__grouped);
    //     // _d_g = [..._d_g, ...__grouped]
    //     _d_g.push(__grouped);
    //     // _d_g[gc] = Object.keys(_d_g).length
    //     //   ? [..._d_g[gc], __grouped]
    //     //   : [__grouped];
    //     // console.log(_d_g, "============_d_g");
    //     s_code = s_code + 1;
    //     // console.log("===============inside department_grouped", s_code, _d_g);
    //   });
    //   // console.log("============AFTER department_grouped", s_code,_d_g);

    //   Object.keys(singlular_groups).forEach((groupcode) => {
    //     // console.log(groupcode);
    //     let _grouped = singlular_groups[groupcode].map((i) => ({
    //       ...i,
    //       booking_no: [yr, s_code].join(""),
    //     }));
    //     // console.log(_grouped);
    //     // grouped.push(_grouped);
    //     _s_g[groupcode] = Object.keys(_s_g).length
    //       ? [..._s_g[groupcode], _grouped]
    //       : [_grouped];
    //     // console.log(_s_g);
    //     s_code = s_code + 1;
    //   });
    //   // console.log("===========AFTER SINGULAR GROUP", s_code, _s_g);

    //   // console.log(Object.keys(department_groups));

    //   let newG = grouped.map((lab) => ({
    //     ...lab,
    //     booking_no: [yr, s_code].join(""),
    //   }));

    //   // console.log("===============AFTER GROUP", s_code, newG);
    //   // console.log(newG);
    //   // console.log("===========inside here", yr, code);
    //   // singlular_groups = _s;
    //   // singlular_groups = _s_g;
    //   // department_groups = _d_g;
    //   // grouped = newG;
    //   allTest = {
    //     singular: _s,
    //     singlular_groups: _s_g,
    //     department_groups: _d_g,
    //     grouped: newG,
    //   };
    // });

    generateReceiptNo((rec, receiptNo) => {
      console.log("calling clientname split");

      let clientNameArr = client.name ? client.name.split(" ") : [];
      let firstname = clientNameArr[0] || "";
      let surname = clientNameArr.slice(1).join(" ");
      let other = "";
      let dob = moment()
        .subtract(client.ageY, "years")
        .subtract(client.ageM, "months")
        .subtract(client.ageD, "days")
        .format("YYYY-MM-DD");

      // console.log(dob,requestStatus);

      const obj = {
        ...client,
        firstname,
        surname,
        other,
        id: client.patientId,
        facId: user.facilityId,
        userId: user.id,
        dob: dob,
        receiptsn: rec,
        receiptno: receiptNo,
        depositAmount: 0,
        // modeOfPayment: "Cash",
        description: "New Registration",
        phone: client.phone,
        history: history,
      };
      console.log(obj, "====================obj=====================");

      // const submitHistory = () => {
      //   if (allTest.grouped && allTest.grouped.length) {
      //     saveLabHistory(patientId)
      //   }
      //   if (allTest.singular && allTest.singular.length) {
      //     singular.forEach((m) => {
      //       saveLabHistory({
      //         history: patientInfo.history,
      //         booking: m.booking_no,
      //       })
      //     })
      //   }
      //   // singular: _s,
      //   // singlular_groups: _s_g,
      //   // department_groups: _d_g,
      //   // grouped: newG,
      //   if (allTest.singlular_groups) {
      //     let main_s_g_list = Object.keys(allTest.singlular_groups)
      //     if (main_s_g_list.length) {
      //       main_s_g_list.forEach((k) => {
      //         saveLabHistory({
      //           history: patientInfo.history,
      //           booking: k[0].booking_no,
      //         })
      //       })
      //     }
      //   }
      //   if (allTest.department_groups) {
      //     // let main_d_g_list = Object.keys(allTest.department_groups);
      //     if (allTest.department_groups && allTest.department_groups.length) {
      //       allTest.department_groups.forEach((l) => {
      //         saveLabHistory({
      //           history: patientInfo.history,
      //           booking: l[0].booking_no,
      //         })
      //       })
      //     }
      //   }
      // }

      // console.log(newLabList, qms_list)

      const submitLabRequests = () => {
        console.log("SUBMITTING REQUESTS");
        // console.log(allTest)
        processLabTransaction(
          obj,
          newLabList,
          // allTest.grouped ? allTest.grouped : [],
          // allTest.singular,
          receiptDisplayed,
          () => {
            // _customNotify("Saved lab requisition");
            // setTimeout(() => {
            if (!isRequest) {
              _customNotify("Lab request successfully created");
              // console.log(labels)

              // printLabels(newLabeList);

              console.log("opening receipt", patientInfo, client);
              openReceipt({
                ...patientInfo,
                receiptDisplayed,
                totalAmount: _totalAmount,
                receiptno: rec,
                partPayment,
              });
              // console.log(receiptDisplayed);
              setMainTxnList(receiptDisplayed);
              // setLoading(false);
            }
            cb();
            // }, 500);
          },
          () => _warningNotify("An error occured"),
          // allTest.department_groups,
          // allTest.singlular_groups,
          { partPayment, oldReceiptNo, toBeRemoved, discount },
          (barcode) => {
            // console.log(barcode)
            printLabels(barcode);
          }
        );
      };

      if (isPendingRequest) {
        // submitLabRequests()
        saveTransaction();
        // receiptList,
        // patientId,
        // patient,
        // user,
        // rec,
        // receiptNo,
        // otherOptions,
      } else if (isEdit) {
        console.log("isEdit, so editting riht ");
        updateClientInfo(obj)
          .then((data) => {
            if (data.success) {
              submitLabRequests();
              // submitHistory();
              setLoading(false);
            }
          })
          .catch((err) => {
            console.log("Error updating client info", err);
            setLoading(false);
          });
      } else if (
        obj.accountType !== "Family" &&
        !isEdit &&
        !existingPatientId
      ) {
        obj.accountNo = obj.clientAccount;
        obj.beneficiaryNo = obj.clientBeneficiaryAcc;
        obj.patientId = `${obj.clientAccount}-${obj.clientBeneficiaryAcc}`;
        obj.Gender = "";
        obj.age = "";
        obj.DOB = obj.dob;
        obj.phoneNo = obj.phone;
        obj.email = "";

        createPatientRecord(obj)
          .then((data) => {
            if (data.success) {
              submitLabRequests();
              // submitHistory()
            }
          })
          .catch((err) => {
            console.log("Error saving client info", err);
            setLoading(false);
          });
      } else {
        if (!existingPatientId) {
          // if (partPayment.enabled) {
          // if (obj.accountType === "Walk-In") {
          // _fetchApi(
          //   `${apiURL()}/client/nextId/${facilityId}`,
          //   (data) => {
          //     if (data.success) {
          //       let acc = data.results.accountNo;
          //       obj.clientAccount = acc;
          //       obj.clientBeneficiaryAcc = 1;
          //       obj.patientId = `${acc}-1`;

          createClientAccount2(obj)
            .then((data) => {
              if (data.success) {
                submitLabRequests();
                // submitHistory()
              }
            })
            .catch((err) => {
              console.log("Error saving client info", err);
              setLoading(false);
            });
          //     }
          //   }
          // );
          // }
          // } else {
          //   saveClient(obj)
          //     .then((data) => {
          //       if (data.success) {
          //         submitLabRequests()
          //         // submitHistory()
          //       }
          //     })
          //     .catch((err) => {
          //       console.log('Error saving client info', err)
          //       setLoading(false)
          //     })
          // }
        } else {
          submitLabRequests();
          // submitHistory()
        }
      }
    });

    // submitToQMS(qms_list)
    // });
  };

  // const submitUpdate = () => {
  //   console.log("calling update test");
  //   // update patient info
  //   // save new entry of tests
  //   // update lab history
  //   saveClient(obj)
  //         .then((data) => {
  //           if (data.success) {
  //             submitLabRequests();
  //             submitHistory();
  //           }
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //           setLoading(false);
  //         });
  // };

  const modifyPartPaymentOption = (val) => {
    console.log(partPayment);
    setPartPayment(val);
    if (!partPayment.enabled) {
      setPatientInfo({ partPayment: val, newAccountType: "Family" });
      //   alert('dsfa')
    } else {
      setPatientInfo({
        partPayment: val,
        newAccountType: patientInfo.accountType,
      });
    }
  };

  const printReport = () => {
    window.frames[
      "print_frame"
    ].document.body.innerHTML = document.getElementById(
      "doctor-reporting-fees"
    ).innerHTML;
    window.frames["print_frame"].window.focus();
    window.frames["print_frame"].window.print();
  };

  return (
    <>
      <Card outline color="primary">
        {/* <button onClick={_printCode}>Get Code</button> */}
        <CardHeader className="d-flex flex-direction-row justify-content-between align-items-center">
          <h6>Payment Overview</h6>

          <div>
            <CustomButton
              size="sm"
              color="success"
              onClick={printReport}
              className="mr-1"
            >
              <FaPrint className="mr-1" size={16} />
              Print
            </CustomButton>
            <CustomButton size="sm" color="danger" onClick={closeForm}>
              <FaTimes className="mr-1" size={16} />
              Close
            </CustomButton>
          </div>
        </CardHeader>
        <Scrollbars autoHide style={{ height: "60vh" }}>
          <CardBody>
            {loadingList && <Loading />}
            {/* {JSON.stringify(patientInfo)} */}
            {/*  ============================================= */}
            {/* {JSON.stringify({isRequest,selectedLabs})} */}

            {/* {JSON.stringify(receiptDisplayed)} */}
            <PrintLabReq
              data={receiptDisplayed}
              id="doctor-reporting-fees"
            />
            

            <iframe
              title="doctor-reporting-fees"
              name="print_frame"
              width="0"
              height="0"
              src="about:blank"
              // style={styles}
            />
          </CardBody>
        </Scrollbars>

        {/* <div className="m-1">
          <label htmlFor="amountPaid">Amount Paid: </label>
          <Input
            name="amountPaid"
            // size="sm"
            value={amountPaid}
            onFocus={() => {
              if (amountPaid === _totalAmount || amountPaid === 0) {
                setAmountPaid("");
              }
            }}
            onBlur={() => {
              if (amountPaid === "") {
                setAmountPaid(_totalAmount);
              }
            }}
            onChange={(e) => setAmountPaid(e.target.value)}
          />
        </div> */}

        <OtherPaymentOptions
          discount={discount}
          setDiscount={(m) => setDiscount(m)}
          partPayment={partPayment}
          setPartPayment={modifyPartPaymentOption}
          totalAmount={totalAmount}
        />

        <CustomButton
          disabled={!formIsValid}
          color={!formIsValid ? "dark" : "primary"}
          loading={loading}
          onClick={submit}
        >
          {isEdit ? "Submit Update" : "Checkout"} (₦
          {formatNumber(_totalAmount) || 0})
        </CustomButton>
      </Card>
    </>
  );
}
