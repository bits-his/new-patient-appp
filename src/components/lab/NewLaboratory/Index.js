import React, { useState, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { patientInfoChange } from "../labRedux/actions";
import { Row, Col, Card } from "reactstrap";
import { apiURL } from "../../../redux/actions";
import { _fetchApi } from "../../../redux/actions/api";
import { useHistory, useRouteMatch } from "react-router";
import moment from "moment";
// import { FaTimes } from "react-icons/fa";
// import { PDFViewer } from "@react-pdf/renderer";
import { getAllLabServices } from "../../../redux/actions/lab";
import { padEnd } from "lodash";
import { LabRegShortcuts } from "../../account/Forms/ServiceCardHeader";
import { toCamelCase } from "../../utils/helpers";
// import Loading from "../../comp/components/Loading";

// import SamplingDetails from "../../comp/pdf-templates/lab-sampling-details";

// import LabReceipt from "../../comp/pdf-templates/lab/receipts/combined-receipt-sample";
// import { FallbackComp } from "../../comp/components/FallbackSkeleton";
import ReceiptView from "./registration/receipt-view";

import PatientRegistration from "./PatientRegistration";
import DisplayDepartemnt from "./DisplayDepartment";
import { generateLabBookingNo } from "../../doc_dash/actions/helpers/saveLabRequest";
import { useQuery } from "../../../hooks";

// import BackButton from "../../comp/components/BackButton";

export default function Index({ fullMode = false }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const query = useQuery();
  const existingPatientId = match.params.patientId;
  const existingLabNo = match.params.bookingNo;
  const receiptNo = query.get("receiptNo");
  const request_id = query.get("request_id");
  const labSearchTextRef = useRef();

  // const [removedTests, setRemovedTest] = useState([])

  const [labType, setLabType] = useState("");
  const [patientInfo, setPatientInfo] = useState({
    // accountType: 'Walk-In',
    accountType: "Family",
    clientAccount: "",
    clientBeneficiaryAcc: "",
    patientId: existingPatientId ? existingPatientId : "",
    booking: "",
    patientNo: "",
    // first_name: '',
    name: "",
    age: "",
    gender: "",
    phone: "",
    diagnosis: "",
    modeOfPayment: "Cash",
    history: "",
  });
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptInfo, setReceiptInfo] = useState({});

  const [totalAmount, setTotalAmount] = useState(0);
  // const [labels, setLabels] = useState([]);

  // const [labList, setLabList] = useState([]);
  const labList = useSelector((state) => state.lab.labservices);
  const flatLabList = useSelector((state) => state.lab.rawLabservices);

  const [selectedLabs, setSelectedLabs] = useState([]);
  const [oldLabList, setOldLabList] = useState([]);
  const [receiptDisplayed, setReceiptDisplayed] = useState([]);
  // const [accountTypes, setAccountTypes] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [walkinAcc, setWalkinAcc] = useState("");
  const [mainTxnList, setMainTxnList] = useState([]);
  //  const [patientHistory, setHistory] = useState('');

  const handleHistoryChange = (val) => {
    setPatientInfo((prev) => ({ ...prev, history: val }));
  };
  // const getAccountTypes = () => {
  //   fetch(`${apiURL()}/lab/client/account/types`);
  // };

  // useEffect(
  //   () => {
  //     if (labels.findIndex((i) => i.type === "info") !== -1) {
  //       let newLabels = [];
  //       labels.forEach((i) => {
  //         if (i.type === "info") {
  //           newLabels.push({
  //             type: "info",
  //             name: patientInfo.name,
  //             code: patientInfo.booking,
  //             sort: 0,
  //           });
  //         } else {
  //           newLabels.push(i);
  //         }
  //       });
  //       setLabels(newLabels);
  //     } else {
  //       setLabels([
  //         {
  //           type: "info",
  //           name: patientInfo.name,
  //           booking: patientInfo.booking,
  //           sort: 0,
  //         },
  //       ]);
  //     }
  //   },
  //   [patientInfo.name, patientInfo.booking]
  // );

  const getWalkinAcct = (val) => {
    if (val && val === "Walk-In") {
      _fetchApi(
        `${apiURL()}/walkin/instant/acct`,
        (data) => {
          if (data.success) {
            let _walkin = data.results.accountNo;
            setWalkinAcc(_walkin);
            setPatientInfo((p) => ({
              ...p,
              clientAccount: _walkin,
            }));

            getNextBeneficiaryId(_walkin)
              .then((d) => {
                // console.log(d);
                if (d.success) {
                  let ben = d.results.beneficiaryNo;
                  setPatientInfo((prev) => ({
                    ...prev,
                    clientBeneficiaryAcc: ben,
                    patientId: `${_walkin}-${ben}`,
                  }));
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        },
        (err) => console.log(err)
      );
    }
  };

  const getAccountsPerAccountType = (type) => {
    _fetchApi(
      `${apiURL()}/lab/client/account/by/${type}`,
      (data) => {
        if (data.success) {
          setAccounts(data.results);
        }
      },
      (err) => console.log(err)
    );
  };

  const formatStr = (str) => {
    let splitted = str.split(" ");
    let formatted = [];
    splitted.forEach((i) => formatted.push(toCamelCase(i)));
    return formatted.join(" ");
  };

  const handleChange = ({ target: { name, value } }) => {
    let _val = name === "name" ? formatStr(value) : value;
    let newValue = { ...patientInfo, [name]: _val };
    setPatientInfo(newValue);
    dispatch(patientInfoChange(newValue));
  };

  const getLabList = () => {
    dispatch(getAllLabServices());
    //   _fetchApi(
    //     `${apiURL()}/lab/service/tree`,
    //     (data) => {
    //       if (data.success) {
    //         let converted = unflatten(data.results);
    //         setLabList(converted[0]);
    //       }
    //     },
    //     (err) => {
    //       console.log(err);
    //     },
    //   );
  };

  const removeTest = (test) => {
    // console.log(test);
    // code: "201127075518"
    // department: "2000"
    // description: "Prothrombin time"
    // group: ""
    // noOfLabels: 1
    // percentage: 15
    // price: 2500
    // subhead: "2000"
    // test: "2003"
    if (request_id) {
      let modified = oldLabList.map((i) => {
        // if(i.test !== test.title || i.department !== test.dept) {
        // console.log(i.test, test.test, i.department, test.department)
        if (
          (i.test === test.test || i.group === test.test) &&
          i.department === test.department
        ) {
          // console.log('matched')
          return { ...i, removed: true };
        } else {
          return i;
        }
      });
      console.log(modified);
      setOldLabList(modified);
    }
    // else {
    setSelectedLabs((prev) =>
      prev.filter(
        (i) =>
          (i.test !== test.test && i.group !== test.test) ||
          i.department !== test.department
      )
    );
    // }
    setReceiptDisplayed((prev) =>
      prev.filter(
        (i) =>
          (i.test !== test.test && i.group !== test.test) ||
          i.department !== test.department
      )
    );
    setTotalAmount((prev) => parseInt(prev) - parseInt(test.price));

    // if (parseInt(test.noOfLabels) > 0) {
    //   setLabels((p) =>
    //     p.filter(
    //       (i) => i.testCode !== test.subhead && i.testName !== test.description
    //     )
    //   );
    // }
  };

  const handleTestAdd = (test, dept, group) => {
    // console.log(test, dept, group);
    const {
      description,
      title,
      percentage,
      price,
      old_price,
      noOfLabels,
      label_type,
      subhead,
      specimen,
      collect_sample,
      to_be_analyzed,
      to_be_reported,
      account,
      payable_head,
      receivable_head,
      account_name,
      payable_head_name,
      receivable_head_name,
      department_code,
      unit_code,
      unit_name,
      print_type,
      upload_doc,
      qms_dept_id,
      unit,
      range_to,
      range_from,
    } = test;

    // let myrand = Math.floor(Math.random() * 10)
    // let _deptFull = labList.find(i => '')

    // let deptCode = dept === "2000" ? "1" : dept === "3000" ? "2" : dept === "4000" ? "3" : "4"
    // let barcode = `${moment().format(deptCode + "YYMMDD")}`;

    // let barcode = `${moment().format('YY' + moment().dayOfYear() + 'hm')}`
    if (
      selectedLabs.findIndex(
        (i) =>
          (i.test === test.title || i.test === test.test) &&
          // i.group === group &&
          i.department === dept
      ) === -1
    ) {
      // console.log("adding barcode");
      // console.log(test, dept, group, "not found");
      let selected_test = {
        department: dept,
        description,
        group,
        test: title,
        percentage,
        price,
        old_price,
        // code: parseInt(test.noOfLabels) > 0 ? barcode : '',
        noOfLabels,
        subhead,
        account,
        payable_head,
        receivable_head,
        account_name,
        payable_head_name,
        receivable_head_name,
        qms_dept_id,
        collect_sample,
        to_be_analyzed,
        to_be_reported,
        print_type,
        upload_doc,
        specimen,
        label_type,
        department_code,
        unit_code,
        unit_name,
        unit,
        range_from,
        range_to,
      };
      setSelectedLabs((prev) => [...prev, selected_test]);
      setReceiptDisplayed((prev) => [...prev, selected_test]);

      setTotalAmount((prev) => parseInt(prev) + parseInt(test.price));
      //   if (parseInt(test.noOfLabels) > 0) {
      //     // console.log("no of labels > 1");
      //     // if (label_type === "single") {
      //       // console.log("label_type is single");
      //       // setLabels((p) => [
      //       //   ...p,
      //       //   {
      //       //     type: "lab",
      //       //     department: dept,
      //       //     label: description.substr(0, 1),
      //       //     accNo: patientInfo.patientId,
      //       //     timestamp: `${moment().format("DD")}-${moment().format(
      //       //       "MM"
      //       //     )} (${moment().format("hh:mm")}) - ${patientInfo.booking
      //       //       .split("-")
      //       //       .join("")}`,
      //       //     sample: specimen,
      //       //     patientName: patientInfo.name,
      //       //     code: barcode,
      //       //     tests: description,
      //       //     testCode: subhead,
      //       //     testName: description,
      //       //     noOfLabels: noOfLabels,
      //       //     sort_index: labels.length,
      //       //     qms_dept_id,
      //       //   },
      //       // ]);
      //     // } else {
      //       // console.log("label_type is not single");
      //       // if (labels.findIndex((i) => i.group === subhead) !== -1) {
      //       //   // console.log("already contains a label from the same group (dept)");
      //       //   let newLabelList = [];
      //       //   labels.forEach((j) => {
      //       //     if (j.group && j.group === subhead) {
      //       //       // console.log(j.tests.concat(", ", description));
      //       //       newLabelList.push({
      //       //         ...j,
      //       //         tests: j.tests.concat(", ", description),
      //       //       });
      //       //     } else {
      //       //       newLabelList.push(j);
      //       //     }
      //       //   });
      //       //   // setLabels(newLabelList);
      //       // } else {
      //         // console.log("first time adding label from this group");
      //         // setLabels((p) => [
      //         //   ...p,
      //         //   {
      //         //     type: "lab",
      //         //     department: dept,
      //         //     label: description.substr(0, 1),
      //         //     accNo: patientInfo.patientId,
      //         //     timestamp: `${moment().format("DD")}-${moment().format(
      //         //       "MM"
      //         //     )} (${moment().format("hh:mm")}) - ${patientInfo.booking
      //         //       .split("-")
      //         //       .join("")}`,
      //         //     sample: specimen,
      //         //     patientName: patientInfo.name,
      //         //     code: barcode,
      //         //     tests: description,
      //         //     testCode: subhead,
      //         //     testName: description,
      //         //     noOfLabels: noOfLabels,
      //         //     group: subhead,
      //         //     sort_index: labels.length,
      //         //     qms_dept_id,
      //         //   },
      //         // ]);
      //       // }
      //     // }
      //   }
    } else {
      if (request_id) {
        let modified = oldLabList.map((i) => {
          if (i.test === title || i.test === test.test) {
            return { ...i, removed: true };
          } else {
            return i;
          }
        });
        setOldLabList(modified);
      }
      // else {
      setSelectedLabs((prev) =>
        prev.filter((i) => i.test !== test.title || i.department !== dept)
      );
      // }
      setReceiptDisplayed((prev) =>
        prev.filter((i) => i.test !== test.title || i.department !== dept)
      );

      setTotalAmount((prev) => parseInt(prev) - parseInt(test.price));
      // if (parseInt(test.noOfLabels) > 0) {
      //   // console.log("reomve, no of labels > 1");
      //   // if (label_type === "single") {
      //   //   // console.log("remove, label_type === single");
      //   //   let newLL = [];
      //   //   labels.forEach((l) => {
      //   //     if (l.testName !== description) {
      //   //       newLL.push(l);
      //   //     }
      //   //     // else {
      //   //     //   newLL.push(l);
      //   //     // }
      //   //   });
      //   //   // setLabels(newLL);

      //   //   // setLabels((p) => {
      //   //   //   p.filter((i) => i.testName !== test.description);
      //   //   // });
      //   // } else {
      //   //   let newLL = [];
      //   //   labels.forEach((l) => {
      //   //     if (l.group === subhead) {
      //   //       newLL.push({
      //   //         ...l,
      //   //         tests: l.tests
      //   //           .split(", ")
      //   //           .filter((i) => i !== description)
      //   //           .join(", "),
      //   //       });
      //   //     } else {
      //   //       newLL.push(l);
      //   //     }
      //   //   });
      //   //   // setLabels(newLL);
      //   // }
      // }
    }
  };

  const handleAddBatchTest = (list, dept, group, test) => {
    console.log(list, dept, group, test);
    // let rand = Math.floor(Math.random() * 10);
    const {
      description,
      title,
      percentage,
      price,
      old_price,
      noOfLabels,
      subhead,
      specimen,
      collect_sample,
      to_be_analyzed,
      to_be_reported,
      label_type,
      account,
      payable_head,
      receivable_head,
      print_type,
      upload_doc,
      children,
      qms_dept_id,
      account_name,
      payable_head_name,
      receivable_head_name,
      department_code,
      unit_code,
      unit_name,
      unit,
      range_from,
      range_to,
    } = test;

    // check if this item has grandchildren
    // if(children.findIndex(i => i.children.length > 0) === -1){
    //   console.log('This item does not have grandchildren')
    // } else {
    //   console.log('This item has grandchildren')
    // }

    // let barcode = `${moment().format('YY' + moment().dayOfYear() + 'hm')}`

    // if the lab test has not been selected
    if (selectedLabs.findIndex((i) => i.group === group) === -1) {
      // console.log('not found');
      let newList = [];
      // let recList = [];

      newList.push({
        department: dept,
        description: test.description,
        group,
        test: test.title,
        price: test.price,
        old_price: test.old_price,
        percentage: test.percentage,
        // code: parseInt(test.noOfLabels) > 0 ? barcode : '',
        collect_sample: test.collect_sample,
        to_be_analyzed: test.to_be_analyzed,
        to_be_reported: test.to_be_reported,
        account: test.account,
        payable_head: test.payable_head,
        receivable_head: test.receivable_head,
        account_name: test.account_name,
        payable_head_name: test.payable_head_name,
        receivable_head_name: test.receivable_head_name,
        print_type: test.print_type,
        upload_doc: test.upload_doc,
        qms_dept_id: test.qms_dept_id,
        label_type,
        specimen,
        noOfLabels,
        department_code,
        unit_code,
        unit_name,
        unit,
        range_from,
        range_to,
      });

      let newAmt = 0;
      list.forEach((i) => {
        let currPrice =
          i.price && i.price !== 0 && i.price !== "0"
            ? i.price
            : i.children
            ? i.children.reduce((a, b) => a + parseInt(b.price), 0)
            : 0;
        newList.push({
          department: dept,
          description: i.description,
          group,
          test: i.title,
          price: currPrice,
          percentage: i.percentage,
          // code: parseInt(test.noOfLabels) > 0 ? barcode : '',
          collect_sample: i.collect_sample,
          to_be_analyzed: i.to_be_analyzed,
          to_be_reported: i.to_be_reported,
          account: i.account,
          payable_head: i.payable_head,
          receivable_head: i.receivable_head,
          account_name: i.account_name,
          payable_head_name: i.payable_head_name,
          receivable_head_name: i.receivable_head_name,
          print_type: i.print_type,
          upload_doc: i.upload_doc,
          qms_dept_id: i.qms_dept_id,
          label_type,
          specimen,
          noOfLabels,
          department_code: i.department_code,
          unit_code: i.unit_code,
          unit_name: i.unit_name,
          unit: i.unit,
          range_from: i.range_from,
          range_to: i.range_to,
        });
        newAmt = parseInt(newAmt) + parseInt(currPrice);
      });
      setSelectedLabs((prev) => [...prev, ...newList]);
      setReceiptDisplayed((prev) => [
        ...prev,
        {
          department: dept,
          description: description,
          group,
          test: title,
          price:
            price && price !== 0 && price !== "0"
              ? price
              : children
              ? children.reduce((a, b) => a + parseInt(b.price), 0)
              : 0,
          percentage: percentage,
          // code: parseInt(noOfLabels) > 0 ? barcode : '',
          collect_sample,
          to_be_analyzed,
          to_be_reported,
          account,
          payable_head,
          receivable_head,
          account_name,
          payable_head_name,
          receivable_head_name,
          print_type,
          upload_doc,
          qms_dept_id,
          label_type,
          noOfLabels,
          department_code,
          unit_code,
          unit_name,
        },
      ]);

      setTotalAmount((p) => parseInt(p) + parseInt(newAmt));

      // if test has barcode
      // if (parseInt(test.noOfLabels) > 0) {
      // create an array to contain name of all tests to show on the barcode
      // let testNames = [];
      // test.children &&
      //   test.children.forEach((i) => testNames.push(i.description));
      // if (label_type === "single") {
      //   console.log("label_type is single");
      //   // set the labels content
      //   setLabels((p) => [
      //     ...p,
      //     {
      //       label: description.substr(0, 1),
      //       accNo: patientInfo.patientId,
      //       timestamp: `${moment().format("DD")}-${moment().format(
      //         "MM"
      //       )} (${moment().format("hh:mm")}) - ${patientInfo.booking
      //         .split("-")
      //         .join("")}`,
      //       sample: specimen,
      //       patientName: patientInfo.name,
      //       code: barcode,
      //       testCode: subhead,
      //       testName: description,
      //       tests: description,
      //       noOfLabels: noOfLabels,
      //       department: dept,
      //       sort_index: labels.length,
      //       qms_dept_id,
      //     },
      //   ]);
      // } else {
      //   // console.log("label_type is not single");
      //   // console.log(list, dept, group, test)
      //   if (labels.findIndex((i) => i.group === subhead) !== -1) {
      //     // console.log("already contains a label from the same group (dept)");
      //     let newLabelList = [];
      //     labels.forEach((j) => {
      //       if (j.group && j.group === subhead) {
      //         // console.log(j.tests.concat(", ", description));
      //         newLabelList.push({
      //           ...j,
      //           tests: j.tests.concat(", ", description),
      //         });
      //       } else {
      //         newLabelList.push(j);
      //       }
      //     });
      //     // setLabels(newLabelList);
      //   } else {
      //     // console.log("first time adding label from this group");
      //     setLabels((p) => [
      //       ...p,
      //       {
      //         type: "lab",
      //         department: dept,
      //         label: description.substr(0, 1),
      //         accNo: patientInfo.patientId,
      //         timestamp: `${moment().format("DD")}-${moment().format(
      //           "MM"
      //         )} (${moment().format("hh:mm")}) - ${patientInfo.booking
      //           .split("-")
      //           .join("")}`,
      //         sample: specimen,
      //         patientName: patientInfo.name,
      //         code: barcode,
      //         tests: description,
      //         testCode: subhead,
      //         testName: description,
      //         noOfLabels: noOfLabels,
      //         group: subhead,
      //         sort_index: labels.length,
      //         qms_dept_id,
      //       },
      //     ]);
      //   }
      // }
      // }
    } else {
      // else if the test has already been added
      let newAmt = 0;
      list.forEach((i) => {
        if (i.group !== group) {
          newAmt = parseInt(newAmt) + parseInt(i.price);
        }
      });
      if (request_id) {
        let modified = oldLabList.map((i) => {
          if (i.group === group) {
            return { ...i, removed: true };
          } else {
            return i;
          }
        });
        setOldLabList(modified);
      }
      // else {
      setSelectedLabs((prev) => prev.filter((i) => i.group !== group));
      // }
      setReceiptDisplayed((prev) => prev.filter((i) => i.group !== group));
      setTotalAmount((p) => parseInt(p) - parseInt(newAmt));
      // console.log("label already added");
      // if (parseInt(test.noOfLabels) > 0) {
      //   console.log("no of labels > 1");
      //   setLabels((p) =>
      //     p.filter(
      //       (i) =>
      //         i.testCode !== test.subhead && i.testName !== test.description
      //     )
      //   );
      // }
      // if (parseInt(test.noOfLabels) > 0) {
      //   // console.log("reomve, no of labels > 1");
      //   if (label_type === "single") {
      //     // console.log("remove, label_type === single");
      //     let newLL = [];
      //     labels.forEach((l) => {
      //       if (l.testName !== description) {
      //         newLL.push(l);
      //       }
      //       // else {
      //       //   newLL.push(l);
      //       // }
      //     });
      //     // setLabels(newLL);
      //     // setLabels((p) => {
      //     //   p.filter((i) => i.testName !== test.description);
      //     // });
      //   } else {
      //     let newLL = [];
      //     labels.forEach((l) => {
      //       if (l.group === subhead) {
      //         newLL.push({
      //           ...l,
      //           tests: l.tests
      //             .split(", ")
      //             .filter((i) => i !== description)
      //             .join(", "),
      //         });
      //       } else {
      //         newLL.push(l);
      //       }
      //     });
      //     // setLabels(newLL);
      //   }
      // }
    }
    // console.log(list, dept, group);
  };

  const clearForm = () => {
    setPatientInfo({
      accountType: "Walk-In",
      clientAccount: "",
      clientBeneficiaryAcc: "",
      patientId: "",
      booking: "",
      patientNo: "",
      // first_name: '',
      name: "",
      email: "",
      age: "",
      gender: "",
      phone: "",
      diagnosis: "",
      modeOfPayment: "Cash",
      history: "",
    });

    setSelectedLabs([]);
    setReceiptDisplayed([]);
    setTotalAmount(0);
  };

  const closeForm = () => history.goBack();

  const handleKeyPress = (e) => {
    // console.log(e.key)
    switch (e.key) {
      // f2
      // case "F2":
      //   return this.saveCosting();

      // // f6
      // case "F6":
      //   return console.log("Presssed ", e.key);
      // // f7
      // case "F7":
      //   return console.log("Presssed f2", e.key);
      case "Escape":
        return closeForm();
      case "F8":
        return labSearchTextRef.current.focus();
      // case "F10":
      //   return this.saveCosting();
      // e
      // case "e":
      //   this.setState({ editMode: true });
      //   break;

      default:
        return null;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const getNextClientID = async () => {
    try {
      const response = await fetch(`${apiURL()}/client/nextId/${facilityId}`);
      return await response.json();
    } catch (error) {
      return error;
    }
  };

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

  const setRegType = (val) => {
    setPatientInfo((p) => ({ ...p, accountType: val }));
    getAccountsPerAccountType(val);
    getWalkinAcct(val);
  };

  // const getNextPatientId = async () => {
  //   try {
  //     const response = await fetch(
  //       `${apiURL()}/client/next-patient-id/${facilityId}`
  //     );
  //     return await response.json();
  //   } catch (error) {
  //     return error;
  //   }
  // };

  const facilityId = useSelector((state) => state.facility.info.facility_id);

  const getIds = () => {
    getNextClientID()
      .then((d) => {
        // console.log(d);
        if (d.success) {
          let acc = d.results.accountNo;
          setPatientInfo((prev) => ({
            ...prev,
            clientAccount: acc,
          }));
          getNextBeneficiaryId(acc)
            .then((d) => {
              // console.log(d);
              if (d.success) {
                let ben = d.results.beneficiaryNo;
                setPatientInfo((prev) => ({
                  ...prev,
                  clientBeneficiaryAcc: ben,
                }));
              }
            })
            .catch((err) => {
              console.log(err);
            });
          // console.log(d.results.accountNo);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // getNextPatientId()
    //   .then((m) => {
    //     if (m.success) {
    //       let id = m.results.id;
    //       setPatientInfo((prev) => ({
    //         ...prev,
    //         patientId: id,
    //       }));
    //     }
    //   })
    //   .catch((err) => console.log(err));
  };

  const generateBookingNo = useCallback(() => {
    // const monthCode = moment().format("MM");
    // const yearCode = moment().format("YY");

    generateLabBookingNo((yr, code) => {
      setPatientInfo((prev) => ({
        ...prev,
        booking: [yr, code].join(""),
      }));
    });
    // fetch(`${apiURL()}/lab/next/id/${facilityId}`)
    //   .then((raw) => raw.json())
    //   .then((data) => {
    //     if (data.success) {
    // fetch(`${apiURL()}/lab/next/monthid/${facilityId}`)
    //   .then((raw) => raw.json())
    //   .then((data) => {
    //     if (data.success) {
    //       let idForMonth = data.results.labId;
    // setPatientInfo((prev) => ({
    //   ...prev,
    //   booking: `${monthCode}${yearCode}${idForMonth}`,
    // }));
    // setLabels(p => [...p, { type: 'info', name: patientInfo.name, booking: patientInfo.booking}])
    //   }
    // })
    // .catch((err) => {
    //   console.log(err);
    // });
    // }
    // })
    // .catch((err) => {
    //   console.log(err);
    // });
  }, [facilityId]);

  const getPatientInfo = (id) => {
    _fetchApi(
      `${apiURL()}/lab/patient/info/${id}`,
      (data) => {
        if (data.success) {
          let info = data.results[0];
          let ageY = moment().diff(info.dob, "years");
          let ageM = ageY < 1 ? moment().diff(info.dob, "months") : "";
          setPatientInfo((p) => ({
            ...p,
            ...info,
            clientAccount: info.accountNo,
            ageY,
            ageM,
          }));
        }
      },
      (err) => console.log(err)
    );
  };

  const handleAccChange = (acc) => {
    getNextBeneficiaryId(acc.accountNo)
      .then((d) => {
        if (d.success) {
          let ben = d.results.beneficiaryNo;
          setPatientInfo((prev) => ({
            ...prev,
            clientAccount: acc.accountNo,
            clientBeneficiaryAcc: ben,
            patientId: `${acc.accountNo}-${ben}`,
            payable_head: acc.payable_head,
            payable_head_name: acc.payable_head_name,
            receivable_head: acc.receivable_head,
            receivable_head_name: acc.receivable_head_name,
          }));
        }
      })
      .catch((err) => {
        setPatientInfo((p) => ({ ...p, clientAccount: acc.accountNo }));
        console.log(err);
      });

    // setPatientInfo((p) => ({ ...p, clientAccount: acc.accountNo }));
  };

  const getLabInfo = () => {
    _fetchApi(
      `${apiURL()}/lab/requests/info-by-requestId/${request_id}`,
      (data1) => {
        // setReceiptDisplayed(data1.results);
        if (data1.results && data1.results.length) {
          setSelectedLabs(data1.results);
          setOldLabList(data1.results);
          let dept = data1.results[0].department;
          setLabType(padEnd(dept[0], 4, "0"));

          _fetchApi(
            `${apiURL()}/lab/get-lab-receipt/${receiptNo}`,
            (data2) => {
              if (data2.success) {
                // setLabReceipt(data2.results);
                // console.log(data2.results);
                let someT = getTestsToConsider(data2.results, data1.results);
                // console.log(someT);
                setReceiptDisplayed(someT);
                let _total = data2.results.reduce((a, b) => a + b.price, 0);
                setTotalAmount(_total);
              }
            },
            (err) => console.log(err)
          );
        }
      },
      (err) => console.log(err)
    );
  };

  const getTestsToConsider = (_receipt, _labs) => {
    let testsToConsider = [];
    let ungrouped = [];
    _labs.forEach((item) => {
      let testInRawList = _receipt.findIndex(
        (i) => i.description === item.description
      );
      let testInReceipt = _receipt.findIndex(
        (j) => j.test_group === item.description
      );

      if (testInRawList !== -1) {
        testsToConsider.push(item);
        // } else if (testInReceipt !== -1) {
        //   let curr = _receipt[testInReceipt];
        //   testsToConsider.push({ ...curr, description: curr.group_head });
      } else {
        // console.log('not found')
        // console.log(flatLabList);
        // ungrouped.push(item);
        // let t_detail = flatLabList.find((i) => i.title === "4042");
        // console.log(t_detail);
        // let obj = {
        //   booking_no: item.booking_no,
        //   code: item.code,
        //   department:item.department,
        //   description: "S. Paratyphi B (O, H)",
        //   percentage: t_detail.percentage,
        //   price: t_detail.price,
        //   test: t_detail.title,
        //   test_group: '',
        // };
        // if(t_detail.length) {
        //   ungrouped.push(t_detail[0]);
        // }
        // if(labList)
        // let test = rawList[testInRawList]
        // let head = test.group_head;
        // if(testsToConsider.indexOf(j => j.description === head) === -1) {
        //   testsToConsider.push({...test, description: head })
        // }
        // createdAt: "2021-05-28T07:23:16.000Z"
        // description: "WIDAL TEST Ab."
        // enteredBy: "admin"
        // modeOfPayment: "Cash"
        // patient_id: "1-125"
        // price: 800
        // booking_no: "05211207"
        // code: "21148723"
        // department: "4000"
        // description: "S. Paratyphi B (O, H)"
        // percentage: 15
        // price: 200
        // test: "40423"
        // test_group: "4042"
      }
    });

    // console.log(ungrouped, testsToConsider);

    return testsToConsider;
  };

  useEffect(() => {
    if (existingPatientId) {
      // alert(existingPatientId)
      getPatientInfo(existingPatientId);
    } else {
      getIds();
      getAccountsPerAccountType(patientInfo.accountType);
      getWalkinAcct();
    }
    if (existingLabNo) {
      setPatientInfo((prev) => ({
        ...prev,
        booking: existingLabNo,
      }));
      getLabInfo();
    } else {
      generateBookingNo();
    }
    getLabList();
  }, [generateBookingNo, existingPatientId, existingLabNo]);

  const formIsValid =
    patientInfo.name !== "" &&
    patientInfo.clientAccount !== "" &&
    patientInfo.clientAccount !== "0" &&
    patientInfo.clientAccount !== 0 &&
    (patientInfo.ageY !== "" || patientInfo.ageM !== "") &&
    // patientInfo.phone !== '' &&
    // (patientInfo.phone.length >= 11 && patientInfo.phone.length < 15) &&
    selectedLabs.length > 0;

  const toggleReceipt = () => setShowReceipt((d) => !d);

  const openReceipt = (info) => {
    setReceiptInfo(info);
    setTimeout(() => toggleReceipt(), 1500);
  };

  const closeReceipt = () => {
    toggleReceipt();
    history.push("/me/lab/patients");
  };

  const handleLabSelected = (key, lab) => {
    // console.log(lab, key)

    _fetchApi(`${apiURL()}/lab/get-children/${lab.title}`, (data) => {
      if (data.success) {
        if (data.results.length) {
          handleAddBatchTest(
            data.results,
            `${lab.title.substr(0, 1)}000`,
            lab.title,
            lab
          );
          console.log("has children", data.results);
        } else {
          console.log("no child");
          handleTestAdd(lab, `${lab.title.substr(0, 1)}000`, "");
        }
      }
    });
  };

  return (
    <>
      {/* {JSON.stringify({ patientInfo })} */}
      {/* {JSON.stringify({ labels })} */}
      {/* {JSON.stringify({ selectedLabs })} */}
      {/* {JSON.stringify({ flatLabList })} */}
      {/* <BackButton size='sm' /> */}
      <Card outline color="primary" className="mb-1 p-1 mx-0">
        <LabRegShortcuts />
      </Card>
      {showReceipt ? (
        <ReceiptView
          patientInfo={receiptInfo}
          transactionInfo={{ ...receiptInfo, transactionsList: mainTxnList }}
          close={closeReceipt}
          // labels={labels}
          receiptDisplayed={receiptDisplayed}
        />
      ) : (
        <Row>
          <Col md={9}>
            <PatientRegistration
              existingPatientId={existingPatientId}
              existingLabNo={existingLabNo}
              reset={clearForm}
              accounts={accounts}
              walkinAcc={walkinAcc}
              patientInfo={patientInfo}
              handleChange={handleChange}
              labList={labList}
              handleTestAdd={handleTestAdd}
              selectedLabs={selectedLabs}
              handleAddBatchTest={handleAddBatchTest}
              handleAccChange={handleAccChange}
              // regType={regType}
              setRegType={setRegType}
              handleLabSelected={handleLabSelected}
              history={history}
              handleHistoryChange={handleHistoryChange}
              historyMode="write"
              // fullMode={fullMode}
              labType={labType}
              setLabType={(val) => setLabType(val)}
              labSearchTextRef={labSearchTextRef}
            />
            {/* {JSON.stringify({ selectedLabs })} */}
          </Col>
          <Col md={3} className="ml-0 pl-1 mr-0 pr-1">
            {/* <PrintBarcode labels={labels} /> */}
            <DisplayDepartemnt
              // oldLabList={oldLabList}
              openReceipt={openReceipt}
              existingPatientId={existingPatientId}
              patientInfo={patientInfo}
              setPatientInfo={(val) =>
                setPatientInfo((p) => ({ ...p, ...val }))
              }
              reset={clearForm}
              selectedLabs={selectedLabs}
              oldLabList={oldLabList}
              receiptDisplayed={receiptDisplayed}
              totalAmount={totalAmount}
              formIsValid={formIsValid}
              // labels={labels}
              history={history}
              mainTxnList={mainTxnList}
              setMainTxnList={(val) => {
                // console.log(val);
                setMainTxnList((p) => [...p, ...val]);
              }}
              closeForm={closeForm}
              removeTest={removeTest}
              // modeOfPayment={patientInfo.modeOfPayment}
            />
          </Col>
        </Row>
      )}
    </>
  );
}
