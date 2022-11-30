import React, { useState, useRef, useEffect } from "react";
import {
  FormGroup,
  Row,
  Card,
  CardBody,
  CardHeader,
  Label,
} from "reactstrap";
// import moment from "moment";
import AutoComplete from "../comp/components/AutoComplete";
import TextInput from "../comp/components/TextInput";
import { _getVAT } from "../utils/util";
import ShortcutKeys from "./ShortcutKeys";
import BackButton from "../comp/components/BackButton";
import { _customNotify } from "../utils/helpers";
import { _fetchApi, _postApi } from "../../redux/actions/api";
import { apiURL } from "../../redux/actions";
import CustomButton from "../comp/components/Button";

function StoreManagement() {
  const [loading, setLoading] = useState(false);
  // const date = moment().format("YYYY-MM-DD");
  const [itemType, setItemType] = useState("");
  const [batchCode, setbatchCode] = useState("");
  const [supplier, setSupplier] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [, setQuantityInPack] = useState(1);
  const [, setAmount] = useState(0);
  const [, setVatAmount] = useState(0);
  const [, setTotalAmount] = useState(0);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [supplierList, setSupplierList] = useState([]);
  const [reorderLevel, setReorderLevel] = useState("");
  const supplierRef = useRef();

  useEffect(() => {
    fetchSuppliers();
    // fetchCategory();
  }, []);

  const fetchSuppliers = () => {
    _fetchApi(
      `${apiURL()}/drugs/supplier/all`,
      ({ results }) => {
        if (results) {
          setSupplierList(results);
        }
      },
      (err) => console.log(err)
    );
  };

  const resetForm = () => {
    setItemType("");
    setbatchCode("");
    setSupplier("");
    setAmount(0);
    setTotalAmount(0);
    setInvoiceNo("");
    setPrice(0);
    setQuantity(0);
    setReorderLevel(0);
  };

  //   const submitForm = () => {
  //     if (batchCode === '' || supplier === '') {
  //       toaster.warning('please complete the form');
  //     } else {
  //       let formData = {
  //         date,
  //         batchCode,
  //         itemType,
  //         description,
  //         price,
  //         amount,
  //         quantity,
  //         quantityInPack,
  //         selling_price,
  //         markUp,
  //         deductable,
  //         purchase,
  //         supplier,
  //         invoiceNo,
  //         };
  //       setList([...list, formData]);
  //     }
  //   };

  //   const submit = () => {
  //     toggleLoading(true);
  //     const newList = _convertArrOfObjToArr(list);
  //     const cashtxn1 = [];
  //     const cashtxn2 = [];
  //     const vatTxn1 = [];
  //     const vatTxn2 = [];

  //     list.forEach((item) => {
  //         if (item.deductable === 'yes') {
  //           let deductableVAT = _getVAT(item.amount);
  //           let vatableAmount = parseFloat(item.amount) - deductableVAT;

  //           cashtxn1.push([item.date,item.batchCode,vatableAmount,vatableAmount,'Cash',vatableAmount,item.description,item.invoiceNo,]);
  //           cashtxn2.push([item.date,item.batchCode,'Cash',vatableAmount,vatableAmount,item.purchase,item.supplier,item.batchCode,'Muritala',item.quantity,item.invoiceNo,]);
  //           vatTxn1.push([item.date,'VAT Receivable',deductableVAT,deductableVAT,'Cash',deductableVAT,item.description,item.invoiceNo,]);
  //           vatTxn2.push([item.date,'VAT Receivable','Cash',deductableVAT,deductableVAT,item.purchase,item.supplier,item.batchCode,'Muritala',item.quantity,item.invoiceNo,]);
  //         } else {
  //           cashtxn1.push([item.date,item.batchCode,item.amount,item.amount,'Cash',item.amount,item.description,item.invoiceNo,]);
  //           cashtxn2.push([item.date,item.batchCode,'Cash',item.amount,item.amount,item.purchase,item.supplier,item.batchCode,'Muritala',item.quantity,item.invoiceNo,]);
  //         }
  //     });
  //   };

  const inventoryPost = () => {
    setLoading(true);
    _postApi(
      `${apiURL()}/diagnosis/inventory/new`,
      {
        batchCode: batchCode,
        itemType: itemType,
        supplier: supplier,
        price: price,
        quantity: quantity,
        invoiceNo: invoiceNo,
        reorderLevel: reorderLevel,
      },
      () => {
        setLoading(false);
        _customNotify("Form submit successfully");
        resetForm();
      },
      () => {
        setLoading(false);
      }
    );
  };

  return (
    <>
      <BackButton />
      <Card>
        <CardHeader>
          <ShortcutKeys />
        </CardHeader>
        <CardBody>
          <Row>
            <FormGroup className="col-md-4 col-lg-4">
              <label>Batch Code</label>
              <input
                autoFocus
                type="text"
                onChange={({ target: { value } }) => setbatchCode(value)}
                value={batchCode}
                className="form-control"
                // ref={_item_name}
              />
              {/* <AutoComplete
          required
          label="Item Category"
          labelKey="item_category"
          placeholder="Select Item category"
          name="itemType"
          options={supplierItemCategory}
          onChange={(text) => {
            if (text.length) {
              setItemType(text[0].item_category);
              getItemsByCategory(text[0].item_category);
            }
          }}
          _ref={itemTypeRef}
        /> */}
            </FormGroup>
            {/* {JSON.stringify(pendingItem)} */}
            <FormGroup className="col-md-4 col-lg-4">
              <label>Item Name </label>
              <input
                type="text"
                onChange={({ target: { value } }) => setItemType(value)}
                value={itemType}
                className="form-control"
                // ref={_item_type}
              />
              {/* <AutoComplete
                required
                label="Item Code"
                type="text"
                name="itemType"
                placeholder="Select Item Code"
                emptyLabel="select item category"
                labelKey={(item) => `${item.description}(${item.item_code})`}
                _ref={itemCodeRef}
                id="itemType"
                options={pendingItem}
                onChange={(text) => {
                  if (text.length) {
                    setItemCode(text[0].item_code);
                    fetchSuppliers(text[0].item_code);
                  }
                }}
              /> */}
            </FormGroup>
            {/* {JSON.stringify(pendingItem)} */}
            <FormGroup className="col-md-4 col-lg-4">
              {/* <label>Supplier</label>
           <input
            type="text"
            onChange={({ target: { value } }) => setSupplier(value)}
            value={supplier}
            className="form-control"
          /> */}
              {/* {JSON.stringify(supplierList)} */}
              <AutoComplete
                required
                label="Supplier"
                type="text"
                name="itemType"
                placeholder="Select Supplier "
                emptyLabel="please select item code"
                _ref={supplierRef}
                // id="itemType"
                labelKey={(item) => `${item.supplier_name} `}
                options={supplierList}
                onInputChange={(value) => setSupplier(value)}
                onChange={(text) => {
                  if (text.length) {
                    setSupplier(text[0].name);
                  }
                }}
              />
            </FormGroup>
          </Row>
          <Row>
            {/* <FormGroup className="col-md-4 col-lg-4">
          <label>Description (optional)</label>
          <input
            type="text"
            onChange={({ target: { value } }) => setDescription(value)}
            value={description}
            className="form-control"
          />
        </FormGroup> */}

            {/* <FormGroup className="col-md-4 col-lg-4">
        <label>Unit of Measurement</label>
        <input
          type="text"
          onChange={({ target: { value } }) => setMeasurement(value)}
          value={measurement}
          className="form-control"
        /> */}
            {/* <AutoComplete
          required
          label="Unit of Measurement"
          name="itemType"
          placeholder="Select Item Code"
          labelKey={(item) =>
            `${item.unit_of_measurement}(${item.unit}/${item.per})`
          }
          _ref={unitOfMeasurementRef}
          id="itemType"
          options={unitOfMeasurement}
          onChange={(text) => {
            if (text.length) {
              setMeasurement(text[0].unit_of_measurement);
            }
          }}
        /> */}
            {/* </FormGroup> */}

            {/* <FormGroup className="col-md-4 col-lg-4">
        <TextInput
          label="Unit Rate"
          onChange={({ target: { value } }) => setUnitRate(value)}
          value={unitRate}
        />
      </FormGroup> */}

            <FormGroup className="col-md-4 col-lg-4">
              <Label>Price</Label>
              <TextInput
                type="number"
                label="Price"
                onChange={({ target: { value } }) => {
                  setPrice(value);
                }}
                value={price}
              />
            </FormGroup>

            <FormGroup className="col-md-4 col-lg-4">
              <Label>Quantity</Label>
              <TextInput
                label="Quantity"
                onChange={({ target: { value } }) => {
                  let amt = parseInt(price) * parseInt(value);
                  let totalamt = parseInt(amt) + _getVAT(amt);
                  setQuantity(value);
                  setQuantityInPack(value);
                  setAmount(amt);
                  setVatAmount(_getVAT(amt));
                  setTotalAmount(totalamt);
                }}
                value={quantity}
              />
            </FormGroup>
            <FormGroup className="col-md-4 col-lg-4">
              <Label>Invoice Number</Label>
              <TextInput
                label="Invoice Number (Optional)"
                onChange={({ target: { value } }) => setInvoiceNo(value)}
                value={invoiceNo}
                placeholder="Enter the invoice number"
              />
            </FormGroup>
          </Row>
          <Row>
            <FormGroup className="col-md-4 col-lg-4">
              <Label>Re-order Level</Label>
              <TextInput
                label="Re-order Level"
                onChange={({ target: { value } }) => setReorderLevel(value)}
                value={reorderLevel}
                type="number"
                placeholder="Enter the amount"
              />
            </FormGroup>
            {/* <FormGroup className="col-md-4 col-lg-4"> */}
            {/* <label>Quantity in pack</label>
          <input
            type="text"
            onChange={({ target: { value } }) => {
              let amt = parseInt(price) / parseInt(value);
              setQuantityInPack(value);
              setSelling_price(amt);
              setMarkUp((parseInt(value) * parseInt(selling_price)) / 100);
            }}
            value={quantityInPack}
            className="form-control"
          /> */}
            {/* <AutoComplete
          required
          label="Item Code"
          type="text"
          name="itemType"
          placeholder="Select Item Code"
          emptyLabel="select item category"
          labelKey={(item) => `${item.description}(${item.item_code})`}
          _ref={itemCodeRef}
          id="itemType"
          options={pendingItem}
          onChange={(text) => {
            if (text.length) {
              setItemCode(text[0].item_code);
              fetchSuppliers(text[0].item_code);
            }
          }}
        /> */}
            {/* </FormGroup> */}
          </Row>
          <center>
            {" "}
            <CustomButton loading={loading} onClick={inventoryPost}>
              Submit
            </CustomButton>{" "}
          </center>
        </CardBody>
      </Card>
    </>
  );
}

export default StoreManagement;
