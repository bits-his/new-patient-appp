import React, { useState } from "react";
import { useLocation } from "react-router";
import Expenditure from "./Expenditure";
import { _fetchApi } from "../../redux/actions/api";
import { apiURL } from "../../redux/actions";
import PurchaseOrderTable from "../inventory/PurchaseOrderTable";
import PurchaseOrderForm from "../inventory/purchase-order/PurchaseOrderForm";

function RecordPurchase() {
  const [tableData, setTableData] = useState([]);
  const [additionalExp, setAdditionalExp] = useState([]);
  let [totalAdditionalExp, setTotalAdditionalExp] = useState(0);
  
  const formData = {
    exchange_rate: 1,
    item_name: "",
    specification: "",
    propose_quantity: 0,
    quantity_available: "",
    price: 0,
    propose_amount: "",
    status: "pending",
    exchange_type: "",
    total_amount: "",
    identifier: "add",
    remark: "",
    auditor_remark: "",
  };
  const [form, setForm] = useState(formData);

  const [formTitle, setFormTitle] = useState({
    PONo: "",
    date: "",
    type: "Local",
    vendor: "",
    client: "",
    remark: "",
    auditor_remark: "",
    general_remark: "",
    supplier_code: "",
  });
  const [supplierAccountInfo, setSupplierAccountInfo] = useState([]);
  const location = useLocation();
  const getPurchaseList = (id) => {
    _fetchApi(
      `${apiURL()}/get/purchase/order/list/${id}`,
      (data) => {
        getOtherExpenses(id)
        console.log(data);
        let arr = [];
        data.results.forEach((item) => {
          arr.push({ ...item, propose: item.price * item.propose_quantity });
        });
        setTableData(arr);
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const getOtherExpenses = (id) => {
    _fetchApi(
      `${apiURL()}/drugs/get/other/expenses/${id}`,
      (data) => {
        if (data.results) {
          setAdditionalExp(data.results);
          let t = totalAdditionalExp;
          data.results.forEach((i) => (t = t + parseFloat(i.amount)));
          setTotalAdditionalExp(t);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const [remarkData, setRemarkData] = useState([]);

  const [gRemarkData, setGRemarkData] = useState([]);
  const getRemarkByID = (requestNo) => {
    _fetchApi(
      `${apiURL()}/account/get-max/remarks/${requestNo}`,
      (data) => {
        const remarks = [];
        const gRemarks = [];
        data.results.forEach((item) => {
          if (item.remarks_id.toString() === item.request_no.toString()) {
            gRemarks.push(item);
          } else {
            remarks.push(item);
          }
        });
        setRemarkData(remarks);
        setGRemarkData(gRemarks);
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const onInputChange = ({ target: { name, value } }) => {
    setFormTitle((prev) => ({ ...prev, [name]: value }));
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSet = (item) => {
    setFormTitle({
      PONo: item.po_id,
      date: item.date,
      type: item.type,
      vendor: item.vendor,
      client: item.client,
      auditor_remark: item.auditor_remark,
      grn_number: item.grn_number,
      supplier_code: item.supplier_code,
    });
    // setTypeahead()
  };

  const handleTableInputChange = (name, value, index) => {
    // console.log("asdfdasfdsfsdf", name, value);
    let arr = [];
    remarkData.forEach((item, i) => {
      if (index === i) {
        arr.push({
          ...item,
          [name]: value,
        });
      } else {
        arr.push(item);
      }
    });
    setRemarkData(arr);
  };
  const getSupplierAccInfo = (id) => {
    _fetchApi(
      `${apiURL()}/supplier/good/info/${id}`,
      (data) => {
        if (data.success) {
          setSupplierAccountInfo(data.results);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };
  return (
    <div>
      {location.pathname.includes("/me/account/purchase/record/table") ? (
        <PurchaseOrderTable
          getPurchaseList={getPurchaseList}
          handleSet={handleSet}
          getRemarkByID={getRemarkByID}
          getSupplierAccInfo={getSupplierAccInfo}
        />
      ) : null}
      
      {location.pathname.includes("/me/account/purchase/record/form") ? (
        <Expenditure
          tableData={tableData}
          additionalExpenses={additionalExp}
          totalAdditionalExp={totalAdditionalExp}
          formTitle={formTitle}
          supplierAccountInfo={supplierAccountInfo}
          getSupplierAccInfo={getSupplierAccInfo}
        />
      ) : null}
      {location.pathname.includes("/me/account/purchase/record/preview") ? (
        <PurchaseOrderForm
          handleTableInputChange={handleTableInputChange}
          onInputChange={onInputChange}
          form={form}
          formTitle={formTitle}
          tableData={tableData}
          remarkData={remarkData}
          gRemarkData={gRemarkData}
        />
      ) : null}
    </div>
  );
}

export default RecordPurchase;
