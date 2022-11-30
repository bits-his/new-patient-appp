import React, { useEffect } from "react";
import { Card, CardBody, CardHeader, Table } from "reactstrap";
import { useSelector } from "react-redux";
import Scrollbars from "react-custom-scrollbars";
import {
  // checkEmpty,
  // formatNumber,
  generateReceiptNo,
  _convertArrOfObjToArr,
  // _customNotify,
} from "../../utils/helpers";
import { apiURL } from "../../../redux/actions";
import { useState } from "react";
import moment from "moment";
import CustomButton from "../../comp/components/Button";
import { _fetchApi, _postApi, _updateApi } from "../../../redux/actions/api";
import { FaTimes } from "react-icons/fa";
import OtherPaymentOptions from "./registration/other-payment-options";
import { createClientAccount } from "./registration/api";
// import { useHistory } from "react-router";

// const today = moment().format('DD-MM-YYYY');

export default function DisplayDepartemnt({
  setToggle,
  reset = (f) => f,
  selectedLabs = [],
  receiptDisplayed = [],
  // totalAmount = 0,
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
}) {
  // const lab = useSelector((state) => state.labServices);
  // const __history = useHistory();
  const facilityId = useSelector((state) => state.auth.user.facilityId);
  const facility = useSelector((state) => state.facility.info);
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  // const [amountPaid, setAmountPaid] = useState(totalAmount);
  const isHospital = facility.type === "hospital";

  const [partPayment, setPartPayment] = useState({ enabled: false, amount: 0 });
  const [discount, setDiscount] = useState({ enabled: false, amount: 0 });

  let totalAmount = receiptDisplayed.reduce(
    (a, b) => a + parseFloat(b.price),
    0
  );
  let finalTotal = totalAmount - parseFloat(discount.amount);

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
      // if (totalAmount && amountPaid === totalAmount) {
      //   setAmountPaid(totalAmount);
      // }

      return () => {
        document.removeEventListener("keydown", handleKeyPress);
      };
    },
    []
    // [totalAmount]
  );

  // patient-nav
  // TotalSummaryPDF
  // PublicNav
  //..
  // lab-sampling-details
  // microbiology-report
  // lab-result
  // lab-result-large

  const saveTransaction = (trans, cb, __mode) => {
    let __trans = { ...trans, transactionType: __mode };
    if (__mode === "insta") {
      _postApi(
        `${apiURL()}/transactions/new-service/instant-payment`,
        __trans,
        () => {
          setLoading(false);
          cb();
          // reset();
        },
        (err) => {
          console.log(err);
          setLoading(false);
        }
      );
    } else {
      _postApi(
        `${apiURL()}/transactions/new-service/from-deposit`,
        __trans,
        () => {
          setLoading(false);
          cb();
          // reset();
        },
        (err) => {
          console.log(err);
          setLoading(false);
        }
      );
    }
  };

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

  const submit = () => {
    setLoading(true);

    _fetchApi(
      `${apiURL()}/walkin/instant/acct`,
      (data) => {
        if (data.success) {
          let _walkin = data.results.accountNo;
          // setWalkinAcc(_walkin);
          // setPatientInfo((p) => ({
          //   ...p,
          //   clientAccount: _walkin,
          // }));

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

                let newClientObj = {
                  clientAccount: _walkin,
                  clientBeneficiaryAcc: ben,
                  patientId: `${_walkin}-${ben}`,
                }

                let client = {...patientInfo, ...newClientObj};
    // let requestStatus = [];
    // let patientId = `${client.clientAccount}-${client.clientBeneficiaryAcc}`;
    let patientId = client.patientId;
    let labRequests = [];
    let microReq = [];
    let sampleCollected = [];

    // let discounts = []
    let individualDiscount = discount.enabled
      ? discount.discountType === "Fixed"
        ? (discount.discountAmount / totalAmount) * 100
        : discount.discountAmount
      : 0;
    // parseFloat(discount.amount) / receiptDisplayed.length
    // : 0;

    let totalPerDept = {
      "2000": { dept: "Hematology", acct: "20026", amount: "0" },
      "4000": { dept: "Microbiology", acct: "20026", amount: "0" },
      "5000": { dept: "Radiology", acct: "20026", amount: "0" },
      "3000": { dept: "Chemical Pathology", acct: "20026", amount: "0" },
    };

    selectedLabs.forEach((lab, i) => {
      let noCollection =
        lab.department === "5000" || facility.type === "hospital";
      // || (!lab.specimen || lab.specimen === "");

      if (lab.department === "4000" || lab.department === "5000") {
        let [_labId, _monthCode, _yearCode, _idForMonth] = client.booking.split(
          "-"
        );
        microReq.push({
          // ...lab,
          test: lab.test,
          patient_id: patientId,
          facilityId,
          booking_no: [
            parseInt(_labId) + i,
            _monthCode,
            _yearCode,
            parseInt(_idForMonth) + i,
          ].join("-"),
          price: lab.price,
          percentage: lab.percentage ? lab.percentage : "",
          department: lab.department,
          group: lab.group,
          code: lab.code,
          // status: "pending",
          status: noCollection ? "Sample Collected" : "pending",
          userId: user.username,
        });
        // console.log(mCount)
        // mCount = mCount + 1
        // console.log(mCount)
      } else {
        labRequests.push({
          // ...lab,
          test: lab.test,
          patient_id: patientId,
          facilityId,
          booking_no: client.booking,
          price: lab.price,
          percentage: lab.percentage ? lab.percentage : 0,
          department: lab.department,
          group: lab.group,
          code: lab.code,
          status: noCollection ? "Sample Collected" : "pending",
          userId: user.username,
        });
      }

      // if (lab.department === '2000') {
      //   totalPerDept['20001'] =
      //     { ...totalPerDept['20001'], amount: parseInt(totalPerDept['20001'].amount) + parseInt(lab.price)};
      // } else if (lab.department === '4000') {
      //   totalPerDept['20002'] =
      //     { ...totalPerDept['20002'], amount: parseInt(totalPerDept['20002'].amount) + parseInt(lab.price)};
      // } else if (lab.department === '5000') {
      //   totalPerDept['20003'] =
      //     { ...totalPerDept['20003'], amount: parseInt(totalPerDept['20003'].amount) + parseInt(lab.price)};
      // } else if (lab.department === '3000') {
      //   totalPerDept['20004'] =
      //     { ...totalPerDept['20004'], amount: parseInt(totalPerDept['20004'].amount) + parseInt(lab.price)};
      // }
    });

    [...labRequests, ...microReq].forEach((l) => {
      let noCollection =
        l.department === "5000" || facility.type === "hospital";
      if (noCollection) {
        sampleCollected.push(l);
      }
    });
    // console.log(totalPerDept);

    // let destination =
    //   client.modeOfPayment.toLowerCase() === 'cash' ? 'Cash' : 'Bank';
    generateReceiptNo((rec, receiptNo) => {
      let clientNameArr = client.name.split(" ");
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
        depositAmount: partPayment.enabled ? partPayment.amount : 0,
        modeOfPayment: patientInfo.modeOfPayment,
        // depositAmount: 0,
        // modeOfPayment: "Cash",
        description: "New Registration",
        phone: client.phone,
        history: client.history,
        type: "insert",
      };

      // console.log("Here is the results", obj)
      // let transaction = {
      //   facilityId,
      //   amount: totalAmount,
      //   modeOfPayment: '',
      //   source: '',
      //   destination: 'Cash',
      //   description: `New Lab Request for account ${patientInfo.clientAccount}`,
      //   receiptsn: rec,
      //   receiptno: receiptNo,
      //   userId: user.id,
      //   credit: totalPerDept[lab.department].acct,
      //   debit: patientId,
      //   patientId,
      //   clientAccount: patientInfo.clientAccount,
      // };

      const submitHistory = () => {
        if (labRequests.length) {
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
        if (microReq.length) {
          microReq.forEach((m) => {
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

      const collectSamples = () => {
        for (let i = 0; i < sampleCollected.length; i++) {
          let currentLab = sampleCollected[i];
          // currentLab.labno = currentLab.booking_no;
          _updateApi(`${apiURL()}/lab/request/update`, currentLab);
        }
      };

      const submitLabRequests = (_mode, _accountNo) => {
        if (labRequests.length) {
          let final = labRequests.map(i => ({ ...i, receiptNo: rec }))
          _postApi(
            `${apiURL()}/lab/client/lab-number`,
            {
              id: patientId,
              accountNo: _accountNo,
              labno: patientInfo.booking,
            },
            () => {
              _postApi(
                `${apiURL()}/lab/requests/new`,
                {
                  data: _convertArrOfObjToArr(final),
                },
                () => {
                  let transactionsList = [];
                  receiptDisplayed.forEach((lab) => {
                    // console.log(lab)
                    if (
                      lab.department !== "4000" &&
                      lab.department !== "5000"
                    ) {
                      let finalDiscountAmount;
                      if (discount.enabled) {
                        if (discount.discountType === "Fixed") {
                          let dd =
                            parseFloat(discount.amount) /
                            parseFloat(individualDiscount);
                          finalDiscountAmount = lab.price * dd;
                        } else {
                          finalDiscountAmount =
                            parseFloat(lab.price) *
                            (parseFloat(individualDiscount) / 100);
                        }
                      }

                      transactionsList.push({
                        // transactionType:
                        //   patientInfo.accountType === "Walk-In"
                        //     ? "insta"
                        //     : "deposit",
                        facilityId,
                        department: lab.department,
                        amount: parseFloat(lab.price) - finalDiscountAmount,
                        serviceHead: totalPerDept[lab.department].acct,
                        modeOfPayment: patientInfo.modeOfPayment,
                        source: totalPerDept[lab.department].acct,
                        destination: "Cash",
                        // description: `New Lab Request for account ${patientInfo.clientAccount}`,
                        description: lab.description,
                        receiptsn: rec,
                        receiptno: receiptNo,
                        userId: user.id,
                        credit: totalPerDept[lab.department].acct,
                        debit: patientId,
                        patientId,
                        clientAccount: _accountNo,
                        transaction_source: _accountNo,
                        discount: finalDiscountAmount,
                      });
                    }
                  });

                  
                  if (isHospital) {
                    transactionsList.forEach((trans) => {
                      _postApi(
                        `${apiURL()}/transactions/lab-new-service/instant-payment`,
                        trans,
                        () => {
                          setLoading(false);
                          // reset();
                        },
                        (err) => {
                          console.log(err);
                          setLoading(false);
                        }
                      );
                    });
                  }else{
                    transactionsList.forEach((trans) => {
                      saveTransaction(
                        trans,
                        () => console.log("Transaction recorded"),
                        _mode
                      // _postApi(
                      //   `${apiURL()}/transactions/new-service/instant-payment`,
                      //   trans,
                      //   () => {
                      //     setLoading(false);
                      //     // reset();
                      //   },
                      //   (err) => {
                      //     console.log(err);
                      //     setLoading(false);
                      //   }
                      );
                    });
                  }
                 

                  // _customNotify("Lab request successfully created");
                  // openReceipt({
                  //   ...patientInfo,
                  //   transactionsList,
                  //   totalAmount,
                  // });
                  setMainTxnList(transactionsList);
                },
                (err) => {
                  console.log(err);
                  setLoading(false);
                }
              );
            },
            (err) => {
              console.log(err);
            }
          );
        }
        if (microReq.length) {
          let _list = [];
          microReq.forEach((i) =>
            _list.push({
              id: patientId,
              accountNo: _accountNo,
              transaction_source: _accountNo,
              // accountNo: patientInfo.clientAccount,
              labno: i.booking_no,
            })
          );

          for (let k = 0; k < _list.length; k++) {
            let currLab = _list[k];
            _postApi(
              `${apiURL()}/lab/client/lab-number`,
              currLab,
              () => {
                console.log("success");
              },
              (err) => {
                console.log(err);
              }
            );

            if (k === _list.length - 1) {
              for (let l = 0; l < microReq.length; l++) {
                let _th = {...microReq[l], receiptNo: rec};
                // console.log(_th);
                _postApi(
                  `${apiURL()}/lab/requests/new`,
                  {
                    data: _convertArrOfObjToArr([_th]),
                  },
                  () => {
                    console.log("success");
                  },
                  (err) => {
                    console.log(err);
                    // setLoading(false);
                  }
                );

                if (l === microReq.length - 1) {
                  let transactionsList = [];
                  receiptDisplayed.forEach((lab, index) => {
                    // console.log(lab)
                    if (
                      lab.department === "4000" ||
                      lab.department === "5000"
                    ) {
                      let finalDiscountAmount;
                      if (discount.enabled) {
                        if (discount.discountType === "Fixed") {
                          let dd =
                            parseFloat(discount.amount) /
                            parseFloat(individualDiscount);
                          finalDiscountAmount = lab.price * dd;
                        } else {
                          finalDiscountAmount =
                            parseFloat(lab.price) *
                            (parseFloat(discount.discountAmount) / 100);
                        }
                      }

                      transactionsList.push({
                        // transactionType:
                        //   patientInfo.accountType === "Walk-In"
                        //     ? "insta"
                        //     : "deposit",
                        facilityId,
                        department: lab.department,
                        // amount: lab.price,
                        amount:
                          parseFloat(lab.price) -
                          parseFloat(finalDiscountAmount),
                        serviceHead: totalPerDept[lab.department].acct,
                        modeOfPayment: patientInfo.modeOfPayment,
                        source: totalPerDept[lab.department].acct,
                        destination: "Cash",
                        // description: `New Lab Request for account ${patientInfo.clientAccount}`,
                        description: lab.description,
                        receiptsn: rec,
                        receiptno: receiptNo,
                        userId: user.id,
                        credit: totalPerDept[lab.department].acct,
                        debit: patientId,
                        patientId,
                        // clientAccount: patientInfo.clientAccount,
                        clientAccount: _accountNo,
                        transaction_source: _accountNo,
                        discount: finalDiscountAmount,
                      });
                    }
                  });

                  transactionsList.forEach((trans) => {
                    saveTransaction(
                      trans,
                      () => {
                        console.log("Transaction successful.");
                      },
                      _mode
                    // _postApi(
                    //   `${apiURL()}/transactions/new-service/instant-payment`,
                    //   trans,
                    //   () => {
                    //     setLoading(false);
                    //     // reset();
                    //   },
                    //   (err) => {
                    //     console.log(err);
                    //     setLoading(false);
                    //   }
                    );
                  });

                  // _customNotify("Lab request successfully created");
                  // openReceipt({
                  //   ...patientInfo,
                  //   transactionsList,
                  //   totalAmount,
                  // });
                  // console.log(transactionsList);
                  setMainTxnList(transactionsList);
                }
              }
            }
          }

          // _postApi(
          //   `${apiURL()}/lab/client/lab-number`,
          //   {
          //     id: patientId,
          //     accountNo: patientInfo.clientAccount,
          //     labno: patientInfo.booking,
          //   },
          //   () => {
          // _postApi(
          //   `${apiURL()}/lab/requests/new`,
          //   {
          //     data: _convertArrOfObjToArr(labRequests),
          //   },
          //   () => {
          // let transactionsList = [];
          // selectedLabs.forEach((lab, index) => {
          //   transactionsList.push({
          //     transactionType:
          //       patientInfo.accountType === "Walk-In"
          //         ? "insta"
          //         : "deposit",
          //     facilityId,
          //     department: lab.group,
          //     amount: lab.price,
          //     serviceHead: totalPerDept[lab.department].acct,
          //     modeOfPayment: patientInfo.modeOfPayment,
          //     source: totalPerDept[lab.department].acct,
          //     destination: "Cash",
          //     // description: `New Lab Request for account ${patientInfo.clientAccount}`,
          //     description: lab.description,
          //     receiptsn: rec,
          //     receiptno: receiptNo,
          //     userId: user.id,
          //     credit: totalPerDept[lab.department].acct,
          //     debit: patientId,
          //     patientId,
          //     clientAccount: patientInfo.clientAccount,
          //   });
          // });

          // transactionsList.forEach((trans) => {
          //   _postApi(
          //     `${apiURL()}/transactions/new-service/instant-payment`,
          //     trans,
          //     () => {
          //       setLoading(false);
          //       // reset();
          //     },
          //     (err) => {
          //       console.log(err);
          //       setLoading(false);
          //     }
          //   );
          // });

          // _customNotify("Lab request successfully created");
          // openReceipt({
          //   ...patientInfo,
          //   transactionsList,
          //   totalAmount,
          // });
          //   },
          //   (err) => {
          //     console.log(err);
          //     setLoading(false);
          //   }
          // );
          //   },
          //   (err) => {
          //     console.log(err);
          //   }
          // );
        }

        setTimeout(() => {
          collectSamples();
        }, 1000);

        openReceipt({
          ...patientInfo,

          totalAmount,
          discount: discount.amount,
          finalTotal,
        });
      };

      // console.log(existingPatientId, '<==existingPatientId');
      if (!existingPatientId) {
        // If this is a new customer registration,
        if (obj.accountType !== "Walk-In" || partPayment.enabled) {
          // and the selection is not a Walk-In customer type
          // OR part payment is allowed, then we have to create a client account
          // for the customer and charge them from deposit.
          // if (obj.accountType === "Walk-In") {
          let newObj = Object.assign({}, obj, { accountType: "family" });
          // console.log(newObj, '=========-============-=========')
          createClientAccount(newObj)
            .then((data) => {
              if (data.success) {
                // setPatient()
                let acc_no = data.results.accountNo;
                submitLabRequests("deposit", acc_no);
                submitHistory();
              }
              setLoading(false);
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
            });
          // } else {
          //   submitLabRequests("deposit", acc_no);
          //         submitHistory();
          // }
        } else {
          // else if the customer is a Walk-In customer and is paying in full
          // then we just save the customer as a Walk-In customer without account no.
          saveClient(obj)
            .then((data) => {
              if (data.success) {
                submitLabRequests("insta");
                submitHistory();
              }
              setLoading(false);
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
            });
        }
        // saveClient(obj)
        //   .then((data) => {
        //     if (data.success) {
        //       submitLabRequests();
        //       submitHistory();
        //     }
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //     setLoading(false);
        //   });
      } else {
        // If the client is already registered
        if (partPayment.enabled) {
          // and wishes for part payment
          if (obj.accountType !== "Walk-In") {
            // existing account but not a walk-in: deposit service
            submitLabRequests("deposit", obj.clientAccount);
            submitHistory();
          } else {
            // existing account but a walk-in: create account for client
            // and update client info with the acc no
            // && run deposit service
            /**
             * NB:
             * Update the client account number
             */
            let newObj = Object.assign({}, obj, {
              accountType: "family",
              type: "update",
            });

            createClientAccount(newObj)
              .then((data) => {
                if (data.success) {
                  let acc_no = data.results.accountNo;
                  submitLabRequests("deposit", acc_no);
                  submitHistory();
                }
                setLoading(false);
              })
              .catch((err) => {
                console.log(err);
                setLoading(false);
              });
            // submitLabRequests("deposit");
            // submitHistory();
          }
        } else {
          // client does not wish for part payment
          if (obj.accountType !== "Walk-In") {
            // and account type is not Walk-In
            submitLabRequests("deposit", obj.clientAccount);
            submitHistory();
          } else {
            // but account is Walk-In
            submitLabRequests("insta");
            submitHistory();
          }
        }
        // submitLabRequests();
        // submitHistory();
      }
    });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      },
      (err) => console.log(err)
    );
    
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
            {/* {JSON.stringify(patientInfo)} */}
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
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() => removeTest(item)}
                        >
                          <FaTimes className="ml-1 text-danger" />
                        </span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Scrollbars>

        <OtherPaymentOptions
          discount={discount}
          setDiscount={(m) => setDiscount(m)}
          partPayment={partPayment}
          setPartPayment={(m) => setPartPayment(m)}
          totalAmount={totalAmount}
        />

        <CustomButton
          disabled={!formIsValid}
          color={!formIsValid ? "dark" : "primary"}
          loading={loading}
          onClick={submit}
        >
          {existingPatientId ? "Submit Update" : "Checkout"}
          {/* (₦{formatNumber(totalAmount) || 0}) */}
          (₦{finalTotal})
          
          {/* {existingPatientId ? "Submit Update" : "Checkout"} (₦
          {formatNumber(totalAmount) || 0}) */}
        </CustomButton>
      </Card>
    </>
  );
}
