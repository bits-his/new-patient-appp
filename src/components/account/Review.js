import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  // Button,
  // Input,
  Alert,
  Modal,
  ModalHeader,
} from "reactstrap";
import {
  _warningNotify,
  _customNotify,
  formatNumber,
  // generateReceiptNo,
} from "../utils/helpers";
// import { Checkbox } from 'evergreen-ui/commonjs/checkbox'
import { Scrollbars } from "react-custom-scrollbars";
// import { Pane } from 'evergreen-ui'
// import { IoMdCheckmark } from 'react-icons/io'
import Loading from "../loading";
import {
  _deleteApi,
  // _fetchApi,
  _fetchApi2,
  _postApi,
  _updateApi,
} from "../../redux/actions/api";
import { apiURL } from "../../redux/actions";
// import { MdDelete, MdEdit } from 'react-icons/md'
import SearchBar from "../record/SearchBar";
// import PendingIncome from '../lab/NewLaboratory/reports/PendingIncome'
import { PrintStyle } from "../inventory/purchase-order/PurchaseOrderForm";
import moment from "moment";
import DaterangeSelector from "../comp/components/DaterangeSelector";
import { useSelector } from "react-redux";
import AccountReviewTableRow from "./Forms/AccountReviewTableRow";
import CustomButton from "../comp/components/Button";
// import { useSelector } from "react-redux";

