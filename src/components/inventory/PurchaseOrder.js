import React, { useEffect, useState, useRef, useCallback } from "react";
import { useHistory, useLocation } from "react-router";
import { Button } from "reactstrap";
import { apiURL } from "../../redux/actions";
import {
  _fetchApi,
  _fetchApiGeneral,
  _postApi,
  _updateApi,
} from "../../redux/actions/api";
// import { newEvent, socket } from "../utils/notification-helper";

import {
  formatNumber,
  today,
  _customNotify,
  _warningNotify,
  // _convertArrOfObjToArr,
} from "../utils/helpers";

import moment from "moment";
import PurchaseOrderForm from "./purchase-order/PurchaseOrderForm";
import PurchaseOrderTable from "./PurchaseOrderTable";
import { useDispatch, useSelector } from "react-redux";
import { getAllSuppliers } from "../../redux/actions/pharmacy";

const PurchaseOrder = () => {
  const Ref = useRef();

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
    identifier: "new",
    remark: "",
    auditor_remark: "",
    item_category: "",
    from: moment(today)
      .subtract(2, "weeks")
      .format("YYYY-MM-DD"),
    to: today,
    expired_status: "",
  };
  const [form, setForm] = useState(formData);
  const [toggle, setToggle] = useState(false);
  const [formTitle, setFormTitle] = useState({
    PONo: "",
    date: moment().format("YYYY-MM-DD"),
    type: "Local",
    vendor: "",
    client: "",
    general_remark: "",
    auditor_remark: "",
    exchange_rate: form.exchange_rate,
    exchange_type: form.exchange_type,
    supplier_code: "",
  });
  const [remarksID, setRemarksID] = useState("");
  const dispatch = useDispatch();
  const supplier = useSelector((state) => state.pharmacy.suppliers);

  const setTypeahead = () => {
    Ref.current.clear();
  };
  const setTypeFocus = () => {
    Ref.current.focus();
  };
  const handleSet = (item) => {
    setFormTitle({
      PONo: item.po_id,
      date: item.date,
      type: item.type,
      vendor: item.vendor,
      client: item.client,
      auditor_remark: item.auditor_remark,
      exchange_rate: item.exchange_rate,
      exchange_type: item.exchange_type,
      supplier_code: item.supplier_code,
    });
  };
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [getAllPurchase, setGetAllPurchase] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [items, setItems] = useState([]);

  const facilityId = useSelector((state) => state.facility.info.facility_id);
  const user = useSelector((state) => state.auth.user.username);

  const [newExpenses, setNewExpense] = useState([]);

  const getNextRemarksID = () => {
    _fetchApi(
      `${apiURL()}/account/get/next-id/remarks`,
      (data) => {
        // console.log(data);
        setRemarksID(data.results[0].remarks_id);
      },
      (err) => {
        // console.log(err);
      }
    );
  };
  const [list, setList] = useState([]);

  const handleTablechange = (name, value, index) => {
    console.log(name, value, index);
    let arr = [];
    list.forEach((item, i) => {
      if (index === i) {
        arr.push({
          ...item,
          [name]: value,
        });
      } else {
        arr.push(item);
      }
    });
    setList(arr);
  };

  const getOtherExpenses = (poID) => {
    _fetchApi(
      `${apiURL()}/drugs/get/other/expenses/${poID}`,
      (data) => {
        if (data.results) {
          let newData = [];
          data.results.forEach((item) => {
            if (item.amount !== "" && item.description !== "") {
              newData.push(item);
            }
          });
          setList(newData);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const handleReset = () => {
    setForm((p) => ({
      ...p,
      ...formData,
      item_category: form.item_category,
      exchange_rate: form.exchange_rate,
      exchange_type: form.exchange_type,
    }));
  };
  const getPurchaseList = (id) => {
    _fetchApi(
      `${apiURL()}/get/purchase/order/list/${id}`,
      (data) => {
        // console.log(data);
        let arr = [];

        data.results.forEach((item) => {
          arr.push({ ...item, propose: item.price * item.propose_quantity });
        });
        setTableData(arr);
      },
      (err) => {
        // console.log(err);
      }
    );
  };

  const getSupplier = () => {
    _fetchApi(
      `${apiURL()}/drugs/supplier/all`,
      (data) => {
        setSupplierList(data.results);
      },
      (err) => {
        // console.log(err);
      }
    );
  };
  const getAllItems = () => {
    const subhead = 10000;
    _fetchApi(
      `${apiURL()}/get/all/items_list/${subhead}`,
      (data) => {
        setItems(data.results);
      },
      (err) => {
        // console.log(err);
      }
    );
  };

  const getAllPurchases = useCallback(
    () => {
      _fetchApiGeneral(
        `${apiURL()}/purchase-order/pending?query_type=all&from_date=${
          form.from
        }&to_date=${form.to}`,
        (data) => {
          setLoading(false);
          if (data.results) {
            setGetAllPurchase(data.results);
            // console.log(data.results);
          }
        },
        (err) => {
          setLoading(false);
          // console.log(err);
        }
      );
    },
    [form.from, form.to]
  );

  const handlePQtychange = (name, value, index) => {
    let arr = [];
    tableData.forEach((item, i) => {
      if (index === i) {
        arr.push({
          ...item,
          [name]: value,
          // amount: parseInt(item.price) * parseInt(value),
          propose_amount:
            item.type === "Local"
              ? parseInt(value) * parseInt(item.price)
              : parseInt(item.price) *
                parseInt(item.exchange_rate) *
                parseInt(value),
        });
      } else {
        arr.push(item);
      }
    });
    setTableData(arr);
  };

  const handlePriceChange = (name, value, index) => {
    // console.log(name, value, index);
    let arr = [];
    tableData.forEach((item, i) => {
      if (index === i) {
        arr.push({
          ...item,
          [name]: value,
          // amount: parseInt(item.price) * parseInt(item.propose_quantity),
          propose_amount:
            item.type === "Local"
              ? parseInt(item.propose_quantity) * parseInt(value)
              : parseInt(value) *
                parseInt(item.exchange_rate) *
                parseInt(item.propose_quantity),
        });
      } else {
        arr.push(item);
      }
    });
    setTableData(arr);
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

  const handleDelete = (i) => {
    let table = tableData.filter((item, index) => i !== index);
    // let arr=[]
    // table.forEach((item)=>{
    //   arr.push({  ...item,amount:item.proposed_quantity*item.price})
    // })
    setTableData(table);
  };

  // const getNextID = () => {
  //   let po = "po";
  //   _fetchApi(
  //     `${apiURL()}/get/number/generator/${po}`,
  //     (data) => {
  // console.log(data);
  //       setFormTitle((prev) => ({
  //         ...prev,
  //         PONo: data.results.po_id,
  //       }));
  //     },
  //     (err) => {
  // console.log(err);
  //     }
  //   );
  // };

  // alert(remarksID)

  const addNewExpenses = () => {
    setNewExpense((prev) => [
      ...prev,
      {
        description: "",
        expenses_amnt: 0,
        PONo: formTitle.PONo,
      },
    ]);
  };
  useEffect(
    () => {
      // socket.on("new_purchase_order_update", (payload) => {
      //   console.log("New Purchase Order Recorded", payload);
      //   // getAllPurchases();
      // });
      // getNextID();
      getAllPurchases();
      getSupplier();
      getAllItems();
      getNextRemarksID();
      dispatch(getAllSuppliers());

      // return () => socket.disconnect();
    },
    [getAllPurchases]
  );

  useEffect(
    () => {
      setNewExpense((prev) => [
        {
          description: "",
          expenses_amnt: 0,
          PONo: formTitle.PONo,
          trans_date: moment().format("YYYY/MM/DD"),
        },
      ]);
    },
    [formTitle.PONo]
  );

  const handleExpInputChange = (name, value, index) => {
    let arr = [];
    newExpenses.forEach((item, i) => {
      if (index === i) {
        arr.push({
          ...item,
          [name]: value,
        });
      } else {
        arr.push(item);
      }
    });
    setNewExpense(arr);
  };

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormTitle((prev) => ({ ...prev, [name]: value }));
  };

  const submitAdditionalExpenses = (PONo) => {
    let date_now = moment().format("YYYY/MM/DD");
    for (let i = 0; i < newExpenses.length; i++) {
      const element = {
        ...newExpenses[i],
        PONo: PONo ? PONo : newExpenses[i].PONo,
        trans_date: date_now,
      };
      // console.log(element, PONo)
      _postApi(
        `${apiURL()}/account/add-new/addition_expenses`,
        element,
        {},
        (err) => {
          // console.log(err);
          // _warningNotify("Error Occur");
        }
      );
    }
  };

  const handleSubmitRemarks = (remarks_by) => {
    const callBack = (res) => {
      // console.log(res);
    };
    const error = (err) => {
      //  _warningNotify("Error Occur");
      // console.log(err);
    };

    const data = [];
    tableData.forEach((item) => {
      data.push({
        remarks_id: item.remarks_id,
        request_no: item.po_id,
        remarks: item.remarks,
        remarks_by,
        date: item.date,
        general_remarks: "",
        facilityId,
      });
    });
    for (let i = 0; i < data.length; i++) {
      const element = data[i];

      _postApi(
        `${apiURL()}/account/add-new/expenses-remarks`,
        element,
        callBack,
        error
      );
    }
  };
  const handleAdd = () => {
    if (
      form.unit_price === "" ||
      form.proposed_quantity === "" ||
      form.item_name
    ) {
      setTableData((prev) => [
        ...prev,
        {
          exchange_rate: form.exchange_rate,
          item_name: form.item_name,
          specification: form.specification,
          quantity_available: form.quantity_available,
          propose_quantity: form.propose_quantity,
          price: form.price,
          propose_amount:
            formTitle.type === "Local"
              ? parseInt(form.propose_quantity) * parseInt(form.price)
              : parseInt(form.price) *
                parseInt(form.exchange_rate) *
                parseInt(form.propose_quantity),
          status: form.status,
          exchange_type: form.exchange_type,
          po_id: formTitle.PONo,
          type: formTitle.type,
          identifier: form.identifier,
          remarks: form.remark,
          remarks_id: remarksID + tableData.length,
          item_category: form.item_category,
          expired_status: form.expired_status,
        },
      ]);

      handleReset();
      setTypeahead();
      setTypeFocus();
    } else {
      _warningNotify("please complete the form");
    }
  };
  // alert(remarksID)
  const handleSubmit = () => {
    setLoading(true);

    let data = {
      formTitle: {
        ...formTitle,
        process_by: user,
        total: tableData.reduce((a, b) => a + parseFloat(b.propose_amount), 0),
      },
      tableData,
      facilityId,
      userId: user,
    };

    fetch(`${apiURL()}/account/add/purchase-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((raw) => raw.json())
      .then((resp) => {
        // newEvent("db-update:purchase-order", "WELLOLO");
        submitAdditionalExpenses(resp.PONo);
        _customNotify("Purchase Order sent successfully!");
        getAllPurchases();
        history.push("/me/new_inventory/purchase_order");
        setLoading(false);
        setTableData([]);
        handleSubmitRemarks("Initiator");
      })
      .catch((err) => setLoading(false));
    // _postApi(`${apiURL()}/account/add/purchase-order`, data, callBack, error);
  };

  const onInputChange = ({ target: { name, value } }) => {
    setFormTitle((prev) => ({ ...prev, [name]: value }));
  };
  const _setForm = (prev) => {
    setForm(prev);
  };
  const getSpecification = (item_name) => {
    _fetchApi(
      `${apiURL()}/account/specification/${item_name}`,
      (data) => {
        if (data.success) {
          let value = data.results.specification;
          setForm((prev) => ({ ...prev, specification: value }));
        }
      },
      (err) => {
        // console.log(err);
      }
    );
  };
  const handleUpdate = () => {
    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      _updateApi(
        `${apiURL()}/account/update/other-expenses/${element.id}/${
          element.PONo
        }`,
        element,
        () => {},
        (err) => {
          setLoading(false);
          _warningNotify("Error Occur during updating the client");
        }
      );
    }
    const callBack = () => {
      setLoading(false);
      _customNotify("Purchase Order Updated successfully!");
      getAllPurchases();
      history.push("/me/new_inventory/purchase_order");
      setTableData([]);
      submitAdditionalExpenses();
    };
    const error = () => {
      _warningNotify("Error Occur");
      setLoading(false);
    };
    let data = {
      po_no: formTitle.PONo,
      tableData,
      status: "Pending",
      exchange_rate: formTitle.exchange_rate,
      total: formatNumber(
        tableData.reduce((a, b) => parseInt(a) + parseInt(b.propose_amount), 0)
      ),
    };
    _postApi(`${apiURL()}/update/purchase/to/pending`, data, callBack, error);
  };
  const location = useLocation();
  const history = useHistory();
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
        // console.log(err);
      }
    );
  };

  return (
    <>
    {/* {JSON.stringify(getAllPurchase)} */}
      {location.pathname === "/me/new_inventory/purchase_order" ? (
        <Button
          className="mb-2"
          color="success"
          onClick={() => history.push("/me/new_inventory/purchase_order/form")}
        >
          Add New Purchase Order
        </Button>
      ) : null}
      {location.pathname === "/me/new_inventory/purchase_order" ? (
        <>
          <PurchaseOrderTable
            getAllPurchase={getAllPurchase}
            handleSet={handleSet}
            getPurchaseList={getPurchaseList}
            getRemarkByID={getRemarkByID}
            form={form}
            handleChange={handleChange}
          />
        </>
      ) : null}
      {location.pathname.includes("/me/new_inventory/purchase_order/form") ? (
        <>
          {/* {JSON.stringify(user.)} */}
          <PurchaseOrderForm
            items={items}
            suppliers={supplier}
            handleTableInputChange={handleTableInputChange}
            type={formTitle.type}
            handleDelete={handleDelete}
            typeRef={Ref}
            onInputChange={onInputChange}
            setFormTitle={setFormTitle}
            form={form}
            formTitle={formTitle}
            handleAdd={handleAdd}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setForm={_setForm}
            tableData={tableData}
            loading={loading}
            supplierList={supplierList}
            remarkData={remarkData}
            gRemarkData={gRemarkData}
            getSpecification={getSpecification}
            newExpenses={newExpenses}
            addNewExpenses={addNewExpenses}
            handleExpInputChange={handleExpInputChange}
          />
        </>
      ) : null}
      {location.pathname.includes("/me/new_inventory/purchase_order/edit") ? (
        <>
          <PurchaseOrderForm
            items={items}
            suppliers={supplier}
            handleTableInputChange={handleTableInputChange}
            handleDelete={handleDelete}
            handleUpdate={handleUpdate}
            handlePriceChange={handlePriceChange}
            handlePQtychange={handlePQtychange}
            onInputChange={onInputChange}
            setFormTitle={setFormTitle}
            typeRef={Ref}
            form={form}
            formTitle={formTitle}
            getSpecification={getSpecification}
            handleAdd={handleAdd}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setForm={_setForm}
            tableData={tableData}
            loading={loading}
            supplierList={supplierList}
            toggle={toggle}
            setTableData={setTableData}
            setToggle={setToggle}
            remarkData={remarkData}
            gRemarkData={gRemarkData}
            newExpenses={newExpenses}
            addNewExpenses={addNewExpenses}
            handleExpInputChange={handleExpInputChange}
            list={list}
            handleTablechange={handleTablechange}
            getOtherExpenses={getOtherExpenses}
          />
        </>
      ) : null}
      {location.pathname.includes(
        "/me/new_inventory/purchase_order/preview"
      ) ? (
        <>
          <PurchaseOrderForm
            items={items}
            suppliers={supplier}
            handleTableInputChange={handleTableInputChange}
            setFormTitle={setFormTitle}
            form={form}
            formTitle={formTitle}
            handleAdd={handleAdd}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setForm={_setForm}
            tableData={tableData}
            loading={loading}
            supplierList={supplierList}
            remarkData={remarkData}
            gRemarkData={gRemarkData}
            newExpenses={newExpenses}
            addNewExpenses={addNewExpenses}
            handleExpInputChange={handleExpInputChange}
          />
        </>
      ) : null}
      {location.pathname.includes("/me/reviewer/purchase") ? (
        <>
          <PurchaseOrderForm
            items={items}
            suppliers={supplier}
            handleTableInputChange={handleTableInputChange}
            setFormTitle={setFormTitle}
            form={form}
            formTitle={formTitle}
            handleAdd={handleAdd}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setForm={_setForm}
            tableData={tableData}
            loading={loading}
            supplierList={supplierList}
            newExpenses={newExpenses}
            addNewExpenses={addNewExpenses}
            handleExpInputChange={handleExpInputChange}
          />
        </>
      ) : null}
      {/* {JSON.stringify(tableData)} */}
    </>
  );
};

export default PurchaseOrder;
