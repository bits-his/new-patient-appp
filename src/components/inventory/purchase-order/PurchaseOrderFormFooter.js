import React, { useEffect, useState } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { useHistory, useLocation } from "react-router";
import { CardFooter, Row, Col, FormGroup, Label, Input } from "reactstrap";
import { apiURL } from "../../../redux/actions";
import { _fetchApi } from "../../../redux/actions/api";
import CustomButton from "../../comp/components/Button";
import { formatNumber } from "../../utils/helpers";
import AdditionalExpenses from "../AdditionalExpenses";
import PurchaseOrderFormTable from "./PurchaseOrderFormTable";
import ViewAdditionalExpenses from "./ViewAdditionalExpenses";

function PurchaseOrderFormFooter({
  tableData,
  gRemarkData,
  handlePriceChange = (f) => f,
  handleTableInputChange = (f) => f,
  handleDelete,
  handlePQtychange,
  newExpenses,
  addNewExpenses,
  handleExpInputChange = (f) => f,
  formTitle,
  onInputChange,
  loading,
  handleUpdate,
  handleSubmit,
  auditorReject,
  handleUpdateAuditedFile = (f) => f,
  approvedManagement,
  managementReject,
  approvedReviewer,
  ReviewerReject,
  list = [],
  handleTablechange = (f) => f,
  getOtherExpenses
}) {
  const location = useLocation();
  const history = useHistory();
  const isEditable =
    location.pathname === "/me/new_inventory/purchase_order/form" ||
    location.pathname === "/me/new_inventory/purchase_order/edit";

  const [lists, setList] = useState([]);

  // const handleTablechange = (name, value, index) => {
  //   console.log(name, value, index);
  //   let arr = [];
  //   list.forEach((item, i) => {
  //     if (index === i) {
  //       arr.push({
  //         ...item,
  //         [name]: value,
  //         amount: parseInt(item.price) * parseInt(item.propose_quantity),
  //       });
  //     } else {
  //       arr.push(item);
  //     }
  //   });
  //   setList(arr);
  // };

  const getOtherExpenses1 = () => {
    _fetchApi(
      `${apiURL()}/drugs/get/other/expenses/${formTitle.PONo}`,
      (data) => {
        if (data.results) {
          setList(data.results);
          // let t = totalExpenses;
          // data.results.forEach((i) => (t = t + parseFloat(i.amount)));
          // setTotalExpenses(t);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  useEffect(() => {
    getOtherExpenses(formTitle.PONo);
    getOtherExpenses1()
  }, []);

  let totalAmount = tableData.reduce(
    (a, b) => a + parseFloat(b.propose_amount),
    0
  );
  let totalExpenses =
    newExpenses &&
    newExpenses.reduce((a, b) => a + parseFloat(a.expenses_amnt), 0);
  let totalList = lists.reduce((a, b) => a + parseFloat(b.amount), 0);
  let grandTotal =
    parseFloat(totalAmount) +
    parseFloat(isEditable ? totalExpenses : totalList);
  let formIsValid = tableData.length;
  return (
    <CardFooter>
      <h5 className="text-right">
        Grand Total: ₦{formatNumber(grandTotal) || 0}
      </h5>

      {gRemarkData.map((item) =>
        item.general_remarks.length ? (
          <div className="d-flex justify-content-center">
            <div className="font-weight-bold pr-1">General Remarks: </div>
            {gRemarkData.map((item) => item.general_remarks)}
          </div>
        ) : null
      )}

      <PurchaseOrderFormTable
        tableData={tableData}
        handlePriceChange={handlePriceChange}
        handleTableInputChange={handleTableInputChange}
        handleDelete={handleDelete}
        handlePQtychange={handlePQtychange}
      />
      {/* {JSON.stringify(newExpenses)} */}
      {/* {newExpenses.reduce((a,b) => a.expenses_amnt + b, 0)} */}
      {/* {JSON.stringify(list)} */}

      {location.pathname.includes("/me/new_inventory/purchase_order/form") ||
      location.pathname.includes("/me/new_inventory/purchase_order/edit") ? (
        <AdditionalExpenses
          formTitle={formTitle}
          newExpenses={newExpenses}
          addNewExpenses={addNewExpenses}
          handleExpInputChange={handleExpInputChange}
          list={list}
          handleTablechange={handleTablechange}
        />
      ) : (
        ""
      )}

      {isEditable ? null : <ViewAdditionalExpenses list={lists} />}
      {/* {location.pathname.includes("/me/auditor/purchase/form") ||
          location.pathname.includes("/me/manager/audited/preview") ? (
            <Row>
              <Col md={12}>
                <FormGroup>
                  <Label>General Remark</Label>
                  <Input
                    type="textarea"
                    value={formTitle.remark}
                    name="remark"
                    onChange={onInputChange}
                  />
                </FormGroup>
              </Col>
          </Row>
            ): null} */}

      {location.pathname.includes("/me/auditor/purchase/form") ||
      location.pathname.includes("/me/manager/audited/preview") ||
      location.pathname.includes("/me/reviewer/purchase/form") ||
      location.pathname.includes("/me/reviewer/purchase/form") ? (
        <Row className='no-print'>
          <Col md={12}>
            <FormGroup>
              <Label>General Remark</Label>
              <Input
                type="textarea"
                value={formTitle.general_remark}
                name="general_remark"
                onChange={onInputChange}
              />
            </FormGroup>
          </Col>
        </Row>
      ) : null}

      <div className='no-print'>
      {location.pathname.includes("/me/account/purchase/record/preview") ? (
        <center>
          <CustomButton
            loading={loading}
            color="primary"
            className="px-5"
            onClick={() =>
              history.push(
                `/me/account/purchase/record/form?vendor=${formTitle.vendor}`
              )
            }
          >
            Process To Payment
          </CustomButton>
        </center>
      ) : null}

      {location.pathname.includes("/me/new_inventory/purchase_order/form") ? (
        <center>
          <CustomButton
            loading={loading}
            color="primary"
            className="px-5"
            onClick={handleSubmit}
            disabled={!formIsValid}
          >
            Submit
          </CustomButton>
        </center>
      ) : location.pathname.includes("/me/new_inventory/purchase_order/edit") ? (
        <center>
          <CustomButton
            loading={loading}
            color="primary"
            className="px-5"
            onClick={handleUpdate}
          >
            Update
          </CustomButton>
        </center>
      ) : location.pathname.includes("/me/auditor/purchase/form") ? (
        <center>
          <CustomButton
            loading={loading}
            color="danger"
            className="px-5 "
            onClick={() => auditorReject()}
          >
            <AiOutlineClose />
            Reject
          </CustomButton>
          <CustomButton
            loading={loading}
            color="success"
            className="px-5 ml-2"
            onClick={() => handleUpdateAuditedFile()}
          >
            <AiOutlineCheck size={20} /> Approved
          </CustomButton>
        </center>
      ) : location.pathname.includes("/me/manager/audited/edit") ||
        location.pathname.includes("/me/manager/audited/preview") ? (
        <>
          <center>
            <CustomButton
              loading={loading}
              color="success"
              className="px-5 "
              onClick={() => approvedManagement()}
            >
              <AiOutlineCheck size={20} /> Approved
            </CustomButton>
            <CustomButton
              loading={loading}
              color="danger"
              className="px-5 ml-2"
              onClick={() => managementReject()}
            >
              <AiOutlineClose /> Reject
            </CustomButton>
          </center>
        </>
      ) : null}
      {location.pathname.includes("/me/reviewer/purchase/form") ? (
        <center>
          <CustomButton
            loading={loading}
            color="success"
            className="px-5 "
            onClick={() => approvedReviewer()}
          >
            <AiOutlineCheck size={20} /> Approved
          </CustomButton>
          <CustomButton
            loading={loading}
            color="danger"
            className="px-5 ml-2"
            onClick={() => ReviewerReject()}
          >
            <AiOutlineClose /> Reject
          </CustomButton>
        </center>
      ) : null}
      </div>
    </CardFooter>
  );
}

export default PurchaseOrderFormFooter;
