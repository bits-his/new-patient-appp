import React, { useCallback, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { Button, Card, Row, Col, Table, Alert } from "reactstrap";
import {
  AiOutlineFundView,
  AiFillEdit,
  AiOutlineClose,
  AiOutlineCheck,
} from "react-icons/ai";
import { Scrollbars } from "react-custom-scrollbars";
import { CardHeader, CardBody } from "reactstrap";
import { _fetchApi, _postApi, _fetchApiGeneral } from "../../redux/actions/api";
import { apiURL } from "../../redux/actions";
import { useEffect } from "react";
import { _warningNotify, _customNotify, formatNumber } from "../utils/helpers";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import { useDispatch, useSelector } from "react-redux";
// import ExcelGenerator from "../account/ExcelGenerator";
import Modelling from "./modeling";
import DaterangeSelector from "../comp/components/DaterangeSelector";
import { approvedStatus, pendingStatus, rejectedStatus } from "../utils/util";
import SearchBar from "../record/SearchBar";
// import { getOtherExpenses } from "../../../^/untitled/Untitled-1";

const PurchaseOrderTable = ({
  handleSet,
  getPurchaseList,
  PONo,
  handleSubmitRemarks,
  getRemarkByID,
  getSupplierAccInfo,
  form = {},
  handleChange,
}) => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [getAllPurchase, setGetAllPurchase] = useState([]);
  const [, setExcellData] = useState([]);
  const [loading, setLoading] = useState(false);

  const processed_by = useSelector((name) => name.auth.user.username);
  const dispatch = useDispatch();

  const { from, to } = form;

  const getAllPurchases = useCallback(
    () => {
      _fetchApiGeneral(
        `${apiURL()}/purchase-order/pending?query_type=all&from_date=${from}&to_date=${to}`,
        (data) => {
          if (data.success) {
            setGetAllPurchase(data.results);
          }
          // console.log(data.results);
        },
        (err) => {
          console.log(err);
        }
      );
    },
    [from, to]
  );

  const getAllPurchasesPending = () => {
    _fetchApi(
      `${apiURL()}/purchase/order/pending`,
      (data) => {
        setGetAllPurchase(data.results);
      },
      (err) => {
        console.log(err);
      }
    );
  };
  const getPurchaseRecord = () => {
    _fetchApi(
      `${apiURL()}/approved/account/details`,
      (data) => {
        setGetAllPurchase(data.results);
      },
      (err) => {
        console.log(err);
      }
    );
  };
  const getPurchaseManaged = () => {
    _fetchApi(
      `${apiURL()}/purchase/order/managed`,
      (data) => {
        setGetAllPurchase(data.results);
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const getExcellData = () => {
    _fetchApi(
      `${apiURL()}/select/purchase/order/list`,
      (data) => {
        if (data.success) {
          setExcellData(data.results);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };
  // const auditedPurchaseOrderPending = () => {
  //   _fetchApi(
  //     `${apiURL()}/audited/purchase/order`,
  //     (data) => {
  //       setGetAllPurchase(data.results);
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // };
  const user = useSelector((state) => state.auth.user.username);
  const approved = (item) => {
    let data = { data: item, processed_by: user };
    const callBack = () => {
      _customNotify("Approved");
      // history.push("/me/auditor/purchase/table")
      getAllPurchasesPending();
    };
    const error = () => {
      _warningNotify("Not Approved");
    };
    _postApi(`${apiURL()}/update/auditor`, data, callBack, error);
  };

  const reject = (item) => {
    let data = { data: item };
    const callBack = () => {
      _customNotify("Rejected");
      // history.push("/me/auditor/purchase/table")
      getAllPurchasesPending();
    };
    const error = () => {
      _warningNotify("Not Rejected");
    };
    _postApi(`${apiURL()}/reject/auditor`, data, callBack, error);
  };

  const managerApproved = (item) => {
    let data = { data: item, processed_by: processed_by };
    const callBack = () => {
      _customNotify("Approved");
      // auditedPurchaseOrderPending();
      getPendingPurchaseOrder("management");
      // handleSubmitRemarks("Management");
    };
    const error = () => {
      _warningNotify("Error");
    };
    _postApi(`${apiURL()}/manager/approved`, data, callBack, error);
  };

  const approvedReviewer = (item) => {
    let data = {
      po_id: item,
      status: "ReviewerApproved",
      processed_by: processed_by,
    };
    const callBack = () => {
      _customNotify("Approved");
      history.push("/me/reviewer/purchase/table");
      getAllPurchasesPending();
      getPurchaseManaged();
    };
    const error = () => {
      _warningNotify("Not Rejected");
    };
    _postApi(`${apiURL()}/update/reviewer`, data, callBack, error);
  };

  const ReviewerReject = (item) => {
    let data = {
      po_id: item,
      status: "ReviewerReject",
      processed_by: processed_by,
    };
    const callBack = () => {
      _customNotify("Rejected");
      history.push("/me/reviewer/purchase/table");
      getAllPurchasesPending();
      getPurchaseManaged();
    };
    const error = () => {
      _warningNotify("Not Rejected");
    };
    _postApi(`${apiURL()}/update/reviewer`, data, callBack, error);
  };

  const managementReject = (item) => {
    let data = { data: item, processed_by: processed_by };
    const callBack = () => {
      _customNotify("Rejected");
      // history.push("/me/auditor/purchase/table")
      // auditedPurchaseOrderPending();
      getPendingPurchaseOrder("management");
      handleSubmitRemarks("Management");
    };
    const error = () => {
      // _warningNotify("Not Rejected");
    };
    _postApi(`${apiURL()}/management/reject`, data, callBack, error);
  };

  const getPendingPurchaseOrder = (query_type) => {
    setLoading(true);
    _fetchApiGeneral(
      `${apiURL()}/purchase-order/pending?query_type=${query_type}`,
      (data) => {
        setLoading(false);
        if (data.results) {
          setGetAllPurchase(data.results);
          console.log(data.results);
        }
      },
      (err) => {
        setLoading(false);
        console.log(err);
      }
    );
  };

  function getPendingList() {
    if (location.pathname.includes("/me/new_inventory/purchase_order")) {
      getExcellData();
      getAllPurchases();
    } else if (location.pathname.includes("/auditor/purchase/table")) {
      getPendingPurchaseOrder("reviewer");
    } else if (location.pathname.includes("/manager/audited/table")) {
      getPendingPurchaseOrder("management");
      // auditedPurchaseOrderPending();
    } else if (location.pathname.includes("/account/purchase/record/table")) {
      getPendingPurchaseOrder("account");
    } else if (location.pathname.includes("/reviewer/purchase/table")) {
      getPendingPurchaseOrder("auditor");
    }
  }

  useEffect(
    () => {
      getPendingList();

      // let interval = setInterval(() => {
      getPendingList();
      // }, 10000);

      // return () => clearInterval(interval);
    },
    [from, to]
  );

  const [modal, setModal] = useState(false);
  // const toggle=()=>setModal(!modal)
  const history = useHistory();
  // const handleFilterChange =(input)=>{
  //   let data=  getAllPurchase.filter((i) => i.status === input )
  //   setGetAllPurchase(data)
  // }
  let rows = [];
  getAllPurchase &&
    getAllPurchase.forEach((item, i) => {
      if (
        item.vendor.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1 &&
        item.date.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1 &&
        item.po_id.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1 &&
        item.client.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1
      )
        return;

      rows.push(item);
    });
  return (
    <>
      {/* {JSON.stringify(getAllPurchase)} */}
      <Card>
        <CardHeader className="d-flex justify-content-center">
          <h5 className="text-center">PURCHASE ORDER</h5>
        </CardHeader>

        <CardBody>
          <Row>
            <Col md={12}>
              {location.pathname === "/me/new_inventory/purchase_order" ? (
                <DaterangeSelector
                  from={from}
                  to={to}
                  handleChange={handleChange}
                />
              ) : null}
              <SearchBar
                filterText={searchTerm}
                onFilterTextChange={(searchTerm) => setSearchTerm(searchTerm)}
                placeholder="Search by Type or Item name"
              />
            </Col>
          </Row>
          {loading && (
            <div className="text-center">
              <p>Please wait, Loading...</p>
            </div>
          )}
          <Row>
            <Col md={12}>
              <Scrollbars style={{ height: 400 }}>
                <Table bordered>
                  <thead>
                    <tr>
                      <th className="text-center">Date</th>
                      <th className="text-center">PO No.</th>
                      <th className="text-center">Client</th>
                      <th className="text-center">Vendor</th>
                      <th className="text-center">Processed By</th>
                      <th className="text-center">Total(₦)</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((item, index) => {
                      const expensesIsPending = item.status;
                      return (
                        <tr
                          key={index}
                          style={{
                            backgroundColor:
                              expensesIsPending === "Pending"
                                ? "#ffffb3"
                                : expensesIsPending === "Approved"
                                ? approvedStatus
                                : expensesIsPending === "Audited"
                                ? approvedStatus
                                : expensesIsPending === "ManagementReject"
                                ? rejectedStatus
                                : expensesIsPending === "ManagementApproved"
                                ? pendingStatus
                                : expensesIsPending === "Rejected"
                                ? rejectedStatus
                                : expensesIsPending === "Disburse"
                                ? approvedStatus
                                : "#ccffcc",
                          }}
                        >
                          <td>{item.date}</td>
                          <td>{item.po_id}</td>
                          <td>{item.client}</td>
                          <td>{item.vendor}</td>
                          <td>{item.processed_by}</td>
                          <td className="text-right">
                            {formatNumber(item.total_amount) || 0}
                          </td>
                          <td className="d-flex">
                            {location.pathname ===
                            "/me/new_inventory/purchase_order" ? (
                              <>
                                <Button
                                  size="sm"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    getPurchaseList(item.po_id);
                                    getRemarkByID(item.po_id);
                                    handleSet(item);
                                    console.log(item);
                                    // dispatch(getOtherExpenses(item.po_id));
                                    history.push(
                                      `/me/new_inventory/purchase_order/preview`
                                    );
                                  }}
                                >
                                  <AiOutlineFundView size={20} />
                                </Button>
                                {item.status === "Rejected" ? (
                                  <Button
                                    size="sm"
                                    className="ml-1 bg-info"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      getPurchaseList(item.po_id);
                                      getRemarkByID(item.po_id);
                                      handleSet(item);
                                      console.log(item);
                                      history.push(
                                        `/me/new_inventory/purchase_order/edit`
                                      );
                                    }}
                                  >
                                    <AiFillEdit size={20} />
                                  </Button>
                                ) : null}
                              </>
                            ) : null}
                            {location.pathname ===
                            "/me/manager/audited/table" ? (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-primary"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    getPurchaseList(item.po_id);
                                    getRemarkByID(item.po_id);
                                    handleSet(item);
                                    // console.log(item);
                                    history.push(`/me/manager/audited/preview`);
                                  }}
                                >
                                  <AiOutlineFundView size={20} />
                                </Button>
                                {/* <Button
                            className="ml-1 bg-secondary"
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              getPurchaseList(item.po_id);
                              handleSet(item);
                              // console.log(item);
                              history.push(`/me/manager/audited/edit`);
                            }}>
                            <AiFillEdit size={20} />
                          </Button> */}
                                <Button
                                  size="sm"
                                  className="ml-1 bg-success"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    // getPurchaseList(item.po_id);
                                    // handleSet(item);
                                    managerApproved(item.po_id);
                                    // console.log(item);
                                    // history.push(`/me/manager/audited/edit`);
                                  }}
                                >
                                  <AiOutlineCheck size={20} />
                                </Button>
                                <Button
                                  size="sm"
                                  className="ml-1 bg-danger"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    managementReject(item.po_id);
                                  }}
                                >
                                  <AiOutlineClose size={20} />
                                </Button>
                              </>
                            ) : null}
                            {location.pathname ===
                            "/me/reviewer/purchase/table" ? (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-info"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    getPurchaseList(item.po_id);
                                    getRemarkByID(item.po_id);
                                    handleSet(item);
                                    history.push(`/me/reviewer/purchase/form`);
                                  }}
                                >
                                  <AiOutlineFundView size={20} />
                                </Button>
                                <Button
                                  className="ml-1 bg-success"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => approvedReviewer(item.po_id)}
                                >
                                  <AiOutlineCheck size={20} />
                                </Button>
                                <Button
                                  className="ml-1 bg-danger"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    ReviewerReject(item.po_id);
                                  }}
                                >
                                  <AiOutlineClose size={20} />
                                </Button>
                              </>
                            ) : null}
                            {location.pathname ===
                            "/me/auditor/purchase/table" ? (
                              <>
                                <Button
                                  color="info"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    getPurchaseList(item.po_id);
                                    getRemarkByID(item.po_id);
                                    handleSet(item);
                                    history.push(`/me/auditor/purchase/form`);
                                  }}
                                >
                                  <AiOutlineFundView size={20} />
                                </Button>
                                <Button
                                  className="bg-success ml-1"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => approved(item.po_id)}
                                >
                                  <AiOutlineCheck size={20} />
                                </Button>

                                <Button
                                  className="ml-1 bg-danger"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => reject(item.po_id)}
                                >
                                  <AiOutlineClose size={20} />
                                </Button>
                              </>
                            ) : null}

                            {location.pathname ===
                            "/me/account/purchase/record/table" ? (
                              <>
                                <Button
                                  size="sm"
                                  className="ml-1"
                                  color="info"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    getPurchaseList(item.po_id);
                                    getRemarkByID(item.po_id);
                                    handleSet(item);
                                    getSupplierAccInfo(item.supplier_code);
                                    // console.log(item);
                                    history.push(
                                      "/me/account/purchase/record/preview"
                                    );
                                  }}
                                >
                                  <AiOutlineFundView size={20} />
                                </Button>
                                <Button
                                  size="sm"
                                  className="ml-1 bg-success"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    history.push(
                                      `/me/account/purchase/record/form?vendor=${
                                        item.vendor
                                      }`
                                    );
                                    getPurchaseList(item.po_id);
                                    getRemarkByID(item.po_id);
                                    handleSet(item);
                                    getSupplierAccInfo(item.supplier_code);
                                  }}
                                >
                                  <small>Payment</small>
                                </Button>
                                <SendTo
                                  setModal={setModal}
                                  modal={modal}
                                  po_no={item.po_id}
                                  getPurchaseRecord={getPurchaseRecord}
                                />
                              </>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                {!rows.length && !loading && (
                  <Alert className="text-center">
                    Nothing to display at this time, please check back later.
                  </Alert>
                )}
              </Scrollbars>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};
