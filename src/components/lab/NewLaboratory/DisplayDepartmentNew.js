import React, { useEffect } from "react";
import { Card, CardBody, CardHeader, Input, Table } from "reactstrap";
import { useSelector } from "react-redux";
import Scrollbars from "react-custom-scrollbars";
import {
  // checkEmpty,
  formatNumber,
  generateReceiptNo,
  // _convertArrOfObjToArr,
  _customNotify,
  _warningNotify,
  // _customNotify,
} from "../../utils/helpers";
import { apiURL } from "../../../redux/actions";
import { useState } from "react";
import moment from "moment";
import CustomButton from "../../comp/components/Button";
import { _updateApi } from "../../../redux/actions/api";
import { FaTimes } from "react-icons/fa";
import Loading from "../../comp/components/Loading";
// import { generateLabBookingNo } from "../../doc_dash/actions/helpers/saveLabRequest2";
import { processLabTransaction } from "../../doc_dash/actions/helpers/processLabTransaction2";
// import { useHistory } from "react-router";

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
  labels = [],
  history,
  mainTxnList = [],
  setMainTxnList = (f) => f,
  closeForm = (f) => f,
  removeTest = (f) => f,
  canRemoveTest = true,
  loadingList = false,
  cb = (f) => f,
  isRequest = false,
}) {
  // const lab = useSelector((state) => state.labServices);
  // const __history = useHistory();
  const facilityId = useSelector((state) => state.auth.user.facilityId);
  // const facility = useSelector((state) => state.facility.info);
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [amountPaid, setAmountPaid] = useState(totalAmount);
  // const isHospital = facility.type === "hospital";

  const handleKeyPress = (e) => {
    if (e.key === "F10") {
      if (formIsValid) {
        // submit();
        alert("Save");
      } else {
        alert("Please complete the form!");
      }
    }
  };

  useEffect(
    () => {
      document.addEventListener("keydown", handleKeyPress);
      if (totalAmount && amountPaid === totalAmount) {
        setAmountPaid(totalAmount);
      }

      return () => {
        document.removeEventListener("keydown", handleKeyPress);
      };
    },
    [totalAmount]
  );

  // patient-nav
  // TotalSummaryPDF
  // PublicNav
  //..
  // lab-sampling-details
  // microbiology-report
  // lab-result
  // lab-result-large

  const saveClient = async (client) => {
    try {
      let response = await fetch(`${apiURL()}/lab/client/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client),
      });
      return response.json();
    } catch (error) {
      return error;
    }
  };

  const submit = () => {
    setLoading(true);
    let client = patientInfo;
    // console.log(client)
    // let requestStatus = [];
    // let patientId = `${client.clientAccount}-${client.clientBeneficiaryAcc}`;
    let patientId = client.patientId;
    // let labRequests = [];
    // let singular = [];
    // let sampleCollected = [];
    let grouped = [];
    let singular = [];

    // let totalPerDept = {
    //   "2000": { dept: "Hematology", acct: "20026", amount: "0" },
    //   "4000": { dept: "Microbiology", acct: "20026", amount: "0" },
    //   "5000": { dept: "Radiology", acct: "20026", amount: "0" },
    //   "3000": { dept: "Chemical Pathology", acct: "20026", amount: "0" },
    // };

    selectedLabs.forEach((lab, i) => {
      // let noCollection =
      //   lab.department === "5000" || facility.type === "hospital";
      let sampleStatus =
        lab.collect_sample === "yes"
          ? "pending"
          : lab.to_be_analyzed === "yes"
          ? "Sample Collected"
          : lab.upload_doc === "no"
          ? "uploaded"
          : lab.to_be_reported === "yes"
          ? "analyzed"
          : "pending";

      // || (!lab.specimen || lab.specimen === "");
      // console.log(sampleStatus, lab);
      // generateLabBookingNo((booking) => {
      if (lab.print_type === "single") {
        console.log("not grouped");
        // let [_labId, _monthCode, _yearCode, _idForMonth] = booking.split("-");
        singular.push({
          // ...lab,
          test: lab.test,
          patient_id: patientId,
          facilityId,
          // booking_no: [
          //   parseInt(_labId) + i,
          //   _monthCode,
          //   _yearCode,
          //   parseInt(_idForMonth) + i,
          // ].join("-"),
          price: lab.price,
          percentage: lab.percentage ? lab.percentage : "",
          department: lab.department,
          group: lab.group,
          code: lab.code,
          // status: "pending",
          status: sampleStatus,
          userId: user.username,
          // visit_id: "",
        });
        // console.log(mCount)
        // mCount = mCount + 1
        // console.log(mCount)
      } else {
        console.log("grouped");
        grouped.push({
          // ...lab,
          test: lab.test,
          patient_id: patientId,
          facilityId,
          // booking_no: booking,
          price: lab.price,
          percentage: lab.percentage ? lab.percentage : 0,
          department: lab.department,
          group: lab.group,
          code: lab.code,
          status: sampleStatus,
          userId: user.username,
          // visit_id: "",
        });
      }
    });
    // });

    generateReceiptNo((rec, receiptNo) => {
      // console.log("calling clintname split");

      let clientNameArr = client.name ? client.name.split(" ") : [];
      let firstname = clientNameArr[0] || "";
      let surname = clientNameArr[1] || "";
      let other = clientNameArr.slice(2).join(" ");
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
        id: patientId,
        facId: user.facilityId,
        userId: user.id,
        dob,
        receiptsn: rec,
        receiptno: receiptNo,
        depositAmount: 0,
        // modeOfPayment: "Cash",
        description: "New Registration",
        phone: client.phone,
        history: client.history,
      };

      const submitHistory = () => {
        if (grouped.length) {
          _updateApi(
            `${apiURL()}/lab/request/save-history`,
            {
              history: patientInfo.history,
              labno: patientInfo.booking,
            },
            () => {
              setLoading(false);
            },
            () => {
              setLoading(false);
            }
          );
        }
        if (singular.length) {
          singular.forEach((m) => {
            _updateApi(
              `${apiURL()}/lab/request/save-history`,
              {
                history: patientInfo.history,
                labno: m.booking_no,
              },
              () => {
                setLoading(false);
              },
              () => {
                setLoading(false);
              }
            );
          });
        }
      };

      const submitLabRequests = () => {
        processLabTransaction(
          client,
          grouped,
          singular,
          receiptDisplayed,
          () => {
            // _customNotify("Saved lab requisition");
            setTimeout(() => {
              if (!isRequest) {
                _customNotify("Lab request successfully created");
                openReceipt({
                  ...patientInfo,
                  receiptDisplayed,
                  totalAmount,
                });
                // console.log(receiptDisplayed);
                setMainTxnList(receiptDisplayed);
              }
              cb();
            }, 500);
          },
          () => _warningNotify("An error occured")
        );
        //   // alert('not sure')
        //   console.log('calling submit', grouped, singular)
        //   if (grouped.length) {
        //     let final = grouped.map((i) => ({ ...i, receiptNo: rec }));
        //     _postApi(
        //       `${apiURL()}/lab/client/lab-number`,
        //       {
        //         id: patientId,
        //         accountNo: patientInfo.clientAccount,
        //         labno: patientInfo.booking,
        //       },
        //       () => {
        //         _postApi(
        //           `${apiURL()}/lab/requests/new`,
        //           {
        //             data: _convertArrOfObjToArr(final),
        //           },
        //           () => {
        //             let transactionsList = [];
        //             selectedLabs.forEach((lab) => {
        //               // console.log(lab)
        //               // if (
        //               //   lab.department !== "4000" &&
        //               //   lab.department !== "5000"
        //               // ) {
        //               transactionsList.push({
        //                 transactionType:
        //                   patientInfo.accountType === "Walk-In"
        //                     ? "insta"
        //                     : "deposit",
        //                 facilityId,
        //                 department: lab.department,
        //                 amount: lab.price,
        //                 serviceHead: lab.account,
        //                 modeOfPayment: patientInfo.modeOfPayment,
        //                 source: lab.account,
        //                 destination: "Cash",
        //                 // description: `New Lab Request for account ${patientInfo.clientAccount}`,
        //                 description: lab.description,
        //                 receiptsn: rec,
        //                 receiptno: receiptNo,
        //                 userId: user.id,
        //                 credit: totalPerDept[lab.department].acct,
        //                 debit: patientId,
        //                 patientId,
        //                 clientAccount: patientInfo.clientAccount,
        //               });
        //               // }
        //             });
        //             if (isHospital) {
        //               transactionsList.forEach((trans) => {
        //                 _postApi(
        //                   `${apiURL()}/transactions/lab-new-service/instant-payment`,
        //                   trans,
        //                   () => {
        //                     setLoading(false);
        //                     // reset();
        //                   },
        //                   (err) => {
        //                     console.log(err);
        //                     setLoading(false);
        //                   }
        //                 );
        //               });
        //             } else {
        //               transactionsList.forEach((trans) => {
        //                 _postApi(
        //                   `${apiURL()}/transactions/new-service/instant-payment`,
        //                   trans,
        //                   () => {
        //                     setLoading(false);
        //                     // reset();
        //                   },
        //                   (err) => {
        //                     console.log(err);
        //                     setLoading(false);
        //                   }
        //                 );
        //               });
        //             }

        //             // _customNotify("Lab request successfully created");
        //             // openReceipt({
        //             //   ...patientInfo,
        //             //   transactionsList,
        //             //   totalAmount,
        //             // });
        //             setMainTxnList(transactionsList);
        //           },
        //           (err) => {
        //             console.log(err);
        //             setLoading(false);
        //           }
        //         );
        //       },
        //       (err) => {
        //         console.log(err);
        //       }
        //     );
        //   }

        //   if (singular.length) {
        //     let _list = [];
        //     singular.forEach((i) =>
        //       _list.push({
        //         id: patientId,
        //         accountNo: patientInfo.clientAccount,
        //         labno: i.booking_no,
        //       })
        //     );

        //     for (let k = 0; k < _list.length; k++) {
        //       let currLab = _list[k];
        //       _postApi(
        //         `${apiURL()}/lab/client/lab-number`,
        //         currLab,
        //         () => {
        //           console.log("success");
        //         },
        //         (err) => {
        //           console.log(err);
        //         }
        //       );

        //       if (k === _list.length - 1) {
        //         for (let l = 0; l < singular.length; l++) {
        //           let _th = { ...singular[l], receiptNo: rec };
        //           // console.log(_th);
        //           _postApi(
        //             `${apiURL()}/lab/requests/new`,
        //             {
        //               data: _convertArrOfObjToArr([_th]),
        //             },
        //             () => {
        //               console.log("success");
        //             },
        //             (err) => {
        //               console.log(err);
        //               // setLoading(false);
        //             }
        //           );

        //           if (l === singular.length - 1) {
        //             let transactionsList = [];
        //             selectedLabs.forEach((lab) => {
        //               // console.log(lab);
        //               if (lab.print_type === "single") {
        //                 transactionsList.push({
        //                   transactionType:
        //                     patientInfo.accountType === "Walk-In"
        //                       ? "insta"
        //                       : "deposit",
        //                   facilityId,
        //                   department: lab.department,
        //                   amount: lab.price,
        //                   serviceHead: lab.account,
        //                   modeOfPayment: patientInfo.modeOfPayment,
        //                   source: lab.account,
        //                   destination: "Cash",
        //                   // description: `New Lab Request for account ${patientInfo.clientAccount}`,
        //                   description: lab.description,
        //                   receiptsn: rec,
        //                   receiptno: receiptNo,
        //                   userId: user.id,
        //                   credit: totalPerDept[lab.department].acct,
        //                   debit: patientId,
        //                   patientId,
        //                   clientAccount: patientInfo.clientAccount,
        //                 });
        //               }
        //             });

        //             transactionsList.forEach((trans) => {
        //               _postApi(
        //                 `${apiURL()}/transactions/new-service/instant-payment`,
        //                 trans,
        //                 () => {
        //                   setLoading(false);
        //                   // reset();
        //                 },
        //                 (err) => {
        //                   console.log(err);
        //                   setLoading(false);
        //                 }
        //               );
        //             });

        //             // _customNotify("Lab request successfully created");
        //             // openReceipt({
        //             //   ...patientInfo,
        //             //   transactionsList,
        //             //   totalAmount,
        //             // });
        //             // console.log(transactionsList);
        //             setMainTxnList(transactionsList);
        //           }
        //         }
        //       }
        //     }
      };

      //   // setTimeout(() => {
      //   //   collectSamples();
      //   // }, 1000);

      //   openReceipt({
      //     ...patientInfo,

      //     totalAmount,
      //   });
      // };

      // console.log(existingPatientId, '<==existingPatientId');
      if (!existingPatientId) {
        saveClient(obj)
          .then((data) => {
            if (data.success) {
              submitLabRequests();
              submitHistory();
            }
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      } else {
        submitLabRequests();
        submitHistory();
      }
    });
  };

  return (
    <>
      <Card outline color="primary">
        <CardHeader className="d-flex flex-direction-row justify-content-between align-items-center">
          <h6>Payment Overview </h6>
          <CustomButton size="sm" color="danger" onClick={closeForm}>
            <FaTimes className="mr-1" size={16} />
            Close
          </CustomButton>
        </CardHeader>
        <Scrollbars autoHide style={{ height: "60vh" }}>
          <CardBody>
            {loadingList && <Loading />}
            {/* {JSON.stringify(selectedLabs)} */}

            {/* {JSON.stringify(generateReceiptNo())} */}
            <Table hover striped borderless size="sm">
              <thead>
                <tr>
                  <th className="text-center">Test</th>
                  <th className="text-center">Amount</th>
                </tr>
              </thead>
              <tbody>
                {receiptDisplayed.map((item, i) => (
                  <tr key={i}>
                    <td>{item.description}</td>
                    <td className="text-right">
                      <span className="d-flex flex-direction-row align-items-center justify-content-end">
                        {item.price}
                        {canRemoveTest && (
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => removeTest(item)}
                          >
                            <FaTimes className="ml-1 text-danger" />
                          </span>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Scrollbars>

        <div className="m-1">
          <label htmlFor="amountPaid">Amount Paid: </label>
          <Input
            name="amountPaid"
            // size="sm"
            value={amountPaid}
            onFocus={() => {
              if (amountPaid === totalAmount || amountPaid === 0) {
                setAmountPaid("");
              }
            }}
            onBlur={() => {
              if (amountPaid === "") {
                setAmountPaid(totalAmount);
              }
            }}
            onChange={(e) => setAmountPaid(e.target.value)}
          />
        </div>
        <CustomButton
          disabled={!formIsValid}
          color={!formIsValid ? "dark" : "primary"}
          loading={loading}
          onClick={submit}
        >
          {existingPatientId ? "Submit Update" : "Checkout"} (₦
          {formatNumber(totalAmount) || 0})
        </CustomButton>
      </Card>
    </>
  );
}