function AccountReport() {
  // const facility = useSelector((state) => state.facility.info);
  // const [pendingTransactions, setPendingTransactions] = useState([])
  const [loading, setLoading] = useState(false);
  const [uncheckedList, setUncheckedList] = useState([]);
  const [form, setForm] = useState({
    bank_name: "",
    acct_no: "",
    code: "",
    acct_name: "",
  });
  // const [toggle, setToggle] = useState(false)
  let today = moment().format("YYYY-MM-DD");
  const reportType = "Pending Approval";
  const [reportBy, setReportBy] = useState("All Records");
  const [reviewing, setReviewing] = useState(false);
  const [selected, setSelected] = useState({});
  const user = useSelector((state) => state.auth.user);
  const [paymentInfo, setPaymentInfo] = useState({});
  const [selectedItem, setSelectedItem] = useState({});

  const [range, setRange] = useState({ from: today, to: today });
  // const isHospital = facility.type === "hospital";

  const [patientIncome, setPatientIncome] = useState([]);

  const getPatientIncome = useCallback(
    () => {
      setLoading(true);
      let _report_by = reportBy === "All Records" ? "all" : user.username;
      fetch(
        `${apiURL()}/lab/lab-summary?type=${reportType}&report_by=${_report_by}&from=${
          range.from
        }&to=${range.to}&facilityId=${user.facilityId}`
      )
        .then((raw) => raw.json())
        .then((data) => {
          // console.log(data,'=====================================================')
          setLoading(false);
          if (data.success && data.results) {
            let final = data.results.map((i) => {
              if (
                i.client_type &&
                (i.client_type === "Family" || i.client_type === "")
              ) {
                return {
                  ...i,
                  paid: i.total,
                  balance: 0,
                };
              } else {
                return {
                  ...i,
                  paid: 0,
                  balance: i.total,
                };
              }
            });
            setPatientIncome(final);
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    },
    [range.from, range.to, user, reportType, reportBy]
  );

  const [modal, setModal] = useState(false);

  const handleChange = ({ target: { name, value } }) => {
    setForm((p) => ({ ...p, [name]: value }));
  };

  const toggle = () => setModal(!modal);

  useEffect(
    () => {
      getPatientIncome();

      // const refresh = setInterval(() => {
      //   getPatientIncome()
      // }, 20000)

      // return () => {
      //   clearInterval(refresh)
      // }
    },
    [getPatientIncome]
  );

  // const hanleToggle = () => {
  //   setToggle(!toggle)
  // }
  const handleRangeChange = ({ target: { name, value } }) => {
    setRange((p) => ({ ...p, [name]: value }));
  };

  // useEffect(() => {
  //   getPendingTransactions()
  // }, [])

  // const getPendingTransactions = () => {
  //   setLoading(true)
  //   _fetchApi(
  //     `${apiURL()}/transactions/lab-pending`,
  //     ({ results }) => {
  //       const newData = []
  //       results.forEach((item) => {
  //         if (item.credit !== 0) {
  //           newData.push(item)
  //         }
  //       })
  //       setPendingTransactions(newData)
  //       setLoading(false)
  //     },
  //     (err) => console.log(err),
  //   )
  // }

  // const toggle = () => {
  //   this.setState(prevState => ({
  //     modalIsOpen: !prevState.modalIsOpen,
  //   }));
  // };

  const onUnchecked = (item) => {
    setUncheckedList((prev) => prev.concat(item.reference_no));
  };

  const onChecked = (item) => {
    setUncheckedList((prev) => prev.filter((i) => i !== item.reference_no));
  };

  const handleSubmit = () => {
    setReviewing(true);
    let finalist = [];
    patientIncome.forEach((transaction) => {
      if (!uncheckedList.includes(transaction.reference_no)) {
        finalist.push(transaction);
      }
    });
    if (finalist.length) {
      console.log(finalist);
      _updateApi(
        `${apiURL()}/transactions/review`,
        { finalist, status: "cashier approved" },
        (res) => {
          _customNotify("Review Processed");
          setReviewing(false);
          setUncheckedList([]);
          // getPendingTransactions()
          getPatientIncome();
        },
        (err) => {
          _warningNotify("There was an error from the server");
          setReviewing(false);
        }
      );
    } else {
      _warningNotify("No data to review");
    }
  };

  const handleDelete = (reference_no) => {
    _deleteApi(
      `${apiURL()}/lab/transaction/delete/${reference_no}`,
      {},
      (data) => {
        // if(data.success){
        _customNotify("Deleted successfully");
        getPatientIncome();
        // }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const [filterText, setFilterText] = useState("");
  const [, setChecked] = useState(true);

  const rows = [];
  patientIncome.length &&
    patientIncome.forEach((item) => {
      if (item.fullname.toLowerCase().indexOf(filterText.toLowerCase()) === -1)
        return;

      rows.push(item);
      // }
    });

  const totalAmount = rows.reduce((a, b) => a + parseFloat(b.total), 0);
  const totalPaid = rows.reduce((a, b) => a + parseFloat(b.paid), 0);
  const totalBalance = rows.reduce((a, b) => a + parseFloat(b.balance), 0);

  const handleAmountChange = (val, id) => {
    // console.log(val, id)
    let list = [];
    patientIncome.map((item) => {
      if (item.reference_no === id) {
        return list.push({ ...item, paid: val });
      } else {
        return list.push(item);
      }
    });

    setPatientIncome(list);
  };

  const handleTable = (key, value, j) => {
    // console.log(key, value, j)
    let newArr = [];
    // let list = []
    // patientIncome.map((item) => {
    //   if (item.reference_no === j.reference_no) {
    //     return list.push({ ...item, [key]: value })
    //   } else {
    //     return list.push(item)
    //   }
    // })
    // if (value === 'Bank' || value === 'POS') {
    //   toggle()
    // }

    patientIncome.forEach((item) => {
      if (item.reference_no === j) {
        // console.log('found', item)
        newArr.push({
          ...item,
          [key]: value,
        });
        if (value === "Bank" || value === "POS") {
          toggle();
        }
      } else {
        newArr.push(item);
      }
    });
    setPatientIncome(newArr);
  };

  const processPayment = (item) => {
    // let pInfo = []
    let count = 0;
    // alert(JSON.stringify(item))
    let acct = item.client_id.split("-")[0];
    // generateReceiptNo((rec, receiptNo) => {
    // console.log(item)
    setModal(false);

    _fetchApi2(
      `${apiURL()}/lab/lab-summary?type=pending approval detail&report_by=${
        item.client_id
      }&from=${range.from}&to=${range.to}&facilityId=${user.facilityId}`,
      (data) => {
        // acct: '5000212'
        // amount: '9000'
        // fullname: '368-1'
        // patient_id: '368-1'
        // reference_no: '06102121'

        if (data.results) {
          // console.log(data.results)
          for (let i = 0; i < data.results.length; i++) {
            let curr = data.results[i];
            _postApi(
              `${apiURL()}/txn/cashier-approval`,
              {
                acct,
                revenueAmount: curr.total,
                totalAmount: item.total,
                totalReceivable:
                  i === 0 ? parseFloat(item.total) - parseFloat(item.paid) : 0,
                totalDiscount: i === 0 ? item.discount_amount : 0,
                discountHead: item.discount_head,
                discountHeadName: item.discount_head_name,

                receiptNo: item.reference_no,
                modeOfPayment: item.modeOfPayment,
                patientId: item.client_id,
                patientName: item.fullname,
                txnType: "",
                createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
                payablesHead: item.payable_head,
                payablesHeadName: item.payable_head_name,
                receivablesHead: curr.receivable_head,
                receivablesHeadName: curr.receivable_head_name,
                // cashHead : '',
                bankName: item.bank_name,
                txn_date: moment().format("YYYY-MM-DD"),
                discount: "0",
                // discountHead : '',
                txn_status: "pending",
                amountPaid: i === 0 ? item.paid : 0,
                query_type: "cashier approved",
                revenueHead: curr.account,
                revenueHeadName: curr.account_name,
              },
              // eslint-disable-next-line no-loop-func
              async (resp) => {
                let dd = await resp.json();
                // console.log(dd)
                // setPaymentInfo(dd.data)
                // pInfo.push(dd.data)
                if (count === 0) {
                  _customNotify(
                    `Amount of #${dd.data.totalAmount} has been deposited for ${
                      dd.data.patientName
                    },
                    Receipt: ${dd.data.receiptNo}`
                  );
                  count = count + 1;
                  // setNotificationCount(p => p + 1)
                }
                getPatientIncome();
              },
              (err) => {
                console.log(err);
                _warningNotify("An error occured!");
              }
            );
          }

          // console.log(pInfo)
          // if (pInfo.length) {
          //   if (pInfo[0].patientName && pInfo[0].patientName !== '') {
          //     _customNotify(
          //       `Amount of #${pInfo[0].totalAmount} has been deposited for ${pInfo[0].patientName}
          //         Receipt: ${pInfo[0].receiptNo}`,
          //     )
          //   }
          // }
        }
      },
      (err) => {
        console.log(err);
      }
    );

    // })
  };

  return (
    <div>
      <Card>
        {/* {JSON.stringify({ rows })} */}
        {/* {JSON.stringify(paymentInfo)} */}
        <CardHeader className="d-flex flex-direction-row justify-content-between align-items-center">
          <h5>Review Account Report</h5>
          <CustomButton color="success" onClick={() => getPatientIncome()}>
            Refresh List
          </CustomButton>
        </CardHeader>
        <CardBody>
          <PrintStyle />
          <DaterangeSelector
            from={range.from}
            to={range.to}
            handleChange={handleRangeChange}
          />
          <SearchBar
            placeholder="Search by transaction date"
            onFilterTextChange={(filterText) => setFilterText(filterText)}
            filterText={filterText}
          />

          {/* {JSON.stringify(uncheckedList)} */}
          {/* <div style={{ margin: 10 }} className="d-flex">
         
            <button className="btn btn-outline-primary " onClick={handleSubmit}>
              {reviewing ? (
                'Please wait...'
              ) : (
                <>
                  Approve Marked <IoMdCheckmark />
                </>
              )}
            </button>
          </div> */}
          {/* {loading && <Loading />} */}
          {rows.length ? null : (
            <Alert color="primary" className="text-center">
              There is no pending transaction at this time, check back later.
            </Alert>
          )}
          <Scrollbars style={{ height: 500 }}>
            <Table size="sm" bordered>
              <thead>
                <tr>
                  <th className="text-center">S/N</th>
                  <th className="text-center">Date</th>
                  <th className="text-center">Account</th>
                  <th className="text-center">Patient Name</th>
                  <th className="text-center">Total Amount (₦)</th>
                  <th className="text-center">Amount Paid (₦)</th>
                  <th className="text-center">Balance (₦)</th>
                  {/* <th className="text-center">Mode Of Payment</th> */}
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item, index) => (
                  <AccountReviewTableRow
                    key={index}
                    i={index}
                    item={item}
                    handleAmountChange={handleAmountChange}
                    processPayment={processPayment}
                    handleTable={handleTable}
                    modal={modal}
                    toggle={toggle}
                    selected={selected}
                    setSelected={(x) => setSelected(x)}
                    form={form}
                    handleChange={handleChange}
                    onBankSelect={(c, d) => {
                      // console.log(c,d)
                      // (account) => {
                      console.log(d.account_no, c.reference_no);
                      handleTable(
                        "modeOfPayment",
                        selected.modeOfPayment,
                        selected.reference_no
                      );
                      handleTable(
                        "bank_name",
                        d.account_no,
                        selected.reference_no
                      );
                      setSelected((p) => ({ ...p, bank_name: d.account_no }));

                      toggle();
                      // }
                    }}
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                  />
                ))}

                <tr>
                  <th colSpan={3} className="text-right">
                    Total
                  </th>
                  <th className="text-right">
                    {totalAmount && `₦${formatNumber(totalAmount)}`}
                  </th>
                  <th className="text-right">
                    {totalPaid && `₦${formatNumber(totalPaid)}`}
                  </th>
                  <th className="text-right">
                    {totalBalance && `₦${formatNumber(totalBalance)}`}
                  </th>
                </tr>
              </tbody>
            </Table>

            {/* {loading ? (
              <Loading />
            ) : (
              <div>
                <Table responsive bordered sm>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Receipt No</th>
                      <th>Amount</th>
                      <th>Mark</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>{rows}</tbody>
                </Table>
              </div>
            )} */}
          </Scrollbars>
        </CardBody>
        <div className="row m-0">
          <div className="col-md-6 text-center border border-secondary py-1">
            Pending Transaction
          </div>
          <div
            className="col-md-6 text-center border border-secondary py-1"
            style={{ backgroundColor: "#e6aeaa" }}
          >
            Pending Discount Approval
          </div>
        </div>
      </Card>
      {/* <ReportModal 
          toggle={toggle}
          modal={modalIsOpen}
        /> */}
    </div>
  );
}

export default AccountReport;

// function AlertModal () {
//   return <Modal>
//     <ModalHeader></ModalHeader>
//   </Modal>
// }