export default PurchaseOrderTable;

const SendTo = ({ setModal, modal, po_no, getPurchaseRecord }) => {
  const [dropdownOpen, setOpen] = useState(false);

  const toggle = () => setOpen(!dropdownOpen);
  const [info, setInfo] = useState({
    placeholder: "",
    title: "",
    po_no: po_no,
    status: "",
    modal: false,
  });

  return (
    <>
      <ButtonDropdown
        direction="right"
        isOpen={dropdownOpen}
        toggle={toggle}
        className="ml-1"
        size="sm"
      >
        <DropdownToggle caret color="info">
          <small>Send Back</small>
        </DropdownToggle>
        <DropdownMenu size="sm">
          <DropdownItem
            onClick={() =>
              setInfo({
                placeholder: "Why sending it back to Reviewer?",
                title: "Reviewer",
                po_no: po_no,
                status: "Pending",
                modal: !info.modal,
              })
            }
          >
            <small>Send back</small>
          </DropdownItem>
          {/* <DropdownItem divider />
          <DropdownItem
            // className="bg-gradient-dark text-black"

            onClick={() =>
              setInfo({
                placeholder: "Why sending it back to Auditor?",
                title: "Auditor",
                po_no: po_no,
                status: "Reviewer",
                modal: !info.modal,
              })
            }
          >
            <small>Auditor</small>
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem
            onClick={() =>
              setInfo({
                placeholder: "Why sending it back to Management?",
                title: "Management",
                po_no: po_no,
                status: "Audited",
                modal: !info.modal,
              })
            }
          >
            <small>Management</small>
          </DropdownItem> */}
        </DropdownMenu>
      </ButtonDropdown>
      <Modelling
        modal={info.modal}
        toggle={toggle}
        setInfo={setInfo}
        info={info}
        getPurchaseRecord={getPurchaseRecord}
      />
    </>
  );
};
