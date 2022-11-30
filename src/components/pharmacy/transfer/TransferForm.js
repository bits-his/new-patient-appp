import React, { useState, useEffect, useCallback, useRef } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
// import { FiDelete } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
// import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Label,
  Row,
  Table,
  Container,
  Input,
} from "reactstrap";
import { useQuery } from "../../../hooks";
import { apiURL } from "../../../redux/actions";
import { _postApi } from "../../../redux/actions/api";
import {
  getDrugList,
  getPurchaseItem,
  getTotalDrug,
} from "../../../redux/actions/pharmacy";
import { CustomButton } from "../../comp/components";
import SearchFromBranchStore from "../../comp/components/SearchFromBranchStore";
import SimpleInput from "../../comp/components/SimpleInput";
import {
  formatNumber,
  _customNotify,
  _warningNotify,
} from "../../utils/helpers";
import SearchStoresInput from "../components/SearchStoresInput";

function TransferForm({ ref_from, store }) {
  // const ref_from = useRef(null);
  // const user = useSelector((state) => state.auth.activeBusiness.business_name);
  // const ref_to = useRef();
  const ref_item_name = useRef(null);
  const query = useQuery();
  const activeStore = query.get("store");
  const [loading, setLoading] = useState();
  const [arr, setArr] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [form, setForm] = useState({
    storeFrom: store,
    storeTo: "",
    quantity: "",
    item_name: "",
  });
  const dispatch = useDispatch();
  const [forms, setForms] = useState({ from: 0, to: 100 });
  const purchaseItems = useSelector((state) => state.pharmacy.purchaseItems);
  const saleItems = useSelector((state) => state.pharmacy.drugList);

  const _getPurchaseItem = useCallback(() => {
    setLoading(true);
    dispatch(
      getPurchaseItem(form.storeFrom, form.storeTo, store, () => {
        setLoading(false);
        // onFormChange('storeFrom',store)
      })
    );
  }, [dispatch, forms, form, store]);

  useEffect(() => {
    dispatch(getDrugList());
    _getPurchaseItem();
  }, [_getPurchaseItem]);

  useEffect(() => {
    dispatch(getTotalDrug());
  }, [0]);

  const [selectedItem, setSelectedItem] = useState({});
  const handleDelete = (i) => {
    let newVal = arr.filter((item, index) => i !== index);
    setArr(newVal);
  };
  const onFormChange = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
  };
  const history = useHistory();
  // const theme = useSelector((state) => state.auth.activeBusiness);
  const handleReset = () => {
    // ref_from.current.clear();
    ref_item_name.current.clear();
    ref_item_name.current.focus();
    // ref_to.current.clear();
    setForm((p) => ({ ...p, quantity: "" }));
  };
  const handleAdd = () => {
    setLoading(true);
    if (form.item_name === "") {
      _warningNotify("please select item name");
      setLoading(false);
    } else if (form.storeTo === "") {
      _warningNotify("please select select store to");
      setLoading(false);
    } else if (form.quantity > form.balance) {
      _warningNotify("Invalid quantity");
      setLoading(false);
    } else if (form.storeFrom === "") {
      _warningNotify("please select store to");
      setLoading(false);
    } else if (form.quantity === "") {
      _warningNotify("please quantity is required");
      setLoading(false);
    } else if (parseFloat(form.quantity) > parseFloat(selectedItem.quantity)) {
      _warningNotify("Quantity is more than store quantity");
      setLoading(false);
    } else {
      setArr((p) => [...p, form]);
      setLoading(false);
      handleReset();
    }
  };

  const handleSubmit = () => {
    _getPurchaseItem();
    setSubmitLoading(true);
    _postApi(
      `${apiURL()}/account/good/transfer`,
      { data: arr },
      (res) => {
        if (res.status) {
          _customNotify("Successfully Submit");
          setSubmitLoading(false);
          setArr([]);
        }
      },
      (err) => {
        _warningNotify("error occured");
        console.log(err);
        setSubmitLoading(false);
      }
    );
  };
  const handleKeyPress = useCallback(
    (e) => {
      switch (e.key) {
        case "Enter":
          return handleAdd();
        case "F10":
          return handleSubmit();

        default:
          return null;
      }
    },
    [handleAdd]
  );
  useEffect(() => {
    // ref_to.current.setState({ text: user });
  }, [store]);
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <Container>
      {/* {JSON.stringify(form)} */}
      <Card className="border border-dark m-2" style={{ height: "97%" }}>
        <CardHeader
          className="text-black border border-dark d-flex"
          // style={{ backgroundColor: theme.primary_color }}
        >
          <CustomButton
            handleSubmit={() => {
              history.goBack();
            }}
          >
            Back
          </CustomButton>
          <div
            style={{
              marginLeft: "18em",
              marginTop: "0.3em",
              fontWeight: "bold",
            }}
          >
            Transfer Form
          </div>
        </CardHeader>
        <CardBody>
          {/* {JSON.stringify({ saleItems })} */}
          <Row className="m-0">
            <Col md={6}>
              <Label>Transfer From </Label>
              <Input type="readonly" value={store} />
            </Col>
            <Col md={6}>
              <Label>Transfer To</Label>
              <SearchStoresInput
                onChange={(selected) => {
                  setForm((p) => ({ ...p, storeTo: selected.store_name }));
                  // onFormChange("storeTo", selected.store_name);
                  // onFormChange("storeTo", selected.storeName)
                }}
                defaultSelected={[form.storeTo]}
                onInputChange={(v) => v}
                ref_from={ref_from}
                // defaultSelected={[store]}
              />
            </Col>
            <Col md={6}>
              <Label>Select Drug</Label>
              {/* {"balance":16,"price":600,"drug_name":" NaT Clindamycin 300mg 10's",
              "expiry_date":"2025-06-06","selling_price":1000,"supplier_name":"IBS SHUKURA PHARM LTD",
              "insert_date":"2022-10-20T10:49:09.000Z","barcode":"","grn_no":"200"} */}

              <Typeahead
                id="head"
                align="justify"
                clearButton
                labelKey={(item) =>
                  `${item.drug_name} @ NGN ${item.price},  (${item.balance} Avaible)`
                }
                options={saleItems}
                onChange={(val) => {
                  if (val.length) {
                    let selected = val[0];
                    onFormChange("item_name", selected.drug_name);
                    setSelectedItem(selected);
                    // alert(JSON.stringify(selected));
                    setForm((p) => ({
                      ...p,
                      id: selected._id,
                      ...selected,
                      price: parseInt(selected.selling_price),
                      cost: selected.price,
                      markup: selected.markup,
                      quantity: null,
                      storeName: selected.store,
                      supplierName: selected.supplier_name,
                      supplier_code: selected.supplier_code,
                      item_name: selected.drug_name,
                      avaBal: selected.quantity,
                    }));
                    // console.log(selected);
                  }
                }}
                // onInputChange={head => setSubHead(head)}
                // allowNew
                ref={ref_item_name}
              />
              {/* <SearchFromBranchStore
                activeStore={activeStore || "Show All Stores"}
                _ref={ref_item_name}
                onInputChange={(v) => {
                  console.log(v);
                }}
                // label="Select Drug"
                labelkey={(v) => v.length && v.drug_name}
                onChange={(selected) => {
                  onFormChange("drug_name", selected.drug_name);
                  setSelectedItem(selected);
                  // alert(JSON.stringify(selected));
                  setForm((p) => ({
                    ...p,
                    id: selected._id,
                    price: parseInt(selected.selling_price),
                    cost: selected.cost,
                    markup: selected.markup,
                    quantity: 0,
                    expiry_date: selected.expiry_date,
                    storeName: selected.storeName,
                    supplierName: selected.supplierName,
                    supplier_code: selected.supplier_code,
                    item_code: selected.item_code,
                    // ...selected,
                  }));
                }}
              /> */}
            </Col>

            <SimpleInput
              label="Quantity"
              field={{ type: "text", name: "quantity", value: form.quantity }}
              size="6"
              handleChange={({ target: { name, value } }) => {
                setForm((p) => ({ ...p, [name]: value }));
              }}
            />
          </Row>
          <Card className="p-1 px-2 my-1" style={{ borderLeftWidth: 2 }}>
            {/* <div className="row">
              <div className="col-md-6">
                Qtty Available: {selectedItem.quantity}
              </div>
              <div className="col-md-6">Truck No: {selectedItem.truckNo}</div>
              <div className="col-md-6">Waybill: {selectedItem.waybillNo}</div>
              <div className="col-md-6">
                Amount:{" "}
                {formatNumber(
                  parseFloat(selectedItem.quantity) *
                    parseFloat(selectedItem.cost)
                )}
              </div>
              <div className="col-md-6">
                Cost Price: {formatNumber(parseFloat(selectedItem.cost))}
              </div>
              <div className="col-md-6">Total Solid Value</div>
            </div> */}
            <Card
              className="pt-2"
              style={{
                borderLeft: `3px solid #000`,
                borderRight: `3px solid #000`,
              }}
            >
              <Row>
                <Col>
                  <label htmlFor="qtty" className="ml-3">
                    Quantity Available:
                  </label>
                  <label htmlFor="">{selectedItem.avaBal}</label>
                </Col>
                <Col>
                  <label htmlFor="price" className="ml-1">
                    Cost Price:
                  </label>
                  <label htmlFor="">
                    {formatNumber(parseFloat(selectedItem.selling_price))}
                  </label>
                </Col>
                <Col>
                  <label htmlFor="drugName" className="ml-1">
                    Amount:{" "}
                  </label>
                  <label htmlFor="">
                    {formatNumber(
                      parseFloat(form.quantity) *
                        parseFloat(selectedItem.selling_price)
                    )}
                  </label>
                </Col>
              </Row>
            </Card>
          </Card>
          <center className="mt-2">
            <CustomButton color="primary" loading={loading} onClick={handleAdd}>
              Add to List
            </CustomButton>
          </center>
          <Table className="mt-1" bordered>
            <thead>
              <tr>
                <th className="text-center">Del</th>
                <th className="text-center">Item </th>
                <th className="text-center">Qty </th>
                <th className="text-center">Price</th>
                <th className="text-center">Amount</th>
                <th className="text-center">Transfer From</th>
                <th className="text-center">Transfer To</th>
              </tr>
            </thead>
            <tbody>
              {arr.map((item, idx) => (
                <tr key={idx}>
                  <td className="text-center text-danger">
                    <MdDelete
                      size="20"
                      onClick={() => handleDelete(idx)}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                  <td>{item.item_name}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-right">{formatNumber(item.price)}</td>
                  <td className="text-right">
                    {formatNumber(
                      parseInt(item.price) * parseInt(item.quantity)
                    )}
                  </td>
                  <td className="text-center">{item.storeFrom}</td>
                  <td className="text-center">{item.storeTo}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <center>
            <CustomButton
              color="primary"
              loading={submitLoading}
              handleSubmit={handleSubmit}
              disabled={!arr.length ? true : false}
            >
              Submit
            </CustomButton>
          </center>
        </CardBody>
      </Card>
    </Container>
  );
}

export default TransferForm;
